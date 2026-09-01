/* ===========================================================================
   create-admin.js — Create or update an admin user from the CLI/env
   ---------------------------------------------------------------------------
   Usage:
     node scripts/create-admin.js                     # uses ADMIN_USERNAME / ADMIN_PASSWORD from .env
     node scripts/create-admin.js myuser 'MyPass123'  # explicit (password NOT stored in shell history on most systems)
   =========================================================================== */
'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db } = require('../db');

const username = process.argv[2] || process.env.ADMIN_USERNAME || 'admin';
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'Admin@1234';
const name = process.argv[4] || process.env.ADMIN_NAME || 'Site Administrator';

if (password.length < 8) {
  console.error('Password must be at least 8 characters long.');
  process.exit(1);
}

const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
const hash = bcrypt.hashSync(password, 12);
if (existing) {
  db.prepare('UPDATE users SET password_hash = ?, name = ? WHERE id = ?').run(hash, name, existing.id);
  console.log(`✓ Updated admin user "${username}".`);
} else {
  db.prepare('INSERT INTO users (username, password_hash, name, role) VALUES (?,?,?,?)')
    .run(username, hash, name, 'admin');
  console.log(`✓ Created admin user "${username}".`);
}
console.log('You can now log in at /admin/login');
