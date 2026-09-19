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
const ARTICLE_GUIDES = loadData('assets/js/article-guides.js', 'ARTICLE_GUIDES');
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

/* ---------------- topic-specific long-form editorial workbooks ----------------
   The original article remains the primary guide. This section applies it to a
   concrete planning situation using a hand-curated brief for that exact topic.
   It does not claim client results, rankings, revenue or guaranteed outcomes. */
function buildArticleWorkbook(a) {
  const g = ARTICLE_GUIDES[a.slug];
  if (!g) throw new Error(`Missing editorial guide for article: ${a.slug}`);
  const decisions = g.decisions.map((entry, i) => {
    const [name, advice] = entry.split('|');
    const prompts = [
      `Write down the current evidence before changing anything. Then make one controlled decision and record who owns the next action.`,
      `Apply this to the page, campaign or workflow that matters most first. A narrow test is easier to interpret than a site-wide change made without a baseline.`,
      `Explain the choice in plain language to the person approving the work. If the reason cannot be explained clearly, the scope probably needs more research.`,
      `Set an explicit review point. The first implementation may reveal a different constraint, so the plan should allow evidence to change the next priority.`
    ];
    return `<h3>${i + 1}. ${esc(name)}</h3><p>${esc(advice)} ${prompts[i % prompts.length]}</p><p><strong>Working note for ${esc(name)}:</strong> connect this decision to ${esc(g.outcome)}. Record the assumption, the evidence available now and the condition that would make you revise this specific choice. That keeps the work practical and prevents a checklist from replacing judgement.</p>`;
  }).join('\n');
  const inputs = g.inputs.map((x, i) => `<li><strong>${i + 1}.</strong> ${esc(x)}. Note its source, date and any limitation before using it to make a decision.</li>`).join('');
  const measures = g.measures.map(x => `<li><strong>${esc(x)}:</strong> define where the number comes from, how often it will be reviewed and what business question it answers. Compare like-for-like periods and annotate major releases or campaign changes.</li>`).join('');
  const risks = g.risks.map(x => `<li><strong>${esc(x)}.</strong> Treat this as a review trigger, not a reason to abandon the channel. Check the underlying evidence, correct the process and document what changed.</li>`).join('');
  return `
  <h2>Applied workbook: turn the guidance into a working plan</h2>
  <p>This section is for ${esc(g.audience)}. Its purpose is to help you ${esc(g.outcome)}. It expands the principles above into a planning document you can use with a colleague, freelancer or agency. It is not a promise of a ranking, lead volume or return. Those outcomes depend on the market, offer, website, competition, budget and quality of execution.</p>
  <p>Use this ${esc(a.title)} workbook on one real priority rather than answering it in the abstract. A useful plan names the page, campaign, audience or dataset being discussed; identifies the evidence available today; and gives the next action to a specific owner. If information is missing, write that down as a research task instead of filling the gap with an assumption.</p>

  <h2>A realistic planning situation</h2>
  <p>Consider this hypothetical situation: ${esc(g.scenario)}. The example is intentionally general and does not describe a named client. It shows why the topic cannot be solved by copying a template. The right response begins by separating what is known from what merely sounds plausible.</p>
  <p>For ${esc(a.title)}, first describe the commercial objective in one sentence. Then describe what a useful visitor, lead or customer would do next. Finally, identify the present obstacle. It might be missing demand, weak relevance, technical friction, an unclear offer, poor measurement or insufficient follow-up. Each obstacle leads to different work, so this diagnosis prevents a tool from deciding the strategy.</p>
  <p>For the ${esc(a.title)} situation, create two columns: <em>evidence</em> and <em>assumptions</em>. Evidence may include search queries, campaign terms, page behavior, sales notes, crawl output or verified records, depending on the topic. The plan should test the most important assumption while protecting what the available evidence already supports.</p>

  <h2>Information to collect before implementation</h2>
  <p>Do not wait for perfect data, but collect enough information to avoid an expensive guess about ${esc(a.title)}. The following inputs are specific to this topic:</p>
  <ul>${inputs}</ul>
  <p>Place the ${esc(a.title)} inputs in one brief. Add the target market, device or location where it changes the answer. For international work, terminology and competition can differ between the United States, United Kingdom, Canada, Australia, Europe and Bangladesh; that does not justify repeating country names throughout the copy. It means the research should reflect the audience that will actually see the page or campaign.</p>
  <p>Finish the ${esc(a.title)} brief with constraints: budget, deadline, access, approval time, technical capacity and legal or platform requirements. Constraints make priorities visible and help a specialist recommend a focused first phase instead of pretending every possible task belongs in the initial scope.</p>

  <h2>Four decisions to make deliberately</h2>
  ${decisions}

  <h2>How to move from plan to implementation</h2>
  <p>Turn the four ${esc(a.title)} decisions into a short backlog. Each item should contain an owner, the asset or account affected, the expected user benefit, the evidence behind it and a completion check. Broad instructions such as “improve it” are not executable; name the exact page, campaign, file or workflow and the check that will close the task.</p>
  <p>For the ${esc(a.title)} plan, work in dependency order. Measurement and access usually come before optimization, and a clear offer or source dataset comes before scaling distribution. The correct sequence reduces rework and makes later evidence easier to interpret.</p>
  <p>Keep a dated change log for ${esc(a.title)}. Record the content, technical, tracking, audience, creative or data rule that changed—whichever applies here. Platforms change continuously, but undocumented internal releases cause just as much confusion. A log separates deliberate work from seasonality and normal fluctuation.</p>
  <p>Review the ${esc(a.title)} implementation as the intended user would. Use the actual device, landing page, account view, spreadsheet or conversion path; then complete the intended task. Technical correctness matters, but the work is unfinished when a real person cannot understand or use it.</p>

  <h2>Measurement that supports a decision</h2>
  <p>A reporting dashboard for ${esc(a.title)} is useful only when each number changes a decision. Start with the following topic-specific measures:</p>
  <ul>${measures}</ul>
  <p>For ${esc(a.title)}, use both leading and outcome indicators. A leading indicator shows whether implementation is moving in the intended direction; an outcome indicator shows whether that direction supports the business. The measures listed above make that distinction concrete, and neither group should be interpreted alone.</p>
  <p>Avoid presenting correlation as certainty when reporting on ${esc(a.title)}. Traffic, cost or conversion can change because of seasonality, competitors, pricing, creative, tracking or demand. Report the release, the observation and the next test instead of claiming credit the data cannot isolate.</p>

  <h2>Quality-control and risk review</h2>
  <p>Before calling the ${esc(a.title)} work complete, check for these topic-specific warning signs:</p>
  <ul>${risks}</ul>
  <p>Also run a cross-channel check around ${esc(a.title)}: links should resolve to the intended URL, important content should be available on mobile, images should have accurate alternative text where needed, forms should explain what happens next, and analytics should not claim more than the implementation supports. These details affect accessibility, trust and measurement together.</p>
  <p>Ask someone who was not involved in the ${esc(a.cat)} implementation to explain the page, campaign or process after a short review. If their understanding differs from the intended message for ${esc(a.title)}, improve the work before adding more traffic or content. Clarity is often the cheapest useful improvement available.</p>

  <h2>A 30-day review rhythm</h2>
  <p>For ${esc(a.title)}, use this first-month rhythm: <strong>Days 1–3:</strong> establish the baseline and choose one priority. <strong>Days 4–10:</strong> complete the first controlled implementation and quality checks. <strong>Days 11–20:</strong> observe early signals without reacting to every daily movement. <strong>Days 21–30:</strong> compare the evidence with the original assumption and approve the next iteration.</p>
  <p>The exact ${esc(a.cat)} timing depends on how quickly reliable evidence appears. Technical defects can be verified after release, organic search effects often need longer observation, and paid campaigns still need enough qualified activity to support a decision. Review ${esc(a.title)} at a pace that matches the system rather than an arbitrary daily reporting habit.</p>

  <h2>Document the handover</h2>
  <p>Close the ${esc(a.title)} cycle with a one-page handover. List the objective, the assets or accounts changed, access ownership, the baseline date, completed checks, unresolved risks and the next review date. Attach the small number of reports or source files another person would need to continue the work. For ${esc(g.audience)}, this record is especially useful because it turns ${esc(a.cat)} activity into an understandable operating process instead of knowledge held by one provider. The handover should also state what was <em>not</em> done and why. That boundary prevents later assumptions about scope, makes future quotations easier to compare and protects authentic reporting. If a result has not yet had enough time or data to evaluate, label it as pending rather than positive or negative. Clear documentation is part of delivery, not an optional administrative extra.</p>

  <h2>Workbook questions</h2>
  <h3>What should I do first?</h3>
  <p>For ${esc(a.title)}, start by writing the objective and collecting the four inputs above. Then choose the decision that removes the largest current uncertainty. That is usually more valuable than selecting the easiest task or the tool with the most recommendations.</p>
  <h3>How do I know whether I need professional help?</h3>
  <p>Professional support with ${esc(a.title)} is useful when access, technical implementation, research depth or ongoing management exceeds the time and skills available internally. Ask for a written scope, named deliverables, ownership and reporting method. You should understand the ${esc(a.cat)} work even when you are not doing it yourself.</p>
  <h3>Can this process guarantee a result?</h3>
  <p>No. This ${esc(a.title)} process improves decision quality and implementation discipline; it cannot control competition, platform auctions, algorithm changes, customer demand or sales follow-up. Be cautious with anyone who guarantees rankings, leads or revenue without those dependencies.</p>
  <h3>How does Prosengit Kundu approach this work?</h3>
  <p>For work related to ${esc(a.title)}, Prosengit Kundu connects the ${esc(a.cat)} decision with its technical destination where relevant: content, advertising, social or YouTube marketing, B2B research, and custom HTML/CSS/JavaScript or WordPress development. The scope begins with the goal and available evidence. Review the <a href="/services.html">digital marketing and website services</a>, see related <a href="/portfolio.html">case studies</a>, or <a href="/contact.html">describe the project</a>.</p>`;
}

