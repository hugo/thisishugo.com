#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# The tab icon renders from favicon.svg; the touch icon is the face crop.
magick -background none -density 384 public/icons/favicon.svg \
  -define icon:auto-resize=48,32,16 public/icons/favicon.ico
magick assets/yosemite.heic -auto-orient -colorspace sRGB -strip \
  -crop 1584x1584+4984+2525 +repage -resize 180x180 -depth 8 \
  public/icons/apple-touch-icon.png
