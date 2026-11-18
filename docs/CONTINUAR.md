# Guía para continuar el proyecto (traspaso entre sesiones de Claude)

Lee primero `CLAUDE.md` (reglas obligatorias). Este documento explica **qué hay hecho, cómo funciona, qué
decidió el usuario y qué falta**. Rama de trabajo: `ccr-1f53c81c-x7wtxu`. No abrir PR salvo que se pida.

---

## 1. Qué es

**Ruta B**: app Android nativa (Kotlin + Jetpack Compose), gamificada al estilo Duolingo, para estudiar el
*Libro para la Conducción en Chile – Clase B* (CONASET, feb. 2026; PDF en la raíz del repo) y aprobar el
examen teórico. Objetivo del usuario: **máxima retención y cubrir el libro completo, hasta los datos más
específicos** (p. ej. la silla de bebé), porque el examen puede preguntar cualquier cosa.

El usuario habla español (Chile) y prueba todo desde el teléfono. Responde siempre en español.

## 2. Decisiones del usuario (ya aprobadas, no volver a discutir)

| Tema | Decisión |
|---|---|
| Fidelidad | **Regla primordial**: todo fiel al libro (términos, cifras, formulaciones, matices). Nada inventado. Ver `CLAUDE.md`. |
| Estructura | **Mapa-camino** con paradas, **nada bloqueado**. Por capítulo: sesiones con tutor → repaso ⛽ (gasolinera) → prueba de capítulo 🏁. Al final, simulacro 🏆. |
| Sesión con tutor | Estilo "Synthesis Tutor": **como un video, pero interactivo**. Avanza sola (sin "Siguiente" a cada rato), voz + **gráficos** (no texto, no fórmulas), una interacción a mitad (elige / desliza), luego práctica. Al hacer la pregunta, la pregunta se ve en pantalla y hay opción de "explicar de nuevo" (más concisa). Datos clave aparecen en pantalla, no solo en la voz. Pocos elementos en pantalla a la vez. |
| Voz | edge-tts **Giuseppe** (`it-IT-GiuseppeMultilingualNeural`) hablando **solo español neutro**. Velocidades siempre completas ("sesenta kilómetros por hora"). Sin muletillas ("Bueno", "A ver", "Mira", "Oye"). Con pausas, no apurada. |
| Sonidos | Freno: suave y bajo (al usuario le molestó fuerte). |
| Voz y frases cortas | Con frases muy cortas (nombres de señales sueltos, "Luz verde: indica paso") Giuseppe se pasa al italiano. Dar contexto en español ("Esta es la señal de…") y revisar **toda** advertencia de `--revisar-voz` con probabilidad de español baja: no son falsas alarmas (el usuario lo notó en las señales de advertencia). |
| Voz (nov. 2026) | **No cambiar la voz** (lo pidió explícitamente). Evitar la palabra "Exacto": con Giuseppe suena mal; usar "Así es". |
| Producción | Las sesiones planas le parecieron "muy poco producidas": cada paso lleva `fondo` (escenario animado que cambia), transiciones, mascota Cono que habla y sonidos suaves. |
| Distractores | Deben ser del **mismo tema** y plausibles; nada de opciones de otro tema que delaten la correcta. |
| Nada sin enseñar | **Ninguna pregunta puede aparecer sin haberse enseñado antes** (regla del usuario, obligatoria). Cada pregunta se practica en la última sesión de sus datos; la demo solo carga preguntas de sesiones con guion. Revisar cada capítulo nuevo con `python3 tools/sesiones/auditar.py N`. |
| Práctica | Va **fuera** de la sesión con tutor, como lección aparte con el estilo de la app (Comprobar, franja verde/roja). La sesión termina con "Practicar lo aprendido" → `index.html#practica=<id>`. |
| Preguntas en la sesión | Deben exigir entender lo explicado: opciones del **mismo tipo** y plausibles (p. ej. menos / más / los mismos), nunca una absurda como "es cuestión de mala suerte". Solo sobre lo que se acaba de enseñar, nunca antes de enseñarlo, sin hipotéticos ni frases de relleno ("Te toca a ti", "Veamos si quedó claro"). **Un solo intento**: si falla, se marca la correcta y la voz dice `mal` (que ya da la respuesta); no se vuelve a preguntar. |
| Explicar el porqué | No basta con nombrar un dato: explicar el razonamiento paso a paso, una idea por paso (p. ej. la noche: si fuera azar, menos autos → menos siniestros; pero de noche hay muchos fallecidos). |
| Escenas que explican (aprobado) | Las 7 sesiones del capítulo 1 usan escenas `anim` hechas para cada concepto, que **actúan** lo que dice la voz; cada parte aparece cuando la voz dice su palabra (`data-w`, `data-h`). Escenas en `tools/sesiones/escenas/capitulo-N.js`; fondo `liso`. Comprobar que cada `data-w` esté en la frase de su paso (si no, aparece de golpe al inicio). Cada escena ocurre en un **lugar que cuente algo** (hospital, mapa de Chile, parabrisas, carretera con animitas…), nunca íconos sobre un recuadro vacío. Cifras grandes: **contador que sube cuando la voz dice el número** (`data-to` + `data-w`); **nunca "ícono = 100"** (confunde). Solo conteos literales (4–5 velas por día, 9 de cada 10). |
| Pantalla completa | La escena `anim` ocupa **toda la pantalla** (capa `#escena`): su `<svg>` se extiende arriba y abajo con el color del borde (primer rect a lo ancho arriba, último abajo; si el suelo es un `path`, agregar un rect fino abajo con su color). Los textos van abajo. **Nunca poner elementos encima de un emoji** (🌎 cambia según el teléfono: los choques caían en el mar). |
| Transiciones | Sin sonido al cambiar de escena (sonaba raro), sin desenfoque, sin zoom y **un solo escenario a la vez**: oscurecer, cambiar y aclarar. Fundir dos SVG animados hacía que el teléfono los dibujara por bloques. |
| Preguntas | Formato del examen real: **selección única con 4 opciones** y **"Marque dos/tres respuestas"**. **Sin verdadero/falso.** Preguntas con **imágenes del propio libro** (señales y figuras). |
| Simulacro | Como el examen real: **35 preguntas, 3 de doble puntaje, 38 puntos, aprueba con 33, 45 minutos**, resultado por capítulo. |
| Demos | Rápidos y poco producidos, para aprobar antes de pulir. Publicar como Artifact y dar el link. |

