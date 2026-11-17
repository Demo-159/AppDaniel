#!/usr/bin/env python3
"""Preguntas con imagen a partir de figuras del libro (no señales del Anexo 1).
Cada figura se recorta del PDF (página + índice de imagen incrustada) y su pregunta se respalda
con una cita textual del libro, que el verificador comprueba igual que cualquier dato.
Requiere pymupdf. Uso: python3 tools/cobertura/figuras.py <ruta al PDF>"""
import io, json, os, sys
import pymupdf
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = "¿Qué indica este testigo del panel?"
TEST = ["Batería", "Presión de aceite", "Pastillas de freno desgastadas", "Freno de mano", "Error en sistema de frenos ABS",
        "Presión de neumáticos", "Luces neblineras encendidas", "Luces de posición y cruce encendidas", "Luces altas encendidas",
        "Luces bajas encendidas", "Avería de luces exteriores", "Luces de advertencia de peligro", "Airbag"]
def testigo(pg, k, name, cita, near):
    return dict(pg=pg, k=k, s="f1", u="u2", prompt=T, ans=name, opts=near, e=f"Es el testigo de {name.lower()}.", cita=cita)
F = [
 testigo(12, 0, "Batería", "Testigo batería", ["Presión de aceite", "Error en sistema de frenos ABS", "Avería de luces exteriores"]),
 testigo(12, 1, "Presión de aceite", "Testigo presión de aceite", ["Batería", "Presión de neumáticos", "Pastillas de freno desgastadas"]),
 testigo(16, 0, "Pastillas de freno desgastadas", "Testigo pastillas de freno desgastadas", ["Freno de mano", "Error en sistema de frenos ABS", "Presión de neumáticos"]),
 testigo(16, 1, "Freno de mano", "Testigo freno de mano", ["Pastillas de freno desgastadas", "Presión de neumáticos", "Luces de advertencia de peligro"]),
 testigo(16, 2, "Error en sistema de frenos ABS", "Testigo error en sistema de frenos ABS", ["Pastillas de freno desgastadas", "Freno de mano", "Presión de aceite"]),
 testigo(19, 0, "Presión de neumáticos", "Testigo presión de neumáticos", ["Freno de mano", "Pastillas de freno desgastadas", "Presión de aceite"]),
 testigo(21, 0, "Luces neblineras encendidas", "Testigo luces neblineras encendidas", ["Luces bajas encendidas", "Luces altas encendidas", "Luces de posición y cruce encendidas"]),
 testigo(21, 1, "Luces de posición y cruce encendidas", "Testigo luces de posición y cruce encendidas", ["Luces neblineras delanteras encendidas", "Luces altas encendidas", "Avería de luces exteriores"]),
 testigo(21, 2, "Luces altas encendidas", "Testigo luces altas encendidas", ["Luces bajas encendidas", "Luces neblineras encendidas", "Luces de posición y cruce encendidas"]),
 testigo(21, 3, "Luces bajas encendidas", "Testigo luces bajas encendidas", ["Luces altas encendidas", "Luces neblineras encendidas", "Avería de luces exteriores"]),
 testigo(21, 4, "Avería de luces exteriores", "Testigo avería de luces exteriores", ["Presión de aceite", "Luces neblineras encendidas", "Luces de advertencia de peligro"]),
 testigo(21, 5, "Luces de advertencia de peligro", "Testigo luces de advertencia de peligro", ["Avería de luces exteriores", "Error en sistema de frenos ABS", "Freno de mano"]),
 testigo(30, 0, "Airbag", "Testigo del Airbag", ["Batería", "Freno de mano", "Presión de neumáticos"]),
 dict(pg=13, k=0, s="f1", u="u2", prompt="En este indicador de combustible, ¿qué significa la letra E?", ans="Vacío (Empty)", opts=["Lleno (Full)", "Encendido", "Eléctrico"],
      e="E significa vacío, del inglés “Empty”, y F estanque lleno, del inglés “Full”.", cita="En el indicador de combustible, la letra E significa vacío, del inglés “Empty”"),
 dict(pg=18, k=0, s="f1", u="u2", prompt="Este dibujo del libro muestra un neumático con presión de aire…", ans="Demasiado baja", opts=["Correcta", "Demasiado alta", "Igual en todo el año"],
      e="El libro compara neumáticos con presión demasiado baja, correcta y demasiado alta.", cita="presión de los neumáticos Presión de aire demasiado baja"),
 dict(pg=18, k=24, s="f1", u="u2", prompt="Este dibujo del libro muestra un neumático con presión de aire…", ans="Demasiado alta", opts=["Correcta", "Demasiado baja", "Igual en todo el año"],
      e="Con presión demasiado alta se pierde la adherencia de los neumáticos.", cita="Se pierde la adherencia de los neumáticos."),
 dict(pg=77, k=0, s="f2", u="u7", prompt="¿Qué indica un carabinero en esta posición?", ans="Detención", opts=["Advertencia", "Avanzar", "Virar a la derecha"],
      e="Carabineros vistos de frente o de espalda indican detención.", cita="Carabineros vistos de frente o de espalda: indican detención."),
 dict(pg=77, k=2, s="f2", u="u7", prompt="¿Qué indica un carabinero en esta posición?", ans="Advertencia", opts=["Detención", "Avanzar", "Retroceder"],
      e="Con el brazo en alto indica advertencia: quienes están detenidos se preparan para avanzar y quienes tienen vía libre deben detenerse.", cita="Carabinero con el brazo en alto: indica advertencia."),
 dict(pg=77, k=3, s="f2", u="u7", prompt="¿Qué indica una carabinera en esta posición?", ans="Avanzar", opts=["Detención", "Advertencia", "Retroceder"],
      e="Vista de costado, autoriza para avanzar.", cita="Carabinera vista de costado: autoriza para avanzar."),
 dict(pg=78, k=1, s="f2", u="u7", prompt="¿Qué indica esta luz del semáforo?", ans="Paso", opts=["Detención", "Prevención", "Peligro"],
      e="Luz verde: indica paso. Aun así, no avances si después del cruce no tienes 10 metros libres.", cita="Luz verde: Indica paso."),
 dict(pg=78, k=0, s="f2", u="u7", prompt="¿Qué indica esta luz del semáforo?", ans="Prevención", opts=["Paso", "Detención", "Ceda el paso"],
      e="Luz amarilla: indica prevención; advierte que la roja aparecerá a continuación.", cita="Luz amarilla: Indica prevención."),
 dict(pg=78, k=2, s="f2", u="u7", prompt="¿Qué indica esta luz del semáforo?", ans="Detención", opts=["Paso", "Prevención", "Ceda el paso"],
      e="Luz roja: detente antes de la línea de detención hasta que se encienda la verde.", cita="Luz roja: Indica detención."),
 dict(pg=79, k=1, s="f2", u="u7", prompt="Ante estas luces del semáforo, ¿qué puedes hacer?", ans="Avanzar solo hacia la flecha", opts=["Avanzar en cualquier dirección", "Esperar la luz amarilla", "Virar en U con cuidado"],
      e="Con luz roja y flecha verde puedes entrar al cruce solo para seguir la dirección de la flecha, respetando a peatones y vehículos.", cita="pero sólo para continuar en la dirección indicada por la flecha"),
 dict(pg=79, k=0, s="f2", u="u7", prompt="¿Para quiénes es este cabezal del semáforo?", ans="Para ciclistas", opts=["Para buses", "Para peatones", "Para trenes"],
      e="Si estás virando, aunque tengas luz verde, los ciclistas tienen la preferencia.", cita="Semáforo con cabezal para ciclistas"),
 dict(pg=79, k=4, s="f2", u="u7", prompt="En un cruce ferroviario como este, si se enciende la luz blanca significa que…", ans="No se acerca un tren, pero igual verifica", opts=["Se acerca un tren y debes detenerte", "El cruce está cerrado por trabajos", "Puedes cruzar sin mirar a los lados"],
      e="La luz blanca indica que no se acerca un tren, lo que no significa que se pueda pasar sin peligro.", cita="la blanca indica que no se acerca alguno, lo que no significa que se pueda pasar sin peligro."),
 dict(pg=80, k=1, s="f2", u="u7", prompt="¿A quiénes afecta este semáforo?", ans="Solo a la pista exclusiva de buses", opts=["A todos los vehículos del cruce", "Solo a los ciclistas del cruce", "Solo a los peatones del cruce"],
      e="Los semáforos para transporte público afectan solo a los vehículos de la pista exclusiva; el verde puede ser blanco.", cita="Estos semáforos afectan sólo a los vehículos que circulan por la pista exclusiva."),
 dict(pg=80, k=0, s="f2", u="u7", prompt="En esta señal de mensaje variable, ¿qué indica la equis roja?", ans="Que la pista está cerrada", opts=["Que la pista es exclusiva", "Que viene un tren", "Que se puede adelantar"],
      e="La equis indica pista cerrada; la flecha, vía abierta.", cita="La equis, usualmente de color rojo, indica que la pista está cerrada."),
 dict(pg=82, k=1, s="f3", u="u7", prompt="¿Qué indica esta línea blanca discontinua (1)?", ans="Puedes traspasarla con precaución", opts=["No puedes traspasarla nunca", "Prohibido estacionar a su lado", "Es solo para buses"],
      e="Puedes cambiar de pista advirtiendo antes y sin imponer riesgos.", cita="Puedes traspasar estas líneas y cambiar de pista"),
 dict(pg=82, k=4, s="f3", u="u7", prompt="¿Qué indica esta línea continua (2)?", ans="No existen condiciones para traspasarla", opts=["Puedes traspasarla con precaución", "Solo pueden cruzarla los buses", "Es una zona de estacionamiento"],
      e="Por ejemplo, por poca visibilidad antes de una curva o un cambio de rasante.", cita="e indican que no existen condiciones de seguridad para que pueda ser traspasada."),
 dict(pg=82, k=5, s="f3", u="u7", prompt="Con esta línea mixta (3), ¿quién puede traspasarla?", ans="Quien circula por el lado segmentado", opts=["Quien circula por el lado continuo", "Nadie, en ningún caso", "Todos, con precaución"],
      e="Solo los vehículos del lado en que la línea es segmentada.", cita="sólo puede ser traspasada por los vehículos que circulan por el lado en que esta es segmentada."),
 dict(pg=82, k=0, s="f3", u="u7", prompt="La línea (4) marca el borde de calzada. ¿Puedes circular por la berma?", ans="No; solo en emergencias en zona rural", opts=["Sí, si vas más lento", "Sí, para adelantar por la derecha", "Sí, de noche con luces"],
      e="No debes circular por esta franja; solo en áreas rurales y en emergencias puedes quedarte en la berma.", cita="No debes circular por esta franja de seguridad lateral."),
 dict(pg=82, k=2, s="f3", u="u7", prompt="¿Dónde puedes encontrar demarcaciones amarillas como estas (5)?", ans="En caminos de montaña con nieve", opts=["En autopistas urbanas de alta velocidad", "En pistas exclusivas de buses", "En zonas escolares de la ciudad"],
      e="En caminos de montaña donde la nieve es frecuente, el eje y el borde pueden ser amarillos.", cita="en caminos de montaña donde la nieve es frecuente"),
 dict(pg=82, k=3, s="f3", u="u7", prompt="¿Qué indica esta franja amarilla continua en la solera (6)?", ans="Prohibido estacionar", opts=["Paso de peatones", "Pista para ciclos", "Zona de carga"],
      e="Señala la prohibición de estacionar a lo largo de ella.", cita="con el propósito de señalar la prohibición de estacionar a lo largo de esta"),
 dict(pg=83, k=5, s="f3", u="u7", prompt="¿Qué es la línea blanca transversal marcada (7)?", ans="La línea de detención", opts=["Un paso de cebra", "El inicio de una ciclovía", "Una zona de carga"],
      e="En un cruce con semáforo, los vehículos deben detenerse antes de ella.", cita="la línea blanca trasversal a la calzada que determina la línea de detención"),
 dict(pg=83, k=6, s="f3", u="u7", prompt="¿Para quiénes es la zona marcada (8) entre la línea de detención y el paso de peatones?", ans="Para ciclos y/o motocicletas", opts=["Para buses de transporte público", "Para vehículos de emergencia", "Para estacionar un momento"],
      e="Es la zona de espera especial para personas conductoras de ciclos y/o motocicletas.", cita="zona de espera especial para personas conductoras de ciclos y/o motociletas"),
 dict(pg=83, k=0, s="f3", u="u7", prompt="En este paso de cebra (9), ¿quién tiene prioridad?", ans="Las y los peatones", opts=["Los vehículos", "Quien llegue primero", "Los buses"],
      e="¡No lo olvides! En un paso de cebra, las y los peatones tienen prioridad.", cita="En un paso de cebra, las y los peatones tienen prioridad."),
 dict(pg=83, k=2, s="f3", u="u7", prompt="¿Qué indican estas líneas amarillas en cuadros (10)?", ans="No quedar detenido en el cruce", opts=["Zona habilitada para estacionar", "Paso especial de peatones", "Zona exclusiva de buses"],
      e="Solo puedes cruzar si a la salida hay espacio suficiente para no quedar detenido en él.", cita="a fin de no quedar detenidas en la intersección."),
 dict(pg=83, k=1, s="f3", u="u7", prompt="¿Qué tipo de demarcación es la leyenda LENTO (11)?", ans="De símbolos y leyendas", opts=["De no bloquear cruce", "De paso de cebra", "De borde de calzada"],
      e="Indican maniobras permitidas y acciones que se deben realizar, y advierten peligros.", cita="Demarcación de símbolos y leyendas"),
 dict(pg=83, k=4, s="f3", u="u7", prompt="¿Puedes circular sobre esta área achurada (13)?", ans="No, ni estacionar sobre ella", opts=["Sí, si hay mucha congestión", "Sí, solo para adelantar", "Sí, para detenerte un momento"],
      e="No debes circular, menos aún estacionar, sobre las áreas achuradas.", cita="No debes circular, menos aún estacionar, sobre estas áreas achuradas"),
 dict(pg=86, k=5, s="f4", u="u8", prompt="¿Qué indica quien conduce con el brazo así?", ans="Viraje a la izquierda", opts=["Viraje a la derecha", "Detención", "Adelantamiento"],
      e="Brazo extendido horizontalmente: viraje a la izquierda.", cita="Brazo extendido horizontalmente indica viraje a la izquierda."),
 dict(pg=86, k=3, s="f4", u="u8", prompt="¿Qué indica quien conduce con el brazo así?", ans="Viraje a la derecha", opts=["Viraje a la izquierda", "Detención", "Adelantamiento"],
      e="Brazo en ángulo recto hacia arriba: viraje a la derecha.", cita="Brazo en ángulo recto hacia arriba indica viraje a la derecha."),
 dict(pg=86, k=4, s="f4", u="u8", prompt="¿Qué indica quien conduce con el brazo así?", ans="Disminución de velocidad o detención", opts=["Viraje a la izquierda en el cruce", "Viraje a la derecha en el cruce", "Que lo puedes adelantar ahora"],
      e="Brazo extendido hacia abajo: disminución de velocidad o detención.", cita="Brazo extendido hacia abajo indica disminución de velocidad o detención."),
 dict(pg=105, k=4, s="f4", u="u9", prompt="¿Qué agrega la leyenda bajo esta señal?", ans="Limita la prohibición a ciertos horarios", opts=["Permite estacionar durante todo el día", "Prohíbe también detenerse en el lugar", "Reserva el lugar solo para los buses"],
      e="La señal puede complementarse con leyendas que limiten la prohibición a días u horarios.", cita="La señal anterior puede complementarse con leyendas que limiten el alcance de la prohibición"),
 dict(pg=105, k=5, s="f4", u="u9", prompt="Donde está esta señal, ¿puedes estacionar?", ans="Sí, pero permaneciendo en el vehículo", opts=["Sí, todo el tiempo que quieras", "No, nunca", "Solo de noche"],
      e="Debes permanecer en tu vehículo para retirarlo cuando llegue quien goza de la reserva.", cita="Puedes estacionar donde exista esta señal, pero debes permanecer en tu vehículo"),
 dict(pg=112, k=0, s="f5", u="u10", prompt="Los vehículos de carga y locomoción colectiva llevan luces amarillas frontales arriba en los extremos. ¿Qué indican?", ans="Su ancho y altura máxima", opts=["Que van a virar", "Que llevan carga peligrosa", "Que van a detenerse"],
      e="También deben llevar luces rojas en los extremos superiores traseros.", cita="que indican el ancho y altura máxima."),
 dict(pg=112, k=1, s="f5", u="u10", prompt="¿Qué luces debe llevar atrás este tipo de vehículo?", ans="Luz roja fija, de freno y dos de viraje", opts=["Solo una luz roja fija", "Dos luces blancas de retroceso", "Cuatro luces amarillas"],
      e="Motocicletas y motonetas: adelante un foco con luces altas y bajas; atrás luz roja fija, luz de freno y dos de viraje.", cita="Parte trasera: luz roja fija, luz de freno y dos luces destellantes de viraje."),
 dict(pg=112, k=3, s="f5", u="u10", prompt="¿Qué luz debe llevar atrás este tipo de vehículo?", ans="Una luz roja fija", opts=["Una luz blanca fija", "Dos luces de freno", "Ninguna luz"],
      e="Triciclos y bicicletas: adelante un foco de luz frontal; atrás luz roja fija.", cita="Parte delantera: un foco que proyecta luz frontal. Parte trasera: luz roja fija."),
 dict(pg=112, k=4, s="f5", u="u10", prompt="Si tu vehículo sufre una falla y estacionas en una vía sin alumbrado, ¿qué debes instalar con anticipación?", ans="El triángulo para casos de emergencia", opts=["Un cono de color verde en la berma", "Una luz neblinera trasera encendida", "Una bandera de color blanco en el techo"],
      e="Estaciona al lado derecho y, si funciona el sistema eléctrico, enciende las intermitentes.", cita="es importante que instales con anticipación el triángulo para casos de emergencia."),
]
SES = [("f1", "Testigos e indicadores del vehículo"), ("f2", "Carabineros y semáforos"), ("f3", "Demarcaciones"), ("f4", "Señales de brazo y de estacionamiento"), ("f5", "Luces de otros vehículos")]

