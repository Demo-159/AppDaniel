"""edge-tts forzando español latino en voces multilingües.
Uso: tts_es.py <voz> <rate> <pitch> <texto> <salida.mp3> [locale]"""
import asyncio, os, sys
import edge_tts.communicate as c

LOCALE = sys.argv[6] if len(sys.argv) > 6 else "es-MX"
_orig = c.mkssml
def mkssml(tc, escaped_text):
    if isinstance(escaped_text, bytes):
        escaped_text = escaped_text.decode("utf-8")
    return _orig(tc, escaped_text).replace("xml:lang='en-US'", f"xml:lang='{LOCALE}'")
c.mkssml = mkssml

async def main():
    voice, rate, pitch, text, out = sys.argv[1:6]
    await c.Communicate(text, voice, rate=rate, pitch=pitch, proxy=os.environ.get("HTTPS_PROXY")).save(out)
asyncio.run(main())