Lecciones aprendidas de las críticas del usuario: el inicio de cada sesión debe decir de qué trata; no
pedir dos veces la misma interacción; no usar "Calcular la distancia" sin decir para qué; usar los nombres
del libro ("distancia de reacción", "tiempo normal de reacción"…); el fondo animado no debe verse cortado; el
auto debe ir hacia adelante; interfaces simples, nada saturado.

## 3. Mapa del repositorio

```
CLAUDE.md                         reglas del proyecto (obligatorias)
Libro_para_..._27-02-2026.pdf     el libro (fuente de verdad)
app/                              app Android
  src/main/assets/content.json    unidades + 920 preguntas (ver §4)
  src/main/assets/img/senales/    196 señales recortadas del libro (sNNN.webp)
  src/main/assets/img/figuras/    59 figuras recortadas del libro (pPAG_K.webp)
  src/main/java/com/appdaniel/rutab/
    data/Models.kt                modelo de pregunta (type, options, answers, image…)
    ui/screens/LessonScreen.kt    pantalla de preguntas (BookImage, multi con "picks")
    Session.kt, AppViewModel.kt   flujo de lecciones/simulacro, progreso, XP, racha
  src/test/…                      LogicTest (consistencia de content.json) + Paparazzi (capturas)
tools/cobertura/                  cobertura del libro dato por dato (ver §5)
tools/sesiones/                   MOTOR DE SESIONES CON TUTOR (ver §6)  ← trabajo actual
tools/demo-app/                   demo web de la app completa con el diseño aprobado (ver §7)
tools/clases/, tools/shorts/      enfoques anteriores (videos); ya NO se usan, solo referencia
release/RutaB-1.0.apk             APK antiguo (anterior al rediseño)
```

`README.md` describe la versión 1.0 de la app y está desactualizado (habla de verdadero/falso y 265
preguntas). Actualizarlo cuando se porte el rediseño.

## 4. Banco de preguntas (`content.json`)

- `questions[]`: `{id, unit, lesson, type, prompt, options, explain, page, image?, answers?}`.
- Tipos: `mc` (4 opciones, **la primera es la correcta**; la app baraja), `img` (como mc + `image` en assets),
  `multi` ("Marque dos/tres respuestas": `answers=N`, **las N primeras opciones son las correctas**),
  `sign`, `match`, `order`. `tf` fue eliminado.
