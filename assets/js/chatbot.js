/* ===========================================================================
   Prosengit Kundu — website assistant
   ---------------------------------------------------------------------------
   Maintainable knowledge structure:
   - BUSINESS, PAGES and PRICE_GROUPS hold verified site facts and links.
   - SERVICES describes scope, process and useful next steps by service.
   - /assets/data/portfolio-index.json is generated from projects.js, so new
     practice case studies become available to the assistant after running
     `node scripts/generate-static-pages.js`.

   The assistant is intentionally factual: it does not claim client names,
   testimonials, rankings, campaign results, lead totals or guarantees.
   =========================================================================== */
(function () {
  'use strict';
  if (window.PkChatbot) return;

  var BUSINESS = {
    name: 'Prosengit Kundu',
    role: 'Digital Marketing Expert, SEO Specialist, Freelancer, Professional Trainer and Web Developer',
    location: 'Khulna, Bangladesh',
    email: 'Prosengit95@gmail.com',
    phone: '+880 1701-059499',
    whatsapp: 'https://wa.me/8801701059499',
    avatar: '/assets/images/prosengit-kundu-professional-128.webp',
    targetMarkets: 'Bangladesh, the USA, UK, Canada, Australia and remote international markets'
  };

  var PAGES = {
    home: '/index.html',
    about: '/about.html',
    services: '/services.html',
    marketingServices: '/services.html#digital-marketing',
    webServices: '/services.html#website-services',
    designServices: '/services.html#graphic-design',
    pricing: '/pricing.html',
    portfolio: '/portfolio.html',
    feedback: '/testimonials.html',
    blog: '/blog.html',
    faq: '/faq.html',
    contact: '/contact.html',
    appointment: '/contact.html?plan=Free%20Consultation',
    youtubeGuide: '/blog/youtube-seo-marketing.html',
    seoGuide: '/blog/how-to-choose-seo-service.html',
    localSeoGuide: '/blog/local-seo-google-business-profile.html',
    keywordGuide: '/blog/what-is-keyword-research.html',
    adsGuide: '/blog/google-ads-management-guide.html'
  };

  /* Keep this section aligned with pricing.html. It contains only prices that
     are published on the site; custom-quote services deliberately have no
     invented number. */
  var PRICE_GROUPS = {
    seo: {
      title: 'SEO pricing published on the website',
      lines: [
        'SEO Audit: ৳2,000–3,000 / $25–35',
        'Keyword Research: ৳2,500–4,000 / $30–45',
        'On-Page SEO: ৳5,000–8,000 / $60–90',
        'Technical SEO: ৳7,000–12,000 / $80–130',
        'Local SEO: ৳6,000–10,000 / $70–110',
        'Full SEO, monthly: ৳15,000–25,000 / $180–300 per month'
      ]
    },
    ads: {
      title: 'Paid-advertising pricing published on the website',
      lines: [
        'Google Ads setup: ৳5,000–7,000 / $60–80',
        'Google Ads management: ৳8,000–15,000 / $100–170 per month',
        'Meta Ads setup: ৳4,000–6,000 / $50–70',
        'Meta Ads management: ৳7,000–12,000 / $90–140 per month',
        'YouTube Ads: ৳6,000–10,000 / $70–110'
      ]
    },
    website: {
      title: 'Website pricing published on the website',
      lines: [
        'Landing page: ৳10,000–15,000 / $120–170',
        'HTML/CSS website: ৳20,000–35,000 / $250–400',
        'HTML/CSS/JavaScript website: ৳30,000–50,000 / $350–550',
        'Premium custom website: ৳45,000–70,000+ / $500–800+',
        'WordPress website: ৳15,000–25,000 / $180–280',
        'WordPress customization: ৳7,000–12,000 / $80–130'
      ]
    },
    lead: {
      title: 'Lead-generation pricing published on the website',
      lines: [
        'B2B lead generation: ৳6,000–10,000 / $70–110',
        'B2C lead generation: ৳6,000–10,000 / $70–110',
        'Targeted lead list: ৳4,000–7,000 / $50–80',
        'Prospect research: ৳3,500–6,000 / $40–70'
      ]
    },
    social: {
      title: 'Social-media pricing published on the website',
      lines: [
        'Social media strategy: ৳4,000–7,000 / $50–80',
        'Social media management: ৳8,000–15,000 / $100–170 per month',
        'Social-media design: ৳700–1,500 per design / $8–18'
      ]
    },
    design: {
      title: 'Graphic-design pricing published on the website',
      lines: [
        'YouTube thumbnail: ৳700–1,200 / $8–15',
        'Social-media design: ৳700–1,500 per design / $8–18',
        'Banner / promotional design: ৳1,500–3,000 / $20–35'
      ]
    },
    training: {
      title: 'Consultation and training pricing published on the website',
      lines: [
        'Digital marketing consultation: ৳1,500–2,500 per hour / $20–30 per hour',
        'Digital marketing training: ৳2,500–4,000 per session / $30–50 per session'
      ]
    },
    youtubeSeo: {
      title: 'YouTube SEO pricing published on the services page',
      lines: [
        'YouTube SEO: from $50',
        'The main pricing table separately lists YouTube Ads at ৳6,000–10,000 / $70–110.'
      ]
    },
    custom: {
      title: 'Custom-quote services',
      lines: [
        'Google Sites websites, email marketing support and marketplace research are scoped individually.',
        'The website does not publish a fixed price for these services.'
      ]
    }
  };

  var SERVICES = [
    {
      id: 'seo',
      terms: ['seo', 'search engine optimization', 'seo audit', 'on page seo', 'on-page seo', 'technical seo', 'off page seo', 'off-page seo', 'local seo', 'google business profile', 'google business', 'gbp', 'website visibility', 'image seo', 'international seo'],
      title: 'SEO & Website Optimization',
      who: 'Businesses that need a clearer search foundation, stronger service pages or an informed plan for improving visibility.',
      includes: ['SEO audit and priority roadmap', 'keyword research and SERP analysis', 'on-page SEO: titles, headings, content and internal links', 'technical SEO: crawlability, indexation, canonicals, speed and structured-data checks', 'local SEO and Google Business Profile planning where the business is eligible', 'image SEO with descriptive filenames, alt text and appropriate loading'],
      process: 'The work starts with your business goals, website and target market. I review the current position, prioritise the issues or opportunities, complete the agreed work, then explain the next steps in plain language.',
      deliverable: 'Depending on scope, you receive an audit, keyword map, page recommendations, implementation work and/or a documented action plan. Rankings are not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.seoGuide,
      caseCategory: 'seo'
    },
    {
      id: 'keyword',
      terms: ['keyword research', 'keywords', 'keyword', 'serp analysis', 'content mapping', 'content map'],
      title: 'Keyword Research & Content Mapping',
      who: 'Businesses planning a new website, service pages, SEO content or a focused Google Ads structure.',
      includes: ['seed-topic expansion from services and customer questions', 'search-intent and SERP review', 'topic clustering and page assignment', 'content priorities and internal-linking opportunities', 'cannibalisation checks for overlapping pages'],
      process: 'I begin with the offer, target customers, current pages and approved markets, then turn the research into page and content decisions instead of an unfiltered keyword export.',
      deliverable: 'A prioritised keyword and content map that can guide writing, on-page SEO or paid-search planning. Search demand and rankings are not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.keywordGuide,
      caseCategory: 'seo'
    },
    {
      id: 'meta',
      terms: ['meta ads', 'facebook ads', 'instagram ads', 'facebook advertising', 'instagram advertising', 'meta campaign', 'meta pixel', 'audience targeting', 'retargeting'],
      title: 'Meta Ads / Facebook & Instagram Ads',
      who: 'Businesses with a clear offer that want to test paid social with defined audiences, creative and lead handling.',
      includes: ['campaign and audience research', 'Facebook and Instagram campaign structure', 'creative-angle and testing plan', 'lead-form qualification or landing-page review', 'Meta Pixel and conversion-event planning', 'retargeting, monitoring and reporting workflow'],
      process: 'We clarify the offer, audience, target market, assets and follow-up process first. Campaigns are then structured in the client-owned account, checked before launch and improved from real delivery and lead-quality feedback.',
      deliverable: 'A documented campaign setup or management plan with account ownership and advertising spend kept with the client. Advertising performance is not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.adsGuide,
      caseCategory: 'ads'
    },
    {
      id: 'googleads',
      terms: ['google ads', 'google ad', 'google search ads', 'search campaign', 'ppc', 'adwords', 'conversion tracking', 'negative keywords'],
      title: 'Google Ads',
      who: 'Service businesses and brands that want to reach people actively searching for a relevant offer.',
      includes: ['commercial keyword research', 'keyword-to-ad-group structure', 'negative-keyword planning', 'responsive search-ad and extension planning', 'landing-page and conversion-tracking checks', 'budget pacing, monitoring and optimisation routine'],
      process: 'The account is planned around real services, the approved market and the action that counts as a conversion. The client keeps ownership of the Google Ads account and pays Google directly for ad spend.',
      deliverable: 'A transparent Search, Display or campaign-management scope with structured reporting and next tests. Position, cost per lead and sales are not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.adsGuide,
      caseCategory: 'ads'
    },
    {
      id: 'youtube',
      terms: ['youtube ads', 'youtube seo', 'youtube marketing', 'youtube channel', 'video seo', 'youtube keyword', 'youtube thumbnails', 'youtube thumbnail'],
      title: 'YouTube SEO, YouTube Marketing & YouTube Ads',
      who: 'Creators, educators and businesses using video to help people discover an offer, answer questions or build an audience.',
      includes: ['video and YouTube keyword research', 'title, description, playlist and channel optimisation', 'thumbnail and video-packaging guidance', 'content-topic planning', 'YouTube Ads planning where paid video promotion fits the goal'],
      process: 'The process starts with the channel purpose, intended audience, existing videos and topic opportunities. Recommendations are then prioritised so the owner can improve discoverability and viewer clarity over time.',
      deliverable: 'A channel or video optimisation plan, agreed metadata work, content ideas or paid-video campaign scope. Views, subscribers and advertising results are not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.youtubeGuide,
      caseCategory: 'design'
    },
    {
      id: 'social',
      terms: ['social media', 'social media marketing', 'social media management', 'social strategy', 'facebook page', 'instagram content', 'social posts'],
      title: 'Social Media Marketing',
      who: 'Small businesses and brands that need a clearer, consistent social presence tied to useful customer communication.',
      includes: ['content-pillar and audience planning', 'social-media strategy and posting direction', 'post, story and promotional design support', 'Meta Ads creative coordination where relevant', 'basic review of engagement and content themes'],
      process: 'We identify the platforms your customers actually use, the messages that matter and the materials you can maintain. The work then focuses on a practical publishing rhythm rather than posting for its own sake.',
      deliverable: 'A social-media plan, content direction, designed assets or management scope as agreed. Follower growth, reach and sales are not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.blog,
      caseCategory: 'design'
    },
    {
      id: 'web',
      terms: ['website', 'web development', 'web developer', 'html', 'css', 'javascript website', 'business website', 'landing page', 'portfolio website', 'responsive website', 'website redesign', 'website maintenance', 'woocommerce', 'ecommerce', 'e-commerce'],
      title: 'Custom HTML/CSS Website Development',
      who: 'Businesses, professionals and campaigns that need a fast, responsive website, landing page, portfolio or a review of an existing site.',
      includes: ['custom HTML, CSS and JavaScript development', 'responsive layouts for phones, tablets and desktop', 'business sites, landing pages, portfolios and blog structures', 'SEO-friendly headings, metadata, internal links and image handling', 'contact, quote or appointment paths', 'speed and technical-foundation checks'],
      process: 'I review your pages, content, audience, design needs and functionality first. The build is planned with page intent and mobile use in mind, then tested before handover.',
      deliverable: 'A documented website or landing-page scope with agreed pages, assets, integrations and testing. Timelines and final price depend on complexity; performance and search results are not guaranteed.',
      page: PAGES.webServices,
      guide: PAGES.blog,
      caseCategory: 'web'
    },
    {
      id: 'wordpress',
      terms: ['wordpress', 'elementor', 'woocommerce', 'wordpress local seo', 'wordpress website', 'wordpress maintenance'],
      title: 'WordPress Website & Local SEO Support',
      who: 'Businesses that prefer a content-management system and need help with a WordPress website, approved theme or local-search foundations.',
      includes: ['WordPress website builds and customisation', 'Elementor work where it fits the approved site', 'responsive-layout and content improvements', 'on-page SEO and local SEO recommendations', 'website-speed and technical review'],
      process: 'I first check whether WordPress is the right fit for the publishing workflow and existing website. The scope then identifies the pages, editing access, plugins or theme constraints, local-service information and handover needs.',
      deliverable: 'An agreed WordPress build, customisation or optimisation plan. Plugin compatibility, rankings and local visibility are not guaranteed.',
      page: PAGES.webServices,
      guide: '/blog/html-vs-wordpress.html',
      caseCategory: 'web'
    },
    {
      id: 'googlesites',
      terms: ['google sites', 'google site'],
      title: 'Google Sites Development',
      who: 'People and small organisations who need a simple information, portfolio or project website on Google Sites.',
      includes: ['page structure and content organisation', 'responsive Google Sites setup', 'navigation, contact routes and approved embeds', 'basic on-page SEO guidance within the platform'],
      process: 'We review whether Google Sites suits the required design, functionality and publishing needs, then agree the page structure and available content before building.',
      deliverable: 'A scoped Google Sites website or improvement plan. The website currently lists this as a custom-quote service.',
      page: PAGES.webServices,
      guide: PAGES.contact,
      caseCategory: 'web'
    },
    {
      id: 'lead',
      terms: ['b2b lead generation', 'lead generation', 'lead list', 'leads', 'prospect research', 'prospects', 'decision makers', 'decision maker', 'business leads', 'company research', 'lead data', 'data cleaning', 'verified leads'],
      title: 'B2B Lead Generation & Prospect Research',
      who: 'B2B teams, agencies and service businesses that need a defined prospecting list for a compliant outreach process.',
      includes: ['ideal customer profile and exclusion criteria', 'company and decision-maker research', 'organised company, role, source and status fields', 'data cleaning, normalisation and duplicate checks', 'email-verification workflow notes where requested', 'CRM or spreadsheet-ready handover'],
      process: 'The work begins with your ideal customer profile, target market, required fields and permitted data use. Research is then checked against the brief and delivered in a documented format for your team to review.',
      deliverable: 'A scoped prospect research or data-cleaning deliverable. Data quality work does not guarantee inbox delivery, replies, meetings or sales.',
      page: PAGES.marketingServices,
      guide: '/blog/how-to-generate-b2b-leads.html',
      caseCategory: 'lead'
    },
    {
      id: 'email',
      terms: ['email marketing', 'cold email', 'outreach email', 'email campaign', 'email campaigns'],
      title: 'Email Marketing Support',
      who: 'Businesses that have a legitimate audience or approved prospecting workflow and need help preparing an email campaign.',
      includes: ['audience and message review', 'outreach preparation and lead-list organisation', 'campaign and follow-up planning', 'basic data-cleaning and process guidance'],
      process: 'The scope starts with the audience, purpose, data permissions, sending setup and market requirements. I recommend a practical process that the business can approve and operate responsibly.',
      deliverable: 'A custom-quoted email marketing or outreach-support scope. Deliverability, replies and sales are not guaranteed.',
      page: PAGES.marketingServices,
      guide: PAGES.contact,
      caseCategory: 'lead'
    },
    {
      id: 'design',
      terms: ['graphic design', 'social media design', 'youtube thumbnail', 'thumbnail design', 'banner design', 'promotional design', 'social post design'],
      title: 'Graphic Design Support',
      who: 'Businesses and creators who need clear, on-brand visual assets for social posts, promotions or YouTube videos.',
      includes: ['brief and format review', 'social-media, banner or promotional design', 'YouTube thumbnail design with mobile readability in mind', 'organised delivery in the agreed format'],
      process: 'We confirm the purpose, audience, channel, size, brand assets and message first. Designs are then prepared around the agreed brief and review process.',
      deliverable: 'A scoped set of design files or templates. Click-through rate, reach, engagement and sales are not guaranteed.',
      page: PAGES.designServices,
      guide: PAGES.portfolio,
      caseCategory: 'design'
    },
    {
      id: 'training',
      terms: ['digital marketing training', 'marketing training', 'seo training', 'training course', 'training session', 'consultation', 'consulting'],
      title: 'Digital Marketing Consultation & Training',
      who: 'Individuals, teams and institutions that want a focused discussion or a practical training session on relevant digital-marketing topics.',
      includes: ['goal and current-situation discussion', 'topic-specific guidance or session planning', 'practical exercises or materials as agreed', 'clear follow-up actions'],
      process: 'The topic, participant level, format, timing and outcomes are confirmed before the session. Training is tailored to the agreed subject rather than presented as a guaranteed career or business result.',
      deliverable: 'A booked consultation or agreed training session with the relevant notes or materials. Employment, freelance income and business outcomes are not guaranteed.',
      page: PAGES.pricing,
      guide: PAGES.contact,
      caseCategory: null
    },
    {
      id: 'marketplace',
      terms: ['marketplace research', 'market research', 'niche research', 'product research', 'competitor research', 'competitor analysis'],
      title: 'Marketplace Research',
      who: 'Businesses and sellers deciding which niche, product, audience or competitor opportunity deserves further investigation.',
      includes: ['market, niche and product research', 'competitor and offer observation', 'customer-question and search-intent review', 'organised findings and practical next-step recommendations'],
      process: 'I start with the product or service, the market under consideration and the decision you need to make. The research approach is then sized to the available data and scope.',
      deliverable: 'A custom-quoted research brief or findings document. Research informs a decision; it does not guarantee demand, sales or marketplace approval.',
      page: PAGES.marketingServices,
      guide: PAGES.contact,
      caseCategory: null
    }
  ];

  var portfolioItems = Array.isArray(window.PK_PORTFOLIO_INDEX) ? window.PK_PORTFOLIO_INDEX : [];
  function loadPortfolioIndex() {
    if (portfolioItems.length || !window.fetch) return;
    window.fetch('/assets/data/portfolio-index.json', { credentials: 'same-origin' })
      .then(function (response) { return response.ok ? response.json() : []; })
      .then(function (items) { if (Array.isArray(items)) portfolioItems = items; })
      .catch(function () { /* Portfolio page remains the safe fallback. */ });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function includesAny(text, terms) {
    var paddedText = ' ' + text + ' ';
    return terms.some(function (term) {
      var normalizedTerm = normalize(term);
      return normalizedTerm && paddedText.indexOf(' ' + normalizedTerm + ' ') !== -1;
    });
  }

  function isBuyingIntent(text) {
    return includesAny(text, ['i need', 'i want', 'looking for', 'hire', 'quote', 'my business', 'my website', 'my campaign', 'my project', 'get started', 'start a project']);
  }

  function uniqueLinks(links) {
    var seen = {};
    return links.filter(function (link) {
      if (!link || !link.href || seen[link.href]) return false;
      seen[link.href] = true;
      return true;
    });
  }

  function response(text, list, links, chips) {
    return { text: text, list: list || [], links: uniqueLinks(links || []), chips: chips || [] };
  }

  function serviceLinks(service) {
    var links = [
      { label: 'Explore ' + service.title, href: service.page },
      { label: 'View pricing', href: PAGES.pricing },
      { label: 'Discuss your project', href: PAGES.contact }
    ];
    if (service.guide && service.guide !== PAGES.contact && service.guide !== PAGES.blog) links.splice(1, 0, { label: 'Read the related guide', href: service.guide });
    return links;
  }

  function findService(text) {
    /* More specific terms should win when a query includes website + WordPress,
       Google Ads + YouTube or keyword research + SEO. */
    var matches = SERVICES.map(function (service, index) {
      var score = service.terms.reduce(function (total, term) {
        var normalizedTerm = normalize(term);
        return total + (includesAny(text, [term]) ? normalizedTerm.split(' ').length : 0);
      }, 0);
      return { service: service, score: score, index: index };
    }).filter(function (match) { return match.score > 0; });
    matches.sort(function (a, b) { return b.score - a.score || b.index - a.index; });
    return matches.length ? matches[0].service : null;
  }

  function renderService(service, buying) {
    var list = [
      'Who it is for: ' + service.who,
      'What is included: ' + service.includes.join('; ') + '.',
      'How it works: ' + service.process,
      'Expected deliverables: ' + service.deliverable
    ];
    if (buying) {
      list.push('To recommend a useful scope, please share your goal, target market, current website or channel, preferred timeline and any existing assets or access.');
    }
    return response(service.title + ' can be tailored to the project rather than sold as a generic promise.', list, serviceLinks(service), ['View portfolio', 'Pricing', 'Book a consultation']);
  }

  function selectPriceGroup(text, service) {
    if (service) {
      if (service.id === 'seo' || service.id === 'keyword') return PRICE_GROUPS.seo;
      if (service.id === 'meta' || service.id === 'googleads') return PRICE_GROUPS.ads;
      if (service.id === 'social') return PRICE_GROUPS.social;
      if (service.id === 'design') return PRICE_GROUPS.design;
      if (service.id === 'training') return PRICE_GROUPS.training;
      if (service.id === 'youtube') return includesAny(text, ['youtube seo']) ? PRICE_GROUPS.youtubeSeo : PRICE_GROUPS.ads;
      if (service.id === 'web' || service.id === 'wordpress') return PRICE_GROUPS.website;
      if (service.id === 'lead') return PRICE_GROUPS.lead;
      if (service.id === 'googlesites' || service.id === 'email' || service.id === 'marketplace') return PRICE_GROUPS.custom;
    }
    if (includesAny(text, ['email marketing', 'marketplace research', 'google sites'])) return PRICE_GROUPS.custom;
    return null;
  }

  function pricingReply(text) {
    var service = findService(text);
    var group = selectPriceGroup(text, service);
    if (!group) {
      return response(
        'The website lists starting ranges for SEO, websites, Google and Meta Ads, lead generation, social media, graphic design, consultation and training. Google Sites, email marketing support and marketplace research are custom-quoted.',
        ['Final pricing can vary with the number of pages, website complexity, campaign complexity, target market, advertising requirements, number of keywords, required deliverables and lead volume.', 'Bangladesh projects are quoted in BDT and international projects in USD.'],
        [{ label: 'View the full price list', href: PAGES.pricing }, { label: 'Request a custom quotation', href: PAGES.contact }],
        ['SEO pricing', 'Website pricing', 'Book a consultation']
      );
    }
    var isCustomQuote = group === PRICE_GROUPS.custom;
    var advertisingNote = (group === PRICE_GROUPS.ads || group === PRICE_GROUPS.youtubeSeo)
      ? 'Advertising spend is separate from management fees and is paid directly to the platform.'
      : 'For a tailored quotation, share the scope, market, timing and required deliverables.';
    var pricingLinks = group === PRICE_GROUPS.youtubeSeo
      ? [{ label: 'View YouTube SEO service', href: PAGES.marketingServices }, { label: 'View full pricing', href: PAGES.pricing }, { label: 'Request a custom quotation', href: PAGES.contact }]
      : [{ label: 'View full pricing', href: PAGES.pricing }, { label: 'Request a custom quotation', href: PAGES.contact }];
    return response(
      group.title + (isCustomQuote
        ? '. This service needs a tailored quotation; no fixed rate is published.'
        : '. These are published starting ranges; the final written quote depends on scope.'),
      group.lines.concat([advertisingNote]),
      pricingLinks,
      ['View portfolio', 'Services', 'Book a consultation']
    );
  }

  function portfolioReply(text) {
    var service = findService(text);
    var category = service && service.caseCategory;
    var titleTerms = portfolioItems.filter(function (item) {
      return normalize(item.title).split(' ').filter(function (word) { return word.length > 4; }).some(function (word) { return text.indexOf(word) !== -1; });
    });
    var items = titleTerms.length ? titleTerms : portfolioItems.filter(function (item) { return !category || item.category === category; });
    items = items.slice(0, 3);

    if (!items.length) {
      return response(
        'The portfolio contains practice case studies for web development, SEO, paid ads, lead generation and design. Each explains the method and deliverables without claiming client results.',
        ['Open the portfolio to browse every case study by category.'],
        [{ label: 'Browse practice case studies', href: PAGES.portfolio }, { label: 'Discuss a similar project', href: PAGES.contact }],
        ['SEO projects', 'Website projects', 'Book a consultation']
      );
    }

    var links = items.map(function (item) { return { label: item.title, href: item.url }; });
    links.push({ label: 'Browse all practice case studies', href: PAGES.portfolio });
    return response(
      'Here are the most relevant practice case studies. They document strategy, implementation and likely deliverables; they do not claim client names, rankings, leads, revenue or advertising results.',
      items.map(function (item) { return item.title + ': ' + item.summary; }),
      links,
      ['Services', 'Pricing', 'Book a consultation']
    );
  }

  function seoEducationReply(text) {
    var topics = [
      {
        terms: ['what is seo', 'how does seo help', 'improve website visibility', 'optimize my existing website', 'can you audit my website'],
        text: 'SEO is the work of making a website easier for the right people and search engines to understand. It can improve the relevance, technical health and usefulness of key pages over time, but it cannot honestly guarantee a Google position.',
        list: ['A practical SEO process combines research, on-page improvements, technical checks, content priorities and internal linking.', 'The right first step is often an audit of your current website, target market and priority services.']
      },
      {
        terms: ['what is keyword research', 'keyword research'],
        text: 'Keyword research identifies the words and questions people use when looking for a service, product or answer. Good research also checks intent, search results and whether the business has a page that can genuinely help that visitor.',
        list: ['It informs service pages, guides, internal links and Google Ads structure.', 'A useful output is a prioritised page map, not just a large exported list.']
      },
      {
        terms: ['what is on page seo', 'on page seo'],
        text: 'On-page SEO improves the elements on a page itself: its topic focus, title, meta description, headings, helpful copy, images and internal links.',
        list: ['It aims to make a page more useful and easier to interpret.', 'It does not mean repeating a keyword unnaturally.']
      },
      {
        terms: ['what is technical seo', 'technical seo'],
        text: 'Technical SEO checks whether search engines can crawl, render, understand and index important pages. It can include redirects, status codes, robots directives, sitemaps, canonical URLs, page speed and structured data.',
        list: ['Technical fixes should be prioritised by impact and verified after implementation.', 'A clean technical setup supports content and marketing; it does not guarantee rankings by itself.']
      },
      {
        terms: ['what is off page seo', 'off page seo'],
        text: 'Off-page SEO refers to signals beyond the website, such as relevant mentions and links earned through useful content, relationships and legitimate promotion.',
        list: ['It should avoid purchased or manipulative link schemes.', 'The first priority is usually a technically sound, useful website that deserves to be referenced.']
      },
      {
        terms: ['what is local seo', 'google business profile', 'local seo'],
        text: 'Local SEO helps an eligible local business present accurate service, location and contact information across its website and Google Business Profile so nearby customers can find relevant information.',
        list: ['It can include service-area research, profile completeness, on-page local context and business-information consistency.', 'It should not use fake reviews, false locations or keyword-stuffed business names.']
      },
      {
        terms: ['how long does seo take', 'how long seo', 'seo timeline'],
        text: 'SEO timing depends on the website condition, competition, content, market and the changes required. Technical fixes can be implemented quickly, while search engines and content improvements need time to be crawled, evaluated and compared with alternatives.',
        list: ['A realistic plan uses milestones and reporting instead of a promised ranking date.', 'The first step is to review the site and goals, then prioritise the work.']
      },
      {
        terms: ['image seo', 'optimize images for seo'],
        text: 'Image SEO means using images that support the page, then giving them descriptive filenames, accurate alt text, appropriate dimensions, compression and sensible loading behaviour.',
        list: ['Alt text should describe the image for people who cannot see it; it is not a place to repeat keyword lists.', 'Large, off-screen images can be lazy-loaded while important lead images receive suitable priority.']
      }
    ];
    var match = topics.find(function (topic) { return includesAny(text, topic.terms); });
    if (!match) return null;
    return response(match.text, match.list, [{ label: 'Explore SEO services', href: PAGES.marketingServices }, { label: 'Read the SEO guide', href: PAGES.seoGuide }, { label: 'Request an SEO review', href: PAGES.contact }], ['Keyword research', 'Local SEO', 'View portfolio']);
  }

  function adsEducationReply(text) {
    if (!includesAny(text, ['what are meta ads', 'what is google ads', 'what are google ads', 'what are youtube ads', 'audience targeting', 'optimize existing campaigns', 'conversion tracking'])) return null;
    return response(
      'Meta Ads uses Facebook and Instagram placements; Google Ads can reach people through Search and other Google inventory; YouTube Ads uses video placements. The right platform depends on whether the audience is actively searching, discovering an offer while browsing, or engaging with video.',
      ['Campaign work can include audience or keyword research, account structure, ad assets, landing-page review, conversion tracking and ongoing optimisation.', 'A responsible setup keeps the account and ad spend under the client’s ownership.', 'No platform can honestly guarantee a cost per lead, return on ad spend, sale or campaign result before testing.'],
      [{ label: 'Explore paid advertising services', href: PAGES.marketingServices }, { label: 'Read the Google Ads guide', href: PAGES.adsGuide }, { label: 'Discuss a campaign', href: PAGES.contact }],
      ['Meta Ads', 'Google Ads', 'YouTube marketing']
    );
  }

  function aboutReply(text) {
    if (includesAny(text, ['which countries', 'target countries', 'countries do you target', 'international clients', 'work internationally'])) {
      return response(
        BUSINESS.name + ' works remotely from ' + BUSINESS.location + ' with clients in ' + BUSINESS.targetMarkets + '.',
        ['Market and country details are confirmed for each project so the service, language, targeting and communication fit the actual brief.', 'Bangladesh projects are quoted in BDT; international projects are quoted in USD.'],
        [{ label: 'About Prosengit', href: PAGES.about }, { label: 'View services', href: PAGES.services }, { label: 'Discuss your market', href: PAGES.contact }],
        ['Services', 'Pricing', 'Book a consultation']
      );
    }
    if (includesAny(text, ['who is prosengit', 'what does prosengit do', 'professional background', 'main skills', 'are you a digital marketing expert', 'are you an seo specialist', 'are you a freelancer', 'who are you', 'about prosengit'])) {
      return response(
        BUSINESS.name + ' is a ' + BUSINESS.role + ' based in ' + BUSINESS.location + '.',
        ['The website focuses on SEO and website optimisation, Google and Meta Ads, YouTube marketing, social media marketing, keyword research, website development, lead generation, email marketing support and marketplace research.', 'His approach is to understand the goal and market first, define a practical scope, then document the work and next steps without making unsupported performance promises.'],
        [{ label: 'Read the About page', href: PAGES.about }, { label: 'Explore services', href: PAGES.services }, { label: 'View the portfolio', href: PAGES.portfolio }],
        ['Services', 'View portfolio', 'Contact']
      );
    }
    if (includesAny(text, ['industries', 'what industries', 'small businesses', 'startups', 'work remotely', 'one project', 'custom packages'])) {
      return response(
        'Projects can be scoped for individuals, small businesses, startups and established organisations when the goals, audience and deliverables are clear. Work can be handled remotely, and a focused one-off task or a customised package can be discussed.',
        ['The first conversation usually covers your service or product, target market, current website or channels, timeline and the outcome you want to work toward.', 'The recommended scope depends on the brief; it does not promise rankings, leads, sales or a fixed turnaround before the requirements are known.'],
        [{ label: 'Explore services', href: PAGES.services }, { label: 'View starting prices', href: PAGES.pricing }, { label: 'Discuss your project', href: PAGES.contact }],
        ['Services', 'Pricing', 'Book a consultation']
      );
    }
    return null;
  }

  function contactReply(text) {
    // "Email marketing" is a service question, not a request for the email address.
    if (includesAny(text, ['email marketing', 'email campaign', 'cold email', 'outreach email'])) return null;
    if (!includesAny(text, ['contact', 'email', 'phone', 'whatsapp', 'get in touch', 'request a quote', 'request quote', 'start a project', 'discuss my project', 'book an appointment', 'book appointment', 'book a consultation', 'book consultation', 'book a call', 'appointment'])) return null;
    return response(
      'You can contact ' + BUSINESS.name + ' by email, phone, WhatsApp or the website contact form. For an appointment or project discussion, use the contact form and select the consultation option.',
      ['Email: ' + BUSINESS.email, 'Phone / WhatsApp: ' + BUSINESS.phone, 'To make the first discussion useful, include your goal, website or channel if available, target market, preferred service and timeline.'],
      [{ label: 'Contact Prosengit', href: PAGES.contact }, { label: 'Book a consultation', href: PAGES.appointment }, { label: 'Open WhatsApp', href: BUSINESS.whatsapp, external: true }],
      ['Services', 'Pricing', 'View portfolio']
    );
  }


  function feedbackReply(text) {
    if (!includesAny(text, ['testimonial', 'testimonials', 'review', 'reviews', 'client feedback', 'feedback policy'])) return null;
    return response(
      'The website uses a verified-feedback policy. It does not publish named client or learner quotes, ratings or claimed outcomes until the reviewer, wording and permission can be confirmed.',
      ['You can review the practice case studies for the delivery method and likely deliverables.', 'For a current project discussion, request a scope and quotation based on your actual goals.'],
      [{ label: 'Read the feedback policy', href: PAGES.feedback }, { label: 'Browse practice case studies', href: PAGES.portfolio }, { label: 'Contact Prosengit', href: PAGES.contact }],
      ['View portfolio', 'Services', 'Book a consultation']
    );
  }

  function processReply(text) {
    if (!includesAny(text, ['how do i get started', 'what do you need from me', 'how long will my project take', 'what happens after i contact', 'discuss my project before', 'project process', 'how does the process work'])) return null;
    return response(
      'A typical project starts with a short discussion of the goal and current situation, followed by a written scope with the relevant deliverables, timeline and starting price or custom quotation.',
      ['1. Share your goal, target market, existing website or channels, and timeline.', '2. Review the recommended service and any relevant practice case study.', '3. Confirm the deliverables, access, responsibilities, timeline and price before work starts.', '4. Receive progress updates or handover notes, then review the sensible next step.'],
      [{ label: 'Explore services', href: PAGES.services }, { label: 'Browse practice case studies', href: PAGES.portfolio }, { label: 'Start a conversation', href: PAGES.contact }],
      ['View portfolio', 'Pricing', 'Book a consultation']
    );
  }

  function getReply(raw) {
    var text = normalize(raw);
    if (!text) return response('Please type a question about services, pricing, the portfolio or how to start a project.', [], [], ['Services', 'Pricing', 'View portfolio']);

    if (includesAny(text, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      return response('Hello. I am the website assistant for Prosengit Kundu. I can help with services, pricing, practice case studies, target markets and the project process.', [], [], ['Services', 'Pricing', 'View portfolio', 'Book a consultation']);
    }

    var priceWords = ['price', 'pricing', 'cost', 'charge', 'fee', 'how much', 'quote', 'budget'];
    if (includesAny(text, priceWords)) return pricingReply(text);

    var contact = contactReply(text);
    if (contact) return contact;

    var feedback = feedbackReply(text);
    if (feedback) return feedback;

    var wantsPortfolio = includesAny(text, ['portfolio', 'case study', 'case studies', 'project', 'projects', 'work sample', 'show me your', 'show your work']);
    if (wantsPortfolio) return portfolioReply(text);

    var about = aboutReply(text);
    if (about) return about;

    var process = processReply(text);
    if (process) return process;

    var serviceProbe = includesAny(text, ['do you', 'can you', 'could you', 'provide', 'services', 'service', 'help with', 'manage', 'build', 'redesign', 'maintenance', 'optimize my']);
    var service = findService(text);
    if (serviceProbe && service) return renderService(service, isBuyingIntent(text));

    var seoEducation = seoEducationReply(text);
    if (seoEducation) return seoEducation;

    var adsEducation = adsEducationReply(text);
    if (adsEducation) return adsEducation;

    if (service) return renderService(service, isBuyingIntent(text));

    return response(
      'I do not have verified information on that question, so I do not want to guess. Please contact Prosengit directly for clarification.',
      ['I can also help with SEO, Meta Ads, Google Ads, YouTube marketing, website development, WordPress, Google Sites, lead generation, email marketing, marketplace research, pricing, practice case studies and appointments.'],
      [{ label: 'Contact Prosengit', href: PAGES.contact }, { label: 'Browse services', href: PAGES.services }, { label: 'Open FAQ', href: PAGES.faq }],
      ['Services', 'Pricing', 'View portfolio']
    );
  }

  var panel;
  var messages;
  var input;
  var launcher;
  var greeted = false;

  function linkHtml(link) {
    var external = link.external || /^https?:/i.test(link.href);
    return '<a class="pk-link' + (external ? ' pk-link--wa' : '') + '" href="' + escapeHtml(link.href) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(link.label) + '</a>';
  }

  function addMessage(kind, body) {
    var element = document.createElement('div');
    element.className = 'pk-msg pk-msg--' + kind;
    if (kind === 'user') {
      element.textContent = body;
    } else {
      var html = body.text ? '<p>' + escapeHtml(body.text) + '</p>' : '';
      if (body.list && body.list.length) html += '<ul>' + body.list.map(function (line) { return '<li>' + escapeHtml(line) + '</li>'; }).join('') + '</ul>';
      if (body.links && body.links.length) html += '<p>' + body.links.map(linkHtml).join(' ') + '</p>';
      element.innerHTML = html;
    }
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
    if (kind === 'bot' && body.chips && body.chips.length) addChips(body.chips);
  }

  function addChips(chips) {
    var row = document.createElement('div');
    row.className = 'pk-chips';
    chips.slice(0, 4).forEach(function (label) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'pk-chip';
      button.textContent = label;
      button.addEventListener('click', function () { send(label); });
      row.appendChild(button);
    });
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    var element = document.createElement('div');
    element.className = 'pk-typing';
    element.id = 'pkTyping';
    element.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    var element = document.getElementById('pkTyping');
    if (element && element.parentNode) element.parentNode.removeChild(element);
  }

  function send(text) {
    var message = typeof text === 'string' ? text.trim() : input.value.trim();
    if (!message) return;
    if (typeof text !== 'string') input.value = '';
    addMessage('user', message);
    showTyping();
    window.setTimeout(function () {
      hideTyping();
      addMessage('bot', getReply(message));
    }, 300);
  }

  function open() {
    panel.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    input.focus();
    if (!greeted) {
      greeted = true;
      window.setTimeout(function () {
        addMessage('bot', response('Hello. I am the website assistant for Prosengit Kundu. How can I help you today?', [], [], ['Services', 'Pricing', 'View portfolio', 'Book a consultation']));
      }, 150);
    }
  }

  function close() {
    panel.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  function buildUi() {
    launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'pk-chatbot-launcher';
    launcher.setAttribute('aria-label', 'Open website assistant');
    launcher.setAttribute('aria-controls', 'pk-chatbot-panel');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span class="pk-chatbot-launcher__dot"></span>';
    document.body.appendChild(launcher);

    panel = document.createElement('section');
    panel.className = 'pk-chatbot';
    panel.id = 'pk-chatbot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-label', 'Prosengit Kundu website assistant');
    panel.innerHTML =
      '<div class="pk-chatbot__header"><span class="pk-chatbot__avatar-wrap"><span class="pk-chatbot__avatar-init">PK</span><img class="pk-chatbot__avatar" src="' + escapeHtml(BUSINESS.avatar) + '" alt=""></span><div class="pk-chatbot__id"><div class="pk-chatbot__name">Website assistant</div><div class="pk-chatbot__status">Prosengit Kundu portfolio</div></div><button type="button" class="pk-chatbot__close" aria-label="Close assistant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="pk-chatbot__body" aria-live="polite"></div>' +
      '<div class="pk-chatbot__input"><input type="text" placeholder="Ask about services, pricing or projects" autocomplete="off" aria-label="Your question"><button type="button" class="pk-chatbot__send" aria-label="Send question"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg></button></div>' +
      '<div class="pk-chatbot__foot">Automated website assistant. For a direct conversation, use WhatsApp or the contact page.</div>';
    document.body.appendChild(panel);

    messages = panel.querySelector('.pk-chatbot__body');
    input = panel.querySelector('input');
    var avatar = panel.querySelector('.pk-chatbot__avatar');
    avatar.addEventListener('error', function () { avatar.style.display = 'none'; });
    launcher.addEventListener('click', function () { panel.classList.contains('is-open') ? close() : open(); });
    panel.querySelector('.pk-chatbot__close').addEventListener('click', close);
    panel.querySelector('.pk-chatbot__send').addEventListener('click', function () { send(); });
    input.addEventListener('keydown', function (event) { if (event.key === 'Enter') send(); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
    });
  }

  function init() {
    loadPortfolioIndex();
    buildUi();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.PkChatbot = {
    open: open,
    close: close,
    send: send,
    getReply: getReply,
    _getReply: getReply,
    _getPortfolio: function () { return portfolioItems.slice(); },
    _knowledge: { services: SERVICES, prices: PRICE_GROUPS, pages: PAGES }
  };
})();
