'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function listNav() {
  return db.prepare(`
    SELECT id, label, url, position, parent_id, active
    FROM navigation ORDER BY position ASC, id ASC
  `).all();
}

// GET /api/navigation  (public) — active items only
router.get('/', (req, res) => {
  const items = db.prepare(`
    SELECT id, label, url, position, parent_id
    FROM navigation WHERE active = 1 ORDER BY position ASC, id ASC
  `).all();
  ok(res, items);
});

// GET /api/navigation/full  (admin)
router.get('/full', requireAuth, (req, res) => ok(res, listNav()));

// POST /api/navigation  (admin)
router.post('/', requireAuth, (req, res) => {
  const { label, url, position, parent_id, active } = req.body || {};
  if (!label) return fail(res, 'Label is required.');
  const nextPos = position != null ? position : (db.prepare('SELECT COALESCE(MAX(position),0)+1 AS p FROM navigation').get().p);
  const info = db.prepare(
    'INSERT INTO navigation (label, url, position, parent_id, active) VALUES (?,?,?,?,?)'
  ).run(String(label), String(url || '#'), nextPos, parent_id || null, active != null ? (active ? 1 : 0) : 1);
  const item = db.prepare('SELECT * FROM navigation WHERE id=?').get(info.lastInsertRowid);
  ok(res, item, 201);
});

// PUT /api/navigation/:id  (admin)
router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const item = db.prepare('SELECT * FROM navigation WHERE id=?').get(id);
  if (!item) return fail(res, 'Navigation item not found.', 404);
  const { label, url, position, parent_id, active } = req.body || {};
  db.prepare(`
    UPDATE navigation SET label=?, url=?, position=?, parent_id=?, active=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    label != null ? String(label) : item.label,
    url != null ? String(url) : item.url,
    position != null ? Number(position) : item.position,
    parent_id !== undefined ? (parent_id || null) : item.parent_id,
    active != null ? (active ? 1 : 0) : item.active,
    id
  );
  ok(res, db.prepare('SELECT * FROM navigation WHERE id=?').get(id));
});

// DELETE /api/navigation/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM navigation WHERE id=?').run(Number(req.params.id));
  if (info.changes === 0) return fail(res, 'Navigation item not found.', 404);
  ok(res, { deleted: true });
});

// PUT /api/navigation/reorder  (admin) — expects array of { id, position }
router.put('/reorder/apply', requireAuth, (req, res) => {
  const items = req.body && req.body.items;
  if (!Array.isArray(items)) return fail(res, 'Expected { items: [{id, position}] }');
  const upd = db.prepare('UPDATE navigation SET position=? WHERE id=?');
  for (const it of items) {
    if (!it || it.id == null) continue;
    upd.run(Number(it.position || 0), Number(it.id));
  }
  ok(res, listNav());
});

module.exports = router;
