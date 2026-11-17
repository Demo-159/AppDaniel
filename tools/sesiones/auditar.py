#!/usr/bin/env python3
"""Auditoría "nada sin enseñar": por cada sesión de un capítulo, muestra lo que la sesión dice y
muestra en pantalla, y debajo las preguntas que se practican ahí con su(s) respuesta(s) correcta(s).

Una pregunta se practica en la última sesión de sus datos. Revisar a mano que lo que pide cada
respuesta correcta se diga o se vea en esa sesión o en una anterior; si no, agregarlo al guion.
Uso: python3 tools/sesiones/auditar.py 1   (número de capítulo)
"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cap = sys.argv[1]
C = {q["id"]: q for q in json.load(open(os.path.join(ROOT, "app/src/main/assets/content.json"), encoding="utf-8"))["questions"]}
D = json.load(open(os.path.join(ROOT, f"tools/cobertura/datos/capitulo-{cap}.json"), encoding="utf-8"))["datos"]
num = lambda s: int(s.split("s")[1])
ses = {}
for d in D:
    for q in d["q"]: ses.setdefault(q, set()).add(d["s"])
def textos(x):
    if isinstance(x, str): return [x]
    if isinstance(x, list): return [t for v in x for t in textos(v)]
    if isinstance(x, dict): return [t for k, v in x.items() if k not in ("tipo", "icono", "fondo", "dato", "src", "color", "marca") for t in textos(v)]
    return []
for sid in sorted({d["s"] for d in D}, key=num):
    f = os.path.join(ROOT, f"tools/sesiones/specs/{sid}.json")
    if not os.path.exists(f): print(f"== {sid}: SIN GUION (sus preguntas no se pueden usar)"); continue
    sp = json.load(open(f, encoding="utf-8")); print(f"== {sid} {sp['titulo']}")
    for i, p in enumerate(sp["pasos"]): print(f"  [{i}] " + " | ".join(textos(p)))
    for qid, ss in sorted(ses.items()):
        q = C.get(qid)
        if max(ss, key=num) != sid or not q or q["type"] not in ("mc", "img", "multi"): continue
        print(f"  ? {qid} {q['prompt']}\n      ✓ " + " // ".join(q["options"][:q.get("answers", 1)]))
