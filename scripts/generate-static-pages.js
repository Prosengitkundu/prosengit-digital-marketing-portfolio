#!/usr/bin/env node
/* ===========================================================================
   STATIC SEO GENERATOR — blog articles and portfolio case studies
   ---------------------------------------------------------------------------
   Run after editing assets/js/articles.js or assets/js/projects.js:
     node scripts/generate-static-pages.js

   The script turns data-driven content into crawlable pages with stable URLs,
   unique metadata, canonical URLs, Open Graph/Twitter metadata, image alt
   text, JSON-LD, visible breadcrumbs and sitemap coverage. It also validates
   the stable ID/slug routes before writing files, so an accidental undefined
   or duplicate project route cannot be published.
   =========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://prosengitkundu.top';
const LASTMOD = '2026-09-18';

function loadData(file, varname) {
  let source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  source = source.replace(`const ${varname}`, `var ${varname}`);
  // Project and article records are maintained in local source files, not
  // user input. Evaluation lets the static renderer share that single source.
  eval(`${source}\n;globalThis.__STATIC_DATA__ = ${varname};`); // eslint-disable-line no-eval
  return globalThis.__STATIC_DATA__;
}

const ARTICLES = loadData('assets/js/articles.js', 'ARTICLES');
const PROJECTS = loadData('assets/js/projects.js', 'PROJECTS');
const CATEGORIES = { web: 'Web Development', seo: 'SEO', lead: 'Lead Generation', ads: 'Paid Ads', design: 'Graphic Design' };

const esc = (value) => String(value == null ? '' : value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
const absUrl = (value) => /^https?:\/\//i.test(value) ? value : `${SITE}/${String(value).replace(/^\.?\//, '')}`;
const cleanArray = (value) => Array.isArray(value) ? value : [];
const publicSrc = (value) => /^https?:\/\//i.test(String(value)) ? String(value) : `/${String(value).replace(/^\.?\//, '')}`;

function validateRecords() {
  const seenProjectIds = new Set();
  const seenProjectSlugs = new Set();
  PROJECTS.forEach((project) => {
    const route = `/portfolio/${project.slug}.html`;
    if (!Number.isInteger(project.id) || seenProjectIds.has(project.id)) {
      throw new Error(`Portfolio project ${project.title || '(untitled)'} has a duplicate or invalid id.`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || '') || seenProjectSlugs.has(project.slug)) {
      throw new Error(`Portfolio project ${project.title || '(untitled)'} has a duplicate or invalid slug.`);
    }
    if (project.url !== route) {
      throw new Error(`Portfolio route mismatch for ${project.slug}: expected ${route}, got ${project.url}.`);
    }
    ['title', 'metaTitle', 'metaDescription', 'image', 'imageAlt', 'projectType'].forEach((field) => {
      if (!project[field]) throw new Error(`Portfolio project ${project.slug} is missing ${field}.`);
    });
    seenProjectIds.add(project.id);
    seenProjectSlugs.add(project.slug);
  });

  const seenArticleIds = new Set();
  const seenArticleSlugs = new Set();
  ARTICLES.forEach((article) => {
    if (!Number.isInteger(article.id) || seenArticleIds.has(article.id)) {
      throw new Error(`Article ${article.title || '(untitled)'} has a duplicate or invalid id.`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || '') || seenArticleSlugs.has(article.slug)) {
      throw new Error(`Article ${article.title || '(untitled)'} has a duplicate or invalid slug.`);
    }
    if (article.url !== `/blog/${article.slug}.html`) {
      throw new Error(`Article route mismatch for ${article.slug}.`);
    }
    seenArticleIds.add(article.id);
    seenArticleSlugs.add(article.slug);
  });
}
validateRecords();

function extractParts(templateFile, ctaStart) {
  const source = fs.readFileSync(path.join(ROOT, templateFile), 'utf8');
  const headerEnd = source.indexOf('</header>') + '</header>'.length;
  const footerStart = ctaStart ? source.indexOf(ctaStart, headerEnd) : source.indexOf('<footer class="site-footer">');
  if (headerEnd < '</header>'.length || footerStart < 0) {
    throw new Error(`Could not extract layout from ${templateFile}.`);
  }
  let footer = source.slice(footerStart);
  const scriptStarts = [
    footer.indexOf('<script src="assets/js/articles.js"></script>'),
    footer.indexOf('<script src="assets/js/projects.js"></script>')
  ].filter((index) => index >= 0);
  if (scriptStarts.length) footer = `${footer.slice(0, Math.min(...scriptStarts)).trimEnd()}\n</body>\n</html>\n`;
  return { prologue: source.slice(0, headerEnd), footer };
}

const BLOG_TEMPLATE = extractParts('blog-details.html');
const CASE_TEMPLATE = extractParts('portfolio-details.html');

function upsert(head, pattern, tag) {
  return pattern.test(head) ? head.replace(pattern, tag) : head.replace('</head>', `    ${tag}\n</head>`);
}

function setHead(prologue, data) {
  let head = prologue;
  head = head.replace(/<title>[^<]*<\/title>/i, `<title>${esc(data.title)}</title>`);
  head = upsert(head, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${esc(data.description)}">`);
  head = upsert(head, /<meta\s+name="robots"[^>]*>/i, '<meta name="robots" content="index, follow">');
  head = upsert(head, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${data.url}">`);
  head = upsert(head, /<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="${data.type}">`);
  head = upsert(head, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${data.url}">`);
  head = upsert(head, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(data.title)}">`);
  head = upsert(head, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${esc(data.description)}">`);
  head = upsert(head, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${absUrl(data.image)}">`);
  head = upsert(head, /<meta\s+property="og:image:alt"[^>]*>/i, `<meta property="og:image:alt" content="${esc(data.imageAlt)}">`);
  head = upsert(head, /<meta\s+name="twitter:card"[^>]*>/i, '<meta name="twitter:card" content="summary_large_image">');
  head = upsert(head, /<meta\s+name="twitter:url"[^>]*>/i, `<meta name="twitter:url" content="${data.url}">`);
  head = upsert(head, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(data.title)}">`);
  head = upsert(head, /<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${esc(data.description)}">`);
  head = upsert(head, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${absUrl(data.image)}">`);
  head = upsert(head, /<meta\s+name="twitter:image:alt"[^>]*>/i, `<meta name="twitter:image:alt" content="${esc(data.imageAlt)}">`);
  return head.replace('</head>', `    ${data.extraHead || ''}\n</head>`);
}

/* Generated pages sit one directory below root. Root-absolute internal URLs
   keep navigation working after direct loads, refreshes and history actions. */
