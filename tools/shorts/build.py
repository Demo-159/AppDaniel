"""Genera la línea de tiempo y el audio de un short a partir del contenido de Ruta B.
Uso: build.py <unidad> <lección> <voz> <carpeta_salida>
"""
import json, os, re, subprocess, sys, wave

HERE = os.path.dirname(os.path.abspath(__file__))
PIPER = os.environ.get("PIPER", "piper")
CONTENT = os.path.join(HERE, "..", "..", "app", "src", "main", "assets", "content.json")
FPS = 30

unit_id, lesson, voice, out = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
os.makedirs(out, exist_ok=True)
d = json.load(open(CONTENT))
unit = next(u for u in d["units"] if u["id"] == unit_id)
caps = unit["capsules"][lesson]

# Pregunta gancho: la primera de opción múltiple de la lección con respuesta corta.
qs = [q for q in d["questions"] if q["unit"] == unit_id and q["lesson"] == lesson and q["type"] in ("mc", "sign")]
hook = next((q for q in qs if len(q["options"][0]) <= 60 and len(q["prompt"]) <= 110), qs[0])
prompt = hook["prompt"].replace("…", "...")
answer = hook["options"][0]


def speakable(s: str) -> str:
    s = s.replace("km/h", " kilómetros por hora").replace("g/l", " gramos por litro").replace("%", " por ciento")
    s = s.replace("…", ".").replace("...", ".").replace("“", "").replace("”", "").replace("SOAP", "Soap")
    s = re.sub(r"(\d)\.(\d{3})", r"\1\2", s)
    return s


scenes = [{"kind": "hook", "h": prompt, "say": "Pregunta rápida. " + prompt, "v": ""}]
for sc in caps:
    scenes.append({"kind": "fact", "h": sc["h"], "say": sc["t"], "v": sc["v"]})
scenes.append({"kind": "reveal", "h": answer, "say": "La respuesta es: " + answer + ".", "v": ""})
scenes.append({"kind": "outro", "h": "¡Ahora te toca a ti!", "say": "¿Te quedó claro? Ahora ponlo a prueba en Ruta B.", "v": ""})

t = 0.0
for i, s in enumerate(scenes):
    wav = os.path.join(out, f"v{i}.wav")
    subprocess.run([PIPER, "-m", voice, "-f", wav, "--length-scale", "0.9", "--sentence-silence", "0.1"],
                   input=speakable(s["say"]).encode(), check=True, capture_output=True)
    with wave.open(wav) as w:
        dur = w.getnframes() / w.getframerate()
    lead = 0.4
    tail = 1.6 if s["kind"] == "hook" else (0.9 if s["kind"] in ("reveal", "outro") else 0.45)
    s.update(start=round(t, 3), speechStart=round(t + lead, 3), speechEnd=round(t + lead + dur, 3), wav=wav)
    s["end"] = round(t + lead + dur + tail, 3)
    # Tiempos por palabra, proporcionales a la longitud (del texto que se muestra).
    shown = s["say"]
    words = shown.split()
    total_chars = sum(len(w) + 1 for w in words)
    acc, ws = 0, []
    for w in words:
        ws.append({"w": w, "t0": round(t + lead + dur * acc / total_chars - 0.05, 3)})
        acc += len(w) + 1
    s["words"] = ws
    # Grupos de subtítulos: hasta 3 palabras o ~18 caracteres, cortando en puntuación.
    chunks, a, n = [], 0, 0
    for k, w in enumerate(words):
        n += len(w) + 1
        if k - a >= 2 or n >= 18 or re.search(r"[.,:;!?]$", w) or k == len(words) - 1:
            chunks.append([a, k]); a, n = k + 1, 0
    s["chunks"] = chunks
    t = s["end"]
total = round(t, 3)

# Audio: voz + whoosh en cada transición + pop en revelación + música suave.
sfx = os.path.join(out, "sfx")
os.makedirs(sfx, exist_ok=True)
def ff(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)
ff("-f", "lavfi", "-i", "anoisesrc=d=0.45:c=pink:a=0.6", "-af",
   "highpass=f=500,lowpass=f=5000,afade=t=in:d=0.18,afade=t=out:st=0.2:d=0.25,volume=0.35", "-ar", "22050", os.path.join(sfx, "whoosh.wav"))
ff("-f", "lavfi", "-i", "sine=f=660:d=0.18", "-f", "lavfi", "-i", "sine=f=990:d=0.18", "-filter_complex",
   "[0][1]amix=2,afade=t=out:st=0.04:d=0.14,volume=0.6", "-ar", "22050", os.path.join(sfx, "pop.wav"))
chords = [(261.6, 329.6, 392.0), (220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (196.0, 246.9, 293.7)]
expr = []
for k, (a, b, c) in enumerate(chords):
    gate = f"between(mod(t,8),{2*k},{2*k+2})"
    expr.append(f"{gate}*(sin(2*PI*{a}*t)+sin(2*PI*{b}*t)+0.7*sin(2*PI*{c}*t)+0.5*sin(2*PI*{a/2}*t))")
pad = "0.05*(" + "+".join(expr) + ")*(0.75+0.25*sin(2*PI*2*t))"
ff("-f", "lavfi", "-i", f"aevalsrc='{pad}':s=22050:d={total}", "-af",
   f"lowpass=f=1400,afade=t=in:d=1.5,afade=t=out:st={max(0, total-1.5)}:d=1.5", os.path.join(sfx, "music.wav"))

inputs, filters, labels = [], [], []
def add(path, at, vol=1.0):
    idx = len(inputs) // 2
    inputs.extend(["-i", path])
    ms = int(at * 1000)
    filters.append(f"[{idx}]adelay={ms}|{ms},volume={vol}[a{idx}]")
    labels.append(f"[a{idx}]")
add(os.path.join(sfx, "music.wav"), 0, 1.0)
for i, s in enumerate(scenes):
    add(s["wav"], s["speechStart"], 1.0)
    if i > 0:
        add(os.path.join(sfx, "whoosh.wav"), max(0, s["start"] - 0.12), 1.0)
    if s["kind"] in ("reveal", "fact"):
        add(os.path.join(sfx, "pop.wav"), s["start"] + (0.7 if s["kind"] == "reveal" else 0.3), 0.8 if s["kind"] == "reveal" else 0.35)
filters.append("".join(labels) + f"amix=inputs={len(labels)}:normalize=0,atrim=0:{total},loudnorm=I=-16:TP=-1.5[out]")
ff(*inputs, "-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "44100", "-ac", "2", os.path.join(out, "audio.wav"))

for s in scenes:
    s.pop("wav", None)
json.dump({"color": unit["color"], "unitTitle": unit["title"], "lessonTitle": unit["lessons"][lesson],
           "scenes": scenes, "total": total, "fps": FPS}, open(os.path.join(out, "timeline.json"), "w"), ensure_ascii=False)
print(f"{unit_id}:{lesson} {total:.1f}s {len(scenes)} escenas")
