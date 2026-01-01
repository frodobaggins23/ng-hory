#!/bin/bash

[ ! -e ~/Apps/magick/magick ] && echo "The ImageMagick binary was not found in ~/Apps/magick/magick" && exit 1

MAGIC_BIN="$HOME/Apps/magick/magick"
SOURCE_FILES_DIR=".images-tmp"
DEST_DIR=".images-tmp/compressed"
RESIZE="1500000@"  # Approx 1.5 megapixels
QUALITY="75"

mkdir -p "$DEST_DIR"
"$MAGIC_BIN" mogrify -path "$DEST_DIR" -format webp -auto-orient -resize "$RESIZE" -quality "$QUALITY" "$SOURCE_FILES_DIR/*.jpg"