function absolutize(html) {
  return html
    .replace(/(href|src)="assets\//g, '$1="/assets/')
    .replace(/href="((?:index|about|team|services|pricing|portfolio|blog|testimonials|faq|contact|privacy-policy|terms|disclaimer|404|thank-you|team-eitykona|team-nilanjana|team-sarna|team-shamim|team-priyanka)\.html)"/g, 'href="/$1"')
    .replace(/href="(portfolio-details|blog-details)\.html"/g, 'href="/$1.html"');
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function articleSchema(article, url) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: absUrl(article.img),
    author: { '@type': 'Person', name: 'Prosengit Kundu', url: `${SITE}/` },
    publisher: { '@type': 'Person', name: 'Prosengit Kundu' },
    mainEntityOfPage: url
  });
}

function caseSchema(project, url) {
  const services = cleanArray(project.services).map((service) => ({ '@type': 'Service', name: service.label }));
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': url,
        name: project.title,
        description: project.metaDescription,
        url,
        image: absUrl(project.imageFallback || project.image),
        author: { '@type': 'Person', name: 'Prosengit Kundu', url: `${SITE}/` },
        about: services,
        keywords: project.focus,
        isPartOf: { '@type': 'CollectionPage', name: 'Prosengit Kundu Portfolio', url: `${SITE}/portfolio.html` },
        additionalType: 'Practice case study'
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE}/portfolio.html` },
          { '@type': 'ListItem', position: 3, name: project.title, item: url }
        ]
      }
    ]
  });
}

function paragraphHtml(paragraphs) {
  return cleanArray(paragraphs).map((paragraph) => `<p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">${esc(paragraph)}</p>`).join('');
}

function cardLink(project) {
  return `<a href="${project.url}" class="block h-full p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group"><div class="text-xs font-semibold text-[#0A66C2]">${esc(CATEGORIES[project.cat] || project.cat)}</div><div class="font-semibold mt-2 group-hover:text-[#0A66C2] leading-snug">${esc(project.title)}</div><div class="text-xs text-gray-500 dark:text-gray-400 mt-2">${esc(project.projectType)}</div></a>`;
}

