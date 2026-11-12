#!/usr/bin/env node
// Render the existing card markup into the blog shell for non-JavaScript clients.
// Re-run after changing assets/js/articles.js; normal filtering still replaces it.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/articles.js'), 'utf8');
const articles = vm.runInNewContext(source + '\nARTICLES;');
if (!Array.isArray(articles) || !articles.length) throw new Error('No articles to render');
const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(a, featured = false) {
  if (!/^\/blog\/[a-z0-9-]+$/.test(a.url)) throw new Error('Invalid article URL: ' + a.url);
  return `<a href="${esc(a.url)}" class="blog-card ${featured ? 'md:col-span-2 lg:col-span-3 grid md:grid-cols-2' : ''} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden rounded-3xl block group">
                <img src="${esc(a.img)}" alt="${esc(a.alt || `${a.title} — article cover`)}" class="w-full ${featured ? 'h-full min-h-[260px]' : 'aspect-[16/9]'} object-cover" width="900" height="520" loading="lazy" decoding="async">
                <div class="p-7">
                    <div class="flex flex-wrap gap-3 items-center text-xs"><span class="font-semibold text-[#0A66C2] bg-blue-50 dark:bg-gray-900 px-3 py-1 rounded-full">${esc(a.cat)}</span><span class="text-gray-400">${esc(a.date)}</span><span class="text-gray-400">·</span><span class="text-gray-400">${esc(a.read)}</span></div>
                    <div class="font-bold ${featured ? 'text-2xl md:text-3xl' : 'text-xl'} mt-4 leading-tight group-hover:text-[#0A66C2] transition-colors">${esc(a.title)}</div>
                    <div class="text-sm mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">${esc(a.excerpt)}</div>
                    <div class="mt-6 text-sm font-semibold text-[#0A66C2]">Read Full Article →</div>
                </div>
            </a>`;
}
const file = path.join(root, 'blog.html');
let html = fs.readFileSync(file, 'utf8');
const start = '<!-- BLOG INDEX STATIC START -->';
const end = '<!-- BLOG INDEX STATIC END -->';
const replacement = `${start}\n    <div class="max-w-screen-2xl mx-auto px-8" id="featured-wrap"><div class="text-xs tracking-[3px] font-semibold text-[#F59E0B] mb-4">FEATURED ARTICLE</div><div class="grid gap-6">${card(articles[0], true)}</div></div>\n\n    <div class="max-w-screen-2xl mx-auto px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-grid">\n        ${articles.slice(1).map(a => card(a)).join('\n        ')}\n    </div>\n    ${end}`;
if (html.includes(start)) {
  const i = html.indexOf(start), j = html.indexOf(end, i);
  if (j < 0) throw new Error('Missing blog index end marker');
  html = html.slice(0, i) + replacement + html.slice(j + end.length);
} else {
  const original = /<!-- Featured article -->\s*<div class="max-w-screen-2xl mx-auto px-8" id="featured-wrap"><\/div>\s*<div class="max-w-screen-2xl mx-auto px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-grid">\s*<!-- Populated by JS -->\s*<\/div>/;
  if (!original.test(html)) throw new Error('Blog index template not found');
  html = html.replace(original, replacement);
}
html = html.replace(/(<p class="text-sm text-gray-500 mt-4" id="result-count">)[^<]*(<\/p>)/, `$1Showing ${articles.length} articles$2`);
fs.writeFileSync(file, html);
console.log(`Rendered ${articles.length} existing article cards.`);
