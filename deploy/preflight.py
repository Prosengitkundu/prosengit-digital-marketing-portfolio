#!/usr/bin/env python3
"""
Pre-flight validation for the Prosengit Kundu static site.

Pure stdlib. No network. Exits 0 if there are no errors, 1 otherwise.
Warnings never fail the build unless --strict is passed.

Checks
  1. required files present
  2. HTML sanity  (unclosed/stray tags, duplicate ids, head essentials, lang)
  3. internal links + assets resolve on disk (incl. #fragments)
  4. sitemap.xml consistency (files exist, host matches, coverage, lastmod)
  5. robots.txt sanity
  6. CNAME vs canonical/og host agreement
  7. image weight + webp coverage
  8. minification / payload check for css + js
  9. JSON-LD parses
 10. mixed content + insecure external refs
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

# ---------------------------------------------------------------- reporting

ERRORS: list[tuple[str, str]] = []
WARNINGS: list[tuple[str, str]] = []
NOTES: list[str] = []

USE_COLOR = sys.stdout.isatty() and os.environ.get("NO_COLOR") is None


def c(code: str, s: str) -> str:
    return f"\033[{code}m{s}\033[0m" if USE_COLOR else s


def err(scope: str, msg: str) -> None:
    ERRORS.append((scope, msg))


def warn(scope: str, msg: str) -> None:
    WARNINGS.append((scope, msg))


def note(msg: str) -> None:
    NOTES.append(msg)


# ---------------------------------------------------------------- constants

REQUIRED_FILES = [
    "index.html",
    "404.html",
    "CNAME",
    "robots.txt",
    "sitemap.xml",
]

# Tags that legitimately have no closing tag.
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}
# Tags whose close tag is optional in HTML5 — don't police nesting for these.
OPTIONAL_CLOSE = {"li", "p", "tr", "td", "th", "thead", "tbody", "tfoot", "option", "dt", "dd"}

IMG_WARN_KB = 250
IMG_ERR_KB = 900
CSS_WARN_KB = 400
JS_WARN_KB = 250

SKIP_SCHEMES = {"mailto", "tel", "sms", "javascript", "data", "whatsapp"}


# ---------------------------------------------------------------- html parse

class PageParser(HTMLParser):
    """Collects structure + references from one HTML document."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, int]] = []
        self.unclosed: list[tuple[str, int]] = []
        self.stray_close: list[tuple[str, int]] = []
        self.ids: dict[str, int] = {}
        self.dup_ids: list[tuple[str, int]] = []
        self.refs: list[tuple[str, str, int]] = []   # (kind, url, line)
        self.title: str | None = None
        self._in_title = False
        self.metas: dict[str, str] = {}
        self.canonical: str | None = None
        self.html_lang: str | None = None
        self.jsonld: list[tuple[str, int]] = []
        self._in_jsonld = False
        self._jsonld_buf: list[str] = []
        self._jsonld_line = 0
        self.imgs: list[tuple[dict[str, str], int]] = []
        self.has_h1 = False
        self.h1_count = 0

    # -- helpers
    def _attr(self, attrs, name):
        for k, v in attrs:
            if k.lower() == name:
                return v or ""
        return None

    def handle_starttag(self, tag, attrs, self_closing=False):
        tag = tag.lower()
        line = self.getpos()[0]
        adict = {k.lower(): (v or "") for k, v in attrs}

        if tag not in VOID_TAGS and not self_closing:
            self.stack.append((tag, line))

        if tag == "html":
            self.html_lang = adict.get("lang")
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = adict.get("name") or adict.get("property")
            if key:
                self.metas[key.lower()] = adict.get("content", "")
        elif tag == "link":
            rel = (adict.get("rel") or "").lower()
            href = adict.get("href", "")
            if "canonical" in rel:
                self.canonical = href
            if href:
                self.refs.append(("link", href, line))
        elif tag == "a":
            href = adict.get("href")
            if href is not None:
                self.refs.append(("a", href, line))
        elif tag == "img":
            src = adict.get("src")
            if src:
                self.refs.append(("img", src, line))
            self.imgs.append((adict, line))
        elif tag == "source":
            for cand in (adict.get("srcset"), adict.get("src")):
                if cand:
                    for part in cand.split(","):
                        u = part.strip().split(" ")[0]
                        if u:
                            self.refs.append(("source", u, line))
        elif tag == "script":
            src = adict.get("src")
            if src:
                self.refs.append(("script", src, line))
            if (adict.get("type") or "").lower() == "application/ld+json":
                self._in_jsonld = True
                self._jsonld_buf = []
                self._jsonld_line = line
        elif tag == "form":
            act = adict.get("action")
            if act:
                self.refs.append(("form", act, line))
        elif tag == "h1":
            self.has_h1 = True
            self.h1_count += 1

        _id = adict.get("id")
        if _id:
            if _id in self.ids:
                self.dup_ids.append((_id, line))
            else:
                self.ids[_id] = line

    def handle_startendtag(self, tag, attrs):
        # XHTML-style "<path ... />" — opens and closes in one go, never stacked.
        self.handle_starttag(tag, attrs, self_closing=True)

    def handle_endtag(self, tag):
        tag = tag.lower()
        line = self.getpos()[0]
        if tag == "title":
            self._in_title = False
        if tag == "script" and self._in_jsonld:
            self._in_jsonld = False
            self.jsonld.append(("".join(self._jsonld_buf), self._jsonld_line))
        if tag in VOID_TAGS:
            return
        # find nearest matching open tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                # anything above it was never closed
                for orphan, oline in self.stack[i + 1:]:
                    if orphan not in OPTIONAL_CLOSE:
                        self.unclosed.append((orphan, oline))
                del self.stack[i:]
                return
        self.stray_close.append((tag, line))

    def handle_data(self, data):
        if self._in_title:
            self.title = ((self.title or "") + data).strip()
        if self._in_jsonld:
            self._jsonld_buf.append(data)

    def close(self):
        super().close()
        for tag, line in self.stack:
            if tag not in OPTIONAL_CLOSE:
                self.unclosed.append((tag, line))


