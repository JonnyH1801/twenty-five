#!/usr/bin/env bash
# ---------------------------------------------------------------
#  add-video.sh  —  drop a friend's raw clip in, get a web-ready
#                   video + poster frame out.
#
#  usage:   ./tools/add-video.sh <raw-clip> <slug> [poster-seconds]
#  example: ./tools/add-video.sh ~/Desktop/sofia.MOV sofia
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

echo "→ compressing $(basename "$SRC") ..."
ffmpeg -y -loglevel error -stats -i "$SRC" \
  -vf "scale=w=1280:h=1280:force_original_aspect_ratio=decrease:force_divisible_by=2" \
  -c:v libx264 -profile:v high -level 4.0 -preset slow -crf 26 -pix_fmt yuv420p \
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
