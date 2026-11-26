"""Copy the shared parts (menu, footer, mobile bar) from _shared/ into every page.

The menu, footer and mobile bar are the same on every page. Each page has them between markers like
    <!-- SHARED:footer START ... -->  ...  <!-- SHARED:footer END -->
Edit the file in _shared/ (menu.html, footer.html, mobile-bar.html), then run from the website folder:
    python tools/sync_shared.py
and every page gets the new version. The home page (index.html) keeps its own footer and mobile bar.
Links are adjusted per page: "index.html#faq" becomes "#faq" on a page that has its own FAQ, and on the
home page every "index.html#..." becomes "#...". Each page keeps its own line endings.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHARED = ROOT / "_shared"
NO_SHARED = {"brand.html", "video-script.html"}   # internal pages without the site menu


def localise(part, page, html):
    if page.startswith("index"):
        return part.replace('href="index.html#', 'href="#')
    for anchor in re.findall(r'href="index\.html#([\w-]+)"', part):
        if re.search(rf'\bid="{re.escape(anchor)}"', html):
            part = part.replace(f'href="index.html#{anchor}"', f'href="#{anchor}"')
    return part


def main():
    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8", newline="")
        eol = "\r\n" if "\r\n" in html else "\n"
        new = html
        for f in sorted(SHARED.glob("*.html")):
            name = f.stem
            part = f.read_text(encoding="utf-8").strip("\r\n").replace("\r\n", "\n").replace("\n", eol)
            pat = re.compile(rf"(<!-- SHARED:{re.escape(name)} START[^>]*-->\r?\n)(.*?)(\r?\n<!-- SHARED:{re.escape(name)} END -->)", re.S)
            if not pat.search(new):
                if page.name not in NO_SHARED and not (page.name.startswith("index") and name != "menu"):
                    print(f"WARNING: {page.name} has no SHARED:{name} markers, so it was not updated")
                continue
            body = localise(part, page.name, html)
            new = pat.sub(lambda m: m.group(1) + body + m.group(3), new)
        if new != html:
            page.write_text(new, encoding="utf-8", newline="")
            changed += 1
            print("updated", page.name)
    print(f"{changed} page(s) updated")


if __name__ == "__main__":
    main()
