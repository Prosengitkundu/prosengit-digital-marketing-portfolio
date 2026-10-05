# Prosengit Kundu — Digital Marketing Portfolio (CMS-backed)

This repository now contains **your existing website, converted into a dynamic
CMS-based site** with a secure admin panel, **while preserving the original
frontend design, layout, responsiveness, SEO structure and visual appearance**.

The full documentation lives in **[`backend/README.md`](backend/README.md)**.
This file is the high-level overview: what I analyzed, what I recommended and
built, what changed, and what stayed exactly the same.

---

## 1. Analysis of the original project

I analyzed the entire existing project before changing anything:

- **Frontend:** pure static HTML/CSS/JS — 16 `.html` pages, no framework, no build step.
- **Data sources:** `assets/js/projects.js` (`PROJECTS`, 12 demo projects),
  `assets/js/articles.js` (`ARTICLES`, 21 blog posts), testimonials inline in
  `testimonials.html`, shared nav/footer/contact in `assets/js/site.js`.
- **Forms:** contact form → Formspree (`https://formspree.io/f/mkjngqob`).
- **SEO:** hardcoded per-page `<title>`/meta/OG/Twitter + JSON-LD; `sitemap.xml`, `robots.txt`.
- **Assets:** `assets/css/style.css`, Tailwind utilities, images under `assets/images/`.
- **Hosting:** static GitHub Pages (`CNAME` = `prosengitkundu.top`).

**Hardcoded content that became dynamic:** site name/tagline/title, logo/favicon,
hero heading, availability text, contact info, social links, footer, navigation,
services, pricing data, portfolio, blog, testimonials (manageable), and per-page
SEO metadata.

## 2. Clean URLs (no `.html` in public page URLs)

Public page URLs are extension-less and consistent — no `.html`, no trailing slash:

| Page | Public URL |
|---|---|
| Home | `https://prosengitkundu.top/` |
| About / Services / Pricing / Portfolio / Blog / Testimonials / FAQ / Contact | `/about`, `/services`, `/pricing`, `/portfolio`, `/blog`, `/testimonials`, `/faq`, `/contact` |
| Team profiles | `/team-eitykona`, `/team-mashrur`, … |
| Blog articles | `/blog/<slug>` |
| Case studies | `/portfolio/<slug>` |
| Legal & utility | `/privacy-policy`, `/terms`, `/disclaimer`, `/thank-you`, `/404` |
| JS fallback templates | `/blog-details?id=N`, `/portfolio-details?id=N` |

The matching `.html` files stay on disk (GitHub Pages resolves `/about` to `about.html`,
and the Node/Express app does the same). Internal links, canonical tags, `og:url`,
Twitter URLs, JSON-LD (`@id`, breadcrumbs, `mainEntityOfPage`), `sitemap.xml` and
`robots.txt` all use the clean URLs.

**Where the legacy `.html` → clean redirect is configured**

* **Node/Express deployment** (`backend/server.js`) — real HTTP **301** redirects,
  issued before any HTML is sent (`/about.html` → `/about`, `/index.html` → `/`,
  `/about/` → `/about`). One hop, no chains or loops; `/api`, `/admin` and
  `/uploads` are never touched.
* **GitHub Pages** (the current static host) — GitHub Pages serves static files and
  cannot send HTTP redirects, so the same `.html → clean` forwarding runs
  client-side in `assets/js/site.js`, and every page declares its clean URL as the
  `rel="canonical"`. A true server-side 301 requires the Node deployment (or any
  host that supports redirect rules).

Verify links, canonicals and the sitemap at any time:

```bash
node scripts/check-clean-urls.js
```

## 3. Recommended stack (and why)

| Layer | Choice | Why |
|---|---|---|
| Backend | **Node.js + Express** | Same language as the existing JS; minimal footprint; no framework mismatch |
| Database | **SQLite** (`node:sqlite`) | Zero-config, single file, perfect for a one-admin site; no native build step |
| Auth | **Sessions + bcrypt** | httpOnly cookies, hashed passwords, brute-force protection |
| Frontend | **Keep existing HTML; add `assets/js/cms.js`** | Preserves the exact design & SEO; content is fetched from the API |
| Admin | **Vanilla HTML/CSS/JS (no build)** | A completely separate, clean dashboard; no Node toolchain required |

