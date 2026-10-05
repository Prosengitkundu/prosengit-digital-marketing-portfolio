# Clean-URL Migration Report

**Goal:** public page URLs no longer expose `.html` — `https://prosengitkundu.top/about.html` → `https://prosengitkundu.top/about`.
**Scope:** technical URL migration only. No design, layout, content, branding or functionality changes.
**Hosting determined before changes were made:** the live site is **static GitHub Pages**
(`CNAME` = `prosengitkundu.top`, Pages `build_type: legacy`, source branch `main`), with an optional
**Node/Express CMS** deployment documented in `README.md` / `backend/README.md`. Both are supported.

---

## 1. URL changes

| Old public URL | New public URL |
|---|---|
| `/about.html` | `/about` |
| `/services.html` | `/services` |
| `/portfolio.html` | `/portfolio` |
| `/pricing.html` | `/pricing` |
| `/blog.html` | `/blog` |
| `/contact.html` | `/contact` |
| `/faq.html`, `/team.html`, `/testimonials.html`, `/privacy-policy.html` | `/faq`, `/team`, `/testimonials`, `/privacy-policy` |
| `/team-<name>.html` (6 profiles) | `/team-<name>` |
| `/terms.html`, `/disclaimer.html`, `/thank-you.html` | `/terms`, `/disclaimer`, `/thank-you` |
| `/index.html` (and `/index`, `/index/`) | `/` |
| `/blog/<slug>.html` (28 articles) | `/blog/<slug>` |
| `/portfolio/<slug>.html` (12 case studies) | `/portfolio/<slug>` |
| `/blog-details.html?id=N` | `/blog-details?id=N` (legacy JS fallback page, stays `noindex`) |
| `/portfolio-details.html?id=N` | `/portfolio-details?id=N` (legacy JS fallback page, stays `noindex`) |
| `/about/` (trailing slash) | `/about` |

Convention: **no trailing slash** (matches the previous canonical style), consistent across every page.
The `.html` files themselves are **kept on disk** — they are the source content, GitHub Pages resolves
`/about` → `about.html`, and the Express app does the same. Nothing was renamed, moved or deleted.

Queries and fragments are preserved (`/contact.html?plan=SEO%20Starter` → `/contact?plan=SEO%20Starter`,
`/services.html#digital-marketing` → `/services#digital-marketing`).

## 2. Redirect implementation (301 permanent)

**a) Node/Express CMS deployment — real HTTP 301s** (`backend/server.js`, new middleware before the
static/SEO layer):

* `/about.html`, `/blog/<slug>.html`, `/blog-details.html?id=N` … → **301** to the clean URL (query preserved)
* `/index.html`, `/index`, `/index/` → **301** to `/`
* `/blog/`, `/about/`, `/portfolio/<slug>/` … → **301** to the slash-less URL
* only existing page files are redirected, always a **single hop** (no chains, no loops — verified)
* `/api/*`, `/admin/*`, `/uploads/*`, assets and root files (`robots.txt`, `sitemap.xml`, `CNAME`,
  favicons) are never redirected
* unknown `*.html` requests do **not** redirect; they return the normal 404 page
* clean URLs are resolved back to the `.html` files inside the existing SEO-injection middleware
  (`/about` → `about.html`, `/blog/<slug>` → `blog/<slug>.html`), with `blog`/`portfolio` listing pages
  deliberately winning over the same-named directories (this also removes an `express.static`
  `/blog` → `/blog/` bounce that would otherwise have created a redirect loop)

**b) GitHub Pages (current static host) — cannot send HTTP redirects.** A static host has no
server-side redirect facility (no `.htaccess`, `_redirects`, `vercel.json` or Jekyll redirect plugin
was added, because none of them are honoured by GitHub Pages). Instead:

* every page already carries a self-referencing **`rel="canonical"`** pointing at the clean URL, and
* `assets/js/site.js` forwards any legacy `.html` path to its clean equivalent
  (`location.replace`, prefix-safe, query/hash preserved, skipped for `/404.html` and for `file://`
  previews). For crawlers and users arriving from an old link or bookmark, the `.html` URL stops
  being a separately reachable page.

> A true server-level 301 for the public domain requires serving the site through the Node app
> (`backend/server.js`, already documented as the CMS deployment target) or moving to a host that
> supports redirect rules. The Express implementation is in place and tested for that path.

## 3. SEO changes

* **Canonical:** every public page declares its clean URL (`https://prosengitkundu.top/about`,
  `/blog/<slug>`, `/portfolio/<slug>`, `/`). One canonical per page — no duplicates.
  `404.html` and `thank-you.html` are intentionally `noindex` and were already canonical-free before
  this migration; no page has an `.html` canonical.
* **Open Graph / Twitter:** `og:url` and `twitter:url` updated on every page (root, blog, case studies).
* **Schema.org JSON-LD:** `Article`/`CreativeWork` `mainEntityOfPage.@id`, `url` and `BreadcrumbList`
  items (breadcrumb section URL is now `/blog` / `/portfolio`) all use clean URLs.
* **sitemap.xml:** 59 entries, all clean URLs, no duplicates, no `.html` variant alongside a clean one,
  no `noindex` pages. `lastmod` bumped to the migration date (`2026-10-05`) so crawlers re-fetch the
  changed URLs. Every `<loc>` was verified to resolve to a real file.
* **robots.txt:** only the one rule that referenced a page URL was updated —
  `Disallow: /thank-you.html` → `Disallow: /thank-you`. Nothing else changed.
