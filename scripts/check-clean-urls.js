#!/usr/bin/env node
/* ===========================================================================
   CLEAN-URL / INTERNAL-LINK CHECKER
   ---------------------------------------------------------------------------
   Verifies the migrated URL structure without needing a server:

     1. No public page link in the site HTML still exposes ".html".
     2. Every internal link/URL resolves to a real file, using the same
        extension-less resolution GitHub Pages performs for clean URLs
        (/about → about.html, /blog/<slug> → blog/<slug>.html).
     3. No duplicate or missing canonical URLs on public pages.
     4. Every <loc> in sitemap.xml resolves and contains no ".html".
     5. robots.txt and the sitemap only reference clean URLs.

   Run after editing pages, articles.js or projects.js:

       node scripts/check-clean-urls.js

   Exit code 0 = clean, 1 = problems found.
   =========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://prosengitkundu.top';

const errors = [];
const warnings = [];

/* Files that are reviewed by the checker. */
const htmlPages = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => f),
  ...fs.readdirSync(path.join(ROOT, 'blog')).filter((f) => f.endsWith('.html')).map((f) => `blog/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'portfolio')).filter((f) => f.endsWith('.html')).map((f) => `portfolio/${f}`)
];

/* Utility pages that intentionally carry no canonical (both are noindex). */
const NO_CANONICAL_OK = new Set(['404.html', 'thank-you.html']);

/* Resolve a site URL to the file GitHub Pages would serve for it. */
function resolveToFile(url) {
  const clean = url.split('#')[0].split('?')[0];
  let target = clean;

  if (/^https?:\/\//i.test(target)) {
    if (target.indexOf('prosengitkundu.top') === -1) return { external: true };
    target = target.replace(/^https?:\/\/[^/]+/i, '');
  }
  if (!target.startsWith('/')) return null; // relative links are resolved by the caller

  if (target === '/') return 'index.html';
  if (target.endsWith('/')) return path.join(target, 'index.html');

  const direct = path.join(ROOT, target);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return target.slice(1);
  if (!path.extname(target) && fs.existsSync(direct + '.html')) return target.slice(1) + '.html';
  return target.slice(1); // report the intended path for the error message
}

function exists(relFile) {
  const abs = path.join(ROOT, relFile);
  return fs.existsSync(abs) && fs.statSync(abs).isFile();
}

/* ---------------------------------------------------------------------------
   1 + 2. Page links: no ".html", every target must exist
--------------------------------------------------------------------------- */
const HREF_RE = /\s(?:href|action)=["']([^"']+)["']/gi;
const SRC_RE = /\ssrc=["']([^"']+)["']/gi;
const ASSET_RE = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|css|js|json|xml|txt|zip|mp4|webm|mp3|wav|woff2?|ttf|eot|webmanifest)$/i;

let linkCount = 0;

for (const page of htmlPages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const pageDir = path.dirname(path.join(ROOT, page));

  for (const re of [HREF_RE, SRC_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html))) {
      const raw = m[1].trim();
      if (!raw || raw.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) continue;
      if (raw.includes('${') || raw.includes('{{')) continue; // template expression

      // Legacy extension-less entry in an href → must not be a public page link
      if (re === HREF_RE && /\.html?($|[?#])/i.test(raw)) {
        const isLocalTemplate = /^(blog-details|portfolio-details)\.html/i.test(raw);
        errors.push(`${page}: link still exposes .html → ${raw}` + (isLocalTemplate ? ' (legacy ?id= fallback — should use the clean path)' : ''));
      }

      if (ASSET_RE.test(raw.split('#')[0].split('?')[0])) continue; // asset, not a page
      if (/^https?:\/\//i.test(raw) && raw.indexOf('prosengitkundu.top') === -1) continue; // external

      linkCount++;
      // Same-site absolute URLs are treated as root-relative paths.
      const localised = raw.replace(/^https?:\/\/(?:www\.)?prosengitkundu\.top/i, '');
      let relFile;
      if (localised.startsWith('/')) {
        relFile = resolveToFile(localised);
      } else {
        const resolved = path.resolve(pageDir, localised.split('#')[0].split('?')[0]);
        relFile = path.relative(ROOT, resolved);
      }
      if (relFile && relFile.external) continue;
      if (!exists(relFile)) {
        errors.push(`${page}: broken internal link → ${raw} (expected file: ${relFile})`);
      }
    }
  }
}

/* ---------------------------------------------------------------------------
   3. Canonical URLs
--------------------------------------------------------------------------- */
for (const page of htmlPages) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const found = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi)].map((m) => m[1]);

  if (!found.length) {
    if (!NO_CANONICAL_OK.has(page)) errors.push(`${page}: missing canonical URL`);
    continue;
  }
  if (found.length > 1) errors.push(`${page}: ${found.length} canonical URLs declared (duplicate)`);
  if (/\.html?($|[?#])/i.test(found[0])) errors.push(`${page}: canonical still contains .html → ${found[0]}`);

  const expected = page === 'index.html' ? `${SITE}/` : `${SITE}/${page.replace(/\.html$/, '')}`;
  if (found[0] !== expected) warnings.push(`${page}: canonical is ${found[0]} (expected ${expected})`);
}

/* ---------------------------------------------------------------------------
   4. Sitemap
--------------------------------------------------------------------------- */
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const seen = new Set();
for (const loc of locs) {
  if (/\.html?($|[?#])/i.test(loc)) errors.push(`sitemap.xml: .html URL → ${loc}`);
  if (seen.has(loc)) errors.push(`sitemap.xml: duplicate entry → ${loc}`);
  seen.add(loc);
  const relFile = resolveToFile(loc);
  if (relFile && relFile.external) errors.push(`sitemap.xml: unexpected external host → ${loc}`);
  else if (!exists(relFile)) errors.push(`sitemap.xml: ${loc} does not resolve to a file (${relFile})`);
}
if (!sitemap.startsWith('<?xml')) warnings.push('sitemap.xml: unexpected header');

/* ---------------------------------------------------------------------------
   4b. Client-rendered links: articles.js, projects.js, chatbot.js
--------------------------------------------------------------------------- */
function loadJsArray(file, varName) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8').replace(`const ${varName}`, `var ${varName}`);
  // eslint-disable-next-line no-new-func
  return new Function(`${src}; return ${varName};`)();
}

function checkDataUrl(origin, url) {
  const value = String(url || '').trim();
  if (!value || !value.startsWith('/')) return;
  if (/\.html?($|[?#])/i.test(value)) errors.push(`${origin}: public URL still ends in .html → ${value}`);
  const relFile = resolveToFile(value);
  if (relFile && !relFile.external && !exists(relFile)) {
    errors.push(`${origin}: URL does not resolve to a file → ${value} (expected ${relFile})`);
  }
}

loadJsArray('assets/js/articles.js', 'ARTICLES').forEach((a) => {
  checkDataUrl('articles.js', a.url);
});
loadJsArray('assets/js/projects.js', 'PROJECTS').forEach((p) => {
  checkDataUrl('projects.js', p.url);
});

/* chatbot.js builds its links from string literals — check every internal one */
const chatbot = fs.readFileSync(path.join(ROOT, 'assets/js/chatbot.js'), 'utf8');
for (const m of chatbot.matchAll(/['"](\/[A-Za-z0-9_\-/.#?=&%]*)['"]/g)) {
  checkDataUrl('chatbot.js', m[1]);
}

/* ---------------------------------------------------------------------------
   5. robots.txt
--------------------------------------------------------------------------- */
const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
for (const line of robots.split('\n')) {
  const m = /^\s*(Disallow|Allow)\s*:\s*(\S+)/i.exec(line);
  if (m && /\.html?($|[?#])/i.test(m[2]) ) {
    errors.push(`robots.txt: rule still targets a .html URL → ${line.trim()}`);
  }
  const s = /^\s*Sitemap\s*:\s*(\S+)/i.exec(line);
  if (s && !/^https:\/\/prosengitkundu\.top\/sitemap\.xml$/.test(s[1])) {
    warnings.push(`robots.txt: unexpected sitemap URL → ${s[1]}`);
  }
}

/* ---------------------------------------------------------------------------
   Report
--------------------------------------------------------------------------- */
console.log(`Checked ${htmlPages.length} pages, ${linkCount} internal links, ${locs.length} sitemap URLs.\n`);
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  warnings.forEach((w) => console.log('  ! ' + w));
  console.log('');
}
if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  errors.forEach((e) => console.log('  ✖ ' + e));
  process.exit(1);
}
console.log('✔ All clean URLs resolve, no .html page URLs, canonicals and sitemap consistent.');
