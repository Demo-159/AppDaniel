# Generador de cápsulas en video (shorts)

Genera shorts verticales (1080×1920) a partir de `app/src/main/assets/content.json`:
pregunta gancho → escenas con datos animados → respuesta → cierre. Usa voz neuronal Piper en español,
subtítulos palabra por palabra, efectos de sonido y música suave.

Requisitos: Python 3, ffmpeg, Node con Playwright/Chromium, `pip install piper-tts`, una voz de
https://huggingface.co/rhasspy/piper-voices (por ejemplo `es_MX-ald-medium`) y las fuentes Nunito 800/900
(`nunito-latin-800-normal.woff2`, `nunito-latin-900-normal.woff2`) junto a `scene.html`.

```bash
python3 build.py u1 1 voces/es_MX-ald-medium.onnx out/u1-1   # audio + línea de tiempo
node render.js out/u1-1 u1-1.mp4 1.5                          # video
```

Si `piper` no está en el PATH, indica su ruta con la variable de entorno `PIPER`.
