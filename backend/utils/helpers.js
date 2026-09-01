'use strict';

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

module.exports = { ok, fail, absoluteUrl, parseJson, slugify };
