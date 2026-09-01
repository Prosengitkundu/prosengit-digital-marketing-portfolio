'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const { ok, fail, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');
const { upload, UPLOAD_ROOT } = require('../middleware/upload');

const router = express.Router();
const BASE = process.env.PUBLIC_BASE_URL || process.env.SITE_URL || '';

function publicMedia(r) {
  // Return a same-origin path so it resolves on any host (preview/local/prod).
  return { id: r.id, filename: r.filename, url: r.path, path: r.path, mime_type: r.mime_type, size: r.size, alt_text: r.alt_text, uploaded_at: r.uploaded_at };
}

// GET /api/media  (admin)
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM media ORDER BY id DESC').all();
  ok(res, rows.map(publicMedia));
});

// POST /api/media/upload  (admin) — multipart; field name `file`
router.post('/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return fail(res, err.message || 'Upload failed.', 400);
    if (!req.file) return fail(res, 'No file uploaded.');
    const relPath = '/uploads/' + req.file.filename;
    const info = db.prepare(`
      INSERT INTO media (filename, path, mime_type, size, alt_text)
      VALUES (?,?,?,?,?)
    `).run(req.file.filename, relPath, req.file.mimetype, req.file.size, (req.body.alt_text || ''));
    ok(res, publicMedia(db.prepare('SELECT * FROM media WHERE id=?').get(info.lastInsertRowid)), 201);
  });
});

// PUT /api/media/:id  (admin) — update alt text
router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM media WHERE id=?').get(id);
  if (!row) return fail(res, 'Media not found.', 404);
  db.prepare('UPDATE media SET alt_text=? WHERE id=?').run((req.body.alt_text || row.alt_text), id);
  ok(res, publicMedia(db.prepare('SELECT * FROM media WHERE id=?').get(id)));
});

// DELETE /api/media/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM media WHERE id=?').get(id);
  if (!row) return fail(res, 'Media not found.', 404);
  // Remove the physical file if it exists (best-effort).
  const abs = path.join(UPLOAD_ROOT, path.basename(row.path));
  try { if (fs.existsSync(abs)) fs.unlinkSync(abs); } catch (e) {}
  db.prepare('DELETE FROM media WHERE id=?').run(id);
  ok(res, { deleted: true });
});

module.exports = router;
