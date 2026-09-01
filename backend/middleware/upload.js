'use strict';
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const MAX_MB = parseInt(process.env.MAX_UPLOAD_MB || '12', 10);
const UPLOAD_ROOT = path.resolve(__dirname, '..', 'uploads');

fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_ROOT),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]+/gi, '-');
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${base || 'file'}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => {
    const okTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'image/avif', 'video/mp4', 'video/webm', 'application/pdf',
      'text/plain', 'application/zip', 'application/json'
    ];
    if (okTypes.includes(file.mimetype)) return cb(null, true);
    cb(new Error(`File type ${file.mimetype} is not allowed.`));
  }
});

module.exports = { upload, UPLOAD_ROOT, MAX_MB };
