'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function validateMessage(b) {
  const errs = [];
  if (!b.name || !String(b.name).trim()) errs.push('Name is required.');
  if (!b.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(b.email))) errs.push('A valid email is required.');
  return errs;
}

// POST /api/contact  (public) — save a contact-form submission
router.post('/', (req, res) => {
  const b = req.body || {};
  const errs = validateMessage(b);
  if (errs.length) return fail(res, 'Please fix the highlighted fields.', 400, errs);

  const info = db.prepare(`
    INSERT INTO contact_messages (name, email, phone, company, service, subject, message, status)
    VALUES (?,?,?,?,?,?,?, 'new')
  `).run(
    String(b.name).trim(), String(b.email).trim(),
    b.phone || '', b.company || '', b.service || '',
    b.subject || '', b.message || ''
  );

  // Optional email notification (only if SMTP is configured).
  try { notifyEmail(b); } catch (e) { /* never block a successful save on email failure */ }

  ok(res, { id: info.lastInsertRowid, message: 'Thanks! Your message has been received.' }, 201);
});

function notifyEmail(b) {
  if (!process.env.SMTP_HOST || !process.env.MAIL_TO) return;
  // Kept intentionally dependency-free: if you want real mail, plug in nodemailer
  // here. The CMS still stores the message regardless.
}

// --- Admin ---

// GET /api/contact  (admin)
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC').all();
  ok(res, rows);
});

// GET /api/contact/recent  (admin) — for dashboard
router.get('/recent', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 5').all();
  ok(res, rows);
});

// GET /api/contact/counts  (admin)
router.get('/counts', requireAuth, (req, res) => {
  const c = db.prepare("SELECT COUNT(*) c, SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) new_count FROM contact_messages").get();
  ok(res, { total: c.c, new: c.new_count || 0 });
});

// PUT /api/contact/:id/status  (admin)
router.put('/:id/status', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM contact_messages WHERE id=?').get(id);
  if (!row) return fail(res, 'Message not found.', 404);
  const status = (req.body.status || 'new');
  const allowed = ['new', 'read', 'replied', 'archived'];
  if (!allowed.includes(status)) return fail(res, 'Invalid status. Use new/read/replied/archived.');
  db.prepare("UPDATE contact_messages SET status=?, updated_at=datetime('now') WHERE id=?").run(status, id);
  ok(res, db.prepare('SELECT * FROM contact_messages WHERE id=?').get(id));
});

// DELETE /api/contact/:id  (admin)
router.delete('/:id', requireAuth, (req, res) => {
  const info = db.prepare('DELETE FROM contact_messages WHERE id=?').run(Number(req.params.id));
  if (info.changes === 0) return fail(res, 'Message not found.', 404);
  ok(res, { deleted: true });
});

module.exports = router;
