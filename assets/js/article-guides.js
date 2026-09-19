/* Editorial briefing data for the long-form article workbooks.
   These notes deliberately contain no client outcomes or invented statistics.
   The static generator turns each topic-specific brief into practical sections. */
const ARTICLE_GUIDES = {
  "how-to-choose-seo-service": {
    audience: "a business owner comparing SEO proposals without an in-house search specialist",
    outcome: "select a scope that matches the website's present constraint instead of buying an impressive-sounding package",
    scenario: "a service business has a technically usable site, inconsistent enquiries and several agencies recommending different monthly retainers",
    inputs: ["Search Console coverage, queries and landing-page data", "the services and locations that matter commercially", "known technical problems and previous SEO work", "the people available to approve content and development changes"],
    decisions: ["Audit before retainer|Use an audit when the size of the problem is still unclear; require a prioritized fix list rather than a tool export.", "Match scope to bottleneck|Choose technical work for crawl and performance barriers, content work for intent gaps, and local work for map visibility.", "Define ownership|Record who writes, approves, publishes, develops and reports so recommendations do not remain in a document.", "Compare evidence|Ask each provider to explain why a task matters, how it will be checked and what is outside the quoted scope."],
    measures: ["implemented high-priority fixes", "qualified organic landing-page visits", "relevant impressions and clicks", "enquiries assisted by organic search"],
    risks: ["ranking guarantees", "large deliverable lists with no priority", "reports that avoid business outcomes", "link building with no quality explanation"]
  },
  "what-is-keyword-research": {
    audience: "a website owner planning service pages and articles",
    outcome: "turn search language into a page map based on intent, relevance and realistic competition",
    scenario: "a small company has a long spreadsheet of keywords but does not know which terms deserve pages or which terms describe the same need",
    inputs: ["core services, products and customer problems", "Search Console queries and internal site-search language", "competitor and SERP observations in the target market", "sales questions, objections and location terminology"],
    decisions: ["Separate intent|Label learning, comparison, local and action-oriented searches before choosing a page format.", "Build clusters|Group close variants around one useful page instead of creating near-duplicate pages.", "Judge the SERP|Check what currently ranks, which features appear and whether the website can offer a credible result.", "Map one owner page|Assign each priority cluster to one canonical URL and use supporting pages to reinforce it."],
    measures: ["priority keywords with assigned URLs", "growth in relevant query impressions", "reduced keyword cannibalization", "organic entrances to commercial pages"],
    risks: ["choosing by volume alone", "mixing incompatible intent on one page", "copying tool estimates as facts", "forcing exact phrases into every heading"]
  },
  "serp-analysis-seo-strategy": {
    audience: "a marketer validating a keyword before creating or rewriting a page",
    outcome: "use the live results page to choose a realistic content type, angle and level of depth",
    scenario: "a planned service page targets a phrase whose current results are mostly guides, maps and comparison pages rather than service providers",
    inputs: ["a clean search from the intended country and device", "the top organic result types and domain profiles", "People Also Ask, video, image, shopping and map features", "recurring headings, missing explanations and freshness signals"],
    decisions: ["Confirm dominant intent|Decide whether searchers want to learn, compare, visit locally or take action.", "Respect content type|Do not send a product page into a results set that consistently rewards tutorials without a clear reason.", "Find a useful gap|Improve clarity, examples, local relevance or recency rather than merely increasing length.", "Assess feasibility|Balance business value against the authority and resources required to compete."],
    measures: ["validated targets retained in the plan", "pages matching dominant intent", "impressions for related query families", "engagement with the intended next step"],
    risks: ["analysing personalized results", "copying competitors section for section", "ignoring local or video features", "assuming the highest-volume term is the best target"]
  },
  "on-page-seo-checklist-small-business": {
    audience: "a small-business website owner improving existing pages",
    outcome: "make each page easier for visitors and search systems to interpret without turning the copy into a keyword list",
    scenario: "a business site has useful services but duplicate titles, vague headings, weak internal links and images with unclear alternative text",
    inputs: ["the primary purpose and search intent of each URL", "current titles, descriptions, headings and body copy", "internal links entering and leaving the page", "image, mobile, speed and conversion checks"],
    decisions: ["Clarify the title and H1|Describe the page accurately and keep one clear primary heading.", "Answer the real question|Cover the information a prospective customer needs before adding secondary phrases.", "Link with context|Use descriptive anchors where another page genuinely helps the reader continue.", "Check the whole experience|Review metadata, mobile reading, images, forms and page speed together."],
    measures: ["pages with unique metadata", "relevant query coverage", "internal links to priority pages", "organic visits that reach a contact action"],
    risks: ["repeating exact keywords", "rewriting every URL unnecessarily", "adding FAQ sections with no user value", "optimizing snippets while leaving weak content"]
  },
  "technical-seo-basics-new-websites": {
    audience: "a founder or developer preparing a new website for launch",
    outcome: "launch with crawlable, indexable and maintainable foundations",
    scenario: "a new site looks complete in a browser but has not yet been checked for canonical URLs, status codes, sitemaps or mobile performance",
    inputs: ["the final production domain and preferred URL format", "a complete route inventory and redirect list", "robots, sitemap, canonical and structured-data output", "mobile performance and form testing on production-like hosting"],
    decisions: ["Control indexation|Keep private, duplicate and utility routes out while allowing valuable pages to be crawled.", "Choose canonical URLs|Make internal links, redirects, canonicals and sitemap entries agree.", "Return honest status codes|Use real 404s and permanent redirects instead of masking missing pages.", "Measure after launch|Verify Search Console ownership, submitted URLs and real-user performance."],
    measures: ["valid indexable URLs", "sitemap discovery and index coverage", "redirect and broken-link errors", "Core Web Vitals and conversion-form health"],
    risks: ["blocking the production site", "shipping staging canonicals", "JavaScript-only essential content", "launching without a redirect map"]
  },
  "seo-friendly-website-essentials": {
    audience: "a business planning a new site or judging an existing build",
    outcome: "connect architecture, content, performance and trust into one search-friendly experience",
    scenario: "a visually polished website has thin service explanations, unclear navigation and no reliable path from an informational visit to an enquiry",
    inputs: ["audience tasks and commercial priorities", "a simple hierarchy of services, resources and contact routes", "search-intent and content requirements for each page", "performance, accessibility and mobile constraints"],
    decisions: ["Plan before styling|Define pages and their jobs before choosing components.", "Use semantic structure|Make navigation and headings understandable without relying on visual position alone.", "Publish useful substance|Give each important URL enough original information to satisfy its purpose.", "Protect speed and accessibility|Treat images, scripts, keyboard use and mobile layout as requirements."],
    measures: ["priority pages reachable through navigation", "indexable pages with distinct intent", "mobile performance and accessibility checks", "organic journeys to meaningful actions"],
    risks: ["design-first page duplication", "thin location pages", "plugin or script bloat", "hiding essential copy behind interactions"]
  },
  "improve-website-search-visibility": {
    audience: "a website owner whose organic visibility has stalled",
    outcome: "diagnose the largest constraint and improve it in a measured sequence",
    scenario: "a site publishes occasionally but has indexing uncertainty, scattered keyword targets and no record of which changes affected performance",
    inputs: ["Search Console performance and coverage", "a crawl and page inventory", "keyword-to-page mapping", "competitor, backlink and conversion context"],
    decisions: ["Establish a baseline|Record indexation, priority queries, pages and conversions before editing.", "Fix blocking issues first|Resolve access, duplication and severe performance problems before expanding content.", "Strengthen page usefulness|Align priority pages with intent and connect supporting topics internally.", "Review in cycles|Annotate releases, compare periods carefully and choose the next constraint."],
    measures: ["valid indexed priority pages", "non-brand impressions and clicks", "visibility across relevant topic clusters", "qualified organic enquiries"],
    risks: ["changing everything at once", "measuring only average position", "publishing without internal links", "buying links before fixing the site"]
  },
  "seo-vs-google-ads": {
    audience: "a business deciding how to divide a limited acquisition budget",
    outcome: "choose SEO, Google Ads or a staged combination based on timing, economics and demand",
    scenario: "a service business needs near-term enquiries but also wants to reduce long-term dependence on paid clicks",
    inputs: ["customer value, margin and acceptable acquisition cost", "search demand and auction competition", "website conversion readiness", "time available for content and technical work"],
    decisions: ["Use urgency honestly|Paid search can test demand quickly; SEO normally needs sustained improvement.", "Check unit economics|An affordable click is not useful when the landing page or offer cannot convert profitably.", "Share learning|Use ad-query and conversion data to inform organic priorities without treating ads as a ranking factor.", "Build an allocation plan|Reserve budget for measurement, landing pages and iteration, not only media or content."],
    measures: ["cost per qualified enquiry", "conversion rate by search theme", "organic share of relevant demand", "combined acquisition cost over time"],
    risks: ["expecting SEO to be instant", "running ads without tracking", "bidding on every keyword", "judging either channel by traffic alone"]
  },
  "google-ads-vs-meta-ads": {
    audience: "a business choosing between intent-led search advertising and audience-led social advertising",
    outcome: "match platform behavior to the offer instead of choosing by popularity",
    scenario: "a new service has a visual story but uncertain search demand, while an established service receives regular high-intent searches",
    inputs: ["how customers discover and describe the need", "creative assets and proof", "search volume and estimated auction costs", "tracking, landing-page and follow-up readiness"],
    decisions: ["Start with buying behavior|Google captures expressed intent; Meta can create or shape attention.", "Match the offer|Urgent known needs often suit search, while demonstrable or interest-led offers may suit social.", "Design for the platform|Search needs disciplined queries and copy; social needs strong creative and audience learning.", "Test one clear hypothesis|Keep budget concentrated enough to learn before adding channels."],
    measures: ["qualified lead cost", "search-term or audience quality", "landing-page conversion", "sales outcome by campaign source"],
    risks: ["using the same creative everywhere", "broad targeting without exclusions", "platform-reported conversions only", "splitting a small budget too widely"]
  },
  "power-of-retargeting": {
    audience: "a marketer planning follow-up advertising for previous visitors",
    outcome: "build useful, consent-aware reminder journeys instead of repeatedly showing the same ad",
    scenario: "many visitors read pricing or product pages but leave before enquiring, and the business has enough traffic to form meaningful audiences",
    inputs: ["consented audience and analytics signals", "page depth, product interest and recency", "creative suited to unresolved objections", "frequency controls, exclusions and conversion events"],
    decisions: ["Segment by intent|Treat a blog reader differently from a pricing-page or cart visitor.", "Sequence the message|Move from reminder to proof to objection handling rather than repeating one banner.", "Exclude converters|Stop acquisition ads after the desired action and use appropriate customer communication instead.", "Respect privacy|Implement platform tags and consent requirements for the markets being served."],
    measures: ["incremental qualified conversions", "frequency and audience saturation", "cost per returning converter", "assisted conversions and time lag"],
    risks: ["tiny audiences", "excessive frequency", "poor consent handling", "crediting every view-through conversion"]
  },
  "how-to-generate-b2b-leads": {
    audience: "a small B2B team building a repeatable prospecting process",
    outcome: "connect a precise ideal-customer profile with ethical research, relevant outreach and sales feedback",
    scenario: "a company has a broad target market, an inconsistent spreadsheet and outreach messages that could apply to almost any business",
    inputs: ["firmographic and problem-based ICP criteria", "decision-maker roles and buying triggers", "verifiable public data sources", "offer, outreach channel and qualification rules"],
    decisions: ["Narrow the ICP|Use industry, size, geography, trigger and disqualifier criteria.", "Research for relevance|Capture why the account fits, not only contact fields.", "Qualify before volume|Test a small sample with sales before expanding the list.", "Close the feedback loop|Return reply and opportunity quality to the research criteria."],
    measures: ["records meeting every ICP rule", "verified contact coverage", "positive reply and meeting quality", "accepted opportunities by source"],
    risks: ["scraping without quality control", "buying stale lists", "generic mass outreach", "ignoring market-specific data rules"]
  },
  "build-targeted-lead-list": {
    audience: "a sales or advertising team preparing a clean prospect dataset",
    outcome: "produce an organized list whose rows can be traced, filtered and used responsibly",
    scenario: "several sources contain duplicate companies, inconsistent job titles and contact details with no verification date",
    inputs: ["written inclusion and exclusion criteria", "required company and contact fields", "approved sources and verification method", "delivery format, ownership and suppression list"],
    decisions: ["Design the schema first|Agree fields and allowed values before collecting records.", "Separate company and person data|Keep account facts distinct from contact-level roles and details.", "Record provenance|Store source and verification date so uncertain fields can be reviewed.", "Clean before delivery|Normalize, deduplicate, validate and sample-check the finished dataset."],
    measures: ["ICP pass rate", "duplicate and missing-field rate", "verification freshness", "sales acceptance and bounce feedback"],
    risks: ["collecting unnecessary personal data", "guessing missing fields", "mixing incompatible markets", "delivering rows with no source"]
  },
  "professional-business-website-trust": {
    audience: "a service business planning a website that must reassure prospective customers",
    outcome: "make the offer, identity, process and contact path credible without exaggerated claims",
    scenario: "a visitor arrives from search, cannot quickly understand who provides the service and leaves before finding proof or a contact route",
    inputs: ["clear service definitions and audience", "authentic experience, portfolio and testimonials", "contact, privacy and business information", "mobile navigation, page speed and form behavior"],
    decisions: ["Clarify the first screen|State what is offered, for whom and what the visitor can do next.", "Use authentic proof|Preserve real projects, experience and feedback with accurate context.", "Explain the process|Reduce uncertainty around scope, communication, pricing and next steps.", "Remove friction|Make mobile reading, contact choices and form completion straightforward."],
    measures: ["visits reaching service and contact pages", "form completion health", "engagement with proof content", "qualified enquiry quality"],
    risks: ["stock claims presented as proof", "anonymous contact details", "hidden pricing context", "slow decorative media"]
  },
  "html-vs-wordpress": {
    audience: "a business choosing a technical foundation for a new website",
    outcome: "choose custom code or WordPress according to editing, functionality, maintenance and performance needs",
    scenario: "a small company wants a fast marketing site but is unsure whether staff must publish frequently or whether a developer will maintain it",
    inputs: ["required page types and interactive features", "content-editing frequency and responsible editor", "maintenance, security and hosting capacity", "performance, integration and budget constraints"],
    decisions: ["Start with operations|Choose around who will edit and maintain the site after launch.", "Avoid false absolutes|Both approaches can support SEO when implemented well.", "Count lifecycle cost|Include updates, backups, plugins and future changes rather than build price alone.", "Keep the stack proportional|Do not add a CMS when a small stable site does not need one, or remove it when editors depend on it."],
    measures: ["editor task completion", "maintenance time and update health", "mobile performance", "successful content and conversion changes"],
    risks: ["theme and plugin bloat", "custom code with no handover", "choosing by trend", "ignoring backup and security ownership"]
  },
  "responsive-web-design-seo": {
    audience: "a website owner or developer reviewing mobile usability",
    outcome: "create one coherent experience that remains readable, fast and actionable across devices",
    scenario: "a desktop layout appears polished but navigation, forms and tap targets become difficult on a small phone",
    inputs: ["real content at narrow widths", "navigation and form tasks", "responsive images, fonts and media", "performance and accessibility tests across representative devices"],
    decisions: ["Design mobile tasks first|Protect the primary action before adding wide-screen decoration.", "Let content reflow|Use flexible layouts rather than shrinking a desktop canvas.", "Serve appropriate media|Size and compress images for their rendered context.", "Test interaction|Check menus, forms, focus, keyboards, touch targets and orientation."],
    measures: ["mobile Core Web Vitals", "form completion by device", "layout-shift and overflow defects", "mobile organic engagement"],
    risks: ["hiding essential content on mobile", "device-specific duplicate pages", "oversized hero images", "testing only in a desktop emulator"]
  },
  "high-converting-landing-pages": {
    audience: "a marketer building a dedicated page for paid or campaign traffic",
    outcome: "align one audience, one promise and one primary action in a fast page",
    scenario: "an advertisement makes a specific promise but sends visitors to a general homepage with several unrelated navigation choices",
    inputs: ["campaign audience, source and message", "offer, proof and likely objections", "one primary conversion event", "tracking, privacy and follow-up process"],
    decisions: ["Maintain message match|Carry the ad's language and expectation into the first screen.", "Sequence evidence|Move from problem and offer to proof, objection handling and action.", "Ask only what is needed|Keep form fields proportional to value and qualification needs.", "Plan the response|Confirm what happens after submission and who follows up."],
    measures: ["qualified conversion rate", "form error and abandonment", "lead-to-opportunity quality", "performance by campaign message"],
    risks: ["multiple competing CTAs", "unsupported urgency", "slow third-party scripts", "optimizing form fills instead of qualified outcomes"]
  },
  "website-speed-seo": {
    audience: "a website owner investigating slow loading and weak mobile experience",
    outcome: "improve perceived and measured performance without removing useful content",
    scenario: "a page uses a large hero image, several fonts and third-party scripts before the main content becomes usable",
    inputs: ["field and lab performance data", "request waterfall and asset inventory", "image dimensions and formats", "script, font, hosting and caching behavior"],
    decisions: ["Measure the right page|Test important templates on realistic mobile conditions.", "Fix the largest bottleneck|Prioritize server delay, the main visual, blocking resources or layout instability based on evidence.", "Protect functionality|Re-test forms, analytics and accessibility after optimization.", "Monitor releases|Performance can regress whenever content, tags or plugins change."],
    measures: ["LCP, INP and CLS", "server response and transfer size", "mobile completion rates", "performance regressions after releases"],
    risks: ["chasing a score only", "lazy-loading the main image", "removing measurement blindly", "testing an empty cache once"]
  },
  "image-seo-optimization": {
    audience: "a publisher or business site managing many visual assets",
    outcome: "deliver useful images at appropriate dimensions while making their purpose understandable",
    scenario: "camera-sized files are uploaded directly, filenames are generic and alternative text repeats keywords without describing the image",
    inputs: ["the image's role and rendered dimensions", "format, quality and responsive variants", "surrounding copy and accessibility need", "licensing, captions and structured context where relevant"],
    decisions: ["Choose the asset deliberately|Use a real image when it adds information, proof or orientation.", "Resize before delivery|Do not make the browser download pixels it never displays.", "Write contextual alt text|Describe meaningful content; use empty alt for genuinely decorative images.", "Load by priority|Fetch the key visual promptly and defer below-the-fold media."],
    measures: ["image transfer size", "LCP contribution", "missing and inappropriate alt text", "image-search entrances where relevant"],
    risks: ["keyword-stuffed alt text", "format conversion without resizing", "lazy-loading every image", "using text embedded only in images"]
  },
  "small-business-digital-marketing": {
    audience: "a small-business owner starting digital marketing with limited time and budget",
    outcome: "select a small channel mix tied to a measurable customer journey",
    scenario: "a local business posts irregularly, has a basic website and considers advertising before analytics or an offer are clear",
    inputs: ["commercial goal and ideal customer", "current website, listings, content and audience", "available monthly time and budget", "one primary enquiry or sales action"],
    decisions: ["Choose one goal|Separate awareness, enquiries, repeat business and direct sales.", "Fix the destination|Make the website or profile credible before buying attention.", "Select channels by behavior|Use search, social, email or video according to how customers decide.", "Build a review rhythm|Measure a small set of outcomes and improve monthly."],
    measures: ["qualified enquiries or sales", "cost and time per acquisition", "local or organic discovery", "repeat engagement and email response"],
    risks: ["opening every channel", "boosting posts without a goal", "measuring followers only", "changing strategy before enough data exists"]
  },
  "social-media-marketing-small-business": {
    audience: "a small business planning a sustainable social media presence",
    outcome: "publish useful, recognizable content on the platforms customers actually use",
    scenario: "a business copies the same promotional graphic to every network and struggles to maintain an unrealistic daily schedule",
    inputs: ["customer platform habits and questions", "brand voice, visual assets and expertise", "content production capacity", "response, moderation and paid-distribution plan"],
    decisions: ["Choose fewer platforms|Depth and response quality usually beat inactive profiles everywhere.", "Create content pillars|Balance education, proof, process and offers.", "Adapt the format|Keep the idea consistent while respecting each platform's viewing behavior.", "Treat comments as work|Plan who answers questions and how leads move to a private channel."],
    measures: ["qualified conversations", "saves, shares and meaningful comments", "website visits from relevant posts", "content production consistency"],
    risks: ["vanity metrics", "constant direct selling", "unlicensed or inconsistent visuals", "ignoring negative feedback or response time"]
  },
  "freelance-portfolio-guide": {
    audience: "a freelancer building proof for prospective clients",
    outcome: "present relevant work, role and reasoning clearly without inventing outcomes",
    scenario: "a portfolio shows attractive screenshots but does not explain the brief, individual contribution or what was actually delivered",
    inputs: ["authentic projects, samples and their status", "the target service and client type", "role, constraints, deliverables and tools", "approved testimonials or contact routes"],
    decisions: ["Curate for the desired work|Lead with projects that support the service you want to sell.", "Label status honestly|Distinguish client work, concepts, demos and training exercises.", "Explain the decisions|Show the problem, role, approach and delivered outcome.", "Make contact easy|Give a visitor a clear next step after each relevant case study."],
    measures: ["visits from portfolio to service pages", "case-study engagement", "qualified enquiry relevance", "portfolio freshness"],
    risks: ["invented metrics", "unclear team contribution", "too many unrelated samples", "publishing confidential material"]
  },
  "international-seo-guide": {
    audience: "a business targeting searchers in more than one country",
    outcome: "build market-specific pages and technical signals only where real demand and operational support exist",
    scenario: "one English website expects to rank equally in the USA, UK, Canada and Australia despite differences in terminology, competition and offers",
    inputs: ["market demand, competition and business capacity", "country-specific vocabulary and search results", "URL, canonical and hreflang plan", "localized proof, pricing, policies and conversion routes"],
    decisions: ["Validate markets first|Do not create country sections only to repeat names.", "Localize beyond spelling|Adapt examples, offers and expectations where genuine differences exist.", "Choose a stable URL model|Keep country or language structure consistent and crawlable.", "Connect technical signals|Align hreflang, canonicals, sitemaps and internal links."],
    measures: ["country-level impressions and clicks", "correct landing pages by market", "international conversion quality", "hreflang and indexation errors"],
    risks: ["doorway country pages", "automatic translation without review", "conflicting canonicals", "claiming offices or clients that do not exist"]
  },
  "google-ads-management-guide": {
    audience: "a small business preparing or reviewing a Google Ads account",
    outcome: "connect campaign structure, search intent, landing pages and conversion data",
    scenario: "a campaign receives clicks but mixes brand, research and purchase terms while tracking every page view as a conversion",
    inputs: ["offer, geography and customer economics", "keyword themes and negative terms", "ad-to-landing-page message", "primary and secondary conversion definitions"],
    decisions: ["Structure by intent|Keep tightly related searches and messages together.", "Read search terms|Use actual queries to add negatives and discover useful language.", "Protect conversion data|Count meaningful actions accurately and keep client account ownership.", "Optimize after evidence|Adjust bids, ads and pages from sufficient, relevant data."],
    measures: ["qualified conversion cost", "search-term relevance", "conversion rate by campaign", "lead or sales quality after the platform event"],
    risks: ["broad matching without control", "default location settings", "counting weak actions as leads", "changing several variables daily"]
  },
  "meta-ads-guide": {
    audience: "a business planning Facebook and Instagram campaigns",
    outcome: "combine audience learning, creative testing and reliable follow-up",
    scenario: "a campaign uses one sales graphic for cold and warm audiences and judges success only by cheap form submissions",
    inputs: ["offer and customer awareness level", "creative angles and formats", "audience, placement and exclusion plan", "pixel or server-side events and lead follow-up"],
    decisions: ["Separate audience temperature|Introduce the offer differently to cold prospects, engaged visitors and customers.", "Test ideas, not decoration|Vary the hook, proof or offer while keeping comparisons readable.", "Choose the right destination|Use website or lead forms according to qualification and tracking needs.", "Review downstream quality|Connect platform leads to replies, appointments or sales feedback."],
    measures: ["qualified lead cost", "creative hold and click quality", "frequency and audience fatigue", "lead-to-opportunity outcome"],
    risks: ["micro-targeting tiny audiences", "creative fatigue", "instant forms with no qualification", "trusting attribution without business records"]
  },
  "local-seo-google-business-profile": {
    audience: "a local service business that wants more visibility in maps and nearby search",
    outcome: "make business information, service relevance and local trust consistent across the website and Google Business Profile",
    scenario: "a business has an incomplete profile, mixed address details and one generic service page for several distinct local needs",
    inputs: ["accurate name, address or service area, phone and hours", "primary and secondary services", "local keyword and competitor observations", "photos, review process and website landing pages"],
    decisions: ["Complete the profile accurately|Choose categories, services, hours and areas that reflect the real business.", "Strengthen the website|Create useful service information and clear local contact context.", "Keep citations consistent|Correct important directory details instead of chasing hundreds of listings.", "Earn and answer reviews|Request authentic feedback and respond professionally without incentives that violate policy."],
    measures: ["relevant map and local query visibility", "calls, directions and website actions", "profile completeness and accuracy", "review pace and response coverage"],
    risks: ["keyword-stuffing the business name", "fake locations", "duplicate profiles", "copying the same city paragraph repeatedly"]
  },
  "wordpress-seo-optimization": {
    audience: "a WordPress website owner balancing editing flexibility with speed, security and search quality",
    outcome: "keep the CMS useful while controlling plugins, templates and technical output",
    scenario: "a site has overlapping SEO plugins, oversized media and a theme that creates duplicate archives and unused scripts",
    inputs: ["theme, plugin and hosting inventory", "template and indexable URL review", "backup, update and security ownership", "performance, metadata and schema output"],
    decisions: ["Reduce overlap|Keep one responsible tool for each function where possible.", "Control templates|Give posts, pages, archives and taxonomies distinct purposes or exclude unhelpful duplicates.", "Optimize the media workflow|Resize and compress before upload and clean legacy assets carefully.", "Maintain routinely|Schedule backups, updates, security checks and performance reviews."],
    measures: ["indexable URL quality", "plugin and update health", "Core Web Vitals", "metadata and structured-data errors"],
    risks: ["installing several optimization plugins", "editing production without backup", "indexing thin archives", "assuming a plugin replaces strategy"]
  },
  "youtube-seo-marketing": {
    audience: "a creator or business using YouTube for searchable, evergreen video",
    outcome: "connect topic demand, clear packaging, viewer satisfaction and a relevant next step",
    scenario: "a channel publishes useful videos but uses vague titles, busy thumbnails and long introductions before answering the question",
    inputs: ["audience questions and YouTube suggestions", "competitor topic and packaging observations", "script, thumbnail and production capacity", "retention, traffic source and conversion data"],
    decisions: ["Choose a specific promise|Build each video around one viewer problem and outcome.", "Package honestly|Use a clear title and readable thumbnail that the video immediately fulfills.", "Design for retention|Open with relevance, structure the explanation and remove avoidable delay.", "Create a next view|Use playlists, end screens and links to guide an appropriate continuation."],
    measures: ["search and suggested impressions", "click-through in context", "retention and average view duration", "viewers reaching the intended next action"],
    risks: ["keyword-stuffed titles", "misleading thumbnails", "random topic selection", "measuring subscribers without business or audience goals"]
  },
  "b2b-lead-generation-international-markets": {
    audience: "a B2B company researching prospects across several countries",
    outcome: "build market-aware, verifiable prospect data that supports compliant outreach",
    scenario: "a global list combines several countries without recording source, market terminology, lawful-use context or local role differences",
    inputs: ["country-level ICP and exclusions", "local company and job-title terminology", "approved sources, verification date and suppression data", "market-specific outreach and legal review"],
    decisions: ["Research each market separately|Do not assume one title, database or criterion transfers cleanly.", "Store provenance|Keep source, date and confidence with each important field.", "Localize qualification|Adapt size, industry and trigger signals to the target economy.", "Prepare responsible handoff|Document opt-out, suppression and usage expectations for the outreach team."],
    measures: ["market-specific ICP pass rate", "verified contact coverage", "bounce and positive-reply quality", "sales acceptance by country"],
    risks: ["mixing regulatory assumptions", "translating titles literally", "purchasing opaque lists", "claiming consent that was not recorded"]
  }
};
