/* =====================================================================
   PORTFOLIO PROJECTS DATA — Prosengit Kundu
   ---------------------------------------------------------------------
   HONESTY POLICY:
   All projects below are DEMO / CONCEPT work samples created to
   demonstrate skills and deliverables. They are clearly labeled as
   demo work. Client projects replace these entries as they are
   approved for publication — with the same structure.
   ===================================================================== */

const PROJECTS = [
  {
    id: 1,
    cat: "web",
    title: "Custom Business Website — HTML/CSS/JavaScript",
    industry: "Local Professional Services",
    client: "Demo Project",
    focus: "Fast, responsive, SEO-friendly custom-coded website",
    duration: "4 weeks (concept)",
    image: "assets/images/work/business-website-design.jpg",
    goal: "Create a complete business website for a local professional services brand that loads fast, works perfectly on mobile, and communicates trust within seconds — without relying on a heavy theme or page builder.",
    role: "Planning, information architecture, custom design-to-code (HTML/CSS/JS), on-page SEO setup, performance optimization.",
    tools: "HTML5, CSS3, JavaScript, responsive breakpoints, Google Fonts, compression pipeline, Search Console",
    work: [
      "Sitemap and page structure planning (Home, Services, About, Pricing, Contact)",
      "Custom responsive layout hand-coded from scratch",
      "Mobile-first breakpoints from 360px to 1920px",
      "Semantic HTML with one H1 per page and logical heading hierarchy",
      "Unique titles, meta descriptions and Open Graph tags per page",
      "Compressed images with descriptive filenames and alt text",
      "Custom contact form with validation",
      "XML sitemap and robots.txt generation",
      "Basic scroll-reveal animations with prefers-reduced-motion support"
    ],
    outcome: "A complete, concept-ready custom-coded website demonstrating how a lean raw-code build stays fast, accessible and SEO-friendly by default. Demo project — not a claimed client result."
  },
  {
    id: 2,
    cat: "web",
    title: "High-Converting Landing Page Design",
    industry: "Digital Marketing / Lead Capture",
    client: "Demo Project",
    focus: "Single-goal conversion landing page",
    duration: "2 weeks (concept)",
    image: "assets/images/work/landing-page-design.jpg",
    goal: "Design and build a single-purpose landing page for a paid campaign — message-matched hero, proof section, objection-handling FAQ and a friction-minimal lead form.",
    role: "Conversion structure planning, copy hierarchy, custom HTML/CSS/JS build, form UX, speed optimization.",
    tools: "HTML5, CSS3, JavaScript, form validation, PageSpeed optimization",
    work: [
      "Above-the-fold headline/subheadline with a single clear CTA",
      "Problem → solution → proof → objection → CTA section flow",
      "Lead capture form with minimal fields and inline validation",
      "WhatsApp alternative contact route",
      "Social proof and testimonial structure (clearly labeled placeholders)",
      "Compressed assets — entire page under lightweight budget",
      "Mobile-first layout tested at 360px, 390px, 768px and up"
    ],
    outcome: "A landing page concept showing the exact structure I build for campaign and lead-generation clients. Demo project — ready to be adapted to a real offer."
  },
  {
    id: 3,
    cat: "web",
    title: "Photographer Portfolio Website",
    industry: "Creative / Photography",
    client: "Demo Project",
    focus: "Elegant gallery-first portfolio site",
    duration: "3 weeks (concept)",
    image: "assets/images/work/portfolio-website-design.jpg",
    goal: "Build an image-led portfolio website where the photography is the design: minimal chrome, fast galleries and a clear contact path for bookings.",
    role: "Visual structure, gallery layout, custom coding, image optimization strategy.",
    tools: "HTML5, CSS3, JavaScript, lazy loading, WebP image strategy",
    work: [
      "Masonry-style gallery layout with lazy-loaded images",
      "Minimal navigation that keeps attention on the work",
      "About and booking sections with a simple inquiry form",
      "Responsive gallery grid from phone to desktop",
      "Image SEO: descriptive filenames, alt text, structured captions",
      "Lightweight interactions — no slider libraries, vanilla JS only"
    ],
    outcome: "A portfolio concept demonstrating custom-coded gallery architecture with performance discipline. Demo project — structure reusable for any visual professional."
  },
  {
    id: 4,
    cat: "seo",
    title: "Local SEO Growth System",
    industry: "Local Service Business",
    client: "Demo Project",
    focus: "Local visibility audit → keyword map → GBP plan",
    duration: "6-month roadmap (concept)",
    image: "assets/images/work/seo-analytics-dashboard.jpg",
    goal: "Move a local service business from invisible in local search to a structured, measurable local SEO system — map pack presence, local keywords and review growth.",
    role: "Local SEO audit, local keyword research, Google Business Profile planning, content prioritization, reporting structure.",
    tools: "Google Search Console, Google Business Profile, Google Analytics, keyword research workflow, local citation checklist",
    work: [
      "Complete local search visibility audit",
      "Local keyword research by service × city combinations",
      "Google Business Profile optimization plan (categories, services, photos, posts)",
      "NAP consistency and local citation checklist",
      "Service page structure recommendations for local intent",
      "Review generation and response strategy",
      "Monthly tracking template: rankings, calls, direction requests"
    ],
    outcome: "A documented local SEO system showing exactly how I approach local visibility for service businesses. Demo project — deliverables shown as strategy targets, not claimed ranking results."
  },
  {
    id: 5,
    cat: "seo",
    title: "Keyword Research & Content Mapping",
    industry: "Content / Blog Strategy",
    client: "Demo Project",
    focus: "Full keyword-to-page mapping document",
    duration: "2 weeks (concept)",
    image: "assets/images/work/keyword-research-spreadsheet.jpg",
    goal: "Build a complete keyword research and content map: every valuable keyword classified by intent, difficulty and funnel stage — then assigned to exactly one page.",
    role: "Seed keyword expansion, intent classification, difficulty assessment, page mapping, prioritized content calendar.",
    tools: "Keyword research workflow, SERP analysis process, spreadsheet-based mapping system",
    work: [
      "Seed topic expansion across services, problems and comparisons",
      "Intent classification: informational / commercial / transactional",
      "Long-tail opportunity identification for a newer domain",
      "Keyword cannibalization check and one-page-per-keyword mapping",
      "Content gap observation framework",
      "Prioritized 6-month content calendar with internal linking plan"
    ],
    outcome: "The exact deliverable format clients receive from a keyword research project — structured, filterable and decision-ready. Demo project using a practice niche."
  },
  {
    id: 6,
    cat: "seo",
    title: "Technical SEO Audit — Full Report",
    industry: "Business Website",
    client: "Demo Project",
    focus: "Complete crawl-to-fix technical audit",
    duration: "2 weeks (concept)",
    image: "assets/images/work/technical-seo-audit.jpg",
    goal: "Audit a business website's technical health end-to-end: crawlability, indexation, metadata, speed, structured data and Core Web Vitals — with a prioritized fix list.",
    role: "Crawl analysis, indexation review, speed diagnostics, schema recommendations, fix prioritization.",
    tools: "Site crawling workflow, Google Search Console, PageSpeed Insights, schema planning",
    work: [
      "Full site crawl: broken links, redirects, redirect chains",
      "Indexation audit: noindex issues, canonical errors, duplicate versions",
      "Metadata review: missing/duplicate titles and descriptions",
      "Heading hierarchy and semantic structure checks",
      "Page speed and Core Web Vitals diagnostics (LCP, INP, CLS)",
      "Structured data gap analysis and JSON-LD recommendations",
      "Prioritized technical fix roadmap (impact × effort)"
    ],
    outcome: "A sample of the audit report structure I deliver — every issue explained in plain language with its fix and priority. Demo project on a practice website."
  },
  {
    id: 7,
    cat: "ads",
    title: "Meta Ads Lead Campaign Structure",
    industry: "B2B Service",
    client: "Demo Project",
    focus: "Campaign architecture + creative test plan",
    duration: "3-month plan (concept)",
    image: "assets/images/work/meta-ads-dashboard.jpg",
    goal: "Design a Meta Ads campaign system for qualified lead generation: clean account structure, audience layers, creative testing and retargeting — with the ad budget kept separate and client-owned.",
    role: "Campaign strategy, audience research, structure design, creative angle planning, measurement setup.",
    tools: "Meta Ads Manager, Meta Pixel, custom audiences, lead form qualification framework",
    work: [
      "Ideal customer profile and audience layer definition",
      "Account structure: cold / warm / retargeting campaign separation",
      "Creative angle plan with structured testing calendar",
      "Lead form qualification questions to filter junk leads",
      "Pixel/conversion event setup checklist",
      "Retargeting sequences for page visitors and form abandoners",
      "Weekly optimization and reporting routine"
    ],
    outcome: "A complete Meta Ads campaign blueprint — the structure I set up for real accounts. Demo project: dashboards shown as examples, no claimed performance numbers."
  },
  {
    id: 8,
    cat: "ads",
    title: "Google Ads Search Campaign Blueprint",
    industry: "Service Business",
    client: "Demo Project",
    focus: "Search campaign structure + keyword match plan",
    duration: "3-month plan (concept)",
    image: "assets/images/work/google-ads-dashboard.jpg",
    goal: "Plan a high-intent Google Search campaign: tight keyword grouping, negative keyword strategy, ad copy variants and conversion tracking — designed to learn fast and waste nothing.",
    role: "Keyword-to-ad-group mapping, match type strategy, copywriting, extensions, tracking plan.",
    tools: "Google Ads, keyword planner workflow, conversion tracking, negative keyword lists",
    work: [
      "Keyword research mapped to tight ad groups",
      "Match type strategy (phrase-first) with expansion rules",
      "Negative keyword list: junk intent, careers, irrelevant geography",
      "RSA copy variants with keyword insertion where appropriate",
      "Ad extensions: sitelinks, callouts, structured snippets",
      "Conversion tracking and lead value assignment",
      "Budget pacing and optimization schedule"
    ],
    outcome: "A production-ready search campaign blueprint demonstrating disciplined PPC structure. Demo project — anonymized-style dashboard visuals, no claimed results."
  },
  {
    id: 9,
    cat: "lead",
    title: "B2B Targeted Lead List Build",
    industry: "Digital Agencies / SaaS",
    client: "Demo Project",
    focus: "ICP-filtered, verified lead database",
    duration: "1–2 weeks per batch (concept)",
    image: "assets/images/work/lead-generation-database.jpg",
    goal: "Build a B2B lead list that sales teams trust: companies filtered against a strict ideal customer profile, decision-maker contacts researched manually, every email verified before delivery.",
    role: "ICP definition, company sourcing, contact research, verification, organization and delivery.",
    tools: "LinkedIn, Google Maps, industry directories, email verification workflow, spreadsheet/CRM delivery",
    work: [
      "Ideal customer profile definition with explicit disqualifiers",
      "Company research from directories, LinkedIn and Maps",
      "Decision-maker identification (name, title, relevance check)",
      "Contact data collection with source noted per row",
      "Email verification and risk scoring before delivery",
      "De-duplication and standard formatting (one row per contact)",
      "Personalization notes for outreach first lines"
    ],
    outcome: "A clean, verified, organized lead database — the exact format delivered to B2B clients. Demo project using publicly listed practice companies; no private client data shown."
  },
  {
    id: 10,
    cat: "lead",
    title: "Prospect Research & Data Cleaning",
    industry: "Outbound Sales Support",
    client: "Demo Project",
    focus: "Messy CRM data → clean, usable prospect data",
    duration: "1 week (concept)",
    image: "assets/images/work/lead-generation-database.jpg",
    goal: "Take a disorganized prospect spreadsheet — duplicates, dead emails, inconsistent company names — and return a clean, verified, campaign-ready database.",
    role: "Data audit, de-duplication, standardization, verification, re-organization.",
    tools: "Spreadsheet cleaning workflow, verification tools, formatting standards",
    work: [
      "Full data audit: duplicates, syntax errors, missing fields",
      "Company name standardization (Ltd/Limited/Ltd. unified)",
      "Email verification with bounces and risky addresses flagged",
      "Phone formatting with country codes",
      "Column standardization for CRM import",
      "Status fields added: new / contacted / replied / disqualified"
    ],
    outcome: "Before-and-after data quality example showing the cleaning process I apply to every list. Demo project on sample data."
  },
  {
    id: 11,
    cat: "design",
    title: "Social Media Design Pack",
    industry: "Small Business Brand",
    client: "Demo Project",
    focus: "Consistent post & story design system",
    duration: "2 weeks (concept)",
    image: "assets/images/work/social-media-designs.jpg",
    goal: "Create a reusable visual system for a small business page: post templates, story layouts and promotional graphics that stay on-brand without a designer for every post.",
    role: "Visual direction, template design, brand consistency system.",
    tools: "Adobe Photoshop, Adobe Illustrator, template system",
    work: [
      "Visual direction: color, typography and layout rules",
      "Facebook/Instagram post template set",
      "Story and announcement layouts",
      "Promotional offer templates",
      "Export guidelines for quality vs file size",
      "Simple usage guide so staff can reuse templates"
    ],
    outcome: "A template system concept that keeps a business page visually consistent. Demo designs created for practice."
  },
  {
    id: 12,
    cat: "design",
    title: "YouTube Thumbnail Design Set",
    industry: "Education / Content Creator",
    client: "Demo Project",
    focus: "High-CTR thumbnail design system",
    duration: "1 week (concept)",
    image: "assets/images/work/youtube-thumbnail-designs.jpg",
    goal: "Design a set of thumbnails that stay readable at small sizes, communicate the video's promise instantly and stay consistent as a recognizable series.",
    role: "Concept, typography, color/contrast design, series consistency system.",
    tools: "Adobe Photoshop, composition and contrast principles",
    work: [
      "Readability-first typography (legible at mobile size)",
      "Contrast and focal-point planning per thumbnail",
      "Consistent series styling for channel recognition",
      "A/B variant layouts for testing concepts",
      "Export presets for YouTube specifications"
    ],
    outcome: "A thumbnail design set demonstrating conversion-focused graphic design. Demo designs produced for practice."
  }
];

const PROJECT_CATEGORIES = { web: "Web Development", seo: "SEO", lead: "Lead Generation", ads: "Paid Ads", design: "Graphic Design" };
