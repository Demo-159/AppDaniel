#!/usr/bin/env python3
"""Arma tools/cobertura/datos/capitulo-N.json y agrega las preguntas nuevas a content.json
a partir de una especificación compacta (tools/cobertura/spec/capitulo-N.json):

{
 "capitulo": 2, "titulo": "...", "unidad": "u3",          # unidad por defecto para preguntas nuevas
 "sesiones": [["c2s1", "Título"], ...],
 "datos": [
   {"s": "c2s1", "cita": "texto textual del libro", "q": ["u2-03"],            # preguntas existentes
    "mc": "¿Pregunta?", "o": ["correcta", "d1", "d2", "d3"], "e": "explicación"}, # pregunta nueva opcional
   {"s": "c2s1", "cita": "...", "tf": "Afirmación.", "a": false, "e": "..."},
 ],
 "sin_dato": [{"cita": "...", "motivo": "..."}],
 "borrar": ["u2-07"]                                          # preguntas que el libro no respalda
}

La página de cada dato se calcula buscando la cita en el libro (número de página impreso que sigue).
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
norm = lambda s: re.sub(r"\s+", " ", s).strip()

# libro normalizado + mapa de páginas (las líneas que son solo un número creciente son el pie de página;
# se ignoran las primeras líneas, que son el índice)
lines = open(os.path.join(ROOT, "tools/cobertura/libro.txt"), encoding="utf-8").read().split("\n")
buf, marks, last = [], [], 5
for n_l, l in enumerate(lines):
    s = l.strip()
    if n_l > 160 and re.fullmatch(r"\d{1,3}", s) and last < int(s) <= last + 3 and int(s) >= 6:
        marks.append((len(norm(" ".join(buf))), int(s))); last = int(s)
    buf.append(l)
libro = norm(" ".join(buf))

def pagina(cita):
    i = libro.find(norm(cita))
    if i < 0:
        return None
    for off, p in marks:
        if off >= i:
            return p
    return 169

def main(n):
    spec = json.load(open(os.path.join(ROOT, f"tools/cobertura/spec/capitulo-{n}.json"), encoding="utf-8"))
    cpath = os.path.join(ROOT, "app/src/main/assets/content.json")
    content = json.load(open(cpath, encoding="utf-8"))
    qs = content["questions"]
    borrar = set(spec.get("borrar", []))
    qs[:] = [q for q in qs if q["id"] not in borrar]
    ids = {q["id"] for q in qs}
    lessons = {u["id"]: len(u["lessons"]) for u in content["units"]}
    errores, datos = [], []
    for k, d in enumerate(spec["datos"], 1):
        p = pagina(d["cita"])
        if p is None:
            errores.append(f"cita no encontrada: {d['cita'][:70]}"); continue
        qids = list(d.get("q", []))
        for qid in qids:
            if qid not in ids:
                errores.append(f"pregunta {qid} no existe")
        if "mc" in d or "tf" in d:
            u = d.get("u", spec["unidad"])
            num = 1 + max([int(q["id"].split("-")[1]) for q in qs if q["unit"] == u] + [0])
            qid = f"{u}-{num:02d}"
            q = {"id": qid, "unit": u, "lesson": d.get("l", lessons[u] - 1), "page": p, "explain": d["e"]}
            if "mc" in d:
                o = d["o"]
                if len(o) != 4 or len(set(o)) != 4:
                    errores.append(f"{qid}: necesita 4 opciones distintas")
                if len(o[0]) > 1.3 * max(len(x) for x in o[1:]):
                    errores.append(f"{qid}: la correcta es demasiado larga: {o[0]}")
                q.update(type="mc", prompt=d["mc"], options=o)
            else:
                q.update(type="tf", prompt=d["tf"], answer=d["a"])
            qs.append(q); ids.add(qid); qids.append(qid)
        if not qids:
            errores.append(f"dato sin pregunta: {d['cita'][:70]}")
        datos.append({"id": f"c{n}-{k:02d}", "p": p, "s": d["s"], "q": qids, "cita": d["cita"]})
    for x in spec.get("sin_dato", []):
        if pagina(x["cita"]) is None:
            errores.append(f"sin_dato no encontrado: {x['cita'][:70]}")
    if errores:
        print("\n".join("✗ " + e for e in errores)); sys.exit(1)
    pags = [d["p"] for d in datos]
    out = {"capitulo": n, "titulo": spec["titulo"], "unidades": spec.get("unidades", [spec["unidad"]]),
           "paginas": [min(pags), max(pags)], "sesiones": [{"id": a, "titulo": b} for a, b in spec["sesiones"]],
           "datos": datos, "sin_dato": spec.get("sin_dato", [])}
    json.dump(out, open(os.path.join(ROOT, f"tools/cobertura/datos/capitulo-{n}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(content, open(cpath, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"capítulo {n}: {len(datos)} datos, {sum('mc' in d or 'tf' in d for d in spec['datos'])} preguntas nuevas, {len(borrar)} borradas")

if __name__ == "__main__":
    main(int(sys.argv[1]))
