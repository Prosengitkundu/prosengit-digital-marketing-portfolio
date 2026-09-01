'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BASE = process.env.SITE_URL || '';

function publicSeo(r) {
  // OG image should be an absolute URL so social scrapers can fetch it.
  let og = r.og_image || '';
  if (og && !/^(https?:)?\/\//i.test(og)) og = BASE.replace(/\/$/, '') + (og.startsWith('/') ? og : '/' + og);
  return {
    meta_title: r.meta_title,
    meta_description: r.meta_description,
    focus_keyword: r.focus_keyword,
    canonical_url: r.canonical_url,
    robots: r.robots,
    og_title: r.og_title,
    og_description: r.og_description,
    og_image: og,
    twitter_card: r.twitter_card,
    schema_json: r.schema_json ? JSON.parse(r.schema_json) : null
  };
}

// GET /api/seo/:slug  (public) — SEO data for a given page
router.get('/:slug', (req, res) => {
  const slug = String(req.params.slug);
  const r = db.prepare('SELECT * FROM seo_settings WHERE page_slug=?').get(slug);
  if (!r) return ok(res, { meta_title: '', meta_description: '', canonical_url: '', robots: 'index, follow' });
  ok(res, publicSeo(r));
});

// GET /api/seo  (admin) — all pages
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM seo_settings ORDER BY page_slug').all();
  ok(res, rows.map((r) => ({ ...publicSeo(r), page_slug: r.page_slug, updated_at: r.updated_at, og_image: r.og_image })));
});

// GET /api/seo/admin/:slug  (admin)
router.get('/admin/:slug', requireAuth, (req, res) => {
  const r = db.prepare('SELECT * FROM seo_settings WHERE page_slug=?').get(String(req.params.slug));
  if (!r) return fail(res, 'SEO not found for that page.', 404);
  ok(res, { ...r, og_image: r.og_image, schema_json: r.schema_json ? JSON.parse(r.schema_json) : null });
});

// PUT /api/seo/:slug  (admin)
router.put('/:slug', requireAuth, (req, res) => {
  const slug = String(req.params.slug);
  const b = req.body || {};
  const existing = db.prepare('SELECT * FROM seo_settings WHERE page_slug=?').get(slug);
  const schema = b.schema_json ? (typeof b.schema_json === 'string' ? b.schema_json : JSON.stringify(b.schema_json)) : (existing?.schema_json || '');
  db.prepare(`
    INSERT INTO seo_settings (page_slug, meta_title, meta_description, focus_keyword, canonical_url, robots, og_title, og_description, og_image, twitter_card, schema_json, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
    ON CONFLICT(page_slug) DO UPDATE SET
      meta_title=excluded.meta_title, meta_description=excluded.meta_description,
      focus_keyword=excluded.focus_keyword, canonical_url=excluded.canonical_url,
      robots=excluded.robots, og_title=excluded.og_title, og_description=excluded.og_description,
      og_image=excluded.og_image, twitter_card=excluded.twitter_card,
      schema_json=excluded.schema_json, updated_at=datetime('now')
  `).run(
    slug,
    b.meta_title != null ? String(b.meta_title) : (existing?.meta_title || ''),
    b.meta_description != null ? String(b.meta_description) : (existing?.meta_description || ''),
    b.focus_keyword != null ? String(b.focus_keyword) : (existing?.focus_keyword || ''),
    b.canonical_url != null ? String(b.canonical_url) : (existing?.canonical_url || ''),
    b.robots != null ? String(b.robots) : (existing?.robots || 'index, follow'),
    b.og_title != null ? String(b.og_title) : (existing?.og_title || ''),
    b.og_description != null ? String(b.og_description) : (existing?.og_description || ''),
    b.og_image != null ? String(b.og_image) : (existing?.og_image || ''),
    b.twitter_card != null ? String(b.twitter_card) : (existing?.twitter_card || 'summary_large_image'),
    schema
  );
  ok(res, db.prepare('SELECT * FROM seo_settings WHERE page_slug=?').get(slug));
});

module.exports = router;
