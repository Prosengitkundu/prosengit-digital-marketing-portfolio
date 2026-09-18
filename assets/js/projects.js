/* =====================================================================
   PORTFOLIO CASE-STUDY DATA — Prosengit Kundu
   ---------------------------------------------------------------------
   This is the single source of truth for portfolio routes, card copy,
   metadata and long-form case-study content. Each entry has a permanent
   numeric ID for legacy URLs and a unique, stable slug for public URLs.

   Important: These are clearly labelled practice/sample case studies.
   They explain the approach and deliverables without representing unnamed
   organisations, testimonials, campaign performance or rankings as facts.
   ===================================================================== */

const PROJECT_ROUTE_PREFIX = "/portfolio/";
const projectUrl = (slug) => `${PROJECT_ROUTE_PREFIX}${slug}.html`;

const PROJECTS = [
  {
    id: 1,
    slug: "custom-business-website",
    url: projectUrl("custom-business-website"),
    cat: "web",
    title: "Custom Business Website — HTML/CSS/JavaScript",
    projectType: "Practice / sample case study",
    industry: "Professional services",
    market: "An illustrative model for Bangladesh and international professional-service businesses",
    focus: "Custom HTML/CSS/JavaScript business website development with an SEO-friendly foundation",
    summary: "A sample blueprint for a fast, responsive business website with clear service pages, inquiry paths and technical SEO basics.",
    duration: "Illustrative 4-week workflow",
    image: "assets/images/work/business-website-design.webp",
    imageFallback: "assets/images/work/business-website-design.jpg",
    imageAlt: "Illustrative custom business website layout shown on desktop and mobile screens",
    metaTitle: "Custom HTML/CSS Business Website Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a custom HTML, CSS and JavaScript business website blueprint with responsive design, on-page SEO and technical foundations.",
    services: [
      { label: "HTML/CSS website development", href: "/services.html#website-services" },
      { label: "SEO & website optimization", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [2, 6],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "A lean business website blueprint, not a theme-led rebuild",
        paragraphs: [
          "This practice case study shows how I would plan a custom business website for a professional-service company that needs to explain its offer clearly and make it easy for a visitor to enquire. It is a sample workflow, not a published client result. The design direction keeps the site lightweight: hand-written HTML, CSS and JavaScript rather than a heavy theme or a stack of plugins.",
          "The target-market lens is intentionally broad. A service business in Bangladesh and a remote-facing business in the USA, UK, Canada or Australia still need the same fundamentals: understandable services, visible contact routes, credible supporting information, quick mobile access and pages that search engines can interpret. Local terminology, currency, compliance copy and service-area wording would be confirmed during discovery rather than assumed."
        ]
      },
      {
        eyebrow: "OBJECTIVES & CHALLENGE",
        heading: "Make the next step obvious without sacrificing search foundations",
        paragraphs: [
          "A new or outdated business site often tries to answer every question on one page. That leaves visitors unsure of what the company does and leaves search engines without focused service pages. The challenge in this sample is to create a small, purposeful information architecture: Home for the value proposition, individual service pages for intent, About for context, Pricing or scope guidance where appropriate, and Contact for the next step.",
          "The objective is not to promise a conversion rate or a ranking. It is to deliver a site structure that gives future SEO, advertising and referral traffic a useful destination. Every design and content decision is therefore assessed for clarity, mobile usability, loading weight and its role in the inquiry journey."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Start with audience questions, page intent and practical search language",
        paragraphs: [
          "The research phase would begin with the business offer, priority services, customer questions, geographic coverage and existing assets. I would group search terms by intent instead of placing every keyword on the homepage. A person comparing a service needs different information from a person ready to request a quotation, and that distinction informs the page map, headings and internal links.",
          "The strategy combines conversion structure with on-page SEO. Each core page receives one clear primary topic, a descriptive title and meta description, semantic headings, useful internal links and an appropriate call to action. If local visibility is important, the brief would also identify service areas and the Google Business Profile information that should agree with the website; no location or business listing would be invented."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Build for responsive use, accessible content and maintainable SEO",
        paragraphs: [
          "Implementation would use semantic HTML landmarks, a single H1 on each page, logical H2 and H3 sections, accessible labels and keyboard-friendly navigation. The layout is planned mobile-first, then expanded for tablet and desktop screens. Images are resized, compressed and given alt text that describes their visual role instead of repeating marketing phrases.",
          "Technical handover would include an XML sitemap, robots directives, canonical URLs, Open Graph metadata and basic schema where it accurately describes the site. The contact path would be tested alongside the navigation and page links. This is a practical foundation for ongoing content work, SEO audits or paid-traffic landing pages rather than a claim that the build alone produces a particular commercial outcome."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study used to demonstrate planning, custom HTML/CSS/JavaScript development and SEO-aware website delivery. No client name, traffic figure, ranking, revenue result or testimonial is claimed. For a live project, the final scope would be based on the number of pages, content readiness, functionality, target market and the business's own goals."
        ]
      }
    ],
    deliverables: [
      "Page and navigation plan for Home, Services, About, Pricing and Contact",
      "Custom responsive layout coded in HTML, CSS and JavaScript",
      "Mobile-first checks across common phone, tablet and desktop widths",
      "Semantic heading hierarchy and accessible form labels",
      "Unique page titles, meta descriptions and Open Graph metadata",
      "Compressed WebP images with descriptive filenames and alt text",
      "Contact form structure and clear enquiry routes",
      "XML sitemap, robots.txt and canonical URL setup"
    ],
    lessons: "A business website is more useful when the service structure and contact journey are decided before visual polish. Clear page intent also makes future keyword research, local SEO and advertising work easier to organise."
  },
  {
    id: 2,
    slug: "high-converting-landing-page-design",
    url: projectUrl("high-converting-landing-page-design"),
    cat: "web",
    title: "High-Converting Landing Page Design",
    projectType: "Practice / sample case study",
    industry: "Lead capture and paid traffic",
    market: "An illustrative landing-page workflow for Bangladesh and international service offers",
    focus: "Conversion-focused landing page development for Google Ads and Meta Ads traffic",
    summary: "A sample single-goal landing page process that aligns the message, form experience, tracking plan and mobile layout.",
    duration: "Illustrative 2-week workflow",
    image: "assets/images/work/landing-page-design.webp",
    imageFallback: "assets/images/work/landing-page-design.jpg",
    imageAlt: "Illustrative lead-generation landing page design with call-to-action sections",
    metaTitle: "Landing Page Design Case Study for Paid Campaigns | Prosengit Kundu",
    metaDescription: "Practice case study: a conversion-focused landing page workflow for Google Ads or Meta Ads, including message match, form UX, responsive design and measurement planning.",
    services: [
      { label: "HTML/CSS website development", href: "/services.html#website-services" },
      { label: "Google Ads and Meta Ads strategy", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [1, 7, 8],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "A focused page for one campaign decision",
        paragraphs: [
          "This practice case study documents a landing-page blueprint for a business that sends paid traffic to one specific offer. It is not evidence of a client campaign or a conversion result. The page is deliberately narrower than a full website: it should help a visitor understand the offer, decide whether it is relevant, address reasonable questions and take one measurable next step.",
          "The approach can be adapted to a service offer in Bangladesh or an international market, but the final language, form fields, privacy wording and booking method should reflect the actual audience and sales process. A landing page does not work in isolation; it must match the ad, the audience expectation and the way the business follows up after an enquiry."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Reduce friction while keeping the enquiry meaningful",
        paragraphs: [
          "Paid clicks have a cost, yet a generic homepage frequently gives campaign visitors too many routes and too little context. The sample challenge is to replace that ambiguity with a clear promise, supporting points, an appropriate proof area where the business has real material, frequently asked questions and a short lead form. The aim is a more coherent visitor journey, not an unsupported promise of leads.",
          "Form design needs a careful balance. Too many fields can discourage an enquiry; too few can leave the sales team without useful context. The appropriate fields depend on the service, market and follow-up capacity. Qualification questions should be agreed with the business rather than copied from a template."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Map ad intent to a page that answers the right questions",
        paragraphs: [
          "Research would review the proposed campaign objective, the target audience, keyword or creative angle, competitor positioning and the existing website. For Google Ads, the landing-page headline should closely reflect the commercial search intent behind the ad group. For Meta Ads, it should clarify the offer immediately because the visitor may not have been actively searching for it.",
          "The page sequence follows a simple decision path: offer and audience first, then benefits and delivery context, then genuine evidence or process detail, then objections and contact. The primary call to action is repeated at logical points, while secondary contact options are used only when they support the same goal. Analytics events and consent requirements are planned before traffic is sent."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Design and build for fast mobile review",
        paragraphs: [
          "The sample implementation uses a clear visual hierarchy, concise sections and a mobile-first layout. The hero communicates the purpose without relying on an image to carry essential text. The form uses readable labels, inline validation and a confirmation state that tells the visitor what happens next. Images are compressed and non-essential visual assets are lazy-loaded to protect the initial page experience.",
          "Before launch, I would test the form, phone and WhatsApp links, UTM persistence where needed, thank-you flow, conversion event and responsive layout. The advertising account and tracking remain under the business's ownership. Any later optimisation should be based on real traffic and lead-quality feedback, not assumptions or a fixed conversion benchmark."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study demonstrating landing-page strategy, custom front-end implementation and measurement planning. It does not report campaign spend, cost per lead, conversion rate or sales. A final landing-page quotation depends on the offer, copy support, form or booking integration, tracking requirements, ad platform and number of variants required."
        ]
      }
    ],
    deliverables: [
      "Single-goal page structure and message-match plan",
      "Hero, offer, process, FAQ and call-to-action hierarchy",
      "Short lead form with accessible labels and validation guidance",
      "Responsive HTML, CSS and JavaScript implementation",
      "Image compression and performance-aware asset loading",
      "Google Ads or Meta Ads conversion-tracking checklist",
      "Launch checks for contact routes and thank-you handling"
    ],
    lessons: "A landing page should be judged by the clarity of the next step and the quality of the measurement plan, not by a generic claim that a design is high-converting."
  },
  {
    id: 3,
    slug: "photographer-portfolio-website",
    url: projectUrl("photographer-portfolio-website"),
    cat: "web",
    title: "Photographer Portfolio Website",
    projectType: "Practice / sample case study",
    industry: "Photography and visual creative services",
    market: "An illustrative website approach for local and international visual professionals",
    focus: "Image-led portfolio website development with responsive galleries and image SEO",
    summary: "A sample gallery-first site plan that protects image quality, supports booking enquiries and gives search engines meaningful context.",
    duration: "Illustrative 3-week workflow",
    image: "assets/images/work/portfolio-website-design.webp",
    imageFallback: "assets/images/work/portfolio-website-design.jpg",
    imageAlt: "Illustrative photography portfolio website layout with a responsive image gallery",
    metaTitle: "Photography Portfolio Website Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a gallery-first photography portfolio website plan with responsive design, image SEO, fast-loading media and booking enquiry paths.",
    services: [
      { label: "Portfolio website development", href: "/services.html#website-services" },
      { label: "Image SEO and website optimization", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [1, 11, 12],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Let the work lead while the website does the supporting job",
        paragraphs: [
          "This practice case study outlines a portfolio website for a photographer or visual creative whose images need to be the main focus. It is a sample design and delivery process, not a published client website. The central task is to make a gallery feel considered on a large screen without creating a slow or frustrating experience on a phone.",
          "A photographer may serve a local city, destination clients or an international niche. The site should therefore make the genuine service area, photography categories, booking process and usage expectations easy to understand. Those details need to come from the creative's own brief; this sample does not assign a location, audience size or commercial result to an unnamed business."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Balance visual quality, page speed and discoverability",
        paragraphs: [
          "Large images can express craft and build trust, but uploading full-size files everywhere increases loading time and can harm the mobile experience. Conversely, an overly compressed gallery can undermine the presentation itself. The challenge is to create an image strategy that selects the right crop, file format, dimensions and loading priority for each placement.",
          "Portfolio pages also need enough written context to be understandable. A gallery with no headings, captions or service information may be difficult for a potential client and gives little semantic context to search engines. The goal is useful descriptions that support the images without turning the portfolio into a wall of repeated keywords."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Organise images around client intent and a sustainable publishing workflow",
        paragraphs: [
          "Discovery would identify priority photography categories, the desired booking action, the locations actually served, existing image rights and whether the owner needs a CMS such as WordPress. I would then map the gallery: a concise home selection, category pages where useful, a process or about page, and a clear contact path. The structure is intentionally flexible for photographers, videographers and design studios.",
          "Image SEO planning includes a naming convention, descriptive alt-text rules, captions where they add context and an image-sitemap review for a larger archive. Alt text should explain an image to someone who cannot see it; it should not be a list of location or service terms. Images outside the initial viewport are loaded lazily, while the page's lead visual receives appropriate priority."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "A gallery-first responsive build with clear booking routes",
        paragraphs: [
          "The sample build uses a flexible grid that adjusts the column count and tap target size across phones, tablets and desktops. Semantic headings introduce each project group, and accessible controls are used if a lightbox or filter is added. The contact section gives visitors a straightforward way to discuss availability, a brief and the relevant type of session or commission.",
          "Performance testing would cover image sizes, layout shift, responsive crop behaviour and the gallery's behaviour when JavaScript is unavailable. The final implementation can be custom-coded or adapted for WordPress when regular publishing matters more than a fully bespoke workflow. No booking volume, visibility result or client outcome is claimed in this sample."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This practice case study demonstrates portfolio information architecture, responsive gallery development and image-SEO considerations. It contains no claim about a named photographer, gallery traffic, bookings or search ranking. A real project would begin with image licensing, content availability, required categories and the preferred publishing workflow."
        ]
      }
    ],
    deliverables: [
      "Gallery-first site map and booking journey plan",
      "Responsive image-grid and portfolio category layout",
      "Image naming, alt-text and caption guidance",
      "WebP delivery and lazy-loading recommendations",
      "Semantic page structure and metadata setup",
      "Contact and booking-enquiry section",
      "Cross-device checks for image crops and gallery interaction"
    ],
    lessons: "For image-heavy websites, the strongest design decision is often a disciplined content and image-delivery system rather than a more complicated gallery effect."
  },
  {
    id: 4,
    slug: "local-seo-growth-system",
    url: projectUrl("local-seo-growth-system"),
    cat: "seo",
    title: "Local SEO Growth System",
    projectType: "Practice / sample case study",
    industry: "Local service businesses",
    market: "An illustrative local-search workflow; service area and country are confirmed for each real business",
    focus: "Local SEO strategy with service-area research, on-page improvements and Google Business Profile planning",
    summary: "A sample local SEO roadmap for connecting a service website, Google Business Profile and local search intent without claiming a ranking outcome.",
    duration: "Illustrative 6-month roadmap",
    image: "assets/images/work/seo-analytics-dashboard.webp",
    imageFallback: "assets/images/work/seo-analytics-dashboard.jpg",
    imageAlt: "Illustrative local SEO analytics dashboard and search-visibility planning screen",
    metaTitle: "Local SEO Growth System Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a local SEO roadmap covering service-area keyword research, Google Business Profile planning, on-page SEO and measurement setup.",
    services: [
      { label: "Local SEO and Google Business Profile optimization", href: "/services.html#digital-marketing" },
      { label: "SEO & website optimization", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [5, 6],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "A local-search system built around real service areas",
        paragraphs: [
          "This practice case study illustrates a local SEO roadmap for a service business that wants its website and local presence to answer nearby search demand more clearly. It is not a report of a particular company's Maps position, call volume or review count. Local SEO is highly dependent on an actual location, eligible Google Business Profile, competition and the services genuinely offered.",
          "The same method can be adapted for a business in Bangladesh or another market, but the city, language, service-area rules and platform availability must be verified first. Rather than inserting a country name into every page, the work starts by understanding how local customers describe the service and what information helps them decide to make contact."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Align business facts across the local customer journey",
        paragraphs: [
          "A common local-search problem is inconsistency: the website, Google Business Profile, social pages and directories describe the business differently or leave key fields incomplete. A second problem is content that talks only about the company and never addresses a service-plus-location question. The sample challenge is to identify these gaps and turn them into a prioritised checklist instead of making broad ranking promises.",
          "A legitimate local SEO plan also needs to respect platform guidelines. Review requests, business categories, service-area settings and address visibility should follow the rules for the actual business model. This sample does not recommend fabricated reviews, false locations, keyword-stuffed business names or any tactic that could misrepresent a business."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Use a local intent map rather than a generic keyword list",
        paragraphs: [
          "Research would combine a website review with real service names, town or city modifiers, nearby-area terminology and search-result observations. I would separate high-intent service queries from educational questions, then map them to the page that can genuinely answer them. The local pack, organic results and competitor pages provide direction, but not a guarantee that a site will occupy the same positions.",
          "The strategy links three elements: a complete and accurate Google Business Profile, service pages with helpful local context, and consistent business details on relevant citations. Tracking is planned around available signals such as Search Console impressions, profile interactions and enquiry quality. The goal is a more manageable local-search foundation and an informed next-step plan."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Prioritise accuracy, useful service pages and regular review",
        paragraphs: [
          "Implementation begins by recording the business's approved name, phone, address or service area, opening hours and core services. Website recommendations may include clearer service-page titles, locally relevant FAQs, internal links, structured data that reflects genuine information and improved contact details. Google Business Profile work would cover the fields, category choices, photos and update plan that the owner can verify.",
          "A reporting template then distinguishes completed work from performance signals. It can record crawl issues, content changes, profile updates and visibility observations without treating a temporary ranking movement as proof of a permanent result. The business remains responsible for providing accurate details and responding to customer enquiries."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study demonstrating a compliant local SEO process. No client location, Google Business Profile, review count, ranking, call increase or direction-request result is claimed. A real local SEO audit starts with the verified business details, service area, website access and market priorities."
        ]
      }
    ],
    deliverables: [
      "Local-search and website visibility audit framework",
      "Service and location keyword-intent map",
      "Google Business Profile field and category checklist",
      "Business-information consistency and citation review list",
      "Service-page and local FAQ recommendations",
      "Compliant review-request and response guidance",
      "Measurement template for completed work and observed signals"
    ],
    lessons: "Local SEO is stronger when the website, Business Profile and customer information tell the same accurate story. The process should be measurable, but it should never promise a Maps position."
  },
  {
    id: 5,
    slug: "keyword-research-content-mapping",
    url: projectUrl("keyword-research-content-mapping"),
    cat: "seo",
    title: "Keyword Research & Content Mapping",
    projectType: "Practice / sample case study",
    industry: "Content strategy and website SEO",
    market: "An illustrative research framework for Bangladesh and international English-language markets",
    focus: "Keyword research, SERP analysis and intent-led content mapping for SEO planning",
    summary: "A sample research process that turns broad topics into a page-by-page keyword and internal-linking plan.",
    duration: "Illustrative 2-week workflow",
    image: "assets/images/work/keyword-research-spreadsheet.webp",
    imageFallback: "assets/images/work/keyword-research-spreadsheet.jpg",
    imageAlt: "Illustrative keyword research spreadsheet with topic clusters and content mapping columns",
    metaTitle: "Keyword Research & Content Mapping Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: an intent-led keyword research and content-mapping workflow covering SERP review, topic clusters, page assignment and internal linking.",
    services: [
      { label: "Keyword research and SEO strategy", href: "/services.html#digital-marketing" },
      { label: "SEO & website optimization", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [4, 6],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Turn topic ideas into a usable publishing decision system",
        paragraphs: [
          "This practice case study demonstrates an intent-led keyword research and content-mapping process. It is a sample deliverable, not a claim that a particular domain ranked for the phrases discussed. The objective is to give a business an organised view of the questions and commercial searches relevant to its offer, then assign each meaningful theme to the page best suited to answer it.",
          "The research model can support a Bangladesh-based business, an international service provider or a company entering one of its existing target countries. It does not assume that keyword volume, language or search behaviour is identical across markets. Country and language choices should be based on the client's actual customers, services and ability to support the resulting content."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Avoid a larger list that creates more overlap",
        paragraphs: [
          "Many keyword documents become a long export with no connection to page decisions. That can lead to multiple pages targeting the same intent, thin articles written only to use a phrase, or service pages that compete with each other. The sample challenge is to reduce that ambiguity through a one-page-per-primary-intent approach while recognising that related terminology can appear naturally on the same useful page.",
          "Keyword difficulty and search-volume estimates are directional inputs, not guarantees. Search results change by device, location and time, and a new site may need to build topical depth before competing for broad terms. The research output should therefore rank opportunities by relevance, intent, feasibility and business value rather than chasing the biggest number."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Combine seed topics, SERP evidence and the buyer journey",
        paragraphs: [
          "The workflow starts with the business's services, customer questions, sales language and existing pages. Seed topics are expanded into problem, comparison, service and location variations where relevant. A SERP review checks what formats currently satisfy the query: service page, guide, category, video, local result or something else. This prevents a content plan from forcing the wrong page type onto a search intent.",
          "Each selected topic is classified by funnel stage and mapped to a new or existing page. Supporting articles link to the relevant service page using descriptive anchors, while related service pages link where the visitor would genuinely benefit. This builds a content plan that helps both visitors and site structure rather than an isolated collection of posts."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Deliver a map that a writer, owner or developer can use",
        paragraphs: [
          "The final sample format is a filterable spreadsheet or document with topic cluster, primary intent, supporting terms, recommended URL or page, content type, priority, internal-linking opportunities and notes from the SERP review. Existing pages are marked for improvement rather than replaced without a reason. Titles and headings are recommendations to be refined against the brand's own wording.",
          "The map should be revisited after publishing and Search Console data becomes available. Queries that generate impressions, pages that overlap and changes in business priorities can all justify a revision. That iterative process is more credible than presenting a research file as a one-time guarantee of rankings or traffic."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This practice case study demonstrates keyword research, SERP analysis and content-mapping methodology. It does not reveal another business's private keyword data or claim search volume, traffic, ranking or revenue outcomes. A real engagement would use the client's niche, approved target market, existing site and content resources."
        ]
      }
    ],
    deliverables: [
      "Seed-topic and customer-question expansion",
      "Search-intent classification for priority terms",
      "SERP observation notes and page-format recommendations",
      "Primary-topic-to-page content map",
      "Cannibalisation and overlap review",
      "Prioritised content calendar",
      "Descriptive internal-linking recommendations"
    ],
    lessons: "The value of keyword research is not the length of the export. It is the clarity of the next content decision and the discipline to avoid competing pages."
  },
  {
    id: 6,
    slug: "technical-seo-audit-report",
    url: projectUrl("technical-seo-audit-report"),
    cat: "seo",
    title: "Technical SEO Audit — Full Report",
    projectType: "Practice / sample case study",
    industry: "Business websites and ecommerce foundations",
    market: "An illustrative audit process for sites serving Bangladesh or international markets",
    focus: "Technical SEO audit covering crawlability, indexation, metadata, site performance and structured data",
    summary: "A sample crawl-to-fix audit framework that prioritises technical and on-page issues without promising rankings.",
    duration: "Illustrative 2-week workflow",
    image: "assets/images/work/technical-seo-audit.webp",
    imageFallback: "assets/images/work/technical-seo-audit.jpg",
    imageAlt: "Illustrative technical SEO audit dashboard with website health and optimisation checks",
    metaTitle: "Technical SEO Audit Report Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a technical SEO audit workflow for crawlability, indexation, metadata, site performance, structured data and prioritised fixes.",
    services: [
      { label: "Technical SEO audit and website optimization", href: "/services.html#digital-marketing" },
      { label: "HTML/CSS website development", href: "/services.html#website-services" }
    ],
    relatedProjectIds: [1, 4, 5],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "A technical audit that turns findings into an ordered repair plan",
        paragraphs: [
          "This practice case study shows the structure of a technical SEO audit for a business website. It is a sample framework, not a published audit of a client domain. Its purpose is to help a site owner distinguish critical crawl and indexation issues from improvements that can be planned later, then communicate those priorities clearly to a developer or content team.",
          "The framework can be applied to a website serving Bangladesh, the USA, UK, Canada, Australia or a broader international audience. International scope introduces additional considerations such as language targeting, regional content and canonical consistency, but those recommendations are only appropriate after the real site architecture and business requirements are reviewed."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Diagnose the causes before prescribing a long list of fixes",
        paragraphs: [
          "Technical SEO reports can be overwhelming when they mix every observation into one unranked checklist. A missing canonical, a blocked important page and a minor alt-text improvement do not carry the same urgency. The sample challenge is to assess each issue by likely impact, implementation effort, page importance and whether it can be verified after the change.",
          "A crawl tool cannot explain every business decision by itself. Some duplicate pages are intentional, some noindex tags are correct and some performance trade-offs support essential features. The audit therefore combines automated checks with manual review of the navigation, page intent, metadata, internal links and the way a real visitor reaches key services."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Review technical signals alongside the pages that matter",
        paragraphs: [
          "The audit process reviews robots directives, XML sitemaps, status codes, redirect paths, canonical URLs, headings, titles, descriptions, image delivery, structured data and mobile performance indicators. Search Console and analytics access, when provided, adds context about indexed pages and search queries. Recommendations are written so that an owner can understand the issue before assigning it to a developer.",
          "The strategy separates immediate blockers from iterative improvements. For example, a broken internal link or an accidentally blocked service page is investigated before broad content work. After core accessibility and indexability checks, the report can recommend a metadata refresh, image compression, internal-linking changes or an international SEO review if those match the business plan."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Create a developer-ready, verifiable remediation plan",
        paragraphs: [
          "Each issue in the sample report includes the affected area, why it matters, the recommended action, owner or skill needed, priority and a way to validate the fix. Screenshots or URLs are included when they help reproduce a problem. A short executive summary helps decision-makers understand the main risks without needing to interpret every crawl diagnostic.",
          "After implementation, the original checks are repeated and the change log records what has been fixed, deferred or found to be intentional. This closes the gap between an audit and actual improvement. It does not guarantee rankings, Core Web Vitals scores or indexation timing, which remain dependent on the website, search engine processing and ongoing content quality."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study for a technical SEO audit process. No client URL, crawl score, traffic result, ranking result or performance statistic is claimed. A real audit scope depends on site size, CMS, access, migrations, target countries and the business's priority pages."
        ]
      }
    ],
    deliverables: [
      "Crawlability, indexation and robots review",
      "Status-code, redirect, sitemap and canonical checks",
      "Metadata, heading and internal-link review",
      "Mobile and page-performance diagnostic notes",
      "Image SEO and structured-data gap review",
      "Prioritised impact-versus-effort remediation roadmap",
      "Fix-validation checklist and handover notes"
    ],
    lessons: "A useful audit makes technical work actionable. The clearest report is one that explains what should be fixed first and how the owner can verify it."
  },
  {
    id: 7,
    slug: "meta-ads-lead-campaign",
    url: projectUrl("meta-ads-lead-campaign"),
    cat: "ads",
    title: "Meta Ads Lead Campaign Structure",
    projectType: "Practice / sample case study",
    industry: "B2B and service lead generation",
    market: "An illustrative Meta Ads framework for Bangladesh and international service audiences",
    focus: "Meta Ads campaign planning with audience research, creative testing, lead qualification and measurement",
    summary: "A sample Facebook and Instagram campaign structure with ownership, testing and lead-quality safeguards built in.",
    duration: "Illustrative 3-month optimisation plan",
    image: "assets/images/work/meta-ads-dashboard.webp",
    imageFallback: "assets/images/work/meta-ads-dashboard.jpg",
    imageAlt: "Illustrative Meta Ads campaign dashboard with audience and creative planning panels",
    metaTitle: "Meta Ads Lead Campaign Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a Meta Ads lead campaign framework covering audience research, creative testing, qualification, retargeting and conversion measurement.",
    services: [
      { label: "Meta Ads / Facebook Ads management", href: "/services.html#digital-marketing" },
      { label: "Landing page development", href: "/services.html#website-services" }
    ],
    relatedProjectIds: [2, 8, 11],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "A paid-social plan designed to learn before it scales",
        paragraphs: [
          "This practice case study outlines a Meta Ads structure for a service business that wants to generate and qualify enquiries through Facebook and Instagram. It demonstrates campaign planning only; it is not a record of an active client account, advertising spend, lead volume or return on ad spend. The business owns its account and pays platform spend directly, keeping access and billing transparent.",
          "The model can be adapted for Bangladesh and international audiences, but targeting options, creative language, consent requirements and lead follow-up differ by market. Before launch, the actual offer, customer eligibility, service coverage and sales capacity need to be confirmed. A campaign should never be asked to compensate for an unclear offer or a team that cannot respond to legitimate leads."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Separate awareness, consideration and conversion signals",
        paragraphs: [
          "Paid-social audiences do not always arrive with the immediate intent seen in a commercial search. The sample challenge is to structure campaigns so that new audiences, warm visitors and existing contacts are not mixed into one measurement bucket. That makes it easier to understand which message and audience combination is producing useful engagement or qualified enquiries.",
          "Lead quality is as important as lead volume. A short form may increase submissions but can create more manual work for a service business if it lacks basic qualification. The right questions depend on the offer and market. This sample treats qualification, CRM handling and follow-up speed as parts of the campaign plan rather than making a promise that every form completion will become a customer."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Build audiences and creative around a real customer problem",
        paragraphs: [
          "Research begins with the customer profile, pain points, buying triggers, existing customer insights, geographic eligibility and the assets available for advertising. Audience hypotheses can include broad, interest-based, first-party and retargeting segments where lawful and technically available. Each one is documented as a testable assumption, not a claim that the platform will reach a perfect audience.",
          "The strategy uses distinct campaign stages: prospecting for new people, warm activity for people who have interacted with the business, and retargeting for appropriate visitors or leads. Creative angles focus on the offer, problem, process or proof that the business can substantiate. Conversion events, lead form fields and a landing page are reviewed before spend is increased."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Use a test plan and a transparent optimisation rhythm",
        paragraphs: [
          "The sample setup defines naming conventions, campaign objectives, ad-set logic, creative variants, placements, exclusions, lead-form questions and event checks. The account structure is kept readable so the owner can see what is running. A testing calendar limits the number of variables changed at once and records why a change was made.",
          "Ongoing work would review delivery, frequency, creative fatigue, form completion and feedback on lead relevance. Budget decisions are made with enough data for the account's scale and without promising a cost per lead. Reports explain completed work, observations and next tests in plain language. Any tracking code is installed only with the website owner's permission and appropriate consent setup."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This practice case study demonstrates Meta Ads planning, audience structure, creative testing and measurement design. It makes no claim about ad spend, reach, click-through rate, cost per lead, sales or return on ad spend. A real campaign is scoped around the objective, target market, creative assets, tracking readiness and follow-up process."
        ]
      }
    ],
    deliverables: [
      "Customer-profile and audience-hypothesis worksheet",
      "Prospecting, warm-audience and retargeting campaign architecture",
      "Creative-angle and variant-testing plan",
      "Lead-form qualification and follow-up checklist",
      "Meta Pixel and conversion-event verification plan",
      "Naming conventions, budget pacing and reporting routine",
      "Owner-access and ad-spend transparency guidance"
    ],
    lessons: "A responsible Meta Ads plan is not a promise of cheap leads. It is a documented process for testing audiences, messages and follow-up while the business keeps control of its account."
  },
  {
    id: 8,
    slug: "google-ads-search-campaign",
    url: projectUrl("google-ads-search-campaign"),
    cat: "ads",
    title: "Google Ads Search Campaign Blueprint",
    projectType: "Practice / sample case study",
    industry: "Service businesses with commercial search demand",
    market: "An illustrative Google Search Ads framework for Bangladesh and international markets",
    focus: "Google Ads Search campaign planning with keyword grouping, negative keywords, ad assets and conversion tracking",
    summary: "A sample search-campaign blueprint built around commercial intent, disciplined account structure and transparent measurement.",
    duration: "Illustrative 3-month optimisation plan",
    image: "assets/images/work/google-ads-dashboard.webp",
    imageFallback: "assets/images/work/google-ads-dashboard.jpg",
    imageAlt: "Illustrative Google Ads dashboard with search campaign and keyword planning data",
    metaTitle: "Google Ads Search Campaign Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a Google Ads Search campaign workflow for keyword research, ad-group structure, negative keywords, responsive ads and conversion tracking.",
    services: [
      { label: "Google Ads management", href: "/services.html#digital-marketing" },
      { label: "Keyword research and landing-page planning", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [2, 5, 7],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Capture relevant search intent with an account the owner can understand",
        paragraphs: [
          "This practice case study presents a Google Ads Search campaign blueprint for a service business. It is a demonstration of planning and setup methodology, not an active-account result. Search advertising can place a relevant offer in front of people who are already researching or comparing services, but performance depends on the auction, offer, landing page, budget, tracking and the business's ability to handle enquiries.",
          "The sample is suitable for adaptation to Bangladesh and the site's established international markets, including the USA, UK, Canada and Australia. Actual targeting, keyword language, match types, ad-policy requirements and budgets must be reviewed for the real market. Local claims or location extensions should only reflect locations and services that the advertiser can genuinely support."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Protect intent without making the account too broad or too fragmented",
        paragraphs: [
          "A rushed search campaign can combine unrelated terms, send users to a generic page and pay for searches that have no relationship to the offer. The sample challenge is to group terms by a shared commercial theme, choose a landing page that answers that theme, and maintain a negative-keyword process that protects the budget from clearly irrelevant searches.",
          "At the same time, excessive segmentation can leave a small account without enough data to learn. The appropriate structure is based on the number of services, budget and search demand. This sample avoids a one-size-fits-all setting and instead documents the choices so they can be revised when real search-term and conversion data arrives."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Use commercial queries, search results and exclusions together",
        paragraphs: [
          "Research starts with the actual service list, geographic coverage, preferred enquiry action, current website pages and known customer language. Keyword ideas are organised by service and intent, then reviewed against the search results and the available landing page. Informational, employment, educational or unrelated terms are considered for exclusions when they do not match the campaign objective.",
          "The strategy uses tightly themed ad groups, responsive search-ad assets that accurately describe the offer, useful extensions and a conversion plan. Ad copy should set a clear expectation rather than make claims the business cannot prove. The campaign and conversion tracking are established in the client's account, with ad spend billed directly by Google to the account owner."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Launch with checks, then optimise from real search-term evidence",
        paragraphs: [
          "The sample implementation includes account and campaign naming, location and language settings, ad-group mapping, match-type choices, negative-keyword lists, responsive ad assets, extensions and conversion actions. The relevant phone, form or booking route is tested before launch. Landing-page recommendations are noted when the campaign intent is not served well by an existing page.",
          "Management then follows a regular rhythm: check search terms, verify conversion data, review budgets and identify themes that need new ads, negatives or landing-page improvements. Changes are recorded so the owner knows what has been tested. This creates a responsible optimisation process without promising a position, click price, cost per conversion or sales outcome."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This practice case study demonstrates Google Ads Search campaign research, structure and measurement planning. It does not claim an account history, spend, impression share, lead count, conversion value or revenue result. A live campaign requires access to the advertiser's own account, an approved landing page, a realistic budget and accurate conversion definitions."
        ]
      }
    ],
    deliverables: [
      "Commercial-keyword and search-intent research",
      "Keyword-to-ad-group and landing-page map",
      "Match-type and negative-keyword strategy",
      "Responsive Search Ad copy and extension plan",
      "Location, language and policy-review checklist",
      "Form, call or booking conversion-tracking plan",
      "Search-term review and optimisation routine"
    ],
    lessons: "Google Ads works best when search intent, ad language, landing page and conversion measurement agree. Transparent testing is more useful than promising a particular cost or result."
  },
  {
    id: 9,
    slug: "b2b-targeted-lead-list",
    url: projectUrl("b2b-targeted-lead-list"),
    cat: "lead",
    title: "B2B Targeted Lead List Build",
    projectType: "Practice / sample case study",
    industry: "B2B agencies, software and professional services",
    market: "An illustrative research workflow for compliant B2B outreach in approved target markets",
    focus: "B2B lead generation through ideal-customer profiling, company research, contact research and data hygiene",
    summary: "A sample prospect-list workflow designed around relevance, documented sources, data quality and responsible outreach preparation.",
    duration: "Illustrative 1–2-week batch workflow",
    image: "assets/images/work/lead-generation-database.webp",
    imageFallback: "assets/images/work/lead-generation-database.jpg",
    imageAlt: "Illustrative B2B prospect research database with organised company and contact fields",
    metaTitle: "B2B Targeted Lead List Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a B2B lead-list research workflow covering ideal customer profiles, company sourcing, decision-maker research, data hygiene and outreach preparation.",
    services: [
      { label: "B2B lead generation", href: "/services.html#digital-marketing" },
      { label: "Email marketing and outreach preparation", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [10, 7],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Build a prospecting asset around fit, not a large unfiltered export",
        paragraphs: [
          "This practice case study explains a B2B lead-list research workflow for agencies, software companies and service businesses. It is a sample process, not a claim that a specific client received contacts, booked meetings or made sales. The purpose is to create a well-organised starting point for a business's own compliant outreach and sales process.",
          "A lead list must reflect the market and lawful basis relevant to the client. Company types, roles, locations and data fields are agreed before research starts. The workflow can support Bangladesh or international market research, but it does not assume that data sources, privacy rules or outreach practices are the same in every country. The client remains responsible for using data lawfully and respectfully."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Define relevance before looking for contact details",
        paragraphs: [
          "The most expensive mistake in lead generation is researching the wrong audience at scale. A loose brief such as 'find businesses that need marketing' can create a list that looks large but gives a sales team little reason to start a conversation. The sample challenge is to turn the offer into a practical ideal customer profile with inclusion criteria, exclusions, geography, company size signals and the roles most likely to understand the problem.",
          "Contact information is also not static. Roles change, websites change and email addresses can become invalid after a list is delivered. Verification and source notes improve usability but do not guarantee deliverability or a response. The output should make that limitation visible rather than presenting a contact file as a promise of future conversion."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Use a documented ICP and a repeatable research sequence",
        paragraphs: [
          "The sample research sequence begins with an ICP workshop or written brief. It identifies the business problem being solved, target verticals, regions, disqualifiers and the meaningful decision-maker titles. Company sources may include public business websites, professional networks, directories and maps where suitable. Each candidate is assessed against the agreed profile before time is spent on contact research.",
          "The strategy prioritises useful fields over excessive fields: company name and URL, industry, location where publicly available, contact name and role where relevant, source, status and a short note that may help personalise a respectful introduction. Data collection and outreach recommendations should be reviewed against the applicable privacy, platform and anti-spam requirements in the target market."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Deliver a clean working file with quality checks",
        paragraphs: [
          "The sample deliverable is organised for spreadsheet review or CRM import. Normalised columns, duplicate checks, source fields and status values make it easier for a sales team to filter and assign the list. Contact details are handled carefully, and entries that do not meet the agreed criteria are removed or flagged rather than silently retained to increase a count.",
          "Before handover, the file is reviewed for inconsistent company naming, missing mandatory fields, repeated records and obvious formatting errors. Any email-verification process is recorded as a data-quality step, not a guarantee of inbox placement. The client can then decide how to tailor messages, obtain legal advice when needed and run follow-up through its own approved channels."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study demonstrating B2B lead-generation research and data-organisation methodology. It does not contain real prospect data, identify a client, claim an email-verification percentage or promise replies, meetings, sales or revenue. A real scope is set by the ICP, target market, required fields, lead volume and compliance requirements."
        ]
      }
    ],
    deliverables: [
      "Ideal customer profile and exclusion criteria worksheet",
      "Company sourcing and relevance-review process",
      "Decision-maker title and public-profile research",
      "Structured company, contact, source and status fields",
      "Duplicate checks and data-normalisation pass",
      "Email-verification workflow notes where requested",
      "CRM or spreadsheet-ready delivery and outreach-preparation guidance"
    ],
    lessons: "A smaller list with a clear ICP and source notes is more useful than a large, opaque export. Research quality supports outreach; it does not guarantee a response or sale."
  },
  {
    id: 10,
    slug: "prospect-research-data-cleaning",
    url: projectUrl("prospect-research-data-cleaning"),
    cat: "lead",
    title: "Prospect Research & Data Cleaning",
    projectType: "Practice / sample case study",
    industry: "Outbound sales operations",
    market: "An illustrative data-hygiene workflow for teams operating in approved markets",
    focus: "Prospect-data auditing, de-duplication, standardisation and campaign-readiness checks",
    summary: "A sample data-cleaning process that helps sales teams understand which records are usable, incomplete, duplicated or outdated.",
    duration: "Illustrative 1-week workflow",
    image: "assets/images/work/lead-generation-database.webp",
    imageFallback: "assets/images/work/lead-generation-database.jpg",
    imageAlt: "Illustrative cleaned prospect database with standardised contact and company information",
    metaTitle: "Prospect Data Cleaning Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a prospect-data cleaning workflow covering audit, de-duplication, standardisation, verification notes and CRM-ready organisation.",
    services: [
      { label: "B2B lead generation and data cleaning", href: "/services.html#digital-marketing" },
      { label: "Email marketing and outreach preparation", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [9, 5],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Make existing prospect data understandable before it is used",
        paragraphs: [
          "This practice case study demonstrates a prospect-research and data-cleaning workflow for a sales or marketing team. It is a sample process and contains no client database, contact record, bounce figure or campaign outcome. The objective is to turn a messy spreadsheet or export into a documented working file so the team can decide what is current, duplicated, incomplete or unsuitable for the next activity.",
          "Data quality matters whether a team works from Bangladesh or supports international markets. However, fields, date formats, phone conventions, consent records and retention requirements depend on the organisation and jurisdiction. The process begins with the data owner confirming what may be processed, which records are in scope and how the cleaned output will be used."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Preserve useful context while removing confusion",
        paragraphs: [
          "A contact file can contain several versions of the same company, inconsistent job titles, outdated domains, blank fields and history notes spread across unrelated columns. Deleting records quickly may remove useful information; keeping every row creates avoidable errors in a CRM or campaign tool. The sample challenge is to define clear normalisation rules and show how a record was treated.",
          "Cleaning is not the same as making a database permanently accurate. Public business information and job roles change continuously. A good workflow uses status fields and verification dates so the owner can understand the quality of a record at the time of review, without claiming that a dataset will remain current indefinitely."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Set a data dictionary before changing the file",
        paragraphs: [
          "The sample process starts with a data audit: source tabs, row count, mandatory fields, likely duplicate keys, naming patterns, country codes and existing CRM constraints. A small data dictionary sets the preferred column names, accepted status values, company-name conventions and how unknown information should be marked. This gives the team a consistent decision rule before manual changes start.",
          "Where research or verification is requested, the workflow focuses on the fields that matter to the approved objective. A company website, public role and contact syntax might be checked; records that need additional consent review can be separated. Any enrichment is kept proportional to the brief and should not be treated as a reason to collect unnecessary personal information."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Create a controlled, import-ready record set",
        paragraphs: [
          "Implementation applies duplicate rules, normalises company and role names, separates combined fields, formats phone numbers consistently and flags records that do not meet the approved standard. The original file is retained as a reference where appropriate, while the cleaned delivery uses stable headers and status values that can be mapped to a CRM.",
          "Quality assurance samples entries from each source and checks that rows have not been accidentally shifted or merged. A change log explains the rules used and highlights unresolved areas such as missing consent, unknown role relevance or unverified data. This makes the handover useful for a future campaign without presenting a clean file as a guarantee of deliverability or conversion."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study for prospect-data audit and cleaning. It does not disclose a client list, claim a number of duplicates removed or guarantee that contacts are valid, reachable or likely to convert. A real scope depends on file size, source complexity, target market, data permissions and CRM requirements."
        ]
      }
    ],
    deliverables: [
      "Data-source and field-completeness audit",
      "Column dictionary and format-standardisation rules",
      "Duplicate-identification and merge-review process",
      "Company, role, phone and status normalisation",
      "Verification and unresolved-record flags where requested",
      "CRM-import mapping and clean-delivery file",
      "Change log and recommended maintenance routine"
    ],
    lessons: "Data cleaning is an operational foundation, not a one-time promise that every record is perfect. A clear change log helps teams maintain quality after handover."
  },
  {
    id: 11,
    slug: "social-media-design-pack",
    url: projectUrl("social-media-design-pack"),
    cat: "design",
    title: "Social Media Design Pack",
    projectType: "Practice / sample case study",
    industry: "Small-business social media marketing",
    market: "An illustrative content-design system for Bangladesh and international small businesses",
    focus: "Social media design system with reusable post and story templates for consistent brand communication",
    summary: "A sample visual-template process that gives a small business a consistent, editable foundation for social content.",
    duration: "Illustrative 2-week workflow",
    image: "assets/images/work/social-media-designs.webp",
    imageFallback: "assets/images/work/social-media-designs.jpg",
    imageAlt: "Illustrative social media post and story design templates in a coordinated visual system",
    metaTitle: "Social Media Design Pack Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a social media design-system workflow for reusable post and story templates, brand consistency, export guidance and content planning.",
    services: [
      { label: "Social media marketing and design", href: "/services.html#graphic-design" },
      { label: "Meta Ads creative planning", href: "/services.html#digital-marketing" }
    ],
    relatedProjectIds: [7, 12],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Create a repeatable visual system instead of one-off posts",
        paragraphs: [
          "This practice case study outlines a social media design pack for a small business that needs its regular posts and stories to feel coherent. It is a sample workflow, not a portfolio of a named brand or evidence of follower, reach or sales growth. The goal is a practical template system that can be reused while still leaving room for timely offers, updates and educational content.",
          "The framework can be adapted for Bangladesh and international businesses, but visual references, platform choices, language, promotional rules and accessibility requirements should be based on the real audience. The final design needs approved brand assets and a clear content purpose; a template cannot replace a strategy for what the business should say or how it should respond to customers."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Keep everyday content recognisable without making it repetitive",
        paragraphs: [
          "Small teams often have limited time for design, so posts can become inconsistent in colour, typography, image treatment and message hierarchy. The sample challenge is to create enough structure to make production easier without locking the business into identical-looking content. Templates need to work for different messages, image ratios and text lengths while remaining readable on a phone.",
          "Design should also serve a marketing purpose. A promotional post, an educational carousel and a testimonial graphic require different information hierarchy. The design system therefore begins with content types and audience actions rather than choosing colours or effects in isolation. Only genuine customer feedback or claims supplied by the business should be used in real campaign graphics."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Connect brand cues to content categories and platform use",
        paragraphs: [
          "The sample discovery process collects the logo, approved colours, type preferences, photo style, current channels and the messages the business needs to communicate. It then identifies a small set of content pillars such as offer, explanation, process, update and community. These pillars guide template types and help the business plan a balanced content calendar.",
          "The strategy sets practical rules for contrast, font size, safe areas, image cropping and calls to action. Templates are designed for their intended placements rather than stretched indiscriminately across every format. If paid promotion is planned, creative variants can be prepared for Meta Ads testing, with the advertising message reviewed separately from the organic-content schedule."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Deliver editable assets with use guidance",
        paragraphs: [
          "Implementation produces a coordinated set of post, story and announcement layouts with simple instructions for changing copy and images. The sample pack uses clear text hierarchy, enough contrast for readability and export settings that balance clarity with reasonable file size. Source-file requirements, stock-image licences and the allowed revision process would be agreed before a real project starts.",
          "A handover guide explains which template suits which message, how to maintain spacing and when not to overload a graphic with text. The business can use the assets as part of its wider social media marketing process, then review which content themes earn useful engagement. No engagement, follower or conversion result is claimed in this sample."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This practice case study demonstrates visual direction, reusable social-template design and handover guidance. It does not represent a named business, campaign reach, follower growth, advertising result or testimonial. A real design-pack scope depends on the brand assets, number of formats, content types, source-file requirements and planned approval process."
        ]
      }
    ],
    deliverables: [
      "Visual-direction notes for colour, typography and spacing",
      "Reusable Facebook and Instagram post templates",
      "Story, announcement and promotional layouts",
      "Content-pillar and message-hierarchy guidance",
      "Mobile readability and safe-area checks",
      "Export-size and file-format guidance",
      "Simple template-use and handover document"
    ],
    lessons: "The goal of a social media design pack is consistency people can actually maintain. It should make the next useful post easier to publish, not promise a growth metric."
  },
  {
    id: 12,
    slug: "youtube-thumbnail-design-set",
    url: projectUrl("youtube-thumbnail-design-set"),
    cat: "design",
    title: "YouTube Thumbnail Design Set",
    projectType: "Practice / sample case study",
    industry: "Education, creators and video marketing",
    market: "An illustrative YouTube design workflow for creators serving Bangladesh and international audiences",
    focus: "YouTube thumbnail design with mobile readability, topic clarity and recognisable series styling",
    summary: "A sample thumbnail-design system focused on communicating a video's promise clearly at small sizes and across a series.",
    duration: "Illustrative 1-week workflow",
    image: "assets/images/work/youtube-thumbnail-designs.webp",
    imageFallback: "assets/images/work/youtube-thumbnail-designs.jpg",
    imageAlt: "Illustrative YouTube thumbnail design concepts with bold readable title treatments",
    metaTitle: "YouTube Thumbnail Design Case Study | Prosengit Kundu",
    metaDescription: "Practice case study: a YouTube thumbnail-design workflow for mobile readability, video packaging, series consistency and responsible testing preparation.",
    services: [
      { label: "YouTube SEO and YouTube marketing", href: "/services.html#digital-marketing" },
      { label: "Graphic design for video content", href: "/services.html#graphic-design" }
    ],
    relatedProjectIds: [11, 5],
    sections: [
      {
        eyebrow: "PROJECT OVERVIEW",
        heading: "Package each video idea clearly at the moment of choice",
        paragraphs: [
          "This practice case study documents a YouTube thumbnail-design approach for educators, creators and brands publishing video content. It is a sample design process, not proof of a channel's click-through rate, views, watch time or subscriber growth. A thumbnail is one part of video packaging alongside the topic, title, opening, relevance and the value delivered in the video itself.",
          "The workflow can be adapted to creators in Bangladesh or international audiences, but thumbnail language, cultural references, platform guidance and topic research must fit the real channel. The goal is a truthful visual invitation that helps the right viewer understand the video, not a misleading image designed only to earn an initial click."
        ]
      },
      {
        eyebrow: "CHALLENGE",
        heading: "Make a small image understandable in a crowded feed",
        paragraphs: [
          "A thumbnail competes with many other images at a small size, particularly on mobile. Detailed screenshots, long text and weak contrast can leave the viewer unable to understand the subject quickly. The sample challenge is to reduce a video idea to one visual priority, a short readable phrase where appropriate and a composition that still works when the thumbnail is viewed at a fraction of its design size.",
          "Series consistency has a second challenge: every thumbnail should feel connected to the channel without making individual videos impossible to distinguish. The system uses recurring brand cues while allowing the topic, focal image and colour emphasis to vary. This avoids the false choice between a recognisable channel identity and a clear episode-level message."
        ]
      },
      {
        eyebrow: "RESEARCH & STRATEGY",
        heading: "Use topic intent and viewer context to guide the visual concept",
        paragraphs: [
          "Discovery would review the channel's audience, video topics, title style, existing thumbnails and the intended viewing device. YouTube keyword research can help identify how viewers phrase a topic, while competitor review shows the visual conventions already present in the results. The purpose is not to copy another creator but to understand what a viewer needs to distinguish a useful video from alternatives.",
          "The sample strategy pairs a working title with one central visual concept, supporting colour contrast and a typography rule. Early concepts are checked at reduced size before final export. When the channel has access to a suitable testing method, variants can be prepared as learning hypotheses. No test should be interpreted as a universal rule because audience, topic and timing all affect a result."
        ]
      },
      {
        eyebrow: "IMPLEMENTATION",
        heading: "Design for clarity, channel consistency and accurate export",
        paragraphs: [
          "The sample implementation creates a small design system: approved type treatments, colour use, face or product placement rules, contrast checks and export dimensions that meet the platform's current guidance. Source assets are kept organised so future thumbnails can maintain the same visual quality. Any photographs, logos or screenshots used in a real project require the appropriate permission or licence.",
          "Final checks compare each design against the published title and video promise. A thumbnail should not imply a result, person or event that the video cannot support. The design set can then accompany broader YouTube SEO work such as topic research, title and description optimisation, playlists and content planning, without claiming that design alone will produce views or channel growth."
        ]
      },
      {
        eyebrow: "DOCUMENTED STATUS",
        heading: "What this sample demonstrates",
        paragraphs: [
          "This is a practice case study demonstrating thumbnail concept development, mobile-readability checks and series design. It does not identify a client channel or report impressions, click-through rate, views, subscribers, watch time or revenue. A real project is scoped by video volume, existing brand assets, source material, turnaround needs and the channel's approved content strategy."
        ]
      }
    ],
    deliverables: [
      "Video-topic and title-context review",
      "Mobile-readability and contrast-first thumbnail concepts",
      "Series-consistency rules for typography and colour",
      "Per-video composition and focal-point planning",
      "Variant concepts for approved testing where suitable",
      "YouTube-ready export files and source-asset organisation",
      "Handover notes for future thumbnail production"
    ],
    lessons: "A thumbnail earns attention only when it accurately communicates a worthwhile video. Clarity and consistency are controllable design goals; views and click-through rates are not guarantees."
  }
];

const PROJECT_CATEGORIES = {
  web: "Web Development",
  seo: "SEO",
  lead: "Lead Generation",
  ads: "Paid Ads",
  design: "Graphic Design"
};

/* Fail fast during local development if a future edit risks a broken public URL. */
(function validateProjectRoutes() {
  const ids = new Set();
  const slugs = new Set();
  PROJECTS.forEach((project) => {
    if (!Number.isInteger(project.id) || ids.has(project.id)) {
      throw new Error("Each portfolio project needs a unique numeric id.");
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || "") || slugs.has(project.slug)) {
      throw new Error("Each portfolio project needs a unique SEO-friendly slug.");
    }
    if (project.url !== projectUrl(project.slug)) {
      throw new Error(`Portfolio route mismatch for ${project.slug}.`);
    }
    ids.add(project.id);
    slugs.add(project.slug);
  });
})();
