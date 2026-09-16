'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, absoluteUrl, parseJson } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BASE = process.env.SITE_URL || '';

// GET /api/pages  (public) — list published pages
router.get('/', (req, res) => {
  const rows = db.prepare("SELECT id, slug, title, heading, status FROM pages WHERE status = 'published' ORDER BY id").all();
  ok(res, rows);
});

// GET /api/pages/sections/:pageSlug  (public) — all active sections for a page
router.get('/sections/:pageSlug', (req, res) => {
  const slug = String(req.params.pageSlug);
  const page = db.prepare('SELECT * FROM pages WHERE slug=?').get(slug);
  const sections = db.prepare('SELECT * FROM page_sections WHERE page_slug=? AND active = 1 ORDER BY sort_order, id').all(slug);
  ok(res, {
    page: page ? { slug: page.slug, title: page.title, heading: page.heading, content_html: page.content_html } : null,
    sections: sections.map((s) => ({
      section_key: s.section_key,
      heading: s.heading,
      subheading: s.subheading,
      description: s.description,
      image: absoluteUrl(s.image, BASE),
      cta_label: s.cta_label,
      cta_url: s.cta_url,
      content: parseJson(s.content_json, null),
      sort_order: s.sort_order
    }))
  });
});

// --- Admin ---

// GET /api/pages/all  (admin) — pages with their sections
router.get('/all', requireAuth, (req, res) => {
  const pages = db.prepare('SELECT * FROM pages ORDER BY id').all();
  const sections = db.prepare('SELECT * FROM page_sections ORDER BY page_slug, sort_order').all();
  const bySlug = {};
  for (const s of sections) {
    (bySlug[s.page_slug] = bySlug[s.page_slug] || []).push(s);
  }
  ok(res, pages.map((p) => ({ ...p, sections: bySlug[p.slug] || [] })));
});

// PUT /api/pages/:slug  (admin) — update page title/heading/content + (optionally) sections
router.put('/:slug', requireAuth, (req, res) => {
  const slug = String(req.params.slug);
  const page = db.prepare('SELECT * FROM pages WHERE slug=?').get(slug);
  if (!page) return fail(res, 'Page not found.', 404);
  const b = req.body || {};
  db.prepare(`
    UPDATE pages SET title=?, heading=?, content_html=?, status=?, updated_at=datetime('now')
    WHERE slug=?
  `).run(
    b.title != null ? String(b.title) : page.title,
    b.heading != null ? String(b.heading) : page.heading,
    b.content_html !== undefined ? (b.content_html || '') : (page.content_html || ''),
    b.status || page.status,
    slug
  );

  // Optional: upsert a single section
  if (b.section) {
    const s = b.section;
    db.prepare(`
      INSERT INTO page_sections (page_slug, section_key, heading, subheading, description, image, cta_label, cta_url, content_json, sort_order, active)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(page_slug, section_key) DO UPDATE SET
        heading=excluded.heading, subheading=excluded.subheading, description=excluded.description,
        image=excluded.image, cta_label=excluded.cta_label, cta_url=excluded.cta_url,
        content_json=excluded.content_json, sort_order=excluded.sort_order, active=excluded.active,
        updated_at=datetime('now')
    `).run(
      slug, s.section_key, s.heading || '', s.subheading || '', s.description || '',
      s.image || '', s.cta_label || '', s.cta_url || '',
      s.content ? JSON.stringify(s.content) : null,
      s.sort_order != null ? Number(s.sort_order) : 0,
      s.active != null ? (s.active ? 1 : 0) : 1
    );
  }

  // Optional: replace all sections (array)
  if (Array.isArray(b.sections)) {
    db.prepare('DELETE FROM page_sections WHERE page_slug=?').run(slug);
    const ins = db.prepare(`
      INSERT INTO page_sections (page_slug, section_key, heading, subheading, description, image, cta_label, cta_url, content_json, sort_order, active)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `);
    b.sections.forEach((s, i) => ins.run(
      slug, s.section_key, s.heading || '', s.subheading || '', s.description || '',
      s.image || '', s.cta_label || '', s.cta_url || '',
      s.content ? JSON.stringify(s.content) : null, s.sort_order != null ? Number(s.sort_order) : i,
      s.active != null ? (s.active ? 1 : 0) : 1
    ));
  }

  ok(res, require('../db').db.prepare('SELECT * FROM pages WHERE slug=?').get(slug));
});

// POST /api/pages/:slug/sections  (admin) — add a section
router.post('/:slug/sections', requireAuth, (req, res) => {
  const slug = String(req.params.slug);
  const page = db.prepare('SELECT * FROM pages WHERE slug=?').get(slug);
  if (!page) return fail(res, 'Page not found.', 404);
  const s = req.body || {};
  if (!s.section_key) return fail(res, 'section_key is required.');
  const next = db.prepare('SELECT COALESCE(MAX(sort_order),0)+1 AS p FROM page_sections WHERE page_slug=?').get(slug).p;
  db.prepare(`
    INSERT INTO page_sections (page_slug, section_key, heading, subheading, description, image, cta_label, cta_url, content_json, sort_order, active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(page_slug, section_key) DO UPDATE SET
      heading=excluded.heading, subheading=excluded.subheading, description=excluded.description,
      image=excluded.image, cta_label=excluded.cta_label, cta_url=excluded.cta_url,
      content_json=excluded.content_json, sort_order=excluded.sort_order, active=excluded.active,
      updated_at=datetime('now')
  `).run(
    slug, s.section_key, s.heading || '', s.subheading || '', s.description || '',
    s.image || '', s.cta_label || '', s.cta_url || '',
    s.content ? JSON.stringify(s.content) : null, s.sort_order != null ? Number(s.sort_order) : next,
    s.active != null ? (s.active ? 1 : 0) : 1
  );
  ok(res, db.prepare('SELECT * FROM page_sections WHERE page_slug=? AND section_key=?').get(slug, s.section_key), 201);
});

module.exports = router;
