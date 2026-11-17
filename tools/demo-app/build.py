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
Q = []
for q in content["questions"]:
    if q["type"] not in ("mc", "img", "multi"): continue
    e = {"u": q["unit"], "q": q["prompt"], "o": q["options"], "e": q["explain"], "p": q["page"]}
    if q["type"] == "multi": e["k"] = q["answers"]
    if q.get("image"):
        e["i"] = "data:image/webp;base64," + base64.b64encode(open(os.path.join(A, q["image"]), "rb").read()).decode()
    Q.append(e)
bank = {"U": json.load(open(os.path.join(HERE, "unidades.json"), encoding="utf-8")), "Q": Q}
html = open(os.path.join(HERE, "index.tpl.html"), encoding="utf-8").read().replace("__BANK__", json.dumps(bank, ensure_ascii=False))
os.makedirs(os.path.join(HERE, "dist"), exist_ok=True)
open(os.path.join(HERE, "dist/index.html"), "w", encoding="utf-8").write(html)
print(f"✓ dist/index.html: {len(Q)} preguntas")
