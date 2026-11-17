#!/usr/bin/env python3
"""Aplica a content.json:
1) multi_falsas/*.json: {id: [falsas]} reemplaza las afirmaciones falsas de las preguntas "Marque dos/tres"
   por errores creíbles del mismo tema (las verdaderas, las primeras `answers` opciones, no se tocan).
2) Enunciados "Marque" sin mencionar el libro: "¿Cuáles de estas afirmaciones son correctas? Marque dos respuestas".
3) ../sin_libro.json: enunciados y explicaciones reescritos sin "según el libro" (el examen real no lo menciona).
Al final verifica que ningún enunciado ni opción mencione el libro.
Uso: python3 tools/cobertura/multi_falsas/aplicar.py
"""
import glob, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
CP = os.path.join(HERE, "../../../app/src/main/assets/content.json")
c = json.load(open(CP, encoding="utf-8")); Q = {q["id"]: q for q in c["questions"]}
err, n = [], 0
NUM = {2: "dos", 3: "tres"}
for f in sorted(glob.glob(os.path.join(HERE, "*.json"))):
    for qid, fal in json.load(open(f, encoding="utf-8")).items():
        q = Q.get(qid)
        if not q or q["type"] != "multi": err.append(f"{qid}: no es multi"); continue
        k = q["answers"]; v = q["options"][:k]
        if len(fal) != len(q["options"]) - k or len(set(v + fal)) != len(v) + len(fal): err.append(f"{qid}: falsas inválidas"); continue
        q["options"] = v + fal; n += 1
for q in c["questions"]:
    if q["type"] == "multi":
        q["prompt"] = f"¿Cuáles de estas afirmaciones son correctas? Marque {NUM[q['answers']]} respuestas"
    q["options"] = [re.sub(r"^Según el libro, (\w)", lambda m: m.group(1).upper(), o) for o in q.get("options", [])]
for qid, cambios in json.load(open(os.path.join(HERE, "../sin_libro.json"), encoding="utf-8")).items():
    if qid.startswith("_"): continue
    if qid not in Q: err.append(f"{qid}: no existe"); continue
    Q[qid].update(cambios)
quedan = [q["id"] for q in c["questions"] if re.search(r"libro", q.get("prompt", "") + " ".join(q.get("options", [])), re.I)]
if quedan: err.append("aún mencionan el libro: " + ", ".join(quedan))
if err: raise SystemExit("\n".join(err))
json.dump(c, open(CP, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"✓ {n} preguntas Marque con falsas nuevas · ningún enunciado ni opción menciona el libro")
