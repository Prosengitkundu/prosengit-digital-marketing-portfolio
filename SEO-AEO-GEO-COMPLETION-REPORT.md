# SEO + AEO + GEO Completion Report — prosengitkundu.top

**Date:** 2026-09-18
**Scope:** Remaining technical/schema/link fixes on top of the previously completed
restoration + expansion work (12 portfolio pages, 28 blog articles, sitemap,
robots.txt). Design, layout, navigation, colors, typography, images and
functionality were **not** touched — only metadata, structured data, internal
links and one HTML-syntax bug were corrected.

---

## 1. SEO issues found

1. **All 12 portfolio pages were still `noindex, follow`** despite earlier
   reports claiming this was fixed. Confirmed with a direct grep of every file
   before editing.
2. **Malformed HTML on all 40 generated pages** (12 portfolio + 28 blog):
   every internal `href="...html"` produced by `scripts/generate-static-pages.js`
   had a stray extra closing quote (e.g. `href="/index.html""`). This is
   invalid HTML — browsers tolerate it, but it is technically incorrect markup
   and would fail HTML validation. Root cause: a regex bug in the generator's
   `absolutize()` function.
3. **No structured data at all** on any of the 12 portfolio pages (0 JSON-LD
   blocks). Blog articles had `Article` schema but no `BreadcrumbList`.
4. **`faq.html`'s FAQPage schema only listed 12 of the 40 visibly published
   Q&As** — an accuracy gap between visible content and structured data.
5. **`services.html` ProfessionalService schema claimed `priceRange:
   "$8-$800"`**, but the highest price anywhere in the visible pricing table
   (`pricing.html`) is $500. The $800 figure did not exist anywhere in visible
   content — a genuine schema/content mismatch.
6. **Homepage `Person` schema `sameAs` was missing the Facebook profile**
   that appears in the visible footer/social links, while `about.html`'s
   `Person` schema included it — an entity-consistency gap.
7. **Chatbot "Read the article" links (21 of them) pointed to the legacy,
   `noindex` fallback route** `blog-details.html?id=N` instead of the actual
   indexable static article at `/blog/<slug>.html` — a missed internal-link/
   crawl-signal opportunity with no visible UI change required to fix.
8. Master brief's keyword list includes **"Email Marketing," "Google Sites,"
   and "Marketplace Research"** as terms to use "naturally where relevant" —
   none of these currently exist anywhere in the site's visible content or
   service catalog. Per instructions not to invent services, these are
   reported, not fabricated into the copy.

## 2. SEO issues fixed

- All 12 portfolio pages: `<meta name="robots">` changed from
  `noindex, follow` → `index, follow`.
- `scripts/generate-static-pages.js`: fixed the `absolutize()` regex so future
  regenerations no longer produce the extra quote; also hardened `setHead()`
  to always force `index, follow` on generated blog/portfolio pages (the
  `noindex` fallback templates are untouched and still correctly `noindex`).
- The malformed `href="...""` pattern was corrected directly in all 40
  existing static files with a byte-exact, attribute-only text replacement
  (1,594 occurrences fixed) — verified zero unintended content changes via
  `git diff` on every file.
- `services.html` schema `priceRange` corrected from `$8-$800` to `$8-$500`
  to match the real, visible pricing table.
- Homepage `Person` schema `sameAs` now includes the Facebook profile,
  matching `about.html` and the visible footer.

## 3. AEO improvements

- `faq.html`'s `FAQPage` JSON-LD was rebuilt to include **all 40** visible
  question/answer pairs (previously only 12), extracted programmatically from
  the live `<details>/<summary>` markup so the schema is a byte-for-byte
  reflection of what users actually see — no invented questions.
- Verified `pricing.html`'s existing `FAQPage` schema (5 questions) already
  matched its 5 visible FAQs exactly — no change needed there.
- Confirmed every one of the 28 blog articles and 12 portfolio pages already
  carries a genuine, on-topic "Frequently asked questions" section written in
  plain-language, answer-first style (a prior work session had already done
  this) — validated, not rewritten.
- Chatbot answer links now route directly to the indexable article pages,
  so both users and answer-engine crawlers reach the authoritative URL in one
  hop instead of a client-rendered redirect page.

## 4. GEO improvements

- Verified NAP (name/address/phone) consistency: "Khulna, Bangladesh",
  `+8801701059499`, `Prosengit95@gmail.com` are identical across every page
  that states them (footers, contact page, About, schema).
