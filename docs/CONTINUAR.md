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
| Voz (nov. 2026) | **No cambiar la voz** (lo pidió explícitamente). Evitar la palabra "Exacto": con Giuseppe suena mal; usar "Así es". |
| Producción | Las sesiones planas le parecieron "muy poco producidas": cada paso lleva `fondo` (escenario animado que cambia), transiciones, mascota Cono que habla y sonidos suaves. |
| Distractores | Deben ser del **mismo tema** y plausibles; nada de opciones de otro tema que delaten la correcta. |
| Nada sin enseñar | **Ninguna pregunta puede aparecer sin haberse enseñado antes** (regla del usuario, obligatoria). Cada pregunta se practica en la última sesión de sus datos; la demo solo carga preguntas de sesiones con guion. Revisar cada capítulo nuevo con `python3 tools/sesiones/auditar.py N`. |
| Práctica | Va **fuera** de la sesión con tutor, como lección aparte con el estilo de la app (Comprobar, franja verde/roja). La sesión termina con "Practicar lo aprendido" → `index.html#practica=<id>`. |
| Preguntas en la sesión | Deben exigir entender lo explicado: opciones del **mismo tipo** y plausibles (p. ej. menos / más / los mismos), nunca una absurda como "es cuestión de mala suerte". Solo sobre lo que se acaba de enseñar, nunca antes de enseñarlo, sin hipotéticos ni frases de relleno ("Te toca a ti", "Veamos si quedó claro"). **Un solo intento**: si falla, se marca la correcta y la voz dice `mal` (que ya da la respuesta); no se vuelve a preguntar. |
| Explicar el porqué | No basta con nombrar un dato: explicar el razonamiento paso a paso, una idea por paso (p. ej. la noche: si fuera azar, menos autos → menos siniestros; pero de noche hay muchos fallecidos). |
| Escenas que explican (aprobado) | Las 7 sesiones del capítulo 1 usan escenas `anim` hechas para cada concepto, que **actúan** lo que dice la voz; cada parte aparece cuando la voz dice su palabra (`data-w`, `data-h`). Escenas en `tools/sesiones/escenas/capitulo-N.js`; fondo `liso`. Comprobar que cada `data-w` esté en la frase de su paso (si no, aparece de golpe al inicio). Cada escena ocurre en un **lugar que cuente algo** (hospital, mapa de Chile, parabrisas, carretera con animitas…), nunca íconos sobre un recuadro vacío. Cifras grandes: **contador que sube cuando la voz dice el número** (`data-to` + `data-w`); **nunca "ícono = 100"** (confunde). Solo conteos literales (4–5 velas por día, 9 de cada 10). |
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
- `specs/<id>.json`: un guion por sesión. Hechos: `c1s1`…`c1s7` (capítulo 1 completo).
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

1. **Esperar la opinión del usuario sobre las 7 sesiones del capítulo 1** y ajustar el motor si pide cambios.
   Falta en el motor: el botón **"Explícamelo de nuevo"** en las preguntas `elige` (lo pidió el usuario y
   existía en el prototipo); hoy solo está la frase `mal` tras un error. Agregar un campo `repite` (voz breve) al guion.
2. **Producir las sesiones de los capítulos 2 a 12** (108 sesiones), por tandas de 1–2 capítulos: escribir
   `specs/cNsK.json` usando los datos de `tools/cobertura/datos/capitulo-N.json`, compilar con
   `--revisar-voz`, probar con Playwright, publicar demo y mostrar al usuario.
   Para los capítulos 11 (señales) y 12 (figuras) usar escenas `imagen`.
3. **Portar el diseño aprobado a Android**: mapa-camino como inicio, sesiones dentro de un WebView (empaquetar
   los HTML de `dist/` en assets), repaso ⛽, prueba 🏁, simulacro con temporizador de 45 min y resultado por
   capítulo. Actualizar pruebas Paparazzi y `README.md`.
4. Preguntas **situacionales** (casos de manejo) fieles al libro.
5. Que las 3 preguntas dobles del simulacro salgan de temas graves: alcohol, velocidad, casco, cinturón, SRI
   (sistemas de retención infantil).
6. Redibujar o recortar mejor las figuras de materiales peligrosos y de ruedas en pendiente (se ven mal).
7. Pasada de revisión de calidad de todo el banco contra el libro. Hecho: distractores de otro tema en
   77 preguntas mc/img (`tools/cobertura/distractores/`, se aplican con `aplicar.py`). Falta: las
   preguntas "Marque dos/tres" (`multi`) tienen afirmaciones falsas demasiado obvias ("nunca", "siempre",
   "mejora la visión"); reescribirlas como errores plausibles del mismo tema.
8. Generar un APK nuevo (`./gradlew assembleRelease`) y reemplazar `release/`.

## 9. Convenciones de trabajo

- Commits en español, terminados con las líneas de atribución que indique el sistema. Push solo a la rama de trabajo.
- Tras tocar contenido: `python3 tools/cobertura/verificar_datos.py` y `./gradlew -q testDebugUnitTest`.
- Ante cualquier duda de contenido, buscar la cita en `tools/cobertura/libro.txt` y citar la página.
