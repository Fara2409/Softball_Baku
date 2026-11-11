#!/usr/bin/env python3
"""Собирает свежие новости бейсбола (MLB.com и CBS Sports MLB; ESPN не отдаёт RSS серверам GitHub) из RSS в data/news.json.
Запускается GitHub Actions (.github/workflows/news.yml) каждые 2 часа; сайт читает только готовый JSON
(из браузера RSS этих сайтов не читается — CORS). Только стандартная библиотека Python."""
import json, re, sys, html, urllib.request, email.utils, datetime as dt
import xml.etree.ElementTree as ET

FEEDS = [
    ("MLB", "https://www.mlb.com/feeds/news/rss.xml"),
    ("CBS", "https://www.cbssports.com/rss/headlines/mlb/"),
]
MAX_ITEMS = 12
OUT = "data/news.json"
UA = "Mozilla/5.0 (compatible; SoftballBakuNews/1.0; +https://softball.az)"
NS = {"media": "http://search.yahoo.com/mrss/", "content": "http://purl.org/rss/1.0/modules/content/",
      "dc": "http://purl.org/dc/elements/1.1/"}

def text(el):
    return (el.text or "").strip() if el is not None else ""

def clean(s, limit=None):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    if limit and len(s) > limit:
        s = s[:limit].rsplit(" ", 1)[0] + "…"
    return s

def image_of(it):
    for tag in ("media:content", "media:thumbnail"):
        for m in it.findall(tag, NS):
            u = m.get("url")
            if u and (m.get("medium") in (None, "image") or re.search(r"\.(jpe?g|png|webp)", u, re.I)):
                return u
    enc = it.find("enclosure")
    if enc is not None and enc.get("url") and ((enc.get("type") or "").startswith("image") or re.search(r"\.(jpe?g|png|webp)", enc.get("url"), re.I)):
        return enc.get("url")
    img = it.find("image")   # у MLB.com: <image href="…"/> или <image><url>…</url></image>
    if img is not None:
        u = img.get("href") or img.get("url") or text(img.find("url")) or text(img)
        if u.startswith("http"):
            return u
    for src in (text(it.find("content:encoded", NS)), text(it.find("description"))):
        m = re.search(r'<img[^>]+src="([^"]+)"', src) or re.search(r"(https?://\S+\.(?:jpe?g|png|webp))", src)
        if m:
            return m.group(1)
    return None

def when(it):
    raw = text(it.find("pubDate")) or text(it.find("dc:date", NS))
    try:
        d = email.utils.parsedate_to_datetime(raw)
    except Exception:
        try:
            d = dt.datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except Exception:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(dt.timezone.utc)

def fetch(source, url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    root = ET.fromstring(data)
    first = next(root.iter("item"), None)
    if first is not None:  # для отладки: какие поля есть у новости (картинка и т.п.)
        im = first.find("image")
        print(source, "item tags:", [c.tag for c in first], "image:", im.attrib if im is not None else None, file=sys.stderr)
    out = []
    for it in root.iter("item"):
        title, link = clean(text(it.find("title"))), text(it.find("link"))
        if not title or not link.startswith("http"):
            continue
        d = when(it)
        out.append({"source": source, "title": title, "link": link,
                    "summary": clean(text(it.find("description")), 160),
                    "image": image_of(it), "date": d.isoformat().replace("+00:00", "Z") if d else None})
    return out

def main():
    items, ok = [], 0
    for source, url in FEEDS:
        try:
            got = fetch(source, url)
            items += got; ok += 1
            print(f"{source}: {len(got)} items")
        except Exception as e:
            print(f"{source}: FAILED {e}", file=sys.stderr)
    if not ok:
        print("no feeds — keeping old news.json", file=sys.stderr)
        return 0
    seen, uniq = set(), []
    for x in sorted(items, key=lambda x: x["date"] or "", reverse=True):
        k = re.sub(r"\W+", "", x["title"].lower())[:60]
        if k in seen:
            continue
        seen.add(k); uniq.append(x)
    res = uniq[:MAX_ITEMS]
    new = {"items": res}
    try:
        old = json.load(open(OUT, encoding="utf-8"))
        if old.get("items") == res:
            print("no changes"); return 0
    except Exception:
        pass
    new["updated"] = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(new, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"wrote {len(res)} items")
    return 0

if __name__ == "__main__":
    sys.exit(main())
