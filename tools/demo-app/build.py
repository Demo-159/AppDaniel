#!/usr/bin/env python3
"""Demo web de la app completa (diseño aprobado por el usuario: mapa-camino, sesión con tutor,
práctica, repaso ⛽, prueba de capítulo 🏁 y simulacro 🏆 de 35 preguntas / 38 puntos / aprueba con 33 / 45 min).

Genera dist/index.html desde index.tpl.html + content.json (preguntas mc, img y multi).
Las imágenes van incrustadas en base64. Las paradas "Sesión con tutor" enlazan a sesion.html;
para probar con sesiones reales, copia tools/sesiones/dist/<id>.html como dist/sesion.html
(o ajusta los href en index.tpl.html).

Uso: python3 tools/demo-app/build.py   →  tools/demo-app/dist/index.html
"""
import base64, json, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
A = os.path.join(ROOT, "app/src/main/assets")
content = json.load(open(os.path.join(A, "content.json"), encoding="utf-8"))
# Una pregunta se practica en la sesión donde termina de enseñarse todo lo que pregunta
# (la última de las sesiones de sus datos), nunca antes.
import glob, re
orden = lambda s: tuple(int(x) for x in re.findall(r"\d+", s))
ses = {}
for f in glob.glob(os.path.join(ROOT, "tools/cobertura/datos/capitulo-*.json")):
    for d in json.load(open(f, encoding="utf-8"))["datos"]:
        for qid in d["q"]: ses.setdefault(qid, set()).add(d["s"])
# Solo entran preguntas ya enseñadas: su sesión tiene guion en tools/sesiones/specs.
# Así ninguna práctica, repaso, prueba o simulacro pregunta algo que no se enseñó.
hechas = {os.path.basename(f)[:-5] for f in glob.glob(os.path.join(ROOT, "tools/sesiones/specs/c*s*.json"))}
Q = []
for q in content["questions"]:
    if q["type"] not in ("mc", "img", "multi"): continue
    if q["id"] not in ses or max(ses[q["id"]], key=orden) not in hechas: continue
    e = {"u": q["unit"], "q": q["prompt"], "o": q["options"], "e": q["explain"], "p": q["page"]}
    e["s"] = max(ses[q["id"]], key=orden)
    if q["type"] == "multi": e["k"] = q["answers"]
    if q.get("image"):
        e["i"] = "data:image/webp;base64," + base64.b64encode(open(os.path.join(A, q["image"]), "rb").read()).decode()
    Q.append(e)
bank = {"U": json.load(open(os.path.join(HERE, "unidades.json"), encoding="utf-8")), "Q": Q}
html = open(os.path.join(HERE, "index.tpl.html"), encoding="utf-8").read().replace("__BANK__", json.dumps(bank, ensure_ascii=False))
os.makedirs(os.path.join(HERE, "dist"), exist_ok=True)
open(os.path.join(HERE, "dist/index.html"), "w", encoding="utf-8").write(html)
print(f"✓ dist/index.html: {len(Q)} preguntas ya enseñadas, de {len(hechas)} sesiones")
