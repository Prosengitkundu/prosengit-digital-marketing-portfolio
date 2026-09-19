#!/usr/bin/env node
/* ===========================================================================
   STATIC PAGE GENERATOR — crawlable blog articles & portfolio case studies
   ---------------------------------------------------------------------------
   Problem solved: blog-details.html?id=N and portfolio-details.html?id=N
   rendered content only via JavaScript (invisible to non-JS crawlers, shared
   generic metadata, missing from sitemap).

   This script generates fully static HTML pages:
     /blog/<slug>.html        (28 articles, from assets/js/articles.js)
     /portfolio/<slug>.html   (12 case studies, from assets/js/projects.js)

   Each generated page contains: complete content in raw HTML, unique
   <title>, meta description, canonical, Open Graph, Twitter Card and
   Article JSON-LD. Same header/footer/design system as the rest of the site.

   Regenerate after editing articles.js / projects.js:
     node scripts/generate-static-pages.js
   =========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://prosengitkundu.top';

/* ---------------- load data (files use `const ARTICLES` / `const PROJECTS`) */
function loadData(file, varname) {
  let src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  src = src.replace(`const ${varname}`, `var ${varname}`);
  eval(src + `\n;globalThis.__D = ${varname};`);
  return globalThis.__D;
}
const ARTICLES = loadData('assets/js/articles.js', 'ARTICLES');
const PROJECTS = loadData('assets/js/projects.js', 'PROJECTS');
/* Editorial case-study context is stored separately from the structured card
   data so the listing remains lightweight while regeneration stays lossless. */
const PORTFOLIO_EXPANSIONS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'assets/data/portfolio-expansions.json'), 'utf8')
);

/* ---------------- template parts (reuse the real pages so design is identical) */
function extractParts(templateFile, ctaStart) {
  const src = fs.readFileSync(path.join(ROOT, templateFile), 'utf8');
  const headEnd = src.indexOf('</header>') + '</header>'.length;
  let prologue = src.slice(0, headEnd);
  const footStart = src.indexOf('<footer class="site-footer">');
  let footer = src.slice(ctaStart ? src.indexOf(ctaStart, headEnd) : footStart);
  // drop legacy inline data/render scripts from the tail; keep the closing tags
  const cut = footer.indexOf('<script src="assets/js/articles.js"></script>');
  const cut2 = footer.indexOf('<script src="assets/js/projects.js"></script>');
  const cutAt = Math.min(cut === -1 ? Infinity : cut, cut2 === -1 ? Infinity : cut2);
  if (cutAt !== Infinity) footer = footer.slice(0, cutAt).trimEnd() + '\n</body>\n</html>\n';
  return { prologue, footer };
}
const BLOG = extractParts('blog-details.html');
const CASE = extractParts('portfolio-details.html', '<section class="bg-[#0A66C2]');

/* ---------------- helpers ---------------- */
const MONTHS = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12 };
function isoDate(d) {
  const m = d.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return '2026-09-17';
  return `${m[3]}-${String(MONTHS[m[1].slice(0,3).toLowerCase()]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;
}
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const absImg = img => /^https?:/.test(img) ? img : `${SITE}/${img.replace(/^\.\//,'')}`;

/* Make every relative href/src root-absolute (pages live one level deep). */
function absolutize(html) {
  return html
    .replace(/(href|src)="assets\//g, '$1="/assets/')
    .replace(/href="((?:index|about|team|services|pricing|portfolio|blog|testimonials|faq|contact|privacy-policy|terms|disclaimer|404|thank-you|team-eitykona|team-nilanjana|team-sarna|team-shamim|team-priyanka)\.html)/g, 'href="/$1')
    .replace(/href="(portfolio-details|blog-details)\.html/g, 'href="/$1.html');
}

/* Per-page head rewrite */
function setHead(prologue, { title, description, url, image, type, extraHead }) {
  let h = prologue;
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${esc(description)}"`);
  /* Published blog articles and portfolio case studies are real, indexable
     content pages — always force index,follow here regardless of what the
     noindex fallback template (blog-details.html / portfolio-details.html,
     which stay noindex because they only render via query-string + JS) says. */
  h = h.replace(/<meta name="robots" content="[^"]*"/, `<meta name="robots" content="index, follow"`);
  h = h.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${type}"`);
  h = h.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  h = h.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${esc(title)}"`);
  h = h.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${esc(description)}"`);
  h = h.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${absImg(image)}"`);
  h = h.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${url}"`);
  h = h.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${esc(title)}"`);
  h = h.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${esc(description)}"`);
  h = h.replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${absImg(image)}"`);
  h = h.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  h = h.replace('</head>', `${extraHead}\n</head>`);
  return h;
}

const personRef = { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Prosengit Kundu', url: `${SITE}/` };
const breadcrumbs = (section, title, url) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: section, item: `${SITE}/${section.toLowerCase()}.html` },
    { '@type': 'ListItem', position: 3, name: title, item: url }
  ]
});
const articleSchema = (a, url) => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: a.title, description: a.excerpt,
  image: absImg(a.img), datePublished: isoDate(a.date), dateModified: isoDate(a.date),
  inLanguage: 'en', author: personRef, publisher: personRef,
  mainEntityOfPage: { '@type': 'WebPage', '@id': url }
})}</script>\n<script type="application/ld+json">${JSON.stringify(breadcrumbs('Blog', a.title, url))}</script>`;

const projectSchema = (p, url) => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title,
  description: p.focus, about: p.industry, image: absImg(p.image), url,
  creator: personRef, mainEntityOfPage: url, inLanguage: 'en'
})}</script>\n<script type="application/ld+json">${JSON.stringify(breadcrumbs('Portfolio', p.title, url))}</script>`;

