#!/usr/bin/env python3
"""Opciones de ícono de Ruta B en una grilla de 108 (ícono adaptable de Android; zona segura: círculo r=33).
Genera la página de muestra (SVG) y, para la opción elegida, los recursos de Android.
Uso: python3 tools/icono/iconos.py muestra <salida.html>
     python3 tools/icono/iconos.py android <id>
"""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def B(cx, cy, s=1.0):
    """Letra B en negrita como trazado (sin fuentes), centrada en (cx,cy)."""
    pts = ("M-6,-9 H1.5 C5.5,-9 7.5,-7 7.5,-4.2 C7.5,-2.2 6.3,-0.8 4.6,-0.3 C6.8,0.2 8.2,2 8.2,4.4 C8.2,7.4 6,9 2,9 H-6 Z "
           "M-2.4,-5.8 V-1.6 H1 C3,-1.6 4,-2.4 4,-3.8 C4,-5.1 3,-5.8 1,-5.8 Z "
           "M-2.4,1.4 V5.8 H1.6 C3.7,5.8 4.6,5 4.6,3.6 C4.6,2.2 3.7,1.4 1.6,1.4 Z")
    out, num, axis = [], "", 0
    import re
    toks = re.findall(r"[A-Za-z]|-?\d+\.?\d*", pts)
    cmd = None; coords = []
    res = []
    i = 0
    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            cmd = t; res.append(t); i += 1; continue
        if cmd == "H":
            res.append(f"{cx + float(t)*s:.2f}"); i += 1
        elif cmd == "V":
            res.append(f"{cy + float(t)*s:.2f}"); i += 1
        else:
            x, y = float(toks[i]), float(toks[i+1]); res.append(f"{cx + x*s:.2f},{cy + y*s:.2f}"); i += 2
    return " ".join(res)

# Cada opción: color de fondo y capas (trazado, relleno, contorno, grosor, evenodd)
OPCIONES = {
 "camino": {"nombre": "Camino con meta", "texto": "Un camino que avanza hasta un pin con la B: es el mapa de la app y la licencia Clase B.",
   "bg": "#16324F", "escala": .74, "capas": [
     ("M30,100 C30,78 76,82 72,62 C70,53 64,52 62,50", None, "#3A4852", 15, False),
     ("M30,100 C30,78 76,82 72,62 C70,53 64,52 62,50", None, "#FFC800", 2.2, False),
     ("M62,64 C58,57 46,49 46,38 A16,16 0 1,1 78,38 C78,49 66,57 62,64 Z", "#58CC02", None, 0, False),
     (B(62, 37.5, 1.05), "#FFFFFF", None, 0, True)]},
 "cono": {"nombre": "Cono, la mascota", "texto": "La mascota de la app. Simpático y reconocible, más juvenil.",
   "bg": "#16324F", "escala": .8, "capas": [
     ("M30,74 L78,74 Q81,74 81,77 L81,80 Q81,83 78,83 L30,83 Q27,83 27,80 L27,77 Q27,74 30,74 Z", "#0E1E30", None, 0, False),
     ("M54,24 Q57,24 58,27 L72,75 L36,75 L50,27 Q51,24 54,24 Z", "#FF9600", None, 0, False),
     ("M46.5,40 L61.5,40 L64,49 L44,49 Z", "#FFFFFF", None, 0, False),
     ("M41.8,57 L66.2,57 L68.5,65 L39.5,65 Z", "#FFFFFF", None, 0, False),
     ("M45.4,34 a2.6,2.6 0 1,0 5.2,0 a2.6,2.6 0 1,0 -5.2,0 M57.4,34 a2.6,2.6 0 1,0 5.2,0 a2.6,2.6 0 1,0 -5.2,0", "#16324F", None, 0, False)]},
 "senal": {"nombre": "Señal con B", "texto": "Un rombo de advertencia con la B. Se lee de inmediato como algo de tránsito.",
   "bg": "#FFC800", "escala": .82, "capas": [
     ("M54,22 L86,54 L54,86 L22,54 Z", "#FFC800", "#131F24", 5, False),
     (B(54, 54, 1.7), "#131F24", None, 0, True)]},
 "volante": {"nombre": "Volante con B", "texto": "Un volante con la B al centro. Directo: aprender a conducir.",
   "bg": "#1CB0F6", "escala": .8, "capas": [
     ("M54,26 A28,28 0 1,1 53.99,26 Z M54,34 A20,20 0 1,0 54.01,34 Z", "#FFFFFF", None, 0, True),
     ("M34,58 L46,56 L54,66 L62,56 L74,58 L72,52 L54,50 L36,52 Z", "#FFFFFF", None, 0, False),
     ("M54,42 A11,11 0 1,1 53.99,42 Z", "#FFFFFF", None, 0, False),
     (B(54, 53, .95), "#1CB0F6", None, 0, True)]},
}
RECOMENDADO = "senal"

