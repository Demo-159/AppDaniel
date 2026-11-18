#!/usr/bin/env python3
"""Preguntas situacionales (casos de manejo): cada una describe una situación y su respuesta correcta es una
regla textual del libro. Cada pregunta se cuelga del dato que la respalda (id del dato), así se practica en la
sesión que enseña ese dato. La primera opción es la correcta (la app baraja).

Agrega o actualiza las preguntas en app/src/main/assets/content.json, y el id de la pregunta en el "q" del dato
(tools/cobertura/datos/capitulo-N.json y spec/capitulo-N.json, para que agregar.py no lo pierda).
Uso: python3 tools/cobertura/situacionales.py   (luego verificar_datos.py)
"""
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# (dato, pregunta, [correcta, d1, d2, d3], explicación)
Q = [
 ("c2-10", "Vas por carretera y se enciende la luz de presión de aceite. Te faltan 20 km para llegar. ¿Qué haces?",
  ["Detengo el motor de inmediato y no sigo hasta repararlo", "Sigo despacio los 20 km y lo reviso apenas llegue", "Agrego líquido refrigerante y continúo el viaje normal", "Bajo a segunda marcha y sigo con cuidado hasta un taller"],
  "Si se enciende la luz de presión de aceite, debes detener el motor de inmediato y no ponerlo en marcha hasta haberlo reparado: le puedes causar averías graves."),
 ("c2-29", "Subiendo una cuesta larga, la aguja de temperatura del motor sube hacia la H. ¿Qué haces?",
  ["Detengo la marcha y reparo la avería", "Acelero para terminar pronto la subida", "Sigo y agrego agua fría al llegar", "Enciendo la calefacción y continúo"],
  "Si la temperatura del motor se eleva, debes detener la marcha y reparar la avería."),
 ("c2-77", "En carretera revienta un neumático trasero y la cola del auto se desvía hacia la derecha. ¿Hacia dónde giras el volante?",
  ["Hacia la derecha, hacia donde se va la cola", "Hacia la izquierda, contra el lado de la cola", "A ningún lado: mantengo el volante recto", "Primero freno a fondo y luego giro a la izquierda"],
  "Si se revienta un neumático trasero, debes girar el volante hacia el lado en que se desvía la cola, y detenerte lentamente al costado de la vía."),
 ("c2-78", "Vas por carretera y revienta un neumático delantero. ¿Qué haces?",
  ["Freno suave, sujeto firme el volante y me detengo al costado", "Freno a fondo de inmediato para detenerme lo antes posible", "Acelero un poco para estabilizar el auto y luego me orillo", "Suelto el volante para que el auto se enderece por sí solo"],
  "Si se revienta un neumático delantero, debes frenar de forma suave sosteniendo el volante firmemente, y detenerte lentamente al costado de la vía."),
 ("c2-133", "En un auto de tracción delantera aceleras fuerte y las ruedas delanteras patinan: el auto no gira. ¿Qué haces?",
  ["Dejo de acelerar y retomo mi trayectoria", "Acelero más para que las ruedas agarren", "Freno a fondo y giro el volante al máximo", "Pongo neutro y giro hacia el lado contrario"],
  "Con tracción delantera, si las ruedas resbalan por acelerar más de lo que permite la fricción, deja de acelerar y retoma tu trayectoria."),
 ("c2-135", "En un auto de tracción trasera, las ruedas pierden fricción y la cola da coletazos. ¿Qué haces?",
  ["Sigo acelerando y giro la dirección hacia la trayectoria", "Dejo de acelerar de golpe y freno a fondo hasta detenerme", "Pongo neutro y suelto el volante para que el auto se enderece", "Giro el volante hacia el lado contrario a la trayectoria"],
  "Con tracción trasera, si las ruedas pierden fricción y hay coletazos, continúa acelerando y gira la dirección hacia la trayectoria."),
 ("c2-127", "Un perro cruza de improviso. Tu auto no tiene ABS y, al frenar fuerte, las ruedas se bloquean. ¿Qué haces?",
  ["Reduzco en seguida la presión, soltando el pedal", "Mantengo el pedal a fondo hasta detenerme del todo", "Tiro el freno de mano con fuerza para frenar más", "Pongo neutro y sigo frenando a fondo con el pedal"],
  "Si el vehículo no cuenta con ABS y se bloquean las ruedas, hay que reducir en seguida la presión sobre el pedal de freno, soltándolo."),
 ("c2-69", "Acabas de lavar el auto y sales a la calle. ¿Qué conviene hacer con los frenos?",
  ["Probarlos frenando a baja velocidad", "Nada: los frenos no se ven afectados", "Frenar fuerte una vez a alta velocidad", "Esperar a que se sequen con el sol"],
  "Si has lavado el vehículo, comprueba el funcionamiento de los frenos con pruebas de frenado a baja velocidad."),
 ("c2-140", "Viajan seis personas y en el asiento trasero falta un cinturón. Alguien propone que dos niños usen el mismo. ¿Qué haces?",
  ["No: nunca dos personas con un mismo cinturón", "Sí, porque son niños pequeños y caben bien juntos", "Sí, si el viaje es corto y es solo por la ciudad", "Sí, si van sentados atrás y el auto va despacio"],
  "Nunca permitas que dos personas viajen sujetas con un mismo cinturón."),
 ("c2-178", "Te subes a un auto prestado y el apoya cabezas te queda a la altura del cuello. ¿Qué haces?",
  ["Lo subo hasta entre el tope de la cabeza y los ojos", "Lo dejo así: a la altura del cuello protege mejor la nuca", "Lo bajo del todo para tener más visibilidad hacia atrás", "Lo saco del asiento para que no me moleste al conducir"],
  "El borde superior del apoya cabezas debe quedar entre el límite superior de la cabeza y la altura de los ojos; nunca por debajo de tu cabeza."),
 ("c4-143", "Llevas tres horas manejando: bostezas y se te cierran los ojos. ¿Qué haces?",
  ["Me detengo en un lugar adecuado y duermo 20 a 30 minutos", "Subo la calefacción para estar más cómodo y sigo manejando", "Tomo un café en el camino y sigo sin detenerme a dormir", "Bajo la velocidad y pongo música fuerte hasta llegar"],
  "Si sientes cansancio o sueño, lo mejor es detenerte en un lugar adecuado y dormir: 20 o 30 minutos de sueño son suficientes en la mayoría de los casos."),
 ("c4-144", "Vas a manejar cinco horas por carretera. ¿Cómo planificas los descansos?",
  ["Descanso 20 a 30 minutos cada 2 horas como máximo", "Descanso solo cuando empiezo a sentir sueño al volante", "Descanso 10 minutos una sola vez, a mitad del viaje", "Manejo de corrido para llegar antes y descansar allá"],
  "En viajes largos, descansa al menos 20 a 30 minutos cada 2 horas o 200 kilómetros de conducción, como máximo."),
 ("c4-133", "Puedes salir de viaje a las 4 de la madrugada o a las 9 de la mañana. Pensando en el sueño, ¿qué conviene?",
  ["Salir a las 9: de 3 a 5 h aparece más la somnolencia", "Salir a las 4: hay menos tráfico y menos sueño", "Da lo mismo la hora si la noche anterior dormí lo suficiente", "Salir a las 4 y tomar varios cafés durante el camino"],
  "La madrugada, especialmente entre las 3 y las 5 horas, es especialmente favorable para la aparición de somnolencia, aunque hayas dormido lo suficiente."),
 ("c4-86", "Anoche bebiste hasta tarde y dormiste cuatro horas. En la mañana te sientes bien. ¿Puedes conducir seguro?",
  ["No: dormir pocas horas no garantiza eliminar el alcohol", "Sí: si me siento bien, ya no me queda alcohol en la sangre", "Sí, si tomo un café cargado y me ducho antes de salir", "Sí, si conduzco despacio y solo por calles de la ciudad"],
  "Dormir pocas horas no garantiza la metabolización total del alcohol, lo que provoca una conducción insegura."),
 ("c4-85", "Tomaste dos cervezas. Un amigo te dice que un café y una ducha fría te dejan listo para manejar. ¿Es cierto?",
  ["No: la eliminación del alcohol no se puede apresurar", "Sí, el café ayuda a eliminar el alcohol más rápido", "Sí, la ducha fría baja la alcoholemia en pocos minutos", "Solo si además comes algo dulce y esperas media hora"],
  "La metabolización no se puede apresurar: no se acelera con un café, comer dulces, fumar, una ducha fría o ejercicio."),
 ("c4-74", "En un asado te ofrecen “solo una copa” antes de manejar de vuelta. ¿Qué haces?",
  ["La rechazo: la única tasa segura para conducir es 0", "La acepto: una sola copa no afecta mi forma de conducir", "La acepto si espero 15 minutos antes de salir a manejar", "La acepto si como bastante antes de manejar de vuelta"],
  "La única tasa de alcohol segura para conducir es 0. Si vas a beber, no conduzcas."),
 ("c4-121", "Te recetan un medicamento nuevo y mañana debes manejar. ¿Qué haces?",
  ["Le pregunto al médico por sus riesgos para conducir", "Lo tomo igual: si es recetado, no puede afectar al manejar", "Dejo de tomarlo ese día sin avisarle a nadie", "Lo tomo con un café cargado para no tener sueño"],
  "Cuando vayas a consumir medicamentos, debes consultar al médico sobre los posibles riesgos para la conducción."),
 ("c5-26", "Delante tuyo, un vehículo de transporte escolar se detiene en la calzada. ¿Qué haces?",
  ["Reduzco y me preparo para detenerme: pueden bajar niños", "Lo adelanto rápido antes de que empiecen a bajar los niños", "Toco la bocina para avisar que voy a pasar por el lado", "Sigo igual: el conductor del transporte escolar los cuida"],
  "Debes estar preparado para detener tu vehículo cuando pases a un vehículo de transporte escolar detenido: puede haber niñas y niños subiendo o bajando."),
 ("c5-22", "Una pelota sale rodando a la calle desde entre dos autos estacionados. ¿Qué haces?",
  ["Freno y me preparo: puede salir un niño detrás", "Sigo igual: es solo una pelota y no hay nadie a la vista", "Toco la bocina fuerte y mantengo la misma velocidad", "La esquivo por la izquierda acelerando un poco"],
  "Niñas y niños pueden no ser vistos cuando juegan detrás de un vehículo estacionado, y muchos siniestros ocurren cuando cruzan repentinamente corriendo."),
 ("c5-36", "Vas detrás de un ciclista en una calle angosta; viene un auto de frente y no puedes dejarle 1,5 m al adelantarlo. ¿Qué haces?",
  ["Espero detrás hasta poder dejarle al menos 1,5 m", "Lo adelanto rápido dejando el espacio que se pueda", "Toco la bocina para que se haga a un lado", "Lo adelanto por la derecha, por la berma"],
  "Al adelantar a una persona ciclista, la normativa indica que debes dejar un espacio lateral de al menos 1,5 metros."),
 ("c5-44", "Estacionaste junto a una ciclovía y vas a bajar del auto. ¿Qué haces antes de abrir la puerta?",
  ["Miro si viene una persona ciclista", "Nada: la ciclovía no es parte de la calle", "Toco la bocina para avisar que bajo", "Abro rápido para no molestar a nadie"],
  "Si tuvieras que bajar de tu vehículo cerca de una ciclovía, procura mirar si viene una persona ciclista antes de abrir la puerta."),
 ("c6-46", "Tienes luz verde y vas a virar a la izquierda. De frente viene un auto que sigue derecho. ¿Quién pasa primero?",
  ["El otro auto: al virar no tengo preferencia", "Yo, porque tengo luz verde y el otro debe esperar", "Yo, porque llegué primero al cruce y ya estoy dentro", "El que toque primero la bocina para avisar"],
  "Cuando tengas el propósito de virar, carecerás de toda preferencia."),
 ("c6-09", "Tienes luz verde, pero pasado el cruce el tránsito está detenido y no hay 10 m libres en tu pista. ¿Qué haces?",
  ["Espero antes del cruce hasta tener 10 m libres", "Avanzo: tengo luz verde y por eso la preferencia", "Avanzo y me detengo dentro del cruce si hace falta", "Me cambio de pista dentro del cruce para avanzar"],
  "Aun teniendo luz verde, no avances si pasado el cruce no tienes a lo menos 10 metros expeditos en tu pista de circulación."),
 ("c6-13", "La luz cambia a amarilla cuando estás tan cerca del cruce que ya no puedes detenerte con seguridad. ¿Qué haces?",
  ["Continúo con precaución", "Freno de golpe aunque quede en el cruce", "Acelero al máximo para pasar antes de la roja", "Retrocedo para quedar antes de la línea"],
  "Si la luz amarilla te sorprende tan próximo al cruce que ya no puedes detenerte con suficiente seguridad, continúa con precaución."),
 ("c6-104", "Vas subiendo una cuesta y no ves lo que hay al otro lado de la cima. ¿Qué haces?",
  ["Reduzco la velocidad al acercarme a la cima", "Mantengo la velocidad: al otro lado no suele haber nada", "Adelanto al de adelante antes de la cima", "Acelero para no perder impulso en la subida"],
  "Debes reducir la velocidad al aproximarte a la cima de una cuesta."),
 ("c6-127", "Estás adelantando a un camión largo y aparece un vehículo en sentido contrario. ¿Qué haces?",
  ["Interrumpo el adelantamiento y vuelvo a mi pista", "Acelero al máximo para terminar de pasar al camión", "Sigo y le hago cambio de luces al que viene de frente", "Me quedo a la par del camión hasta que pase"],
  "Si aparece un vehículo en sentido contrario o sientes inseguridad, interrumpe el adelantamiento en lugar de hacerlo sin certeza."),
 ("c6-132", "A unos 150 metros hay un puente y el camión de adelante va lento. ¿Puedes adelantarlo ahora?",
  ["No: está prohibido a menos de 200 m de un puente", "Sí, si lo hago rápido y alcanzo a volver antes del puente", "Sí, si no viene nadie en sentido contrario", "Sí, si el camión me hace una seña con el intermitente"],
  "No puedes adelantar en un puente, viaducto, túnel o cruce ferroviario, ni al aproximarte a ellos desde una distancia mínima de 200 metros."),
 ("c6-149", "Encuentras un espacio libre para estacionar a 3 metros de un grifo. ¿Puedes estacionar ahí?",
  ["No: debo dejar al menos 5 metros del grifo", "Sí, si me quedo dentro del auto mientras tanto", "Sí, si es solo por unos pocos minutos", "Sí, porque basta con dejar 2 metros libres"],
  "No debes estacionar a menos de 5 metros de un grifo para incendios."),
 ("c6-45", "Llegas a un cruce sin semáforo ni señales al mismo tiempo que un auto que viene por tu derecha. ¿Quién pasa?",
  ["El auto que viene por mi derecha", "Yo, si voy por la calle más ancha", "El que vaya más rápido", "Yo, porque el otro debe ver mi señal"],
  "En un cruce sin semáforo, sin Carabineros y sin señales PARE o Ceda el Paso, siempre debes dar preferencia a quienes se aproximan por tu derecha."),
 ("c7-12", "De noche, en un camino rural con luces altas, ves acercarse de frente a una persona en bicicleta. ¿Qué haces?",
  ["Cambio a luces bajas para no cegarla", "Mantengo las altas para verla mejor", "Apago las luces un momento para que pase", "Le hago cambios de luces seguidos para avisarle"],
  "Al encontrarte con un vehículo de frente debes cambiar a luces bajas para no cegar a quien lo conduce; esto incluye a los ciclistas."),
 ("c7-39", "Entras a la autopista y, al final de la pista de aceleración, no hay una brecha segura. ¿Qué haces?",
  ["Me detengo hasta que se produzca una brecha", "Entro igual: los que van por la autopista deben frenar", "Sigo por la berma hasta encontrar espacio", "Toco la bocina y entro despacio a la autopista"],
  "Los vehículos que circulan por la autopista tienen la prioridad. En caso de no encontrar una brecha segura, detente hasta que esta se produzca."),
 ("c7-62", "Llueve y, al frenar, sientes que el auto comienza a patinar. ¿Qué haces?",
  ["Suelto el freno completamente para recuperar tracción", "Freno más fuerte todavía para detenerme antes", "Tiro el freno de mano para ayudar a detener el auto", "Giro el volante bruscamente hacia el otro lado"],
  "En caso de que el vehículo comience a patinar, suelta el freno completamente para recuperar la tracción de las ruedas."),
 ("c7-77", "Conduces de noche y comienza a nevar. ¿Qué luces usas?",
  ["No uso luces altas: no atraviesan los copos", "Luces altas, para ver más lejos entre los copos", "Solo las luces de estacionamiento, para no encandilar", "Luces altas junto con las luces intermitentes"],
  "No conviene encender las luces altas cuando esté nevando, porque estas no atraviesan la cortina de copos de nieve."),
 ("c9-10", "Tras un choque, un motociclista con casco está tendido en el suelo. ¿Qué haces con el casco?",
  ["No se lo quito", "Se lo quito para que respire mejor", "Se lo quito para revisarle la cabeza", "Lo dejo, pero le suelto la correa y lo giro"],
  "Si la persona es motociclista o ciclista con casco, no debes quitárselo nunca: podrías provocar una lesión en la columna cervical."),
 ("c9-11", "Una persona lesionada en un siniestro te pide agua mientras esperan la ambulancia. ¿Qué haces?",
  ["No le doy de comer ni de beber", "Le doy un poco de agua para calmarla", "Le doy agua con azúcar", "Le doy agua si está consciente"],
  "No abandones a la víctima, a menos que sea para solicitar ayuda, y por ningún motivo le des algo de comer o beber."),
 ("c9-57", "Bajando una cuesta, los frenos dejan de responder. Alguien te grita que apagues el motor. ¿Qué haces?",
  ["No lo apago: perdería la dirección asistida", "Lo apago de inmediato para que el auto frene", "Lo apago y tiro el freno de mano con fuerza", "Lo apago y pongo neutro para bajar más lento"],
  "No apagues el motor: podría desactivar la dirección asistida y perderías el control. Bombea el pedal, usa el freno de mano suave y busca una pista de emergencia."),
 ("c8-24", "Un banderero te detiene por trabajos en la vía y te avisa que la espera será de unos cinco minutos. ¿Qué haces?",
  ["Apago el motor mientras espero", "Lo dejo encendido: así gasto menos", "Lo dejo acelerando un poco", "Lo dejo encendido con el aire puesto"],
  "En cualquier detención mayor a un minuto, es más económico apagar el motor y volverlo a encender después."),
]

