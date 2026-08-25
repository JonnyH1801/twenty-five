#!/usr/bin/env bash
# ---------------------------------------------------------------
#  add-video.sh  —  drop a friend's raw clip in, get a web-ready
#                   video + poster frame out.
#
#  usage:   ./tools/add-video.sh <raw-clip> <slug> [poster-seconds] [crf]
#  example: ./tools/add-video.sh ~/Desktop/sofia.MOV sofia
#           ./tools/add-video.sh ~/Desktop/long.MOV long 5 30
#
#  crf is the quality dial: lower is bigger and sharper. 26 is the
#  default and right for most clips. Push it to 30 for anything past
#  about three minutes, which halves the file with no visible cost on a
#  talking head. Yec's video went 38MB -> 21.7MB that way.
#
#  Keep the raw clip OUTSIDE media/videos/. That is where this script
#  writes, and on a case-insensitive disk Sofia.mp4 and sofia.mp4 are one
#  file. The script refuses that case now, but do not set it up.
#           ./tools/add-video.sh ~/Desktop/mama.mp4 mama 4
#
#  writes:  media/videos/<slug>.mp4
#           media/posters/<slug>.jpg
# ---------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${1:-}"
SLUG="${2:-}"
AT="${3:-1}"
CRF="${4:-26}"

if [[ -z "$SRC" || -z "$SLUG" ]]; then
  echo "usage: ./tools/add-video.sh <raw-clip> <slug> [poster-seconds]" >&2
  exit 1
fi
if [[ ! -f "$SRC" ]]; then
  echo "error: no such file: $SRC" >&2
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "error: ffmpeg not installed.  run:  brew install ffmpeg" >&2
  exit 1
fi
if [[ ! "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  echo "error: slug must be lowercase letters, numbers and dashes only (got '$SLUG')" >&2
  exit 1
fi

VID="$ROOT/media/videos/$SLUG.mp4"
POS="$ROOT/media/posters/$SLUG.jpg"
mkdir -p "$(dirname "$VID")" "$(dirname "$POS")"

# Refuse to read and write the same file.
#
# macOS filesystems are case-insensitive, so a source dropped in as
# media/videos/Bethy.mp4 IS media/videos/bethy.mp4, which is exactly where
# this script writes. ffmpeg happily truncates the input while it is still
# reading it and the original is gone. That destroyed four irreplaceable
# videos once; it does not get to happen twice.
#
# -ef compares canonical paths case-insensitively on a case-insensitive
# volume, which a plain string compare would miss.
if [[ "$SRC" -ef "$VID" ]]; then
  echo "error: the source and the output are the same file." >&2
  echo "       $SRC" >&2
  echo "       $VID" >&2
  echo "" >&2
  echo "       This would overwrite the original while reading it. Keep raw" >&2
  echo "       clips outside media/videos/ (say _source/) and re-run." >&2
  exit 1
fi

echo "→ compressing $(basename "$SRC") ..."
# Two things that matter more than the CRF:
#
# -r 30, because phones shoot 60 and even 120 fps and for a talking head
# every extra frame is pure file size.
#
# min(1280,iw)/min(1280,ih), because plain force_original_aspect_ratio=decrease
# scales UP to fill the box as happily as it scales down. A clip that arrives
# already squeezed by WhatsApp would get blown up to 720p, spending megabytes
# inventing pixels that were never in the source. min() makes 1280 a ceiling
# instead of a target.
ffmpeg -y -loglevel error -stats -i "$SRC" \
  -vf "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" \
  -r 30 \
  -c:v libx264 -profile:v high -level 4.0 -preset slow -crf "$CRF" -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart \
  "$VID"

echo "→ grabbing poster frame at ${AT}s ..."
ffmpeg -y -loglevel error -ss "$AT" -i "$VID" -frames:v 1 -q:v 3 "$POS"

SIZE=$(du -h "$VID" | cut -f1 | tr -d ' ')
echo ""
echo "done.  $SLUG.mp4  ($SIZE)"
echo ""
echo "now add this to the friends[] array in js/content.js:"
echo ""
cat <<EOF
    {
      slug: "$SLUG",
      name: "",
      role: "",
      phrase: "",
      video: "$SLUG.mp4",
      poster: "$SLUG.jpg",
      accent: "sky",
      shape: "arch",
    },
EOF
echo ""
echo "and write this url to their NFC tag:"
echo "    https://jonnyh1801.github.io/twenty-five/#/from/$SLUG"
echo ""
echo "when you have filled in the words above, run:"
echo "    ./tools/bump.sh && git add -A && git commit -m \"add $SLUG\" && git push"