function serviceLinks(project) {
  return cleanArray(project.services).map((service) =>
    `<a href="${esc(service.href)}" class="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 dark:border-gray-700 text-sm font-semibold text-[#0A66C2] hover:bg-blue-50 dark:hover:bg-gray-800">${esc(service.label)} →</a>`
  ).join('');
}

function renderCaseStudy(project, index) {
  const url = `${SITE}${project.url}`;
  const related = cleanArray(project.relatedProjectIds)
    .map((id) => PROJECTS.find((candidate) => candidate.id === id))
    .filter(Boolean)
    .slice(0, 3);
  const previous = PROJECTS[index - 1];
  const next = PROJECTS[index + 1];
  const sections = cleanArray(project.sections).map((section) => `
        <section class="mt-12">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">${esc(section.eyebrow)}</div>
            <h2 class="text-3xl heading-font font-bold mt-3">${esc(section.heading)}</h2>
            ${paragraphHtml(section.paragraphs)}
        </section>`).join('');
  const deliverables = cleanArray(project.deliverables).map((item) => `<li class="border-l-2 border-[#0A66C2] pl-4">${esc(item)}</li>`).join('');
  const relatedCards = related.map(cardLink).join('');

  const main = `
    <main id="caseStudy" class="max-w-5xl mx-auto px-8 pt-12 pb-16">
        <nav aria-label="Breadcrumb" class="text-sm text-gray-500 dark:text-gray-400">
            <ol class="flex flex-wrap items-center gap-2"><li><a href="/index.html" class="font-semibold text-[#0A66C2]">Home</a></li><li aria-hidden="true">/</li><li><a href="/portfolio.html" class="font-semibold text-[#0A66C2]">Portfolio</a></li><li aria-hidden="true">/</li><li aria-current="page">${esc(project.title)}</li></ol>
        </nav>
        <div class="mt-8">
            <div class="flex flex-wrap gap-3 items-center"><span class="text-xs tracking-[3px] font-semibold text-[#F59E0B]">${esc((CATEGORIES[project.cat] || project.cat).toUpperCase())}</span><span class="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 dark:bg-gray-800 dark:text-amber-300 border border-amber-100 dark:border-gray-700">${esc(project.projectType)}</span></div>
            <h1 class="text-4xl md:text-6xl heading-font tracking-tighter font-bold mt-4 leading-[1.05]">${esc(project.title)}</h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mt-5 max-w-3xl">${esc(project.focus)}</p>
        </div>
        <figure class="mt-10">
            <picture><source srcset="/${esc(project.image)}" type="image/webp"><img src="/${esc(project.imageFallback || project.image)}" alt="${esc(project.imageAlt)}" class="w-full aspect-[16/9] object-cover rounded-3xl" width="1000" height="558" fetchpriority="high" decoding="async"></picture>
            <figcaption class="mt-3 text-sm text-gray-500 dark:text-gray-400">Illustrative project visual for this practice case study.</figcaption>
        </figure>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">CATEGORY</div><div class="font-semibold text-sm mt-2">${esc(CATEGORIES[project.cat] || project.cat)}</div></div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">INDUSTRY / NICHE</div><div class="font-semibold text-sm mt-2">${esc(project.industry)}</div></div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">TARGET-MARKET LENS</div><div class="font-semibold text-sm mt-2">${esc(project.market)}</div></div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">WORKFLOW</div><div class="font-semibold text-sm mt-2">${esc(project.duration)}</div></div>
        </div>
        <aside class="mt-8 p-5 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl text-sm text-gray-700 dark:text-gray-300" aria-label="Case study status"><strong>Transparency note:</strong> this is a ${esc(project.projectType.toLowerCase())}. It documents the method and likely deliverables, not a named client, testimonial, ranking, traffic, lead, revenue or advertising result.</aside>
        ${sections}
        <section class="mt-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 md:p-10">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">PROJECT DELIVERABLES</div>
            <h2 class="text-3xl heading-font font-bold mt-3">What the workflow is designed to deliver</h2>
            <ul class="grid md:grid-cols-2 gap-4 mt-7 text-gray-600 dark:text-gray-300">${deliverables}</ul>
        </section>
        <section class="mt-12">
            <div class="text-xs tracking-[3px] font-semibold text-[#16A34A]">TOOLS &amp; IMPLEMENTATION</div>
            <h2 class="text-3xl heading-font font-bold mt-3">Tools are selected to fit the brief</h2>
            <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">The final toolkit is selected after discovery, access review and scope confirmation. It may include the platforms, research methods, design tools, analytics tools or development technologies appropriate to the approved work. The emphasis is on a documented, maintainable process rather than using tools as a substitute for strategy.</p>
        </section>
        <section class="mt-12">
            <div class="text-xs tracking-[3px] font-semibold text-[#16A34A]">LESSON FROM THE PROCESS</div>
            <h2 class="text-3xl heading-font font-bold mt-3">A practical takeaway</h2>
            <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">${esc(project.lessons)}</p>
        </section>
        <section class="mt-12 pt-10 border-t border-gray-200 dark:border-gray-700">
            <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">RELATED SERVICES</div>
            <h2 class="text-3xl heading-font font-bold mt-3">Continue with the relevant service</h2>
            <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Explore the service areas connected to this workflow, then share your actual goals for a practical recommendation and written scope.</p>
            <div class="flex flex-wrap gap-3 mt-6">${serviceLinks(project)}</div>
        </section>
        ${relatedCards ? `<section class="mt-12"><div class="text-xs tracking-[3px] font-semibold text-[#F59E0B]">RELATED PRACTICE CASE STUDIES</div><h2 class="text-3xl heading-font font-bold mt-3">Explore related approaches</h2><div class="grid md:grid-cols-${Math.min(related.length, 3)} gap-4 mt-7">${relatedCards}</div></section>` : ''}
        <section class="mt-14 p-8 md:p-10 bg-[#0A66C2] text-white rounded-3xl text-center">
            <div class="text-xs tracking-[3px] font-semibold text-blue-100">PLAN A REAL PROJECT</div>
            <h2 class="text-3xl heading-font font-bold mt-3">Have a similar goal in mind?</h2>
            <p class="mt-4 text-blue-100 max-w-2xl mx-auto">Share your website, market, service priorities and timeline. I will suggest a focused starting point without promising rankings, leads or advertising results before the work is properly scoped.</p>
            <div class="flex flex-wrap gap-4 justify-center mt-7"><a href="/contact.html" class="premium-btn inline-block px-7 py-3 bg-white text-[#0A66C2] font-bold rounded-3xl">Discuss your project</a><a href="/contact.html?plan=Free%20Consultation" class="premium-btn inline-block px-7 py-3 border-2 border-white font-bold rounded-3xl">Book a consultation</a></div>
        </section>
        <nav class="mt-14 grid sm:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-8" aria-label="More case studies">
            ${previous ? `<a href="${previous.url}" class="block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group"><div class="text-xs text-gray-400">← Previous case study</div><div class="font-semibold mt-1 group-hover:text-[#0A66C2]">${esc(previous.title)}</div></a>` : '<div></div>'}
            ${next ? `<a href="${next.url}" class="block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group text-right"><div class="text-xs text-gray-400">Next case study →</div><div class="font-semibold mt-1 group-hover:text-[#0A66C2]">${esc(next.title)}</div></a>` : ''}
        </nav>
    </main>
`;

  const head = setHead(CASE_TEMPLATE.prologue, {
    title: project.metaTitle,
    description: project.metaDescription,
    url,
    image: project.imageFallback || project.image,
    imageAlt: project.imageAlt,
    type: 'article',
    extraHead: caseSchema(project, url)
  });
  fs.writeFileSync(path.join(ROOT, 'portfolio', `${project.slug}.html`), `${absolutize(`${head}\n${main}\n${CASE_TEMPLATE.footer}`).replace(/[\t ]+$/gm, '').trimEnd()}\n`);
}

