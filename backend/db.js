/* ===========================================================================
   DB.js — SQLite connection, schema, and seed
   ---------------------------------------------------------------------------
   Uses Node's built-in `node:sqlite` (no native build step).
   This module:
     1. loads environment config
     2. opens (or creates) the SQLite database file
     3. guarantees the schema exists
     4. optionally seeds it from the existing static frontend data
   =========================================================================== */
'use strict';

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const vm = require('vm');
const { DatabaseSync } = require('node:sqlite');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'cms.db');
const ABS_DB_PATH = path.isAbsolute(DB_PATH) ? DB_PATH : path.join(__dirname, DB_PATH);

fs.mkdirSync(path.dirname(ABS_DB_PATH), { recursive: true });

const db = new DatabaseSync(ABS_DB_PATH);
// Recommended pragmas for a small CMS
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA synchronous = NORMAL;');

/* ---------------------------------------------------------------------------
   SCHEMA
--------------------------------------------------------------------------- */
function createSchema() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name          TEXT NOT NULL DEFAULT '',
    role          TEXT NOT NULL DEFAULT 'admin',
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    last_login    TEXT
  );

  -- Generic key/value store for global site settings
  CREATE TABLE IF NOT EXISTS site_settings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    key        TEXT NOT NULL UNIQUE,
    value      TEXT,
    type       TEXT NOT NULL DEFAULT 'text',   -- text|textarea|image|color|select
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Pages (the standalone page shell / page-level content)
  CREATE TABLE IF NOT EXISTS pages (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    slug           TEXT NOT NULL UNIQUE,
    title          TEXT NOT NULL DEFAULT '',
    heading        TEXT NOT NULL DEFAULT '',
    content_html   TEXT,
    status         TEXT NOT NULL DEFAULT 'published',  -- published|draft
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Reusable content blocks/sections, editable from admin
  CREATE TABLE IF NOT EXISTS page_sections (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug    TEXT NOT NULL,
    section_key  TEXT NOT NULL,
    heading      TEXT DEFAULT '',
    subheading   TEXT DEFAULT '',
    description  TEXT DEFAULT '',
    image        TEXT DEFAULT '',
    cta_label    TEXT DEFAULT '',
    cta_url      TEXT DEFAULT '',
    content_json TEXT,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    active       INTEGER NOT NULL DEFAULT 1,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(page_slug, section_key)
  );

  CREATE TABLE IF NOT EXISTS services (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    slug         TEXT NOT NULL DEFAULT '',
    description  TEXT DEFAULT '',
    icon         TEXT DEFAULT '',
    image        TEXT DEFAULT '',
    price_text   TEXT DEFAULT '',        -- e.g. "Starting from $30"
    price_bdt    TEXT DEFAULT '',
    price_usd    TEXT DEFAULT '',
    features_json TEXT,                  -- JSON array of feature strings
    cta_label    TEXT DEFAULT '',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    active       INTEGER NOT NULL DEFAULT 1,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL DEFAULT '',
    description   TEXT DEFAULT '',
    category      TEXT NOT NULL DEFAULT 'web',
    category_label TEXT DEFAULT '',
    client        TEXT DEFAULT '',
    industry      TEXT DEFAULT '',
    client_type   TEXT DEFAULT '',
    focus         TEXT DEFAULT '',
    duration      TEXT DEFAULT '',
    goal          TEXT DEFAULT '',
    role          TEXT DEFAULT '',
    tools_json    TEXT DEFAULT '',
    work_json     TEXT DEFAULT '',
    outcome       TEXT DEFAULT '',
    results       TEXT DEFAULT '',
    image         TEXT DEFAULT '',
    url           TEXT DEFAULT '',
    project_date  TEXT DEFAULT '',
    featured      INTEGER NOT NULL DEFAULT 0,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    published     INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS project_images (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    image      TEXT NOT NULL,
    caption    TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name   TEXT NOT NULL,
    designation   TEXT DEFAULT '',
    company       TEXT DEFAULT '',
    country       TEXT DEFAULT '',
    content       TEXT DEFAULT '',
    image         TEXT DEFAULT '',
    rating        INTEGER DEFAULT 0,
    published     INTEGER NOT NULL DEFAULT 0,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS blog_categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT NOT NULL,
    slug             TEXT NOT NULL UNIQUE,
    excerpt          TEXT DEFAULT '',
    content          TEXT,
    category         TEXT DEFAULT '',
    tags_json        TEXT DEFAULT '',
    image            TEXT DEFAULT '',
    author           TEXT DEFAULT '',
    publish_date     TEXT DEFAULT '',
    read_time        TEXT DEFAULT '',
    published        INTEGER NOT NULL DEFAULT 0,
    featured         INTEGER NOT NULL DEFAULT 0,
    seo_title        TEXT DEFAULT '',
    seo_description  TEXT DEFAULT '',
    canonical_url    TEXT DEFAULT '',
    og_title         TEXT DEFAULT '',
    og_description   TEXT DEFAULT '',
    og_image         TEXT DEFAULT '',
    twitter_card     TEXT DEFAULT '',
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS media (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    filename   TEXT NOT NULL,
    path       TEXT NOT NULL,
    mime_type  TEXT DEFAULT '',
    size       INTEGER DEFAULT 0,
    alt_text   TEXT DEFAULT '',
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT DEFAULT '',
    phone      TEXT DEFAULT '',
    company    TEXT DEFAULT '',
    service    TEXT DEFAULT '',
    subject    TEXT DEFAULT '',
    message    TEXT DEFAULT '',
    status     TEXT NOT NULL DEFAULT 'new',   -- new|read|replied|archived
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS navigation (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    label      TEXT NOT NULL,
    url        TEXT NOT NULL DEFAULT '#',
    position   INTEGER NOT NULL DEFAULT 0,
    parent_id  INTEGER DEFAULT NULL,
    active     INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS seo_settings (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug         TEXT NOT NULL UNIQUE,   -- 'home', 'about', 'services', ... or 'global'
    meta_title        TEXT DEFAULT '',
    meta_description  TEXT DEFAULT '',
    focus_keyword     TEXT DEFAULT '',
    canonical_url     TEXT DEFAULT '',
    robots            TEXT DEFAULT 'index, follow',
    og_title          TEXT DEFAULT '',
    og_description    TEXT DEFAULT '',
    og_image          TEXT DEFAULT '',
    twitter_card      TEXT DEFAULT 'summary_large_image',
    schema_json       TEXT DEFAULT '',
    updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- indexes
  CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
  CREATE INDEX IF NOT EXISTS idx_projects_cat ON projects(category);
  CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
  CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published);
  CREATE INDEX IF NOT EXISTS idx_nav_pos ON navigation(position);
  CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
  CREATE INDEX IF NOT EXISTS idx_media_path ON media(path);
  `);
}

/* ---------------------------------------------------------------------------
   Seed helpers — pull content from the existing static frontend data so the
   database starts as a faithful copy of what's live today.
--------------------------------------------------------------------------- */

// Parse a legacy `const NAME = [...]` or `const NAME = {...}` file via vm
function loadJsArray(relPath, variableName) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return [];
  const code = fs.readFileSync(abs, 'utf8');
  const sandbox = { console };
  vm.createContext(sandbox);
  try {
    // Top-level `const`/`let` are script-scoped and not exposed on the global
    // object, so we append an assignment inside the same script scope.
    const wrapped = code + `\n;globalThis.__sandbox_result__ = ${variableName};`;
    vm.runInContext(wrapped, sandbox);
    return sandbox.__sandbox_result__ || [];
  } catch (e) {
    console.warn(`Seed warning: could not parse ${relPath} (${e.message}).`);
    return [];
  }
}

function defaultSettings() {
  return {
    site_name: 'Prosengit Kundu',
    site_tagline: 'Digital Marketing Expert',
    site_title: 'Prosengit Kundu | SEO & Digital Marketing Expert',
    logo: '',
    logo_text: 'PK',
    favicon: '',
    email: 'Prosengit95@gmail.com',
    phone: '+880 1701-059499',
    phone_href: 'tel:+8801701059499',
    whatsapp: 'https://wa.me/8801701059499',
    location: 'Khulna, Bangladesh',
    address: 'Khulna, Bangladesh',
    copyright: 'Prosengit Kundu',
    instagram: '',
    twitter: '',
    linkedin: 'https://www.linkedin.com/in/prosengitkundu/',
    facebook: 'https://www.facebook.com/Prosengit95',
    youtube: '',
    availability_text: 'Available for freelance & training projects',
    footer_about: 'Digital Marketing Expert, SEO Specialist and custom web developer based in Khulna, Bangladesh — helping businesses grow with SEO, paid ads, lead generation and hand-coded websites.',
    footer_links_more: 'Blog,Testimonials,FAQ,Contact,Disclaimer'
  };
}

function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function seed() {
  const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
  const isEmpty = db.prepare('SELECT COUNT(*) AS c FROM site_settings').get().c === 0;

  // ---- Bootstrapped admin user -------------------------------------------
  const insertUser = db.prepare(
    'INSERT INTO users (username, password_hash, name, role) VALUES (?,?,?,?)'
  );
  const bcrypt = require('bcryptjs');
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const adminName = process.env.ADMIN_NAME || 'Site Administrator';
  const existing = db.prepare('SELECT id FROM users WHERE username=?').get(adminUser);
  if (!existing) {
    insertUser.run(adminUser, bcrypt.hashSync(adminPass, 12), adminName, 'admin');
    console.log(`✓ Created admin user "${adminUser}"`);
  }

  if (isEmpty) {
    // ---- Site settings ----------------------------------------------------
    const settings = defaultSettings();
    const insSetting = db.prepare(
      'INSERT INTO site_settings (key, value, type) VALUES (?,?,?)'
    );
    for (const [k, v] of Object.entries(settings)) {
      const type = (k === 'logo' || k === 'favicon' || k === 'og_image') ? 'image' : 'text';
      insSetting.run(k, v, type);
    }

    // ---- Navigation -------------------------------------------------------
    const navItems = [
      { label: 'Home', url: '/', position: 1 },
      { label: 'About', url: '/about.html', position: 2 },
      { label: 'Services', url: '/services.html', position: 3 },
      { label: 'Pricing', url: '/pricing.html', position: 4 },
      { label: 'Portfolio', url: '/portfolio.html', position: 5 },
      { label: 'Blog', url: '/blog.html', position: 6 },
      { label: 'Testimonials', url: '/testimonials.html', position: 7 },
      { label: 'FAQ', url: '/faq.html', position: 8 },
      { label: 'Contact', url: '/contact.html', position: 9 }
    ];
    const insNav = db.prepare('INSERT INTO navigation (label,url,position,active) VALUES (?,?,?,1)');
    for (const n of navItems) insNav.run(n.label, n.url, n.position);

    // ---- SEO settings (per page) -----------------------------------------
    const seoDefaults = [
      {
        page_slug: 'home',
        meta_title: 'Prosengit Kundu | SEO & Digital Marketing Expert',
        meta_description: 'Digital marketing expert, trainer & graphic designer in Khulna, Bangladesh — SEO, Google Ads, Meta Ads, social media and custom websites for 8+ years.',
        focus_keyword: 'digital marketing expert',
        canonical_url: '/',
        og_title: 'Prosengit Kundu | SEO & Digital Marketing Expert',
        og_description: 'Digital marketing expert, trainer & graphic designer in Khulna, Bangladesh — SEO, Google Ads, Meta Ads, social media and custom websites for 8+ years.',
        og_image: '/assets/images/og/prosengit-kundu-og.jpg'
      },
      {
        page_slug: 'about',
        meta_title: 'About Prosengit Kundu | Digital Marketing Expert in Khulna',
        meta_description: 'Learn about Prosengit Kundu — digital marketing expert, professional trainer and custom web developer based in Khulna, Bangladesh.',
        focus_keyword: 'about prosengit kundu',
        canonical_url: '/about.html',
        og_title: 'About Prosengit Kundu',
        og_description: 'Digital marketing expert, professional trainer & custom web developer based in Khulna, Bangladesh.'
      },
      {
        page_slug: 'services',
        meta_title: 'Digital Marketing & SEO Services | Prosengit Kundu',
        meta_description: 'SEO, Google Ads, Meta Ads, web development, lead generation and graphic design services with clear scope and pricing.',
        focus_keyword: 'digital marketing services',
        canonical_url: '/services.html',
        og_title: 'Digital Marketing & SEO Services',
        og_description: 'SEO, Google Ads, Meta Ads, web development, lead generation and graphic design services.'
      },
      {
        page_slug: 'portfolio',
        meta_title: 'Portfolio | Prosengit Kundu — Web, SEO, Ads & Design',
        meta_description: 'Concept and client portfolio of Prosengit Kundu: custom websites, SEO systems, paid ads, lead generation and graphic design.',
        focus_keyword: 'digital marketing portfolio',
        canonical_url: '/portfolio.html',
        og_title: 'Portfolio — Prosengit Kundu',
        og_description: 'Custom websites, SEO systems, paid ads, lead generation and graphic design work.'
      },
      {
        page_slug: 'blog',
        meta_title: 'Blog | Prosengit Kundu — Digital Marketing Insights',
        meta_description: 'Articles on SEO, Google & Meta Ads, lead generation, web development and digital marketing from Prosengit Kundu.',
        focus_keyword: 'digital marketing blog',
        canonical_url: '/blog.html',
        og_title: 'Blog — Prosengit Kundu',
        og_description: 'Insights on SEO, paid ads, lead generation and web development.'
      },
      {
        page_slug: 'contact',
        meta_title: 'Contact Prosengit Kundu | SEO & Digital Marketing Expert',
        meta_description: 'Contact Prosengit Kundu in Khulna, Bangladesh for SEO, digital marketing, ads, graphic design, web development or training.',
        focus_keyword: 'contact prosengit kundu',
        canonical_url: '/contact.html',
        og_title: 'Contact Prosengit Kundu',
        og_description: 'Reach out for SEO, digital marketing, ads, graphic design, web development or training.'
      }
    ];
    const insSeo = db.prepare(`
      INSERT INTO seo_settings
        (page_slug, meta_title, meta_description, focus_keyword, canonical_url, robots, og_title, og_description, og_image, twitter_card)
      VALUES (?,?,?,?,?,'index, follow',?,?,?, 'summary_large_image')
    `);
    for (const s of seoDefaults) {
      insSeo.run(s.page_slug, s.meta_title, s.meta_description, s.focus_keyword, s.canonical_url, s.og_title, s.og_description, s.og_image || '');
    }

    // ---- Services (from index.html static cards) --------------------------
    const services = [
      { title: 'SEO Services', slug: 'seo-services', description: 'Comprehensive on-page, off-page, technical, and local SEO strategies to rank higher and drive organic traffic.', price_text: 'Delivery: 2 days • Starting from $30', icon: 'search', image: 'https://images.pexels.com/photos/6248959/pexels-photo-6248959.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=420', sort: 1 },
      { title: 'Google & Meta Ads', slug: 'google-meta-ads', description: 'High-converting paid campaigns on Google Ads, Facebook, Instagram, and YouTube with advanced targeting.', price_text: 'Delivery: 2 days • Starting from $70', icon: 'chart', image: 'https://images.pexels.com/photos/3183126/pexels-photo-3183126.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=420', sort: 2 },
      { title: 'YouTube Marketing', slug: 'youtube-marketing', description: 'Channel optimization, video SEO, thumbnail design, and content strategy to grow your YouTube presence.', price_text: 'Delivery: 5 days • Starting from $100', icon: 'video', image: 'https://images.pexels.com/photos/6326370/pexels-photo-6326370.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=420', sort: 3 },
      { title: 'Social Media & Lead Gen', slug: 'social-media-lead-gen', description: 'Full-service social media management and lead generation campaigns that convert followers into customers.', price_text: 'Delivery: Monthly • Starting from $150/mo', icon: 'users', image: 'https://images.pexels.com/photos/7691715/pexels-photo-7691715.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=420', sort: 4 },
      { title: 'Graphic Design & Branding', slug: 'graphic-design-branding', description: 'Logo design, brand identity, business cards, social media graphics, banners, flyers, and thumbnails.', price_text: 'Delivery: 2 days • Starting from $25', icon: 'palette', image: 'https://images.pexels.com/photos/7598009/pexels-photo-7598009.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=420', sort: 5 },
      { title: 'WordPress & Virtual Assistant', slug: 'wordpress-virtual-assistant', description: 'Custom WordPress websites, landing pages, speed optimization, database management, and data entry services.', price_text: 'Delivery: 5 days • Starting from $50', icon: 'code', image: 'https://images.pexels.com/photos/8546649/pexels-photo-8546649.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=900&h=420', sort: 6 }
    ];
    const insService = db.prepare(`
      INSERT INTO services (title, slug, description, icon, image, price_text, sort_order, active)
      VALUES (?,?,?,?,?,?,?,1)
    `);
    for (const s of services) insService.run(s.title, s.slug, s.description, s.icon, s.image, s.price_text, s.sort);

    // ---- Projects (from assets/js/projects.js) ----------------------------
    const projects = loadJsArray('assets/js/projects.js', 'PROJECTS');
    const insProject = db.prepare(`
      INSERT INTO projects
        (title, slug, category, category_label, client, industry, focus, duration, goal, role, tools_json, work_json, outcome, image, featured, sort_order, published)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)
    `);
    const catMap = { web: 'Web Development', seo: 'SEO', lead: 'Lead Generation', ads: 'Paid Ads', design: 'Graphic Design' };
    projects.forEach((p, i) => {
      insProject.run(
        p.title, slugify(p.title), p.cat || 'web', (catMap[p.cat] || ''),
        p.client || '', p.industry || '', p.focus || '', p.duration || '',
        p.goal || '', p.role || '', JSON.stringify(p.tools || []), JSON.stringify(p.work || []),
        p.outcome || '', p.image || '', p.featured ? 1 : 0, i + 1
      );
    });

    // ---- Blog posts (from assets/js/articles.js) --------------------------
    const articles = loadJsArray('assets/js/articles.js', 'ARTICLES');
    const insArticle = db.prepare(`
      INSERT INTO blog_posts
        (title, slug, excerpt, content, category, image, author, publish_date, read_time, published, seo_title, seo_description, canonical_url)
      VALUES (?,?,?,?,?,?,?,?,?,1,?,?,?)
    `);
    // seed categories
    const insCat = db.prepare('INSERT OR IGNORE INTO blog_categories (name, slug) VALUES (?,?)');
    const seenCats = new Set();
    const seedDate = '2026-08-25';
    articles.forEach((a, i) => {
      const cat = a.cat || 'Digital Marketing';
      if (!seenCats.has(cat)) { insCat.run(cat, slugify(cat)); seenCats.add(cat); }
      insArticle.run(
        a.title, slugify(a.title), a.excerpt || '', a.body || '', cat,
        a.img || '', 'Prosengit Kundu', a.date || seedDate, a.read || '',
        a.title.replace(/[^A-Za-z0-9 ]/g, '').slice(0, 60) + ' | Prosengit Kundu',
        a.excerpt || '', '/blog-details.html'
      );
    });

    // ---- default page rows -------------------------------------------------
    const pages = [
      { slug: 'home', title: 'Home', heading: 'Hi, I\'m Prosengit Kundu' },
      { slug: 'about', title: 'About', heading: 'Growing brands. Building websites. Training professionals.' },
      { slug: 'services', title: 'Services', heading: 'Services built for results' },
      { slug: 'portfolio', title: 'Portfolio', heading: 'Featured Projects' },
      { slug: 'blog', title: 'Blog', heading: 'Latest from the blog' },
      { slug: 'contact', title: 'Contact', heading: 'Ready to grow your business?' }
    ];
    const insPage = db.prepare('INSERT INTO pages (slug, title, heading, status) VALUES (?,?,?,?)');
    for (const p of pages) insPage.run(p.slug, p.title, p.heading, 'published');

    console.log('✓ Database seeded from existing frontend content.');
  } else {
    console.log('✓ Database already initialized.');
  }
}

createSchema();
module.exports = { db, createSchema, seed, ABS_DB_PATH, DB_PATH };

// CLI entry points
if (require.main === module) {
  const arg = process.argv[2];
  if (arg === '--init' || arg === '--seed' || arg === '--reset') {
    if (arg === '--reset') {
      db.exec(`DELETE FROM users; DELETE FROM site_settings; DELETE FROM navigation;
        DELETE FROM services; DELETE FROM projects; DELETE FROM blog_posts;
        DELETE FROM testimonials; DELETE FROM media; DELETE FROM contact_messages;
        DELETE FROM seo_settings; DELETE FROM pages; DELETE FROM page_sections;`);
    }
    seed();
    console.log('Database ready at ' + ABS_DB_PATH);
  } else {
    console.log('Run me with --init / --seed / --reset');
  }
}
