#!/usr/bin/env bash
# Erzeugt die vier PNG-Icons aus einer Quelldatei (Standard: src/icons/favicon.svg)
# und legt sie in src/icons/ ab.
#
# Nutzung:  scripts/make-icons.sh [pfad/zur/quelle.svg|.png|.ico]
# Voraussetzung: ImageMagick (`magick`, alternativ `convert`).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/src/icons/favicon.svg}"
DIR="$ROOT/src/icons"
mkdir -p "$DIR"

case "$SRC" in
  *.ico|*.ICO) SRC="${SRC}[0]" ;;   # größtes Bild aus .ico
esac

if command -v magick >/dev/null 2>&1; then IM=magick; else IM=convert; fi

for SZ in 16 32 48 128; do
  "$IM" "$SRC" -background none -resize "${SZ}x${SZ}" "$DIR/icon${SZ}.png"
  echo "src/icons/icon${SZ}.png"
done
echo "Fertig."
