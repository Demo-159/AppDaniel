#!/usr/bin/env python3
"""Construye sesiones con tutor a partir de tools/sesiones/specs/<id>.json.

Especificación (resumen):
{
 "id": "c1s5", "titulo": "...", "icono": "🚶", "minutos": 3,
 "pasos": [
   {"voz": "frase", "escena": {"tipo": "cifra", ...}, "dato": "c1-27"},      # dato(s) del libro que enseña
   {"voz": "pregunta", "elige": {"pregunta": "...", "opciones": ["correcta", ...], "bien": "frase", "mal": "frase"}},
   {"voz": "instrucción", "desliza": {"escena": "peaton", "min": 30, "max": 70, "paso": 5, "desde": 30, "hasta": 65}}
 ]
}
Escenas: titulo, tarjeta, cifra, barras, iconos, lista, vs, imagen, peaton (ver engine.html).

Reglas que se verifican (falla si no se cumplen):
 - Cada dato del libro asignado a la sesión (tools/cobertura/datos) aparece en algún paso ("dato").
 - La voz nunca dice "km/h" (siempre "kilómetros por hora") ni empieza con muletillas.
Con --revisar-voz se comprueba además con un reconocedor que cada audio suene en español.

Uso: python build.py c1s1 [c1s2 ...] | --capitulo 1   [--revisar-voz]
Salida: tools/sesiones/dist/<id>.html (página autónoma con audio e imágenes incrustadas).
"""
import base64, glob, hashlib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, ".cache"); DIST = os.path.join(HERE, "dist")
VOICE = "it-IT-GiuseppeMultilingualNeural"
FILLERS = ("bueno,", "a ver,", "mira,", "mira:", "oye,", "oye:")
TTS = os.environ.get("EDGE_TTS", "edge-tts")

def datos_por_sesion():
    out = {}
    for f in glob.glob(os.path.join(ROOT, "tools/cobertura/datos/capitulo-*.json")):
        for x in json.load(open(f, encoding="utf-8"))["datos"]:
            out.setdefault(x["s"], []).append(x)
    return out

def textos(spec):
    for p in spec["pasos"]:
        if p.get("voz"): yield p["voz"]
        e = p.get("elige") or {}
        for k in ("bien", "mal"):
            if e.get(k): yield e[k]

def reglas(spec, datos):
    err = []
    for t in textos(spec):
        if "km/h" in t: err.append(f"la voz dice 'km/h': {t[:60]}")
        if t.strip().lower().startswith(FILLERS): err.append(f"muletilla al inicio: {t[:60]}")
    usados = set()
    for p in spec["pasos"]:
        d = p.get("dato"); usados |= set(d if isinstance(d, list) else [d] if d else [])
    faltan = [x["id"] for x in datos if x["id"] not in usados]
    if faltan: err.append(f"datos del libro sin enseñar: {', '.join(faltan)}")
    otros = usados - {x["id"] for x in datos}
    if otros: err.append(f"datos que no son de esta sesión: {', '.join(sorted(otros))}")
    return err

def audio(text):
    os.makedirs(CACHE, exist_ok=True)
    h = hashlib.sha1((VOICE + "|v2|" + text).encode()).hexdigest()[:16]
    out = os.path.join(CACHE, h + ".mp3")
    if not os.path.exists(out):
        raw = out + ".raw.mp3"
        cmd = [TTS, "--voice", VOICE, "--rate=+10%", "--pitch=+3Hz", "--text", text, "--write-media", raw]
        if os.environ.get("HTTPS_PROXY"): cmd[1:1] = ["--proxy", os.environ["HTTPS_PROXY"]]
        subprocess.run(cmd, check=True, capture_output=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
                        "silenceremove=start_periods=1:start_threshold=-45dB,highpass=f=90,equalizer=f=3200:t=q:w=1:g=3,"
                        "acompressor=threshold=-18dB:ratio=3,atempo=0.89", "-ac", "1", "-b:a", "48k", out], check=True)
        os.remove(raw)
    return out

