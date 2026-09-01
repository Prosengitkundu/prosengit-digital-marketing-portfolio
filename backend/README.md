# Prosengit CMS — Backend, Admin Dashboard & API

This is a **lightweight custom CMS** for the Prosengit Kundu digital-marketing
portfolio website. It turns the existing static HTML site into a **dynamic,
database-driven website** with a secure admin panel — **without rebuilding the
frontend**.

```
Frontend (existing HTML/CSS/JS, design preserved)
        │   fetch /api/*
        ▼
Express API
        │
        ▼
SQLite database  (single file: backend/data/cms.db)
```

---

## 1. Architecture & tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Your **existing** HTML/CSS/JS (unchanged design) | Preserves layout, responsiveness, SEO, animations |
| Hydration | `assets/js/cms.js` | Fetches content from the API and updates the DOM **in place**; graceful fallback when the API is down |
| Backend | Node.js + Express | Same language as your existing JS; minimal footprint |
| Database | SQLite (`node:sqlite`, Node ≥ 22.5) | Zero-config, single file, perfect for a one-admin site; **no native build step** |
| Auth | `express-session` + `bcryptjs` | Session cookies (httpOnly), hashed passwords, login rate-limiting |
| Uploads | `multer` | File uploads to `backend/uploads/` |
| Security | `helmet`, rate-limit, CORS, input validation | Production-ready basics |

**Why not a full framework?** The site is plain HTML/CSS/JS. Adding React, a
build pipeline or a heavyweight CMS would force a frontend rewrite — exactly
what you asked to avoid. This setup keeps the look identical and adds real,
usable CMS power.

---

## 2. Requirement check (what you get)

- ✅ **Secure admin** at `/admin/login`, `/admin`, session auth, logout, hashed passwords, protected routes
- ✅ **Website settings** (name, tagline, title, contact, socials, copyright, availability, logo/favicon)
- ✅ **Homepage content** (hero heading, description, services, featured projects, blog, testimonials)
- ✅ **Services** — full CRUD, activate/deactivate, reorder, price, features, icon
- ✅ **Portfolio/Projects** — full CRUD, publish/unpublish, featured, gallery images, tools, URL, date
- ✅ **Testimonials** — full CRUD, publish/unpublish, rating (**no fabricated content**)
- ✅ **Blog** — full CRUD, rich-text editor, slug, categories, tags, SEO fields, publish/unpublish
- ✅ **Navigation** — add/edit/delete/reorder/enable-disable
- ✅ **Pages & content blocks/sections** — editable headings + reusable sections
- ✅ **SEO management** — meta title/description, focus keyword, canonical, robots, Open Graph, Twitter
- ✅ **Media library** — upload, view, copy URL, delete
- ✅ **Contact form** → saved to DB, managed in admin (new/read/replied/archived)
- ✅ **Dashboard** — totals, recent messages/projects/posts, quick actions
- ✅ **Database** — normalized tables with indexes (see schema below)
- ✅ **REST API** — public + admin-protected endpoints
- ✅ **Frontend integration** — the public site updates automatically from admin
- ✅ **Backup** — one-click SQL export
- ✅ **Environment config** — `.env.example`, no secrets in code
- ✅ **Production readiness** — folder structure, migrations/schema, docs, security, CORS, validation

---

## 3. Quick start (local development)

### Prerequisites
- Node.js **≥ 22.5** (uses the built-in `node:sqlite`; no native build needed)
- npm

### Steps
```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   Then edit .env — set SESSION_SECRET, site URL, and admin credentials.

# 3. (Optional) Initialize + seed the database from your existing content
npm run init-db
#   Seeds settings, navigation, services, 12 projects, 21 blog posts,
#   per-page SEO defaults, and creates the first admin user.

# 4. (Optional) Create / reset an admin account
npm run create-admin            # uses ADMIN_USERNAME / ADMIN_PASSWORD from .env

# 5. Start the site + API + admin
npm start                       # or: node server.js
```

Then open:

| URL | What it is |
|---|---|
| `http://localhost:3000/` | Your **existing** public website (dynamic content) |
| `http://localhost:3000/admin/login` | Admin login |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3000/api` | API documentation |

### Default admin credentials (from `.env`)
- Username: `admin`
- Password: `Admin@1234`  *(change immediately, and change `ADMIN_PASSWORD` in `.env`)*

> The first admin user is created automatically on first boot from `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Use `npm run create-admin` afterward to change it.

---

## 4. The public website → backend integration

The **existing HTML pages are served exactly as they were**. On top of that:

- **`backend/server.js`** injects two things into every HTML response:
  1. **SEO metadata from the database** (title, description, canonical, OG, Twitter) — with your hardcoded tags as the safe fallback, so **existing SEO is never damaged**.
  2. **`assets/js/cms.js`** (`defer`), which fetches `/api/*` and updates content **in place**.