# ---------------------------------------------------------------- checks

def check_required(root: Path) -> None:
    for name in REQUIRED_FILES:
        if not (root / name).is_file():
            err("required", f"missing {name}")


def read_domain(root: Path) -> str:
    cname = root / "CNAME"
    if not cname.is_file():
        return ""
    return cname.read_text(encoding="utf-8").strip().splitlines()[0].strip() if cname.read_text(encoding="utf-8").strip() else ""


def resolve_local(root: Path, page: Path, url: str, domain: str):
    """Return (path_or_None, fragment, is_local). None path => not a local file ref."""
    u = url.strip()
    if not u:
        return None, "", False
    parsed = urlparse(u)
    if parsed.scheme and parsed.scheme.lower() in SKIP_SCHEMES:
        return None, "", False
    if parsed.scheme in ("http", "https"):
        host = parsed.netloc.lower()
        if domain and host in (domain.lower(), f"www.{domain.lower()}"):
            path = parsed.path or "/"
        else:
            return None, parsed.fragment, False
    elif u.startswith("//"):
        return None, "", False
    else:
        path = parsed.path

    frag = parsed.fragment
    if not path:                      # pure "#anchor"
        return page, frag, True

    path = unquote(path)
    if path.startswith("/"):
        target = root / path.lstrip("/")
    else:
        target = (page.parent / path).resolve()
    if path.endswith("/") or target.is_dir():
        target = target / "index.html"
    return target, frag, True


def check_pages(root: Path, domain: str):
    pages = sorted(root.glob("*.html")) + sorted(root.glob("*/*.html"))
    pages = [p for p in pages if ".git" not in p.parts and "deploy" not in p.parts]
    parsed_pages: dict[Path, PageParser] = {}

    for page in pages:
        rel = page.relative_to(root).as_posix()
        raw = page.read_text(encoding="utf-8", errors="replace")
        p = PageParser()
        try:
            p.feed(raw)
            p.close()
        except Exception as exc:               # noqa: BLE001
            err(rel, f"HTML parse failure: {exc}")
            continue
        parsed_pages[page] = p

        # --- 2. structure
        if not raw.lstrip().lower().startswith("<!doctype html"):
            warn(rel, "missing <!DOCTYPE html>")
        if not p.html_lang:
            warn(rel, "<html> has no lang attribute")
        for tag, line in p.unclosed[:8]:
            err(rel, f"unclosed <{tag}> opened at line {line}")
        for tag, line in p.stray_close[:8]:
            err(rel, f"stray </{tag}> at line {line}")
        for _id, line in p.dup_ids[:8]:
            err(rel, f'duplicate id="{_id}" at line {line}')

        # --- head essentials
        if not p.title:
            err(rel, "no <title>")
        elif len(p.title) > 65:
            warn(rel, f"title is {len(p.title)} chars (>65 gets truncated in SERPs)")
        desc = p.metas.get("description", "")
        if not desc:
            err(rel, "no meta description")
        elif not (50 <= len(desc) <= 165):
            warn(rel, f"meta description is {len(desc)} chars (aim 50-165)")
        if not p.canonical:
            warn(rel, "no rel=canonical")
        if not p.metas.get("viewport"):
            err(rel, "no viewport meta")
        if rel != "404.html":
            if not p.metas.get("og:image"):
                warn(rel, "no og:image")
            if not p.metas.get("og:title"):
                warn(rel, "no og:title")
        if not p.has_h1:
            warn(rel, "no <h1> on page")
        elif p.h1_count > 1:
            warn(rel, f"{p.h1_count} <h1> elements (should be 1)")

        # --- canonical host vs CNAME
        if domain and p.canonical:
            host = urlparse(p.canonical).netloc.lower()
            if host and host not in (domain.lower(), f"www.{domain.lower()}"):
                err(rel, f"canonical host '{host}' != CNAME '{domain}'")

        # --- 9. JSON-LD
        for blob, line in p.jsonld:
            try:
                json.loads(blob)
            except json.JSONDecodeError as exc:
                err(rel, f"invalid JSON-LD at line {line}: {exc.msg} (line {exc.lineno} of block)")

        # --- images: alt + dimensions
        for adict, line in p.imgs:
            if adict.get("alt") is None:
                warn(rel, f"<img> without alt at line {line} ({adict.get('src','?')})")
            if not adict.get("loading") and "hero" not in adict.get("class", ""):
                pass  # informational only, too noisy to warn

        # --- 10. mixed content
        for kind, url, line in p.refs:
            if url.startswith("http://"):
                err(rel, f"insecure http:// {kind} at line {line}: {url}")

    return parsed_pages


