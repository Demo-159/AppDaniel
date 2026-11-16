"""Verifica que el video de un capítulo explique TODAS sus preguntas.
Cada escena del guion lista en "qs" las preguntas que explica, y "questions.units"
indica qué unidades/lecciones del banco corresponden al capítulo.
Uso: python3 verificar_cobertura.py guiones/capitulo-1.json"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
content = json.load(open(os.path.join(HERE, "..", "..", "app", "src", "main", "assets", "content.json")))
guion = json.load(open(sys.argv[1]))
units = guion["questions"]["units"]
expected = {q["id"] for q in content["questions"] if q["unit"] in units and q["lesson"] in units[q["unit"]]}
covered = {qid for s in guion["scenes"] for qid in s.get("qs", [])}
missing, extra = sorted(expected - covered), sorted(covered - expected)
print(f"{len(expected & covered)}/{len(expected)} preguntas explicadas en el video")
if extra:
    print("Atención, el guion cita preguntas que no son de este capítulo:", extra)
if missing:
    print("FALTAN en el video:", missing)
    sys.exit(1)
