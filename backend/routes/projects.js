'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, parseJson, slugify, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BASE = process.env.SITE_URL || '';
const CAT_LABELS = {
  web: 'Web Development', seo: 'SEO', lead: 'Lead Generation', ads: 'Paid Ads', design: 'Graphic Design'
};
const LEGACY_CATS = ['web', 'seo', 'lead', 'ads', 'design'];

function publicProject(r, images) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    category: r.category,
    category_label: r.category_label || CAT_LABELS[r.category] || '',
    client: r.client,
    industry: r.industry,
    client_type: r.client_type,
    focus: r.focus,
    duration: r.duration,
    goal: r.goal,
    role: r.role,
    tools: parseJson(r.tools_json, []),
    work: parseJson(r.work_json, []),
    outcome: r.outcome,
    results: r.results,
    image: absoluteUrl(r.image, BASE),
    url: r.url,
    project_date: r.project_date,
    featured: !!r.featured,
    sort_order: r.sort_order,
    published: !!r.published,
    images: (images || []).map((i) => ({ id: i.id, image: absoluteUrl(i.image, BASE), caption: i.caption }))
  };
}

function adminProject(r) {
  const images = db.prepare('SELECT * FROM project_images WHERE project_id=? ORDER BY sort_order, id').all(r.id);
  return { ...publicProject(r, images), tools_json: r.tools_json, work_json: r.work_json };
}

function getImages(pid) {
  return db.prepare('SELECT * FROM project_images WHERE project_id=? ORDER BY sort_order, id').all(pid);
}

// GET /api/projects  (public) — published only
router.get('/', (req, res) => {
  const filter = req.query.category;
  let rows;
  if (filter) {
    rows = db.prepare('SELECT * FROM projects WHERE published = 1 AND category = ? ORDER BY sort_order, id').all(String(filter));
  } else {
    rows = db.prepare('SELECT * FROM projects WHERE published = 1 ORDER BY sort_order, id').all();
  }
  ok(res, rows.map((r) => publicProject(r)));
});

// GET /api/projects/categories  (public)
router.get('/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM projects WHERE published = 1').all();
  const cats = rows.map((r) => ({ key: r.category, label: CAT_LABELS[r.category] || r.category })).filter((c) => c.key);
  ok(res, cats);
});

// GET /api/projects/featured  (public)
router.get('/featured', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects WHERE published = 1 AND featured = 1 ORDER BY sort_order, id').all();
  ok(res, rows.map((r) => publicProject(r)));
});

// GET /api/projects/:id  (public)
router.get('/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM projects WHERE id=? AND published = 1').get(Number(req.params.id));
  if (!r) return fail(res, 'Project not found.', 404);
  ok(res, publicProject(r, getImages(r.id)));
});

// GET /api/projects/admin/:id  (admin)
router.get('/admin/:id', requireAuth, (req, res) => {
  const r = db.prepare('SELECT * FROM projects WHERE id=?').get(Number(req.params.id));
  if (!r) return fail(res, 'Project not found.', 404);
  ok(res, adminProject(r));
});

// GET /api/projects/admin/all  (admin)
router.get('/admin/all', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all();
  ok(res, rows.map(adminProject));
});