def check_links(root: Path, domain: str, parsed_pages: dict[Path, PageParser]) -> None:
    """3. every local href/src resolves; every #fragment exists in the target."""
    id_cache: dict[Path, set[str]] = {
        pg: set(pp.ids) for pg, pp in parsed_pages.items()
    }

    for page, p in parsed_pages.items():
        rel = page.relative_to(root).as_posix()
        seen: set[str] = set()
        for kind, url, line in p.refs:
            if url in seen:
                continue
            seen.add(url)
            target, frag, is_local = resolve_local(root, page, url, domain)
            if not is_local or target is None:
                continue
            if not target.exists():
                try:
                    shown = target.relative_to(root).as_posix()
                except ValueError:
                    shown = str(target)
                err(rel, f"broken {kind} at line {line}: {url} -> {shown} not found")
                continue
            if frag and target.suffix == ".html":
                ids = id_cache.get(target)
                if ids is None and target in parsed_pages:
                    ids = set(parsed_pages[target].ids)
                if ids is not None and frag not in ids:
                    warn(rel, f"anchor #{frag} not found in {target.name} (line {line})")


def check_sitemap(root: Path, domain: str) -> None:
    sm = root / "sitemap.xml"
    if not sm.is_file():
        return
    try:
        tree = ET.parse(sm)
    except ET.ParseError as exc:
        err("sitemap.xml", f"XML is malformed: {exc}")
        return

    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [e.text.strip() for e in tree.getroot().findall(".//s:loc", ns) if e.text]
    if not locs:
        err("sitemap.xml", "contains no <loc> entries")
        return

    listed: set[str] = set()
    for loc in locs:
        u = urlparse(loc)
        if u.scheme != "https":
            err("sitemap.xml", f"{loc} is not https")
        if domain and u.netloc.lower() != domain.lower():
            err("sitemap.xml", f"{loc} host != CNAME '{domain}'")
        path = u.path or "/"
        fname = "index.html" if path in ("", "/") else path.lstrip("/")
        listed.add(fname)
        if not (root / fname).is_file():
            err("sitemap.xml", f"{loc} points at missing file {fname}")

    for url_el in tree.getroot().findall(".//s:url", ns):
        lm = url_el.find("s:lastmod", ns)
        if lm is not None and lm.text and not re.fullmatch(r"\d{4}-\d{2}-\d{2}(T.*)?", lm.text.strip()):
            err("sitemap.xml", f"bad lastmod format: {lm.text!r}")

    on_disk = {
        p.name for p in root.glob("*.html")
        if p.name not in {"404.html", "thank-you.html", "blog-details.html", "portfolio-details.html"}
    }
    for missing in sorted(on_disk - listed):
        warn("sitemap.xml", f"{missing} exists but is not listed")

    note(f"sitemap lists {len(locs)} URLs")


def check_robots(root: Path, domain: str) -> None:
    rf = root / "robots.txt"
    if not rf.is_file():
        return
    text = rf.read_text(encoding="utf-8")
    low = text.lower()
    if "user-agent:" not in low:
        err("robots.txt", "no User-agent directive")
    m = re.search(r"(?im)^\s*sitemap:\s*(\S+)", text)
    if not m:
        err("robots.txt", "no Sitemap: line")
    else:
        sm_url = m.group(1)
        if domain and urlparse(sm_url).netloc.lower() != domain.lower():
            err("robots.txt", f"Sitemap host in {sm_url} != CNAME '{domain}'")
        if not (root / "sitemap.xml").is_file():
            err("robots.txt", f"Sitemap points to {sm_url} but sitemap.xml is missing")
    if re.search(r"(?im)^\s*disallow:\s*/\s*$", text):
        err("robots.txt", "'Disallow: /' would deindex the entire site")


