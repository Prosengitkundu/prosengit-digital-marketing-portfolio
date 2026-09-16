'use strict';
const express = require('express');
const { db } = require('../db');
const { ok, fail, parseJson, absoluteUrl } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const SITE_URL = process.env.SITE_URL || '';

function getSettingsMap() {
  const rows = db.prepare('SELECT key, value, type FROM site_settings').all();
  const map = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

// GET /api/settings  (public) — expose only what the frontend needs
router.get('/', (req, res) => {
  const s = getSettingsMap();
  const response = {
    site_name: s.site_name || '',
    site_tagline: s.site_tagline || '',
    site_title: s.site_title || '',
    logo: s.logo || '',
    logo_text: s.logo_text || '',
    favicon: s.favicon || '',
    email: s.email || '',
    phone: s.phone || '',
    phone_href: s.phone_href || '',
    whatsapp: s.whatsapp || '',
    location: s.location || '',
    address: s.address || '',
    instagram: s.instagram || '',
    twitter: s.twitter || '',
    linkedin: s.linkedin || '',
    facebook: s.facebook || '',
    youtube: s.youtube || '',
    copyright: s.copyright || '',
    availability_text: s.availability_text || '',
    footer_about: s.footer_about || ''
  };
  // Return same-origin paths so images/favicons resolve on any host; if the
  // admin stores an external http(s) URL it is returned unchanged by the helper.
  response.logo = absoluteUrl(response.logo);
  response.favicon = absoluteUrl(response.favicon);
  ok(res, response);
});

// GET /api/settings/full  (admin) — all settings keys
router.get('/full', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT key, value, type, updated_at FROM site_settings ORDER BY key').all();
  ok(res, rows);
});

// PUT /api/settings  (admin) — bulk upsert by key
router.put('/', requireAuth, (req, res) => {
  const body = req.body || {};
  const allowed = Object.keys(body).filter((k) => body[k] !== undefined);
  if (!allowed.length) return fail(res, 'No settings provided.');

  const upsert = db.prepare(`
    INSERT INTO site_settings (key, value, type, updated_at)
    VALUES (?,?, CASE WHEN ? IN ('logo','favicon','og_image') THEN 'image' ELSE 'text' END, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
  `);
  for (const k of allowed) upsert.run(k, String(body[k] ?? ''));
  ok(res, { updated: allowed });
});

module.exports = router;
