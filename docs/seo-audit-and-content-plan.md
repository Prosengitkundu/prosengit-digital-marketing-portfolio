# International SEO audit, keyword map and content architecture

**Website:** https://prosengitkundu.top  
**Owner / author:** Prosengit Kundu  
**Review date:** 16 September 2026  
**Positioning:** Digital Marketing Expert · SEO & Performance Marketing Specialist · Web Developer · Professional Trainer · Freelancer

This document records the audit and content decisions that informed the website refresh. It is an implementation plan, not a ranking forecast. Search performance will still depend on competition, site history, content quality, technical health, links, user demand and the quality of the enquiry experience.

## 1. Website SEO audit

### What was reviewed

- The static HTML site in this repository, including the homepage, service hub, pricing, portfolio, blog, contact, FAQ, legal pages and dynamic article/project templates.
- The deployed homepage at `prosengitkundu.top` to compare the visible experience with the repository.
- Shared behaviour in `assets/js/site.js`, content data in `assets/js/articles.js` and `assets/js/projects.js`, and the existing `robots.txt` and sitemap.
- Existing image assets and their dimensions/alt-text patterns.

### Strengths worth preserving

- The site already had a real professional identity, contact details, a domain, a portfolio system, a blog data set and a static-hosting-friendly implementation.
- Existing work samples were labelled as demo or concept projects in the portfolio data. That honesty is preserved and made more prominent.
- There were useful long-form articles covering SEO, keyword research, paid media, web development and lead generation.
- A working Formspree contact route, WhatsApp link, phone number, email address, LinkedIn profile and Facebook profile were already available.
- Image variants existed for the professional portrait and several portfolio images, creating a good foundation for responsive image delivery.

### Priority problems found and addressed

| Area | Audit finding | Implemented response |
|---|---|---|
| Positioning | The homepage led with a broad personal introduction but did not make the combined commercial offer—SEO + ads + web + leads—clear quickly enough. | Rewrote the homepage around a specific international service proposition and linked each acquisition intent to a dedicated page. |
| Search architecture | Major services were bundled together on a single page, so SEO, Meta Ads, Google Ads, websites and lead generation had no distinct primary intent. | Added dedicated service URLs: `/seo-services.html`, `/meta-ads.html`, `/google-youtube-ads.html`, `/web-development.html`, `/wordpress-development.html`, `/local-seo.html`, `/b2b-lead-generation.html` and `/digital-marketing-consulting.html`. |
| International SEO | Global intent was mentioned, but the site did not explain remote delivery, market context or the boundary between useful market targeting and doorway pages. | Added natural worldwide positioning, remote collaboration language and an explicit no-fake-location/no-doorway-page policy. No duplicate country pages were created. |
| Content trust | The deployed homepage displayed sample placeholder testimonials next to sample names and countries. Even with a disclaimer, that weakens trust and can be mistaken for social proof. | Removed sample quotes/names from the homepage. The feedback page now explains how genuine reviews will be collected and published. |
| Claims | Numeric experience/client/student claims and “happy client” counters were presented as proof without source context. | Removed unsupported counters from the new acquisition pages. Real experience/training context is described without turning an unverified number into a promise. Existing numeric pricing is labelled as a starting point and should be reconfirmed before publication. |
| Conversion | CTAs existed, but the visitor had to scan a long mixed page to understand what would happen after contact. | Added repeated but restrained CTAs, service-specific enquiry links, scope/expectation sections, a better brief prompt and a form that asks for market and project context. |
| Internal linking | The old navigation and long homepage made service relationships harder to follow. | New header/footer architecture links to the service hub, service pages, portfolio, blog, pricing, FAQ and contact. Every new service page includes related services and a CTA. |
| Metadata | Some pages used generic or duplicated descriptions; dynamic article metadata depended on a query parameter. | Added unique title/description/canonical/OG/Twitter metadata to the core pages and JSON-LD for person, service, website, breadcrumbs, FAQ and articles where appropriate. The dynamic article template remains a legacy improvement opportunity (see backlog). |
| Technical consistency | Most pages duplicated header/footer markup. That caused navigation and messaging drift. | Shared `site.js` now injects one navigation/footer system across legacy and refreshed pages. The chatbot is no longer loaded because its legacy knowledge base contained stale/sample claims. |
| URL structure | Dynamic blog and portfolio detail templates still use `?id=` URLs. | The new commercial service architecture uses readable `.html` paths. Blog/portfolio query URLs are still supported for backward compatibility; static slug pages are a future backlog item. |
| Image SEO | Several old pages used remote Pexels fallbacks and generic image descriptions. | New priority pages use local images, explicit dimensions, lazy loading below the fold and accurate contextual alt text. No keywords are forced into alt attributes. |
| Measurement | There was no documented measurement plan tied to commercial actions. | Added form fields and CTA hooks, kept Search Console/Analytics readiness in the roadmap, and documented the events and conversions to configure after deployment. |