/* ---------------- article body processing (static TOC ids) ---------------- */
function processBody(html) {
  const h2s = [];
  const out = html.replace(/<h2>(.*?)<\/h2>/g, (m, t) => { h2s.push(t); return `<h2 id="s-${h2s.length-1}">${t}</h2>`; });
  return { out, h2s };
}

/* ---------------- generate articles ---------------- */
fs.mkdirSync(path.join(ROOT, 'blog'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'portfolio'), { recursive: true });

ARTICLES.forEach((a, i) => {
  const url = `${SITE}/blog/${a.slug}.html`;
  const { out: body, h2s } = processBody(a.body.trim());
  const prev = ARTICLES[i-1], next = ARTICLES[i+1];
  const related = ARTICLES.filter(r => r.cat === a.cat && r.id !== a.id).slice(0, 3);

  const tocHtml = h2s.length
    ? h2s.map((t, k) => `<a href="#s-${k}">${esc(t)}</a>`).join('\n                    ')
    : '<p class="text-sm text-gray-400">Article sections listed here.</p>';

  const relatedHtml = related.length ? related.map(r => `
            <a href="${r.url}" class="block group">
                <div class="text-xs font-semibold text-[#0A66C2]">${r.cat}</div>
                <div class="font-semibold text-sm mt-1 group-hover:text-[#0A66C2] leading-snug">${r.title}</div>
                <div class="text-xs text-gray-400 mt-1">${r.read}</div>
            </a>`).join('') : '<p class="text-sm text-gray-400">Explore other categories for more guides.</p>';

  const main = `
    <div class="max-w-7xl mx-auto px-8 pt-16 pb-20">
        <a href="/blog.html" class="text-sm font-semibold text-[#0A66C2]">← Back to All Articles</a>
        <div class="grid lg:grid-cols-12 gap-12 mt-8">
            <article class="lg:col-span-8">
                <div id="article-content">
                    <div class="flex flex-wrap gap-3 items-center text-xs font-semibold"><span class="text-[#0A66C2] bg-blue-50 dark:bg-gray-900 px-3 py-1 rounded-full">${a.cat}</span><span class="text-gray-400">${a.date}</span><span class="text-gray-400">·</span><span class="text-gray-400">${a.read}</span></div>
                    <h1 class="text-4xl md:text-5xl heading-font tracking-tighter font-bold mt-5 leading-[1.1]">${esc(a.title)}</h1>
                    <p class="text-lg text-gray-600 dark:text-gray-300 mt-5 leading-relaxed">${esc(a.excerpt)}</p>
                    <img src="${/^https?:/.test(a.img) ? a.img : `/${a.img.replace(/^\.\//, '')}`}" alt="${esc(a.title)} — illustrated article cover" class="w-full aspect-[16/9] object-cover rounded-3xl mt-10" width="1200" height="680" fetchpriority="high">
                    <div id="a-body" class="article-body mt-10">
${body}
                    </div>
                    <div class="mt-14 p-7 md:p-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl">
                        <h2 class="text-2xl heading-font font-bold">Work With Me</h2>
                        <p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">Enjoyed this guide? I provide freelance SEO, international SEO, custom HTML/CSS/JavaScript web development, Google &amp; Meta Ads management, B2B lead generation and complete digital growth plans — for clients in Bangladesh and remotely worldwide.</p>
                        <div class="flex flex-wrap gap-3 mt-6">
                            <a href="/pricing.html" class="premium-btn px-7 py-3 bg-[#0A66C2] text-white font-semibold rounded-3xl">View Pricing</a>
                            <a href="/contact.html" class="premium-btn px-7 py-3 border border-gray-300 dark:border-gray-600 font-semibold rounded-3xl">Start a Project</a>
                        </div>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4 mt-10" id="prev-next">
                        ${prev ? `<a href="${prev.url}" class="block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group"><div class="text-xs text-gray-400">← Previous</div><div class="font-semibold mt-1 group-hover:text-[#0A66C2]">${esc(prev.title)}</div></a>` : '<div></div>'}
                        ${next ? `<a href="${next.url}" class="block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group text-right"><div class="text-xs text-gray-400">Next →</div><div class="font-semibold mt-1 group-hover:text-[#0A66C2]">${esc(next.title)}</div></a>` : ''}
                    </div>
                </div>
            </article>
            <aside class="lg:col-span-4 space-y-8">
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-7 sticky top-28">
                    <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">IN THIS ARTICLE</div>
                    <nav class="toc-link mt-4 space-y-0">
                    ${tocHtml}
                    </nav>
                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div class="text-xs tracking-[3px] font-semibold text-[#16A34A]">RELATED READING</div>
                        <div class="mt-4 space-y-4">${relatedHtml}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
`;

  const head = setHead(BLOG.prologue, {
    title: `${a.title} | Prosengit Kundu Blog`,
    description: a.excerpt, url, image: a.img, type: 'article',
    extraHead: articleSchema(a, url)
  });
  const doc = absolutize(head + '\n' + main + '\n' + BLOG.footer);
  fs.writeFileSync(path.join(ROOT, 'blog', `${a.slug}.html`), doc);
});

/* ---------------- generate portfolio case studies ---------------- */
const CATS = { web: 'Web Development', seo: 'SEO', lead: 'Lead Generation', ads: 'Paid Ads', design: 'Graphic Design' };

PROJECTS.forEach((p, i) => {
  const url = `${SITE}/portfolio/${p.slug}.html`;
  const prev = PROJECTS[i-1], next = PROJECTS[i+1];
  const description = `${p.focus} — case study by Prosengit Kundu. Full project documentation: goal, role, tools, work completed and outcome.`;

  const main = `
    <main id="caseStudy" class="max-w-5xl mx-auto px-8 pt-16 pb-16">
        <a href="/portfolio.html" class="text-sm font-semibold text-[#0A66C2]">← Back to Portfolio</a>
        <div class="mt-8">
            <div class="text-xs tracking-[3px] font-semibold text-[#F59E0B]">${(CATS[p.cat] || p.cat).toUpperCase()}</div>
            <h1 class="text-4xl md:text-6xl heading-font tracking-tighter font-bold mt-4 leading-[1.05]">${esc(p.title)}</h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mt-5 max-w-3xl">${esc(p.industry)}</p>
        </div>
        <img src="/${p.image}" alt="${esc(p.title)} — project image by Prosengit Kundu" class="w-full aspect-[16/9] object-cover rounded-3xl mt-12" width="1400" height="800" fetchpriority="high" onerror="this.onerror=null;this.src='https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1400&h=800';">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">CATEGORY</div><div class="font-semibold text-sm mt-2">${CATS[p.cat] || p.cat}</div></div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">FOCUS</div><div class="font-semibold text-sm mt-2">${esc(p.focus)}</div></div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">TIMELINE</div><div class="font-bold mt-2">${esc(p.duration)}</div></div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">TYPE</div><div class="font-bold mt-2">${esc(p.client)}</div></div>
        </div>
        <section class="mt-14">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">PROJECT GOAL</div>
            <h2 class="text-3xl heading-font font-bold mt-3">What this project set out to do</h2>
            <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">${esc(p.goal)}</p>
        </section>
        <section class="mt-12">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">MY ROLE</div>
            <h2 class="text-3xl heading-font font-bold mt-3">Responsibilities &amp; tools</h2>
            <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">${esc(p.role)}</p>
            <div class="mt-5 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-5 text-sm"><span class="font-semibold text-[#0A66C2]">Tools &amp; technology:</span> <span class="text-gray-600 dark:text-gray-300">${esc(p.tools)}</span></div>
        </section>
        <section class="mt-12">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">WORK COMPLETED</div>
            <h2 class="text-3xl heading-font font-bold mt-3">Deliverables in detail</h2>
            <ul class="grid md:grid-cols-2 gap-4 mt-7 text-gray-600 dark:text-gray-300">${p.work.map(item => `<li class="border-l-2 border-[#0A66C2] pl-4">${esc(item)}</li>`).join('')}</ul>
        </section>
        <section class="mt-12">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">OUTCOME</div>
            <h2 class="text-3xl heading-font font-bold mt-3">Honest status of this work</h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">${esc(p.outcome)}</p>
        </section>
        <div class="mt-14 flex flex-wrap justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">
            ${prev ? `<a href="${prev.url}" class="text-sm font-semibold text-[#0A66C2]">← ${esc(prev.title)}</a>` : '<span></span>'}
            ${next ? `<a href="${next.url}" class="text-sm font-semibold text-[#0A66C2]">${esc(next.title)} →</a>` : ''}
        </div>
    </main>
`;

  const head = setHead(CASE.prologue, {
    title: `${p.title} | Case Study | Prosengit Kundu`,
    description, url, image: p.image, type: 'article', extraHead: projectSchema(p, url)
  });
  const expansion = PORTFOLIO_EXPANSIONS[p.slug] || '';
  /* Keep the existing CTA order and place the editorial expansion before the
     footer. This mirrors the public pages and prevents source regeneration
     from discarding their human-written project context. */
  const caseTail = CASE.footer.replace('<footer class="site-footer">', `${expansion}\n<footer class="site-footer">`);
  const doc = absolutize(head + '\n' + main + '\n' + caseTail);
  fs.writeFileSync(path.join(ROOT, 'portfolio', `${p.slug}.html`), doc);
});

console.log(`Generated ${ARTICLES.length} article pages and ${PROJECTS.length} case-study pages.`);