- Totales: 920 (500 mc, 283 img, 113 multi, 10 match, 10 sign, 4 order). Unidades `u1`…`u11`.
- Prueba automática de largo de opciones: la correcta no puede ser >1,3× el distractor más largo, ni ser
  la más larga en más del 35 % de las preguntas (hoy ~33 %). Al escribir preguntas nuevas, alarga los
  distractores, no acortes la correcta de forma que pierda fidelidad.

Pruebas: `./gradlew -q testDebugUnitTest` (lógica + capturas). Capturas: `./gradlew recordPaparazziDebug`.

## 5. Cobertura del libro (`tools/cobertura/`)

Cada **dato** del libro es una cita textual con su página, sus preguntas y la sesión que lo enseña.

- `libro.txt`: texto extraído del PDF.
- `datos/capitulo-N.json`: `{capitulo, titulo, paginas, sesiones:[{id,titulo}], datos:[{id, p, s, q:[ids], cita}]}`.
  Capítulos 1–10 = texto del libro; 11 = señales (Anexo 1, imágenes); 12 = figuras del libro.
  **1.105 datos y 115 sesiones en total** (cap. 1: 7 sesiones; 2: 19; 3: 5; 4: 20; 5: 8; 6: 15; 7: 12;
  8: 6; 9: 10; 10: 3; 11: 4; 12: 6).
- `spec/capitulo-N.json` + `agregar.py`: forma compacta de escribir datos y preguntas nuevas; `agregar.py`
  calcula la página buscando la cita y actualiza `datos/` y `content.json`.
- `verificar_datos.py`: **ejecutar siempre tras cambiar contenido**. Comprueba que cada cita exista textual
  en el libro, que cada dato tenga pregunta y sesión, y que ninguna pregunta quede sin dato que la respalde.
- `senales.py`, `figuras.py`: recortan señales/figuras del PDF (pymupdf). `senales.json`: nombre impreso de cada señal.
- `multi.py` + `falsos.json`: generan las preguntas "Marque dos/tres" a partir de afirmaciones verdaderas
  (citas del libro) y falsas plausibles.

Ojo: el texto del PDF a dos columnas a veces mezcla líneas; usa subcadenas limpias como cita.

## 6. Motor de sesiones con tutor (`tools/sesiones/`) — trabajo en curso

Convierte un guion JSON en una página HTML autónoma (voz, imágenes y práctica incrustadas) que se reproduce
como un video interactivo. Es la forma de producir las 115 sesiones.

### Archivos
- `engine.html`: reproductor genérico. Lee `window.SESSION`. Escenarios, escenas, interacciones,
  subtítulos (CC), barra de progreso. Al final: "Practicar lo aprendido" (`index.html#practica=<id>`).
- `auditar.py N`: muestra lo que enseña cada sesión del capítulo N y las preguntas que se practican ahí.
- `build.py`: valida el guion, genera audio (con caché en `.cache/`), arma `dist/<id>.html`.
- `specs/<id>.json`: un guion por sesión. **Están las 115** (noviembre de 2026): `c1s1`…`c10s3`, las cuatro de
  señales del Anexo 1 (`a1s1`…`a1s4`, una escena `imagen` por señal) y las seis de figuras del libro (`f1`…`f6`).
  `build.py --capitulo N` solo toma `cNs*`; para compilar todo: `build.py $(ls specs | sed 's/\.json$//')`.
- `escenas/_comun.js`: auxiliares de dibujo compartidos (auto visto desde arriba, tablero, persona sentada, rótulos,
  fichas `F(fondo, fichas, título, subtítulo)` que aparecen al decir su palabra…). Se carga antes que los capítulos.
- `escenas/capitulo-N.js`: escenas de cada capítulo, cada archivo dentro de `(function(){…})()` tomando lo que usa con
  `const {…}=K;`, para que los nombres no choquen (todas se concatenan en la misma página). `capitulo-8.js` tiene
  también las del capítulo 9.
- Revisión de escenas: además de `build.py`, comprobar con Playwright que cada `data-w` esté en la frase de su paso y
  revisar capturas de todas las escenas (así se hizo con los capítulos 2 a 12).
- `dist/` y `.cache/` están en `.gitignore`.

