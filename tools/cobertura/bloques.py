#!/usr/bin/env python3
"""Extrae el texto del libro por bloques (cada columna y recuadro por separado) en libro_bloques.txt.
libro.txt (extracción por líneas) a veces mezcla las dos columnas; este texto mantiene las oraciones enteras
y lo usa la lectura de la app (tools/demo-app/build.py) para mostrar cada cita como oración completa.
Requiere pymupdf. Uso: python3 tools/cobertura/bloques.py
"""
import os, re
import pymupdf
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
doc = pymupdf.open(os.path.join(ROOT, "Libro_para_la_conduccion_en_Chile_Clase_B_27-02-2026.pdf"))
out = []
for pg in doc:
    W = pg.rect.width
    bl = sorted((b for b in pg.get_text("blocks") if b[6] == 0 and b[4].strip()), key=lambda b: (0 if b[0] < W * 0.45 else 1, b[1]))
    out += [re.sub(r"-\n(?=[a-záéíóúñ])", "", b[4]).replace("\n", " ").strip() for b in bl] + [""]
open(os.path.join(ROOT, "tools/cobertura/libro_bloques.txt"), "w", encoding="utf-8").write("\n".join(out))
print("✓ tools/cobertura/libro_bloques.txt")