- **`assets/js/cms.js`** updates: header brand/role, footer about/copyright/contact/socials, navigation, availability badge, homepage hero heading, the **services grid**, **portfolio grid**, **blog grid**, **testimonials grid**, and the **blog-details** / **portfolio-details** pages.

**Result:** you edit content in the admin panel → click **Save** → the public website updates automatically. You never touch HTML/CSS/JS again.

### Your intended workflow
```
Login to Admin  →  Dashboard  →  Edit Content  →  Save  →  Database  →  Frontend updates
```

Example: change the **Site tagline** from `Digital Marketing Expert` to
`SEO & Performance Marketing Specialist` in Admin → **Site Settings** →
**Save**. The header, footer, homepage hero and SEO title all update.

---

## 5. Admin dashboard features

Accessed from **`/admin`** (login at **`/admin/login`**).

| Section | What you can do |
|---|---|
| **Dashboard** | Total projects/services/blog posts/messages/media; recent messages/projects/posts; quick actions |
| **Messages** | View, filter, mark New/Read/Replied/Archived, delete incoming contact-form messages |
| **Services** | Add/edit/delete, toggle active, reorder (up/down), set title, description, price, features, icon |
| **Portfolio / Projects** | Add/edit/delete, publish/unpublish, mark featured, gallery images, tools, deliverables, results, URL, date |
| **Testimonials** | Add/edit/delete, publish/unpublish, name, designation, company, country, rating, image |
| **Blog Posts** | Add/edit/delete, publish/unpublish, rich-text editor, slug, category, tags, author, date, SEO fields |
| **Navigation Menu** | Add/edit/delete, reorder, enable/disable menu items |
| **Pages & Sections** | Edit page title/heading/content + reusable content blocks |
| **SEO Settings** | Per-page meta title/description, focus keyword, canonical, robots, Open Graph, Twitter card |
| **Site Settings** | Site name, tagline, title, logo, favicon, email, phone, WhatsApp, location, socials, copyright, availability, footer |
| **Media Library** | Upload images, copy URL, delete, alt text |
| **Backup** | Download a full SQL snapshot |

> **Honesty policy:** testimonial and project content is created by you in the
> admin panel. The system never invents client names or results. The seeded
> portfolio items are your existing **demo/concept** work samples, clearly
> labelled, and the testimonials list starts **empty**.

---

## 6. Database schema

Normalized tables (SQLite, created on first boot in `db.js`):

```
users            site_settings      pages          page_sections
services         projects           project_images testimonials
blog_posts       blog_categories    media          contact_messages
navigation       seo_settings
```

- `projects` ↔ `project_images` (one-to-many, cascade delete)
- `blog_posts` ↔ `blog_categories` (via category name/slug)
- `page_sections` ↔ `pages` (via `slug`)
- Indexes on sort order, category, published flags, slugs, nav position, contact status, media path.

The seed in `db.js` auto-loads your current `assets/js/projects.js`,
`assets/js/articles.js` and site settings so the database starts as a faithful
copy of what is live today.

---

## 7. REST API endpoints

Base URL: `/api`

### Public (no auth)
```
GET  /api/settings                     Global site settings (name, contact, socials, …)
GET  /api/navigation                   Active nav menu items
GET  /api/services                     Published services
GET  /api/projects                     Published projects (optional ?category=)
GET  /api/projects/featured            Featured projects
GET  /api/projects/categories          Project categories
GET  /api/projects/:id                 Single published project
GET  /api/testimonials                 Published testimonials
GET  /api/blog                         Published posts (optional ?category= ?tag= ?q=)
GET  /api/blog/:slug                   Single published post by slug
GET  /api/blog/id/:id                  Single published post by id
GET  /api/blog/categories              Blog categories
GET  /api/pages                        Published pages
GET  /api/pages/sections/:slug         Page + its active sections
GET  /api/seo/:slug                    SEO data for a page
POST /api/contact                      Submit a contact-form message
```

### Auth
```
POST /api/auth/login    Login (username + password) → session cookie
POST /api/auth/logout   Destroy session
GET  /api/auth/me       Current admin user
```

### Admin (requires session cookie)
```
GET  /api/dashboard                       Stats + recent items
GET  /api/settings/full                   All settings
PUT  /api/settings                        Update settings (bulk by key)
GET/POST/PUT/DELETE /api/navigation/...   Navigation CRUD + reorder
GET  /api/services/admin/all, POST/PUT/DELETE /api/services/...
GET  /api/projects/admin/all, POST/PUT/DELETE /api/projects/...
GET  /api/projects/admin/:id
GET  /api/testimonials/full, POST/PUT/DELETE /api/testimonials/...
GET  /api/blog/admin/all, GET /api/blog/admin/detail/:id, POST/PUT/DELETE /api/blog/...
GET  /api/blog/admin/recent
GET  /api/media, POST /api/media/upload, PUT /api/media/:id, DELETE /api/media/:id
GET  /api/pages/all, PUT /api/pages/:slug, POST /api/pages/:slug/sections
GET  /api/seo, GET /api/seo/admin/:slug, PUT /api/seo/:slug
GET  /api/contact, GET /api/contact/recent, GET /api/contact/counts
PUT  /api/contact/:id/status, DELETE /api/contact/:id
GET  /api/backup/export                  Download SQL dump
```

