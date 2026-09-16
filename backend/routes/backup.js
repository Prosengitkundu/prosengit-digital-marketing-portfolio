'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const { ok } = require('../utils/helpers');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/backup  (admin) — download a full SQL dump (snapshot backup)
router.get('/export', requireAuth, (req, res) => {
  const tables = [
    'users', 'site_settings', 'pages', 'page_sections', 'services',
    'projects', 'project_images', 'testimonials', 'blog_posts',
    'blog_categories', 'media', 'contact_messages', 'navigation', 'seo_settings'
  ];

  let dump = '-- Prosengit CMS backup\n-- Generated: ' + new Date().toISOString() + '\n';
  dump += '-- NOTE: passwords are bcrypt hashes. Restore by importing this SQL into a fresh DB.\n\n';
  dump += 'PRAGMA foreign_keys = OFF;\nBEGIN TRANSACTION;\n\n';

  for (const t of tables) {
    const cols = db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
    if (!cols.length) continue;
    const rows = db.prepare(`SELECT * FROM ${t}`).all();
    // DDL
    const create = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(t);
    if (create && create.sql) dump += create.sql + ';\n\n';
    for (const row of rows) {
      const vals = cols.map((c) => {
        const v = row[c];
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'number') return String(v);
        return "'" + String(v).replace(/'/g, "''") + "'";
      });
      dump += `INSERT INTO ${t} (${cols.join(',')}) VALUES (${vals.join(',')});\n`;
    }
    dump += '\n';
  }

  dump += 'COMMIT;\nPRAGMA foreign_keys = ON;\n';

  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="prosengit-cms-backup-' + new Date().toISOString().slice(0, 10) + '.sql"');
  res.send(dump);
});

// GET /api/backup/status  (admin) — DB size + last write
router.get('/status', requireAuth, (req, res) => {
  const dbPath = process.env.DB_PATH && !path.isAbsolute(process.env.DB_PATH)
    ? path.join(__dirname, '..', process.env.DB_PATH)
    : require('../db').DB_PATH;
  let size = 0;
  try { size = fs.statSync(require('../db').ABS_DB_PATH).size; } catch (e) {}
  ok(res, {
    size_bytes: size,
    size_kb: Math.round(size / 1024),
    tables: db.prepare("SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").get().c
  });
});

module.exports = router;