**Key decision:** I did **not** rebuild the frontend. The existing HTML is served
through Express unchanged. A small hydration script fetches content from the API
and updates the DOM in place, and SEO metadata is injected from the database
server-side (your hardcoded tags remain as the safe fallback). This keeps the
public site visually identical while making everything controllable from admin.

## 4. What changed

**Added (all under `backend/`):**
- Express server serving the **static site**, the **`/api`** and **`/admin`**.
- SQLite database + schema + auto-seed from your existing content.
- Secure session-based auth (`/admin/login`, logout, hashed passwords, route protection).
- Admin dashboard (settings, services, projects, testimonials, blog, navigation,
  pages/sections, SEO, media, messages, backup, overview).
- REST API (public + admin-protected), media uploads, contact-form storage, backup export.
- `assets/js/cms.js` frontend hydration script.

**Preserved (unchanged or minimally touched):**
- All 16 HTML pages, their design, layout, Tailwind/`style.css` styling, animations, forms.
- All existing text, images, and SEO meta tags (used as fallbacks).
- `assets/js/projects.js`, `assets/js/articles.js`, `assets/js/site.js`, `chatbot.js` (all still load; the CMS content overrides/grids on top).

## 5. How to run locally

```bash
cd backend
npm install
cp .env.example .env        # then edit .env (set SESSION_SECRET + admin password)
npm run init-db             # create + seed the database
npm start                   # http://localhost:3000
```

- **Public site:** `http://localhost:3000/`
- **Admin:** `http://localhost:3000/admin` (login: `admin` / `Admin@1234`, change it)
- **API docs:** `http://localhost:3000/api`

## 6. Your future workflow (no code edits needed)

1. Log in to **`/admin`**.
2. Open any section (Settings, Services, Portfolio, Blog, Navigation, SEO, …).
3. Change text, upload images, reorder, publish/unpublish.
4. Click **Save** → the database updates → **the public website updates automatically**.

Example: Admin → **Site Settings** → change *Site tagline* to
“SEO & Performance Marketing Specialist” → **Save**. The header, footer,
homepage and SEO title all update — no HTML edits.

## 7. Deployment

Since the admin/API require a backend, deploy the Node app (see
[`backend/README.md`](backend/README.md) → “Deployment”). Point your domain to
the Node service (Railway / Render / Fly / VPS). The static site files stay
exactly as they are and are served by Express.

## 8. Files & folders

```
📄 *.html                      Existing website (unchanged design; served by Express)
assets/                        Existing CSS/JS/images + NEW assets/js/cms.js
*/blog/, */portfolio/           Generated static pages (clean URLs, .html files kept)
scripts/
  generate-static-pages.js     Regenerates /blog/<slug> + /portfolio/<slug> pages
  check-clean-urls.js          Verifies links, canonicals and sitemap (no .html URLs)
backend/
  server.js                    App, static site serving, API, admin, SEO injection
  db.js                        Schema + seed (DB at data/cms.db)
  routes/                      API route handlers
  middleware/                  Auth + upload
  public/                      Admin dashboard
  scripts/create-admin.js      Create/reset admin user
  .env.example                 Environment template
  README.md                    Full docs, API reference, deployment guide
```

## 9. What to change before going live

1. Set a strong `SESSION_SECRET` and `ADMIN_PASSWORD` in `.env`.
2. Update `SITE_URL` to the real domain.
3. Run `npm i` on the server and `npm start`.
4. Add real services/projects/blog/testimonials in the admin panel.

---

> **Honesty note:** the seeded portfolio entries are your existing
> **demo/concept** work samples (clearly labelled), and the testimonials list
> starts **empty** — the CMS never fabricates clients or results.

For setup, API reference, admin feature list and production guidance, see
**`backend/README.md`**.
