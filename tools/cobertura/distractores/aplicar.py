#!/usr/bin/env python3
"""Reemplaza distractores (opciones incorrectas) de preguntas mc/img en content.json.

Cada archivo distractores/*.json es {id: [3 distractores]}. La correcta (opción 0) no se toca.
Comprueba largo (la correcta no puede superar 1,3× el distractor más largo) y opciones distintas.
Uso: python3 tools/cobertura/distractores/aplicar.py
"""
import glob, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
CP = os.path.join(HERE, "../../../app/src/main/assets/content.json")
c = json.load(open(CP, encoding="utf-8")); Q = {q["id"]: q for q in c["questions"]}
err, n = [], 0
for f in sorted(glob.glob(os.path.join(HERE, "*.json"))):
    for qid, ds in json.load(open(f, encoding="utf-8")).items():
        q = Q.get(qid)
        if not q or q["type"] not in ("mc", "img"): err.append(f"{qid}: no existe o no es mc/img"); continue
        o = [q["options"][0]] + ds
        if len(ds) != 3 or len(set(o)) != 4: err.append(f"{qid}: se necesitan 3 distractores distintos"); continue
        if len(o[0]) > 1.3 * max(map(len, ds)): err.append(f"{qid}: la correcta queda demasiado larga")
        if q["options"] != o: q["options"] = o; n += 1
if err: raise SystemExit("\n".join(err))
json.dump(c, open(CP, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
mc = [q for q in c["questions"] if q["type"] in ("mc", "img")]
lg = sum(all(len(x) < len(q["options"][0]) for x in q["options"][1:]) for q in mc)
print(f"✓ {n} preguntas actualizadas · correcta más larga en {lg*100//len(mc)}% (máx. 35%)")
