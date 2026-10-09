#!/usr/bin/env bash
# Assemble the Pages site into _site/: the landing page plus the images from docs/social and docs/ux.
# There is no live demo: the studio needs its backend, so the page shows real screenshots and the demo GIF.
#   ./scripts/build-site.sh && node scripts/site-check.mjs
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/_site}"
rm -rf "$OUT" && mkdir -p "$OUT/social" "$OUT/ux"
cp -R "$ROOT"/site/. "$OUT/"
cp "$ROOT"/docs/social/*.jpg "$OUT/social/"
cp "$ROOT"/docs/ux/*.png "$ROOT"/docs/ux/*.jpg "$ROOT"/docs/ux/*.gif "$OUT/ux/"
touch "$OUT/.nojekyll"
echo "built ${OUT#$ROOT/} ($(du -sh "$OUT" | cut -f1))"