def svg(op, mascara=None, tam=96):
    o = OPCIONES[op]
    clip = {"circulo": '<circle cx="54" cy="54" r="54"/>', "gota": '<path d="M54,0 H108 V54 A54,54 0 0,1 54,108 A54,54 0 0,1 0,54 A54,54 0 0,1 54,0Z"/>',
            "squircle": '<path d="M54,0 C96,0 108,12 108,54 C108,96 96,108 54,108 C12,108 0,96 0,54 C0,12 12,0 54,0Z"/>',
            "redondeado": '<rect width="108" height="108" rx="24"/>'}.get(mascara, '<rect width="108" height="108"/>')
    cid = f"m{op}{mascara}{tam}"
    capas = "".join(f'<path d="{d}" fill="{f or "none"}"' + (f' stroke="{st}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"' if st else "") + (' fill-rule="evenodd"' if eo else "") + "/>" for d, f, st, w, eo in o["capas"])
    # el sistema recorta el ícono adaptable al 72/108 central; la muestra hace lo mismo
    return (f'<svg width="{tam}" height="{tam}" viewBox="18 18 72 72"><defs><clipPath id="{cid}">{clip.replace("/>", ' transform="translate(18,18) scale(.6667)"/>',1)}</clipPath></defs>'
            f'<g clip-path="url(#{cid})"><rect x="0" y="0" width="108" height="108" fill="{o["bg"]}"/><g transform="translate(54,54) scale({o.get("escala",1)}) translate(-54,-54)">{capas}</g></g></svg>')

def muestra(salida):
    apps = ["#E57373", "#64B5F6", "#81C784", "#FFB74D", "#BA68C8", "#4DB6AC", "#F06292"]
    cards = []
    for op in OPCIONES:
        o = OPCIONES[op]
        fila = "".join(f'<div class="app"><div class="ic" style="background:{c}"></div><span>App</span></div>' for c in apps[:3])
        cards.append(f'''<section class="op{' rec' if op==RECOMENDADO else ''}"><div class="t"><h2>{o["nombre"]}</h2>{'<b class="chip">La que usaré</b>' if op==RECOMENDADO else ''}</div><p>{o["texto"]}</p>
 <div class="formas">{''.join(f'<div>{svg(op,m,64)}<small>{n}</small></div>' for m,n in [("circulo","redondo"),("squircle","Samsung"),("gota","gota"),("redondeado","cuadrado")])}</div>
 <div class="home"><div class="fila">{fila}<div class="app">{svg(op,"squircle",52)}<span>Ruta B</span></div></div></div>
 <div class="mini">{''.join(svg(op,"circulo",t) for t in (24,36,48))}<small>tamaños pequeños</small></div></section>''')
    html = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ícono de Ruta B</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap">
