/* ===========================================================================
   Prosengit CMS — Express server
   ---------------------------------------------------------------------------
   Single process that serves:
     • /api/*    — REST API (public + admin-protected)
     • /admin/*  — secure admin dashboard
     • /uploads/*— uploaded media
     • /*        — the existing static portfolio website, with SEO metadata
                  injected from the database (hardcoded tags remain the fallback)
   =========================================================================== */
'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { db, seed } = require('./db');
const { attachUser, requireAuth } = require('./middleware/auth');
const { SITE_URL } = require('./utils/site');

/* ---------------------------------------------------------------------------
   Production safety gate — refuse to start with insecure defaults.
--------------------------------------------------------------------------- */
if (process.env.NODE_ENV === 'production') {
  const weak = ['dev-secret-change-me', 'please-change-me', 'secret', 'changeme'];
  if (!process.env.SESSION_SECRET || weak.includes(String(process.env.SESSION_SECRET).toLowerCase())) {
    console.error('\n✖ Fatal: SESSION_SECRET is missing or set to a weak default.\n' +
      '  Set a strong random value in your environment (see .env.example):\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"\n');
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'Admin@1234') {
    console.error('\n✖ Fatal: ADMIN_PASSWORD is missing or still the default "Admin@1234".\n' +
      '  Set a strong admin password in your environment (see .env.example).\n');
    process.exit(1);
  }
}

// Ensure the database is seeded on first boot if it has never been initialized.
seed();

const app = express();
const PORT = process.env.PORT || 3000;

// Root of the existing static website (parent of backend/)
const SITE_ROOT = path.resolve(__dirname, '..');
const ADMIN_PUBLIC = path.join(__dirname, 'public');

/* ---------------------------------------------------------------------------
   Security & parsing middleware
--------------------------------------------------------------------------- */
app.set('trust proxy', process.env.TRUST_PROXY === 'true');
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false,       // the public site uses inline scripts/styles
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' } // allow media/images to be shared
}));
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

/* ---------------------------------------------------------------------------
   CORS — for same-origin it is effectively a no-op, but allows explicit origins
--------------------------------------------------------------------------- */
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : '*';
  if (req.headers.origin && (origin === '*' || origin.includes(req.headers.origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin === '*' ? '*' : req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---------------------------------------------------------------------------
   Sessions
--------------------------------------------------------------------------- */
const sessionOptions = {
  name: 'pk_cms_sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};
app.use(session(sessionOptions));
app.use(attachUser);

/* ---------------------------------------------------------------------------
   Routes
--------------------------------------------------------------------------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/navigation', require('./routes/nav'));
app.use('/api/services', require('./routes/services'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/media', require('./routes/media'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/backup', require('./routes/backup'));

// API capabilities doc
app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'Prosengit CMS API',
    version: '1.0.0',
    base: '/api',
    endpoints: {
      public: [
        'GET /api/settings', 'GET /api/navigation', 'GET /api/services',
        'GET /api/projects', 'GET /api/projects/featured', 'GET /api/projects/categories',
        'GET /api/testimonials', 'GET /api/blog', 'GET /api/blog/:slug',
        'GET /api/pages', 'GET /api/pages/sections/:slug', 'GET /api/seo/:slug',
        'POST /api/contact'
      ],
      auth: ['POST /api/auth/login', 'POST /api/auth/logout', 'GET /api/auth/me'],
      admin: [
        'GET /api/dashboard', 'GET/PUT /api/settings', 'GET /api/navigation/full',
        'POST/PUT/DELETE /api/services', 'POST/PUT/DELETE /api/projects',
        'POST/PUT/DELETE /api/testimonials', 'POST/PUT/DELETE /api/blog',
        'GET /api/media', 'POST /api/media/upload', 'GET/PUT /api/pages',
        'GET/PUT /api/seo', 'GET /api/contact', 'PUT /api/contact/:id/status',
        'GET /api/backup/export'
      ]
    },
    auth_note: 'All /api endpoints under admin require a valid session cookie (login first).'
  });
});

// Generic API 404 & error handlers
app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'Not found' }));

/* ---------------------------------------------------------------------------
   Admin dashboard & media
--------------------------------------------------------------------------- */
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d', immutable: false }), (req, res) => {
  // If the file doesn't exist, fall through to a 404 without stack trace.
  res.status(404).send('Not found');
});

/* --- Admin dashboard: assets public, HTML pages protected (login public) --- */
app.use('/admin/css', express.static(path.join(ADMIN_PUBLIC, 'css'), { maxAge: '1h' }));
app.use('/admin/js', express.static(path.join(ADMIN_PUBLIC, 'js'), { maxAge: '1h' }));
app.use('/admin/img', express.static(path.join(ADMIN_PUBLIC, 'img'), { maxAge: '1h' }));

app.get('/admin/login', (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'login.html')));
app.get('/admin/login.html', (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'login.html')));