/* ---------------- generate articles ---------------- */
fs.mkdirSync(path.join(ROOT, 'blog'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'portfolio'), { recursive: true });

ARTICLES.forEach((a, i) => {
  const url = `${SITE}/blog/${a.slug}.html`;
  const { out: body, h2s } = processBody(`${a.body.trim()}\n${buildArticleWorkbook(a)}`);
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
const PROJECT_REVIEW = {
  web: {
    lens: 'The website had to connect business communication with a technically dependable front end. Page purpose, mobile behavior, loading cost, accessibility and search structure therefore belonged in the same review rather than in separate handoffs.',
    checks: ['Read every page at phone width and confirm that navigation, headings and the main action remain understandable.', 'Check semantic headings, metadata, image dimensions, alternative text, sitemap entries and form behavior before launch.', 'Test the useful path from landing page to enquiry with a keyboard, touch input and a slow mobile connection.', 'Keep JavaScript proportional to the interaction so essential information is available without unnecessary processing.']
  },
  seo: {
    lens: 'The SEO work was treated as a decision system, not a promise of rankings. Research, technical evidence, page intent and implementation priority had to agree before ongoing activity could be useful.',
    checks: ['Separate crawl or indexation defects from content opportunities and off-site assumptions.', 'Map every priority query family to one intended page and review possible cannibalization.', 'Explain each recommendation with impact, evidence, owner and a way to verify completion.', 'Use Search Console and analytics as directional evidence while acknowledging seasonality and other influences.']
  },
  ads: {
    lens: 'The paid-media structure had to protect the client-owned budget and make learning possible. Audience or keyword intent, message, destination, conversion event and follow-up were reviewed as one chain.',
    checks: ['Confirm account ownership, access, billing and primary conversion definitions before launch.', 'Keep campaign groups coherent enough that search terms, audiences and creative can be interpreted.', 'Review the landing-page promise and form path from a real mobile device.', 'Connect platform events with lead quality rather than optimizing only for the cheapest recorded action.']
  },
  lead: {
    lens: 'The research deliverable needed to be usable by the next person in the sales process. Clear inclusion rules, source traceability, normalization and verification were therefore more important than collecting the largest possible number of rows.',
    checks: ['Test a sample against every ICP requirement before scaling the research.', 'Keep company facts, contact facts, source and verification date in clearly defined fields.', 'Normalize formats and remove duplicates without hiding uncertainty or guessing missing information.', 'Hand over suppression, privacy and responsible-use notes with the organized file.']
  },
  design: {
    lens: 'The visual work needed to communicate at the size and context where people would actually see it. Hierarchy, readability, brand consistency and platform-ready export mattered alongside appearance.',
    checks: ['Review the design at actual mobile or feed size instead of only on a large artboard.', 'Check contrast, focal point, text hierarchy and safe areas for the intended platform.', 'Keep editable source organization and export naming understandable for future use.', 'Judge creative variants by the communication problem they test, not by decoration alone.']
  }
};

function buildProjectReview(p) {
  const g = PROJECT_REVIEW[p.cat];
  const deliverables = p.work.map((item, i) => `<li><strong>${esc(item)}.</strong> This item was reviewed as part of the stated project scope. Its completion check focused on whether the deliverable supported the project goal and could be understood or used by the client after handover, rather than adding an unsupported performance claim.</li>`).join('');
  const checks = g.checks.map((x, i) => `<li><strong>Check ${i + 1}:</strong> ${esc(x)}</li>`).join('');
  return `<section class="mt-12">
    <div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">PROJECT REVIEW</div>
    <h2 class="text-3xl heading-font font-bold mt-3">How the work was evaluated</h2>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">${esc(g.lens)}</p>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">The project brief identifies the work as <strong>${esc(p.client)}</strong>, in the ${esc(p.industry)} context, with a stated timeline of ${esc(p.duration)}. Those labels are preserved exactly. This review expands the reasoning around the documented scope; it does not add a client name, confidential detail, ranking, revenue figure, conversion rate or other result that is absent from the source record.</p>

    <h3 class="text-xl heading-font font-bold mt-9">From brief to an executable scope</h3>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">The focus was ${esc(p.focus)}. A useful scope translates that focus into assets and checks that another person can review. It also separates delivery from business outcomes. Delivery can be verified through files, settings, pages, research fields or campaign structure. Business impact requires observation after implementation and can be influenced by the offer, market, budget, competition and client follow-up.</p>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Before execution, the practical questions are straightforward: What must be delivered? Which access or source material is required? Who approves it? What would make the item complete? What remains outside scope? Answering these questions reduces revision loops and protects both the client and freelancer from vague expectations.</p>

    <h3 class="text-xl heading-font font-bold mt-9">Deliverable-by-deliverable quality notes</h3>
    <ul class="mt-5 space-y-4 text-gray-600 dark:text-gray-300">${deliverables}</ul>

    <h3 class="text-xl heading-font font-bold mt-9">Technical and practical checks</h3>
    <ul class="mt-5 space-y-3 text-gray-600 dark:text-gray-300">${checks}</ul>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Quality assurance should follow the real delivery environment. That may mean reviewing mobile pages, validating a spreadsheet sample, checking search terms in an account, or opening exported creative at platform size. A tool report is supporting evidence; it is not a replacement for using the deliverable as the intended person would.</p>

    <h3 class="text-xl heading-font font-bold mt-9">Measurement without invented results</h3>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">The documented outcome for this project is: ${esc(p.outcome)} This wording describes what was delivered. Where the source does not include post-delivery numbers, this case study does not manufacture them. A responsible next phase would establish a baseline, define the relevant business action and observe a suitable period before drawing conclusions.</p>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">Useful measurement depends on the project category. Website work may track form health, speed and qualified enquiries; SEO work may review indexation, relevant query visibility and organic actions; advertising may connect platform conversions to accepted leads; research may track verification and sales acceptance; design may assess readability, consistency and response in context. These are measurement options, not claimed results for this project.</p>

    <h3 class="text-xl heading-font font-bold mt-9">What this case study can help a prospective client decide</h3>
    <p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">A prospective client can use the scope to compare needs, not to assume an identical project. The most useful information to share before requesting a quote is the business goal, audience, current assets or accounts, required deliverables, target market, deadline and known constraints. That makes it possible to recommend a focused starting point and identify dependencies before a price is confirmed.</p>

    <h2 class="text-3xl heading-font font-bold mt-12">Project questions</h2>
    <h3 class="text-xl heading-font font-bold mt-7">Can the same approach be used in another industry?</h3>
    <p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">The planning principles can transfer, but the research, language, audience and acceptance criteria must be adapted. Reusing a process is sensible; copying assumptions, creative or keywords without market evidence is not.</p>
    <h3 class="text-xl heading-font font-bold mt-7">Does this case study guarantee the same outcome?</h3>
    <p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">No. It documents the existing project scope and delivered status. Search, advertising, sales and website outcomes depend on factors beyond a single deliverable. Any new project should begin with its own baseline and written scope.</p>
    <h3 class="text-xl heading-font font-bold mt-7">What should be provided for a similar quotation?</h3>
    <p class="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">Share the goal, relevant URL or account context, audience and location, available content or data, deadline and preferred communication route. Use the <a href="/contact.html" class="text-[#0A66C2] font-semibold">contact page</a> to discuss the scope, or compare the documented starting points on the <a href="/pricing.html" class="text-[#0A66C2] font-semibold">pricing page</a>.</p>
  </section>`;
}

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
        ${buildProjectReview(p)}
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