### Formato del guion
```json
{"id": "c1s5", "titulo": "La velocidad y los peatones", "icono": "🚶", "minutos": 3, "practica": 4,
 "pasos": [
  {"voz": "frase", "escena": {"tipo": "cifra", "valor": 8, "prefijo": "×", "unidad": "…", "sub": "…", "icono": "⚠️"}, "dato": "c1-27"},
  {"voz": "pregunta hablada", "elige": {"pregunta": "texto en pantalla", "opciones": ["correcta", "d1", "d2"], "bien": "frase", "mal": "frase"}},
  {"voz": "instrucción", "desliza": {"escena": "peaton", "min": 30, "max": 70, "paso": 5, "desde": 30, "hasta": 65, "etiqueta": "Velocidad del auto"}}
 ]}
```
`dato` puede ser un id o una lista. Escenas disponibles (parámetros en `engine.html`, objeto `ESC`):

| tipo | parámetros |
|---|---|
| `titulo` | `icono`, `texto` (primer paso: decir de qué trata la sesión) |
| `tarjeta` | `icono`, `titulo`, `texto` |
| `cifra` | `valor` (cuenta animada), `prefijo`, `unidad`, `sub`, `icono` |
| `barras` | `items:[{label, valor, color?, texto?}]`, `max`, `unidad`, `sub` |
| `iconos` | `n`, `icono`, `marcar`, `icono2`, `sub` (p. ej. 10 personas, 9 marcadas) |
| `lista` | `items:[{icono, texto}]` |
| `vs` | `items:[{icono, titulo, texto?, marca?: "bien"/"mal"}]` (comparación lado a lado) |
| `imagen` | `src` (ruta dentro de `app/src/main/assets`, p. ej. `img/figuras/p21_0.webp`), `sub` |
| `peaton` | `velocidad` (supervivencia del peatón según el libro, p. 9) |

Cada paso puede llevar `"fondo"`: `ciudad`, `noche`, `lluvia`, `carretera`, `cruce`, `hospital` o `mundo`
(ilustraciones SVG animadas en `BG` de `engine.html`). Si un paso no lo trae, hereda el del paso anterior.
Cambia de escenario cuando cambia el tema de lo que se dice (p. ej. lluvia/noche al hablar de cuándo ocurren).

Para un tema que necesite otra animación (p. ej. auto frenando para distancia de detención), agrega una
escena nueva a `ESC` en `engine.html` y documéntala aquí. Mantén la estética: fondo oscuro, pocos elementos.

### Reglas que `build.py` verifica (no compila si fallan)
1. Cada dato asignado a la sesión (`s == id` en `tools/cobertura/datos`) aparece en algún `dato` del guion.
2. El guion no usa datos de otras sesiones.
3. La voz no dice "km/h" ni empieza con muletillas. (En pantalla sí se puede escribir "km/h".)

Lo que **no** verifica y debes cuidar tú: que la frase de la voz diga lo mismo que la cita del libro (misma
formulación y matices), español neutro, y que cada pregunta pida algo que la sesión dice o muestra
(revisar con `auditar.py`). La práctica la arma la demo de la app con las preguntas `mc`/`img`/`multi`
cuya última sesión es esa.

### Uso
```bash
V=/ruta/a/venv   # venv con: edge-tts faster-whisper num2words pymupdf pillow numpy
export EDGE_TTS=$V/bin/edge-tts SSL_CERT_FILE=/root/.ccr/ca-bundle.crt   # proxy de la nube de Claude Code
$V/bin/python tools/sesiones/build.py --capitulo 1 --revisar-voz          # o: build.py c1s1 c1s2
```
`--revisar-voz` transcribe cada audio con Whisper ("base") y avisa si la probabilidad de español es < 0,93 o
el error de palabras > 0,35 (Giuseppe a veces suena italiano; si pasa, reescribe la frase y vuelve a generar).
edge-tts usa `--proxy $HTTPS_PROXY` automáticamente si existe. El filtro ffmpeg baja la velocidad (atempo
0,89) y el reproductor deja ~420 ms de pausa entre frases.

Requisitos: Python 3 (`pip install -r tools/sesiones/requirements.txt`), ffmpeg, Node + Playwright/Chromium para pruebas automáticas.