app.get('/admin', requireAuth, (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'index.html')));
app.get('/admin/index.html', requireAuth, (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'index.html')));
app.get('/admin/dashboard', requireAuth, (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'index.html')));
app.get('/admin/dashboard.html', requireAuth, (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'index.html')));
app.get('/admin/settings', requireAuth, (req, res) => res.sendFile(path.join(ADMIN_PUBLIC, 'index.html')));

/* ---------------------------------------------------------------------------
   Clean URLs — public pages are served without the .html extension.
   ---------------------------------------------------------------------------
     • /about.html, /blog/some-post.html, /index.html …  → 301 to the clean URL
     • /about,  /blog/some-post,  /                  → served from the .html file
     • /blog/, /about/                               → 301 to the slash-less URL

   Only real page files are redirected and only same-file single hops are used,
   so there are no redirect chains or loops. The API, the admin dashboard and
   uploaded media are never touched. The .html files stay on disk: they are the
   source content and the fallback for hosts that cannot rewrite (GitHub Pages).
--------------------------------------------------------------------------- */
const RESERVED_PATH = /^\/(api|admin|uploads)(\/|$)/;

function publicFileExists(urlPath) {
  const abs = path.join(SITE_ROOT, urlPath);
  try {
    return fs.existsSync(abs) && fs.statSync(abs).isFile();
  } catch (err) {
    return false;
  }
}

/* Canonical clean URL for a requested page path: strips a trailing ".html" and
   a trailing slash, and normalises every homepage variant (/index, /index/,
   /index.html) to "/" so there is never a chain of redirects. */
function cleanUrlFor(urlPath) {
  if (/^\/index(\.html?)?\/?$/i.test(urlPath)) return '/';
  return urlPath.replace(/\.html?$/i, '').replace(/\/+$/, '');
}

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const urlPath = req.path.split('?')[0];
  if (RESERVED_PATH.test(urlPath)) return next();

  const queryIndex = req.originalUrl.indexOf('?');
  const query = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex);

  // 1. Legacy .html URL → its clean equivalent (single permanent redirect).
  if (/\.html?$/i.test(urlPath)) {
    if (!publicFileExists(urlPath)) return next(); // unknown file → normal 404
    return res.redirect(301, cleanUrlFor(urlPath) + query);
  }

  // 2. Trailing slash → the canonical slash-less URL (only for real pages).
  if (urlPath.length > 1 && urlPath.endsWith('/')) {
    const trimmed = urlPath.replace(/\/+$/, '');
    if (publicFileExists(trimmed + '.html')) return res.redirect(301, cleanUrlFor(trimmed) + query);
    return next();
  }

  // 3. Bare /index → the homepage (single hop, no /index → /index/ → / chain).
  if (/^\/index$/i.test(urlPath)) return res.redirect(301, '/' + query);

  return next();
});

/* ---------------------------------------------------------------------------
   SEO injection — inject DB-driven meta/title into the existing static HTML.
   Falls back to whatever the page already hardcodes, so existing SEO is never
   damaged when the DB has nothing for a page.
--------------------------------------------------------------------------- */
const SEO_FIELDS = [
  'meta_title', 'meta_description', 'focus_keyword', 'canonical_url', 'robots',
  'og_title', 'og_description', 'og_image', 'twitter_card'
];

