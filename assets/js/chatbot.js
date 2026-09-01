/* ==========================================================================
   Prosengit Kundu — "Ask Prosengit" on-site assistant (v2)
   --------------------------------------------------------------------------
   A lightweight, self-contained chat widget that answers visitor questions
   about Prosengit Kundu, his services, skills, prices, packages, working
   process, portfolio, blog, testimonials, FAQs, policies and contact details.
   No external service or API key required — everything runs in the visitor's
   browser.

   v2 upgrades over the original assistant:
     • Fuzzy + typo-tolerant matching  (e.g. "wordpres" still matches WordPress)
     • Short-form / chat-speak understanding  ("seo", "wp", "fb", "ur", "r u",
       "price", "cost", "wa number", "tym", etc.)
     • A much larger knowledge base — every service, price, package, skill,
       FAQ topic, page and policy on the site
     • A full-text site index used as a fallback, so the bot can answer about
       (almost) anything on the website and always points to the right page.

   Loaded automatically by assets/js/site.js on every page, so the assistant
   appears site-wide with a single script. Styles live in assets/css/style.css
   (section "Chatbot widget").
   ========================================================================== */
(function () {
    'use strict';

    if (window.PkChatbot) return; // already initialised

    /* ----------------------------------------------------------------------
       Site facts (single source of truth for the assistant)
       ---------------------------------------------------------------------- */
    var CONTACT = {
        name: 'Prosengit Kundu',
        fullName: 'Prosengit Kundu Utshob',
        role: 'Digital Marketing Expert & SEO Specialist',
        avatar: 'assets/images/prosengit-kundu-professional-128.webp',
        phone: '+880 1701-059499',
        phoneShort: '01701059499',
        email: 'Prosengit95@gmail.com',
        whatsapp: 'https://wa.me/8801701059499',
        facebook: 'https://www.facebook.com/Prosengit95',
        linkedin: 'https://www.linkedin.com/in/prosengitkundu/',
        location: 'Khulna, Bangladesh',
        hours: 'Saturday–Thursday, 10:00 AM – 8:00 PM (Bangladesh Standard Time)',
        domain: 'prosengitkundu.top'
    };

    var PAGE = {
        home: 'index.html',
        services: 'services.html',
        pricing: 'pricing.html',
        portfolio: 'portfolio.html',
        faq: 'faq.html',
        about: 'about.html',
        contact: 'contact.html',
        testimonials: 'testimonials.html',
        blog: 'blog.html',
        terms: 'terms.html',
        privacy: 'privacy-policy.html',
        disclaimer: 'disclaimer.html',
        thankYou: 'thank-you.html'
    };

    var MENU_CHIPS = ['🛠️ Services', '💰 Prices', '👤 About Prosengit', '📞 Contact me', '📅 Book a free call'];

    /* ----------------------------------------------------------------------
       Text helpers
       ---------------------------------------------------------------------- */
    function esc(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalize(s) {
        return String(s)
            .toLowerCase()
            .replace(/[৳$€£]/g, ' ')
            .replace(/['\u2019]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /* Levenshtein edit distance — used for typo tolerance. */
    function dist(a, b) {
        if (a === b) return 0;
        var m = a.length, n = b.length;
        if (m === 0) return n;
        if (n === 0) return m;
        var prev = [], cur = [];
        var i, j;
        for (j = 0; j <= n; j++) prev[j] = j;
        for (i = 1; i <= m; i++) {
            cur = [i];
            for (j = 1; j <= n; j++) {
                cur[j] = Math.min(
                    prev[j] + 1,
                    cur[j - 1] + 1,
                    prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)
                );
            }
            prev = cur;
        }
        return prev[n];
    }

    /* Whole-word presence of `word` inside a normalised text. */
    function wholeWord(text, word) {
        return (' ' + text + ' ').indexOf(' ' + word + ' ') !== -1;
    }

    /* Does one token loosely equal `phrase`? (exact first, then typo-tolerance).
       Kept strict on purpose: same first letter, similar length, edit distance 1
       (or 2 only for long words where the last letter also matches) — so genuine
       misspellings are caught without confusing real words like contact/contract. */
    function wordMatch(word, phrase) {
        if (word === phrase) return true;
        if (word.length < 5 || phrase.length < 5) return false;
        if (Math.abs(word.length - phrase.length) > 1) return false;
        if (word.charAt(0) !== phrase.charAt(0)) return false;
        var d = dist(word, phrase);
        if (d === 1) return true;
        if (d === 2 && word.length >= 9 && word.charAt(word.length - 1) === phrase.charAt(phrase.length - 1)) return true;
        return false;
    }

    function wordMatchIn(text, phrase) {
        if (wholeWord(text, phrase)) return true;
        var tw = text.split(' ');
        for (var i = 0; i < tw.length; i++) {
            if (wordMatch(tw[i], phrase)) return true;
        }
        return false;
    }

    /* `hit` matches a phrase inside a normalised text.
       - Multi-word phrases match as a substring, as a fuzzy sequence of words,
         or as a joined (no-space) token — so "web desgin" ≈ "web design".
       - Single words match whole-word, with typo tolerance. */
    function hit(text, phrase) {
        phrase = String(phrase);
        if (phrase.indexOf(' ') !== -1) {
            if (text.indexOf(phrase) !== -1) return true;

            var joined = phrase.split(' ').join('');
            if (text.indexOf(joined) !== -1) return true;

            var tw = text.split(' ');
            var pw = phrase.split(' ');
            for (var i = 0; i + pw.length <= tw.length; i++) {
                var ok = true;
                for (var j = 0; j < pw.length; j++) {
                    if (!wordMatch(tw[i + j], pw[j])) { ok = false; break; }
                }
                if (ok) return true;
            }
            return false;
        }
        return wordMatchIn(text, phrase);
    }

    function anyHit(text, list) {
        for (var i = 0; i < list.length; i++) {
            if (hit(text, list[i])) return true;
        }
        return false;
    }

    function linkHtml(link) {
        var cls = 'pk-link' + (link.wa ? ' pk-link--wa' : '');
        var external = link.wa || /^https?:/i.test(link.href);
        var target = external ? ' target="_blank" rel="noopener"' : '';
        return '<a class="' + cls + '" href="' + esc(link.href) + '"' + target + '>' + esc(link.label) + '</a>';
    }

    /* ----------------------------------------------------------------------
       Short-form / chat-speak expansion
       Whole tokens are expanded before matching, so "ur", "r u", "wp", "fb"
       and friends are understood. Kept conservative: only whole-word tokens
       are replaced, so real words are never mangled.
       ---------------------------------------------------------------------- */
    var SHORT_FORMS = {
        'u': 'you',
        'ur': 'your',
        'yr': 'your',
        'urs': 'yours',
        'r': 'are',
        'ru': 'are you',
        'wbu': 'what about you',
        'pls': 'please',
        'plz': 'please',
        'thx': 'thanks',
        'ty': 'thanks',
        'tq': 'thanks',
        'tnx': 'thanks',
        'thnx': 'thanks',
        'wts': 'whatsapp',
        'wats': 'whatsapp',
        'watsapp': 'whatsapp',
        'whatsappp': 'whatsapp',
        'wa': 'whatsapp',
        'wp': 'wordpress',
        'fb': 'facebook',
        'ig': 'instagram',
        'insta': 'instagram',
        'yt': 'youtube',
        'gmb': 'google business profile',
        'gbp': 'google business profile',
        'ppc': 'paid ads',
        'se0': 'seo',
        'seoo': 'seo',
        'bdt': 'taka',
        'tk': 'taka',
        'usd': 'dollar',
        'ph': 'phone',
        'mob': 'mobile',
        'eml': 'email',
        'mail': 'email',
        'hrs': 'hours',
        'ok': 'okay',
        'k': 'okay',
        'wat': 'what',
        'wut': 'what',
        'wht': 'what',
        'whr': 'where',
        'wr': 'where',
        'y': 'why',
        'hw': 'how',
        'info': 'information',
        'prblm': 'problem',
        'prob': 'problem',
        'roi': 'return on investment',
        'cms': 'wordpress',
        'blg': 'blog',
        'prtfl': 'portfolio',
        'tstm': 'testimonial',
        'lang': 'language',
        'exp': 'experience',
        'avlb': 'available'
    };

    function expandShort(text) {
        var toks = text.split(' ');
        for (var i = 0; i < toks.length; i++) {
            var t = toks[i];
            if (SHORT_FORMS[t]) {
                toks[i] = SHORT_FORMS[t];
            } else if (t.length > 3 && t.charAt(t.length - 1) === 's' && SHORT_FORMS[t.slice(0, -1)]) {
                toks[i] = SHORT_FORMS[t.slice(0, -1)] + 's';
            }
        }
        return toks.join(' ');
    }

    /* ----------------------------------------------------------------------
       Keyword buckets
       ---------------------------------------------------------------------- */
    var PRICE_WORDS = ['price', 'pricing', 'cost', 'costs', 'charge', 'charges', 'fee', 'fees',
                       'how much', 'much', 'rate', 'rates', 'package', 'packages',
                       'plan', 'plans', 'budget', 'expensive', 'cheap', 'quote', 'quotes',
                       'taka', 'bdt', 'usd', 'dollar', 'dollars', 'afford', 'tk', 'pay',
                       'payment', 'payments', 'bikash', 'bkash', 'nagad', 'rocket', 'paypal',
                       'wise', 'bank transfer', 'deposit', 'milestone', 'milestones'];

    var INFO_WORDS = ['what is', 'what are', 'what does', 'how to', 'how do i', 'how can i',
                      'guide', 'guides', 'tip', 'tips', 'article', 'articles', 'blog', 'read',
                      'learn', 'explain', 'explained', 'meaning', 'means', 'why', 'when', 'how',
                      'does', 'vs', 'versus', 'which', 'better', 'best', 'compare', 'comparison',
                      'difference', 'differ', 'improve', 'increase', 'boost', 'affect', 'affects',
                      'effect', 'matter', 'matters', 'for small business', 'for beginners',
                      'for business', 'small business', 'beginner', 'beginners', 'way to',
                      'ways to', 'step by step', 'start with', 'best practices', 'best practice',
                      'checklist', 'basics', 'essentials', 'framework', 'examples', 'tutorial',
                      'benefits', 'importance', 'important', 'works', 'steps to'];

    /* If the visitor is clearly asking for a service (not reading up), the bot
       answers with the service instead of handing them a blog article. */
    var SERVICE_PROBE = ['do you', 'do u', 'can you', 'can u', 'could you', 'would you',
                         'you do', 'you offer', 'you provide', 'you make', 'you build',
                         'you design', 'you manage', 'you give', 'you have', 'u do', 'u offer',
                         'provide', 'offer', 'service', 'services', 'hire', 'hiring', 'order',
                         'purchase', 'buy', 'for me', 'for my business', 'my business', 'my website',
                         'my site', 'my brand', 'my company', 'want to', 'i need', 'i want',
                         'looking for', 'quote', 'price', 'pricing', 'cost'];

    /* ----------------------------------------------------------------------
       Knowledge base
       `topics`    = the subject of the question (any one must appear)
       `any`       = extra words that must appear when requireAny is set,
                     otherwise they just boost the score
       `weight`    = bias so specific answers beat generic ones
       ---------------------------------------------------------------------- */
    var INTENTS = [

        /* ===================== PRICING (specific services) ===================== */
        {
            id: 'price-seo',
            weight: 6,
            topics: ['seo', 'search', 'rank', 'ranking', 'keyword', 'keywords', 'organic',
                     'google business', 'google business profile', 'gmb', 'on-page', 'on page',
                     'technical seo', 'local seo', 'audit', 'search engine', 'serp',
                     'competitor analysis', 'youtube seo'],
            any: PRICE_WORDS,
            requireAny: true,
            answer: {
                text: 'Here are my SEO prices (starting from — the exact quote depends on scope):',
                list: [
                    '🔍 SEO Audit — from $25 (2 days) · ৳2,000–3,000',
                    '🔑 Keyword Research — from $30 (2 days) · ৳2,500–4,000',
                    '📄 On-Page SEO — from $60 (3 days) · ৳5,000–8,000',
                    '⚙️ Technical SEO — from $80 (5 days) · ৳7,000–12,000',
                    '📍 Local SEO — from $70 (5 days) · ৳6,000–10,000',
                    '📈 Full SEO (monthly) — from $180/month · ৳15,000–25,000/mo',
                    '🗺️ Google Business Profile — from $50 (2 days)',
                    '🧭 Competitor Analysis — from $30 (2 days)',
                    '▶️ YouTube SEO — from $50 (2 days)',
                    '🇧🇩 Bangladesh clients: quoted in BDT · 🌍 International clients: USD ($)'
                ],
                links: [
                    { label: '📋 Full price list', href: PAGE.pricing },
                    { label: '🛠️ SEO services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Website prices', '📢 Ads prices', '📞 Contact me']
            }
        },
        {
            id: 'price-website',
            weight: 6,
            topics: ['website', 'web site', 'web', 'site', 'wordpress', 'landing page', 'landing',
                     'web design', 'redesign', 'ecommerce', 'e-commerce', 'online store', 'cms',
                     'portfolio website', 'speed optimization'],
            any: PRICE_WORDS,
            requireAny: true,
            answer: {
                text: 'My web development prices (starting from):',
                list: [
                    '🛬 Landing Page — from $120 (3 days) · ৳10,000–15,000',
                    '🌐 HTML/CSS Website — from $250 (7–10 days) · ৳20,000–35,000',
                    '⚡ HTML/CSS/JavaScript Website — from $350 (10–15 days) · ৳30,000–50,000',
                    '💎 Premium Custom Website — from $500 (2–4 weeks) · ৳45,000–70,000+',
                    '👤 Portfolio Website (custom-coded) — from $150 (5 days)',
                    '🔧 WordPress Website — from $180 (7 days) · customization from $80',
                    '⚡ Speed Optimization — from $50 · SEO Setup — from $60',
                    '🇧🇩 Bangladesh clients in BDT (৳) · 🌍 International clients in USD ($)'
                ],
                links: [
                    { label: '📋 Web prices', href: PAGE.pricing },
                    { label: '🖥️ Website services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 SEO prices', '📢 Ads prices', '📞 Contact me']
            }
        },
        {
            id: 'price-ads',
            weight: 6,
            topics: ['ad', 'ads', 'advert', 'advertising', 'ppc', 'google ads', 'facebook',
                     'instagram', 'meta', 'youtube', 'campaign', 'paid', 'promote', 'boost',
                     'social media management', 'social media'],
            any: PRICE_WORDS,
            requireAny: true,
            answer: {
                text: 'Paid advertising prices (starting from — the ad budget itself is always separate and paid by you directly to Google/Meta):',
                list: [
                    '🎯 Google Ads Setup — from $60 · ৳5,000–7,000',
                    '📊 Google Ads Management — from $100/month · ৳8,000–15,000/mo',
                    '📱 Meta (Facebook & Instagram) Ads Setup — from $50 · ৳4,000–6,000',
                    '📱 Meta Ads Management — from $90/month · ৳7,000–12,000/mo',
                    '▶️ YouTube Ads — from $70 · ৳6,000–10,000',
                    '📣 Social Media Management — from $100/month · ৳8,000–15,000/mo',
                    '📈 Social Media Strategy — from $50 · ৳4,000–7,000'
                ],
                links: [
                    { label: '📋 Ads price list', href: PAGE.pricing },
                    { label: '📢 Ads services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 SEO prices', '💰 Website prices', '📞 Contact me']
            }
        },
        {
            id: 'price-design',
            weight: 6,
            topics: ['logo', 'logos', 'design', 'designs', 'graphic', 'thumbnail', 'brochure',
                     'business card', 'flyer', 'poster', 'banner', 'social post', 'brand',
                     'brand identity', 'company profile'],
            any: PRICE_WORDS,
            requireAny: true,
            answer: {
                text: 'Graphic design prices (starting from):',
                list: [
                    '🎨 Logo — $25 · ৳2,000–3,000',
                    '🪪 Brand Identity Kit — $120 (5 days)',
                    '💳 Business Card — $15 (1 day) · Flyer — $20 (2 days)',
                    '📣 Poster — $25 (2 days) · Banner — from $20 (1 day)',
                    '📱 Social Media Post — from $8/design · ৳700–1,500',
                    '▶️ YouTube Thumbnail — from $8 (same day) · ৳700–1,200',
                    '📄 Brochure — $50 (3 days) · Company Profile — $80 (5 days)'
                ],
                links: [
                    { label: '📋 Design prices', href: PAGE.pricing },
                    { label: '🎨 Design services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 SEO prices', '💰 Website prices', '📞 Contact me']
            }
        },
        {
            id: 'price-leadgen',
            weight: 6,
            topics: ['lead', 'leads', 'prospect', 'prospects', 'database', 'email list',
                     'b2b', 'b2c', 'contact list', 'lead generation', 'lead gen', 'lead list'],
            any: PRICE_WORDS,
            requireAny: true,
            answer: {
                text: 'Lead generation prices (starting from):',
                list: [
                    '👥 B2B / B2C Lead Generation — from $70 (3–7 days) · ৳6,000–10,000',
                    '🎯 Targeted Lead List — from $50 · ৳4,000–7,000',
                    '🔎 Prospect Research — from $40 · ৳3,500–6,000',
                    'Includes target-audience research, verified contacts, data cleaning & organized delivery'
                ],
                links: [
                    { label: '📋 Pricing page', href: PAGE.pricing },
                    { label: '👥 Lead gen service', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 SEO prices', '📢 Ads prices', '📞 Contact me']
            }
        },
        {
            id: 'price-training',
            weight: 6,
            topics: ['training', 'train', 'course', 'class', 'classes', 'learn', 'teach',
                     'session', 'consult', 'consultation', 'mentor', 'coaching', 'workshop'],
            any: PRICE_WORDS,
            requireAny: true,
            answer: {
                text: 'Training & consultation prices (starting from):',
                list: [
                    '🎓 Digital Marketing Training — from $30/session · ৳2,500–4,000',
                    '💬 1:1 Digital Marketing Consultation (1 hr) — from $20 · ৳1,500–2,500',
                    '📊 SEO / Google Ads / Meta Ads Consultation — $40 each',
                    '🚀 Business Growth Strategy Session — $60',
                    '🖌️ Graphic Design & Database Training — custom quote',
                    'Free 15-minute consultation is always available'
                ],
                links: [
                    { label: '📋 Pricing page', href: PAGE.pricing },
                    { label: '🎓 Training info', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 SEO prices', '💰 Website prices', '🗓️ Free consultation']
            }
        },

        /* ===================== PACKAGES ===================== */
        {
            id: 'packages',
            weight: 5,
            topics: ['package', 'packages', 'plans', 'plan', 'combo', 'bundle', 'seo starter',
                     'starter package', 'seo growth', 'digital growth', 'retainer'],
            any: ['price', 'pricing', 'cost', 'costs', 'how much', 'much', 'rate', 'rates',
                  'include', 'included', 'what do you get', 'whats included', 'choose'],
            answer: {
                text: 'I offer six clear starting packages — each can be scaled or combined:',
                list: [
                    '📦 SEO Starter — ৳8,000 / $90 (audit + keyword research + on-page)',
                    '📦 SEO Growth — ৳18,000 / $200 (full audit, technical SEO, reporting)',
                    '🌐 Custom Website — ৳30,000 / $350 (hand-coded HTML/CSS/JS, 5–8 pages)',
                    '👥 Lead Generation — ৳7,000 / $80 (verified, targeted prospect lists)',
                    '📢 Paid Advertising — ৳8,000 / $90 (Google Ads & Meta Ads managed)',
                    '🚀 Digital Growth (monthly) — ৳35,000 / $400 (SEO + social + leads + ads)',
                    'Need a different combination? Custom packages are available.'
                ],
                links: [
                    { label: '📦 Compare packages', href: PAGE.pricing },
                    { label: '🛠️ Services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '🛠️ Services', '📞 Contact me']
            }
        },
        {
            id: 'price-general',
            weight: 0,
            any: ['price', 'pricing', 'cost', 'costs', 'charge', 'charges', 'fee', 'fees',
                  'how much', 'rate', 'rates', 'budget', 'quote', 'package', 'packages',
                  'plan', 'plans', 'expensive', 'cheap', 'afford', 'payment', 'pay',
                  'bikash', 'bkash', 'nagad', 'rocket', 'paypal', 'wise', 'bank transfer',
                  'deposit', 'milestone', 'taka', 'dollar', 'usd', 'bdt'],
            answer: {
                text: 'Here is a quick price overview. All prices are "starting from" — Bangladesh clients pay in BDT (৳) and international clients in USD ($).',
                list: [
                    '📦 SEO Starter — ৳8,000 / $90',
                    '📦 SEO Growth — ৳18,000 / $200',
                    '📦 Custom Website — ৳30,000 / $350',
                    '📦 Lead Generation — ৳7,000 / $80',
                    '📦 Paid Advertising — ৳8,000 / $90',
                    '📦 Digital Growth (monthly) — ৳35,000 / $400',
                    '🔍 SEO Audit — from $25 · 🎨 Logo — $25 · 🎓 Training — from $30/session',
                    '💳 Payments: bKash, Nagad, Rocket, bank transfer (BD) · Wise, PayPal, bank transfer (international)'
                ],
                links: [
                    { label: '📋 Full price list', href: PAGE.pricing },
                    { label: '🛠️ Services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 SEO prices', '🌐 Website prices', '📢 Ads prices', '📞 Contact me']
            }
        },

        /* ===================== SERVICES ===================== */
        {
            id: 'services-list',
            weight: 0,
            any: ['service', 'services', 'what do you do', 'what do you offer', 'what do u do',
                  'offer', 'expertise', 'skills', 'skill', 'can you', 'help me with', 'help with',
                  'digital marketing', 'marketing', 'work', 'do you provide', 'you do'],
            answer: {
                text: 'I offer a full digital marketing stack — any service can be ordered individually or as a package:',
                list: [
                    '🔍 SEO — audits, keyword research, on-page, technical & local SEO',
                    '📢 Google Ads & Meta (Facebook/Instagram) Ads',
                    '👥 B2B / B2C Lead Generation',
                    '🌐 Custom Websites (hand-coded HTML, CSS & JavaScript) + WordPress',
                    '🎨 Graphic Design — logos, posts, thumbnails & more',
                    '🎓 Digital Marketing Training & 1:1 Consultation'
                ],
                links: [
                    { label: '🛠️ Explore services', href: PAGE.services },
                    { label: '📋 Pricing', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '👤 About Prosengit', '📞 Contact me']
            }
        },
        {
            id: 'services-seo',
            weight: 4,
            any: ['seo', 'search engine', 'search optimization', 'rank', 'ranking', 'keyword',
                  'organic', 'google business', 'gmb', 'on-page', 'technical seo', 'local seo',
                  'audit', 'serp', 'competitor analysis', 'youtube seo'],
            answer: {
                text: 'Yes — SEO is my primary specialization. I cover the whole stack:',
                list: [
                    '🔍 SEO audits, keyword research & SERP analysis',
                    '📄 On-page, technical & local SEO',
                    '🗺️ Google Business Profile optimization',
                    '▶️ YouTube SEO + Google Search Console & Analytics setup',
                    'Honest timelines: technical fixes show effect in weeks; content gains mature over 2–4 months.'
                ],
                links: [
                    { label: '🔍 SEO details', href: PAGE.services },
                    { label: '💰 SEO prices', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '📢 Ads', '🗓️ Free consultation']
            }
        },
        {
            id: 'services-website',
            weight: 4,
            any: ['website', 'web site', 'web development', 'web design', 'developer', 'wordpress',
                  'landing page', 'landing', 'redesign', 'ecommerce', 'e-commerce', 'html', 'css',
                  'javascript', 'responsive', 'online store', 'cms', 'speed optimization', 'portfolio website',
                  'search console', 'google search console', 'search console setup', 'google analytics',
                  'analytics setup', 'google analytics setup', 'website seo setup',
                  'webdesign', 'webdevelopment'],
            answer: {
                text: 'I build fast, responsive websites — custom-coded first:',
                list: [
                    '🌐 Hand-coded HTML, CSS & vanilla JavaScript (no theme bloat)',
                    '📱 Responsive from 360px phones to large desktops',
                    '📄 5–8 pages, contact form, SEO-friendly structure, sitemap + robots.txt',
                    '🔧 WordPress available as an option (from ৳15,000 / $180) when you want a CMS',
                    '🖌️ Redesigns & speed/SEO fixes for existing sites too'
                ],
                links: [
                    { label: '🖥️ Website services', href: PAGE.services },
                    { label: '💰 Website prices', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '👀 Portfolio', '📞 Contact me']
            }
        },
        {
            id: 'services-ads',
            weight: 4,
            any: ['google ads', 'meta ads', 'facebook ads', 'instagram ads', 'youtube ads',
                  'google', 'meta', 'facebook', 'instagram', 'youtube',
                  'paid ads', 'paid advertising', 'advertising', 'adwords', 'ppc', 'campaign',
                  'campaigns', 'promote', 'boost', 'social media', 'social media management',
                  'social media marketing', 'run ads', 'ads', 'advert'],
            answer: {
                text: 'I set up and manage paid campaigns with structure, not guesswork:',
                list: [
                    '🎯 Google Ads — Search, Display & YouTube (setup + monthly management)',
                    '📱 Meta Ads — Facebook & Instagram (audiences, creative testing, retargeting)',
                    '📊 Conversion tracking, weekly optimization & transparent reporting',
                    '💰 Ad budget is separate — you pay Google/Meta directly and keep full account ownership'
                ],
                links: [
                    { label: '📢 Ads services', href: PAGE.services },
                    { label: '💰 Ads prices', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '🔍 SEO', '📞 Contact me']
            }
        },
        {
            id: 'services-leadgen',
            weight: 4,
            any: ['lead generation', 'leads', 'lead', 'prospect', 'prospects',
                  'database', 'email list', 'b2b', 'b2c', 'contact list', 'data entry',
                  'data cleaning', 'lead list'],
            answer: {
                text: 'I build verified, outreach-ready lead lists for sales teams and agencies:',
                list: [
                    '👥 Target-audience & prospect research (LinkedIn + Google Maps)',
                    '✅ Verified emails, phones & decision-maker titles',
                    '🧹 Data cleaning, de-duplication & organized delivery',
                    '📋 Each row includes source + a personalization note',
                    'Industries: agencies, SaaS, local businesses, e-commerce, real estate & more'
                ],
                links: [
                    { label: '👥 Lead gen service', href: PAGE.services },
                    { label: '💰 Lead gen prices', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '📢 Ads', '📞 Contact me']
            }
        },
        {
            id: 'services-design',
            weight: 4,
            any: ['graphic design', 'design', 'designs', 'designer', 'logo', 'logos',
                  'thumbnail', 'brochure', 'business card', 'flyer', 'poster', 'banner',
                  'social post', 'brand identity', 'company profile', 'photoshop', 'illustrator',
                  'youtube thumbnail'],
            answer: {
                text: 'Yes — I provide graphic design that keeps your brand consistent:',
                list: [
                    '🎨 Logo, brand identity kit, business card, flyer, poster & banner',
                    '📱 Social media post designs & YouTube thumbnails',
                    '📄 Brochure & company profile design',
                    'Prices from $8 per design — see the full list on the pricing page'
                ],
                links: [
                    { label: '🎨 Design services', href: PAGE.services },
                    { label: '💰 Design prices', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '🌐 Websites', '📞 Contact me']
            }
        },
        {
            id: 'services-training',
            weight: 4,
            any: ['training', 'trainer', 'course', 'class', 'classes', 'learn', 'teach',
                  'teaching', 'workshop', 'coaching', 'mentor', 'institution', 'institute'],
            answer: {
                text: 'I train individuals, teams and institutions in practical digital skills:',
                list: [
                    '🎓 SEO, Google Ads, Meta Ads, lead generation & freelancing',
                    '🌐 Web development, WordPress & database management',
                    '🎨 Graphic design (Photoshop & Illustrator)',
                    '🏛️ Ex-trainer at Department of Youth Development Khulna & Technical Training Center Khulna',
                    'Training from ৳2,500 / $30 per session · 1:1 consultations available'
                ],
                links: [
                    { label: '🎓 Training details', href: PAGE.services },
                    { label: '📋 Pricing', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '👤 About Prosengit', '📞 Contact me']
            }
        },

        /* ===================== ABOUT / ME / SKILLS ===================== */
        {
            id: 'about',
            weight: 0,
            any: ['who are you', 'who is prosengit', 'who is', 'prosengit kundu', 'utshob',
                  'your name', 'yourself', 'about you', 'about prosengit', 'about yourself',
                  'your background', 'bio', 'biography', 'introduce', 'introduction', 'profile',
                  'international', 'freelancer', 'freelance', 'prosengit'],
            answer: {
                text: 'I\u2019m Prosengit Kundu Utshob, working professionally as Prosengit Kundu — a Digital Marketing Expert & SEO Specialist based in Khulna, Bangladesh.',
                list: [
                    '📅 8+ years of hands-on experience',
                    '🌍 I serve clients in Bangladesh + internationally (USA, UK, Canada, Australia, Europe, Middle East, Asia)',
                    '🛠️ SEO, Google/Meta Ads, lead generation, custom-coded websites, graphic design & training',
                    '🎓 Ex-Digital Marketing trainer at the Department of Youth Development & Technical Training Center Khulna',
                    '🗣️ Languages: Bangla, English & Hindi'
                ],
                links: [
                    { label: '👤 About page', href: PAGE.about },
                    { label: '👀 My work', href: PAGE.portfolio },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },
        {
            id: 'about-site',
            weight: 6,
            any: ['this website', 'this site', 'your website', 'your site', 'the website about',
                  'site about', 'what is this site', 'website about', 'prosengitkundu'],
            answer: {
                text: 'This is prosengitkundu.top — the official website of Prosengit Kundu, a Digital Marketing Expert & SEO Specialist from Khulna, Bangladesh.',
                list: [
                    '🏠 It covers his services, prices, portfolio, blog, testimonials, FAQ and contact details',
                    '🧭 Explore: Home, About, Services, Pricing, Portfolio, Blog, Testimonials, FAQ and Contact',
                    '💡 There are also legal pages: Terms, Privacy Policy and Disclaimer'
                ],
                links: [
                    { label: '🏠 Home', href: PAGE.home },
                    { label: '🛠️ Services', href: PAGE.services },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['👤 About Prosengit', '🛠️ Services', '📞 Contact me']
            }
        },
        {
            id: 'skills',
            weight: 3,
            any: ['skills', 'skill', 'what can you do', 'what can u do', 'expertise', 'speciality',
                  'specialties', 'specialist', 'know how', 'good at', 'capable', 'abilities',
                  'strengths', 'what are you good at', 'areas of expertise'],
            answer: {
                text: 'My core skills — I\u2019m strongest where marketing strategy and hands-on technical work meet:',
                list: [
                    '🔍 SEO & Google Ads (100% service coverage)',
                    '📢 Meta & Social Media Ads (100%)',
                    '🎨 Graphic Design & Branding (100%)',
                    '▶️ YouTube Marketing & SEO (100%)',
                    '👥 Lead Generation (100%)',
                    '🔧 WordPress & Analytics (100%)',
                    '🌐 Custom web development: HTML5, CSS3, vanilla JavaScript',
                    '🎓 Training & consultation for teams and institutions'
                ],
                links: [
                    { label: '🛠️ Services', href: PAGE.services },
                    { label: '👤 About me', href: PAGE.about },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '👤 About Prosengit', '💰 Prices']
            }
        },
        {
            id: 'stats',
            weight: 4,
            any: ['stats', 'statistics', 'students trained', 'projects delivered',
                  'happy clients', 'how many students', 'how many clients', 'how many projects',
                  'track record', 'results so far', '1,850', '1850', '96'],
            answer: {
                text: 'A few numbers from my journey so far:',
                list: [
                    '📅 8+ years of industry experience',
                    '🎓 1,850+ students trained through government & private institutions',
                    '🏢 96+ brands helped with their marketing goals',
                    '🗺️ Clients across Bangladesh + USA, UK, Canada, Australia, Europe, Middle East & Asia'
                ],
                links: [
                    { label: '👤 About page', href: PAGE.about },
                    { label: '⭐ Testimonials', href: PAGE.testimonials },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '👀 Portfolio', '📞 Contact me']
            }
        },
        {
            id: 'experience',
            weight: 4,
            any: ['experience', 'how long', 'how many years', 'years of experience', 'years', 'background',
                  'history', 'career', 'qualified', 'qualification', 'certified', 'certification',
                  'journey'],
            answer: {
                text: 'I have 8+ years of hands-on experience across the full digital marketing stack:',
                list: [
                    '📅 8+ years in SEO, digital marketing, design & web development',
                    '🏛️ Digital Marketing Level-3 Trainer — Technical Training Center Khulna',
                    '🏛️ Database & Digital Marketing Trainer — Department of Youth Development Khulna (Govt. of Bangladesh)',
                    '🎨 Graphic Design Trainer — ARICHO IT, Khulna',
                    '🧭 Journey: started as a graphic designer, then grew into data-driven digital marketing',
                    '🌍 Working with local + international clients'
                ],
                links: [
                    { label: '👤 About page', href: PAGE.about },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '👀 Portfolio', '📞 Contact me']
            }
        },
        {
            id: 'mission-vision',
            weight: 4,
            any: ['mission', 'vision', 'goal', 'purpose', 'what drives you', 'philosophy',
                  'values', 'what do you believe', 'approach', 'mindset'],
            answer: {
                text: 'Here\u2019s the mission and vision behind my work:',
                list: [
                    '🎯 Mission: empower businesses and individuals with practical digital marketing skills and strategies that deliver real ROI',
                    '🔭 Vision: become one of Bangladesh\u2019s most trusted names in digital marketing education and strategic consultancy',
                    '🧭 I recommend the smallest useful step first — no overselling, no fluff'
                ],
                links: [
                    { label: '👤 About page', href: PAGE.about },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '👤 About Prosengit', '📞 Contact me']
            }
        },
        {
            id: 'why-me',
            weight: 4,
            any: ['why you', 'why choose', 'why should', 'why hire', 'why work with',
                  'what makes you', 'difference', 'unique', 'advantage', 'vs others',
                  'other agencies', 'better than'],
            answer: {
                text: 'Great question. A few things set me apart:',
                list: [
                    '🔗 One person, one connected skill set — I plan the strategy AND build the technical assets',
                    '💬 You talk directly to me, never an account-manager relay',
                    '🤝 Honesty before revenue — no fake results, no unnecessary services',
                    '🧭 Strategy before activity — the smallest useful step first',
                    '🎓 Every project leaves you understanding more than before'
                ],
                links: [
                    { label: '👤 About page', href: PAGE.about },
                    { label: '⭐ Testimonials', href: PAGE.testimonials },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },

        /* ===================== PROCESS / TIMELINE ===================== */
        {
            id: 'process',
            weight: 0,
            any: ['process', 'how do you work', 'how it works', 'workflow', 'how do we start',
                  'how to start', 'get started', 'start working', 'next step', 'next steps',
                  'how does it work', 'steps', 'how do we begin', 'what happens next'],
            answer: {
                text: 'My process is simple — Discover → Plan → Execute → Improve:',
                list: [
                    '1️⃣ Discover — we clarify your goals, audience & challenges',
                    '2️⃣ Plan — you get a focused plan with priorities, timing & starting cost',
                    '3️⃣ Execute — the work is done with clear communication',
                    '4️⃣ Improve — we review results and decide the best next step',
                    '🚀 Start with the free digital growth check or 15-minute consultation'
                ],
                links: [
                    { label: '🗓️ Free consultation', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '⏱️ Timeline', '📞 Contact me']
            }
        },
        {
            id: 'timeline',
            weight: 4,
            any: ['how long', 'timeline', 'delivery time', 'turnaround', 'deadline', 'duration',
                  'how many days', 'how much time', 'days', 'weeks', 'timeframe', 'time frame',
                  'schedule', 'take', 'deliver', 'delivery', 'when will', 'when can', 'eta'],
            answer: {
                text: 'Typical delivery times:',
                list: [
                    '⚡ Small services (setups, designs, audits) — 1–3 days',
                    '📈 SEO packages — initial phase in 15–30 days',
                    '🌐 Custom websites — 2–4 weeks (depending on pages & content)',
                    '📆 Monthly services (SEO, ads, social) — agreed monthly cycles',
                    'Every quote includes a clear delivery timeline'
                ],
                links: [
                    { label: '📋 Pricing', href: PAGE.pricing },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },
        {
            id: 'revisions',
            weight: 4,
            any: ['revision', 'revisions', 'changes', 'edit', 'edits', 'modification', 'refund',
                  'money back', 'money-back'],
            answer: {
                text: 'Yes — revision terms are agreed in writing before work begins.',
                list: [
                    '🎨 Design services & packages include a defined revision allowance',
                    '🛠️ Larger custom projects follow the written scope',
                    'My goal is that you never need more than the included rounds — that\u2019s why planning and previews happen early'
                ],
                links: [
                    { label: '📞 Contact me', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '⏱️ Timeline', '📞 Contact me']
            }
        },
        {
            id: 'payment',
            weight: 4,
            any: ['payment', 'payments', 'pay', 'bikash', 'bkash', 'nagad', 'rocket', 'paypal',
                  'wise', 'bank transfer', 'deposit', 'milestone', 'how do i pay', 'invoice'],
            answer: {
                text: 'Payment is flexible and confirmed before work begins:',
                list: [
                    '🇧🇩 Bangladesh clients: bKash, Nagad, Rocket & bank transfer',
                    '🌍 International clients: Wise, PayPal & bank transfer',
                    '🗓️ Larger projects are typically split into an advance + final payment on delivery',
                    '💡 Monthly retainers are billed per cycle; ad budgets are paid by you directly to Google/Meta',
                    'Transaction fees (if any) are discussed upfront'
                ],
                links: [
                    { label: '📋 Pricing page', href: PAGE.pricing },
                    { label: '📞 Contact me', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '📞 Contact me', '🗓️ Free consultation']
            }
        },
        {
            id: 'communication',
            weight: 4,
            any: ['communicate', 'communication', 'how do we talk', 'stay in touch', 'updates',
                  'how will we', 'check in', 'progress update'],
            answer: {
                text: 'We\u2019ll communicate however you prefer:',
                list: [
                    '💬 WhatsApp, email, Facebook or LinkedIn — your choice',
                    '📊 Updates at agreed checkpoints, with a clear escalation path',
                    '🌍 International calls are scheduled around your timezone'
                ],
                links: [
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact page', href: PAGE.contact }
                ],
                chips: ['📞 Contact me', '💰 Prices', '🗓️ Free consultation']
            }
        },

        /* ===================== GUARANTEES / HONESTY ===================== */
        {
            id: 'guarantee',
            weight: 0,
            any: ['guarantee', 'guaranteed', 'promise', 'results', 'ranking', 'roi', 'return',
                  'assure', 'sure', 'risk', 'no result', 'first page', 'number 1', '#1'],
            answer: {
                text: 'I keep promises I can actually keep:',
                list: [
                    '🚫 No fake "guaranteed #1 ranking in 30 days" claims — anyone offering that is selling risk',
                    '📈 Honest expectations: technical fixes work in weeks; content gains mature over 2–4 months',
                    '📢 No honest ad manager can guarantee a specific ROAS — I guarantee structure, testing, honest reporting & fast course-correction',
                    '✅ What I do guarantee: professional work, honest timelines and transparent pricing'
                ],
                links: [
                    { label: '⭐ Testimonials', href: PAGE.testimonials },
                    { label: '👀 Portfolio', href: PAGE.portfolio },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },

        /* ===================== FREE STUFF ===================== */
        {
            id: 'free',
            weight: 0,
            any: ['free', 'no cost', 'free consultation', 'free analysis', 'free check',
                  'consultation', 'consult', 'trial', 'sample', 'demo', '15 minute', '15 min',
                  '15-minute', 'growth check', 'free growth check'],
            answer: {
                text: 'Yes — there are two free ways to start:',
                list: [
                    '🎁 Free Digital Growth Check — a mini analysis of your website + goals with quick SEO recommendations',
                    '🗓️ Free 15-minute consultation — talk through your project with no pressure',
                    'Includes: basic SEO check, 3–5 keyword opportunities, performance check & 1–2 lead-gen opportunities'
                ],
                links: [
                    { label: '🎁 Get my free analysis', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['📅 Book a free call', '💰 Prices', '📞 Contact me']
            }
        },

        /* ===================== SOCIAL PROOF ===================== */
        {
            id: 'portfolio',
            weight: 4,
            any: ['portfolio', 'work sample', 'samples', 'previous work', 'past work', 'case study',
                  'case studies', 'examples', 'proof', 'show your work',
                  'what have you done', 'your work'],
            answer: {
                text: 'You can see real examples of my work on the portfolio page:',
                list: [
                    '🌐 Custom website & landing page designs',
                    '📊 SEO analytics, Google Ads & Meta Ads dashboards',
                    '🔑 Keyword research & technical SEO audits',
                    '👥 Lead generation databases & social media / YouTube designs'
                ],
                links: [
                    { label: '👀 View portfolio', href: PAGE.portfolio },
                    { label: '⭐ Testimonials', href: PAGE.testimonials },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },
        {
            id: 'portfolio-honesty',
            weight: 4,
            any: ['demo work', 'concept work', 'sample work', 'real client', 'fake work',
                  'portfolio policy', 'work sample policy', 'is your portfolio real'],
            answer: {
                text: 'I\u2019m fully transparent about my work samples:',
                list: [
                    '🏷️ Every demo/concept project is clearly labelled as such',
                    '❌ I never present demo work as client work, or claim results that weren\u2019t achieved and verified',
                    '✅ Genuine client projects are published in the same format once approved for sharing',
                    '📐 What you see is exactly the structure, depth and standard you receive'
                ],
                links: [
                    { label: '👀 Portfolio', href: PAGE.portfolio },
                    { label: '📄 Disclaimer', href: PAGE.disclaimer },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['👀 Portfolio', '⭐ Testimonials', '📞 Contact me']
            }
        },
        {
            id: 'testimonials',
            weight: 4,
            any: ['testimonial', 'testimonials', 'review', 'reviews', 'feedback', 'rating',
                  'ratings', 'what clients say', 'client', 'clients', 'happy clients', 'reputation'],
            answer: {
                text: 'Client feedback and reputation matter more to me than vanity metrics:',
                list: [
                    '⭐ Reviews are on the testimonials page, organized by service (SEO, ads, web, lead gen)',
                    '🤝 My business runs on clients who come back and refer',
                    '📝 Reviews are published word-for-word, with permission, and never edited to sound better',
                    '💬 I can also connect you with context on request'
                ],
                links: [
                    { label: '⭐ Read testimonials', href: PAGE.testimonials },
                    { label: '👀 Portfolio', href: PAGE.portfolio },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },
        {
            id: 'blog',
            weight: 4,
            any: ['blog', 'article', 'articles', 'post', 'posts', 'read', 'learn more',
                  'guide', 'guides', 'content'],
            answer: {
                text: 'I publish practical articles on the blog — SEO, advertising, lead generation, web development and digital marketing strategy. Popular reads:',
                list: [
                    '🔍 SEO vs Google Ads: Which Is Better for Your Business?',
                    '🔑 What Is Keyword Research and Why Is It Important?',
                    '🌐 HTML vs WordPress for Business Websites',
                    '📱 Why Responsive Web Design Matters for SEO & Conversions',
                    '👥 How to Build a Targeted Lead List for Sales and Ads',
                    '⚡ How Website Speed Affects User Experience and SEO'
                ],
                links: [
                    { label: '📰 Visit the blog', href: PAGE.blog },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },
        {
            id: 'faq',
            weight: 4,
            any: ['faq', 'frequently asked', 'questions', 'question', 'help', 'doubts'],
            answer: {
                text: 'The FAQ page answers the most common questions by topic — services, SEO, web development, paid ads, lead generation, pricing and process:',
                list: [
                    '❓ Everything worth knowing before starting a project',
                    '✅ Honest, specific answers — the way I\u2019d answer on a call'
                ],
                links: [
                    { label: '❓ Open FAQ', href: PAGE.faq },
                    { label: '📞 Contact me', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['🛠️ Services', '💰 Prices', '📞 Contact me']
            }
        },

        /* ===================== CONTACT / AVAILABILITY ===================== */
        {
            id: 'contact',
            weight: 0,
            any: ['contact', 'email', 'phone', 'whatsapp', 'number', 'call', 'reach',
                  'reach you', 'get in touch', 'address', 'location', 'where are you',
                  'where do you', 'based', 'facebook', 'linkedin', 'social media', 'socials',
                  'mail', 'city'],
            answer: {
                text: 'You can reach me any of these ways — I usually reply within 24 hours:',
                list: [
                    '📞 Phone / WhatsApp: +880 1701-059499',
                    '✉️ Email: ' + CONTACT.email,
                    '📍 Location: Khulna, Bangladesh (working remotely worldwide)',
                    '🌐 Facebook: facebook.com/Prosengit95',
                    '💼 LinkedIn: linkedin.com/in/prosengitkundu'
                ],
                links: [
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact page', href: PAGE.contact }
                ],
                chips: ['💰 Prices', '🛠️ Services', '🗓️ Free consultation']
            }
        },
        {
            id: 'availability',
            weight: 4,
            any: ['available', 'availability', 'working hours', 'hours', 'time zone', 'timezone',
                  'response time', 'how soon', 'when do you reply', 'reply', 'online', 'open',
                  'business hours', 'timing', 'open hours'],
            answer: {
                text: 'I work with clients in Bangladesh and internationally, across time zones:',
                list: [
                    '🕙 Business hours: ' + CONTACT.hours,
                    '🗓️ Available for freelance & training projects right now',
                    '🌍 Consultations & deliverables are scheduled around your time zone',
                    '⏱️ I usually reply within 24 hours (often much faster on WhatsApp)'
                ],
                links: [
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact page', href: PAGE.contact }
                ],
                chips: ['🛠️ Services', '💰 Prices', '🗓️ Free consultation']
            }
        },
        {
            id: 'languages',
            weight: 4,
            any: ['language', 'languages', 'bangla', 'bengali', 'hindi', 'english', 'speak'],
            answer: {
                text: 'I communicate in three languages:',
                list: [
                    '🇧🇩 Bangla (বাংলা)',
                    '🇬🇧 English',
                    '🇮🇳 Hindi'
                ],
                links: [
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact page', href: PAGE.contact }
                ],
                chips: ['👤 About Prosengit', '🛠️ Services', '💰 Prices']
            }
        },

        /* ===================== LEGAL / POLICIES ===================== */
        {
            id: 'terms',
            weight: 4,
            any: ['terms', 'terms and conditions', 'terms of service', 'conditions', 'scope of work',
                  'payment terms', 'client responsibilities', 'agreement'],
            answer: {
                text: 'My terms keep every project clear and fair:',
                list: [
                    '📄 Every project starts with a written scope: what\u2019s included, the timeline and the price',
                    '💳 Payment terms are confirmed before work begins; larger projects are split into advance + final payment',
                    '🛠️ A reasonable number of revisions is included in each deliverable, as stated in the scope',
                    '🚫 Advertising budgets are always separate from service fees'
                ],
                links: [
                    { label: '📄 Read Terms', href: PAGE.terms },
                    { label: '📞 Contact me', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['💰 Prices', '📞 Contact me', '🗓️ Free consultation']
            }
        },
        {
            id: 'privacy',
            weight: 4,
            any: ['privacy', 'privacy policy', 'personal data', 'data', 'cookies', 'cookie',
                  'gdpr', 'what information', 'information collected', 'tracking'],
            answer: {
                text: 'Here\u2019s the short version of my privacy policy:',
                list: [
                    '🔒 This site doesn\u2019t require an account and collects no personal data beyond what you voluntarily send',
                    '✉️ Contact-form details go straight to my inbox and are used only to reply to you',
                    '🍪 No advertising or tracking cookies — only your light/dark theme preference is saved locally',
                    '🌐 Some fonts/images load from third-party CDNs, subject to their own policies'
                ],
                links: [
                    { label: '📄 Privacy Policy', href: PAGE.privacy },
                    { label: '📄 Disclaimer', href: PAGE.disclaimer },
                    { label: '📞 Contact me', href: PAGE.contact }
                ],
                chips: ['📄 Terms', '📞 Contact me', '🛠️ Services']
            }
        },
        {
            id: 'disclaimer',
            weight: 4,
            any: ['disclaimer', 'legal', 'liability', 'no guarantee', 'not guaranteed',
                  'work samples policy', 'testimonial policy', 'educational purposes'],
            answer: {
                text: 'Important honesty points from my disclaimer:',
                list: [
                    'ℹ️ Content on this site is for general information and education — it doesn\u2019t guarantee specific marketing, ranking or sales results',
                    '🏷️ Portfolio items marked demo/concept are created to show method and quality, never presented as client work',
                    '⭐ Testimonials marked sample are placeholders while verified reviews are collected',
                    '🔗 Third-party links are provided for convenience and remain subject to their own terms'
                ],
                links: [
                    { label: '📄 Disclaimer', href: PAGE.disclaimer },
                    { label: '👀 Portfolio', href: PAGE.portfolio },
                    { label: '📞 Contact me', href: PAGE.contact }
                ],
                chips: ['📄 Privacy Policy', '👀 Portfolio', '📞 Contact me']
            }
        },

        /* ===================== HIRE / START ===================== */
        {
            id: 'hire',
            weight: 0,
            any: ['hire', 'hiring', 'book', 'booking', 'order', 'purchase', 'buy', 'start',
                  'lets work', 'work with you', 'work together', 'interested', 'want to',
                  'i need', 'need a website', 'need seo', 'need help', 'i want',
                  'start a project', 'get a quote', 'custom quote', 'custom package'],
            answer: {
                text: 'That\u2019s great to hear! 🎉 Here\u2019s how to get started:',
                list: [
                    '1️⃣ Send a quick message via the contact page or WhatsApp',
                    '2️⃣ Tell me your goal (e.g. "rank my website", "run ads", "build a site")',
                    '3️⃣ I reply with a recommendation and a clear, written quote',
                    '🗓️ Not sure yet? Start with the free 15-minute consultation'
                ],
                links: [
                    { label: '🚀 Start now', href: PAGE.contact },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['📅 Book a free call', '💰 Prices', '👀 Portfolio']
            }
        }
    ];

    /* ----------------------------------------------------------------------
       Blog topic guide — links the 21 published articles to questions.
       Visitors asking "how to…", "what is…", "tips", "guide" etc. (and bare
       topic phrases like "keyword research") get the matching article instead
       of a generic service answer. Service-seeking or price questions are
       handled before this list in getReply().
       ---------------------------------------------------------------------- */
    var BLOG_TOPICS = [
        { id: 'b1', topics: ['choose seo', 'right seo', 'which seo', 'seo service for my business', 'seo for my business', 'seo service', 'seo agency'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'This guide matches the right type of SEO to your business stage, budget and goals — plus the questions to ask before you commit.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=1' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b2', topics: ['keyword research', 'keyword', 'keywords', 'search intent', 'long tail', 'long tail keywords', 'keyword difficulty'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'This covers seed keywords, long-tail expansion, search intent, difficulty assessment and mapping — the foundation every other SEO task stands on.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=2' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b3', topics: ['serp', 'serp analysis', 'search results', 'result analysis'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How studying the search results before creating anything builds a smarter SEO strategy — and stops you targeting keywords you cannot win.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=3' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b4', topics: ['on-page', 'onpage', 'on page seo', 'seo checklist', 'meta description', 'internal links'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'A practical on-page SEO checklist for small business websites — titles, meta, headings, internal links, URLs and images.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=4' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b5', topics: ['technical seo', 'technical', 'crawl', 'indexing', 'indexation', 'core web vitals', 'sitemap', 'robots'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'Crawlability, indexation, sitemaps, page speed and Core Web Vitals — the technical foundations every new website needs.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=5' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b6', topics: ['seo friendly', 'seo-friendly', 'seo essentials', 'seo tips', 'seo guide', 'make my website seo'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: '12 essentials that make a website SEO-friendly — from structure and speed to content and mobile usability.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=6' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b7', topics: ['search visibility', 'visibility', 'rank higher', 'improve visibility', 'improve ranking', 'improve seo', 'rank my website', 'search ranking'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'A step-by-step path to improving your website\u2019s search visibility — foundations first, then content and authority.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=7' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 SEO prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b8', topics: ['seo vs', 'vs google ads', 'seo or google ads', 'google ads vs seo', 'organic vs paid', 'organic or paid'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'An honest comparison of SEO vs Google Ads — when organic wins, when paid wins, and how to combine both for growth.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=8' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['📢 Ads prices', '🔍 SEO prices', '📞 Contact me'] } },
        { id: 'b9', topics: ['google ads vs meta', 'meta vs google', 'facebook vs google', 'which ads platform', 'ads platform'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'Google Ads vs Meta Ads — choosing the right platform for your goals, audience and offer.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=9' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['📢 Ads prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b10', topics: ['retargeting', 'remarketing', 'retarget'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How retargeting turns the visitors who left without buying into customers — with audience segments and offers.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=10' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['📢 Ads prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b11', topics: ['b2b leads', 'generate b2b', 'b2b lead generation', 'b2b framework', 'b2b lead'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'A practical framework for generating B2B leads — targeting, messaging, channels and follow-up.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=11' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['👥 Lead gen prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b12', topics: ['lead list', 'build a lead list', 'targeted lead list', 'lead list for sales'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How to build a targeted, verified lead list for sales and ads — ICP, research, verification and cleaning.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=12' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['👥 Lead gen prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b13', topics: ['business website', 'professional website', 'website that builds trust', 'website trust'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How to create a professional business website that builds trust — design, copy, speed and clear calls to action.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=13' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 Website prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b14', topics: ['html vs wordpress', 'wordpress vs html', 'html or wordpress', 'wordpress or html', 'custom vs wordpress'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'An honest HTML vs WordPress comparison for business websites — performance, security, SEO and who maintains it.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=14' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 Website prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b15', topics: ['responsive design', 'responsive', 'mobile friendly', 'mobile-friendly', 'mobile design'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'Why responsive web design matters for SEO and conversions — and what mobile-first actually requires.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=15' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 Website prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b16', topics: ['landing pages', 'converting landing', 'landing page design', 'design a landing page'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'The principles that make landing pages convert — one goal, clear hierarchy, strong proof and fast load.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=16' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 Website prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b17', topics: ['website speed', 'page speed', 'site speed', 'slow website', 'load speed'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How website speed affects user experience and SEO — and where the biggest wins usually hide.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=17' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 Website prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b18', topics: ['image optimization', 'optimize images', 'image seo', 'compress images', 'image alt'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How to optimize images for SEO and faster pages — formats, compression, dimensions and alt text.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=18' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['💰 Website prices', '🛠️ Services', '📞 Contact me'] } },
        { id: 'b19', topics: ['start with digital marketing', 'digital marketing for small business', 'small business digital marketing', 'begin digital marketing', 'digital marketing for beginners'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'A step-by-step way for small businesses to start with digital marketing without wasting budget.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=19' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['🛠️ Services', '💰 Prices', '📞 Contact me'] } },
        { id: 'b20', topics: ['social media for small business', 'social media marketing for small', 'start social media', 'social media strategy', 'social media marketing'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'Where small businesses should actually start with social media marketing — channel choice and content rhythm.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=20' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['🛠️ Services', '💰 Prices', '📞 Contact me'] } },
        { id: 'b21', topics: ['freelance portfolio', 'portfolio that wins clients', 'freelancer portfolio', 'build a portfolio', 'portfolio website'], any: INFO_WORDS, weight: 7, blog: true,
          answer: { text: 'How to build a professional freelance portfolio that wins clients — projects, proof and presentation.', links: [{ label: '📖 Read the article', href: 'blog-details.html?id=21' }, { label: '📰 All articles', href: PAGE.blog }, { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }], chips: ['👀 Portfolio', '🛠️ Services', '📞 Contact me'] } }
    ];

    /* ----------------------------------------------------------------------
       Bangla (বাংলা) support
       Detects Bangla script or common romanised Bangla and answers in Bangla.
       ---------------------------------------------------------------------- */
    var MENU_CHIPS_BN = ['🛠️ সার্ভিস', '💰 দাম', '📞 যোগাযোগ', '👤 আমার সম্পর্কে', '📅 ফ্রি কল বুক করুন'];

    var BANGLA_TRANSLIT = ['koto', 'kivabe', 'kemon', 'apnar', 'apni', 'amar', 'tumi',
                           'dhonnobad', 'dhanyabad', 'salam', 'assalamu alaikum', 'assalamualaikum',
                           'kothay', 'kobe', 'keno', 'kichu', 'ekhon', 'ektu', 'bhalo', 'valo',
                           'theke', 'jonno', 'dorkar', 'lagbe', 'hobe', 'korbo', 'korte', 'korle',
                           'banabo', 'banano', 'koto taka', 'taka koto', 'service ki', 'bolo',
                           'bollen', 'somoy', 'somossa', 'kaj', 'kajer', 'shobdo',
                           'dada', 'bhai', 'apu'];

    function isBangla(raw) {
        if (/[\u0980-\u09FF]/.test(raw)) return true;
        var t = normalize(raw);
        for (var i = 0; i < BANGLA_TRANSLIT.length; i++) {
            var w = BANGLA_TRANSLIT[i];
            if (w.indexOf(' ') !== -1) {
                if (t.indexOf(w) !== -1) return true;
            } else if (wholeWord(t, w)) {
                return true;
            }
        }
        return false;
    }

    function hasBn(text, words) {
        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) !== -1) return true;
        }
        return false;
    }

    function getReplyBn(raw) {
        var text = String(raw).toLowerCase().replace(/\s+/g, ' ').trim();
        var t = normalize(raw);

        // Greeting
        if (hasBn(text, ['হ্যালো', 'হাই', 'সালাম', 'আসসালামু', 'আসসালামু আলাইকুম', 'আসসালামুআলাইকুম',
                         'নমস্কার', 'কেমন আছেন', 'কেমন আছো', 'কি অবস্থা']) ||
            anyHit(t, ['salam', 'assalamu', 'assalamu alaikum', 'assalamualaikum', 'hello', 'hi', 'hey', 'dada', 'bhai', 'apu'])) {
            return {
                text: 'আসসালামু আলাইকুম / হ্যালো! 👋 আমি প্রসেনজিৎ কুন্ডুর সহকারী। সার্ভিস, দাম, প্যাকেজ, কাজের ধরন, দক্ষতা বা যোগাযোগ — যেকোনো প্রশ্ন করুন, আমি উত্তর দেব।',
                chips: MENU_CHIPS_BN
            };
        }

        // Thanks
        if (hasBn(text, ['ধন্যবাদ', 'থ্যাংক', 'থ্যাংকস', 'শুকরিয়া', 'অনেক ধন্যবাদ']) ||
            anyHit(t, ['dhonnobad', 'dhanyabad', 'thank', 'thanks', 'thank you', 'thx'])) {
            return {
                text: 'আপনাকে স্বাগতম! 😊 বিস্তারিত জানতে WhatsApp বা contact পেজে মেসেজ করতে পারেন।',
                links: [
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact পেজ', href: PAGE.contact }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Goodbye
        if (hasBn(text, ['বিদায়', 'বাই', 'আল্লাহ হাফেজ', 'খোদা হাফেজ', 'চলছি', 'পরে কথা', 'আবার দেখা']) ||
            anyHit(t, ['bye', 'goodbye', 'see you'])) {
            return {
                text: 'ধন্যবাদ! 👋 আবার কোনো প্রশ্ন থাকলে আমি এখানেই আছি।',
                chips: MENU_CHIPS_BN
            };
        }

        // About
        if (hasBn(text, ['আপনি কে', 'তুমি কে', 'আপনার নাম', 'নাম কি', 'আপনার সম্পর্কে', 'প্রসেনজিৎ',
                         'উৎসব', 'বায়ো', 'পরিচয়', 'কে আপনি', 'আপনি কোথায়', 'কোথায় থাকেন', 'আপনার অভিজ্ঞতা',
                         'দক্ষতা', 'কি জানেন', 'কি শিখতে'])) {
            return {
                text: 'আমি প্রসেনজিৎ কুন্ডু উৎসব — খুলনা, বাংলাদেশের একজন ডিজিটাল মার্কেটিং এক্সপার্ট ও SEO বিশেষজ্ঞ।',
                list: [
                    '📅 ৮+ বছরের হাতে-কলমে অভিজ্ঞতা',
                    '🌍 বাংলাদেশসহ আন্তর্জাতিক ক্লায়েন্টদের সেবা (USA, UK, কানাডা, অস্ট্রেলিয়া, ইউরোপ, মধ্যপ্রাচ্য, এশিয়া)',
                    '🛠️ দক্ষতা: SEO, Google/Meta Ads, লিড জেনারেশন, কাস্টম ওয়েবসাইট, ডিজাইন ও ট্রেনিং',
                    '🎓 সাবেক প্রশিক্ষক: যুব উন্নয়ন অধিদপ্তর ও টেকনিক্যাল ট্রেনিং সেন্টার, খুলনা',
                    '🗣️ ভাষা: বাংলা, ইংরেজি ও হিন্দি'
                ],
                links: [
                    { label: '👤 আমার সম্পর্কে', href: PAGE.about },
                    { label: '👀 আমার কাজ', href: PAGE.portfolio },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Services
        if (hasBn(text, ['সার্ভিস', 'সেবা', 'কি কি কাজ', 'কি কাজ', 'কি সার্ভিস', 'আপনি কি করেন',
                         'কি করেন', 'মার্কেটিং', 'সেবা কি', 'কাজ কি', 'কি কি করেন'])) {
            return {
                text: 'আমি পুরো ডিজিটাল মার্কেটিং সার্ভিস দিই — যেকোনোটি আলাদা বা প্যাকেজ হিসেবে নেওয়া যায়:',
                list: [
                    '🔍 SEO — অডিট, কিওয়ার্ড রিসার্চ, অন-পেজ, টেকনিক্যাল ও লোকাল SEO',
                    '📢 Google Ads ও Meta (Facebook/Instagram) Ads',
                    '👥 B2B / B2C লিড জেনারেশন',
                    '🌐 কাস্টম ওয়েবসাইট (HTML, CSS, JavaScript) + WordPress',
                    '🎨 গ্রাফিক ডিজাইন — লোগো, পোস্ট, থাম্বনেইল',
                    '🎓 ডিজিটাল মার্কেটিং ট্রেনিং ও ১-অন-১ কনসালটেশন'
                ],
                links: [
                    { label: '🛠️ সার্ভিস দেখুন', href: PAGE.services },
                    { label: '📋 দাম', href: PAGE.pricing },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Portfolio / testimonials
        if (hasBn(text, ['পোর্টফোলিও', 'কাজের নমুনা', 'স্যাম্পল', 'আগের কাজ', 'প্রজেক্ট', 'কেস স্টাডি']) ||
            anyHit(t, ['portfolio', 'work sample', 'sample', 'projects'])) {
            return {
                text: 'আমার কাজের নমুনা পোর্টফোলিও পেজে আছে — ওয়েবসাইট, SEO, অ্যাড, লিড জেনারেশন ও ডিজাইন কেস স্টাডি আকারে।',
                links: [
                    { label: '👀 পোর্টফোলিও দেখুন', href: PAGE.portfolio },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        if (hasBn(text, ['রিভিউ', 'মতামত', 'টেস্টিমোনিয়াল', 'ক্লায়েন্ট', 'ফিডব্যাক'])) {
            return {
                text: 'ক্লায়েন্ট ও শিক্ষার্থীদের মতামত testimonials পেজে আছে — সার্ভিস অনুযায়ী সাজানো, এবং প্রতিটি রিভিউ অনুমতি নিয়ে প্রকাশ করা হয়।',
                links: [
                    { label: '⭐ টেস্টিমোনিয়াল দেখুন', href: PAGE.testimonials },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Process / timeline
        if (hasBn(text, ['কিভাবে কাজ', 'কাজের ধরন', 'প্রসেস', 'কিভাবে শুরু', 'কত দিন', 'কতদিন',
                         'সময়', 'টাইমলাইন', 'কিভাবে করবেন', 'কাজ করেন', 'কত দিনে', 'ডেলিভারি',
                         'কখন শেষ'])) {
            return {
                text: 'আমার কাজের ধরন সহজ — Discover → Plan → Execute → Improve:',
                list: [
                    '1️⃣ Discover — আপনার লক্ষ্য, দর্শক ও চ্যালেঞ্জ পরিষ্কার করা',
                    '2️⃣ Plan — অগ্রাধিকার, সময় ও খরচসহ ফোকাসড প্ল্যান',
                    '3️⃣ Execute — পরিষ্কার যোগাযোগের মাধ্যমে কাজ সম্পন্ন',
                    '4️⃣ Improve — ফলাফল রিভিউ করে সেরা পরবর্তী ধাপ',
                    '⏱️ ছোট কাজ ১–৩ দিন · SEO প্যাকেজ ১৫–৩০ দিন · ওয়েবসাইট ২–৪ সপ্তাহ'
                ],
                links: [
                    { label: '🗓️ ফ্রি কনসালটেশন', href: PAGE.contact },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Prices
        if (hasBn(text, ['দাম', 'দাম কত', 'কত টাকা', 'মূল্য', 'প্রাইস', 'প্যাকেজ', 'খরচ', 'কত নেবেন',
                         'বাজেট', 'টাকা', 'রেট', 'কত করে', 'কত লাগবে', 'কত নেন', 'কত দাম']) ||
            anyHit(t, ['koto taka', 'taka koto', 'koto', 'price', 'pricing', 'cost', 'taka', 'rate', 'package'])) {
            return {
                text: 'প্যাকেজের দাম (শুরু মূল্য — বাংলাদেশে টাকায়, আন্তর্জাতিক ক্লায়েন্টদের ডলারে):',
                list: [
                    '📦 SEO Starter — ৳৮,০০০ / $90',
                    '📦 SEO Growth — ৳১৮,০০০ / $200',
                    '📦 কাস্টম ওয়েবসাইট — ৳৩০,০০০ / $350',
                    '📦 লিড জেনারেশন — ৳৭,০০০ / $80',
                    '📦 Paid Advertising — ৳৮,০০০ / $90',
                    '📦 Digital Growth (মাসিক) — ৳৩৫,০০০ / $400',
                    '🔍 SEO Audit — $25 থেকে · 🎨 লোগো — $25 · 🎓 ট্রেনিং — $30/সেশন থেকে',
                    '💳 পেমেন্ট: bKash, Nagad, Rocket, ব্যাংক ট্রান্সফার'
                ],
                links: [
                    { label: '📋 সম্পূর্ণ দাম', href: PAGE.pricing },
                    { label: '🛠️ সার্ভিস', href: PAGE.services },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Payment
        if (hasBn(text, ['পেমেন্ট', 'বিকাশ', 'নগদ', 'রকেট', 'পেমেন্ট পদ্ধতি', 'কিভাবে টাকা দেব', 'অগ্রিম'])) {
            return {
                text: 'পেমেন্ট পদ্ধতি:',
                list: [
                    '🇧🇩 বাংলাদেশ: bKash, Nagad, Rocket ও ব্যাংক ট্রান্সফার',
                    '🌍 আন্তর্জাতিক: Wise, PayPal ও ব্যাংক ট্রান্সফার',
                    '🗓️ বড় প্রজেক্টে সাধারণত অগ্রিম + ডেলিভারিতে চূড়ান্ত পেমেন্ট'
                ],
                links: [
                    { label: '📋 দাম', href: PAGE.pricing },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Contact
        if (hasBn(text, ['যোগাযোগ', 'ফোন', 'নাম্বার', 'নম্বর', 'ইমেইল', 'হোয়াটসঅ্যাপ', 'হোয়াটসাপ',
                         'ঠিকানা', 'কোথায়', 'কোথা', 'মোবাইল', 'কল', 'কন্টাক্ট', 'হোয়াটসঅ্যাপ নাম্বার'])) {
            return {
                text: 'যোগাযোগের মাধ্যম — সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই:',
                list: [
                    '📞 ফোন / WhatsApp: +880 1701-059499',
                    '✉️ ইমেইল: ' + CONTACT.email,
                    '📍 ঠিকানা: খুলনা, বাংলাদেশ (বিশ্বজুড়ে রিমোট কাজ)',
                    '🌐 Facebook: facebook.com/Prosengit95',
                    '💼 LinkedIn: linkedin.com/in/prosengitkundu'
                ],
                links: [
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact পেজ', href: PAGE.contact }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Free
        if (hasBn(text, ['ফ্রি', 'বিনামূল্যে', 'বিনা মূল্যে', 'ফ্রি কনসালটেশন', 'ফ্রি চেক', 'ট্রায়াল'])) {
            return {
                text: 'শুরু করার দুটি ফ্রি উপায় আছে:',
                list: [
                    '🎁 ফ্রি ডিজিটাল গ্রোথ চেক — ওয়েবসাইট + লক্ষ্যের মিনি অ্যানালাইসিস ও SEO পরামর্শ',
                    '🗓️ ফ্রি ১৫-মিনিট কনসালটেশন — কোনো চাপ ছাড়াই প্রকল্প নিয়ে আলোচনা'
                ],
                links: [
                    { label: '🎁 ফ্রি অ্যানালাইসিস', href: PAGE.contact },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: ['📅 ফ্রি কল বুক করুন', '💰 দাম', '📞 যোগাযোগ']
            };
        }

        // Blog
        if (hasBn(text, ['ব্লগ', 'আর্টিকেল', 'লেখা', 'পোস্ট', 'টিপস', 'গাইড', 'পড়তে', 'পড়বো'])) {
            return {
                text: 'আমার ব্লগে প্র্যাকটিক্যাল আর্টিকেল আছে — SEO, অ্যাড, লিড জেনারেশন ও ডিজিটাল মার্কেটিং নিয়ে:',
                list: [
                    '📰 কোনো ফালতু কথা ছাড়া কার্যকরী গাইড',
                    '🔍 বাস্তব ক্লায়েন্ট কাজের অভিজ্ঞতা থেকে লেখা'
                ],
                links: [
                    { label: '📰 ব্লগ দেখুন', href: PAGE.blog },
                    { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        // Fallback
        return {
            text: 'দুঃখিত, এই প্রশ্নের সঠিক উত্তর আমার কাছে নেই — তবে সার্ভিস, দাম, প্যাকেজ, কাজের ধরন বা যোগাযোগ নিয়ে প্রশ্ন করুন। অথবা সরাসরি WhatsApp-এ মেসেজ করুন। 😊',
            links: [
                { label: '🛠️ সার্ভিস', href: PAGE.services },
                { label: '📋 দাম', href: PAGE.pricing },
                { label: '❓ FAQ', href: PAGE.faq },
                { label: '💬 WhatsApp', href: CONTACT.whatsapp, wa: true }
            ],
            chips: MENU_CHIPS_BN
        };
    }

    /* ----------------------------------------------------------------------
       "Book a free call" guided flow (no backend — hands off to WhatsApp)
       ---------------------------------------------------------------------- */
    var booking = null;

    var BOOKING_EN = ['book a call', 'book a consultation', 'book a meeting', 'book a session',
                      'book a demo', 'book a chat', 'schedule a call', 'schedule a meeting',
                      'set up a call', 'set up a meeting', 'reserve a call', 'discovery call',
                      'demo call', 'free call', 'zoom call', 'video call', 'book an appointment',
                      'call appointment', 'book', 'booking', 'appointment', 'appointments',
                      'schedule', 'scheduling', 'reschedule'];

    var BOOKING_BN = ['কল বুক', 'বুক করব', 'বুক করবো', 'বুক করুন', 'অ্যাপয়েন্টমেন্ট', 'মিটিং',
                      'ফ্রি কল', 'কল করব', 'কথা বলব', 'কথা বলবো', 'কথা বল', 'কনসালটেশন', 'সাক্ষাৎ',
                      'সময় দিন', 'কল কনফার্ম', 'কল সেট', 'কল চাই', 'মিটিং চাই'];

    function isBookingTrigger(raw) {
        if (anyHit(normalize(raw), BOOKING_EN)) return true;
        var low = String(raw).toLowerCase();
        return hasBn(low, BOOKING_BN);
    }

    function startBooking(lang) {
        booking = { topic: null, channel: null, lang: lang };
        if (lang === 'bn') {
            return {
                text: 'দারুণ! একটা ফ্রি কল সেট করি 📅 — কী নিয়ে কথা বলতে চান?',
                chips: ['🔍 SEO', '📢 Google/Meta Ads', '🌐 ওয়েবসাইট', '👥 লিড জেনারেশন', '🎨 ডিজাইন', '🎓 ট্রেনিং / অন্যান্য']
            };
        }
        return {
            text: 'Great — let\u2019s set up a free call! 📅 What would you like to talk about?',
            chips: ['🔍 SEO', '📢 Google / Meta Ads', '🌐 Website', '👥 Lead Generation', '🎨 Design', '🎓 Training / Other']
        };
    }

    function matchTopic(raw) {
        var t = expandShort(normalize(raw));
        var low = String(raw).toLowerCase();
        if (anyHit(t, ['seo', 'search', 'rank', 'keyword', 'organic', 'audit']) || hasBn(low, ['এসইও', 'এস ই ও', 'এস.ই.ও'])) return 'SEO';
        if (anyHit(t, ['ad', 'ads', 'google ads', 'facebook', 'instagram', 'meta', 'campaign', 'ppc', 'paid', 'youtube']) || hasBn(low, ['বিজ্ঞাপন', 'অ্যাড'])) return 'Google / Meta Ads';
        if (anyHit(t, ['website', 'web', 'site', 'wordpress', 'landing', 'ecommerce', 'e-commerce', 'cms', 'redesign']) || hasBn(low, ['ওয়েবসাইট'])) return 'Website';
        if (anyHit(t, ['lead', 'leads', 'prospect', 'database', 'b2b', 'b2c']) || hasBn(low, ['লিড'])) return 'Lead Generation';
        if (anyHit(t, ['logo', 'design', 'graphic', 'thumbnail', 'brochure', 'banner', 'poster']) || hasBn(low, ['ডিজাইন', 'লোগো'])) return 'Design';
        if (anyHit(t, ['training', 'train', 'course', 'learn', 'teach', 'consult', 'consultation', 'mentor']) || hasBn(low, ['ট্রেনিং', 'শেখা'])) return 'Training';
        return 'Digital Marketing (general)';
    }

    function matchChannel(raw) {
        var t = expandShort(normalize(raw));
        var low = String(raw).toLowerCase();
        if (anyHit(t, ['whatsapp', 'whats', 'whats app']) || hasBn(low, ['হোয়াটসঅ্যাপ', 'হোয়াটসাপ'])) return 'WhatsApp';
        if (anyHit(t, ['meet', 'zoom', 'video', 'online', 'google meet']) || hasBn(low, ['মিট', 'জুম', 'ভিডিও'])) return 'Google Meet / Zoom';
        if (anyHit(t, ['phone', 'call', 'mobile']) || hasBn(low, ['ফোন', 'মোবাইল'])) return 'Phone call';
        if (anyHit(t, ['chat', 'here', 'message', 'text']) || hasBn(low, ['চ্যাট', 'এখানে'])) return 'Chat here';
        return 'WhatsApp';
    }

    var TOPIC_BN = {
        'SEO': 'SEO',
        'Google / Meta Ads': 'Google / Meta Ads',
        'Website': 'ওয়েবসাইট',
        'Lead Generation': 'লিড জেনারেশন',
        'Design': 'ডিজাইন',
        'Training': 'ট্রেনিং',
        'Digital Marketing (general)': 'ডিজিটাল মার্কেটিং'
    };

    var CHANNEL_BN = {
        'WhatsApp': 'WhatsApp',
        'Google Meet / Zoom': 'Google Meet / Zoom',
        'Phone call': 'ফোন কল',
        'Chat here': 'চ্যাট'
    };

    function handleBookingReply(raw) {
        var bn = booking.lang === 'bn';

        if (!booking.topic) {
            booking.topic = matchTopic(raw);
            var topicBn = bn ? (TOPIC_BN[booking.topic] || booking.topic) : booking.topic;
            if (bn) {
                return {
                    text: 'বুঝেছি — ' + topicBn + '। কোন মাধ্যমে কথা বলতে স্বাচ্ছন্দ্যবোধ করবেন?',
                    chips: ['💬 WhatsApp কল', '🎥 Google Meet / Zoom', '📞 ফোন কল', '💬 এখানে চ্যাট']
                };
            }
            return {
                text: 'Got it — ' + topicBn + '. Which channel works best for you?',
                chips: ['💬 WhatsApp call', '🎥 Google Meet / Zoom', '📞 Phone call', '💬 Just chat here']
            };
        }

        var channel = matchChannel(raw);
        var topicLabel = booking.topic;
        var channelLabel = channel;
        booking = null;

        if (channel === 'Chat here') {
            if (bn) {
                return { text: 'ঠিক আছে! 😊 সার্ভিস, দাম — যেকোনো প্রশ্ন এখানেই করুন।', chips: MENU_CHIPS_BN };
            }
            return { text: 'No problem! 😊 Ask me anything right here — services, prices, or anything else.', chips: MENU_CHIPS };
        }

        if (bn) {
            topicLabel = TOPIC_BN[topicLabel] || topicLabel;
            channelLabel = CHANNEL_BN[channel] || channel;
        }

        var wa = CONTACT.whatsapp + '?text=' + encodeURIComponent(
            bn
                ? 'আসসালামু আলাইকুম, আমি একটা ফ্রি কল বুক করতে চাই — বিষয়: ' + topicLabel + ' (' + channelLabel + ')'
                : "Hi Prosengit, I'd like to book a free call about " + topicLabel + ' (' + channelLabel + ').'
        );

        if (bn) {
            return {
                text: 'চমৎকার! আপনার বুকিংয়ের সারসংক্ষেপ:',
                list: [
                    '🎯 বিষয়: ' + topicLabel,
                    '📞 মাধ্যম: ' + channelLabel,
                    '⏱️ সময়সীমা: ১৫ মিনিট (ফ্রি)',
                    '📅 সময় বাছাই করুন — ২৪ ঘণ্টার মধ্যে কনফার্ম করব'
                ],
                links: [
                    { label: '💬 WhatsApp-এ বুকিং পাঠান', href: wa, wa: true },
                    { label: '📩 অথবা contact ফর্ম ব্যবহার করুন', href: PAGE.contact }
                ],
                chips: MENU_CHIPS_BN
            };
        }

        return {
            text: 'Perfect! Here\u2019s your summary:',
            list: [
                '🎯 Topic: ' + topicLabel,
                '📞 Channel: ' + channelLabel,
                '⏱️ Duration: 15 minutes (free)',
                '📅 Pick a time and I\u2019ll confirm within 24 hours'
            ],
            links: [
                { label: '💬 Send booking on WhatsApp', href: wa, wa: true },
                { label: '📩 Or use the contact form', href: PAGE.contact }
            ],
            chips: MENU_CHIPS
        };
    }

    /* ----------------------------------------------------------------------
       Site index — full-text fallback
       If no intent matches, the bot searches these page/section summaries so
       it can still answer about (almost) anything on the website and always
       points the visitor to the right page.
       ---------------------------------------------------------------------- */
    var SITE_DOCS = [
        { title: 'Home page', href: PAGE.home, kw: ['home', 'homepage', 'main page', 'front page', 'hero', 'landing of the site'],
          text: 'The home page introduces Prosengit Kundu as a digital marketing expert, shows his 8+ years experience, 1,850+ trained students and 96+ helped brands, highlights services, packages, portfolio and blog, and links to the contact form and WhatsApp.' },
        { title: 'About page', href: PAGE.about, kw: ['about', 'journey', 'story', 'biography', 'bio', 'mission', 'vision', 'positioning', 'who is prosengit', 'background'],
          text: 'The About page covers Prosengit Kundu Utshob, a Digital Marketing Expert & SEO Specialist from Khulna, Bangladesh: his journey from graphic designer to digital marketer, positioning, mission and vision, career timeline and services.' },
        { title: 'Services page', href: PAGE.services, kw: ['services', 'what do you do', 'offer', 'capabilities', 'solutions', 'digital marketing services', 'graphic design services', 'website services', 'training services'],
          text: 'The Services page lists every service with starting prices and delivery times: SEO, paid ads, lead generation, graphic design, custom-coded websites and training/consultation, plus the 4-step working process.' },
        { title: 'Pricing page', href: PAGE.pricing, kw: ['pricing', 'price list', 'packages', 'cost', 'how much', 'rates', 'budget', 'quote', 'custom package'],
          text: 'The Pricing page shows the six starting packages (SEO Starter, SEO Growth, Custom Website, Lead Generation, Paid Advertising, Digital Growth), the full individual price list, pricing FAQ and how to request a custom package.' },
        { title: 'Portfolio page', href: PAGE.portfolio, kw: ['portfolio', 'work', 'projects', 'case study', 'samples', 'web development work', 'seo work', 'lead generation work', 'paid ads work', 'design work'],
          text: 'The Portfolio page presents case studies across Web Development, SEO, Lead Generation, Paid Ads and Graphic Design — each with the goal, process, tools and deliverables. Demo/concept items are clearly labelled.' },
        { title: 'Blog', href: PAGE.blog, kw: ['blog', 'articles', 'posts', 'guides', 'insights', 'reading', 'learn', 'how to', 'tips'],
          text: 'The blog has 21 practical articles on SEO, keyword research, paid ads, lead generation, web development and website optimization — checklists, comparisons and frameworks you can act on.' },
        { title: 'Testimonials page', href: PAGE.testimonials, kw: ['testimonials', 'reviews', 'feedback', 'client feedback', 'what clients say', 'share experience', 'review policy'],
          text: 'The Testimonials page shares client and learner feedback across SEO, ads, web development, lead generation and training. Reviews are published word-for-word with permission, and there is a form to share your own experience.' },
        { title: 'FAQ page', href: PAGE.faq, kw: ['faq', 'frequently asked questions', 'common questions', 'questions', 'doubts', 'answers'],
          text: 'The FAQ page answers common questions organized by topic: services and scope, SEO, web development, paid ads, lead generation, pricing, and the working process.' },
        { title: 'Contact page', href: PAGE.contact, kw: ['contact', 'get in touch', 'reach', 'phone', 'email', 'whatsapp', 'form', 'address', 'location', 'hours', 'map'],
          text: 'The Contact page has the phone number +880 1701-059499, email Prosengit95@gmail.com, location Khulna Bangladesh, business hours (Saturday–Thursday 10:00 AM–8:00 PM BST), the contact form and a Google Maps link.' },
        { title: 'Thank-you page', href: PAGE.thankYou, kw: ['thank you page', 'after submitting', 'form submitted', 'confirmation', 'message sent'],
          text: 'After you submit the contact form you are taken to the Thank-you page, which confirms your message was received and explains the next steps.' },
        { title: 'Terms & Conditions', href: PAGE.terms, kw: ['terms', 'terms and conditions', 'scope of work', 'payment terms', 'client responsibilities', 'agreement', 'contract'],
          text: 'The Terms page describes how projects work: written scope, payment terms (advance + final payment), timelines, revisions and client responsibilities.' },
        { title: 'Privacy Policy', href: PAGE.privacy, kw: ['privacy', 'privacy policy', 'data', 'cookies', 'personal data', 'gdpr', 'tracking', 'local storage'],
          text: 'The Privacy Policy explains that the site collects no data beyond what you voluntarily submit, sets no advertising or tracking cookies, and notes third-party CDN usage.' },
        { title: 'Disclaimer', href: PAGE.disclaimer, kw: ['disclaimer', 'legal', 'liability', 'no guarantee', 'work samples policy', 'testimonial policy', 'results'],
          text: 'The Disclaimer states the site content is for general information and education, that no specific marketing/ranking/sales result is promised, and explains the labelling of demo work and sample testimonials.' },
        { title: 'Custom packages / quote', href: PAGE.pricing, kw: ['custom package', 'custom quote', 'customized package', 'bespoke', 'tailored', 'combination', 'combine services'],
          text: 'Custom packages are available — describe your goal, budget and scope and Prosengit will suggest the most practical combination and price it honestly. Every quote is confirmed in writing.' },
        { title: 'Free growth check & consultation', href: PAGE.contact, kw: ['free check', 'free analysis', 'free consultation', 'free growth check', 'free audit', '15 minute', '15-minute'],
          text: 'There are two free ways to start: a Free Digital Growth Check (mini SEO analysis of your website and goals) and a free 15-minute consultation to talk through your project.' },
        { title: 'SEO services detail', href: PAGE.services, kw: ['seo audit', 'keyword research', 'on-page seo', 'technical seo', 'local seo', 'google business profile', 'full seo', 'serp', 'competitor analysis'],
          text: 'SEO services include audits, keyword research, SERP analysis, on-page, technical and local SEO, Google Business Profile optimization, competitor analysis and monthly full SEO — with honest result timelines.' },
        { title: 'Paid ads detail', href: PAGE.services, kw: ['google ads', 'meta ads', 'facebook ads', 'instagram ads', 'youtube ads', 'social media management', 'campaign', 'ad budget'],
          text: 'Paid advertising covers Google Ads (search, display, YouTube), Meta Ads (Facebook & Instagram) and social media management. The ad budget is always separate and paid by you directly to Google or Meta.' },
        { title: 'Web development detail', href: PAGE.services, kw: ['custom website', 'landing page', 'html website', 'javascript website', 'wordpress website', 'speed optimization', 'responsive', 'website redesign', 'search console setup', 'analytics setup'],
          text: 'Web development is custom-code-first: hand-written HTML, CSS and vanilla JavaScript, responsive and SEO-friendly. Landing pages, business sites, portfolio sites, WordPress, speed optimization and Google Search Console/Analytics setup are all available.' },
        { title: 'Lead generation detail', href: PAGE.services, kw: ['lead generation', 'b2b', 'b2c', 'lead list', 'prospect research', 'database', 'email list', 'data cleaning', 'verification'],
          text: 'Lead generation delivers verified, outreach-ready prospect lists: LinkedIn and Google Maps research, verified emails and phones, decision-maker titles, data cleaning and organized delivery.' },
        { title: 'Graphic design detail', href: PAGE.services, kw: ['logo', 'brand identity', 'business card', 'flyer', 'poster', 'banner', 'social media post', 'thumbnail', 'brochure', 'company profile', 'photoshop', 'illustrator'],
          text: 'Graphic design includes logos, brand identity kits, business cards, flyers, posters, banners, social media posts, YouTube thumbnails, brochures and company profiles.' },
        { title: 'Training & consultation detail', href: PAGE.services, kw: ['training', 'consultation', 'course', 'workshop', 'coaching', 'institution', 'institute', 'youth development', 'technical training center', 'aricho'],
          text: 'Training covers SEO, ads, lead generation, web development, WordPress, database management and freelancing for individuals, teams and institutions. Prosengit trained at the Department of Youth Development Khulna, Technical Training Center Khulna and ARICHO IT.' },
        { title: 'Languages', href: PAGE.about, kw: ['language', 'languages', 'bangla', 'bengali', 'hindi', 'english', 'speak'],
          text: 'Prosengit communicates in Bangla, English and Hindi.' },
        { title: 'Payments', href: PAGE.pricing, kw: ['payment', 'pay', 'bikash', 'bkash', 'nagad', 'rocket', 'paypal', 'wise', 'bank transfer', 'deposit', 'milestone', 'invoice'],
          text: 'Bangladesh clients can pay via bKash, Nagad, Rocket and bank transfer; international clients via Wise, PayPal and bank transfer. Larger projects use an advance plus final payment on delivery.' },
        { title: 'Working hours & availability', href: PAGE.contact, kw: ['hours', 'working hours', 'availability', 'available', 'time zone', 'timezone', 'response time', 'open hours', 'business hours', 'reply'],
          text: 'Business hours are Saturday–Thursday 10:00 AM–8:00 PM Bangladesh Standard Time. Prosengit replies within 24 hours and schedules international calls around your timezone.' },
        { title: 'Website owner / domain', href: PAGE.home, kw: ['owner', 'whose website', 'this site', 'this website', 'domain', 'prosengitkundu.top', 'site owner', 'who built this site'],
          text: 'This is prosengitkundu.top, the official portfolio and services website of Prosengit Kundu — Digital Marketing Expert, SEO Specialist and custom web developer based in Khulna, Bangladesh.' }
    ];

    function searchSite(raw) {
        var text = expandShort(normalize(raw));
        var qtokens = [];
        var arr = text.split(' ');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length > 2) qtokens.push(arr[i]);
        }
        if (qtokens.length === 0) return null;

        var best = null, bestScore = 0;
        for (var d = 0; d < SITE_DOCS.length; d++) {
            var doc = SITE_DOCS[d];
            var score = 0;
            var hits = 0;
            for (var k = 0; k < doc.kw.length; k++) {
                if (hit(text, doc.kw[k])) {
                    hits++;
                    score += doc.kw[k].indexOf(' ') !== -1 ? 6 : 4;
                }
            }
            var dtext = normalize(doc.text);
            for (var t = 0; t < qtokens.length; t++) {
                if (wholeWord(dtext, qtokens[t])) score += 1;
            }
            if (hits > 0 || score >= 2) {
                if (score > bestScore) {
                    bestScore = score;
                    best = doc;
                }
            }
        }
        if (!best) return null;

        var snippet = best.text;
        if (snippet.length > 260) snippet = snippet.slice(0, 257) + '…';
        return {
            title: best.title,
            href: best.href,
            snippet: snippet
        };
    }

    /* ----------------------------------------------------------------------
       Matching engine
       ---------------------------------------------------------------------- */
    function scoreIntent(intent, text) {
        var hits = 0;
        var score = intent.weight || 0;

        if (intent.topics) {
            var topicHit = false;
            for (var i = 0; i < intent.topics.length; i++) {
                if (hit(text, intent.topics[i])) {
                    topicHit = true;
                    hits++;
                    score += intent.topics[i].indexOf(' ') !== -1 ? 3 : 1;
                    break; // one matching topic is enough
                }
            }
            if (!topicHit) return -1;
        }

        var anyHits = 0;
        if (intent.any) {
            for (var j = 0; j < intent.any.length; j++) {
                if (hit(text, intent.any[j])) {
                    anyHits++;
                    hits++;
                    score += intent.any[j].indexOf(' ') !== -1 ? 2 : 1;
                }
            }
        }

        if (intent.requireAny && anyHits === 0) return -1;
        if (hits === 0) return -1;
        return score;
    }

    function debugReply(raw) {
        var text = normalize(raw);
        var expanded = expandShort(text);
        var wantsPrice = anyHit(expanded, PRICE_WORDS);
        var isServiceProbe = anyHit(expanded, SERVICE_PROBE);
        var best = null, bestScore = -1;
        for (var k = 0; k < INTENTS.length; k++) {
            var s = scoreIntent(INTENTS[k], expanded);
            if (s > bestScore) { bestScore = s; best = INTENTS[k]; }
        }
        var blogBest = null, blogScore = -1;
        if (!wantsPrice && !isServiceProbe) {
            for (var b = 0; b < BLOG_TOPICS.length; b++) {
                var sb = scoreIntent(BLOG_TOPICS[b], expanded);
                if (sb > blogScore) { blogScore = sb; blogBest = BLOG_TOPICS[b]; }
            }
        }
        return { raw: raw, text: text, expanded: expanded, isBangla: isBangla(raw),
                 wantsPrice: wantsPrice, isServiceProbe: isServiceProbe,
                 bestId: best && best.id, bestScore: bestScore,
                 blogId: blogBest && blogBest.id, blogScore: blogScore };
    }

    function getReply(raw) {
        var text = normalize(raw);

        // Bangla (বাংলা) visitors get Bangla answers
        if (isBangla(raw)) return getReplyBn(raw);

        // Small talk
        if (anyHit(text, ['good morning', 'good afternoon', 'good evening', 'assalamu alaikum', 'assalamualaikum']) ||
            anyHit(text, ['hello', 'hi', 'hey', 'salam', 'assalamu', 'assalam', 'namaste', 'hola', 'yo', 'greetings', 'sup'])) {
            return {
                text: 'Hello! 👋 I\u2019m Prosengit Kundu\u2019s assistant. Ask me anything about his services, skills, prices, packages, experience, portfolio or how to get in touch — even in short form. What would you like to know?',
                chips: MENU_CHIPS
            };
        }

        if (!anyHit(text, ['thank you page', 'after submitting', 'form submitted', 'confirmation page', 'message sent']) &&
            anyHit(text, ['thank', 'thanks', 'thx', 'thnx', 'ty', 'tq', 'tnx', 'dhanyabad', 'dhonnobad', 'shukriya', 'appreciate', 'appreciated'])) {
            return {
                text: 'You\u2019re very welcome! 😊 If you\u2019d like to talk details, feel free to message on WhatsApp or use the contact page.',
                links: [
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true },
                    { label: '📩 Contact page', href: PAGE.contact }
                ],
                chips: MENU_CHIPS
            };
        }

        if (anyHit(text, ['see you', 'talk later', 'take care', 'khoda hafez', 'good night', 'see ya']) ||
            anyHit(text, ['bye', 'goodbye', 'farewell', 'cya', 'tata', 'later'])) {
            return {
                text: 'Thanks for stopping by! 👋 If any other question comes up, I\u2019m right here.',
                chips: MENU_CHIPS
            };
        }

        if (anyHit(text, ['what can you do', 'what can i ask', 'what can you answer', 'start over', 'main menu', 'menu']) ||
            anyHit(text, ['help', 'options', 'commands', 'restart'])) {
            return {
                text: 'I can help with things like:',
                list: [
                    '🛠️ What services does Prosengit offer?',
                    '🧠 What are his skills?',
                    '💰 How much does SEO / a website / ads / design cost?',
                    '📦 What packages are available?',
                    '👤 Who is Prosengit Kundu?',
                    '⏱️ How long does a project take?',
                    '📞 How do I contact him?'
                ],
                chips: MENU_CHIPS
            };
        }

        var expanded = expandShort(text);
        var wantsPrice = anyHit(expanded, PRICE_WORDS);
        var isServiceProbe = anyHit(expanded, SERVICE_PROBE);

        // Knowledge-base matching
        var best = null;
        var bestScore = -1;
        for (var k = 0; k < INTENTS.length; k++) {
            var s = scoreIntent(INTENTS[k], expanded);
            if (s > bestScore) {
                bestScore = s;
                best = INTENTS[k];
            }
        }

        // Blog topic matching (informational questions; skipped when asking price
        // or clearly asking for a service)
        if (!wantsPrice && !isServiceProbe) {
            for (var b = 0; b < BLOG_TOPICS.length; b++) {
                var sb = scoreIntent(BLOG_TOPICS[b], expanded);
                if (sb > bestScore) {
                    bestScore = sb;
                    best = BLOG_TOPICS[b];
                }
            }
        }

        if (best) return best.answer;

        // Full-text site search fallback
        var found = searchSite(raw);
        if (found) {
            return {
                text: 'Here\u2019s what I found on this site about that:',
                list: [found.snippet],
                links: [
                    { label: '📄 ' + found.title, href: found.href },
                    { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
                ],
                chips: MENU_CHIPS
            };
        }

        // Fallback
        return {
            text: 'Hmm, I\u2019m not 100% sure about that one — but I can point you to the right place. You can also ask me about services, skills, prices, packages, the working process or contact details. 😊',
            links: [
                { label: '🛠️ Services', href: PAGE.services },
                { label: '📋 Pricing', href: PAGE.pricing },
                { label: '❓ FAQ', href: PAGE.faq },
                { label: '💬 WhatsApp me', href: CONTACT.whatsapp, wa: true }
            ],
            chips: MENU_CHIPS
        };
    }

    /* ----------------------------------------------------------------------
       DOM / UI
       ---------------------------------------------------------------------- */
    var panel, messagesEl, inputEl, launcher;

    function buildUI() {
        launcher = document.createElement('button');
        launcher.type = 'button';
        launcher.className = 'pk-chatbot-launcher';
        launcher.setAttribute('aria-label', 'Chat with Prosengit Kundu');
        launcher.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
            '</svg>' +
            '<span class="pk-chatbot-launcher__dot"></span>';
        document.body.appendChild(launcher);

        panel = document.createElement('div');
        panel.className = 'pk-chatbot';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Chat assistant');
        panel.innerHTML =
            '<div class="pk-chatbot__header">' +
                '<span class="pk-chatbot__avatar-wrap">' +
                    '<span class="pk-chatbot__avatar-init">PK</span>' +
                    '<img class="pk-chatbot__avatar" src="' + esc(CONTACT.avatar) + '" alt="">' +
                '</span>' +
                '<div class="pk-chatbot__id">' +
                    '<div class="pk-chatbot__name">' + esc(CONTACT.name) + '</div>' +
                    '<div class="pk-chatbot__status">Online · replies instantly</div>' +
                '</div>' +
                '<button type="button" class="pk-chatbot__close" aria-label="Close chat">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
                '</button>' +
            '</div>' +
            '<div class="pk-chatbot__body"></div>' +
            '<div class="pk-chatbot__input">' +
                '<input type="text" placeholder="Type your question…" autocomplete="off">' +
                '<button type="button" class="pk-chatbot__send" aria-label="Send">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>' +
                '</button>' +
            '</div>' +
            '<div class="pk-chatbot__foot">Ask Prosengit · automated assistant · for a live chat, tap WhatsApp</div>';
        document.body.appendChild(panel);

        messagesEl = panel.querySelector('.pk-chatbot__body');
        inputEl = panel.querySelector('input');

        var avatar = panel.querySelector('.pk-chatbot__avatar');
        avatar.addEventListener('error', function () {
            avatar.style.display = 'none';
        });

        launcher.addEventListener('click', toggle);
        panel.querySelector('.pk-chatbot__close').addEventListener('click', close);
        panel.querySelector('.pk-chatbot__send').addEventListener('click', function () { send(); });
        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') send();
        });
    }

    function scrollDown() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addUserMessage(text) {
        var div = document.createElement('div');
        div.className = 'pk-msg pk-msg--user';
        div.textContent = text;
        messagesEl.appendChild(div);
        scrollDown();
    }

    function addBotMessage(answer) {
        var div = document.createElement('div');
        div.className = 'pk-msg pk-msg--bot';

        var html = '';
        if (answer.text) html += '<p>' + esc(answer.text) + '</p>';
        if (answer.list && answer.list.length) {
            html += '<ul>' + answer.list.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>';
        }
        if (answer.links && answer.links.length) {
            html += '<p>' + answer.links.map(linkHtml).join(' ') + '</p>';
        }
        div.innerHTML = html;
        messagesEl.appendChild(div);
        scrollDown();

        if (answer.chips && answer.chips.length) {
            window.setTimeout(function () { addChips(answer.chips); }, 250);
        }
    }

    function addChips(chips) {
        var row = document.createElement('div');
        row.className = 'pk-chips';
        chips.forEach(function (label) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'pk-chip';
            b.textContent = label;
            b.addEventListener('click', function () { send(label); });
            row.appendChild(b);
        });
        messagesEl.appendChild(row);
        scrollDown();
    }

    function showTyping() {
        var t = document.createElement('div');
        t.className = 'pk-typing';
        t.id = 'pkTyping';
        t.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(t);
        scrollDown();
    }

    function hideTyping() {
        var t = document.getElementById('pkTyping');
        if (t && t.parentNode) t.parentNode.removeChild(t);
    }

    function send(text) {
        if (text === undefined) {
            text = inputEl.value.trim();
            if (!text) return;
            inputEl.value = '';
        }
        addUserMessage(text);
        showTyping();

        window.setTimeout(function () {
            hideTyping();
            var reply;
            if (booking) {
                reply = handleBookingReply(text);
            } else if (isBookingTrigger(text)) {
                reply = startBooking(isBangla(text) ? 'bn' : 'en');
            } else {
                reply = getReply(text);
            }
            addBotMessage(reply);
        }, 600 + Math.random() * 350);
    }

    function open() {
        panel.classList.add('is-open');
        launcher.setAttribute('aria-expanded', 'true');
        inputEl.focus();
    }

    function close() {
        panel.classList.remove('is-open');
        launcher.setAttribute('aria-expanded', 'false');
    }

    function toggle() {
        if (panel.classList.contains('is-open')) close();
        else open();
    }

    function init() {
        buildUI();

        var greeted = false;
        launcher.addEventListener('click', function () {
            if (!greeted) {
                greeted = true;
                window.setTimeout(function () {
                    addBotMessage({
                        text: 'Hi there! 👋 I\u2019m Prosengit Kundu\u2019s assistant. Ask me anything about his services, skills, prices, packages, experience or how to get in touch — short questions are fine too.',
                        chips: MENU_CHIPS
                    });
                }, 400);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.PkChatbot = {
        open: open,
        close: close,
        toggle: toggle,
        send: send,
        _getReply: getReply,              // exposed for testing / custom integrations
        _getReplyBn: getReplyBn,
        _isBangla: isBangla,
        _isBookingTrigger: isBookingTrigger,
        _startBooking: startBooking,
        _handleBookingReply: handleBookingReply,
        _searchSite: searchSite,
        _expandShort: expandShort,
        _debug: debugReply,
        _hit: hit,
        _wordMatch: wordMatch,
        _dist: dist
    };
})();