// POST /api/projects  (admin)
router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.title) return fail(res, 'Title is required.');
  const cat = b.category || 'web';
  const nextPos = b.sort_order != null ? Number(b.sort_order)
    : (db.prepare('SELECT COALESCE(MAX(sort_order),0)+1 AS p FROM projects').get().p);
  const slug = b.slug || slugify(b.title);
  const info = db.prepare(`
    INSERT INTO projects (title, slug, description, category, category_label, client, industry, client_type, focus, duration, goal, role, tools_json, work_json, outcome, results, image, url, project_date, featured, sort_order, published)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    String(b.title), slug, b.description || '', cat, b.category_label || CAT_LABELS[cat] || '',
    b.client || '', b.industry || '', b.client_type || '', b.focus || '', b.duration || '',
    b.goal || '', b.role || '', JSON.stringify(b.tools || []), JSON.stringify(b.work || []),
    b.outcome || '', b.results || '', b.image || '', b.url || '', b.project_date || '',
    b.featured ? 1 : 0, nextPos, b.published != null ? (b.published ? 1 : 0) : 1
  );
  const id = info.lastInsertRowid;
  if (Array.isArray(b.images)) {
    const insImg = db.prepare('INSERT INTO project_images (project_id, image, caption, sort_order) VALUES (?,?,?,?)');
    b.images.forEach((img, i) => insImg.run(id, img.image || img, img.caption || '', i));
  }
  ok(res, adminProject(db.prepare('SELECT * FROM projects WHERE id=?').get(id)), 201);
});

// PUT /api/projects/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM projects WHERE id=?').get(id);
  if (!row) return fail(res, 'Project not found.', 404);
  const b = req.body || {};
  const cat = b.category != null ? b.category : row.category;
  db.prepare(`
    UPDATE projects SET title=?, slug=?, description=?, category=?, category_label=?, client=?, industry=?, client_type=?, focus=?, duration=?, goal=?, role=?, tools_json=?, work_json=?, outcome=?, results=?, image=?, url=?, project_date=?, featured=?, sort_order=?, published=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    b.title != null ? String(b.title) : row.title,
    b.slug != null ? String(b.slug) : row.slug,
    b.description != null ? String(b.description) : row.description,
    cat,
    b.category_label != null ? b.category_label : (row.category_label || CAT_LABELS[cat] || ''),
    b.client != null ? String(b.client) : row.client,
    b.industry != null ? String(b.industry) : row.industry,
    b.client_type != null ? String(b.client_type) : row.client_type,
    b.focus != null ? String(b.focus) : row.focus,
    b.duration != null ? String(b.duration) : row.duration,
    b.goal != null ? String(b.goal) : row.goal,
    b.role != null ? String(b.role) : row.role,
    JSON.stringify(b.tools || (row.tools_json ? JSON.parse(row.tools_json) : [])),
    JSON.stringify(b.work || (row.work_json ? JSON.parse(row.work_json) : [])),
    b.outcome != null ? String(b.outcome) : row.outcome,
    b.results != null ? String(b.results) : row.results,
    b.image != null ? String(b.image) : row.image,
    b.url != null ? String(b.url) : row.url,
    b.project_date != null ? String(b.project_date) : row.project_date,
    b.featured != null ? (b.featured ? 1 : 0) : row.featured,
    b.sort_order != null ? Number(b.sort_order) : row.sort_order,
    b.published != null ? (b.published ? 1 : 0) : row.published,
    id
  );

  // Gallery images: full replace if `images` array provided.
  if (Array.isArray(b.images)) {
    db.prepare('DELETE FROM project_images WHERE project_id=?').run(id);
    const insImg = db.prepare('INSERT INTO project_images (project_id, image, caption, sort_order) VALUES (?,?,?,?)');
    b.images.forEach((img, i) => insImg.run(id, img.image || img, img.caption || '', i));
  }
  ok(res, adminProject(db.prepare('SELECT * FROM projects WHERE id=?').get(id)));
});

// DELETE /api/projects/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM projects WHERE id=?').run(Number(req.params.id));
  if (info.changes === 0) return fail(res, 'Project not found.', 404);
  ok(res, { deleted: true });
});

// PUT /api/projects/reorder/apply  (admin)
router.put('/reorder/apply', requireAuth, (req, res) => {
  const items = req.body && req.body.items;
  if (!Array.isArray(items)) return fail(res, 'Expected { items: [{id, sort_order}] }');
  const upd = db.prepare('UPDATE projects SET sort_order=? WHERE id=?');
  for (const it of items) if (it && it.id != null) upd.run(Number(it.sort_order || 0), Number(it.id));
  ok(res, db.prepare('SELECT * FROM projects ORDER BY sort_order, id').all().map(adminProject));
});

module.exports = router;