_model = None
def revisar(path, text):
    """Devuelve (probabilidad de español, tasa de error de palabras)."""
    global _model
    import numpy as np
    from faster_whisper import WhisperModel
    from num2words import num2words
    import unicodedata
    if _model is None: _model = WhisperModel("base", device="cpu", compute_type="int8")
    def norm(s):
        s = re.sub(r"\d+", lambda m: " " + num2words(int(m.group()), lang="es") + " ", s.replace(".", "").replace("%", " por ciento"))
        s = s.replace("setecientas", "setecientos").replace("doscientas", "doscientos").replace("cuatrocientas", "cuatrocientos")
        s = "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")
        return re.findall(r"[a-zñ]+", s)
    pcm = subprocess.check_output(["ffmpeg", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"])
    x = np.frombuffer(pcm, np.float32)
    segs, info = _model.transcribe(x, beam_size=1)
    es = dict(info.all_language_probs).get("es", 0)
    a, b = norm(text), norm(" ".join(s.text for s in segs))
    d = list(range(len(b) + 1))
    for i, w in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, v in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (w != v))
    return es, d[len(b)] / max(1, len(a))

def b64(path, mime): return f"data:{mime};base64," + base64.b64encode(open(path, "rb").read()).decode()

def build(sid, check):
    spec = json.load(open(os.path.join(HERE, "specs", sid + ".json"), encoding="utf-8"))
    datos = datos_por_sesion().get(sid, [])
    err = reglas(spec, datos)
    if err: print(f"✗ {sid}:\n  " + "\n  ".join(err)); return False
    aud, txt, malas = {}, {}, []
    for t in dict.fromkeys(textos(spec)):
        key = "a" + hashlib.sha1(t.encode()).hexdigest()[:8]
        path = audio(t); aud[key] = b64(path, "audio/mpeg"); txt[key] = t
        if check:
            es, wer = revisar(path, t)
            if es < 0.93 or wer > 0.35: malas.append(f"{es:.2f} es · {wer:.2f} error · {t}")
    keyof = lambda t: "a" + hashlib.sha1(t.encode()).hexdigest()[:8] if t else None
    pasos = []
    for p in spec["pasos"]:
        q = dict(p); q["voz"] = keyof(p.get("voz"))
        if "elige" in p:
            q["elige"] = dict(p["elige"], bien=keyof(p["elige"].get("bien")), mal=keyof(p["elige"].get("mal")))
        pasos.append(q)
    imgs = {}
    for p in spec["pasos"]:
        src = (p.get("escena") or {}).get("src")
        if src: imgs[src] = b64(os.path.join(ROOT, "app/src/main/assets", src), "image/webp")
    S = {"id": sid, "titulo": spec["titulo"], "icono": spec.get("icono"), "minutos": spec.get("minutos", 3),
         "pasos": pasos, "audio": aud, "textos": txt, "imagenes": imgs}
    html = open(os.path.join(HERE, "engine.html"), encoding="utf-8").read()
    esc = "\n".join(open(f, encoding="utf-8").read() for f in sorted(glob.glob(os.path.join(HERE, "escenas", "*.js"))))
    html = html.replace("/*ESCENAS*/", esc, 1)
    html = html.replace("<script>\nconst S=window.SESSION", "<script>window.SESSION=" + json.dumps(S, ensure_ascii=False) + ";</script>\n<script>\nconst S=window.SESSION", 1)
    os.makedirs(DIST, exist_ok=True)
    open(os.path.join(DIST, sid + ".html"), "w", encoding="utf-8").write(html)
    print(f"✓ {sid}: {len(pasos)} pasos, {len(aud)} audios, {len(datos)} datos del libro")
    for m in malas: print("  ⚠ voz:", m)
    return not malas

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--capitulo" in sys.argv:
        n = sys.argv[sys.argv.index("--capitulo") + 1]; args = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(HERE, f"specs/c{n}s*.json")))
        args = [a for a in args if a != n]
    ok = all([build(s, "--revisar-voz" in sys.argv) for s in args])
    sys.exit(0 if ok else 1)