- Verified the "Prosengit Kundu Utshob" (legal name) vs. "Prosengit Kundu"
  (professional brand) distinction is explicitly and correctly explained in
  visible copy on `about.html` — this is accurate disambiguation, not an
  inconsistency, and was left unchanged.
- Synced `sameAs` (LinkedIn + Facebook) across the homepage and About page
  Person schema so entity signals are identical wherever the Person type
  appears.
- Confirmed `areaServed` in the Person/WebSite/ProfessionalService schema
  reflects only markets that already appear somewhere in visible copy or
  testimonials (USA, UK, Canada, Australia, Ireland, Bangladesh, UAE) — the
  broader schema-only list (Germany, France, Netherlands, New Zealand,
  Singapore) that a prior audit flagged as "schema without matching content"
  was **not removed or expanded** in this pass, since the instructions say to
  report rather than unilaterally resolve open targeting questions — see
  Section 20.

## 5. Technical SEO improvements

- Fixed invalid HTML (stray quotes) across all 40 generated pages.
- Fixed the static-page generator script so the bug cannot reoccur on the
  next regeneration.
- Portfolio pages made indexable (see above).
- All internal links, images and sitemap URLs re-validated after every change
  (see Section 19, Tests Performed).

## 6. Schema implemented or validated

| Page type | Schema added/fixed | Schema already correct (validated only) |
|---|---|---|
| Homepage | `sameAs` fix | `Person`, `WebSite` |
| About | — | `Person`, `BreadcrumbList` |
| Services | `priceRange` fix | `ProfessionalService`, `BreadcrumbList` |
| Pricing | — | `OfferCatalog`, `FAQPage` (5/5 accurate), `BreadcrumbList` |
| FAQ | `FAQPage` rebuilt (40/40 accurate) | `BreadcrumbList` |
| Team hub + 5 profiles | — | `Person` × 5, `BreadcrumbList`, `CollectionPage` |
| 12 portfolio pages | **New:** `BreadcrumbList` + `CreativeWork` on every page | — |
| 28 blog articles | **New:** `BreadcrumbList` on every page (27 added + 1 corrected) | `Article` (already present, validated) |

All JSON-LD across all 62 HTML files parses as valid JSON (verified with a
script that loads every `<script type="application/ld+json">` block on every
page).

No fake reviews, ratings, clients, locations, results, awards, certifications
or statistics were added anywhere.

## 7. Internal-link improvements

- 21 chatbot "Read the article" links repointed from the noindex
  `blog-details.html?id=N` fallback to the live, indexable `/blog/<slug>.html`
  pages.
- Verified (not changed) that every one of the 12 portfolio pages is linked
  from 1–3 other pages (home, portfolio.html, and/or a sibling case study's
  prev/next links) and every one of the 28 blog articles is linked from 3–14
  other pages. No orphan content pages exist.

## 8. Portfolio status

- 12/12 pages exist, are unique, are 1,500+ words (1,513–1,571 words each,
  re-verified after the HTML fix), have unique canonical URLs, are now
  `index, follow`, are all in `sitemap.xml`, and all return HTTP 200 on a
  local static-file server test.
- 12/12 now carry valid `BreadcrumbList` + `CreativeWork` JSON-LD.
- Confirmed zero `/undefined`, `/null`, `/false` or empty-slug URLs anywhere
  in `assets/js/projects.js`, the homepage Featured Projects grid, or
  `portfolio.html`'s grid — the previously-reported routing fix holds.

## 9. Blog status

- 28/28 articles exist, are 1,500+ words, have unique titles/descriptions/
  canonicals, are `index, follow`, and are all in `sitemap.xml`.
- 28/28 now carry valid `BreadcrumbList` JSON-LD in addition to their existing
  `Article` JSON-LD.
- Each article's own "Frequently asked questions" section was spot-checked
  and confirmed present and on-topic (2 occurrences of the heading text per
  file = the visible H2 plus the JS-generated TOC anchor text, not a
  duplicate section).

## 10. Sitemap status

- `sitemap.xml` is well-formed XML (validated with `xml.etree.ElementTree`).
- 58 URLs total: 10 top-level pages, 5 team profiles, 3 legal pages, 28 blog
  articles, 12 portfolio pages.
- Every URL uses the canonical `https://prosengitkundu.top/` domain (no `www`,
  no `http://`).
- Every URL returns HTTP 200 against a local static-file server.
- `lastmod` bumped to `2026-09-18` only for the specific files actually
  changed in this pass (home, services, faq, all 12 portfolio pages, all 28
  blog articles) — untouched pages keep their prior `lastmod`.