### Probar y publicar
- Reproducción automática (que termine sin errores JS): abrir `dist/<id>.html` con Playwright y
  `--autoplay-policy=no-user-gesture-required`, emulando un teléfono; esperar a que aparezca la práctica.
- Capturas a intervalos para revisar visualmente cada escena.
- Publicar para el usuario: un `dist/index.html` con la lista de sesiones + los `<id>.html` como archivos del
  Artifact. Demo actual del capítulo 1: https://claude.ai/artifact/XC6bN6ATvz6BhQu9izPWgM

## 7. Demo de la app (`tools/demo-app/`)

`index.tpl.html` es el **diseño aprobado** de la app (mapa-camino, paradas, repaso, prueba de capítulo,
simulacro con temporizador y resultado por capítulo). `python3 tools/demo-app/build.py` lo arma con las
preguntas de `content.json` en `dist/index.html`. La parada de sesión enlaza a `sesion.html` (copiar ahí una
sesión de `tools/sesiones/dist/`). Es la referencia visual para portar a Android.

## 8. Pendiente (en orden)

1. **Opinión del usuario sobre las 115 sesiones** (APK 3.11) y ajustes. Pendiente también su decisión sobre el
   estilo de dibujo de las escenas (muestras A/B/C). Desde el capítulo 4 muchas escenas son fichas que aparecen al
   ritmo de la voz, menos elaboradas que las de los capítulos 1 y 2: mejorarlas si el usuario lo pide.
2. ~~Preguntas situacionales~~ (hecho, v3.12: 37 casos `sit-NNN` en `tools/cobertura/situacionales.py`; cada uno
   colgado del dato que lo respalda, así se practica en la sesión que lo enseña). Se pueden agregar más ahí.
3. Las 24 preguntas `match`, `order` y `sign` aún no tienen pantalla en la app web (no se muestran).
4. Redibujar o recortar mejor las figuras de materiales peligrosos y de ruedas en pendiente (se ven mal).
5. Limpieza: `README.md` describe la v1 (265 preguntas, verdadero/falso); las pantallas nativas Compose de la v1
   y sus pruebas Paparazzi siguen en el código aunque ya no se usan.
6. Para Google Play: firmar con una clave propia fuera del repositorio (hoy, clave de depuración en `app/firma`).

Hecho: paso a Android con WebView, botón "Explícamelo de nuevo", falsas creíbles en las "Marque", APK al día.

## 8b. App Android v2 (en curso)

- **Trae todo el libro** (pedido del usuario): mapa con los 12 capítulos y sus 115 paradas, repaso ⛽ y prueba 🏁
  por capítulo y simulacro 🏆. Cada parada: "Sesión con tutor" si existe; si no, **"Leer"** (citas textuales del
  libro de esa parada, con imágenes de señales y figuras) y luego "Practicar". Al hacer una sesión con tutor,
  reemplaza la lectura automáticamente (`tools/demo-app/build.py` detecta `tools/sesiones/specs`).
- Progreso en el teléfono (`localStorage`, clave `rutab-progreso`): paradas hechas ✓, leídas, preguntas falladas
  para el repaso y días estudiados (racha 🔥). Repaso, prueba y simulacro usan **solo paradas estudiadas**
  (leídas o con tutor); el simulacro se habilita con 35+ preguntas disponibles.
- **Refuerzo de errores (v2.2):** en la práctica y el repaso, lo fallado vuelve al final de la ronda hasta
  acertarlo, pero solo cuenta el primer intento. Repetición espaciada con cajas de Leitner (`PR.srs`): acertar
  sube de caja (vuelve en 1, 3, 7, 14, 30 días), fallar baja a la caja 0 (vuelve hoy). Botón "⛽ N" en el mapa:
  repaso general de lo pendiente de hoy (primero lo fallado). Prueba y simulacro también registran en las cajas.
  Un error en una pregunta de una sesión con tutor (`tutorFallos`) pone las preguntas de esa sesión en el
  repaso de hoy.
- **Barra inferior (v2.3):** pestañas Ruta (mapa), Repaso (globito con lo pendiente, repaso general y por
  capítulo), Examen (simulacros e historial) y Progreso (racha, paradas, preguntas dominadas, avance por capítulo,
  borrar progreso). Al terminar una práctica/prueba se vuelve a la pestaña de origen (`volver()`).