function processArticleBody(html) {
  const headings = [];
  const body = html.replace(/<h2>(.*?)<\/h2>/g, (match, text) => {
    headings.push(text);
    return `<h2 id="s-${headings.length - 1}">${text}</h2>`;
  });
  return { body, headings };
}

function renderArticle(article, index) {
  const url = `${SITE}${article.url}`;
  const { body, headings } = processArticleBody(article.body.trim());
  const previous = ARTICLES[index - 1];
  const next = ARTICLES[index + 1];
  const related = ARTICLES.filter((candidate) => candidate.cat === article.cat && candidate.id !== article.id).slice(0, 3);
  const toc = headings.length
    ? headings.map((heading, headingIndex) => `<a href="#s-${headingIndex}">${esc(heading)}</a>`).join('\n                    ')
    : '<p class="text-sm text-gray-400">Article sections are listed within the guide.</p>';
  const relatedHtml = related.length
    ? related.map((candidate) => `<a href="${candidate.url}" class="block group"><div class="text-xs font-semibold text-[#0A66C2]">${esc(candidate.cat)}</div><div class="font-semibold text-sm mt-1 group-hover:text-[#0A66C2] leading-snug">${esc(candidate.title)}</div><div class="text-xs text-gray-400 mt-1">${esc(candidate.read)}</div></a>`).join('')
    : '<p class="text-sm text-gray-400">Explore other categories for more guides.</p>';
  const main = `
    <div class="max-w-7xl mx-auto px-8 pt-16 pb-20">
        <a href="/blog.html" class="text-sm font-semibold text-[#0A66C2]">← Back to all articles</a>
        <div class="grid lg:grid-cols-12 gap-12 mt-8">
            <article class="lg:col-span-8">
                <div id="article-content">
                    <div class="flex flex-wrap gap-3 items-center text-xs font-semibold"><span class="text-[#0A66C2] bg-blue-50 dark:bg-gray-900 px-3 py-1 rounded-full">${esc(article.cat)}</span><span class="text-gray-400">${esc(article.date)}</span><span class="text-gray-400">·</span><span class="text-gray-400">${esc(article.read)}</span></div>
                    <h1 class="text-4xl md:text-5xl heading-font tracking-tighter font-bold mt-5 leading-[1.1]">${esc(article.title)}</h1>
                    <p class="text-lg text-gray-600 dark:text-gray-300 mt-5 leading-relaxed">${esc(article.excerpt)}</p>
                    <img src="${esc(publicSrc(article.img))}" alt="${esc(article.title)} — illustrated article cover" class="w-full aspect-[16/9] object-cover rounded-3xl mt-10" width="1200" height="680" fetchpriority="high" decoding="async">
                    <div id="a-body" class="article-body mt-10">${body}</div>
                    <div class="mt-14 p-7 md:p-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl"><h2 class="text-2xl heading-font font-bold">Work with me</h2><p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">I provide freelance SEO, international SEO, custom HTML/CSS/JavaScript web development, Google and Meta Ads management, B2B lead generation and digital growth planning for Bangladesh and remote clients worldwide.</p><div class="flex flex-wrap gap-3 mt-6"><a href="/pricing.html" class="premium-btn px-7 py-3 bg-[#0A66C2] text-white font-semibold rounded-3xl">View pricing</a><a href="/contact.html" class="premium-btn px-7 py-3 border border-gray-300 dark:border-gray-600 font-semibold rounded-3xl">Start a project</a></div></div>
                    <nav class="grid sm:grid-cols-2 gap-4 mt-10" aria-label="More articles">${previous ? `<a href="${previous.url}" class="block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group"><div class="text-xs text-gray-400">← Previous</div><div class="font-semibold mt-1 group-hover:text-[#0A66C2]">${esc(previous.title)}</div></a>` : '<div></div>'}${next ? `<a href="${next.url}" class="block p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group text-right"><div class="text-xs text-gray-400">Next →</div><div class="font-semibold mt-1 group-hover:text-[#0A66C2]">${esc(next.title)}</div></a>` : ''}</nav>
                </div>
            </article>
            <aside class="lg:col-span-4 space-y-8"><div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-7 sticky top-28"><div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">IN THIS ARTICLE</div><nav class="toc-link mt-4 space-y-0">${toc}</nav><div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"><div class="text-xs tracking-[3px] font-semibold text-[#16A34A]">RELATED READING</div><div class="mt-4 space-y-4">${relatedHtml}</div></div></div></aside>
        </div>
    </div>
`;
  const head = setHead(BLOG_TEMPLATE.prologue, {
    title: `${article.title} | Prosengit Kundu Blog`,
    description: article.excerpt,
    url,
    image: article.img,
    imageAlt: `${article.title} article illustration`,
    type: 'article',
    extraHead: articleSchema(article, url)
  });
  fs.writeFileSync(path.join(ROOT, 'blog', `${article.slug}.html`), `${absolutize(`${head}\n${main}\n${BLOG_TEMPLATE.footer}`).replace(/[\t ]+$/gm, '').trimEnd()}\n`);
}

