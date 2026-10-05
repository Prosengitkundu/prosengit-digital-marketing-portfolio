'use strict';

const fs = require('fs');
const path = require('path');

/* Repository root — the static site served by this app. */
const SITE_ROOT = path.resolve(__dirname, '..', '..');

/** Standard success response */
function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

/** Standard error response */
function fail(res, message, status = 400, errors = null) {
  const body = { success: false, error: message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
}

/** Resolve a public URL for a stored path.
 *  Local paths (e.g. "/uploads/x.png", "assets/img.jpg") are returned as
 *  same-origin-relative so they work on any host (local, preview, prod).
 *  External http(s)/data URLs are returned unchanged. */
function absoluteUrl(p, base) {
  if (!p) return '';
  if (/^(https?:)?\/\//i.test(p) || p.startsWith('data:')) return p;
  // Keep local references relative — the browser resolves them against the host
  // that served the page, which is always correct for a same-origin deployment.
  if (!p.startsWith('/')) return '/' + p;
  return p;
}

/** Normalise a stored page URL to the site's clean, extension-less format.
 *  Public pages are served as /about, /blog/<slug>, /portfolio/<slug>, so a
 *  legacy value such as "/about.html" (typed in admin, or stored before the
 *  URL migration) must not be published back to the site. External links are
 *  returned untouched, and an empty value falls back to `fallback`. */
function cleanPageUrl(url, fallback = '') {
  const value = String(url == null ? '' : url).trim() || fallback;
  if (!value) return '';
  if (/^(https?:)?\/\//i.test(value)) return value; // external link — leave as-is
  return value
    .replace(/\/index\.html?$/i, '/')
    .replace(/\.html?$/i, '');
}

/** True when the generated static page for a clean URL exists on disk.
 *  Used to decide whether a content record can link to its own static page
 *  (e.g. /blog/<slug>) or must fall back to the ?id= template page. */
function staticPageExists(cleanPath) {
  if (!cleanPath || cleanPath.charAt(0) !== '/') return false;
  const abs = path.join(SITE_ROOT, cleanPath);
  try {
    return fs.existsSync(abs + '.html') && fs.statSync(abs + '.html').isFile();
  } catch (err) {
    return false;
  }
}

/** Safe JSON.parse with fallback */
function parseJson(s, fallback) {
  if (!s) return fallback;
  try { return JSON.parse(s); } catch (e) { return fallback; }
}

/** Build a unique slug from a title (appends a suffix if needed). */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = { ok, fail, absoluteUrl, cleanPageUrl, staticPageExists, parseJson, slugify };
