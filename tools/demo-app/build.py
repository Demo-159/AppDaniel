#!/usr/bin/env python3
"""Página principal de la app (diseño aprobado): mapa-camino con los 12 capítulos del libro, sesiones con tutor
(donde existen) o lectura de las citas del libro, práctica, repaso ⛽, prueba de capítulo 🏁 y simulacro 🏆
(35 preguntas / 38 puntos / aprueba con 33 / 45 min). Progreso en el teléfono (localStorage).

Regla: nada se pregunta sin enseñar antes. Cada pregunta se practica en la última sesión de sus datos, y el
repaso, la prueba y el simulacro solo usan preguntas de sesiones ya estudiadas (leídas o con tutor).

Genera dist/index.html desde index.tpl.html, content.json y tools/cobertura/datos.
Uso: python3 tools/demo-app/build.py
"""
import base64, glob, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
A = os.path.join(ROOT, "app/src/main/assets")
content = json.load(open(os.path.join(A, "content.json"), encoding="utf-8"))
caps = sorted((json.load(open(f, encoding="utf-8")) for f in glob.glob(os.path.join(ROOT, "tools/cobertura/datos/capitulo-*.json"))), key=lambda c: c["capitulo"])
specs = {os.path.basename(f)[:-5]: json.load(open(f, encoding="utf-8")) for f in glob.glob(os.path.join(ROOT, "tools/sesiones/specs/c*s*.json"))}
orden = {s["id"]: i for i, s in enumerate(x for c in caps for x in c["sesiones"])}   # orden del libro
IMG, img = {}, lambda p: IMG.setdefault(p, "data:image/webp;base64," + base64.b64encode(open(os.path.join(A, p), "rb").read()).decode()) and p
C, LEC, ses = [], {}, {}
for c in caps:
    n = c["capitulo"]
    C.append({"n": n, "et": f"Capítulo {n}" if n <= 10 else ("Anexo 1" if n == 11 else "Figuras del libro"),
              "t": c["titulo"].replace("Anexo 1: ", "").replace(" (imágenes)", "").replace(" (preguntas con imagen)", ""),
              "ses": [{"id": s["id"], "t": specs.get(s["id"], {}).get("titulo", s["titulo"]), "tutor": s["id"] in specs, "ic": specs.get(s["id"], {}).get("icono", "📖"),
                       "m": specs.get(s["id"], {}).get("minutos", 3)} for s in c["sesiones"]]})
    for d in c["datos"]:
        for qid in d["q"]: ses.setdefault(qid, set()).add(d["s"])
        e = {"c": d.get("cita") or d.get("etiqueta", ""), "p": d["p"]}
        im = d.get("img") or d.get("imagen")
        if im: e["i"] = img(im)
        LEC.setdefault(d["s"], []).append(e)
Q = []
for q in content["questions"]:
    if q["type"] not in ("mc", "img", "multi") or q["id"] not in ses: continue
    s = max(ses[q["id"]], key=orden.get)
    e = {"id": q["id"], "s": s, "q": q["prompt"], "o": q["options"], "e": q["explain"], "p": q["page"]}
    if q["type"] == "multi": e["k"] = q["answers"]
    if q.get("image"): e["i"] = img(q["image"])
    Q.append(e)
bank = {"C": C, "L": LEC, "Q": Q, "IMG": IMG}
fuente = base64.b64encode(open(os.path.join(HERE, "fuentes/Nunito-latin.woff2"), "rb").read()).decode()  # Nunito, licencia OFL (fuentes/OFL.txt)
css_fuente = "@font-face{font-family:'Nunito';font-style:normal;font-weight:600 900;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % fuente
# Emojis iguales en todos los teléfonos: Noto Color Emoji (licencia OFL) recortada a los emojis que usa la app.
# Si se agregan emojis nuevos, regenerar fuentes/NotoColorEmoji-rutab.woff2 (ver fuentes/LEEME.md).
emoji = base64.b64encode(open(os.path.join(HERE, "fuentes/NotoColorEmoji-rutab.woff2"), "rb").read()).decode()
css_fuente += "@font-face{font-family:'RBEmoji';font-display:block;src:url(data:font/woff2;base64,%s) format('woff2')}" % emoji
# Símbolos de texto que no traen Nunito ni la de emojis (↑ → ↻ ≈ ✓ ✕): Noto Sans Math y Symbols 2, recortadas
for fam, arch in (("RBSimbolos", "NotoSansMath-rutab.woff2"), ("RBSimbolos2", "NotoSansSymbols2-rutab.woff2")):
    css_fuente += "@font-face{font-family:'%s';font-display:block;src:url(data:font/woff2;base64,%s) format('woff2')}" % (fam, base64.b64encode(open(os.path.join(HERE, "fuentes", arch), "rb").read()).decode())
html = open(os.path.join(HERE, "index.tpl.html"), encoding="utf-8").read().replace("/*FUENTE*/", css_fuente, 1).replace("__BANK__", json.dumps(bank, ensure_ascii=False, separators=(",", ":")))
os.makedirs(os.path.join(HERE, "dist"), exist_ok=True)
open(os.path.join(HERE, "dist/index.html"), "w", encoding="utf-8").write(html)
print(f"✓ dist/index.html: {len(C)} capítulos, {sum(len(c['ses']) for c in C)} paradas ({len(specs)} con tutor), {len(Q)} preguntas, {len(IMG)} imágenes")
