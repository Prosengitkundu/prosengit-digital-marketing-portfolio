'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { ok, fail } = require('../utils/helpers');
const { requireAuth, loginSession } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Limit login attempts to slow down brute-force attacks.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Try again later.' }
});

// POST /api/auth/login
router.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return fail(res, 'Username and password are required.');

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(String(username).trim());
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return fail(res, 'Invalid username or password.', 401);
  }

  loginSession(req, user);
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
  return ok(res, {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return ok(res, req.session.user);
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return fail(res, 'Could not log out.', 500);
    res.clearCookie('pk_cms_sid');
    return ok(res, { loggedOut: true });
  });
});

module.exports = router;
