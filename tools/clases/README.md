# Clases en video por capítulo

Genera un video vertical por capítulo del libro, cubriendo **todas** sus secciones.
Cada escena del guion (`guiones/capitulo-N.json`) indica la sección del libro que explica (`sec`),
lo que dice la voz (`say`), la palabra clave en pantalla (`k`) y su animación (`anim`).

```bash
python3 build2.py guiones/capitulo-1.json out/cap1   # voz (Brian, edge-tts), música y línea de tiempo
node render.js out/cap1 capitulo-1.mp4 1.5           # video 1080×1920
```

Requisitos: ffmpeg, Node con Playwright/Chromium, `pip install edge-tts`, y las fuentes Nunito 800/900 junto a `scene2.html`.
