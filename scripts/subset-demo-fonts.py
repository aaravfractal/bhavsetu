#!/usr/bin/env python3
"""Build demo/fonts/*.woff2 — subsets carrying exactly the glyphs demo/index.html uses.

The demo's copy is fixed, so the full Devanagari faces (about 600 KB across five
weights) are almost entirely dead weight in a service-worker precache that has
to install over 2G. Subsetting to the file's own character set cuts that by an
order of magnitude while keeping every conjunct and matra the Marathi copy needs,
because the layout tables come along.

Re-run after ANY change to demo/index.html:

    pip install fonttools brotli
    python3 scripts/subset-demo-fonts.py

tests/demo.pwa.test.js fails the build if a character in the HTML has no glyph.
"""
import subprocess
import sys
import unicodedata
from pathlib import Path
from urllib.request import urlretrieve

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "demo/index.html"
OUT = ROOT / "demo/fonts"
CACHE = Path.home() / ".cache/bhavsetu-fonts"

BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl"
FACES = [
    ("mukta-400", f"{BASE}/mukta/Mukta-Regular.ttf"),
    ("mukta-600", f"{BASE}/mukta/Mukta-SemiBold.ttf"),
    ("mukta-700", f"{BASE}/mukta/Mukta-Bold.ttf"),
    ("mukta-800", f"{BASE}/mukta/Mukta-ExtraBold.ttf"),
    ("tiro-devanagari-marathi-400",
     f"{BASE}/tirodevanagarimarathi/TiroDevanagariMarathi-Regular.ttf"),
]

# Everything in the file, plus joiners and the Devanagari digits, which the
# app formats at runtime and which therefore never appear as literals.
EXTRA = "‌‍ ₹०१२३४५६७८९"


def charset() -> str:
    text = HTML.read_text(encoding="utf-8") + EXTRA
    chars = {c for c in text if not unicodedata.category(c).startswith("C") or c in "‌‍"}
    return "".join(sorted(chars))


def main() -> int:
    CACHE.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    text = charset()
    txt = CACHE / "charset.txt"
    txt.write_text(text, encoding="utf-8")
    print(f"{len(text)} distinct characters from demo/index.html")

    total = 0
    for name, url in FACES:
        src = CACHE / f"{name}.ttf"
        if not src.exists():
            print(f"  fetching {url.rsplit('/', 1)[-1]}")
            urlretrieve(url, src)
        dest = OUT / f"{name}.woff2"
        subprocess.run(
            [sys.executable, "-m", "fontTools.subset", str(src),
             f"--text-file={txt}", "--layout-features=*", "--flavor=woff2",
             "--no-hinting", "--desubroutinize", f"--output-file={dest}"],
            check=True, capture_output=True,
        )
        size = dest.stat().st_size
        total += size
        print(f"  {dest.name:36} {size/1024:6.1f} KB")
    print(f"  {'TOTAL':36} {total/1024:6.1f} KB")

    # What the subsets were actually built from. tests/demo.pwa.test.js compares
    # this against the HTML as it stands, so editing the copy without re-running
    # this script fails the build instead of silently losing glyphs.
    import json
    (OUT / "coverage.json").write_text(
        json.dumps({"charset": text, "faces": [n for n, _ in FACES]},
                   ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