Admin endpoints return `401 Unauthorized` if not logged in. Public endpoints
only expose what the frontend needs.

---

## 8. Deployment (production)

The site is now served by the Node backend, so it **cannot** run on a purely
static hosting service (GitHub Pages) for the admin/API to work. Deploy the
`backend/` folder (plus the static site files) to any Node host:

### Option A — Node host (Railway / Render / Fly / Heroku / a VPS)
1. Set these environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   SITE_URL=https://prosengitkundu.top
   PUBLIC_BASE_URL=https://prosengitkundu.top
   SESSION_SECRET=<a long random hex string>
   TRUST_PROXY=true
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<a strong password>
   ```
2. Build/start command: `cd backend && npm install && npm start`
3. Optional: run `npm run init-db` once (the app seeds automatically on first boot if empty).
4. Add the Node service as the **origin** of your domain, and point your DNS.
5. Serve media next to it (same origin) or via a CDN.

### Option B — VPS / Docker
```bash
cd backend && npm ci && node server.js
```
Put Nginx in front with `proxy_pass http://127.0.0.1:3000;` and `proxy_set_header X-Forwarded-Proto $scheme;` (set `TRUST_PROXY=true`).

> **Security notes:** Use a strong `SESSION_SECRET` and `ADMIN_PASSWORD`.
> Set `NODE_ENV=production` so the session cookie is `secure` (HTTPS only).

---

## 9. Environment variables

See [`.env.example`](./.env.example). Never commit a real `.env`.

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 3000) |
| `SITE_URL` | Public base URL, used for canonical/OG/absolute URLs |
| `PUBLIC_BASE_URL` | Base URL for uploaded media |
| `SESSION_SECRET` | Session signing secret (long random hex) |
| `TRUST_PROXY` | Set `true` behind a reverse proxy |
| `DB_PATH` | SQLite file path (default `./data/cms.db`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_NAME` | First admin account |
| `MAX_UPLOAD_MB` | Max upload size |
| `CORS_ORIGIN` | Allowed origins (`*` or comma-separated) |
| `SMTP_*` / `MAIL_*` | (Optional) contact-form email notification |

Generate a secret:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 10. Backups, safety & validation

- **Backup** — Admin → **Backup** → download a full SQL dump (`/api/backup/export`).
  Restore by importing into a fresh SQLite DB.
- **Delete confirmation** — every destructive action in the admin asks for confirmation.
- **Publish/unpublish** — hide content without deleting.
- **Validation** — the API validates required fields and rejects bad input; the frontend
  falls back to built-in content if the API is unreachable, so a bad value can't
  break the page.
- **Password hashing** — bcrypt (cost 12), never plain text.
- **Login throttling** — brute-force protection on the login route.

---

## 11. Project structure

```
backend/
  server.js              Express app: serves static site, API, admin, SEO injection
  db.js                  Connection, schema, seed (loads existing frontend data)
  .env.example           Environment template
  routes/
    auth.js settings.js nav.js services.js projects.js testimonials.js blog.js
    media.js contact.js pages.js seo.js dashboard.js backup.js
  middleware/
    auth.js              Session guard + login helper
    upload.js            Multer upload config
  utils/
    helpers.js           Response helpers, slugify, URL helpers
    site.js              Site URL config
  public/                Admin dashboard (HTML/CSS/JS, no build step)
  scripts/create-admin.js Create/reset admin user
  data/                  SQLite database (gitignored)
  uploads/               Uploaded media (gitignored)

assets/js/cms.js         Frontend hydration (fetches /api/* and updates the site)
```

---

## 12. Troubleshooting

- **`ExperimentalWarning: SQLite is an experimental feature`** — harmless. It appears
  because Node's built-in SQLite is still marked experimental; it works and is
  stable enough for this use.
- **Logout loop / can't log in** — make sure `SESSION_SECRET` is set, and that
  cookies are allowed for `/admin`.
- **Images not showing** — uploaded files are served from `/uploads/...`; in
  production keep the same origin or set `PUBLIC_BASE_URL`.
- **Frontend shows static content not DB content** — `cms.js` requires the API. If
  you open `index.html` directly via `file://`, it cannot reach `/api`; always
  run through the server (`npm start`).