def check_cname(root: Path, domain: str) -> None:
    f = root / "CNAME"
    if not f.is_file():
        return
    raw = f.read_text(encoding="utf-8")
    lines = [l for l in raw.splitlines() if l.strip()]
    if len(lines) != 1:
        err("CNAME", f"must contain exactly one domain, found {len(lines)} lines")
    if not re.fullmatch(r"[a-z0-9.-]+\.[a-z]{2,}", domain or "", re.I):
        err("CNAME", f"'{domain}' does not look like a valid domain")
    else:
        note(f"custom domain: {domain}")


def check_assets(root: Path) -> None:
    """7 + 8: image weight, webp coverage, css/js payload + minification."""
    img_root = root / "assets" / "images"
    if img_root.is_dir():
        total = 0
        for img in sorted(img_root.rglob("*")):
            if not img.is_file() or img.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}:
                continue
            kb = img.stat().st_size / 1024
            total += kb
            rel = img.relative_to(root).as_posix()
            if kb > IMG_ERR_KB:
                err("images", f"{rel} is {kb:.0f} KB (>{IMG_ERR_KB} KB)")
            elif kb > IMG_WARN_KB:
                warn("images", f"{rel} is {kb:.0f} KB (>{IMG_WARN_KB} KB, consider recompressing)")
            if img.suffix.lower() in {".jpg", ".jpeg", ".png"}:
                if not img.with_suffix(".webp").is_file():
                    warn("images", f"{rel} has no .webp sibling")
        note(f"images total {total/1024:.1f} MB")

    for sub, warn_kb in (("css", CSS_WARN_KB), ("js", JS_WARN_KB)):
        d = root / "assets" / sub
        if not d.is_dir():
            continue
        for f in sorted(d.glob(f"*.{sub}")):
            kb = f.stat().st_size / 1024
            rel = f.relative_to(root).as_posix()
            text = f.read_text(encoding="utf-8", errors="replace")
            lines = text.splitlines() or [""]
            avg_len = len(text) / max(len(lines), 1)
            minified = ".min." in f.name or avg_len > 200
            if kb > warn_kb and not minified:
                warn("assets", f"{rel} is {kb:.0f} KB and unminified (avg line {avg_len:.0f} chars)")
            elif kb > warn_kb:
                note(f"{rel} is {kb:.0f} KB (minified)")
            if sub == "js":
                for i, line in enumerate(lines, 1):
                    if re.search(r"(?<![\w.])console\.(log|debug)\s*\(", line):
                        warn("assets", f"{rel}:{i} leftover console.{re.search(r'console.(log|debug)', line).group(1)}()")
                        break
                if re.search(r"(?m)^\s*debugger\b", text):
                    err("assets", f"{rel} contains a `debugger` statement")


# ---------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser(description="Pre-flight checks for the static site.")
    ap.add_argument("--root", default=".", help="site root (default: cwd)")
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors")
    ap.add_argument("--quiet", action="store_true", help="only print the summary")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"root {root} is not a directory", file=sys.stderr)
        return 2

    domain = read_domain(root)

    check_required(root)
    check_cname(root, domain)
    parsed = check_pages(root, domain)
    check_links(root, domain, parsed)
    check_sitemap(root, domain)
    check_robots(root, domain)
    check_assets(root)

    print(c("1", f"\nPre-flight  ·  {root}"))
    print(f"  pages scanned : {len(parsed)}")
    for n in NOTES:
        print(f"  {n}")
    print()

    if WARNINGS and not args.quiet:
        print(c("33", f"WARNINGS ({len(WARNINGS)})"))
        for scope, msg in WARNINGS:
            print(f"  {c('33','!')} {scope}: {msg}")
        print()

    if ERRORS:
        print(c("31", f"ERRORS ({len(ERRORS)})"))
        for scope, msg in ERRORS:
            print(f"  {c('31','x')} {scope}: {msg}")
        print()

    if ERRORS:
        print(c("31", f"FAILED — {len(ERRORS)} error(s), {len(WARNINGS)} warning(s)"))
        return 1
    if args.strict and WARNINGS:
        print(c("31", f"FAILED (--strict) — {len(WARNINGS)} warning(s)"))
        return 1
    print(c("32", f"PASSED — 0 errors, {len(WARNINGS)} warning(s)"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
