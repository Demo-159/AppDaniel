#!/usr/bin/env python3
"""Reemplaza las preguntas verdadero/falso por el formato del examen: "Marque dos/tres respuestas".
Agrupa por capítulo (ordenadas por sesión) 3 afirmaciones verdaderas (o 2) con 2 falsas: las falsas son
afirmaciones falsas ya existentes o versiones falsas escritas a mano (tools/cobertura/falsos.json, por id
de la afirmación verdadera de la que se derivan; nunca van en la misma pregunta que su original).
Uso: python3 tools/cobertura/multi.py [--plan]"""
import glob, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
cpath = os.path.join(ROOT, "app/src/main/assets/content.json")
content = json.load(open(cpath, encoding="utf-8"))
Q = {q["id"]: q for q in content["questions"]}
dfiles = sorted(glob.glob(os.path.join(ROOT, "tools/cobertura/datos/capitulo-*.json")))
order, chap = [], {}
for f in dfiles:
    d = json.load(open(f, encoding="utf-8"))
    for x in d["datos"]:
        for q in x["q"]:
            if q in Q and Q[q]["type"] == "tf" and q not in chap:
                chap[q] = d["capitulo"]; order.append((d["capitulo"], x["s"], q))
falsos_path = os.path.join(ROOT, "tools/cobertura/falsos.json")
falsos = json.load(open(falsos_path, encoding="utf-8")) if os.path.exists(falsos_path) else {}
plan = "--plan" in sys.argv
groups, need = [], []
for ch in sorted({c for c, _, _ in order}):
    T = [q for c, s, q in order if c == ch and Q[q]["answer"]]
    F = [q for c, s, q in order if c == ch and not Q[q]["answer"]]
    chunks, i, turn = [], 0, 0
    while i < len(T):  # alternate "marque dos" and "marque tres" (2,2,3), as in the exam's question bank
        rest = len(T) - i
        k = 3 if (turn % 3 == 2 and rest >= 3) or rest == 3 or rest == 5 else min(2, rest)
        chunks.append(T[i:i + k]); i += k; turn += 1
    if chunks and len(chunks[-1]) == 1 and len(chunks) > 1:  # never a lone statement nor four correct ones
        if len(chunks[-2]) == 3: chunks[-1].insert(0, chunks[-2].pop())
        else: chunks[-2] += chunks.pop()
    if chunks and len(chunks[-1]) == 1:  # a chapter with a single true statement
        chunks[-1] = chunks[-1]
    fpool = [("f", q) for q in F]
    used_var = set()
    for g in chunks:
        fs = []
        while len(fs) < 2 and fpool: fs.append(fpool.pop(0))
        while len(fs) < 2:
            src = next((q for q in T if q not in g and q not in used_var and q in falsos), None)
            if src is None:
                src = next((q for q in T if q not in g and q not in used_var and q not in falsos), None)
                need.append(src); used_var.add(src); fs.append(("v", src)); continue
            used_var.add(src); fs.append(("v", src))
        groups.append((ch, g, fs))
    for j, q in enumerate(fpool):  # leftover false statements: an extra (fifth) option
        cands = sorted([gr for gr in groups if gr[0] == ch], key=lambda gr: len(gr[1]) + len(gr[2]))
        cands[0][2].append(("f", q))
if plan:
    print(len(groups), "preguntas;", len(need), "falsas por escribir")
    for q in need: print(q, "|", Q[q]["prompt"])
    sys.exit()
missing = [q for q in need]
if missing:
    sys.exit(f"faltan {len(missing)} afirmaciones falsas en falsos.json")
new, remap = [], {}
for n, (ch, g, fs) in enumerate(groups, 1):
    k = len(g)
    trues = [Q[q]["prompt"] for q in g]
    fal = [Q[q]["prompt"] if t == "f" else falsos[q] for t, q in fs]
    qid = f"m{ch}-{n:03d}"
    word = {2: "dos", 3: "tres", 4: "cuatro"}[k] if k > 1 else "una"
    prompt = (f"¿Cuáles {k} de estas afirmaciones son correctas según el libro? Marque {word} respuestas" if k > 1
              else "¿Cuál de estas afirmaciones es correcta según el libro?")
    first = Q[g[0]]
    new.append({"id": qid, "unit": first["unit"], "lesson": first["lesson"], "type": "multi" if k > 1 else "mc",
                "prompt": prompt, "options": trues + fal, "answers": k,
                "explain": " ".join(Q[q]["explain"] for q in g), "page": first["page"]})
    for q in g: remap[q] = qid
    for t, q in fs:
        if t == "f": remap[q] = qid
content["questions"] = [q for q in content["questions"] if q["type"] != "tf"] + new
json.dump(content, open(cpath, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for f in dfiles:
    d = json.load(open(f, encoding="utf-8"))
    for x in d["datos"]:
        x["q"] = list(dict.fromkeys(remap.get(q, q) for q in x["q"]))
    json.dump(d, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(new), "preguntas de selección múltiple con varias respuestas;", len(remap), "verdadero/falso reemplazadas")