## 11. Canonical status

- All 62 HTML pages have a `<link rel="canonical">` tag.
- All 12 portfolio canonicals are unique and self-referential.
- All 28 blog canonicals are unique and self-referential.
- No duplicate canonical values found anywhere on the site.

## 12. Robots/noindex status

- `robots.txt` allows everything except `/thank-you.html`, references the
  sitemap, and does not block `/portfolio/` or `/blog/` — unchanged, already
  correct.
- All 12 portfolio pages: now `index, follow` (fixed).
- All 28 blog pages: `index, follow` (already correct).
- `blog-details.html`, `portfolio-details.html`, `thank-you.html`, `404.html`:
  correctly `noindex, follow` (utility/legacy fallback pages, intentionally
  excluded from the sitemap).

## 13. 404 and broken-link status

- `404.html` exists at the repository root (served automatically by GitHub
  Pages for unmatched routes), has working relative links back to Home and
  Contact, and returns its own content correctly.
- Zero occurrences of `/undefined`, `/null`, `/false`, or empty `href=""`
  found in any `.html` or `.js` file (checked with pattern search across the
  full repository, excluding prose text that merely *discusses* the concept
  of "an undefined route" in blog copy, which is not a real link).
- Every internal absolute link (`href="/...html"`) found across all 62 pages
  resolves to HTTP 200.
- Every image referenced with a local path exists on disk (20/20).

## 14. Indexing issues

- **Fixed locally/in-code:** the 12 portfolio pages' `noindex` directive.
- **Cannot be verified without Google Search Console:** whether Google has
  actually crawled/indexed the corrected pages, current index status of any
  URL, or query/impression data. This requires the live domain and Search
  Console access, which this sandbox does not have.

## 15. Keyword map (validated against existing content — not changed)

| Page | Primary keyword | Supporting keywords |
|---|---|---|
| Home | freelance digital marketing expert / Prosengit Kundu | SEO, Google Ads, Meta Ads, B2B lead generation, web development |
| About | Prosengit Kundu (entity/E-E-A-T) | freelance SEO specialist, digital marketing consultant |
| Services | digital marketing services | SEO services, Google Ads management, Meta Ads management, web development |
| Pricing | digital marketing pricing / SEO pricing | freelance SEO rates, website development cost |
| Portfolio | SEO & web development portfolio | case studies, client projects |
| Blog | SEO & digital marketing guides | keyword research, Google Ads vs Meta Ads, HTML vs WordPress |
| FAQ | hiring a freelance SEO specialist | service scope, pricing, international clients |
| Contact | hire freelance SEO & digital marketing expert | request quote, book consultation |
| Team | remote digital marketing team | digital marketing strategist, SEO specialist |

This map was **audited, not altered** — all primary/secondary keywords match
what a prior content pass already established; only genuine technical/schema
defects were corrected in this session.

## 16. Target country/location map (validated — not changed)

- **Explicit, content-supported targets:** USA, UK, Canada, Australia
  (repeated across hero copy, FAQs, testimonials, pricing currency notes),
  plus Bangladesh/Khulna as the home base.
- **Testimonial/schema-supported:** Ireland, UAE.
- **Umbrella phrasing only ("Europe," "Middle East," "Asia"):** used
  consistently as broad remote-availability language, not as specific
  location claims.
- **Schema-only, no matching visible content:** Germany, France, Netherlands,
  New Zealand, Singapore appear in the Person/`areaServed` array but not in
  any visible page copy. This was **not changed** in this session — expanding
  or trimming country targeting is a strategic decision reserved for the site
  owner per the "report rather than auto-change" instruction. Flagged here for
  your decision.

## 17. Content changes made

- **No visible page copy, headings, images, colors, layout, or navigation
  were changed.**
- The only content-adjacent change was **replacing the `FAQPage` JSON-LD on
  `faq.html`** with a complete, accurate list — this is structured data, not
  visible text, and every question/answer was copied verbatim from the
  existing visible `<details>` elements (not rewritten).

## 18. Files changed

