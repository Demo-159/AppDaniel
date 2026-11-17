#!/usr/bin/env python3
"""Genera las preguntas con imagen de las señales del Anexo 1 a partir de tools/cobertura/senales.json
(imagen recortada del libro + nombre exacto bajo cada señal) y el archivo de datos datos/anexo-senales.json."""
import json, os, random, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
S = json.load(open(os.path.join(ROOT, "tools/cobertura/senales.json"), encoding="utf-8"))
for s in S:
    if s["label"] == "BUSEO": s["label"] = "BUCEO"  # errata del libro
json.dump(S, open(os.path.join(ROOT, "tools/cobertura/senales.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)

KEEP = {"pare": "PARE", "zona 30": "Zona 30", "san andrés": "San Andrés", "“pare”": "“PARE”", "“ceda el paso”": "“Ceda el Paso”", "sos": "SOS"}
def nice(label):
    t = label.lower()
    for k, v in KEEP.items(): t = re.sub(rf"(?<!\w){re.escape(k)}(?!\w)", v, t)
    return t[0].upper() + t[1:]

CAT = {"reglamentaria": "Reglamentaria", "advertencia": "De advertencia", "informativa": "Informativa", "transitoria": "Transitoria"}
content_path = os.path.join(ROOT, "app/src/main/assets/content.json")
content = json.load(open(content_path, encoding="utf-8"))
qs = [q for q in content["questions"] if not q["id"].startswith("u7-s")]  # regenerable
rnd = random.Random(7)
words = lambda s: set(re.findall(r"\w{4,}", s.lower()))
new, datos = [], []
for s in S:
    ans = nice(s["label"])
    pool = [o for o in S if o["cat"] == s["cat"] and nice(o["label"]) != ans]
    pool = list({nice(o["label"]): o for o in pool}.values())
    rnd.shuffle(pool)
    pool.sort(key=lambda o: (-len(words(o["label"]) & words(s["label"])), abs(len(o["label"]) - len(s["label"]))))
    opts = []
    for o in pool:
        n = nice(o["label"])
        if n not in opts: opts.append(n)
        if len(opts) == 3: break
    # avoid the right answer standing out by length
    if len(ans) > 1.3 * max(len(x) for x in opts):
        cand = pool + sorted([o for o in S if o["cat"] != s["cat"]], key=lambda o: -len(words(o["label"]) & words(s["label"])))
        longer = [nice(o["label"]) for o in cand if len(o["label"]) * 1.3 >= len(ans) and nice(o["label"]) not in opts and nice(o["label"]) != ans]
        if longer: opts[-1] = longer[0]
    qid = f"u7-s{s['n']:03d}"
    new.append({"id": qid, "unit": "u7", "lesson": 0, "type": "img", "prompt": "¿Qué indica esta señal?",
                "options": [ans] + opts, "explain": f"Es la señal {ans} ({CAT[s['cat']].lower()}).", "page": s["page"], "image": s["img"]})
    qids = [qid]
    if s["n"] % 7 == 0:  # also ask for its type
        cid = f"u7-st{s['n']:03d}"
        other = [v for k, v in CAT.items() if k != s["cat"]]
        new.append({"id": cid, "unit": "u7", "lesson": 0, "type": "img", "prompt": "¿Qué tipo de señal es esta?",
                    "options": [CAT[s["cat"]]] + other, "explain": f"«{ans}» es una señal {CAT[s['cat']].lower()}.", "page": s["page"], "image": s["img"]})
        qids.append(cid)
    datos.append({"id": f"a1-{s['n']:03d}", "p": s["page"], "s": "a1s" + {"reglamentaria": "1", "advertencia": "2", "informativa": "3", "transitoria": "4"}[s["cat"]],
                  "q": qids, "img": s["img"], "etiqueta": s["label"]})
content["questions"] = qs + new
json.dump(content, open(content_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
out = {"capitulo": 11, "titulo": "Anexo 1: Señales de tránsito verticales (imágenes)", "unidades": [],
       "paginas": [150, 160],
       "sesiones": [{"id": "a1s1", "titulo": "Señales reglamentarias"}, {"id": "a1s2", "titulo": "Señales de advertencia de peligro"},
                    {"id": "a1s3", "titulo": "Señales informativas"}, {"id": "a1s4", "titulo": "Señales transitorias"}],
       "datos": datos, "sin_dato": []}
json.dump(out, open(os.path.join(ROOT, "tools/cobertura/datos/capitulo-11.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(new), "preguntas con imagen")