### Current indexable architecture after the refresh

**Primary commercial pages:**

- `/` — broad digital marketing + web development positioning
- `/services.html` — service hub and intent routing
- `/seo-services.html` — SEO services
- `/meta-ads.html` — Facebook/Instagram advertising
- `/google-youtube-ads.html` — Google Ads, PPC and YouTube advertising
- `/web-development.html` — custom HTML/CSS/JavaScript websites and landing pages
- `/wordpress-development.html` — WordPress development and optimisation
- `/local-seo.html` — local SEO and Google Business Profile
- `/b2b-lead-generation.html` — B2B lead generation and prospect research
- `/digital-marketing-consulting.html` — consulting, research and training
- `/pricing.html` — transparent starting scope
- `/portfolio.html` — labelled work samples
- `/contact.html` — conversion endpoint

**Authority and support pages:**

- `/about.html`, `/blog.html`, `/faq.html`
- `/privacy-policy.html`, `/terms.html`, `/disclaimer.html`

**Legacy compatibility pages:**

- `/blog-details.html?id=...`, `/portfolio-details.html?id=...` remain available for existing article/project links.
- Team profile pages remain in the repository for compatibility but are not in the new sitemap/navigation. They should be reviewed before being reintroduced as indexable pages.
- `/testimonials.html` is `noindex` until genuine, attributable feedback is available.

## 2. Keyword and intent map

Keyword choices prioritise relevance, commercial intent and realistic page fit over raw volume. Country names are used as market context, not repeated in every heading. A page should use natural synonyms and related entities rather than repeating one exact phrase.