def main(pdf):
    doc = pymupdf.open(pdf)
    os.makedirs(os.path.join(ROOT, "app/src/main/assets/img/figuras"), exist_ok=True)
    cpath = os.path.join(ROOT, "app/src/main/assets/content.json")
    content = json.load(open(cpath, encoding="utf-8"))
    qs = [q for q in content["questions"] if "-f" not in q["id"]]
    datos = []
    for n, f in enumerate(F):
        p = doc[f["pg"] - 1]
        b = pymupdf.Rect(p.get_image_info()[f["k"]]["bbox"])
        im = Image.open(io.BytesIO(p.get_pixmap(dpi=200, clip=b).tobytes("png"))).convert("RGB")
        im.thumbnail((480, 480))
        rel = f"img/figuras/p{f['pg']}_{f['k']}.webp"
        im.save(os.path.join(ROOT, "app/src/main/assets", rel), "WEBP", quality=80)
        qid = f"{f['u']}-f{n:02d}"
        qs.append({"id": qid, "unit": f["u"], "lesson": 0, "type": "img", "prompt": f["prompt"], "options": [f["ans"]] + f["opts"],
                   "explain": f["e"], "page": f["pg"], "image": rel})
        datos.append({"id": f"fig-{n:02d}", "p": f["pg"], "s": f["s"], "q": [qid], "cita": f["cita"], "imagen": rel})
    content["questions"] = qs
    json.dump(content, open(cpath, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    out = {"capitulo": 12, "titulo": "Figuras del libro (preguntas con imagen)", "unidades": [], "paginas": [12, 112],
           "sesiones": [{"id": a, "titulo": b} for a, b in SES], "datos": datos, "sin_dato": []}
    json.dump(out, open(os.path.join(ROOT, "tools/cobertura/datos/capitulo-12.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(F), "preguntas con figura")

if __name__ == "__main__":
    main(sys.argv[1])