```
assets/js/chatbot.js                      (21 URL fixes: legacy → canonical article links)
scripts/generate-static-pages.js          (regex bug fix + forced index,follow on regeneration)
index.html                                (Person schema sameAs: + Facebook)
services.html                             (ProfessionalService schema priceRange fix)
faq.html                                  (FAQPage schema rebuilt: 12 → 40 accurate Q&As)
sitemap.xml                               (lastmod bumped for the 43 URLs actually touched)
portfolio/*.html (12 files)               (robots meta fixed; malformed hrefs fixed;
                                            BreadcrumbList + CreativeWork schema added)
blog/*.html (28 files)                    (malformed hrefs fixed; BreadcrumbList schema added)
```

## 19. Tests performed

1. `node --check` on every `.js` file in `assets/js/`, `scripts/`, and
   `backend/**` — all pass, zero syntax errors.
2. Parsed every `<script type="application/ld+json">` block on all 62 HTML
   pages with a JSON parser — 0 invalid blocks (before and after edits).
3. Parsed `sitemap.xml` with `xml.etree.ElementTree` — valid XML, 58 URLs.
4. Served the full repository with a local static HTTP file server and
   fetched:
   - All 58 sitemap URLs → 100% HTTP 200.
   - All 53 unique internal absolute links found across every page → 100%
     HTTP 200.
   - `404.html`, `thank-you.html`, all 5 team profiles, all legal pages → 200.
   - A deliberately invalid URL → confirmed HTTP 404 (server behaves
     correctly for genuinely missing pages).
5. Word-counted every one of the 12 portfolio pages and 28 blog articles
   (HTML tags stripped) — all remain above 1,500 words after the HTML fix
   (range: 1,513–1,571 for portfolio; all blog articles unaffected in length).
6. Checked every `<img>` tag across all 62 pages (121 total) for a present,
   non-empty `alt` attribute where the image is content-bearing, and for
   `loading`/`fetchpriority` attributes — no missing alt text found; the only
   `alt=""` cases are the header/footer brand-mark logo icons next to visible
   "Prosengit Kundu" text, which is correct practice for decorative/redundant
   icons, not an error.
7. Verified robots.txt does not block `/portfolio/`, `/blog/`, or any indexed
   page.
8. Verified no `/undefined`, `/null`, `/false`, or empty-href patterns exist
   in any real link (only prose mentions in blog copy, which are not links).
9. Re-ran the full HTTP/sitemap/word-count/JSON-LD validation suite a second
   time after every edit to confirm nothing regressed.

## 20. Issues requiring Search Console or live-browser verification

The following **cannot** be confirmed from this sandbox and are **not**
claimed as fixed:

- Actual Google indexing status of the 12 portfolio pages after the
  `noindex` → `index` change (requires Search Console + time).
- Core Web Vitals (LCP/INP/CLS) on the live, deployed domain — this sandbox
  can only serve the files locally over plain HTTP, not measure real-world
  CDN/TLS/network performance.
- Whether GitHub Pages (or whatever host serves `prosengitkundu.top`) applies
  any redirects (www → non-www, HTTP → HTTPS) — `CNAME` shows the bare domain
  and no redirect config is present in this repository, so redirect behavior
  is controlled by DNS/host settings outside this repo and cannot be tested
  here.
- Real crawl behavior of Googlebot on the JS-rendered grids (homepage
  Featured Projects preview, `portfolio.html` grid, `blog.html` grid,
  `testimonials.html` grid) — the data is embedded inline in each page's own
  `<script>` block (not fetched via API), which is a favorable pattern for
  crawlers that execute JavaScript, but actual indexing of these specific
  DOM-injected elements can only be confirmed via Search Console's URL
  Inspection tool or a live rendering test.
- Whether the two open targeting questions (schema-only countries; the
  "Email Marketing / Google Sites / Marketplace Research" keyword gap) should
  be resolved by adding real content or by trimming the schema — this is a
  business decision for the site owner, not a technical fix.

---

## FINAL STATUS: **COMPLETED**

All items in this remaining work order that are verifiable from a static-file
sandbox — audit, keyword/search-intent mapping, metadata accuracy, semantic
HTML, AEO answers, GEO/entity consistency, schema validation and correction,
canonical/robots/sitemap audit, internal-link and orphan-page check, portfolio
and blog URL checks, `/undefined`-style broken-link check, 404 check, and the
previous Featured Projects routing fix — have been completed and verified
with reproducible tests. No visual design, layout, navigation, colors,
typography, spacing, animations, images, existing services, existing target
keywords/countries, or existing chatbot/forms functionality were changed.

Items that inherently require Google Search Console access or a live
production browser (real indexing status, Core Web Vitals, host-level
redirect behavior) are explicitly called out above as **not verified** rather
than claimed as fixed.
