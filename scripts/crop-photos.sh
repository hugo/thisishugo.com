#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# Full-height crops centred on Hugo, retaining the widest scene each ratio allows.
magick assets/yosemite.heic -auto-orient -colorspace sRGB -strip \
  -crop 6336x6336+2460+0 +repage "$work/stacked.png"
magick assets/yosemite.heic -auto-orient -colorspace sRGB -strip \
  -crop 3960x6336+3670+0 +repage "$work/split.png"

for crop in stacked split; do
  for width in 640 1280 1536 2560; do
    magick "$work/$crop.png" -resize "${width}x" -strip "$work/resized.png"
    avifenc --qcolor 65 --speed 6 --yuv 420 --ignore-exif --ignore-xmp \
      "$work/resized.png" "public/images/$crop-$width.avif"
    magick "$work/resized.png" -sampling-factor 4:2:0 -quality 85 -strip \
      "public/images/$crop-$width.jpg"
  done
done

magick "$work/stacked.png" -resize 1280x -sampling-factor 4:2:0 -quality 85 \
  -strip public/images/fallback.jpg

magick assets/yosemite.heic -auto-orient -colorspace sRGB -strip \
  -crop 4000x2100+3532+2303 +repage -resize 1200x630 \
  -sampling-factor 4:2:0 -quality 85 -strip public/images/social.jpg
