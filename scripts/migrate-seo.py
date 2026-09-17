#!/usr/bin/env python3
"""
Migration: static-content SEO fixes (approved changes only).
1. Add slug/url fields to articles.js + projects.js
2. Point all blog-details.html?id=N / portfolio-details.html?id=N links to new static URLs
3. Add legacy redirect (JS) inside blog-details.html / portfolio-details.html
4. Fix team photo 404s (use existing .svg files)
5. Insert favicon links in every page head
"""
import re, sys, pathlib

ROOT = pathlib.Path('/home/user/prosengit-digital-marketing-portfolio')

ARTICLE_SLUGS = {
    1:'how-to-choose-seo-service', 2:'what-is-keyword-research',
    3:'serp-analysis-seo-strategy', 4:'on-page-seo-checklist-small-business',
    5:'technical-seo-basics-new-websites', 6:'seo-friendly-website-essentials',
    7:'improve-website-search-visibility', 8:'seo-vs-google-ads',
    9:'google-ads-vs-meta-ads', 10:'power-of-retargeting',
    11:'how-to-generate-b2b-leads', 12:'build-targeted-lead-list',
    13:'professional-business-website-trust', 14:'html-vs-wordpress',
    15:'responsive-web-design-seo', 16:'high-converting-landing-pages',
    17:'website-speed-seo', 18:'image-seo-optimization',
    19:'small-business-digital-marketing', 20:'social-media-marketing-small-business',
    21:'freelance-portfolio-guide', 22:'international-seo-guide',
    23:'google-ads-management-guide', 24:'meta-ads-guide',
    25:'local-seo-google-business-profile', 26:'wordpress-seo-optimization',
    27:'youtube-seo-marketing', 28:'b2b-lead-generation-international-markets',
}
PROJECT_SLUGS = {
    1:'custom-business-website', 2:'high-converting-landing-page-design',
    3:'photographer-portfolio-website', 4:'local-seo-growth-system',
    5:'keyword-research-content-mapping', 6:'technical-seo-audit-report',
    7:'meta-ads-lead-campaign', 8:'google-ads-search-campaign',
    9:'b2b-targeted-lead-list', 10:'prospect-research-data-cleaning',
    11:'social-media-design-pack', 12:'youtube-thumbnail-design-set',
}
ART_URL = {i: f'/blog/{s}.html' for i, s in ARTICLE_SLUGS.items()}
PRJ_URL = {i: f'/portfolio/{s}.html' for i, s in PROJECT_SLUGS.items()}

def edit(path, fn):
    p = ROOT / path
    src = p.read_text()
    out = fn(src)
    if out != src:
        p.write_text(out)
        print(f'  modified: {path}')
    else:
        print(f'  WARNING unchanged: {path}')
    return out

# ---------- 1. articles.js ----------
def fix_articles(src):
    def ins(m):
        n = int(m.group(2))
        slug, url = ARTICLE_SLUGS[n], ART_URL[n]
        return f'{m.group(1)}\n  slug: "{slug}",\n  url: "{url}",'
    src = re.sub(r'(\{\n  id: (\d+),)', ins, src)
    for n in ARTICLE_SLUGS:
        src = src.replace(f'blog-details.html?id={n}"', ART_URL[n] + '"')
        src = src.replace(f'https://prosengitkundu.top/blog-details.html?id={n}', ART_URL[n])
    return src
edit('assets/js/articles.js', fix_articles)

# ---------- 2. projects.js ----------
def fix_projects(src):
    def ins(m):
        n = int(m.group(2))
        slug, url = PROJECT_SLUGS[n], PRJ_URL[n]
        return f'{m.group(1)}\n    slug: "{slug}",\n    url: "{url}",'
    src = re.sub(r'(\{\n    id: (\d+),)', ins, src)
    for n in PROJECT_SLUGS:
        src = src.replace(f'portfolio-details.html?id={n}"', PRJ_URL[n] + '"')
    return src
edit('assets/js/projects.js', fix_projects)

# ---------- 3. blog.html ----------
def fix_blog(src):
    src = src.replace('href="blog-details.html?id=${a.id}"', 'href="${a.url}"')
    for n in (1, 22, 23):
        src = src.replace(f'blog-details.html?id={n}', ART_URL[n])
    return src
edit('blog.html', fix_blog)

