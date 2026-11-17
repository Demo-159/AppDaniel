# Fuentes incluidas en la app

Van dentro de las páginas (en base64) para que la app se vea igual en todos los teléfonos y sin conexión.

- `Nunito-latin.woff2`: tipografía de la app (Google Fonts, subconjunto latino, pesos 600–900).
- `NotoSansMath-rutab.woff2` y `NotoSansSymbols2-rutab.woff2`: los símbolos de texto ↑ → ↻ ≈ ✓ ✕ ←, recortados.
- `NotoColorEmoji-rutab.woff2`: Noto Color Emoji **recortada solo a los emojis que usa la app**, para que
  se vean idénticos en cualquier marca de teléfono (Samsung, Xiaomi, etc. dibujan los suyos distinto).

Ambas tienen licencia SIL Open Font License 1.1 (`OFL.txt`).

## Si se agregan emojis nuevos

Regenerar la fuente de emojis con todos los que usan las páginas, o el emoji nuevo se verá con el del teléfono:

1. Juntar los emojis de `tools/demo-app/dist/index.html`, `tools/sesiones/engine.html`,
   `tools/sesiones/escenas/*.js` y `tools/sesiones/specs/*.json`.
2. Pedir `https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&text=<emojis codificados en URL>`
   con un User-Agent de Chrome y descargar el `.woff2` que indica.
3. Guardarlo como `NotoColorEmoji-rutab.woff2` y volver a compilar.
