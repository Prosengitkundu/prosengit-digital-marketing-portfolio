'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, parseJson, slugify, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BASE = process.env.SITE_URL || '';

function publicPost(r) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    tags: parseJson(r.tags_json, []),
    image: absoluteUrl(r.image, BASE),
    author: r.author,
    publish_date: r.publish_date,
    read_time: r.read_time,
    published: !!r.published,
    featured: !!r.featured,
    seo_title: r.seo_title,
    seo_description: r.seo_description,
    canonical_url: r.canonical_url,
    og_title: r.og_title,
    og_description: r.og_description,
    og_image: absoluteUrl(r.og_image || r.image, BASE),
    twitter_card: r.twitter_card
  };
}

function uniqueSlug(title, excludeId) {
  let slug = slugify(title);
  let candidate = slug;
  let n = 1;
  let exists = db.prepare('SELECT id FROM blog_posts WHERE slug=? AND id != ?').get(candidate, excludeId || -1);
  while (exists) {
    candidate = `${slug}-${n++}`;
    exists = db.prepare('SELECT id FROM blog_posts WHERE slug=? AND id != ?').get(candidate, excludeId || -1);
  }
  return candidate;
}

// GET /api/blog  (public) — published, optional ?category=&tag=&q=&limit=
router.get('/', (req, res) => {
  const { category, tag, q } = req.query;
  let sql = 'SELECT * FROM blog_posts WHERE published = 1';
  const params = [];
  if (category) { sql += ' AND category = ?'; params.push(String(category)); }
  if (tag) { sql += ' AND tags_json LIKE ?'; params.push('%"' + String(tag) + '"%'); }
  if (q) { sql += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)'; const like = '%' + String(q) + '%'; params.push(like, like, like); }
  sql += ' ORDER BY publish_date DESC, id DESC';
  let rows = db.prepare(sql).all(...params);
  ok(res, rows.map(publicPost));
});

// GET /api/blog/categories  (public)
router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT name, slug FROM blog_categories ORDER BY name').all();
  ok(res, rows);
});

// GET /api/blog/:slug  (public) — by slug for the details page
router.get('/:slug', (req, res) => {
  const r = db.prepare('SELECT * FROM blog_posts WHERE slug=? AND published = 1').get(String(req.params.slug));
  if (!r) return fail(res, 'Post not found.', 404);
  ok(res, publicPost(r));
});

// GET /api/blog/id/:id  (public) — by numeric id for the details page
router.get('/id/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM blog_posts WHERE id=? AND published = 1').get(Number(req.params.id));
  if (!r) return fail(res, 'Post not found.', 404);
  ok(res, publicPost(r));
});

// GET /api/blog/admin/all  (admin)
router.get('/admin/all', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM blog_posts ORDER BY publish_date DESC, id DESC').all();
  ok(res, rows.map(publicPost));
});

// GET /api/blog/admin/detail/:id  (admin)
router.get('/admin/detail/:id', requireAuth, (req, res) => {
  const r = db.prepare('SELECT * FROM blog_posts WHERE id=?').get(Number(req.params.id));
  if (!r) return fail(res, 'Post not found.', 404);
  ok(res, { ...publicPost(r), tags_json: r.tags_json });
});

// GET /api/blog/admin/recent
router.get('/admin/recent', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT id,title,slug,category,publish_date,published FROM blog_posts ORDER BY publish_date DESC, id DESC LIMIT 5').all();
  ok(res, rows);
});

// POST /api/blog  (admin)
router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.title) return fail(res, 'Title is required.');
  const slug = b.slug ? slugify(b.slug) : uniqueSlug(b.title);
  const cat = b.category || '';
  if (cat) {
    db.prepare('INSERT OR IGNORE INTO blog_categories (name, slug) VALUES (?,?)').run(cat, slugify(cat));
  }
  const info = db.prepare(`
    INSERT INTO blog_posts (title, slug, excerpt, content, category, tags_json, image, author, publish_date, read_time, published, featured, seo_title, seo_description, canonical_url, og_title, og_description, og_image, twitter_card)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    String(b.title), slug, b.excerpt || '', b.content || '', cat,
    JSON.stringify(b.tags || []), b.image || '', b.author || 'Prosengit Kundu',
    b.publish_date || new Date().toISOString().slice(0, 10), b.read_time || '',
    b.published != null ? (b.published ? 1 : 0) : 0, b.featured ? 1 : 0,
    b.seo_title || '', b.seo_description || '', b.canonical_url || '',
    b.og_title || '', b.og_description || '', b.og_image || '', b.twitter_card || 'summary_large_image'
  );
  ok(res, publicPost(db.prepare('SELECT * FROM blog_posts WHERE id=?').get(info.lastInsertRowid)), 201);
});

// PUT /api/blog/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM blog_posts WHERE id=?').get(id);
  if (!row) return fail(res, 'Post not found.', 404);
  const b = req.body || {};
  const slug = b.slug ? slugify(b.slug) : row.slug;
  const cat = b.category != null ? b.category : row.category;
  if (cat) db.prepare('INSERT OR IGNORE INTO blog_categories (name, slug) VALUES (?,?)').run(cat, slugify(cat));
  db.prepare(`
    UPDATE blog_posts SET title=?, slug=?, excerpt=?, content=?, category=?, tags_json=?, image=?, author=?, publish_date=?, read_time=?, published=?, featured=?, seo_title=?, seo_description=?, canonical_url=?, og_title=?, og_description=?, og_image=?, twitter_card=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    b.title != null ? String(b.title) : row.title,
    slug,
    b.excerpt != null ? String(b.excerpt) : row.excerpt,
    b.content != null ? String(b.content) : row.content,
    cat,
    JSON.stringify(b.tags || (row.tags_json ? JSON.parse(row.tags_json) : [])),
    b.image != null ? String(b.image) : row.image,
    b.author != null ? String(b.author) : row.author,
    b.publish_date != null ? String(b.publish_date) : row.publish_date,
    b.read_time != null ? String(b.read_time) : row.read_time,
    b.published != null ? (b.published ? 1 : 0) : row.published,
    b.featured != null ? (b.featured ? 1 : 0) : row.featured,
    b.seo_title != null ? String(b.seo_title) : row.seo_title,
    b.seo_description != null ? String(b.seo_description) : row.seo_description,
    b.canonical_url != null ? String(b.canonical_url) : row.canonical_url,
    b.og_title != null ? String(b.og_title) : row.og_title,
    b.og_description != null ? String(b.og_description) : row.og_description,
    b.og_image != null ? String(b.og_image) : row.og_image,
    b.twitter_card != null ? String(b.twitter_card) : row.twitter_card,
    id
  );
  ok(res, publicPost(db.prepare('SELECT * FROM blog_posts WHERE id=?').get(id)));
});

// DELETE /api/blog/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM blog_posts WHERE id=?').run(Number(req.params.id));
  if (info.changes === 0) return fail(res, 'Post not found.', 404);
  ok(res, { deleted: true });
});

module.exports = router;