# ---------- 4. blog-details.html : redirect + new urls in fallback renderer ----------
def fix_blogdetails(src):
    redirect = """        // Legacy URL handler: send ?id=N visitors to the static article page
        // (content now lives in crawlable static HTML under /blog/).
        (function () {
            if (!params.get('id')) return; // bare URL keeps legacy behaviour
            const legacy = ARTICLES.find(a => a.id === id);
            if (legacy && legacy.url) { window.location.replace(legacy.url); }
        })();

"""
    anchor = "        const params = new URLSearchParams(window.location.search);\n        const id = parseInt(params.get('id')) || 1;\n        const idx = Math.max(0, ARTICLES.findIndex(a => a.id === id));\n"
    assert anchor in src, 'anchor not found in blog-details.html'
    src = src.replace(anchor, anchor + redirect)
    src = src.replace('href="blog-details.html?id=${r.id}"', 'href="${r.url}"')
    src = src.replace('href="blog-details.html?id=${prev.id}"', 'href="${prev.url}"')
    src = src.replace('href="blog-details.html?id=${next.id}"', 'href="${next.url}"')
    return src
edit('blog-details.html', fix_blogdetails)

# ---------- 5. portfolio-details.html ----------
def fix_pdetails(src):
    anchor = "        const idParam = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;\n        const idx = Math.max(0, PROJECTS.findIndex(p => p.id === idParam));\n"
    assert anchor in src, 'anchor not found in portfolio-details.html'
    redirect = """        // Legacy URL handler: send ?id=N visitors to the static case-study page.
        (function () {
            if (!new URLSearchParams(window.location.search).get('id')) return;
            const legacy = PROJECTS.find(p => p.id === idParam);
            if (legacy && legacy.url) { window.location.replace(legacy.url); }
        })();

"""
    src = src.replace(anchor, anchor + redirect)
    src = src.replace('href="portfolio-details.html?id=${PROJECTS[idx-1].id}"', 'href="${PROJECTS[idx-1].url}"')
    src = src.replace('href="portfolio-details.html?id=${PROJECTS[idx+1].id}"', 'href="${PROJECTS[idx+1].url}"')
    return src
edit('portfolio-details.html', fix_pdetails)

# ---------- 6. index.html ----------
def fix_index(src):
    src = src.replace('href="portfolio-details.html?id=${project.id}"', 'href="${project.url}"')
    src = src.replace('href="blog-details.html?id=${article.id}"', 'href="${article.url}"')
    src = src.replace('blog-details.html?id=14"', ART_URL[14] + '"')
    return src
edit('index.html', fix_index)

# ---------- 7. services.html ----------
def fix_services(src):
    src = src.replace('blog-details.html?id=8"', ART_URL[8] + '"')
    src = src.replace('blog-details.html?id=14"', ART_URL[14] + '"')
    return src
edit('services.html', fix_services)

# ---------- 8. faq.html ----------
def fix_faq(src):
    for n in (12, 26, 27):
        src = src.replace(f'blog-details.html?id={n}"', ART_URL[n] + '"')
    return src
edit('faq.html', fix_faq)

# ---------- 9. team photo 404 fix ----------
team_pages = ['index.html', 'team.html', 'team-eitykona.html', 'team-nilanjana.html',
              'team-sarna.html', 'team-shamim.html', 'team-priyanka.html']
def fix_teamimg(src):
    return re.sub(r'<img src="(assets/images/team/[a-z0-9.-]+)\.jpg" onerror="[^"]*"',
                  r'<img src="\1.svg"', src)
for f in team_pages:
    edit(f, fix_teamimg)

# ---------- 10. favicon links in every page head ----------
FAV = ('    <link rel="icon" type="image/svg+xml" href="/favicon.svg">\n'
       '    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">\n'
       '    <link rel="apple-touch-icon" href="/apple-touch-icon.png">\n')
def add_favicon(src):
    if 'favicon.svg' in src:
        return src
    m = re.search(r'([ \t]*<link rel="canonical"[^>]*>\n)', src)
    if m:
        return src.replace(m.group(1), m.group(1) + FAV, 1)
    m = re.search(r'([ \t]*<title>[^<]*</title>\n)', src)
    if m:
        return src.replace(m.group(1), m.group(1) + FAV, 1)
    return src
for p in sorted(ROOT.glob('*.html')):
    edit(p.name, add_favicon)

print('migration done')