| Page | Primary keyword | Secondary / semantic terms | Market intent | Search intent | Commercial signal | Supporting content | Key internal links |
|---|---|---|---|---|---|---|---|
| Home `/` | digital marketing expert | digital marketing freelancer, SEO and digital marketing services, performance marketing, web development | Worldwide; Bangladesh + remote international clients | Commercial investigation | High | digital marketing strategy, SEO vs PPC, how to choose a freelancer | Services, SEO, Ads, Web, Lead Gen, Contact |
| Services hub | digital marketing services | SEO services, Google Ads, Meta Ads, website development, lead generation consultant | Worldwide | Commercial investigation | High | service comparison, marketing priorities for small business | Every service page, Pricing, Contact |
| SEO page | SEO services | SEO expert, SEO freelancer, technical SEO, on-page SEO, international SEO, website SEO optimisation | Worldwide; USA, UK, Canada, Australia and Europe as natural examples | Transactional / commercial | High | keyword research, technical SEO, on-page checklist, international SEO | Web, Local SEO, Consulting, Pricing, Contact |
| Meta Ads page | Meta Ads management | Facebook Ads expert, Instagram advertising, Meta advertising services, lead campaigns, retargeting | Worldwide; remote campaigns | Transactional / commercial | High | Meta Ads objectives, audience targeting, creative testing, retargeting | Google Ads, Lead Gen, Web, Contact |
| Google/YouTube Ads | Google Ads management | Google Ads expert, PPC management, Search Ads, YouTube Ads, conversion tracking | Worldwide; US/UK/Canada/Australia market examples | Transactional / commercial | High | Google Ads keyword research, PPC optimisation, Google vs Meta Ads, YouTube SEO | Meta Ads, Web, SEO, Contact |
| Web development | web development services | custom website development, HTML CSS JavaScript, responsive website, business website, landing page development | Worldwide; remote build | Transactional / commercial | High | business website guide, landing pages, website speed, accessibility | WordPress, SEO, Ads, Portfolio |
| WordPress page | WordPress developer | WordPress website development, WordPress SEO, WordPress optimisation, business WordPress site | Worldwide; UK/US/Australia as natural market examples | Transactional / commercial | High | HTML vs WordPress, WordPress speed, maintenance, security basics | Web, SEO, Local SEO, Pricing |
| Local SEO page | local SEO services | Google Business Profile optimisation, local search, service-area business, local SEO for small business | Genuine client locations only; no fake offices | Transactional / commercial | High | local SEO guide, GBP checklist, reviews, local landing pages | SEO, Web, Contact |
| B2B lead generation | B2B lead generation services | prospect research, LinkedIn lead generation, qualified leads, email lead generation, ICP | Worldwide; international B2B markets | Transactional / commercial | High | B2B prospecting, lead verification, qualification, responsible outreach | Meta Ads, Google Ads, Consulting |
| Consulting page | digital marketing consultant | keyword research service, competitor research, marketplace research, marketing strategy, trainer | Worldwide; remote consulting | Commercial investigation | High | digital marketing strategy, funnel, content, trends | SEO, Web, Ads, Lead Gen |
| Pricing | SEO and digital marketing pricing | affordable SEO services, website development cost, PPC management cost, freelance consultant rates | Bangladesh BDT + international USD references | Transactional / comparison | High | how to choose a service, scope and pricing | Every commercial page, Contact |
| Portfolio | SEO and web development portfolio | digital marketing work samples, SEO audit example, landing page, campaign structure | Worldwide | Commercial investigation | Medium/high | case-study format, how to evaluate a freelancer | Services, Pricing, Contact |
| Blog | SEO and digital marketing blog | web development guides, PPC guides, lead generation resources | Worldwide | Informational → commercial | Medium | topic clusters below | Service pages, Contact |
| About | Prosengit Kundu | digital marketing expert, SEO specialist, web developer, trainer | Worldwide + Khulna origin | Navigational / trust | Medium | training, methodology, E-E-A-T | Services, Portfolio, Contact |
| FAQ | SEO and digital marketing FAQ | SEO timeline, ad management, international clients, WordPress, freelance process | Worldwide | Informational / objection handling | Medium/high | answers link to service pages | Services, Pricing, Contact |
| Contact | contact Prosengit Kundu | hire digital marketing expert, request SEO review, discuss website project | Worldwide | Transactional | Highest | brief template, project planning | All major service pages |

### Natural market modifiers

Use modifiers only where the information genuinely changes: “SEO services for UK businesses”, “Google Ads for a Canadian service company”, “international SEO for a multi-market website”, “WordPress developer for a small business” and “B2B lead generation for a SaaS company”. Do not create a near-identical page for every country. A country-specific page should wait until there is unique research, a real service process or enough market-specific value to justify it.

### Search-intent rules

- **Transactional pages** lead with scope, fit, deliverables, process, limitations and a contact CTA.
- **Informational articles** answer the question fully, show examples, link to the relevant service and offer a non-aggressive next step.
- **Commercial investigation pages** compare approaches, costs, suitability and trade-offs rather than forcing one package.
- **Local intent** is used only for genuine businesses and service areas; no virtual offices, fake reviews or location stuffing.

## 3. Information architecture

```text
Home
├── Services
│   ├── SEO services
│   ├── Meta Ads management
│   ├── Google & YouTube Ads
│   ├── Custom web development
│   ├── WordPress development
│   ├── Local SEO & Google Business Profile
│   ├── B2B lead generation
│   └── Digital marketing consulting / research / training
├── Work samples
├── Insights / Blog
│   ├── SEO cluster
│   ├── Paid media cluster
│   ├── Web and WordPress cluster
│   ├── Lead generation cluster
│   └── Digital marketing strategy cluster
├── About
├── Pricing
├── FAQ
└── Contact
```