- **Simulacro completo** (pedido del usuario): formato real con 35 preguntas al azar de **todo** el banco, aunque
  no se hayan estudiado (excepción consciente a "nada sin enseñar", indicada en pantalla). El "de lo estudiado"
  sigue disponible. Resultados en `PR.examenes`.
- **Diseño (v2.4):** un color por capítulo (sin verde: el verde es solo "hecho"), franja fija con el capítulo
  visible al bajar por el mapa, carteles con avance, camino pintado hasta la parada actual, nombres en hasta 2
  líneas, globo "EMPEZAR", ventana de parada con tipo/preguntas/estado, lectura con encabezado de color, letras
  A–D en las opciones. Sin botón de borrar progreso (lo pidió el usuario).
- **Emojis iguales en todos los teléfonos** (regla del usuario): las páginas incluyen Noto Color Emoji recortada
  a los emojis usados, más Noto Sans Math/Symbols 2 para ↑ → ↻ ≈ ✓ ✕ (`tools/demo-app/fuentes`, ver `LEEME.md`).
  **Al usar un emoji nuevo, regenerar la fuente** o se verá con el del teléfono. Nunito también va incluida.
- **Orden de la ruta (v2.5):** se puede adelantar, pero se prioriza el orden: al tocar una parada posterior a la
  siguiente, la ventana avisa "Te estás adelantando" con "Ir a la siguiente" (principal) y "Adelantarme igual".
  La siguiente siempre es la primera sin hacer en el orden del libro. Botón flotante "Seguir en: …" cuando la
  siguiente queda fuera de la pantalla.
- **Preguntas como el examen real (v2.6):** ningún enunciado ni opción menciona "el libro" (regla del usuario:
  "así no es el examen real"). Las "Marque dos/tres" dicen "¿Cuáles de estas afirmaciones son correctas? Marque
  dos respuestas" y sus afirmaciones falsas son errores creíbles del mismo tema (`tools/cobertura/multi_falsas/`,
  se aplican con `multi_falsas/aplicar.py`, que también aplica `sin_libro.json` y verifica que no quede
  "libro"). **No volver a correr `multi.py`/`falsos.json`**: regeneraría las falsas absurdas. Ninguna Marque se
  delata por largo (0 de 113 con todas las verdaderas más largas).
- **Falsas sin espejo (v2.9):** en las "Marque dos/tres", las falsas NO pueden ser la misma frase de una verdadera
  dada vuelta (el usuario lo encontró "ridículo": se adivina comparando el par). Cada falsa trata otro dato de la
  misma página o sesión, alterado. Están en `tools/cobertura/multi_falsas/zz_sin_espejo.json` (se aplica al final
  y reemplaza a los otros archivos). Control: similitud verdadera/falsa ≤ 0,6 y ninguna con todas las verdaderas más largas.
  Además, la falsa debe ser un error **creíble** (cifra vecina, procedimiento parecido), nunca algo absurdo
  como "el riesgo es el mismo que sin alcohol" (v3.0).
- **Distractores creíbles (v3.6):** `tools/cobertura/distractores/zz_creibles.json` reemplaza alternativas absurdas ("solo", "nunca", "un problema menor") de 40 preguntas de alternativas por errores creíbles.
- **Encabezado (v3.5):** rombo amarillo con la B + "Ruta B"; la racha va en una píldora naranja con llama dibujada (`.pill#racha`).
- **Barras del sistema oscuras (v3.4):** `colors.xml` bg = #131F24 (antes un blanco de un diseño viejo), tema
  `Theme.Material.NoActionBar` y `enableEdgeToEdge(SystemBarStyle.dark)` con padding de insets en `MainActivity`.
- **Bienvenida y ayudas (v3.3):** 3 pantallas con dibujos la primera vez (`INTRO`, `intro()`; se marca en
  localStorage `rutab-intro`, aparte del progreso; "Saltar" y el botón atrás la cierran). Aviso fijo arriba en Repaso.
  Tocar la racha 🔥 muestra un globo (`#tipRacha`). Las pruebas Playwright que limpian localStorage deben
  poner `rutab-intro=1` para que la bienvenida no tape la pantalla.
- **Volver atrás en el examen (v3.1):** en simulacros y pruebas hay botón de flecha "Anterior", sin texto (`#qprev`); la respuesta
  queda guardada en `R.ans[i]` (`sel`/`picks`) y se puede cambiar. En práctica y repaso no aparece.
