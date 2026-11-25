"""Colour versions of the home page for review (index-v2.html, index-v3.html).

Every colour in the stylesheets and in index.html is re-coloured by hue band, so the versions always match
the current design: blush backgrounds, periwinkle/lilac backgrounds, mist backgrounds, the gold accent and the
dark ink each move to the palette's own hue. Photos, video and clip art are untouched.
Run after any design change:  python tools/make_themes.py
"""
import colorsys, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS = ["home.css", "pages.css", "v7.css", "v8.css", "v9.css"]

# hue targets in degrees; sat multipliers keep things pastel
PALETTES = {
    "v2": dict(name="Sage & Clay", blush=(95, .55), lilac=(40, .7), mist=(150, .6), accent=(16, .8), ink=(155, .5)),
    "v3": dict(name="Lavender & Rose", blush=(15, 1.0), lilac=(268, 1.0), mist=(310, .6), accent=(345, .6), ink=(282, .9)),
}

HEX = re.compile(r"#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
RGBA = re.compile(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)")


def remap(r, g, b, pal):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    hd = h * 360
    if s < 0.08 or (l > 0.97) or l < 0.03:          # whites, blacks, greys stay
        return r, g, b
    if 18 <= hd <= 58 and s > 0.22 and l < 0.86:     # the gold accent (all its shades)
        tgt, sm = pal["accent"]
    elif l < 0.32:                                     # dark ink / plum text
        tgt, sm = pal["ink"]
    elif hd >= 320 or hd < 30:                         # blush / pink / peach backgrounds
        tgt, sm = pal["blush"]
    elif 190 <= hd < 320:                              # periwinkle / lilac
        tgt, sm = pal["lilac"]
    elif 120 <= hd < 190:                              # mist / teal
        tgt, sm = pal["mist"]
    else:                                              # warm sand etc.
        tgt, sm = pal["blush"]
    nr, ng, nb = colorsys.hls_to_rgb(tgt / 360, l, min(1, s * sm))
    return round(nr * 255), round(ng * 255), round(nb * 255)


def recolour(text, pal):
    def hx(m):
        v = m.group(1)
        if len(v) == 3: v = "".join(c * 2 for c in v)
        a = v[6:] if len(v) == 8 else ""
        r, g, b = (int(v[i:i + 2], 16) for i in (0, 2, 4))
        nr, ng, nb = remap(r, g, b, pal)
        return f"#{nr:02x}{ng:02x}{nb:02x}{a}"
    def rg(m):
        r, g, b = (int(m.group(i)) for i in (1, 2, 3))
        nr, ng, nb = remap(r, g, b, pal)
        return f"rgba({nr}, {ng}, {nb}, {m.group(4)})" if m.group(4) else f"rgb({nr}, {ng}, {nb})"
    return RGBA.sub(rg, HEX.sub(hx, text))


def main():
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    for key, pal in PALETTES.items():
        out = ROOT / "themes" / key
        out.mkdir(parents=True, exist_ok=True)
        page = index
        for css in CSS:
            src = ROOT / css
            if not src.exists():
                continue
            (out / css).write_text(recolour(src.read_text(encoding="utf-8"), pal), encoding="utf-8")
            page = re.sub(rf'href="{re.escape(css)}(\?v=[^"]*)?"', f'href="themes/{key}/{css}?v=1"', page)
        # inline colours in the page (svg art, inline styles); <img>/<video> are not touched
        head, sep, body = page.partition("<body")
        page = head + sep + re.sub(r'\b(?:fill|stroke|stop-color|color|style)="[^"]*"', lambda m: recolour(m.group(0), pal), body)
        n = {"v2": "2", "v3": "3"}[key]
        page = page.replace("<title>", f"<title>Colour version {n} ({pal['name']}) | ", 1)
        if 'name="robots"' not in page:
            page = page.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <meta name="robots" content="noindex, nofollow">', 1)
        page = page.replace('<body', f'<body data-version="{key}"', 1)
        (ROOT / f"index-{key}.html").write_text(page, encoding="utf-8")
        print("wrote", f"index-{key}.html", pal["name"])


if __name__ == "__main__":
    main()