* **CMS metadata:** the seeded navigation URLs and canonical values in `backend/db.js` are clean;
  the API now returns clean `url` fields for projects and blog posts (with a safe `?id=` fallback),
  a post's canonical is its own `/blog/<slug>` (never the listing page), and legacy `.html` values
  typed into the admin panel are normalised before being published.
* **Duplicate content:** `/about` vs `/about.html` — on Express the `.html` form permanently
  redirects; on GitHub Pages it is canonicalised to the clean URL and client-forwarded, and it is no
  longer linked anywhere.

## 4. Internal links

All internal page links were converted to root-absolute clean URLs, in every place they appear:

* page headers, mobile menus, footers, breadcrumbs and legal links (static markup **and** the shared
  header/footer builder in `assets/js/site.js`)
* in-content links, buttons, pricing CTAs (`/contact?plan=…`), “view profile”, “read article”,
  previous/next article and project navigation
* `assets/js/articles.js` (article bodies + `url` fields), `assets/js/projects.js`,
  `assets/js/chatbot.js` (assistant link map), `assets/data/portfolio-expansions.json`
* inline per-page scripts (`index.html` featured projects/blog data, `blog.html`, `portfolio.html`,
  `blog-details.html`, `portfolio-details.html` legacy routers)
* `404.html` recovery links
* nav-highlight logic was made section-aware (`/blog/<slug>` highlights *Blog*,
  `/portfolio/<slug>` highlights *Portfolio*, `/team-*` highlights *Team*) — visual result unchanged

Asset references were **not** touched: CSS, JS, images, fonts, favicon, `sitemap.xml`, `robots.txt`,
`CNAME`, verification files, PDFs/downloads and all external URLs are untouched.
`4,000+` page-URL references were converted; the front-end now contains **zero** `.html` page URLs
(the only remaining `.html` tokens in site JS are the regexes that *detect* a legacy URL for the
redirect/active-menu logic).

## 5. Remaining `.html` references (and why they stay)

| File / area | Why it remains |
|---|---|
| `backend/server.js` | Filesystem resolution (`404.html`, `index.html`), admin routes (`/admin/login.html`), and the 301/clean-URL matching logic — required |
| `backend/utils/helpers.js`, `backend/routes/blog.js`, `backend/routes/projects.js`, `backend/public/js/admin.js` | Guards/normalisers that recognise a legacy `.html` value so it is never published; admin placeholders now show `/about` |
| `backend/db.js` (1) | Comment referring to the source file `index.html` |
| `assets/js/site.js` (9), `assets/js/cms.js` (2) | The `.html`-detection regexes used by the legacy-URL redirect and the URL parsing helpers |
| `scripts/generate-static-pages.js` | Output filenames (`blog/<slug>.html`) must stay, and the two template source files (`blog-details.html`, `portfolio-details.html`) — required for GitHub Pages clean-URL resolution |
| `scripts/check-clean-urls.js` | Checker logic that flags `.html` page URLs |
| `scripts/migrate-seo.py` | Historical one-time migration script, now annotated `HISTORICAL — do not re-run` |
| `README.md`, `backend/README.md`, `CONTENT-SEO-REPORT.md`, `SEO-CONTENT-PLAN.md`, `SEO-AUDIT-REPORT.md`, `assets/css/style.css` (comment) | Documentation referring to source **file names**, not public URLs. The historical SEO audit reports were left as records of the pre-migration state; `README.md` documents the new clean-URL structure |

No public page link, canonical, sitemap entry, robots rule or client-rendered URL exposes `.html`.

## 6. Testing performed

**Static audit (no server)** — `node scripts/check-clean-urls.js` (new, re-runnable tool):

* 63 pages, **3,201 internal links**, 59 sitemap URLs — all resolve
* no `.html` page links, no `.html` canonicals, no duplicate canonicals, no duplicate sitemap entries
* data-driven links (`articles.js`, `projects.js`, `chatbot.js`) resolve to real generated pages
* checker validated against deliberately injected faults (bad link, bad data URL, bad robots rule)

**Express runtime test** (server started on `:3000` with a freshly seeded database):

* 200: `/`, `/about`, `/team`, `/team-eitykona`, `/services`, `/pricing`, `/portfolio`, `/blog`,
  `/testimonials`, `/faq`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, `/thank-you`,
  `/404`, `/blog/<slug>` (28/28), `/portfolio/<slug>` (12/12), `/blog-details?id=1`,
  `/portfolio-details?id=4`, `/contact?plan=SEO%20Starter`, `/sitemap.xml`, `/robots.txt`,
  `/assets/*`, `/favicon.svg`, `/api`, `/api/settings`, `/api/blog`, `/api/navigation`, `/api/projects`
* 301 → 200 in exactly **1 hop** for every legacy form tested (24 variants), including `/index`,
  `/index/`, `/index.html`, `/blog/`, `/portfolio/`, `/blog/<slug>.html`, `/blog-details.html?id=7`
* no redirect loops and no chains (trailing-slash and `.html` targets are computed to the final URL
  in one step)
* 404: `/nope-123`, `/nope-123.html`, `/assets/nope.css` → 404 page, no redirect
* canonicals verified live per page type (`/` , `/about`, `/blog`, `/portfolio`, `/blog/<slug>`,
  `/portfolio/<slug>`) — each returns its own clean URL, and the `noindex` templates keep `noindex`
* `/admin` → `302 /admin/login` (unchanged), `/uploads/*` and `/api/*` unaffected
* API `url` fields for all 28 articles and 12 projects return clean URLs that resolve with status 200
* regeneration check: `node scripts/generate-static-pages.js` reproduces the 40 static pages
  byte-for-byte (no content drift)
* JS syntax-checked (`node --check`) for every changed script

No 404, redirect loop, redirect chain or broken navigation issue remains in the audited site.