- **Auto del mapa (v2.7):** va sobre el camino, antes de la parada siguiente y girado según la curva (`objY=nx.y-126`, curva bézier de `camino()`). Por eso `GAP=260` y los carteles avanzan 220. El globo dice "EMPEZAR" solo en la primera parada de cada capítulo; en las demás, "CONTINUAR".
- **Doble puntaje en el simulacro (v2.8):** 3 preguntas de 3 categorías importantes distintas, sorteadas en cada
  simulacro y evitando las del anterior (`PR.ultDobles`). 14 categorías en `GRAVES` de `tools/demo-app/build.py`
  (campo `g`). Regla del usuario: **no decir en pantalla qué temas valen doble**.
- **Lectura:** cada cita se muestra como la oración completa del libro, tomada de `tools/cobertura/libro_bloques.txt`
  (extracción por bloques con `bloques.py`, sin mezclar columnas); los fragmentos de tablas usan la explicación
  de su pregunta.
 las `match`, `order` y `sign` (24) aún no tienen pantalla en la web.

- `MainActivity` muestra el diseño aprobado (mapa, sesiones con tutor, práctica, repaso, prueba, simulacro)
  desde `assets/web` en un WebView, sin conexión. El botón atrás llama a `window.atras()` de la página.
  Las pantallas nativas de la v1 (Compose) siguen en el código pero ya no se usan.
- `tools/empaquetar_app.sh`: regenera sesiones y demo, las copia a `app/src/main/assets/web` (ignorado en git),
  aplica el ícono y compila `release/RutaB-2.0.apk`. Necesita `local.properties` con `sdk.dir`.
- Ícono: `tools/icono/iconos.py` (opciones: camino, cono, senal, volante). Elegido: **senal** (rombo con B).
- **Compilar el APK en la nube de Claude Code** (no trae el SDK de Android; ~2 minutos):
  ```bash
  export ANDROID_HOME=/home/user/android-sdk; mkdir -p $ANDROID_HOME/cmdline-tools && cd /tmp
  curl -sSL -o clt.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  unzip -q clt.zip -d $ANDROID_HOME/cmdline-tools && mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest
  yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses; $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platforms;android-35" "build-tools;35.0.0"
  cd - && echo "sdk.dir=$ANDROID_HOME" > local.properties
  export SSL_CERT_FILE=/root/.ccr/ca-bundle.crt EDGE_TTS=/ruta/al/venv/bin/edge-tts   # las voces se generan de nuevo (caché vacío)
  bash tools/empaquetar_app.sh      # sesiones de todos los capítulos con guion + demo + APK release/RutaB-<versionName>.apk
  ```
  Antes de compilar una versión nueva, subir `versionCode` y `versionName` en `app/build.gradle.kts`.
  Si Gradle dice "Could not find …jar" es el proxy cortando descargas: repetir con `--refresh-dependencies`
  (el script ya lo reintenta una vez).
- **Firma:** desde la 3.8 se firma con la clave fija `app/firma/rutab.keystore` (contraseñas de depuración,
  `android`). Así cada APK se instala encima del anterior sin borrar el progreso. Hasta la 3.7 cada sesión de
  Claude generaba su propia clave, por eso la 3.8 exige desinstalar la versión anterior una vez.
- APK compilado: `release/RutaB-3.13.apk` (las 115 sesiones con tutor). Si Maven Central responde 429,
  reintentar con `./gradlew --max-workers=1 --refresh-dependencies assembleRelease` tras una pausa.
- Pendiente de decisión del usuario: estilo de dibujo de las escenas (muestras A/B/C publicadas).

## 9. Convenciones de trabajo

- Commits en español, terminados con las líneas de atribución que indique el sistema. Push solo a la rama de trabajo.
- Tras tocar contenido: `python3 tools/cobertura/verificar_datos.py` y `./gradlew -q testDebugUnitTest`.
- Ante cualquier duda de contenido, buscar la cita en `tools/cobertura/libro.txt` y citar la página.

## 10. Pantalla encendida en las sesiones

Pedido del usuario: la pantalla no se apaga por inactividad durante las sesiones con tutor. En la app,
`MainActivity` pone `FLAG_KEEP_SCREEN_ON` mientras la página abierta es `c<N>s<M>.html` y lo quita al salir.
En la web, `engine.html` pide un Wake Lock de pantalla al tocar "Empezar".
