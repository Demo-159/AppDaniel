#!/usr/bin/env bash
# Arma el contenido web de la app (mapa, sesiones con tutor y práctica) dentro de app/src/main/assets/web
# y compila el APK. Requiere: SDK de Android (local.properties) y, para regenerar voces, edge-tts (EDGE_TTS).
set -euo pipefail
cd "$(dirname "$0")/.."
for n in $(ls tools/sesiones/specs | sed -n 's/^c\([0-9]*\)s.*/\1/p' | sort -un); do
  python3 tools/sesiones/build.py --capitulo "$n"
done
python3 tools/demo-app/build.py
rm -rf app/src/main/assets/web && mkdir -p app/src/main/assets/web
cp tools/demo-app/dist/index.html tools/sesiones/dist/c*s*.html app/src/main/assets/web/
python3 tools/icono/iconos.py android senal
./gradlew -q --max-workers=1 assembleRelease || ./gradlew -q --max-workers=1 --refresh-dependencies assembleRelease
V=$(grep -oP 'versionName = "\K[^"]+' app/build.gradle.kts)
cp app/build/outputs/apk/release/app-release.apk "release/RutaB-$V.apk"
echo "✓ release/RutaB-$V.apk"