def main():
    cpath = os.path.join(ROOT, "app/src/main/assets/content.json")
    C = json.load(open(cpath, encoding="utf-8"))
    byid = {q["id"]: q for q in C["questions"]}
    datos = {}
    for f in glob.glob(os.path.join(ROOT, "tools/cobertura/datos/capitulo-*.json")):
        D = json.load(open(f, encoding="utf-8"))
        for x in D["datos"]: datos[x["id"]] = (f, D, x)
    tocados = {}
    for n, (did, prompt, opts, exp) in enumerate(Q, 1):
        qid = f"sit-{n:03d}"
        f, D, x = datos[did]
        base = next((byid[q] for q in x["q"] if q in byid), None)
        q = {"id": qid, "unit": base["unit"], "lesson": base["lesson"], "type": "mc", "prompt": prompt,
             "options": opts, "explain": exp, "page": x["p"]}
        if qid in byid: byid[qid].update(q)
        else: C["questions"].append(q); byid[qid] = q
        if qid not in x["q"]: x["q"].append(qid)
        tocados[f] = D
        # spec: el dato con la misma cita
        sp = f.replace("/datos/", "/spec/")
        if os.path.exists(sp):
            S = tocados.setdefault(sp, json.load(open(sp, encoding="utf-8")))
            for y in S["datos"]:
                if y.get("cita") == x["cita"]:
                    y.setdefault("q", [])
                    if qid not in y["q"]: y["q"].append(qid)
                    break
            else: print("⚠ sin dato en spec:", did)
    for f, D in tocados.items(): json.dump(D, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(C, open(cpath, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"✓ {len(Q)} preguntas situacionales")

if __name__ == "__main__":
    main()