function updatePortfolioSchema() {
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Prosengit Kundu Portfolio',
    description: 'Practice case studies demonstrating SEO, paid advertising, web development, lead generation and design workflows.',
    url: `${SITE}/portfolio.html`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: PROJECTS.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        url: `${SITE}${project.url}`
      }))
    }
  };
  const portfolioPath = path.join(ROOT, 'portfolio.html');
  const source = fs.readFileSync(portfolioPath, 'utf8');
  const replacement = `<!-- PROJECT_COLLECTION_SCHEMA_START -->\n    ${jsonLd(collection)}\n    <!-- PROJECT_COLLECTION_SCHEMA_END -->`;
  if (!/<!-- PROJECT_COLLECTION_SCHEMA_START -->[\s\S]*?<!-- PROJECT_COLLECTION_SCHEMA_END -->/.test(source)) {
    throw new Error('portfolio.html is missing project collection schema markers.');
  }
  fs.writeFileSync(portfolioPath, source.replace(/<!-- PROJECT_COLLECTION_SCHEMA_START -->[\s\S]*?<!-- PROJECT_COLLECTION_SCHEMA_END -->/, replacement));
}

function writePortfolioIndex() {
  const output = PROJECTS.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.cat,
    url: project.url,
    summary: project.summary,
    focus: project.focus,
    projectType: project.projectType,
    market: project.market
  }));
  const dataDirectory = path.join(ROOT, 'assets', 'data');
  const jsDirectory = path.join(ROOT, 'assets', 'js');
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.mkdirSync(jsDirectory, { recursive: true });
  fs.writeFileSync(path.join(dataDirectory, 'portfolio-index.json'), `${JSON.stringify(output, null, 2)}\n`);
  fs.writeFileSync(path.join(jsDirectory, 'portfolio-index.js'), `/* Generated from assets/js/projects.js. Run scripts/generate-static-pages.js after project edits. */\nwindow.PK_PORTFOLIO_INDEX = ${JSON.stringify(output)};\n`);
}