The header keeps the main navigation short. Dedicated service pages are reachable from the hub, homepage cards, footer and relevant articles. This avoids making every service compete for the homepage’s broad phrase.

## 4. Page-by-page content plan

### Homepage

- Make the broad proposition obvious in the H1 and first paragraph.
- Introduce Prosengit Kundu without unsupported counters or sample testimonials.
- Route visitors to eight distinct service intents.
- Explain international/remote support without fabricated locations.
- Show process, work-sample disclosure, useful FAQ and clear contact routes.

### Service hub

- Act as the commercial index, not a second long SEO page.
- Explain who each service is for and link to its dedicated page.
- Add a “which service should come first?” decision section.
- Keep social media/content as a supporting consulting path instead of creating a thin duplicate page.

### Dedicated service pages

Each page now includes:

1. One primary H1 and a unique metadata set.
2. The business problem and best-fit audience.
3. Service components with related entities and deliverables.
4. A process, realistic limitations and international context.
5. Four useful FAQs with FAQPage schema.
6. Related service links and a conversion CTA.

### Blog

The blog landing page routes visitors into clusters and commercial service pages. The existing article data contains useful long-form drafts. Before publishing more articles, each draft should be reviewed for author attribution, date accuracy, original examples, unique metadata, internal links and a clearly labelled CTA.

### About / trust

Use first-person context, actual training experience and the working methodology. Do not use certifications, client counts, revenue, rankings, awards or testimonials unless Prosengit can verify and approve the exact claim.

### Contact

Ask for name, business, email, website, service, market and project details. This reduces unqualified back-and-forth without making the form intimidating. The form gives an alternative email/WhatsApp route and states that submission is not a contract.

## 5. Blog topical map and internal-link paths

### SEO cluster

**Pillar:** Complete SEO guide for small businesses  
**Supporting articles:** What is SEO? · How search works · on-page SEO checklist · technical SEO foundations · off-page SEO explained · keyword research · SEO website audit · international SEO · local SEO · Google Business Profile · SEO mistakes · SEO vs PPC · how to hire an SEO freelancer.  
**Commercial destination:** `/seo-services.html` → `/contact.html`.

### Paid media cluster

**Pillars:** Google Ads for small businesses; Meta Ads for lead generation.  
**Supporting articles:** Google Ads campaign structure · keyword and negative-keyword research · conversion tracking · PPC optimisation · Google vs Meta Ads · Meta objectives · creative testing · retargeting · YouTube Ads and YouTube SEO.  
**Commercial destinations:** `/google-youtube-ads.html`, `/meta-ads.html` → `/contact.html`.

### Web and WordPress cluster

**Pillar:** Business website development guide.  
**Supporting articles:** HTML/CSS website development · responsive design · landing pages · website speed · usability · accessibility basics · website SEO · HTML vs WordPress · WordPress SEO · WordPress speed · WordPress security · maintenance.  
**Commercial destinations:** `/web-development.html`, `/wordpress-development.html` → `/contact.html`.

### Lead generation cluster

**Pillar:** B2B lead generation process.  
**Supporting articles:** ICP definition · prospecting · LinkedIn research · email lead generation · qualification · verification · business-data research · cold-email fundamentals and compliance.  
**Commercial destination:** `/b2b-lead-generation.html` → `/contact.html`.

### Digital marketing cluster

**Pillar:** Digital marketing strategy for small businesses.  
**Supporting articles:** funnel planning · customer acquisition · content marketing · social media · performance marketing · trends · choosing channels · marketing measurement.  
**Commercial destination:** `/digital-marketing-consulting.html` → `/contact.html`.

### Country and industry content rule

Publish a market/industry article only when it contains distinct research, examples, regulations, buying behaviour, platform context or a genuinely different service process. A proposed article must pass this test before publication:

- What is unique about this market or industry?
- What can the reader do differently after reading it?
- Which service page does it support?
- Is there evidence of relevance or a real business question?
- Is it more useful than a generic replacement-name page?

## 6. On-page, schema and image checklist

### Every commercial page

- One descriptive H1 aligned to its actual intent.
- Unique `<title>` and meta description; no obsolete keyword meta tag.
- Canonical URL and accurate Open Graph/Twitter fields.
- BreadcrumbList JSON-LD where the page has a clear hierarchy.
- Service JSON-LD only where the page genuinely describes that service.
- Accurate Person/ProfessionalService references; no aggregate ratings or fake reviews.
- Descriptive internal anchors such as “technical SEO service” or “WordPress development”, varied naturally.
- Clear first-screen CTA and a second CTA after the visitor understands the scope.

### Image handling

- Use an accurate filename and local asset when available.
- Preserve aspect ratio and declare `width` and `height` to reduce layout shift.
- Lazy-load below-the-fold images; do not lazy-load the main portrait if it is the LCP candidate.
- Alt text describes the image’s subject or function. It does not repeat a keyword list.
- Use captions only when they add useful context.

### Structured data boundaries

Implemented on the refreshed pages: Person, ProfessionalService, WebSite, WebPage, Service, BreadcrumbList, CollectionPage, ContactPage, Blog, Article (legacy dynamic template) and FAQPage where visible FAQs exist. Do not add review, rating, event, local business address or certification schema unless the underlying information is real and displayed.

## 7. Technical SEO and measurement backlog

### Completed in this refresh

- New service information architecture and readable commercial URLs.
- Unique metadata and canonical URLs on the main pages.
- Updated XML sitemap and robots rules.
- Shared navigation/footer to reduce drift.
- Semantic HTML, skip link, focus styles, form labels, responsive grids and `prefers-reduced-motion` handling.
- Local image dimensions, lazy loading and accurate alt text on new pages.
- Removal of sample testimonials from commercial pages and disabling of the legacy chatbot with stale claims.
- Contact form fields for service, market and project context.

### Recommended after deployment

1. Verify the domain in Google Search Console and submit the sitemap.
2. Confirm that the deployed form endpoint, `_next` redirect and email notifications work.
3. Configure GA4 or another privacy-appropriate analytics tool with consent requirements understood for the target markets.
4. Record commercial events: `contact_form_start`, `contact_form_submit`, `mailto_click`, `phone_click`, `whatsapp_click`, `service_cta_click`, `pricing_cta_click` and `portfolio_case_study_click`.
5. Mark form submissions or qualified enquiry events as conversions; do not call page views or clicks “leads”.
6. Run Lighthouse/PageSpeed and real-device checks for LCP, INP, CLS, mobile tap targets, contrast and form usability.
7. Check the production host for HTTPS, compression, caching, MIME types, 404 handling, redirect rules and whether `/backend/` is inaccessible.
8. Replace the dynamic `blog-details.html?id=` and `portfolio-details.html?id=` templates with static slug pages or server-rendered routes when the blog grows. Query URLs are currently retained for backward compatibility.
9. Review old team pages and legacy legal pages for current accuracy before linking or indexing them again.
10. Revisit pricing, contact availability and all factual professional claims regularly.

## 8. Final quality gate

Before publishing a new page or article, confirm:

- [ ] It has one clear search intent and does not cannibalise an existing page.
- [ ] The title, H1, URL, description and CTA match that intent.
- [ ] The page explains who it is for, what is delivered and what is out of scope.
- [ ] Claims, dates, prices, credentials, examples and testimonials are verified.
- [ ] Country or industry context adds real value rather than keyword repetition.
- [ ] At least two useful internal links point in and two relevant links point out.
- [ ] The image, alt text, dimensions and loading behaviour are appropriate.
- [ ] Mobile layout, keyboard navigation, contrast and form labels work.
- [ ] Schema describes visible, accurate content and has no fake ratings or locations.
- [ ] The next action is clear without promising a ranking, lead or sale.
