#!/usr/bin/env bash
# ---------------------------------------------------------------
#  bump.sh  —  stamp a fresh version onto the css/js links.
#
#  GitHub Pages serves everything with `cache-control: max-age=600`.
#  That means index.html and content.js expire independently, and for
#  up to ten minutes you can get a fresh page holding a stale script:
#  the layout is current, the words are old. Extremely confusing.
#
#  Stamping ?v=<timestamp> onto the asset URLs ties them to the page,
#  so when index.html refreshes its scripts refresh with it.
#
#  Runs automatically at the end of add-video.sh. Run it yourself
#  after editing js/content.js by hand:
#
#      ./tools/bump.sh && git add -A && git commit -m "..." && git push
# ---------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NEWEST=$(ls -t css/style.css js/content.js js/app.js | head -1)
STAMP=$(date -r "$NEWEST" +%Y%m%d%H%M%S 2>/dev/null || date +%Y%m%d%H%M%S)

perl -pi -e '
  s{(href="css/style\.css)(\?v=\d+)?"}{$1?v='"$STAMP"'"};
  s{(src="js/content\.js)(\?v=\d+)?"}{$1?v='"$STAMP"'"};
  s{(src="js/app\.js)(\?v=\d+)?"}{$1?v='"$STAMP"'"};
' index.html

echo "stamped ?v=$STAMP"
grep -o 'css/style\.css?v=[0-9]*\|js/content\.js?v=[0-9]*\|js/app\.js?v=[0-9]*' index.html
