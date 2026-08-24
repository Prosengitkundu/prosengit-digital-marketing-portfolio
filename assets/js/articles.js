/* =====================================================================
   BLOG ARTICLES DATA — Prosengit Kundu
   ---------------------------------------------------------------------
   Each article object:
   id, title, cat, date, read, excerpt, img, body (HTML string)
   Rendered by blog.html and blog-details.html
   ===================================================================== */

const ARTICLES = [

/* -------------------------------------------------- 1 */
{
  id: 1,
  title: "How to Choose the Right SEO Service for Your Business",
  cat: "SEO",
  date: "Aug 18, 2026",
  read: "11 min read",
  excerpt: "SEO is not one service — it is a family of them. Here is how to match the right type of SEO support to your business stage, budget and goals.",
  img: "assets/images/work/seo-analytics-dashboard.jpg",
  body: `
  <p>Search engine optimization is probably the most misunderstood service in digital marketing. Some businesses buy "SEO" expecting first-page rankings in a month. Others avoid it entirely because a previous provider took their money and disappeared behind vague reports. The truth is simpler and less dramatic: SEO is a set of specific, measurable services — audits, keyword research, on-page optimization, technical fixes, content strategy and authority building — and the right starting point depends on where your website is today.</p>
  <p>This guide will help you understand which SEO service your business actually needs right now, what each one should deliver, and what a realistic timeline looks like, so you can invest with confidence instead of guesswork.</p>

  <h2>First, understand what "SEO services" actually include</h2>
  <p>When an SEO specialist talks about optimization, they are usually referring to work in four broad areas:</p>
  <ul>
    <li><strong>Technical SEO</strong> — making sure search engines can crawl, understand and index your website without errors. This covers site structure, sitemaps, robots.txt, page speed, mobile usability, canonical URLs, structured data and Core Web Vitals.</li>
    <li><strong>On-page SEO</strong> — optimizing individual pages for search intent: title tags, meta descriptions, heading hierarchy, content quality, internal linking, URL structure and image optimization.</li>
    <li><strong>Content and keyword strategy</strong> — researching what your customers actually type into Google, understanding the intent behind those queries, and mapping content to each stage of the buying journey.</li>
    <li><strong>Off-page SEO</strong> — building the reputation of your domain through ethical, relevant mentions, citations and links. This is the slowest layer and the one most often abused by low-quality providers.</li>
  </ul>
  <p>A trustworthy provider will tell you which of these areas your website needs first. A risky provider will promise "all of it" for a price that is too low to justify any of it.</p>

  <h2>Match the service to your situation</h2>
  <h3>1. New website, no SEO history</h3>
  <p>If your website is new, do not start with link building. Start with <strong>foundations</strong>: keyword research, a clean site structure, proper on-page setup on your key pages, and technical basics like sitemap submission and Search Console verification. This is exactly what a starter SEO package covers — the work that makes every future effort more effective.</p>
  <h3>2. Existing website, declining or flat traffic</h3>
  <p>Start with an <strong>SEO audit</strong>. A proper audit will identify why visibility is stuck: technical errors, thin content, cannibalizing pages, missing metadata or slow pages. Never buy "monthly SEO" before an audit has told you what the monthly work should actually be.</p>
  <h3>3. Local business serving one city or region</h3>
  <p>You need <strong>local SEO</strong>: Google Business Profile optimization, consistent business information across directories, local landing pages and review strategy. Local SEO is often the highest-ROI channel a small local business can invest in, because competition is limited to your area.</p>
  <h3>4. Content-rich site that needs a system</h3>
  <p>If you already publish content but rankings are inconsistent, you likely need <strong>content strategy and internal linking</strong> — clustering topics, strengthening key pages and removing duplication — rather than more new content.</p>

  <h2>Questions to ask before you commit</h2>
  <ol>
    <li><strong>What exactly will you deliver each month?</strong> If the answer is "SEO work", ask again. You should receive named deliverables: pages optimized, keywords targeted, technical issues resolved.</li>
    <li><strong>How do you report progress?</strong> Look for rankings, organic sessions, impressions and conversions from Search Console and Analytics — not screenshots of private tools.</li>
    <li><strong>What will you NOT do?</strong> A good specialist will tell you what is out of scope. Boundaries are a sign of professionalism, not limitations.</li>
    <li><strong>What is a realistic timeline?</strong> SEO typically shows meaningful movement in 3–6 months and compounds afterward. Anyone guaranteeing a #1 ranking in 30 days is selling risk, not results.</li>
  </ol>

  <h2>Red flags worth walking away from</h2>
  <ul>
    <li>Guaranteed rankings — no honest specialist controls Google's algorithm.</li>
    <li>Pricing that seems impossibly cheap for "full SEO".</li>
    <li>No audit or discovery step before asking for payment.</li>
    <li>Link packages sold by volume (100 links/month) rather than relevance.</li>
  </ul>

  <h2>A practical way to start</h2>
  <p>If you are unsure, begin with the smallest useful step: an audit or a starter package that covers audit + keyword research + on-page basics. This gives you a baseline, a prioritized action list and a working relationship you can evaluate — before you commit to anything larger. You can compare starting scopes and prices on the <a href="pricing.html">pricing page</a>, or browse the <a href="services.html">full SEO service list</a> to see each deliverable in detail.</p>
  <p>Choosing the right SEO service is not about finding the biggest package. It is about finding the right next step — and building from there.</p>`
},

/* -------------------------------------------------- 2 */
{
  id: 2,
  title: "What Is Keyword Research and Why Is It Important for SEO?",
  cat: "SEO",
  date: "Aug 6, 2026",
  read: "12 min read",
  excerpt: "Keyword research is the foundation every other SEO task stands on. Learn what it involves, how search intent works, and how to find keywords you can actually win.",
  img: "assets/images/work/keyword-research-spreadsheet.jpg",
  body: `
  <p>Every SEO campaign succeeds or fails at the keyword research stage. You can write excellent content, fix every technical issue and earn strong links — but if you are targeting the wrong keywords, you are optimizing a road to nowhere. Keyword research is the process of discovering what your potential customers actually search for, understanding the intent behind those searches, and deciding which of them your website should compete for.</p>
  <p>Done well, it tells you what to create, how to structure it, which pages to prioritize and what language your customers use. Done badly (or skipped), it leads to content nobody finds.</p>

  <h2>What keyword research actually involves</h2>
  <p>Keyword research is more than pulling a list of terms from a tool. A complete process includes:</p>
  <ul>
    <li><strong>Seed keyword generation</strong> — listing the core topics your business serves, from your services to the problems you solve.</li>
    <li><strong>Expansion</strong> — finding the long-tail variations people type when they are closer to a decision ("affordable seo services for small business in khulna" versus "seo").</li>
    <li><strong>Search intent classification</strong> — deciding whether each query is informational (learning), commercial (comparing) or transactional (ready to act).</li>
    <li><strong>Difficulty and opportunity assessment</strong> — estimating how hard each keyword is to rank for given your site's current authority, and where quick wins exist.</li>
    <li><strong>Mapping</strong> — assigning each target keyword to a specific page on your site so pages never compete with each other.</li>
  </ul>

  <h2>Why search intent matters more than search volume</h2>
  <p>Beginners chase volume. Professionals chase intent. A keyword with 50,000 monthly searches is worthless to a local service business if 95% of searchers want free information or a global brand. Meanwhile, a 90-search-per-month keyword like "b2b lead generation for saas companies" can be worth far more, because the searcher knows exactly what they need.</p>
  <p>The practical way to judge intent is to <strong>search the keyword yourself</strong> and study what Google rewards on page one:</p>
  <ul>
    <li>Are the results blog posts, product pages, local map packs or videos?</li>
    <li>How strong are the ranking domains? Can your site realistically belong there?</li>
    <li>What formats, angles and questions do the top results cover?</li>
  </ul>
  <p>This simple habit — studying the search results before creating anything — prevents the most common content mistake: writing the wrong type of page for a keyword.</p>

  <h2>Long-tail keywords: where small businesses win</h2>
  <p>Long-tail keywords are longer, more specific queries. Individually they get less traffic, but collectively they drive the majority of searches, and they convert better because the searcher is further along. Examples:</p>
  <ul>
    <li>"seo expert" — broad, vague, extremely competitive.</li>
    <li>"seo specialist for local business websites" — clearer intent, more reachable.</li>
    <li>"how much does technical seo cost for small business" — high commercial intent, perfect for a service or blog page.</li>
  </ul>
  <p>For a new or small website, a realistic strategy is to dominate its long-tail layer first, build authority and traffic, then compete for broader terms from a position of strength.</p>

  <h2>Common keyword research mistakes</h2>
  <ol>
    <li><strong>Targeting keywords with no realistic path to ranking.</strong> A new site will not outrank established giants on head terms in month one.</li>
    <li><strong>Ignoring intent.</strong> Pointing a blog post at a keyword where Google only ranks product pages (or vice versa).</li>
    <li><strong>Keyword cannibalization.</strong> Optimizing five pages for the same term so they split authority and none of them wins.</li>
    <li><strong>One-and-done research.</strong> Search behavior shifts; keyword maps need periodic review.</li>
    <li><strong>Stuffing instead of writing.</strong> Keywords should appear naturally in titles, headings and body text — not repeated unnaturally.</li>
  </ol>

  <h2>What you should receive from a keyword research service</h2>
  <p>If you order keyword research as a standalone service, you should expect more than an exported spreadsheet. A professional deliverable typically includes:</p>
  <ul>
    <li>A mapped keyword list with volume, difficulty and intent labels</li>
    <li>Prioritized recommendations (what to target first and why)</li>
    <li>Page-to-keyword mapping for your existing site</li>
    <li>Content gap observations — what competitors rank for that you do not</li>
    <li>Local keyword opportunities where relevant</li>
  </ul>
  <p>Keyword research is the cheapest place to get SEO right and the most expensive place to get it wrong. If you want a second opinion on your current keyword targets — or a research project built from scratch — see the <a href="services.html">keyword research service</a> or <a href="contact.html">send me your website</a> and I will show you where the realistic opportunities are.</p>`
},

/* -------------------------------------------------- 3 */
{
  id: 3,
  title: "How SERP Analysis Helps Build a Better SEO Strategy",
  cat: "SEO",
  date: "Jul 28, 2026",
  read: "10 min read",
  excerpt: "Google already tells you what it wants to rank for every keyword. SERP analysis is how you listen — before you write a single word.",
  img: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Most SEO advice starts with tools: check search volume, check difficulty, pick keywords. But there is a research step that is older than every tool and still more reliable: actually reading the search engine results page (SERP). SERP analysis is the practice of studying what Google chooses to rank for your target keyword — and building your strategy from that evidence instead of assumptions.</p>
  <p>Google spends enormous effort matching results to searcher intent. When you analyze the SERP carefully, you are borrowing that intelligence for free.</p>

  <h2>What the SERP tells you</h2>
  <h3>1. The dominant content type</h3>
  <p>Search "best crm for small business" and you will see list-style reviews and comparisons. Search "crm pricing" and you will see pricing pages. Search "what is a crm" and you will see definitions and guides. Google has already learned what searchers want for each query — the results page is the answer. If you publish a product page against a keyword where only guides rank, you will not rank, no matter how good the page is.</p>
  <h3>2. SERP features and what they signal</h3>
  <ul>
    <li><strong>Featured snippets</strong> — Google rewards concise, structured answers. Lists, tables and step-by-step formats have a shot at this placement.</li>
    <li><strong>People Also Ask boxes</strong> — a free list of sub-questions your page should answer.</li>
    <li><strong>Local map pack</strong> — the keyword has local intent; local SEO and Google Business Profile matter as much as your website.</li>
    <li><strong>Shopping or image results</strong> — visual or transactional intent; product feeds and image SEO deserve attention.</li>
    <li><strong>Video carousel</strong> — video content has a seat at the table; consider YouTube.</li>
  </ul>
  <h3>3. Who you are competing against</h3>
  <p>Look at the domains on page one. If the keyword is dominated by Wikipedia, Amazon and global publishers, that keyword is probably not your next move. If page one includes small blogs, forum threads or weaker pages from generalist sites, the keyword is realistically winnable with better content and basic authority work.</p>

  <h2>How to run a SERP analysis in 20 minutes</h2>
  <ol>
    <li><strong>Search your target keyword</strong> in an incognito window, ideally from your target country.</li>
    <li><strong>Record the content types</strong> on page one: guide, product page, category page, tool, video, local business.</li>
    <li><strong>Open the top 3–5 results</strong> and note their structure: headings, sections, word count, tables, images, FAQs.</li>
    <li><strong>List the sub-topics they all cover</strong> — these are table stakes; your page must cover them too.</li>
    <li><strong>Find what they miss</strong> — outdated data, missing steps, weak mobile experience, unanswered questions from the People Also Ask box.</li>
    <li><strong>Decide your angle:</strong> can you be more complete, more local, more current, better structured or genuinely more useful?</li>
  </ol>

  <h2>Turning analysis into strategy</h2>
  <p>SERP analysis converts directly into decisions:</p>
  <ul>
    <li><strong>Keyword selection:</strong> skip keywords where the SERP is locked by domains you cannot beat yet.</li>
    <li><strong>Page format:</strong> mirror the content type Google rewards, then improve on it.</li>
    <li><strong>Content outline:</strong> build your heading structure from the common sections of top results plus the gaps you found.</li>
    <li><strong>Internal linking:</strong> see which related queries appear in People Also Ask and link to pages covering them.</li>
    <li><strong>Channel strategy:</strong> if videos or local packs dominate, adjust the plan — YouTube SEO or local SEO instead of only blog content.</li>
  </ul>

  <h2>A small example</h2>
  <p>Imagine a training center wants to rank for "digital marketing course". The SERP shows big course platforms, local institutes in the map pack, and a People Also Ask box full of price and duration questions. The analysis says: a generic page will not win; a <em>city-specific</em> page that clearly answers fee, duration, syllabus and outcomes — with structured data and a strong Google Business Profile — can compete in the local layer where the real customers are.</p>
  <p>That single insight is worth more than a month of blind publishing, and it cost twenty minutes of reading.</p>

  <h2>Make SERP analysis a habit</h2>
  <p>Before every important page, spend twenty minutes on the SERP. It is the highest-leverage research habit in SEO — and it is exactly how I begin keyword and content projects. If you want this kind of evidence-first planning for your website, look at the <a href="services.html">SEO services overview</a> or <a href="contact.html">start a conversation</a> about your goals.</p>`
},

/* -------------------------------------------------- 4 */
{
  id: 4,
  title: "On-Page SEO Checklist for Small Business Websites",
  cat: "SEO",
  date: "Jul 15, 2026",
  read: "13 min read",
  excerpt: "A practical, no-fluff checklist of on-page SEO essentials — titles, meta descriptions, headings, internal links, URLs and image optimization — you can apply page by page.",
  img: "https://images.pexels.com/photos/6248959/pexels-photo-6248959.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>On-page SEO is the part of search optimization you fully control: the content, structure and HTML of your own pages. It is also where small businesses get the fastest wins, because most small business websites have the same recurring gaps — missing metadata, confusing headings, no internal links and unoptimized images.</p>
  <p>This checklist is written to be used, not just read. Work through it for each important page on your website, starting with your homepage and your best service pages.</p>

  <h2>1. Title tags</h2>
  <ul>
    <li>Include the primary keyword naturally — near the front when it reads well.</li>
    <li>Keep it under roughly 60 characters so it does not get cut off in results.</li>
    <li>Make it readable and persuasive — the title is your listing's headline, not a keyword container.</li>
    <li>Give every page a <strong>unique</strong> title. Duplicated titles waste the signal and confuse searchers.</li>
  </ul>
  <p class="example">Good: <em>"Custom Website Development in HTML, CSS &amp; JavaScript | Prosengit Kundu"</em>. Bad: <em>"Home | Company | Home"</em>.</p>

  <h2>2. Meta descriptions</h2>
  <ul>
    <li>Aim for 150–160 characters that summarize the page and invite the click.</li>
    <li>Include the keyword where natural — Google bolds matching terms.</li>
    <li>Add a soft call to action: "Get a free quote", "See examples", "Book a session".</li>
    <li>Meta descriptions do not directly affect rankings, but they strongly affect click-through rate — and clicks matter.</li>
  </ul>

  <h2>3. Heading structure (H1–H3)</h2>
  <ul>
    <li><strong>One H1 per page</strong>, aligned with the page's main keyword and purpose.</li>
    <li>Use H2s for the main sections and H3s for subsections — a logical outline a reader can scan.</li>
    <li>Put keywords in headings where they genuinely describe the section. Never force them.</li>
    <li>Headings are also accessibility tools: screen readers navigate by them, so clear structure helps everyone.</li>
  </ul>

  <h2>4. Content quality and keyword placement</h2>
  <ul>
    <li>Open with a paragraph that proves the page answers the searcher's intent.</li>
    <li>Use the primary keyword and natural variations (synonyms, related terms) throughout — write for humans first.</li>
    <li>Cover the subtopics searchers expect; check the People Also Ask box for your keyword.</li>
    <li>Prefer specific detail over filler. A shorter page that answers completely beats a long page that rambles.</li>
    <li>Update important pages regularly — dates, prices, examples and screenshots age.</li>
  </ul>

  <h2>5. URL structure</h2>
  <ul>
    <li>Short, lowercase, hyphen-separated URLs: <em>/services/technical-seo</em> beats <em>/page?id=128&amp;cat=7</em>.</li>
    <li>Include the keyword when it is natural. Do not change URLs casually — redirects dilute value.</li>
    <li>Keep site depth shallow: important pages should be reachable within a few clicks from the homepage.</li>
  </ul>

  <h2>6. Internal linking</h2>
  <ul>
    <li>Link from related pages using descriptive anchor text — "on-page SEO checklist", not "click here".</li>
    <li>Every new page should receive at least 2–3 internal links from existing pages.</li>
    <li>Link service pages to supporting blog content and blog content back to service pages. This is how you tell Google which pages matter.</li>
  </ul>

  <h2>7. Image optimization</h2>
  <ul>
    <li>Compress images before upload and use modern formats like WebP where possible.</li>
    <li>Use descriptive filenames: <em>khulna-seo-audit-report.webp</em>, not <em>IMG_0042.jpg</em>.</li>
    <li>Write alt text that describes the image — for accessibility first, SEO second.</li>
    <li>Set width and height attributes to prevent layout shifts.</li>
  </ul>

  <h2>8. The technical minimum every page deserves</h2>
  <ul>
    <li>Mobile-friendly layout — Google indexes the mobile version first.</li>
    <li>Fast loading — audit slow pages and fix oversized images or scripts.</li>
    <li>Canonical tags pointing to the page's own URL.</li>
    <li>Indexable content: no accidental noindex tags, no important text trapped in images.</li>
  </ul>

  <h2>9. Conversions: the other half of on-page work</h2>
  <p>Ranking is only useful if the page convinces. Every service page should have a clear next step — a visible contact method, a quote button, a phone number — and trust signals like real work samples, testimonials and transparent pricing. SEO brings the visitor; on-page persuasion decides what happens next.</p>

  <h2>How to use this checklist</h2>
  <p>Pick your five most important pages. Score each against the nine sections above, fix the gaps, then track impressions and clicks in Google Search Console over the following weeks. Most sites see movement from these basics alone — they are exactly what my <a href="pricing.html">SEO Starter package</a> covers. If you would rather have it done with you, see the <a href="services.html">on-page SEO service</a> or <a href="contact.html">request an audit</a> first.</p>`
},

/* -------------------------------------------------- 5 */
{
  id: 5,
  title: "Technical SEO Basics for New Websites",
  cat: "SEO",
  date: "Jul 3, 2026",
  read: "12 min read",
  excerpt: "Crawling, indexing, sitemaps, robots.txt, canonicals, speed and structured data — the technical foundations every new website should get right from day one.",
  img: "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Technical SEO has a reputation for being intimidating, but for a new website the essentials are surprisingly manageable. The goal is simple: make sure search engines can find your pages, understand them, store them in the index and serve them to the right searches — without technical obstacles getting in the way.</p>
  <p>Getting these basics right at launch is dramatically cheaper than repairing them later, when structure changes require redirects and re-indexing. Here is what matters, in priority order.</p>

  <h2>1. Make your site crawlable</h2>
  <p>Search engines discover content by following links. Your job is to make that journey easy:</p>
  <ul>
    <li>Every important page should be reachable by clicking links from somewhere else on the site — no orphan pages.</li>
    <li>Use clean HTML links. Content that only appears after complex JavaScript interaction should be used carefully; if Google cannot see it reliably, it cannot rank it.</li>
    <li>Create a logical structure: homepage → category/service pages → detail pages, ideally within three or four clicks of the homepage.</li>
  </ul>

  <h2>2. Tell Google what to crawl: robots.txt</h2>
  <p>The robots.txt file sits at yoursite.com/robots.txt and instructs crawlers which areas to skip. Keep it simple and permissive for content you want ranked. Common uses: blocking admin folders, staging environments or search-result pages that create duplicate URLs. A single wrong line (like blocking the whole site) can remove a website from search — check it after any platform migration.</p>

  <h2>3. Submit a sitemap</h2>
  <p>An XML sitemap lists the pages you want indexed. Keep it accurate: only canonical, indexable, valuable pages. Submit it in Google Search Console and monitor the <em>Page indexing</em> report — it tells you which URLs were discovered, indexed or excluded and why. Search Console is free and it is the single most important diagnostic tool in technical SEO.</p>

  <h2>4. Solve duplicate content with canonical URLs</h2>
  <p>Most duplicate content is accidental: www vs non-www, http vs https, trailing slashes, parameter-based URLs and paginated pages all create near-copies. Left alone, they split ranking signals across versions. The fixes are standard:</p>
  <ul>
    <li>Choose one canonical hostname and protocol, and redirect the rest (e.g. everything to https://www).</li>
    <li>Use rel="canonical" tags to name the preferred version of a page.</li>
    <li>Avoid publishing the same article at multiple URLs; use redirects when URLs must change.</li>
  </ul>

  <h2>5. Be mobile-first</h2>
  <p>Google predominantly uses the mobile version of your pages for indexing and ranking. Test your site on a real phone: readable text without zooming, tap targets that are comfortable, no horizontal scrolling, and content identical to the desktop version. A responsive layout is the modern default and removes the need for separate mobile URLs.</p>

  <h2>6. Care about page speed — proportionally</h2>
  <p>Speed is a ranking factor and, more importantly, a user experience factor. For a typical small business site, the biggest wins are boring and effective:</p>
  <ul>
    <li>Compress and correctly size images (usually the #1 problem).</li>
    <li>Minify CSS/JavaScript and remove unused libraries.</li>
    <li>Use caching and a CDN where practical.</li>
    <li>Lazy-load below-the-fold images.</li>
  </ul>
  <p>Measure with PageSpeed Insights and Core Web Vitals (LCP, INP, CLS), then optimize the slowest, most important pages first. Do not chase perfect scores on pages no one visits.</p>

  <h2>7. Add structured data</h2>
  <p>Structured data (schema.org markup in JSON-LD) describes your content to machines: this is a local business, this is a service with a price range, this is an article with an author. It powers rich results and helps search engines classify your pages. Keep it truthful — markup that misrepresents the page can trigger penalties. Common useful types: Organization, LocalBusiness, Service, Article, FAQPage and BreadcrumbList.</p>

  <h2>8. HTTPS and basic health</h2>
  <p>Serve everything over HTTPS with a valid certificate — browsers now label plain HTTP as "not secure", which damages trust and conversions. Alongside HTTPS, check for broken links (404s), soft-404 pages (empty pages returning "success") and redirect chains, all of which waste crawl budget and frustrate users.</p>

  <h2>A launch-day technical checklist</h2>
  <ol>
    <li>HTTPS live on all URLs, no mixed-content warnings</li>
    <li>robots.txt present and not blocking anything important</li>
    <li>XML sitemap generated and submitted to Search Console</li>
    <li>Google Analytics (or an alternative) installed</li>
    <li>One H1 and unique title/meta description per page</li>
    <li>Canonical tags in place</li>
    <li>Mobile layout verified on a real device</li>
    <li>Test in PageSpeed Insights; fix anything obviously heavy</li>
    <li>Structured data added for organization/service types</li>
    <li>Checked from the outside: site:(yourdomain) search shows your pages</li>
  </ol>
  <p>None of this requires a huge budget — it requires doing it deliberately, once, at the start. If your website missed some of these steps, a <a href="services.html">technical SEO audit</a> will pinpoint exactly what to fix, and the <a href="pricing.html">SEO packages</a> cover the remediation work. Questions about a specific issue? <a href="contact.html">Send me the URL</a> — I look at new websites all the time.</p>`
}
,

/* -------------------------------------------------- 6 */
{
  id: 6,
  title: "What Makes a Website SEO-Friendly? 12 Essentials",
  cat: "SEO",
  date: "Jun 20, 2026",
  read: "10 min read",
  excerpt: "An SEO-friendly website is built, not retrofitted. These twelve essentials separate sites that rank from sites that forever fight their own platform.",
  img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Every website owner wants to "be on Google". Far fewer ask the prior question: is this website technically capable of ranking? An SEO-friendly website is one where nothing structural stands between good content and search visibility — where crawling, indexing, speed, semantics and content organization all pull in the same direction.</p>
  <p>Here are the twelve essentials I check when reviewing whether a website is built for search.</p>

  <h2>The twelve essentials</h2>
  <ol>
    <li><strong>Clean, semantic HTML.</strong> Real headings (one H1, logical H2/H3), paragraphs, lists and descriptive links. Semantic markup helps search engines — and screen readers — understand the page.</li>
    <li><strong>Unique, descriptive titles and meta descriptions</strong> on every indexable page, written for the specific query each page targets.</li>
    <li><strong>Logical URL structure.</strong> Short, readable, keyword-relevant URLs organized into a shallow hierarchy (example.com/services/local-seo).</li>
    <li><strong>XML sitemap and robots.txt</strong>, both accurate, both referenced in Google Search Console.</li>
    <li><strong>Mobile-first responsive design.</strong> One adaptive layout that works from 360px phones to desktops, with no content hidden on mobile.</li>
    <li><strong>Fast loading.</strong> Compressed images, minimal scripts, caching, and Core Web Vitals (LCP, INP, CLS) in healthy ranges.</li>
    <li><strong>HTTPS everywhere</strong> with valid certificates and no mixed content.</li>
    <li><strong>Canonical URLs</strong> to prevent duplicate-content dilution across parameters, pagination and www variants.</li>
    <li><strong>Structured data</strong> (Organization, LocalBusiness, Service, Article, FAQ, Breadcrumbs) that truthfully describes the site.</li>
    <li><strong>Internal linking architecture</strong> — related pages connected with descriptive anchors, so authority flows to priority pages.</li>
    <li><strong>Image optimization</strong> — compressed files, WebP where appropriate, descriptive filenames and honest alt text.</li>
    <li><strong>Clear conversion paths</strong> — visible contact options and calls to action, because rankings are only valuable when visits can become inquiries.</li>
  </ol>

  <h2>Why raw-code websites often have an advantage here</h2>
  <p>There is a reason developers who hand-write HTML, CSS and JavaScript lean on this list naturally: nothing generates itself. Every heading, URL, script and image is a deliberate decision. A custom-coded site ships with only the markup it needs — no theme bloat, no plugin conflicts, no page-builder div soup that weighs down Core Web Vitals.</p>
  <p>That does not mean a CMS cannot be SEO-friendly — a well-maintained WordPress install with disciplined optimization can absolutely rank. But it does mean a custom-coded website starts with structural control: exactly the semantic markup, asset weight and URL structure you intended, and nothing more.</p>

  <h2>The honest trade-offs</h2>
  <ul>
    <li><strong>Custom code:</strong> maximum control and performance; requires a developer for structural changes.</li>
    <li><strong>WordPress:</strong> easy content management and plugin ecosystem; requires ongoing maintenance, security updates and speed discipline to stay fast.</li>
  </ul>
  <p>The right answer depends on who will run the site after launch. What matters is that SEO requirements are treated as build requirements, not a coat of paint applied later.</p>

  <h2>How to audit your own site in 15 minutes</h2>
  <ol>
    <li>Pick three pages. Do they each have a unique title and meta description? (View source or use a free snippet viewer.)</li>
    <li>Is there exactly one H1, and do subheadings form a logical outline?</li>
    <li>Do the URLs read cleanly, or are they full of parameters?</li>
    <li>Run the homepage through PageSpeed Insights. Anything under ~50 on mobile deserves attention.</li>
    <li>Search <em>site:yourdomain.com</em> on Google. Are the right pages indexed — and is anything indexed that should not be?</li>
  </ol>
  <p>If most items pass, your foundation is sound and content/authority work will pay off. If several fail, fix structure first — content built on a broken foundation underperforms no matter how good it is.</p>
  <p>My <a href="services.html">website development services</a> build these twelve essentials in from the first commit, and the <a href="pricing.html">Custom Website package</a> exists precisely for businesses that want an SEO-friendly site without platform compromises. Want a second opinion on your current site? <a href="contact.html">Ask for a free basic check</a>.</p>`
},

/* -------------------------------------------------- 7 */
{
  id: 7,
  title: "How to Improve Your Website's Search Visibility Step by Step",
  cat: "SEO",
  date: "Jun 8, 2026",
  read: "11 min read",
  excerpt: "Visibility is earned in layers: fix the technical base, aim at the right keywords, strengthen pages, earn authority and measure everything. A realistic roadmap.",
  img: "assets/images/work/seo-analytics-dashboard.jpg",
  body: `
  <p>"We want to be more visible on Google" is the most common goal small businesses bring to an SEO consultant — and the vaguest. Search visibility is not one lever you pull; it is the compound result of several layers working together. The good news: those layers can be improved in a deliberate order, and each one makes the next more effective.</p>
  <p>This is the same roadmap I use when planning visibility work for a website. It is deliberately unglamorous — and it works.</p>

  <h2>Step 1: Establish the baseline</h2>
  <p>Before changing anything, find out where you stand:</p>
  <ul>
    <li>Verify the site in <strong>Google Search Console</strong>. Note current impressions, clicks and average positions.</li>
    <li>Check the <em>Page indexing</em> report — are your key pages actually indexed?</li>
    <li>List the queries you already appear for, even on page two. These are your fastest opportunities.</li>
    <li>Install analytics so you can separate organic visitors from everything else.</li>
  </ul>
  <p>Without a baseline you will never know what worked, and you will be vulnerable to "trust me" reporting.</p>

  <h2>Step 2: Remove technical obstacles</h2>
  <p>Search engines must be able to crawl, render and index your pages before anything else matters. Common obstacles: noindex tags left from development, robots.txt blocking key directories, redirect chains, duplicate versions of the same page, slow-loading templates and mobile layout problems. Fix these first — they silently cap everything that follows.</p>

  <h2>Step 3: Choose battles you can win</h2>
  <p>Visibility follows keyword strategy:</p>
  <ul>
    <li>Map your services to realistic target queries — long-tail and local phrases first.</li>
    <li>Study the SERP for each: what content type ranks, and can you produce a better version?</li>
    <li>Assign one primary keyword per page so pages never compete with each other.</li>
  </ul>
  <p>A small site that owns twenty specific queries beats a small site chasing one impossible head term.</p>

  <h2>Step 4: Strengthen the pages themselves</h2>
  <p>With targets chosen, upgrade the pages: compelling unique titles and meta descriptions, a single clear H1, headings that organize the answer, complete coverage of the subtopics searchers expect, internal links from related pages, optimized images and an obvious next step for the visitor. Treat every important page as a landing page, because for someone it is.</p>

  <h2>Step 5: Publish with purpose</h2>
  <p>Consistent, intent-driven content earns visibility for queries your service pages cannot target: questions, comparisons, how-tos and local topics. A practical rhythm for most small businesses is two to four genuinely useful articles per month, each mapped to a keyword, each internally linked to a service page. Quality and consistency beat volume bursts followed by silence.</p>

  <h2>Step 6: Earn authority ethically</h2>
  <p>Off-page signals remain important, but the era of link quantity is over. What compounds now:</p>
  <ul>
    <li>Business directories and citations with consistent name/address/phone data</li>
    <li>Local sponsorships, partnerships and community mentions</li>
    <li>Guest contributions where you have genuine expertise</li>
    <li>Resources good enough that people reference them voluntarily</li>
  </ul>
  <p>Avoid paid link networks and comment spam. They are a risk with no ceiling.</p>

  <h2>Step 7: Measure, review, iterate</h2>
  <p>Monthly, look at three things in Search Console: queries gaining impressions (opportunity — improve and internally link those pages), queries stuck on page two (refresh and strengthen), and pages losing impressions (investigate: competition, technical issue, or content decay). Visibility work is a loop, not a launch.</p>

  <h2>What timeline should you expect?</h2>
  <p>Honest expectations: technical fixes can show effect in weeks; content gains typically take 2–4 months to mature; competitive head terms take longer and depend on the authority you accumulate along the way. Anyone promising overnight rankings is selling a lottery ticket.</p>
  <p>If you want this roadmap executed for your website — as a one-time project or month by month — the <a href="pricing.html">SEO Growth package</a> is built exactly around it, and <a href="services.html">individual SEO services</a> cover each layer separately. Start with a <a href="contact.html">free basic check</a> if you just want to know where you stand.</p>`
},

/* -------------------------------------------------- 8 */
{
  id: 8,
  title: "SEO vs Google Ads: Which Is Better for Your Business?",
  cat: "Paid Ads",
  date: "May 26, 2026",
  read: "10 min read",
  excerpt: "One earns visibility over time, the other buys it today. A practical comparison of cost, speed, risk and long-term value — and why the best answer is usually both.",
  img: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Should you invest in SEO or Google Ads? It is one of the most frequent questions business owners ask, and most of the answers online are biased — written by someone who sells one of the two. The honest answer is that they solve different problems on different timelines, and the right mix depends on your cash flow, competition and how your customers buy.</p>

  <h2>What each channel actually is</h2>
  <p><strong>Google Ads (paid search)</strong> places your offer at the top of results almost immediately. You pay per click. Traffic stops the moment you stop paying, but while it runs you get fast feedback, precise targeting and full control over the message.</p>
  <p><strong>SEO (organic search)</strong> earns placements in the same results through relevance and authority. It takes months to build, but the traffic it generates does not have a per-click cost — and a ranking that holds is an asset your competitors cannot simply outbid.</p>

  <h2>The comparison that matters</h2>
  <h3>Speed</h3>
  <p>Ads win, decisively. A well-built campaign can produce qualified traffic the same week. SEO typically needs 3–6 months before meaningful movement, longer in competitive niches. If you need customers this month, ads are the honest answer.</p>
  <h3>Cost over time</h3>
  <p>Ads cost are linear: every visitor has a price, forever. SEO is front-loaded effort with a maintenance tail — after the heavy lifting, incremental traffic is comparatively cheap. Businesses that run both for a year usually find SEO's effective cost per visit falling while ads' stays flat or rises with competition.</p>
  <h3>Risk</h3>
  <p>Ads risk is financial: bad targeting or weak landing pages burn budget quickly, but you can pause instantly. SEO risk is temporal: months invested in the wrong keywords are unrecoverable, which is why research and measurement matter so much before the content machine starts.</p>
  <h3>Trust</h3>
  <p>Skip the mythology: serious buyers click both. That said, many users consciously skip ads, and an organic listing alongside an ad reinforces credibility — appearing twice on the same results page is one of the strongest positions a brand can hold.</p>
  <h3> Coverage</h3>
  <p>Ads only cover the keywords you fund. SEO content can capture hundreds of long-tail variations you would never buy — questions, comparisons, local modifiers — that together often exceed paid volume.</p>

  <h2>How to choose based on your situation</h2>
  <ul>
    <li><strong>New website, no rankings yet:</strong> run modest ads for your highest-intent keywords while SEO foundations are built. Ads buy you learning; SEO buys you compounding.</li>
    <li><strong>Established rankings, stagnant growth:</strong> shift some budget to SEO content and use ads only for high-margin offers or seasonal pushes.</li>
    <li><strong>One-time or event-based offer:</strong> ads. There is no time for SEO to mature.</li>
    <li><strong>Local service business:</strong> local SEO plus a tightly geotargeted search campaign is usually the highest-ROI pairing available.</li>
    <li><strong>Tight monthly budget:</strong> SEO with a long horizon, funded consistently, beats ads run too thin to generate meaningful data.</li>
  </ul>

  <h2>How the two channels improve each other</h2>
  <ol>
    <li><strong>Ads data feeds SEO strategy.</strong> The keywords that convert in ads are the keywords worth earning organically. You learn commercial intent in weeks instead of guessing for months.</li>
    <li><strong>SEO pages make ads cheaper.</strong> Ads quality scores reward relevant landing pages — the same optimized pages SEO produces.</li>
    <li><strong>Retargeting catches organic researchers.</strong> Many organic visitors are not ready to buy on the first visit; a modest retargeting campaign keeps you in front of them until they are.</li>
    <li><strong>Double presence doubles authority.</strong> Occupying both an ad slot and an organic listing on the same query measurably lifts combined clicks.</li>
  </ol>

  <h2>A balanced starting framework</h2>
  <p>For most small and mid-sized businesses I recommend: fund ads at a level you can sustain for at least 90 days (enough to learn), invest in SEO continuously at a level you can sustain for a year (enough to compound), and review the split quarterly using one metric — cost per qualified lead, not cost per click. Manage to leads and the channel debate settles itself.</p>
  <p>If you want help structuring either side, see <a href="services.html">Google Ads management and SEO services</a>, compare <a href="pricing.html">packages and pricing</a>, or <a href="contact.html">book a free consultation</a> to talk through your specific market.</p>`
},

/* -------------------------------------------------- 9 */
{
  id: 9,
  title: "Google Ads vs Meta Ads: Choosing the Right Platform for Your Goals",
  cat: "Paid Ads",
  date: "May 12, 2026",
  read: "11 min read",
  excerpt: "Google captures existing demand; Meta creates it. Understanding that single difference makes the platform decision almost automatic.",
  img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Businesses often ask which is "better" — Google Ads or Meta (Facebook/Instagram) Ads. It is the wrong frame. The platforms serve fundamentally different moments in a customer's journey, and the decision becomes easy once you understand what each one is actually selling you.</p>

  <h2>The core difference: demand capture vs demand creation</h2>
  <p><strong>Google Ads is demand capture.</strong> People type what they want — "emergency plumber near me", "seo audit service", "buy office chair dhaka". Your ad intercepts existing intent. You pay for proximity to a decision already in progress.</p>
  <p><strong>Meta Ads is demand creation.</strong> Nobody scrolls Instagram searching for your product. Meta shows your offer to people whose behavior suggests they <em>might</em> care, interrupting attention with something interesting enough to stop the scroll.</p>
  <p>Everything else — formats, costs, targeting logic, creative demands — flows from this distinction.</p>

  <h2>Where Google Ads wins</h2>
  <ul>
    <li><strong>High-intent services and products</strong> people actively search for: repairs, legal, medical, B2B services, "near me" queries.</li>
    <li><strong>Problem-aware audiences</strong> who know their need and are comparing providers right now.</li>
    <li><strong>Complex or niche B2B offers</strong> where search volume is low but each lead is valuable.</li>
    <li><strong>Local service ads</strong> — combining search ads with a Google Business Profile is often the fastest lead source a local business can build.</li>
  </ul>

  <h2>Where Meta Ads wins</h2>
  <ul>
    <li><strong>Visually compelling products</strong> — fashion, food, decor, gifts — where a photo or video creates desire people didn't arrive with.</li>
    <li><strong>Impulse and low-consideration purchases</strong> with clear pricing.</li>
    <li><strong>Audience building and retargeting</strong> — cheap reach, precise interests, lookalikes, and re-engagement of past visitors.</li>
    <li><strong>Brand awareness launches</strong> where you need many eyes before anyone searches your name.</li>
    <li><strong>Community-led businesses</strong> — courses, events, local brands with a story to tell.</li>
  </ul>

  <h2>Practical differences to plan for</h2>
  <h3>Creative workload</h3>
  <p>Google lives on keywords and ad copy; a well-structured search campaign can run for months on text. Meta lives on creative: images, video and hooks that fatigue in weeks. Budget for continuous creative production or your Meta costs will creep up as audiences tune out repeated ads.</p>
  <h3>Cost behavior</h3>
  <p>Google clicks are pricier per unit (especially in legal, finance, B2B) but convert more often because intent is higher. Meta clicks are cheaper but need more nurturing. Compare platforms on cost per <em>lead</em> or cost per <em>sale</em>, never cost per click.</p>
  <h3>Measurement</h3>
  <p>Both platforms over-credit themselves in their dashboards. Set up conversion tracking properly (pixels/tags, conversions imported to Google Ads, agreed attribution windows) or you will make budget decisions on marketing fiction.</p>

  <h2>A simple decision framework</h2>
  <ol>
    <li>Do people <strong>already search</strong> for what you sell? → Start with Google Search ads.</li>
    <li>Is your offer <strong>visual, new, or story-driven</strong>? → Start with Meta.</li>
    <li>Long sales cycle? → Meta for awareness and retargeting, Google to catch the moment of decision.</li>
    <li>Limited budget? → Pick the platform matching your strongest intent source and master it before splitting spend.</li>
  </ol>
  <p>The mature setup for most businesses is sequential, not exclusive: Meta introduces you to people who never heard of you; Google catches them when they start searching; retargeting on both keeps you present until they decide.</p>

  <h2>What both platforms require to work</h2>
  <p>Neither platform compensates for a weak offer or a slow, confusing landing page. Before spending on ads, make sure: the offer is specific, the landing page matches the ad's promise and loads fast, forms or WhatsApp buttons work on mobile, and someone answers inquiries quickly. Ads multiply what exists — they do not fix what is broken.</p>
  <p>I manage both Google Ads and Meta Ads campaigns, always with advertising budget kept separate and fully under the client's ownership. See the <a href="services.html">paid advertising services</a>, the <a href="pricing.html">Paid Advertising package</a>, or <a href="contact.html">start a conversation</a> about which platform fits your goals.</p>`
},

/* -------------------------------------------------- 10 */
{
  id: 10,
  title: "The Power of Retargeting: Turning Website Visitors into Customers",
  cat: "Paid Ads",
  date: "Apr 28, 2026",
  read: "9 min read",
  excerpt: "Most of your visitors leave without buying. Retargeting is how you stay in front of them until they're ready — often the highest-ROI money in marketing.",
  img: "assets/images/work/meta-ads-dashboard.jpg",
  body: `
  <p>Here is the statistic that explains most online business frustration: the large majority of first-time website visitors leave without buying, filling a form or sending a message. Not because the offer was bad — because they were busy, comparing options, or simply not ready yet. Retargeting (also called remarketing) is the discipline of staying visible to those people until readiness arrives.</p>
  <p>Pound for pound, retargeting is frequently the most efficient line in an advertising budget — because the audience is already warm.</p>

  <h2>How retargeting works</h2>
  <p>When someone visits your website, a small tag (a pixel) adds them to an audience list — "visited in the last 30 days", "viewed the pricing page", "abandoned the contact form". Advertising platforms then let you show ads specifically to those lists, or to lookalikes of them. That is the entire mechanism: permission-free memory of who showed interest, used politely.</p>

  <h2>Why it works so well</h2>
  <ul>
    <li><strong>Familiarity.</strong> People buy from names they recognize. Seeing your brand repeatedly after a visit builds that recognition at a very low cost per impression.</li>
    <li><strong>Timing.</strong> B2B purchases, services and considered purchases take days or weeks. Retargeting keeps you present across that entire window instead of hoping they remember you.</li>
    <li><strong>Context.</strong> You know what they looked at, so the ad can continue the exact conversation they started — the service page they read, the plan they considered.</li>
    <li><strong>Efficiency.</strong> Warm audiences convert at multiples of cold ones, so even small budgets can produce measurable revenue.</li>
  </ul>

  <h2>Retargeting segments worth building</h2>
  <ol>
    <li><strong>All visitors (30–90 days)</strong> — general brand presence, your broadest warm layer.</li>
    <li><strong>Service/page viewers</strong> — show the specific service they researched, with a relevant reason to act.</li>
    <li><strong>Pricing page visitors</strong> — high intent; answer objections (guarantees, payment terms, comparisons) in the creative.</li>
    <li><strong>Contact-form abandoners</strong> — the closest thing to a lost sale; a gentle reminder plus an easy alternative contact method (WhatsApp) recovers a surprising share.</li>
    <li><strong>Past customers</strong> — renewals, upsells and referrals; the most underrated list most businesses never build.</li>
  </ol>

  <h2>Creative that converts warm audiences</h2>
  <p>Cold ads must earn attention from strangers. Retargeting ads have a different job — advance a conversation already started:</p>
  <ul>
    <li><strong>Social proof:</strong> a testimonial or work sample relevant to the page they visited.</li>
    <li><strong>Objection handling:</strong> "No long contracts. Transparent pricing. Free first consultation."</li>
    <li><strong>New information:</strong> a case study, a FAQ, a comparison guide — value, not just repetition.</li>
    <li><strong>A softer ask:</strong> "Book a free 15-minute call" often outperforms "Buy now" for considered services.</li>
  </ul>

  <h2>The rules of tasteful retargeting</h2>
  <ul>
    <li><strong>Cap frequency.</strong> 3–5 impressions per week is presence; 30 is stalking. Set frequency caps.</li>
    <li><strong>Refresh creative</strong> every few weeks to fight banner blindness.</li>
    <li><strong>Exclude converted customers</strong> from acquisition campaigns — nothing wastes goodwill like advertising to people who already bought.</li>
    <li><strong>Honor privacy expectations.</strong> Follow platform policies and local regulations; disclose data use in your privacy policy.</li>
    <li><strong>Set an end date.</strong> Someone who ignored you for 90 days has told you something — let the list expire.</li>
  </ul>

  <h2>Getting started, practically</h2>
  <p>Install the Meta pixel and Google tag now — audiences start accumulating from day one, even before you spend a taka on showing ads. Segment your top pages. Then launch one modest campaign to the warmest segment with your best-performing organic message. Measure cost per returned visitor and per inquiry, and expand only what proves out.</p>
  <p>Retargeting setup is included in my <a href="services.html">ads management services</a> and the <a href="pricing.html">Paid Advertising package</a> (ad budget always separate and yours). If your site gets traffic but inquiries stall, <a href="contact.html">ask for a free basic check</a> — retargeting is usually the first recommendation.</p>`
},

/* -------------------------------------------------- 11 */
{
  id: 11,
  title: "How to Generate B2B Leads: A Practical Framework",
  cat: "Lead Generation",
  date: "Apr 14, 2026",
  read: "12 min read",
  excerpt: "B2B lead generation fails when it's random. A complete framework: define the ideal profile, build targeted lists, verify data, reach out properly and measure everything.",
  img: "assets/images/work/lead-generation-database.jpg",
  body: `
  <p>Ask a struggling sales team what they need and the answer is almost always "more leads". Ask them a week later and it becomes "better leads". B2B lead generation is not a volume game — it is a precision game. A list of 150 companies that genuinely fit your offer will outperform a scraped list of 15,000 that do not, every single time.</p>
  <p>This article lays out the framework professionals use to generate B2B leads that sales teams actually thank you for.</p>

  <h2>Step 1: Define the ideal customer profile (ICP)</h2>
  <p>Before any research, get brutally specific about who buys:</p>
  <ul>
    <li><strong>Firmographics:</strong> industry, company size, geography, revenue band, technology used.</li>
    <li><strong>Trigger events:</strong> hiring sprees, funding rounds, new leadership, expansion — signals that now is the right time.</li>
    <li><strong>Buying roles:</strong> the decision maker who signs, the influencer who champions, the blocker who can say no.</li>
    <li><strong>Disqualifiers:</strong> what makes a company a waste of effort, written down so you filter ruthlessly.</li>
  </ul>
  <p>A tight ICP is what separates lead generation from data collection.</p>

  <h2>Step 2: Build a targeted list — deliberately</h2>
  <p>With the profile defined, research companies that match it:</p>
  <ol>
    <li><strong>Source:</strong> industry directories, LinkedIn, Google Maps, association member lists, conference exhibitors, job boards (companies hiring for a related role often need help now).</li>
    <li><strong>Qualify each company</strong> against the ICP before it enters the list. Relevance beats volume.</li>
    <li><strong>Find the right person</strong> — name, job title, and a business reason they care about your offer.</li>
    <li><strong>Capture contact data</strong> with source notes, so any entry can be traced and audited later.</li>
  </ol>
  <p>This is the part that takes real work and where automated scraping fails: context. A good researcher understands <em>why</em> a company belongs on the list, not just that it exists.</p>

  <h2>Step 3: Verify and clean the data</h2>
  <p> B2B contact data decays fast — people change jobs, companies rename, emails go dark. Industry experience suggests a meaningful share of any list goes stale within a year. Before outreach:</p>
  <ul>
    <li><strong>Verify email deliverability</strong> (syntax, domain, mailbox-level checks) to protect your sender reputation.</li>
    <li><strong>De-duplicate</strong> across companies and past campaigns.</li>
    <li><strong>Standardize</strong> formats — names, titles, companies, websites, phone numbers, LinkedIn URLs.</li>
    <li><strong>Organize</strong> in a clean CRM or sheet with clear columns: company, industry, size, contact, role, source, status, notes.</li>
  </ul>
  <p>Clean data is not glamorous. It is also the difference between campaigns that land and campaigns that bounce.</p>

  <h2>Step 4: Outreach that respects the buyer</h2>
  <p>B2B buyers delete generic blasts in under a second. What earns replies:</p>
  <ul>
    <li><strong>Relevance in line one.</strong> Reference their industry, a recent company event, or a specific problem you noticed.</li>
    <li><strong>Brevity.</strong> Three to five sentences. One clear idea. One soft ask ("worth a short call?").</li>
    <li><strong>Value before ask.</strong> Lead with an insight, a relevant example or a useful resource — not with your brochure.</li>
    <li><strong>Multi-touch, patient cadence.</strong> 3–5 touches over 2–3 weeks across email and LinkedIn, then stop cleanly.</li>
    <li><strong>Human sending.</strong> Real address, plain formatting, easy reply path. Deliverability and reputation are assets you keep.</li>
  </ol>

  <h2>Step 5: Measure the pipeline, not the activity</h2>
  <p>Track the funnel honestly: companies contacted → opened → replied → meeting booked → opportunity → closed. Every stage conversion tells you what to fix — list quality (low opens), message (low replies), offer (meetings that go nowhere). Review weekly, refine the ICP as patterns emerge, and retire what stops working.</p>

  <h2>Common failure modes</h2>
  <ul>
    <li>Buying cheap bulk lists — high bounce rates, damaged sender reputation, wasted sales time.</li>
    <li>Skipping verification — one bad campaign can impair deliverability for months.</li>
    <li>Marketing-qualified leads that sales cannot use: missing titles, wrong industries, no context.</li>
    <li>No feedback loop between sales and the list builder — the single biggest quality lever goes unused.</li>
  </ul>

  <h2>Where this service fits</h2>
  <p>I provide B2B lead generation as a done-for-you research service: audience definition, prospect research, targeted lead lists, contact research, data cleaning and organized delivery in your preferred format — scoped per project and priced transparently on the <a href="pricing.html">pricing page</a>. Agencies, SaaS companies, consultants and local service providers use these lists for cold email, ads audiences and direct sales. If your team has capacity but lacks precision targets, <a href="contact.html">let's scope your ideal profile</a> together.</p>`
}
,

/* -------------------------------------------------- 12 */
{
  id: 12,
  title: "How to Build a Targeted Lead List for Sales and Ads",
  cat: "Lead Generation",
  date: "Mar 30, 2026",
  read: "10 min read",
  excerpt: "A step-by-step guide to building lead lists that convert: sources, fields, verification, organization and the quality rules that keep outreach alive.",
  img: "assets/images/work/lead-generation-database.jpg",
  body: `
  <p>A lead list is the raw material of outbound sales, cold email and custom ad audiences. Build it well and everything downstream — open rates, replies, meetings — improves automatically. Build it badly and even world-class copywriting cannot save the campaign, because bounces, wrong buyers and stale data kill deliverability and waste your team's most expensive resource: selling time.</p>
  <p>Here is how professional lead lists are actually built.</p>

  <h2>Start from the offer, not the source</h2>
  <p>The most common mistake is collecting companies first and thinking later. Reverse it: write one sentence describing exactly who benefits from your offer and why now. Example: "Bangladeshi e-commerce brands doing steady Facebook sales who need faster, more trustworthy websites." That sentence is your filter — every potential lead is checked against it before entering the list. This single habit eliminates the majority of junk entries before they exist.</p>

  <h2>Choose sources deliberately</h2>
  <p>Different sources suit different targets:</p>
  <ul>
    <li><strong>Google Maps / local directories</strong> — local businesses by city and category; ideal for local services and B2C.</li>
    <li><strong>LinkedIn</strong> — B2B companies and decision makers by title, industry and size; the default for B2B.</li>
    <li><strong>Industry directories &amp; associations</strong> — pre-qualified niches (clinics, agencies, manufacturers, exporters).</li>
    <li><strong>Job boards</strong> — companies hiring for a role adjacent to your offer are signaling a problem worth solving.</li>
    <li><strong>Exhibitor and event lists</strong> — active, budget-holding companies in one place.</li>
    <li><strong>Your own analytics</strong> — companies already visiting your site; the warmest list you will ever have.</li>
  </ul>

  <h2>The fields every serious lead list carries</h2>
  <ol>
    <li>Company name (standardized — no "Ltd", "Ltd." and "Limited" for the same firm)</li>
    <li>Industry / category</li>
    <li>Website</li>
    <li>Location (city, country)</li>
    <li>Company size signal (employees bracket or obvious indicator)</li>
    <li>Decision maker: full name</li>
    <li>Job title</li>
    <li>Email (verified) / phone (formatted with country code)</li>
    <li>LinkedIn profile URL</li>
    <li>Source (where this lead was found — non-negotiable for auditing)</li>
    <li>Personalization note (the observed fact your first line will reference)</li>
    <li>Status (new / contacted / replied / meeting / closed / disqualified)</li>
  </ol>
  <p>The personalization note is what list buyers underestimate. It is one sentence of human observation — "recently opened a second branch", "posting job ads for marketing roles", "website has no SSL" — and it is the difference between an email that feels researched and one that feels scraped.</p>

  <h2>Verify before anyone sends anything</h2>
  <p>Email verification is the cheapest insurance in marketing:</p>
  <ul>
    <li><strong>Syntax and domain checks</strong> catch typos and dead domains instantly.</li>
    <li><strong>Mailbox-level verification</strong> confirms an address can actually receive mail.</li>
    <li><strong>Risk scoring</strong> flags catch-all and role-based addresses (info@, contact@) that need different treatment.</li>
  </ul>
  <p>Sending to unverified lists produces bounces; bounces damage your sender reputation; damaged reputation lands even your good emails in spam. Verify first, always — and re-verify any list older than a few months before reuse.</p>

  <h2>Organize for the team that will use it</h2>
  <p>Deliver lists in a clean spreadsheet or CRM import format: one row per contact, consistent column names, a status column with dropdown values, and a short "how to use this list" note for the sales team. Freeze header rows, avoid merged cells, and never mix two campaigns in one tab. Small formatting disciplines decide whether a list gets used or ignored.</p>

  <h2>Quality rules I hold every list to</h2>
  <ul>
    <li>Every company passes the one-sentence filter — or it is excluded, no exceptions for volume.</li>
    <li>Every contact is a plausible buyer for the offer, not just a warm body with an email.</li>
    <li>Every email is verified before delivery.</li>
    <li>Every row names its source.</li>
    <li>Zero duplicates — across the list and against the client's existing CRM data.</li>
    <li>Client confidentiality respected: no private data shared between clients, ever.</li>
  </ul>

  <h2>From list to pipeline</h2>
  <p>A targeted list feeds three machines: cold outreach (email + LinkedIn), custom audiences for Meta and Google ads, and manual sales prospecting. Used across all three, one well-researched list becomes a full demand-generation layer for a quarter.</p>
  <p>If building this in-house is slower than it is worth, that is exactly what my <a href="services.html">lead generation services</a> cover — targeted lead lists, prospect research, data cleaning and organized delivery, priced transparently on the <a href="pricing.html">pricing page</a>. Tell me your ICP sentence and I will tell you honestly whether I can build you a list worth calling.</p>`
},

/* -------------------------------------------------- 13 */
{
  id: 13,
  title: "How to Create a Professional Business Website That Builds Trust",
  cat: "Web Development",
  date: "Mar 18, 2026",
  read:  "12 min read",
  excerpt: "A business website has one job: convert strangers into inquiries. Structure, content, speed and proof — how to plan a website that earns trust from the first click.",
  img: "assets/images/work/business-website-design.jpg",
  body: `
  <p>Most business websites are not broken — they are inconclusive. Visitors arrive, scroll, shrug and leave because the site never answered their actual questions: what do you do, who is it for, can I trust you, what does it cost, and what do I do next? A professional business website is engineered to answer those five questions within seconds and then convert interest into contact.</p>
  <p>Whether you build it yourself or hire a developer, this is the blueprint that produces websites that work.</p>

  <h2>Start with strategy, not design</h2>
  <p>Before any color or font is chosen, answer in writing:</p>
  <ul>
    <li><strong>Who is the site for?</strong> Pick primary and secondary audiences — "small business owners in Bangladesh and international clients" is two audiences with two sets of concerns.</li>
    <li><strong>What action defines success?</strong> A call, a form, a WhatsApp message, an order. Every page should push toward it.</li>
    <li><strong>What are your three strongest proof points?</strong> Work samples, credentials, client outcomes, years of practice.</li>
    <li><strong>What pages does the business actually need?</strong> Usually: Home, About, Services (individual pages for each service), Proof (portfolio/results), Pricing or FAQ, Contact. Nothing more until there is traffic to justify it.</li>
  </ul>

  <h2>The page architecture that converts</h2>
  <h3>Homepage</h3>
  <p>The homepage is a decision machine. Within the first screen: what you do, who you help, and the primary call to action. Below it: the problems you solve, your services, proof, a short About teaser, and a closing call to action. Resist the urge to put everything on page one — the homepage's job is routing, not exhaustive detail.</p>
  <h3>Service pages</h3>
  <p>One page per service — this is non-negotiable for both clarity and SEO. Each page: who the service is for, what is included, how it works (process), what results to expect, FAQ, proof, and a contact CTA. Shared pages ("Our Services" as a wall of text) force every visitor to read about services they do not want.</p>
  <h3>About page</h3>
  <p>People hire people. The About page should carry a real photo, a genuine story, credentials and — critically — why you do this work. For freelancers and consultants, the About page is often the second-most-visited page on the site. Treat it as a sales page, not a biography.</p>
  <h3>Contact page</h3>
  <p>Make contact effortless: a short form (name, email/phone, message — nothing more), plus direct email, phone, WhatsApp and location. Every field you add costs completions. State your response time if you can honor it.</p>

  <h2>Content rules that build trust</h2>
  <ul>
    <li><strong>Specificity beats adjectives.</strong> "I respond to every inquiry within 24 hours" outperforms "excellent customer service".</li>
    <li><strong>Show real work.</strong> Screenshots, case studies, before/afters — labeled honestly as client work or demo work.</li>
    <li><strong>Price transparency.</strong> Even "starting from" ranges filter unqualified inquiries and increase qualified ones.</li>
    <li><strong>Answer objections in FAQ.</strong> Timelines, budgets, process, guarantees — the questions you hear on every sales call belong on the site.</li>
    <li><strong>Zero typos.</strong> Errors on a business website are trust leaks; proofread everything, twice.</li>
  </ul>

  <h2>Technical foundations (the part visitors feel but never see)</h2>
  <ul>
    <li><strong>Mobile-first responsive layout</strong> — the majority of your visitors are on phones; design for 360px first, then scale up.</li>
    <li><strong>Speed:</strong> compressed images, minimal libraries, fast hosting. Every extra second of load time sheds visitors.</li>
    <li><strong>HTTPS</strong> with no mixed-content warnings.</li>
    <li><strong>SEO basics:</strong> unique titles, clean URLs, one H1 per page, sitemap, Search Console verification.</li>
    <li><strong>Analytics</strong> from day one — you cannot improve what you do not measure.</li>
  </ul>

  <h2>Custom code or CMS?</h2>
  <p>For most small business sites, a hand-coded HTML/CSS/JavaScript website is the cleaner path: only the code the design needs, faster loading, fewer security updates, stronger SEO control and no monthly plugin treadmill. A CMS like WordPress makes sense when non-technical staff will publish content frequently. Choose based on who maintains the site after launch — and if that maintainer is a developer (or me), custom code wins on nearly every axis. I compare the options honestly in the <a href="blog-details.html?id=14">HTML vs WordPress article</a>.</p>

  <h2>Pre-launch checklist</h2>
  <ol>
    <li>Every page answers: what, for whom, proof, next step</li>
    <li>Tested on a real phone, not just a desktop browser resized</li>
    <li>Form submissions arrive where someone actually reads them</li>
    <li>Titles and meta descriptions unique on every page</li>
    <li>Images compressed with descriptive filenames and alt text</li>
    <li>No lorem ipsum, no "coming soon", no broken links</li>
    <li>Favicon installed — it is the small trust detail in every browser tab</li>
  </ol>
  <p>A professional website is not a design project; it is a trust project with a design layer. My <a href="pricing.html">Custom Website package</a> delivers exactly this blueprint — hand-coded, responsive, SEO-friendly — and the <a href="portfolio.html">portfolio</a> shows the approach in practice. Questions about your project? <a href="contact.html">Send a message</a>.</p>`
},

/* -------------------------------------------------- 14 */
{
  id: 14,
  title: "HTML vs WordPress for Business Websites: An Honest Comparison",
  cat: "Web Development",
  date: "Mar 5, 2026",
  read: "12 min read",
  excerpt: "No dogma, no 'always better' — a straight comparison of custom-coded websites and WordPress across performance, SEO, security, cost and maintenance.",
  img: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Few debates in web development generate more heat than "custom code vs WordPress" — usually from people selling one of them. The honest answer is that both are excellent for the right owner and the right project. What follows is the comparison I give clients, with no preferred winner except the one that fits your situation.</p>

  <h2>What we are comparing</h2>
  <p><strong>Custom-coded website:</strong> built in HTML, CSS and JavaScript (plus a build process if the project is large). Every page, style and behavior is written for this specific site. Nothing exists that the developer did not deliberately create.</p>
  <p><strong>WordPress website:</strong> a PHP CMS running a theme (often with a page builder like Elementor) and a set of plugins. Content is managed through an admin dashboard; the code is generated by the stack.</p>

  <h2>Performance</h2>
  <p>A lean custom site ships only what it needs: one stylesheet, one small script, optimized images. Well-built custom pages routinely load in a fraction of a second.</p>
  <p>WordPress <em>can</em> be fast, but the default path fights you: themes ship features you will never use, page builders emit layers of nested markup, and each plugin adds its own CSS and JavaScript. Speed is achievable on WordPress — through careful hosting, caching, image discipline and ruthless plugin management — but it is maintenance work, not a starting condition.</p>
  <p class="verdict"><strong>Verdict:</strong> custom code wins on default performance; disciplined WordPress can get close.</p>

  <h2>SEO capability</h2>
  <p>Both routes can rank — Google does not care how a page was made, only what it serves. The differences are practical:</p>
  <ul>
    <li><strong>Custom:</strong> total control of markup — semantic HTML, heading structure, schema, URL patterns and asset weight are exactly what you wrote. No plugin conflicts or update surprises changing your metadata.</li>
    <li><strong>WordPress:</strong> mature SEO plugins make titles, sitemaps and redirects manageable for non-developers. The risk is structural: duplicate URLs, tag/category sprawl and slow mobile templates quietly undermine rankings until someone technical audits them.</li>
  </ul>
  <p class="verdict"><strong>Verdict:</strong> tie on ceiling; custom wins on control and consistency, WordPress wins on convenience for editors.</p>

  <h2>Security and maintenance</h2>
  <p>WordPress powers a huge share of the web, which makes it a default target. Security is a process: core updates, theme updates, plugin updates, login hardening, backups. Miss a few months and the risk grows. Custom static HTML has a dramatically smaller attack surface — no admin login, no plugin vulnerabilities, no database to exploit — and typically needs only hosting updates and content edits.</p>
  <p class="verdict"><strong>Verdict:</strong> custom code wins on default security and low maintenance; WordPress requires an ongoing hygiene routine.</p>

  <h2>Ease of editing</h2>
  <p>This is WordPress's home field. A non-technical owner can add pages, posts and products from any browser. On a custom site, content changes need either a developer or a lightweight editing setup agreed at build time. For businesses publishing weekly content with in-house staff, that difference decides the whole question.</p>
  <p class="verdict"><strong>Verdict:</strong> WordPress wins clearly for self-service editing.</p>

  <h2>Cost, honestly compared</h2>
  <ul>
    <li><strong>Custom build:</strong> higher upfront effort; near-zero ongoing technical costs. Changes are developer-scoped but predictable.</li>
    <li><strong>WordPress build:</strong> often cheaper upfront (themes do the design); ongoing costs include premium plugins, hosting tuned for speed/security, update maintenance and — eventually — a cleanup when plugin conflicts or bloat accumulate.</li>
  </ul>
  <p>Over a 3-year horizon the totals frequently converge. The real cost question is who maintains it, not which invoice looks smaller at launch.</p>

  <h2>Flexibility</h2>
  <p>Custom code places no ceiling on design or behavior — any layout, any interaction, any integration, with performance budgeted from the start. WordPress flexibility comes from its ecosystem: e-commerce, membership, booking and forum functionality install in hours that would take weeks to code. Complex functional requirements often favor WordPress (or a heavier platform); design- and performance-led sites favor custom code.</p>

  <h2>How to actually decide</h2>
  <ol>
    <li><strong>Will non-technical staff publish content regularly?</strong> Yes → WordPress (or a hybrid). No → custom code.</li>
    <li><strong>Is the site mostly evergreen marketing pages?</strong> Yes → custom code shines. No → evaluate the CMS ecosystem.</li>
    <li><strong>Do you have a developer relationship for changes?</strong> Yes → custom code's drawbacks shrink. No → a CMS you can edit yourself matters.</li>
    <li><strong>Are speed and Core Web Vitals business-critical?</strong> → Custom code starts ahead.</li>
  </ol>

  <h2>My position, declared</h2>
  <p>I build both. My primary offering is custom HTML/CSS/JavaScript development because most of my clients need fast, secure, SEO-friendly marketing sites that rarely change structurally — the exact profile where raw code wins. For clients who need to run a blog-heavy or content-edited site themselves, I set up WordPress properly and keep it lean. Either way the decision is made on your requirements, not my preferences. Compare both routes on the <a href="pricing.html">pricing page</a>, browse <a href="portfolio.html">work samples</a>, or <a href="contact.html">ask for a recommendation</a> with your actual requirements.</p>`
},

/* -------------------------------------------------- 15 */
{
  id: 15,
  title: "Why Responsive Web Design Matters for SEO and Conversions",
  cat: "Web Development",
  date: "Feb 20, 2026",
  read: "9 min read",
  excerpt: "Mobile-friendliness is both a ranking requirement and a conversion requirement. What responsive design really means, how Google evaluates it, and where most sites fail.",
  img: "assets/images/work/landing-page-design.jpg",
  body: `
  <p>Responsive web design means one website that adapts intelligently to every screen — phone, tablet, laptop, desktop — instead of maintaining separate mobile and desktop versions. A decade ago it was a premium feature. Today it is the baseline: Google uses mobile-first indexing, meaning it primarily evaluates the mobile version of your pages when deciding rankings, and the majority of visitors in most markets arrive on phones.</p>
  <p>A site that fails on mobile is not "a little worse" on mobile — it is worse everywhere, including desktop search results.</p>

  <h2>What responsive design actually involves</h2>
  <ul>
    <li><strong>Fluid grids</strong> — layout proportions that reflow rather than break as widths change.</li>
    <li><strong>Flexible images and media</strong> — media that scales within its container and is served at appropriate sizes for the device.</li>
    <li><strong>Media queries</strong> — CSS rules that adjust layout, typography and navigation at defined breakpoints (commonly ~360, 768, 1024px and up).</li>
    <li><strong>Touch-aware interaction</strong> — tap targets large enough for fingers, forms that use the right mobile keyboards, no hover-dependent features.</li>
  </ul>
  <p>The last point is where "responsive" sites most often fail technically: they reflow correctly but still expect desktop behavior.</p>

  <h2>The SEO case</h2>
  <ol>
    <li><strong>Mobile-first indexing.</strong> Google predominantly crawls and ranks the mobile rendering of your pages. Content hidden or broken on mobile is content Google may not credit.</li>
    <li><strong>Page experience signals.</strong> Core Web Vitals — the speed and stability metrics Google reports — are measured on real user devices, which are overwhelmingly mobile. LCP, INP and CLS failures are usually mobile failures.</li>
    <li><strong>One URL, one authority.</strong> Responsive design keeps all links and ranking signals on a single page. The old m-dot approach (m.yoursite.com) split authority between two URLs and created duplication problems responsive sites simply do not have.</li>
    <li><strong>Lower bounce, longer sessions.</strong> When mobile visitors can actually use the page, engagement improves — and engagement patterns correlate with sustained rankings.</li>
  </ol>

  <h2>The conversion case</h2>
  <p>Search rankings bring the visitor; mobile usability decides what happens next:</p>
  <ul>
    <li>Text that requires pinch-zooming to read is an exit, not a conversion.</li>
    <li>Forms with cramped inputs and wrong keyboards abandon half their starters.</li>
    <li>Call-to-action buttons smaller than a fingertip get mis-tapped, and mis-taps become exits.</li>
    <li>Popups that cover the mobile screen annoy users and can trigger search penalties on top of lost conversions.</li>
  </ul>
  <p>Every one of these is fixable with straightforward CSS discipline — no redesign required.</p>

  <h2>Test like a visitor, not a developer</h2>
  <p>Emulators lie a little; real phones do not. On an actual 360px phone, walk your five most important pages and check:</p>
  <ol>
    <li>Can I read the text without zooming?</li>
    <li>Is every button comfortable to tap?</li>
    <li>Can I complete the contact form one-handed?</li>
    <li>Does anything overlap, overflow or shift as the page loads?</li>
    <li>Is the primary call to action visible without scrolling into weird places?</li>
  </ol>
  <p>Then run the same pages through PageSpeed Insights and Google's Mobile-Friendly Test for the measured version of the same questions.</p>

  <h2>Responsive discipline when building custom sites</h2>
  <p>When I hand-code a site in HTML, CSS and JavaScript, responsive behavior is designed at the same moment as the desktop layout — not patched afterward. Breakpoints are chosen for the content, images are served at sensible sizes, and interactions are tested on real devices across the common range from 360px phones to 1920px desktops. This is also the practical answer for Core Web Vitals: layouts that were designed mobile-first simply score better.</p>

  <h2>The bottom line</h2>
  <p>Responsive design is not a feature to list on a proposal — it is the frame the whole painting goes in. If your current site fights phones, that is the first thing to fix, before any additional marketing spend multiplies the problem. The <a href="pricing.html">Custom Website package</a> builds responsive-first by default, and I audit mobile usability as part of every <a href="services.html">SEO audit</a>. Want yours checked? <a href="contact.html">Send the URL</a>.</p>`
},

/* -------------------------------------------------- 16 */
{
  id: 16,
  title: "Designing High-Converting Landing Pages: Principles That Matter",
  cat: "Web Development",
  date: "Feb 6, 2026",
  read: "11 min read",
  excerpt: "A landing page has one job and one moment to do it. Message match, hierarchy, proof, friction and speed — the principles behind pages that convert.",
  img: "assets/images/work/landing-page-design.jpg",
  body: `
  <p>A landing page is not a small homepage. It is a single-purpose page with one job: convert a specific visitor, arriving from a specific ad or link, toward one action. Because its audience and intent are known, everything generic must go. What remains is message, proof and a frictionless path to the button.</p>
  <p>Whether the goal is leads, sales or sign-ups, the principles below are what separate pages that convert from pages that merely look good.</p>

  <h2>1. Message match: the page continues the ad</h2>
  <p>The first test of any landing page is continuity. If the ad promises "SEO audits for e-commerce sites", the headline must say exactly that — not "Digital Marketing Services". Mismatched expectations are the number one reason ad clicks bounce in seconds, and every bounce is paid for twice: once in the click, once in the lost lead.</p>

  <h2>2. One page, one goal</h2>
  <p>Every additional call to action on a landing page splits its conversion. Strip the full navigation menu, the sidebar links and the "while you're here" offers. The visitor gets exactly one meaningful path: convert or leave. That constraint feels brutal and is precisely why it works.</p>

  <h2>3. Visual hierarchy leads the eye</h2>
  <ul>
    <li><strong>Headline:</strong> the offer, in the visitor's language, five seconds to understand.</li>
    <li><strong>Subheadline:</strong> the specifics — who it is for and what it includes.</li>
    <li><strong>One hero visual:</strong> a real screenshot, product photo or short video; decorative stock imagery converts nobody.</li>
    <li><strong>Above the fold:</strong> the primary CTA visible without scrolling on a phone.</li>
    <li><strong>Scanning beats reading:</strong> short paragraphs, bullet proof points, clear section labels — visitors scan first and read second.</li>
  </ul>

  <h2>4. Proof beats claims</h2>
  <p>Anyone can write "professional service". Conversion comes from evidence:</p>
  <ul>
    <li>Work samples and screenshots (honestly labeled as client or demo work)</li>
    <li>Specific numbers and process details that only a real practitioner would know</li>
    <li>Testimonials with names, roles and context — clearly marked as genuine or sample feedback</li>
    <li>Logos, certifications and guarantees that reduce perceived risk</li>
  </ul>

  <h2>5. Kill friction in the form</h2>
  <p>Every form field is a tax on conversion. Ask only for what the next step truly requires — usually name plus one contact channel. Then reduce effort further:</p>
  <ul>
    <li>Correct keyboard types on mobile (email, tel)</li>
    <li>Inline validation with human error messages</li>
    <li>A visible privacy reassurance near the submit button</li>
    <li>An alternative channel — "prefer WhatsApp? message us directly" — for visitors who distrust forms</li>
  </ul>

  <h2>6. Speed is part of the design</h2>
  <p>Landing pages live and die by ad traffic, and ad platforms penalize slow destinations with higher costs per click on top of the visitors you lose to load time. A production landing page should ship compressed images, minimal scripts and no unnecessary third-party embeds. When I build landing pages in raw HTML/CSS/JS, the entire page routinely weighs less than a single hero image on a template-built site.</p>

  <h2>7. Write the CTA like it matters</h2>
  <p>"Submit" is where conversions go to die. The button should restate the value: "Get My Free Audit", "Start My Project", "Claim the Plan". First person phrasing typically outperforms second person, and one specific promise beats three generic words.</p>

  <h2>8. Structure that carries a scanner to the button</h2>
  <p>A reliable long-form landing page order:</p>
  <ol>
    <li>Hero: offer, subheadline, CTA</li>
    <li>Problem: the visitor's situation, described accurately</li>
    <li>Solution: what you provide and how it works</li>
    <li>Proof: samples, testimonials, credentials</li>
    <li>Objections: FAQ answering cost, time, process</li>
    <li>Final CTA: last call with urgency that is real (limited capacity), never fabricated</li>
  </ol>

  <h2>9. Test, measure, iterate</h2>
  <p>Launch is the start, not the finish. Watch three numbers: conversion rate, bounce rate and where scroll dies. Change one element at a time — headline, proof order, form length — and give each change enough traffic to mean something. Small pages, tested honestly, beat beautiful pages assumed to work.</p>

  <h2>When to order a landing page as a service</h2>
  <p>Landing pages are the highest-leverage small build in digital marketing: one page, one offer, measurable results. My <a href="pricing.html">Landing Page pricing</a> covers a custom-coded, fast, mobile-first page designed around your specific campaign — and the <a href="services.html">web development services</a> list the full scope. Running ads to your homepage? <a href="contact.html">Let's fix that first</a> — it is usually the cheapest conversion win available.</p>`
}
,

/* -------------------------------------------------- 17 */
{
  id: 17,
  title: "How Website Speed Affects User Experience and SEO",
  cat: "Website Optimization",
  date: "Jan 22, 2026",
  read: "10 min read",
  excerpt: "Speed is where user experience and search rankings meet. Core Web Vitals explained in plain language, plus the fixes that recover most lost milliseconds.",
  img: "https://images.pexels.com/photos/8217724/pexels-photo-8217724.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Website speed used to be an invisible technical preference. It is now a measured, reported ranking factor and one of the most direct levers on revenue: study after study shows conversion rates falling as load time climbs from one second to three to five. Visitors interpret speed as competence — a slow site reads as a neglectful business.</p>
  <p>Here is what actually matters, in plain language, and what to do about it.</p>

  <h2>The three metrics Google actually reports</h2>
  <p>Core Web Vitals are field metrics — measured on real visitor devices, not lab simulations:</p>
  <ul>
    <li><strong>LCP (Largest Contentful Paint)</strong> — how fast the main content appears. Target under 2.5 seconds. Usually the hero image or headline.</li>
    <li><strong>INP (Interaction to Next Paint)</strong> — how fast the page responds when tapped or clicked. Target under 200 milliseconds. Usually ruined by heavy JavaScript.</li>
    <li><strong>CLS (Cumulative Layout Shift)</strong> — how much content jumps around while loading. Target under 0.1. Caused by images without dimensions, late-loading fonts and ads injecting space.</li>
  </ul>
  <p>Check yours in PageSpeed Insights (which shows both lab and real-user data) and in Search Console's Core Web Vitals report, which covers your whole site.</p>

  <h2>The five causes behind most slow websites</h2>
  <h3>1. Unoptimized images</h3>
  <p>The number one offender, almost always. Multi-megabyte photos uploaded straight from a phone, served at full size to a 360px screen. Fixes: compression before upload, correctly sized images (responsive srcset for larger sites), modern formats like WebP, and lazy-loading for below-the-fold media.</p>
  <h3>2. JavaScript weight</h3>
  <p>Every slider, chat widget, animation library and tracking script costs parse and execution time. Audits routinely find sites loading libraries for features a few lines of vanilla JavaScript could replace. Fix by removing, deferring or replacing heavy dependencies.</p>
  <h3>3. Render-blocking resources</h3>
  <p>CSS and scripts that halt first paint until fully downloaded. Fixes: minify and combine where practical, defer non-critical JavaScript, inline the small amount of CSS needed for the first screen.</p>
  <h3>4. Hosting quality</h3>
  <p>Slow server response (high TTFB) caps everything else. Cheap oversold shared hosting is a common ceiling; moving to decent hosting or adding a CDN often improves every metric at once.</p>
  <h3>5. Caching, or its absence</h3>
  <p>Without caching, every visit rebuilds every page. Browser caching, server-side page caching and CDNs let returning visitors download almost nothing.</p>

  <h2>Why this matters for SEO specifically</h2>
  <p>Google's page experience systems incorporate Core Web Vitals alongside mobile-friendliness and HTTPS. Speed alone will not rank a page — relevance still dominates — but between two comparable pages, the faster, more stable one gets the nod, and more importantly the <em>visitors</em> it earns stay longer and convert more, which compounds every other ranking signal.</p>

  <h2>A realistic optimization order</h2>
  <ol>
    <li><strong>Measure first:</strong> PageSpeed Insights on your five most valuable pages, mobile tab, plus Search Console's site-wide report.</li>
    <li><strong>Fix images:</strong> compress, resize and lazy-load. This single step resolves most failed LCP scores on small sites.</li>
    <li><strong>Audit scripts:</strong> remove what you do not use; defer what you do.</li>
    <li><strong>Set image dimensions and font fallbacks</strong> to stop layout shift.</li>
    <li><strong>Upgrade hosting or add a CDN</strong> if server response is still slow.</li>
    <li><strong>Re-measure after two weeks</strong> of real-user data.</li>
  </ol>

  <h2>The custom-code advantage</h2>
  <p>One reason I build marketing sites in raw HTML, CSS and JavaScript is that speed stops being a rescue mission. A hand-built page contains exactly the markup and scripts it needs — no theme overhead, no plugin stacks, no builder bloat — so Core Web Vitals start green instead of being chased there. Optimization on a lean codebase is a short checklist, not a project.</p>

  <h2>What to expect from an optimization service</h2>
  <p>A professional speed optimization should deliver: before/after measurements you can verify yourself, a prioritized list of what was fixed, and honest notes on anything hosting-related outside the optimizer's control. Beware anyone who "guarantees 100/100" — lab scores can be gamed; real-user metrics are what Google and your visitors experience.</p>
  <p>Speed work is included in my <a href="services.html">website optimization services</a> and every custom build on the <a href="pricing.html">pricing page</a>. Got a slow site? <a href="contact.html">Send the URL</a> — I will tell you the likely culprits before you pay anything.</p>`
},

/* -------------------------------------------------- 18 */
{
  id: 18,
  title: "How to Optimize Images for SEO and Faster Loading Pages",
  cat: "Website Optimization",
  date: "Jan 10, 2026",
  read: "9 min read",
  excerpt: "Images are the heaviest thing on most pages and an underused SEO signal. Formats, sizes, filenames, alt text and lazy loading — the complete, practical guide.",
  img: "assets/images/work/social-media-designs.jpg",
  body: `
  <p>On a typical small business website, images account for the majority of total page weight. They are also a genuine SEO surface: Google Images sends real traffic, alt text is an accessibility requirement, and file naming is a relevance signal. Yet image optimization is routinely reduced to "add alt text" — which is like reducing car maintenance to "check the mirror".</p>
  <p>Here is the complete practice, start to finish.</p>

  <h2>1. Choose the right format</h2>
  <ul>
    <li><strong>WebP</strong> — the modern default: dramatically smaller than JPEG/PNG at similar quality, supported by every current browser. Use it for photos and most graphics.</li>
    <li><strong>JPEG</strong> — still fine for photographs when WebP tooling is unavailable.</li>
    <li><strong>PNG</strong> — only for graphics needing transparency or pixel-sharp text; otherwise it is heavier than necessary.</li>
    <li><strong>SVG</strong> — for logos, icons and simple illustrations: tiny, infinitely scalable, styleable with CSS.</li>
    <li><strong>Avoid uncompressed originals entirely.</strong> The camera file is not a web asset.</li>
  </ul>

  <h2>2. Resize to how the image is actually displayed</h2>
  <p>A photo shot at 4000 pixels wide, displayed at 800 pixels, wastes roughly 95% of its bytes. Resize images to their largest display size (retina displays: double the CSS width), and for responsive sites provide multiple sizes via <em>srcset</em> so phones download small versions while large screens get larger ones. This one discipline often cuts page weight by more than half.</p>

  <h2>3. Compress before (and after) uploading</h2>
  <p>Compression removes data human eyes barely miss. Two levels:</p>
  <ul>
    <li><strong>Lossless-ish (quality ~80–85):</strong> visually indistinguishable, large savings.</li>
    <li><strong>Further lossy compression</strong> for decorative images where perfection is unnecessary.</li>
  </ul>
  <p>Tools: Squoosh, TinyPNG, or image optimization built into your build process. Compress first, then verify quality on a real screen — not the editor's zoom.</p>

  <h2>4. Name files descriptively</h2>
  <p>Filenames are read by search engines and shown in image results context:</p>
  <ul>
    <li>Bad: <em>IMG_2041.jpg</em>, <em>screenshot-final-v2.png</em></li>
    <li>Good: <em>custom-website-development-project.webp</em>, <em>khulna-seo-audit-report.webp</em></li>
  </ul>
  <p>Lowercase, hyphens between words, honest description of what the image shows. Rename before uploading — renaming after means broken references and lost ranking history.</p>

  <h2>5. Write alt text that describes the image</h2>
  <p>Alt text exists primarily for people who cannot see the image — screen reader users, slow connections, failed loads. Write it for them and the SEO benefit follows naturally:</p>
  <ul>
    <li>Describe what is actually shown: "SEO analytics dashboard showing organic traffic growth for a client website".</li>
    <li>Keep it under about 125 characters; end without a period.</li>
    <li>Include a keyword only when it genuinely describes the image — never stuff.</li>
    <li>Decorative images (dividers, background patterns): empty alt (<em>alt=""</em>) so screen readers skip them.</li>
  </ul>

  <h2>6. Prevent layout shift with dimensions</h2>
  <p>Always set width and height attributes (or CSS aspect-ratio). The browser then reserves the correct space before the file arrives, protecting your CLS (Cumulative Layout Shift) score and sparing visitors the maddening "content jumped as I tapped" experience.</p>

  <h2>7. Lazy-load what is below the fold</h2>
  <p><em>loading="lazy"</em> tells the browser to defer off-screen images until the visitor approaches them. Apply it to everything below the first screen; keep the hero image eager-loaded (and give it <em>fetchpriority="high"</em>) because it is usually your LCP element — the thing Google times.</p>

  <h2>8. Give important images context</h2>
  <p>Google interprets images using their surroundings: captions, nearby headings and page topic. Place meaningful images near relevant text, consider captions for work samples and charts, and group images into properly structured galleries rather than unlabelled grids. An image on a focused page about its subject outranks the same image dumped on a generic page.</p>

  <h2>A repeatable workflow</h2>
  <ol>
    <li>Export/resize to display size (×2 for retina)</li>
    <li>Convert to WebP, compress to quality ~80</li>
    <li>Rename descriptively</li>
    <li>Upload, set dimensions, write honest alt text</li>
    <li>Lazy-load below the fold; eager-load the hero</li>
    <li>Re-test the page in PageSpeed Insights</li>
  </ol>
  <p>Do this for every image going forward and backfill your ten most-visited pages — page weight falls, LCP improves, and your images start earning their own search visibility. Image optimization is included in every custom build I deliver and available standalone under <a href="services.html">website optimization services</a>; see <a href="pricing.html">pricing</a> or <a href="contact.html">send me your heaviest page</a> and I will show you what it should weigh.</p>`
},

/* -------------------------------------------------- 19 */
{
  id: 19,
  title: "How Small Businesses Can Start With Digital Marketing",
  cat: "Digital Marketing",
  date: "Dec 15, 2025",
  read: "11 min read",
  excerpt: "No budget for everything? Good — you don't need everything. A prioritized, realistic starting plan for small businesses with more ambition than budget.",
  img: "https://images.pexels.com/photos/7691715/pexels-photo-7691715.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Small business owners are marketed to constantly: you need SEO, ads, social media, email, video, an app, a funnel… The result is paralysis or scattered spending on five half-efforts that each do nothing. Digital marketing rewards focus. A small budget pointed at the right single channel outperforms a medium budget spread across six.</p>
  <p>This is the prioritized starting plan I give small businesses — deliberately sequenced so each step makes the next one work better.</p>

  <h2>Step 0: Fix the foundation (weeks 1–2)</h2>
  <p>Before attracting anyone, make sure the destination works:</p>
  <ul>
    <li>A fast, mobile-friendly website that states clearly what you offer, for whom, and how to contact you.</li>
    <li>A Google Business Profile, complete with photos, hours, services and categories — free, and for local businesses often the highest-visibility asset available.</li>
    <li>One contact method you actually monitor: WhatsApp, phone, form or email. Marketing that leads to silence is expensive.</li>
  </ul>

  <h2>Step 1: Choose your primary channel honestly</h2>
  <p>Match the channel to how your customers actually decide:</p>
  <ul>
    <li><strong>People search for your type of service?</strong> (plumbers, clinics, agencies, lawyers) → Local SEO first: rank in the map pack and for "near me" searches. Slow to build, cheapest per lead over time.</li>
    <li><strong>Customers scroll Instagram/Facebook and buy visually?</strong> (food, fashion, decor, gifts) → Organic social with consistent posting, then small paid boosts once content proves itself.</li>
    <li><strong>You need customers this month?</strong> → Small, tightly-targeted Google or Meta ad campaigns on your single best offer — while SEO work begins in the background.</li>
  </ul>
  <p>Pick <strong>one</strong> primary channel and commit for at least 90 days. Channel-hopping resets your learning every time.</p>

  <h2>Step 2: Build the minimum content set</h2>
  <p>You do not need a blog empire. You need:</p>
  <ol>
    <li>Clear service pages (one per service — not one crowded list)</li>
    <li>Answers to the ten questions every customer asks (pricing, process, timeline, guarantees) — as an FAQ or short articles</li>
    <li>Proof: photos of real work, before/after, testimonials (honestly labeled), credentials</li>
  </ol>
  <p>This is both conversion content and SEO content — the same pages serve visitors and Google.</p>

  <h2>Step 3: Start measurement before scale</h2>
  <p>Install the free basics now: Google Search Console, an analytics tool, and call/WhatsApp tracking where feasible. Decide the single metric that defines success — cost per inquiry, form fills, direction requests — and record it weekly. Without this you will eventually pay for ads or SEO with no way to know if either worked.</p>

  <h2>Step 4: Expand in the right order</h2>
  <p>Once the primary channel produces steady inquiries:</p>
  <ul>
    <li><strong>Add retargeting</strong> — small budgets keep you in front of site visitors who didn't convert. Usually the cheapest incremental leads available.</li>
    <li><strong>Add a second channel</strong> — the one that catches customers at a different stage (SEO if you started with ads; ads if you started with SEO).</li>
    <li><strong>Add email/WhatsApp follow-up</strong> — inquiries that did not close are your warmest future customers.</li>
    <li><strong>Then consider content marketing</strong> at whatever cadence you can sustain for a year — consistency beats intensity.</li>
  </ul>

  <h2>The 90-day realistic budget shape</h2>
  <p>For a typical local service business (proportions, not mandates):</p>
  <ul>
    <li>~40% foundations: website fixes, GBP optimization, tracking setup</li>
    <li>~40% one primary channel done properly</li>
    <li>~20% proof production: photos, work samples, testimonial collection</li>
  </ul>
  <p>Notice what is absent: five social platforms, an app, a rebrand. Those are later problems, if ever.</p>

  <h2>Mistakes that consume small budgets</h2>
  <ul>
    <li>Buying followers or engagement — numbers without audience.</li>
    <li>Boosting posts instead of running structured campaigns with an objective.</li>
    <li>SEO retainers with no audit, no deliverables list and no reporting.</li>
    <li>Redesigning the logo while the website takes eight seconds to load.</li>
    <li>Running ads to the homepage instead of a page matched to the ad.</li>
  </ul>

  <h2>Where a consultant actually saves you money</h2>
  <p>The right hire at small-business stage is not someone who runs everything — it is someone who tells you what <em>not</em> to spend on yet. My role for most clients starts with a <a href="pricing.html">free digital growth check</a>: look at the website, search presence and one competitor, then recommend the single highest-value starting point. From there, services are scoped individually (see <a href="services.html">the full list</a>) so you buy exactly the next step — not a package built for someone else's business.</p>`
},

/* -------------------------------------------------- 20 */
{
  id: 20,
  title: "Social Media Marketing for Small Businesses: Where to Start",
  cat: "Social Media",
  date: "Nov 28, 2025",
  read: "10 min read",
  excerpt: "You don't need every platform — you need one done well. Platform selection, content pillars, a realistic posting system and when to start paying for reach.",
  img: "assets/images/work/social-media-designs.jpg",
  body: `
  <p>"We should be more active on social media" is not a strategy — it is a feeling that produces three weeks of daily posting, silence for two months, and a page that quietly signals abandonment. Social media marketing for a small business works when it is narrowed deliberately: one platform, a small set of content types, and a schedule the business can actually sustain.</p>

  <h2>Step 1: Pick one platform — by customer, not by hype</h2>
  <ul>
    <li><strong>Facebook</strong> — still the broadest reach in Bangladesh and many markets; local customers, community groups, events, Marketplace. If your customers are general consumers, start here.</li>
    <li><strong>Instagram</strong> — visual products and lifestyle brands; younger buyers, food, fashion, design, fitness.</li>
    <li><strong>LinkedIn</strong> — B2B services, consultants, trainers; decision makers research vendors here.</li>
    <li><strong>YouTube</strong> — the second-largest search engine; tutorials, reviews and how-to content that compounds for years.</li>
  </ul>
  <p>Choose where your customers already spend attention — then ignore the others until this one works. One strong platform outperforms four weak ones, both for algorithms and for your calendar.</p>

  <h2>Step 2: Optimize the profile before posting</h2>
  <p>Your page is a landing page. Before content: recognizable profile photo (logo or face), a bio that says what you do and for whom, location and contact details, a link to your website (or WhatsApp), consistent handle/name across platforms, and a pinned post introducing the business. Every post gains credibility from a complete profile; every incomplete profile leaks it.</p>

  <h2>Step 3: Build 3–4 content pillars</h2>
  <p>Pillars are repeating themes that keep content useful instead of random:</p>
  <ol>
    <li><strong>Proof</strong> — work samples, before/after, process photos, delivered projects. The pillar most businesses under-use and customers trust most.</li>
    <li><strong>Helpfulness</strong> — short tips, answers to frequent customer questions, mini-guides. Earns saves and shares.</li>
    <li><strong>Behind the scenes</strong> — the people, the workspace, the process. Small businesses win here; big brands cannot fake genuineness.</li>
    <li><strong>Offers/announcements</strong> — products, seasonal offers, events. Keep this to roughly one post in four; pages that only sell get scrolled past.</li>
  </ol>

  <h2>Step 4: A schedule you can actually keep</h2>
  <p>Sustainable beats ambitious: 2–3 posts per week for 12 months builds an audience; daily posting for 3 weeks builds nothing. Practical system:</p>
  <ul>
    <li>Batch-create: one session produces a week or two of posts</li>
    <li>Maintain a simple content calendar (topic, pillar, format, date)</li>
    <li>Keep formats cheap: phone photos outperform polished stock; short captions with one clear idea</li>
    <li>Design consistency: same fonts, colors and template family — recognition compounds (this is where a small set of professional templates pays for itself)</li>
  </ul>

  <h2>Step 5: Engage — the half everyone skips</h2>
  <p>For a small business, replies <em>are</em> marketing: answer every comment and message quickly, comment genuinely on local/community posts, join conversations where your expertise helps. The first 60 minutes after posting matter most for reach. Ten minutes of daily engagement outperforms an extra post.</p>

  <h2>Step 6: When to start paying</h2>
  <p>Boost organic winners, not everything. The sequence that works:</p>
  <ol>
    <li>Post consistently for 4–6 weeks and identify what earned real engagement.</li>
    <li>Put small budgets behind proven posts, targeted tightly at your customer geography and interests.</li>
    <li>Run one structured campaign (not a boost) for your best offer — with a proper objective, audience and a matched landing page.</li>
    <li>Retarget website visitors — usually the cheapest incremental results in social ads.</li>
  </ol>

  <h2>What to measure (and ignore)</h2>
  <ul>
    <li><strong>Measure:</strong> profile visits, website clicks, messages/leads received, and — for ads — cost per lead.</li>
    <li><strong>Ignore:</strong> raw follower count as a success metric. A thousand local followers who buy beat fifty thousand who don't.</li>
  </ul>

  <h2>Getting help where it pays</h2>
  <p>Delegate selectively: a content strategy session to set pillars, a set of professional design templates for visual consistency, or monthly management when in-house time runs out — all available under <a href="services.html">social media services</a> with transparent <a href="pricing.html">starting prices</a>. If you want a second opinion on which platform deserves your next three months, <a href="contact.html">book a free 15-minute consultation</a>.</p>`
},

/* -------------------------------------------------- 21 */
{
  id: 21,
  title: "How to Build a Professional Freelance Portfolio That Wins Clients",
  cat: "Freelancing",
  date: "Nov 10, 2025",
  read: "11 min read",
  excerpt: "Clients don't hire skills — they hire evidence. How to build a portfolio that proves competence honestly, even when you're starting with zero clients.",
  img: "https://images.pexels.com/photos/8546649/pexels-photo-8546649.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=680",
  body: `
  <p>Every freelancer eventually hears the trap: "You need experience to get clients, and clients to get experience." Portfolios are how you break the loop — because clients do not actually hire experience. They hire <em>evidence</em>: visible proof that you can do the specific thing they need done. Evidence can be created before anyone pays you.</p>
  <p>This is how to build that evidence honestly — no fake clients, no invented results.</p>

  <h2>Principle 1: Curate, don't dump</h2>
  <p>A portfolio with four excellent, well-explained projects beats one with twenty thumbnails. Selection is itself a skill signal: it shows judgment. For each service you sell, include two or three of the strongest examples you have — and be ruthless about what makes the cut. If everything is included, nothing stands out.</p>

  <h2>Principle 2: Structure every project the same way</h2>
  <p>Clients scan portfolios comparing candidates. Make comparison easy with a consistent story per project:</p>
  <ol>
    <li><strong>Project name and type</strong> (e.g., "Landing page for a local service business")</li>
    <li><strong>The goal</strong> — what problem the project solved</li>
    <li><strong>Your role</strong> — exactly what you did (research, design, build, copy, SEO)</li>
    <li><strong>Process highlights</strong> — 2–4 decisions that show thinking</li>
    <li><strong>Tools and technologies</strong></li>
    <li><strong>Visuals</strong> — screenshots, before/after, dashboards</li>
    <li><strong>Outcome or status</strong> — honestly stated</li>
  </ol>
  <p>That last point matters most, which brings us to labels.</p>

  <h2>Principle 3: Label demo work as demo work</h2>
  <p>Starting out, most of your portfolio will be practice and concept projects — and that is fine. What ruins freelancers is not demo work; it is <em>undisclosed</em> demo work. The professional standard:</p>
  <ul>
    <li><strong>"Client project"</strong> — real work, real client (anonymized where confidentiality applies: "E-commerce brand, fashion, Bangladesh").</li>
    <li><strong>"Demo project"</strong> — a realistic project built to demonstrate the skill: a concept landing page, a sample SEO audit of a public website, a practice redesign.</li>
    <li><strong>"Practice/concept"</strong> — explorations and studies.</li>
  </ul>
  <p>Clients respect labeled demo work — it shows initiative and honesty. One discovered fake "client result" ends the relationship and the referral network that comes with it.</p>

  <h2>Principle 4: Show process, not just outputs</h2>
  <p>Screenshots tell clients what you made. Process artifacts tell them what it is like to work with you:</p>
  <ul>
    <li>A keyword research sheet with your column structure and reasoning</li>
    <li>An audit checklist you actually use</li>
    <li>Wireframes or before/after versions</li>
    <li>A sample weekly report format</li>
  </ul>
  <p>For services like SEO, ads management and lead generation, process artifacts often convert better than outcome screenshots — because outcomes are confidential while method is demonstrable.</p>

  <h2>Principle 5: Make the portfolio findable and fast</h2>
  <p> Your portfolio lives or dies on access speed:</p>
  <ul>
    <li>Live on your own fast, mobile-friendly site — not only inside a platform's walled garden</li>
    <li>Each project gets its own page with a descriptive title (good for Google too)</li>
    <li>Descriptive image filenames and alt text ("custom-coded-landing-page-project.webp")</li>
    <li>One clear contact route — WhatsApp, email or form — visible on every page</li>
    <li>Linked from every profile you hold: LinkedIn, Facebook, marketplace profiles</li>
  </ul>

  <h2>Principle 6: Add the trust layer</h2>
  <ul>
    <li><strong>Testimonials:</strong> real ones when available; clearly-labeled sample feedback while you are starting (never presented as real clients)</li>
    <li><strong>Credentials:</strong> certifications, training roles, relevant employment — verifiable only</li>
    <li><strong>Transparent pricing:</strong> "starting from" ranges filter inquiries and increase qualified ones</li>
    <li><strong>About page:</strong> a real photo and a genuine story; freelancing is person-to-person business</li>
    <li><strong>Case studies over time:</strong> as real projects complete, replace demos one by one — the portfolio is a living document</li>
  </ul>

  <h2>A 30-day plan from zero</h2>
  <ol>
    <li><strong>Week 1:</strong> define 2–3 services you will sell; study 10 strong portfolios in each</li>
    <li><strong>Week 2:</strong> build 2 demo projects per service using the consistent structure above</li>
    <li><strong>Week 3:</strong> launch a simple fast portfolio site (3–5 pages is enough), fully labeled</li>
    <li><strong>Week 4:</strong> publish, share within your networks, start honest outreach using the demo work as evidence</li>
  </ol>
  <p>My own portfolio follows every rule in this article — labeled demo sections, consistent case-study structure, honest outcomes — you can see it <a href="portfolio.html">here</a>. If you want a portfolio site built the same way, look at the <a href="pricing.html">pricing options</a> or <a href="contact.html">send a message</a> about your services and I will suggest the right structure.</p>`
}

];
/* END OF ARTICLES DATA */
