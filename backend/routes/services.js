'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, parseJson, slugify, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BASE = process.env.SITE_URL || '';

function publicService(r) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    icon: r.icon,
    image: absoluteUrl(r.image, BASE),
    price_text: r.price_text,
    price_bdt: r.price_bdt,
    price_usd: r.price_usd,
    features: parseJson(r.features_json, []),
    cta_label: r.cta_label,
    sort_order: r.sort_order,
    active: !!r.active
  };
}

function adminService(r) {
  return { ...publicService(r), features_json: r.features_json };
}

function getPublished() {
  return db.prepare('SELECT * FROM services WHERE active = 1 ORDER BY sort_order ASC, id ASC').all();
}

// GET /api/services  (public)
router.get('/', (req, res) => ok(res, getPublished().map(publicService)));

// GET /api/services/:id  (public)
router.get('/:id', (req, res) => {
  const r = db.prepare('SELECT * FROM services WHERE id=?').get(Number(req.params.id));
  if (!r) return fail(res, 'Service not found.', 404);
  ok(res, publicService(r));
});

// GET /api/services/full  (admin)
router.get('/admin/all', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM services ORDER BY sort_order ASC, id ASC').all();
  ok(res, rows.map(adminService));
});

// POST /api/services  (admin)
router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.title) return fail(res, 'Title is required.');
  const features = Array.isArray(b.features) ? b.features : (b.features_json ? parseJson(b.features_json, []) : []);
  const nextPos = b.sort_order != null ? Number(b.sort_order)
    : (db.prepare('SELECT COALESCE(MAX(sort_order),0)+1 AS p FROM services').get().p);
  const slug = b.slug || slugify(b.title);
  const info = db.prepare(`
    INSERT INTO services (title, slug, description, icon, image, price_text, price_bdt, price_usd, features_json, cta_label, sort_order, active)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    String(b.title), slug, b.description || '', b.icon || '', b.image || '',
    b.price_text || '', b.price_bdt || '', b.price_usd || '',
    JSON.stringify(features), b.cta_label || '', nextPos,
    b.active != null ? (b.active ? 1 : 0) : 1
  );
  ok(res, adminService(db.prepare('SELECT * FROM services WHERE id=?').get(info.lastInsertRowid)), 201);
});

// PUT /api/services/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM services WHERE id=?').get(id);
  if (!row) return fail(res, 'Service not found.', 404);
  const b = req.body || {};
  const features = Array.isArray(b.features) ? b.features : (b.features_json ? parseJson(b.features_json, row.features_json ? JSON.parse(row.features_json) : []) : (row.features_json ? JSON.parse(row.features_json) : []));
  db.prepare(`
    UPDATE services SET title=?, slug=?, description=?, icon=?, image=?, price_text=?, price_bdt=?, price_usd=?, features_json=?, cta_label=?, sort_order=?, active=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    b.title != null ? String(b.title) : row.title,
    b.slug != null ? String(b.slug) : row.slug,
    b.description != null ? String(b.description) : row.description,
    b.icon != null ? String(b.icon) : row.icon,
    b.image != null ? String(b.image) : row.image,
    b.price_text != null ? String(b.price_text) : row.price_text,
    b.price_bdt != null ? String(b.price_bdt) : row.price_bdt,
    b.price_usd != null ? String(b.price_usd) : row.price_usd,
    JSON.stringify(features),
    b.cta_label != null ? String(b.cta_label) : row.cta_label,
    b.sort_order != null ? Number(b.sort_order) : row.sort_order,
    b.active != null ? (b.active ? 1 : 0) : row.active,
    id
  );
  ok(res, adminService(db.prepare('SELECT * FROM services WHERE id=?').get(id)));
});

// DELETE /api/services/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM services WHERE id=?').run(Number(req.params.id));
  if (info.changes === 0) return fail(res, 'Service not found.', 404);
  ok(res, { deleted: true });
});

// PUT /api/services/reorder/apply  (admin) — [{id, sort_order}]
router.put('/reorder/apply', requireAuth, (req, res) => {
  const items = req.body && req.body.items;
  if (!Array.isArray(items)) return fail(res, 'Expected { items: [{id, sort_order}] }');
  const upd = db.prepare('UPDATE services SET sort_order=? WHERE id=?');
  for (const it of items) if (it && it.id != null) upd.run(Number(it.sort_order || 0), Number(it.id));
  ok(res, db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all().map(adminService));
});

module.exports = router;