function injectSeo(html, pathname) {
  /* DB-managed SEO rows exist for the root pages only (home, about, services,
     portfolio, blog, contact …). Nested content pages — /blog/<slug> and
     /portfolio/<slug> — carry their own generated title/canonical/OG tags, so
     injecting the listing row here would overwrite them with the wrong
     canonical. They are therefore left untouched. */
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length > 1) return html;

  let slug = 'home';
  const file = segments[0] || '';
  if (file) {
    const name = file.replace(/\.html$/, '');
    slug = name && name !== 'index' ? name : 'home';
  }
  const row = db.prepare('SELECT * FROM seo_settings WHERE page_slug = ?').get(slug);
  if (!row) return html;

  // Title
  if (row.meta_title) {
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(row.meta_title)}</title>`);
  }

  // Meta helpers
  const setMeta = (attr, name, contentProp, value) => {
    if (!value) return html;
    const re = new RegExp(`(<meta[^>]*${attr}="${name}"[^>]*content=")[^"]*(")`, 'i');
    if (re.test(html)) {
      html = html.replace(re, (m, p1, p2) => `${p1}${escapeHtml(value)}${p2}`);
    } else {
      html = html.replace('</head>', `${contentProp}${escapeHtml(value)}"></meta></head>`);
    }
    return html;
  };

  html = setMeta('name', 'description', '<meta name="description" content="', row.meta_description);
  html = setMeta('name', 'keywords', '<meta name="keywords" content="', row.focus_keyword);
  html = setMeta('name', 'robots', '<meta name="robots" content="', row.robots);
  html = setMeta('property', 'og:title', '<meta property="og:title" content="', row.og_title || row.meta_title);
  html = setMeta('property', 'og:description', '<meta property="og:description" content="', row.og_description || row.meta_description);
  html = setMeta('property', 'og:image', '<meta property="og:image" content="', row.og_image);
  html = setMeta('name', 'twitter:title', '<meta name="twitter:title" content="', row.og_title || row.meta_title);
  html = setMeta('name', 'twitter:description', '<meta name="twitter:description" content="', row.og_description || row.meta_description);
  html = setMeta('name', 'twitter:card', '<meta name="twitter:card" content="', row.twitter_card);

  if (row.canonical_url) {
    const canon = process.env.SITE_URL + (row.canonical_url.startsWith('/') ? row.canonical_url : '/' + row.canonical_url);
    if (/<link rel="canonical"/i.test(html)) {
      html = html.replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${escapeHtml(canon)}"`);
    } else {
      html = html.replace('</head>', `<link rel="canonical" href="${escapeHtml(canon)}"></head>`);
    }
  }

  return html;
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ---------------------------------------------------------------------------
   Static frontend — serve existing HTML/CSS/JS/images
   The SEO middleware runs on HTML responses before sending.
--------------------------------------------------------------------------- */
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const urlPath = req.path.split('?')[0];
  // Never run HTML middleware on API/admin/uploads
  if (urlPath.startsWith('/api') || urlPath.startsWith('/admin') || urlPath.startsWith('/uploads')) return next();

  let file = urlPath;
  if (file === '/') file = '/index.html';
  let abs = path.join(SITE_ROOT, file);
  // Clean URL → underlying .html page (e.g. /about → /about.html,
  // /blog/some-post → /blog/some-post.html). Files with an extension are
  // always requested literally so assets are never shadowed.
  // Note: /blog and /portfolio exist both as a listing page (blog.html,
  // portfolio.html) and as a directory of generated pages — the page must win
  // for the clean URL, otherwise express.static would bounce it to /blog/.
  if (!path.extname(file) && fs.existsSync(abs + '.html')) {
    let isPlainFile = false;
    try { isPlainFile = fs.statSync(abs).isFile(); } catch (err) { isPlainFile = false; }
    if (!isPlainFile) abs += '.html';
  }
  if (fs.existsSync(abs) && fs.statSync(abs).isFile() && /\.html?$/i.test(abs)) {
    let html = fs.readFileSync(abs, 'utf8');
    html = injectSeo(html, urlPath);
    // Inject the CMS hydration script (defer so it runs after site.js builds
    // the shared header/footer). It gracefully falls back if the API is down.
    if (!/cms\.js/.test(html)) {
      html = html.replace('</body>', '<script src="assets/js/cms.js" defer></script>\n</body>');
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  }
  return next();
});

// Static assets (css/js/images) without SEO injection
app.use(express.static(SITE_ROOT, {
  index: false,
  setHeaders: (res, filePath) => {
    if (/\.(png|jpe?g|webp|gif|avif|svg|ico)$/i.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// 404 for the public site
app.use((req, res) => {
  const abs404 = path.join(SITE_ROOT, '404.html');
  if (fs.existsSync(abs404)) {
    res.status(404).send(injectSeo(fs.readFileSync(abs404, 'utf8'), '404'));
  } else {
    res.status(404).send('Not found');
  }
});

/* ---------------------------------------------------------------------------
   Central error handler
--------------------------------------------------------------------------- */
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api')) {
    return res.status(err.status || 500).json({ success: false, error: err.message || 'Server error' });
  }
  res.status(err.status || 500).send('Server error');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  Prosengit CMS running`);
  console.log(`  Local:    http://localhost:${PORT}`);
  console.log(`  Public:   ${SITE_URL}`);
  console.log(`  Admin:    http://localhost:${PORT}/admin`);
  console.log(`  API doc:  http://localhost:${PORT}/api\n`);
});

module.exports = app;
