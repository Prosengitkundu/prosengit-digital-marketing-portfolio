'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const BASE = process.env.SITE_URL || '';

function publicTestimonial(r) {
  return {
    id: r.id,
    client_name: r.client_name,
    designation: r.designation,
    company: r.company,
    country: r.country,
    content: r.content,
    image: absoluteUrl(r.image, BASE),
    rating: r.rating,
    sort_order: r.sort_order
  };
}

// GET /api/testimonials  (public) — published only
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order, id').all();
  ok(res, rows.map(publicTestimonial));
});

// GET /api/testimonials/full  (admin)
router.get('/full', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM testimonials ORDER BY sort_order, id').all();
  ok(res, rows.map((r) => ({ ...publicTestimonial(r), published: !!r.published, created_at: r.created_at })));
});

// POST /api/testimonials  (admin)
router.post('/', requireAuth, (req, res) => {
  const b = req.body || {};
  if (!b.client_name) return fail(res, 'Client name is required.');
  const nextPos = b.sort_order != null ? Number(b.sort_order)
    : (db.prepare('SELECT COALESCE(MAX(sort_order),0)+1 AS p FROM testimonials').get().p);
  const info = db.prepare(`
    INSERT INTO testimonials (client_name, designation, company, country, content, image, rating, published, sort_order)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run(
    String(b.client_name), b.designation || '', b.company || '', b.country || '',
    b.content || '', b.image || '', Number(b.rating || 0),
    b.published != null ? (b.published ? 1 : 0) : 0, nextPos
  );
  ok(res, publicTestimonial(db.prepare('SELECT * FROM testimonials WHERE id=?').get(info.lastInsertRowid)), 201);
});

// PUT /api/testimonials/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM testimonials WHERE id=?').get(id);
  if (!row) return fail(res, 'Testimonial not found.', 404);
  const b = req.body || {};
  db.prepare(`
    UPDATE testimonials SET client_name=?, designation=?, company=?, country=?, content=?, image=?, rating=?, published=?, sort_order=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    b.client_name != null ? String(b.client_name) : row.client_name,
    b.designation != null ? String(b.designation) : row.designation,
    b.company != null ? String(b.company) : row.company,
    b.country != null ? String(b.country) : row.country,
    b.content != null ? String(b.content) : row.content,
    b.image != null ? String(b.image) : row.image,
    b.rating != null ? Number(b.rating) : row.rating,
    b.published != null ? (b.published ? 1 : 0) : row.published,
    b.sort_order != null ? Number(b.sort_order) : row.sort_order,
    id
  );
  ok(res, publicTestimonial(db.prepare('SELECT * FROM testimonials WHERE id=?').get(id)));
});

// DELETE /api/testimonials/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM testimonials WHERE id=?').run(Number(req.params.id));
  if (info.changes === 0) return fail(res, 'Testimonial not found.', 404);
  ok(res, { deleted: true });
});

module.exports = router;
