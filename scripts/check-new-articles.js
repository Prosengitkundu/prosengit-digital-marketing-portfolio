#!/usr/bin/env node
'use strict';
// Release checks for the thirty long-form articles. Does not replace editorial
// review or a browser/live deployment check.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const articles = vm.runInNewContext(read('assets/js/articles.js') + '\nARTICLES');
const fresh = articles.filter(a => a.originalLongform);
const sitemap = read('sitemap.xml');
const listing = read('blog.html');
const errors = [];
function check(ok, message) { if (!ok) errors.push(message); }
function decode(s) { return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }
function attr(html, pattern) { const match = html.match(pattern); return match ? decode(match[1]) : ''; }
check(fresh.length === 30, `Expected 30 articles, found ${fresh.length}`);
check(articles.length === 58, `Expected 58 total articles, found ${articles.length}`);
for (const key of ['slug', 'title', 'keyword', 'seoTitle', 'excerpt', 'img']) {
  check(new Set(fresh.map(a => a[key])).size === 30, `${key} missing or duplicated`);
}
for (const a of fresh) {
  const file = `blog/${a.slug}.html`;
  if (!fs.existsSync(path.join(root, file))) { errors.push(`${file}: missing`); continue; }
  const html = read(file), url = 'https://prosengitkundu.top' + a.url;
  check(a.wordCount >= 2500, `${a.slug}: recorded body count below 2500`);
  check(attr(html, /<title>([^<]+)<\/title>/) === a.seoTitle, `${a.slug}: title`);
  check(attr(html, /<meta name="description" content="([^"]*)"/) === a.excerpt, `${a.slug}: description`);
  check(attr(html, /<link rel="canonical" href="([^"]*)"/) === url, `${a.slug}: canonical`);
  check(attr(html, /<meta property="og:url" content="([^"]*)"/) === url, `${a.slug}: og:url`);
  check(attr(html, /<meta property="og:image" content="([^"]*)"/) === 'https://prosengitkundu.top/' + a.img, `${a.slug}: og:image`);
  check(/<meta name="robots" content="index, follow"/.test(html), `${a.slug}: robots`);
  check(html.includes(`alt="${a.alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`), `${a.slug}: alt`);
  check(fs.existsSync(path.join(root, a.img)), `${a.slug}: image missing`);
  check(sitemap.includes(`<loc>${url}</loc>`), `${a.slug}: sitemap missing`);
  check(listing.includes(`href="${a.url}"`), `${a.slug}: static listing missing`);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  try {
    const schemas = scripts.map(x => JSON.parse(x[1]));
    check(schemas.some(s => s['@type'] === 'Article' && s.headline === a.title && s.author.name === 'Prosengit Kundu' && s.mainEntityOfPage['@id'] === url && s.image === 'https://prosengitkundu.top/' + a.img), `${a.slug}: Article schema`);
  } catch (e) { errors.push(`${a.slug}: invalid JSON-LD (${e.message})`); }
  const body = html.split('<div id="a-body"')[1]?.split('</div>')[0] || '';
  const beforeFaq = body.split(/<h2[^>]*>Frequently asked questions<\/h2>/i)[0];
  const plain = decode(beforeFaq.replace(/<[^>]+>/g, ' '));
  const words = (plain.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
  // HTML contains headings, so this is only a lower bound check alongside the
  // recorded source-body count (which excludes headings and FAQs).
  check(words >= 2500, `${a.slug}: rendered pre-FAQ content too short`);
  const faqPart = body.split(/<h2[^>]*>Frequently asked questions<\/h2>/i)[1]?.split(/<h2[^>]*>/i)[0] || '';
  const faqCount = (faqPart.match(/<h3>/g) || []).length;
  check(faqCount >= 4 && faqCount <= 6, `${a.slug}: ${faqCount} FAQs`);
}
console.log(`Checked ${fresh.length} new articles, metadata, image paths, schema, FAQ sections, listing and sitemap.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('All checks passed.');
