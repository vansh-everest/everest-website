"""Import the old WordPress site's posts and legal pages into the Next site.

usage: python3 -I scripts/wp-import.py .   (needs Pillow)
Writes <repo>/src/content/news-posts.json, <repo>/src/content/legal/*.json and
<repo>/public/news/<id>.webp. Re-running replaces them.
"""
import html
import io
import json
import os
import re
import sys
import urllib.request
from html.parser import HTMLParser

from PIL import Image

REPO = sys.argv[1]
BASE = "https://everestfleet.com"
UA = {"User-Agent": "Mozilla/5.0 (everest-website migration)"}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def get_json(url):
    return json.loads(get(url))


# Old page paths that moved; links inside the imported text follow them.
MOVED = {
    "/about-everest-fleet/": "/about-us/",
    "/career/": "/careers/",
    "/everest-employee-mobility/": "/employee-mobility/",
    "/everest-fleet-logistics/": "/fleet-logistics/",
}

KEEP = {"p", "h2", "h3", "h4", "ul", "ol", "li", "a", "strong", "em", "br", "blockquote"}
RENAME = {"b": "strong", "i": "em", "h1": "h2", "h5": "h4", "h6": "h4"}
DROP_WITH_CONTENT = {"style", "script", "noscript", "svg", "form", "button", "nav", "iframe", "figure", "img"}
BLOCK = {"p", "h2", "h3", "h4", "ul", "ol", "li", "blockquote"}


def local_href(href):
    href = html.unescape(href).strip()
    for host in ("https://everestfleet.com", "http://everestfleet.com", "https://www.everestfleet.com"):
        if href.startswith(host):
            path = href[len(host):] or "/"
            if not path.endswith("/") and "." not in path.split("/")[-1] and "#" not in path and "?" not in path:
                path += "/"
            return MOVED.get(path, path), False
    return href, href.startswith("http")


class Clean(HTMLParser):
    """Keeps text and a small set of tags; drops classes, styles and builder wrappers."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.skip = 0
        self.stack = []

    def handle_starttag(self, tag, attrs):
        if self.skip:
            if tag in DROP_WITH_CONTENT:
                self.skip += 1
            return
        if tag in DROP_WITH_CONTENT:
            self.skip = 1
            return
        tag = RENAME.get(tag, tag)
        if tag not in KEEP:
            return
        if tag == "br":
            self.out.append("<br>")
            return
        if tag == "a":
            href = dict(attrs).get("href") or ""
            if not href or href.startswith("#") or href.startswith("javascript"):
                self.stack.append(None)
                return
            href, external = local_href(href)
            extra = ' target="_blank" rel="noopener noreferrer"' if external else ""
            self.out.append(f'<a href="{html.escape(href, quote=True)}"{extra}>')
            self.stack.append("a")
            return
        self.out.append(f"<{tag}>")
        self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.skip:
            if tag in DROP_WITH_CONTENT:
                self.skip -= 1
            return
        tag = RENAME.get(tag, tag)
        if tag not in KEEP or tag == "br":
            return
        # close the most recent matching open tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i] == tag or (tag == "a" and self.stack[i] is None):
                opened = self.stack.pop(i)
                if opened:
                    self.out.append(f"</{opened}>")
                return

    def handle_data(self, data):
        if self.skip:
            return
        self.out.append(html.escape(data, quote=False))

    def result(self):
        while self.stack:
            t = self.stack.pop()
            if t:
                self.out.append(f"</{t}>")
        s = "".join(self.out)
        s = s.replace("\xa0", " ")
        s = re.sub(r"[ \t\r\n]+", " ", s)
        s = re.sub(r"\s*(<br>\s*)+</(p|li|h2|h3|h4)>", r"</\2>", s)
        # drop empty blocks, repeatedly (an empty li inside an empty ul)
        for _ in range(4):
            s = re.sub(r"<(p|h2|h3|h4|li|strong|em|blockquote)>\s*</\1>", "", s)
            s = re.sub(r"<(ul|ol)>\s*</\1>", "", s)
        s = re.sub(r"\s*(</?(?:p|h2|h3|h4|ul|ol|li|blockquote)>)\s*", r"\1", s)
        return s.strip()


def clean(raw):
    c = Clean()
    c.feed(raw)
    return c.result()


def text_of(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def describe(fragment, limit=155):
    """The first sentences of the text, cut on a word boundary: the meta description."""
    t = text_of(fragment)
    if len(t) <= limit:
        return t
    cut = t[: limit - 1].rsplit(" ", 1)[0].rstrip(",;:")
    return cut + "…"


def save_image(url, name):
    os.makedirs(os.path.join(REPO, "public", "news"), exist_ok=True)
    im = Image.open(io.BytesIO(get(url))).convert("RGB")
    if im.width > 1200:
        im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
    path = os.path.join(REPO, "public", "news", f"{name}.webp")
    im.save(path, "WEBP", quality=80, method=6)
    return {"src": f"/news/{name}.webp", "width": im.width, "height": im.height}


posts = get_json(f"{BASE}/wp-json/wp/v2/posts?per_page=100&_embed=1")
out = []
for p in posts:
    body = clean(p["content"]["rendered"])
    title = text_of(p["title"]["rendered"])
    yoast = p.get("yoast_head_json") or {}
    image_url = ((yoast.get("og_image") or [{}])[0]).get("url") or (
        (p.get("_embedded", {}).get("wp:featuredmedia") or [{}])[0].get("source_url")
    )
    image = None
    if image_url:
        try:
            image = save_image(image_url, str(p["id"]))
            image["alt"] = title
            image["from"] = image_url
        except Exception as e:  # a dead image leaves the post without one
            print("image failed", p["slug"], e)
    out.append(
        {
            "id": p["id"],
            "slug": p["slug"],
            "title": title,
            "date": p["date"],
            "modified": p["modified"],
            "description": describe(body),
            "image": image,
            "html": body,
        }
    )
    print(f"{p['slug'][:60]:60s} {len(text_of(body).split()):4d}w img:{'y' if image else '-'}")

out.sort(key=lambda x: x["date"], reverse=True)
with open(os.path.join(REPO, "src", "content", "news-posts.json"), "w") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

LEGAL = {
    "privacy-policy": "privacy-policy",
    "terms-of-service": "terms-of-service",
    "app-privacy-policy": "app-privacy-policy",
    "terms-and-conditions-for-referral-program": "referral-terms",
}
os.makedirs(os.path.join(REPO, "src", "content", "legal"), exist_ok=True)
pages = get_json(f"{BASE}/wp-json/wp/v2/pages?per_page=100&slug={','.join(LEGAL)}")
for p in pages:
    body = clean(p["content"]["rendered"])
    title = text_of(p["title"]["rendered"])
    # The builder repeats the page title as the first heading; the page prints its own h1.
    body = re.sub(r"^<h2>" + re.escape(html.escape(title, quote=False)) + r"</h2>", "", body, flags=re.I)
    doc = {"slug": p["slug"], "title": title, "modified": p["modified"], "description": describe(body), "html": body}
    with open(os.path.join(REPO, "src", "content", "legal", f"{LEGAL[p['slug']]}.json"), "w") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
    print(f"legal {p['slug']:45s} {len(text_of(body).split()):5d}w")