<style>:root{{--bg:#131F24;--card:#1E2B32;--line:#37464F;--ink:#F1F7FB;--muted:#9AB0BC;--gold:#FFC800;--green:#58CC02}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font-family:Nunito,system-ui,sans-serif;padding:16px}}
h1{{font-size:22px;margin:4px 0}}.intro{{color:var(--muted);font-weight:800;margin:0 0 16px;line-height:1.4}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px;max-width:1100px}}
.op{{background:var(--card);border:2px solid var(--line);border-radius:20px;padding:16px}}.op.rec{{border-color:var(--green)}}
.t{{display:flex;align-items:center;justify-content:space-between;gap:8px}}h2{{margin:0;font-size:19px}}.chip{{background:var(--green);color:#0E2A0E;border-radius:10px;padding:4px 10px;font-size:13px}}
p{{color:var(--muted);font-weight:800;font-size:14px;margin:6px 0 12px;line-height:1.35}}
.formas{{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;justify-items:center}}.formas div{{display:flex;flex-direction:column;align-items:center;gap:4px}}.formas small,.mini small{{color:var(--muted);font-weight:800;font-size:12px}}
.home{{margin-top:14px;border-radius:16px;padding:16px 10px;background:linear-gradient(160deg,#4A6FA5,#E39A6E)}}.fila{{display:flex;justify-content:space-around}}
.app{{display:flex;flex-direction:column;align-items:center;gap:5px;width:64px}}.app .ic{{width:52px;height:52px;border-radius:16px;opacity:.75}}.app span{{font-size:12px;font-weight:800;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.6)}}
.mini{{display:flex;align-items:center;gap:12px;margin-top:12px}}</style></head><body>
<h1>Ícono de Ruta B</h1><p class="intro">Cuatro opciones, cada una en las formas que usan distintos teléfonos, en una pantalla de inicio y en tamaño pequeño. La marcada en verde es la que puse en la app; si prefieres otra, la cambio.</p>
<div class="grid">{''.join(cards)}</div></body></html>'''
    open(salida, "w", encoding="utf-8").write(html)

def android(op):
    o = OPCIONES[op]
    def vec(capas, mono=False):
        ps = []
        for d, f, st, w, eo in capas:
            a = [f'android:pathData="{d}"']
            if f and not (mono and st): a.append(f'android:fillColor="{"#FFFFFFFF" if mono else f}"')  # en monocromo, lo que tiene contorno va solo con contorno
            if st: a += [f'android:strokeColor="{"#FFFFFFFF" if mono else st}"', f'android:strokeWidth="{w}"', 'android:strokeLineCap="round"', 'android:strokeLineJoin="round"']
            if eo: a.append('android:fillType="evenOdd"')
            ps.append("        <path " + " ".join(a) + "/>")
        return ('<?xml version="1.0" encoding="utf-8"?>\n<!-- Generado por tools/icono/iconos.py -->\n<vector xmlns:android="http://schemas.android.com/apk/res/android"\n'
                '    android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">\n' + f'    <group android:pivotX="54" android:pivotY="54" android:scaleX="{o.get("escala",1)}" android:scaleY="{o.get("escala",1)}">\n' + "\n".join(ps) + "\n    </group>\n</vector>\n")
    R = os.path.join(ROOT, "app/src/main/res")
    open(os.path.join(R, "drawable/ic_launcher_foreground.xml"), "w").write(vec(o["capas"]))
    # monocromo (íconos temáticos de Android 13+): solo la figura principal, sin fondo de color
    mono = [c for c in o["capas"] if not (c[2] and c[3] >= 10)]
    open(os.path.join(R, "drawable/ic_launcher_monochrome.xml"), "w").write(vec(mono, True))
    open(os.path.join(R, "mipmap-anydpi-v26/ic_launcher.xml"), "w").write(
        '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        '    <background android:drawable="@color/icon_bg" />\n    <foreground android:drawable="@drawable/ic_launcher_foreground" />\n'
        '    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />\n</adaptive-icon>\n')
    c = os.path.join(R, "values/colors.xml"); s = open(c).read()
    import re
    open(c, "w").write(re.sub(r'<color name="icon_bg">#[0-9A-Fa-f]+</color>', f'<color name="icon_bg">{o["bg"]}</color>', s))
    print("✓ ícono", op)

if __name__ == "__main__":
    if sys.argv[1] == "muestra": muestra(sys.argv[2])
    else: android(sys.argv[2])
