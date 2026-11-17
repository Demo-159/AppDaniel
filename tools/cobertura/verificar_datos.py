#!/usr/bin/env python3
"""Cobertura del libro por dato.

Para cada capítulo en tools/cobertura/datos/capitulo-N.json verifica:
  1. Cada cita aparece textual en el libro (tools/cobertura/libro.txt, espacios normalizados).
  2. Cada dato tiene al menos una pregunta y esa pregunta existe en content.json.
  3. Cada dato está asignado a una sesión del capítulo.
  4. Toda pregunta de las unidades del capítulo está respaldada por al menos un dato (nada inventado).
Sale con código 1 si algo falla.

Uso: python3 tools/cobertura/verificar_datos.py
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
norm = lambda s: re.sub(r"\s+", " ", s).strip()
libro = norm(open(os.path.join(ROOT, "tools/cobertura/libro.txt"), encoding="utf-8").read())
content = json.load(open(os.path.join(ROOT, "app/src/main/assets/content.json"), encoding="utf-8"))
preguntas = {q["id"]: q for q in content["questions"]}

errores = []
usadas_total, unidades_total = set(), set()
for path in sorted(glob.glob(os.path.join(ROOT, "tools/cobertura/datos/capitulo-*.json"))):
    cap = json.load(open(path, encoding="utf-8"))
    n = cap["capitulo"]
    sesiones = {s["id"]: s["titulo"] for s in cap["sesiones"]}
    usadas = set()
    for d in cap["datos"]:
        if norm(d["cita"]) not in libro:
            errores.append(f"{d['id']}: la cita no aparece textual en el libro")
        if not d["q"]:
            errores.append(f"{d['id']}: sin pregunta")
        for qid in d["q"]:
            if qid not in preguntas:
                errores.append(f"{d['id']}: la pregunta {qid} no existe")
            usadas.add(qid)
        if d["s"] not in sesiones:
            errores.append(f"{d['id']}: sesión {d['s']} no existe")
    for x in cap.get("sin_dato", []):
        if norm(x["cita"]) not in libro:
            errores.append(f"sin_dato: la cita no aparece textual en el libro: {x['cita'][:40]}…")
    usadas_total |= usadas
    unidades_total |= set(cap.get("unidades", ["u1"] if n == 1 else []))

    print(f"\nCapítulo {n}: {cap['titulo']} (págs. {cap['paginas'][0]}–{cap['paginas'][1]})")
    print(f"  {len(cap['datos'])} datos · {len(usadas)} preguntas · {len(sesiones)} sesiones")
    for sid, t in sesiones.items():
        ds = [d for d in cap["datos"] if d["s"] == sid]
        print(f"  {sid}  {t:<50} {len(ds):>2} datos  {sum(len(d['q']) for d in ds):>2} preguntas")

# toda pregunta de las unidades revisadas debe estar respaldada por algún dato del libro
for q, v in preguntas.items():
    if v["unit"] in unidades_total and q not in usadas_total:
        errores.append(f"{q}: pregunta sin dato del libro que la respalde")
pend = sorted({v["unit"] for v in preguntas.values()} - unidades_total, key=lambda u: int(u[1:]))
if pend:
    print("\nUnidades aún sin revisar por dato:", ", ".join(pend))

if errores:
    print("\nERRORES:")
    for e in errores:
        print("  ✗", e)
    sys.exit(1)
print("\n✓ Todos los datos están en el libro, tienen pregunta y sesión; ninguna pregunta queda sin respaldo.")