function writeSitemap() {
  const primary = [
    ['/', 'weekly', '1.0'], ['about.html', 'monthly', '0.8'], ['services.html', 'monthly', '0.8'], ['portfolio.html', 'weekly', '0.8'],
    ['pricing.html', 'monthly', '0.8'], ['blog.html', 'weekly', '0.7'], ['testimonials.html', 'monthly', '0.6'], ['faq.html', 'monthly', '0.5'],
    ['contact.html', 'monthly', '0.7'], ['team.html', 'monthly', '0.6'], ['team-eitykona.html', 'monthly', '0.5'], ['team-nilanjana.html', 'monthly', '0.5'],
    ['team-sarna.html', 'monthly', '0.5'], ['team-shamim.html', 'monthly', '0.5'], ['team-priyanka.html', 'monthly', '0.5'],
    ['disclaimer.html', 'yearly', '0.3'], ['privacy-policy.html', 'yearly', '0.3'], ['terms.html', 'yearly', '0.3']
  ];
  const urls = [
    ...primary.map(([route, changefreq, priority]) => ({ route, changefreq, priority })),
    ...ARTICLES.map((article) => ({ route: article.url, changefreq: 'monthly', priority: '0.7' })),
    ...PROJECTS.map((project) => ({ route: project.url, changefreq: 'monthly', priority: '0.7' }))
  ];
  const entries = urls.map(({ route, changefreq, priority }) => {
    const publicRoute = route === '/' ? '/' : (route.startsWith('/') ? route : `/${route}`);
    return `    <url>\n        <loc>${SITE}${publicRoute}</loc>\n        <lastmod>${LASTMOD}</lastmod>\n        <changefreq>${changefreq}</changefreq>\n        <priority>${priority}</priority>\n    </url>`;
  }).join('\n');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`);
}

fs.mkdirSync(path.join(ROOT, 'blog'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'portfolio'), { recursive: true });
ARTICLES.forEach(renderArticle);
PROJECTS.forEach(renderCaseStudy);
updatePortfolioSchema();
writePortfolioIndex();
writeSitemap();
console.log(`Generated ${ARTICLES.length} article pages, ${PROJECTS.length} practice case-study pages, a portfolio index and an updated sitemap.`);
