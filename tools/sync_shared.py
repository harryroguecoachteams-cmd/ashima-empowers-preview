"""Copy the shared parts (menu, footer, mobile bar) from _shared/ into every page.

The menu, footer and mobile bar are the same on every page. Each page has them between markers like
    <!-- SHARED:footer START ... -->  ...  <!-- SHARED:footer END -->
Edit the file in _shared/ (menu.html, footer.html, mobile-bar.html), then run from the website folder:
    python tools/sync_shared.py
and every page gets the new version. The home page (index.html) keeps its own footer and mobile bar.
Links are adjusted per page: "index.html#faq" becomes "#faq" on a page that has its own FAQ, and on the
home page every "index.html#..." becomes "#...".
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARED = ROOT / "_shared"


def localise(part, page, html):
    if page == "index.html":
        return part.replace('href="index.html#', 'href="#')
    for anchor in re.findall(r'href="index\.html#([\w-]+)"', part):
        if re.search(rf'\bid="{re.escape(anchor)}"', html):
            part = part.replace(f'href="index.html#{anchor}"', f'href="#{anchor}"')
    return part


def main():
    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8")
        new = html
        for f in SHARED.glob("*.html"):
            name = f.stem
            part = f.read_text(encoding="utf-8").strip("\n")
            pat = re.compile(rf"(<!-- SHARED:{re.escape(name)} START[^>]*-->\n)(.*?)(\n<!-- SHARED:{re.escape(name)} END -->)", re.S)
            new = pat.sub(lambda m: m.group(1) + localise(part, page.name, html) + m.group(3), new)
        if new != html:
            page.write_text(new, encoding="utf-8")
            changed += 1
            print("updated", page.name)
    print(f"{changed} page(s) updated")


if __name__ == "__main__":
    main()
