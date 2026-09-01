/* ===========================================================================
   CMS Frontend Hydration — Prosengit Kundu
   ---------------------------------------------------------------------------
   Loaded on every public page. Fetches content from the CMS API and updates
   the existing DOM in place. The HTML/CSS design, layout, animations and SEO
   structure are preserved — this script only swaps in the content stored in
   the database.

   Progressive enhancement: if the API is unreachable, the page keeps its
   built-in fallback content, so nothing ever breaks.
   =========================================================================== */
(function () {
  'use strict';
  if (!window.fetch) return;

  var API = '';
  var PAGE = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0];

  function q(s, root) { return (root || document).querySelector(s); }
  function qa(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
  function setText(sel, text, root) { if (text == null || text === '') return; var el = q(sel, root); if (el) el.textContent = text; }
  function setHref(sel, href, root) { if (!href) return; var el = q(sel, root); if (el) el.setAttribute('href', href); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function get(path) { return fetch(API + path, { credentials: 'same-origin' }).then(function (r) { return r.json().then(function (d) { if (!d.success) throw new Error(d.error); return d.data; }); }); }
  function safe(fn) { try { fn(); } catch (e) { /* never break the page */ } }
  function initials(name) { return (name || '').split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function colorFor(name) {
    var colors = ['#0A66C2', '#DB2777', '#16A34A', '#F59E0B', '#7C3AED'];
    var sum = 0; for (var i = 0; i < (name || '').length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  }

  /* ---------------- Settings / nav / hero (all pages) ---------------- */
  function applySettings(s) {
    setText('.brand__name', s.site_name);
    setText('.brand__role', s.site_tagline);
    setText('.footer-brand__name', s.site_name);
    setText('.footer-brand__role', s.site_tagline);
    setText('.brand__mark', s.logo_text || 'PK');
    setText('.footer-brand__mark', s.logo_text || 'PK');

    setText('.site-footer__about', s.footer_about);
    var foot = q('.site-footer__bottom');
    if (foot && s.copyright) {
      var cp = q('.site-footer__bottom > div', foot);
      if (cp) cp.textContent = '\u00A9 ' + new Date().getFullYear() + ' ' + s.copyright + '. All rights reserved.';
    }

    setHref('a[href^="tel:"]', s.phone_href || ('tel:' + (s.phone || '')));
    setHref('a[href^="mailto:"]', 'mailto:' + (s.email || ''));
    setHref('a[href^="https://wa.me"]', s.whatsapp);
    setHref('a[href^="https://api.whatsapp.com"]', s.whatsapp);

    qa('.site-footer__links a').forEach(function (a) {
      if (a.getAttribute('href') && a.getAttribute('href').indexOf('tel:') === 0) a.textContent = s.phone || a.textContent;
      if (a.getAttribute('href') && a.getAttribute('href').indexOf('mailto:') === 0) a.textContent = s.email || a.textContent;
      if (a.getAttribute('href') && a.getAttribute('href').indexOf('https://wa.me') === 0) a.textContent = 'WhatsApp chat';
      if (a.getAttribute('href') && a.getAttribute('href').indexOf('google.com/maps') !== -1) a.textContent = s.location || 'Khulna, Bangladesh';
    });

    setHref('a[href*="linkedin.com"]', s.linkedin);
    setHref('a[href*="facebook.com"]', s.facebook);
    setHref('a[href*="instagram.com"]', s.instagram);
    setHref('a[href*="twitter.com"]', s.twitter);
    setHref('a[href*="x.com"]', s.twitter);
    setHref('a[href*="youtube.com"]', s.youtube);

    qa('#home .inline-flex span[class*="text-sm"]').forEach(function (el) {
      if (el.textContent.indexOf('Available for') !== -1) el.textContent = s.availability_text || el.textContent;
    });

    if (s.favicon) {
      var link = q('link[rel="icon"], link[rel="shortcut icon"]') || document.createElement('link');
      link.rel = 'icon'; link.href = s.favicon;
      if (!document.head.contains(link)) document.head.appendChild(link);
    }
  }

  function applyNav(items) {
    if (!items || !items.length) return;
    var active = activeHref();
    var nav = q('.site-nav');
    if (nav) {
      nav.innerHTML = items.map(function (it) {
        var cls = (it.url && it.url.replace(/\.html$/, '').replace(/^\//, '') === active.replace(/\.html$/, '').replace(/^\//, '')) ? ' class="nav-link is-active"' : ' class="nav-link"';
        return '<a href="' + esc(it.url) + '"' + cls + '>' + esc(it.label) + '</a>';
      }).join('');
    }
    var mobile = q('.mobile-menu__inner');
    if (mobile) {
      var links = items.map(function (it) {
        var cls = (it.url && it.url.replace(/\.html$/, '').replace(/^\//, '') === active.replace(/\.html$/, '').replace(/^\//, '')) ? ' class="is-active"' : '';
        return '<a href="' + esc(it.url) + '"' + cls + '>' + esc(it.label) + '</a>';
      }).join('');
      var wa = q('a[href*="wa.me"].btn.btn-primary', mobile);
      mobile.innerHTML = links + (wa ? wa.outerHTML : '');
    }
  }

  function activeHref() { return PAGE; }

  function applyHero(page) {
    if (!page || !page.page) return;
    var h1 = q('#home h1');
    if (h1 && page.page.heading) {
      // Replace with the DB heading, keeping the luxury-gradient name span.
      var name = document.querySelector('.brand__name') ? 'Prosengit Kundu' : 'Prosengit Kundu';
      var headingHtml = esc(page.page.heading);
      if (headingHtml.indexOf('Prosengit') !== -1) {
        headingHtml = headingHtml.replace('Prosengit Kundu', '<span class="luxury-gradient">Prosengit Kundu</span>');
      }
      h1.innerHTML = headingHtml;
    }
    var subtitle = q('#home p.max-w-lg');
    if (subtitle && page.page.description) subtitle.textContent = page.page.description;
  }

  /* ---------------- Data-driven grids (homepage + listing pages) ---------------- */
  function renderServices(list) {
    var container = q('#services .grid.md\\:grid-cols-2');
    if (!container) return;
    var icons = {
      search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      chart: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
      video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      users: 'M17 20h5v-2a3 3 0 01-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      palette: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 8.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z',
      code: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012 2m0 0V5a2 2 0 012 2v2'
    };
    var colors = ['#0A66C2', '#16A34A', '#F59E0B'];
    container.innerHTML = list.map(function (s, i) {
      var d = icons[s.icon] || icons.search;
      var c = colors[i % 3];
      var feats = (s.features || []).length
        ? '<ul class="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">' + s.features.map(function (f) { return '<li class="flex gap-x-2"><span class="text-[#16A34A]">\u2713</span> <span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' : '';
      return '<div class="service-card bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">' +
        (s.image ? '<img src="' + esc(s.image) + '" alt="' + esc(s.title) + '" class="w-full h-40 object-cover rounded-2xl mb-6" width="900" height="420" loading="lazy" decoding="async">' : '') +
        '<div class="w-12 h-12 flex items-center justify-center rounded-2xl mb-6" style="background:' + c + '1a;color:' + c + '"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="' + d + '"/></svg></div>' +
        '<h3 class="font-semibold text-2xl">' + esc(s.title) + '</h3>' +
        '<p class="text-sm mt-3 text-gray-600 dark:text-gray-300">' + esc(s.description || '') + '</p>' + feats +
        '<div class="mt-6 text-xs font-medium" style="color:' + c + '">' + esc(s.price_text || '') + '</div></div>';
    }).join('');
    if (window.pkReveal) window.pkReveal(container);
  }

  function renderProjects(list) {
    var container = q('#portfolio-grid');
    if (!container) return;
    container.innerHTML = list.map(function (p) {
      return '<article class="portfolio-card bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' project preview" class="w-full aspect-video object-cover" width="900" height="520" loading="lazy" decoding="async">' +
        '<div class="p-7 relative z-10">' +
        '<div class="flex gap-2 items-center"><span class="text-xs font-semibold tracking-widest text-[#0A66C2]">' + esc((p.category || '').toUpperCase()) + '</span><span class="px-2 py-0.5 rounded-full bg-[#111827] text-white text-[9px] font-bold tracking-widest">DEMO</span></div>' +
        '<div class="font-bold text-xl mt-2">' + esc(p.title) + '</div>' +
        '<div class="text-sm mt-1 text-gray-500">' + esc(p.client || '') + '</div>' +
        '<div class="mt-5 text-sm font-medium">' + esc(p.focus || '') + '</div>' +
        '<a href="portfolio-details.html?id=' + esc(p.id) + '" class="inline-block mt-4 text-sm font-semibold text-[#0A66C2]">View case study \u2192</a></div></article>';
    }).join('');
    if (window.pkReveal) window.pkReveal(container);
  }

  function renderBlog(list) {
    var container = q('#blog-grid');
    if (!container) return;
    container.innerHTML = list.map(function (a) {
      return '<article class="blog-card bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">' +
        '<img src="' + esc(a.image) + '" alt="' + esc(a.title) + '" class="w-full aspect-[16/9] object-cover" width="900" height="520" loading="lazy" decoding="async">' +
        '<div class="p-7 relative z-10">' +
        '<div class="text-xs font-semibold text-[#16A34A]">' + esc(a.category || '') + '</div>' +
        '<div class="font-bold text-xl mt-3 leading-tight">' + esc(a.title) + '</div>' +
        '<a href="blog-details.html?id=' + esc(a.id) + '" class="block mt-5 text-sm text-[#0A66C2] font-semibold">Read Full Article \u2192</a></div></article>';
    }).join('');
    if (window.pkReveal) window.pkReveal(container);
  }

  function renderTestimonials(list) {
    var container = q('#home-testimonials');
    if (!container || !list.length) return; // keep fallback when none stored
    container.innerHTML = list.map(function (t) {
      return '<div class="modern-card p-7 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl">' +
        '<div class="relative z-10">' +
        '<div class="text-[#F59E0B] tracking-widest text-sm">' + (t.rating ? '\u2605'.repeat(Math.min(5, t.rating)) : '\u2605\u2605\u2605\u2605\u2605') + '</div>' +
        '<p class="text-sm mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">\u201C' + esc(t.content || '') + '\u201D</p>' +
        '<div class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">' +
        '<div class="avatar" style="background:' + colorFor(t.client_name) + '">' + initials(t.client_name) + '</div>' +
        '<div><div class="font-bold text-sm">' + esc(t.client_name) + '</div>' +
        '<div class="text-xs text-gray-500">' + esc((t.designation || '') + (t.country ? ' \u00B7 ' + t.country : '')) + '</div></div></div></div></div>';
    }).join('');
    if (window.pkReveal) window.pkReveal(container);
  }

  /* ---------------- Detail pages ---------------- */
  function hydrateBlogDetails() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) return;
    get('/blog/id/' + id).then(function (a) {
      if (!a) return;
      setText('#a-cat', a.category || '');
      setText('#a-date', a.publish_date || '');
      setText('#a-read', a.read_time || '');
      setText('#a-title', a.title || '');
      setText('#a-excerpt', a.excerpt || '');
      var img = q('#a-img'); if (img && a.image) { img.src = a.image; img.alt = a.title; }
      var body = q('#a-body'); if (body) body.innerHTML = a.content || '';
      // SEO
      if (a.seo_title) { document.title = a.seo_title; q('meta[name="description"]').setAttribute('content', a.seo_description || ''); }
      if (a.og_title) q('meta[property="og:title"]').setAttribute('content', a.og_title);
      if (a.og_description) q('meta[property="og:description"]').setAttribute('content', a.og_description);
      if (a.og_image) q('meta[property="og:image"]').setAttribute('content', a.og_image);
    }).catch(function () {});
  }

  function hydrateProjectDetails() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) return;
    get('/projects').then(function (all) {
      var project = null;
      for (var i = 0; i < all.length; i++) if (String(all[i].id) === String(id)) { project = all[i]; break; }
      if (!project) return;
      var catLabel = project.category_label || (project.category || '').toUpperCase();
      var prev = all[i - 1], next = all[i + 1];
      var cs = q('#caseStudy');
      if (!cs) return;
      cs.innerHTML =
        '<a href="portfolio.html" class="text-sm font-semibold text-[#0A66C2]">\u2190 Back to Portfolio</a>' +
        '<div class="mt-10"><div class="flex flex-wrap gap-3 items-center"><div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">' + esc((catLabel || '').toUpperCase()) + '</div><span class="px-3 py-1 rounded-full bg-[#111827] text-white text-[10px] font-bold tracking-widest">DEMO / CONCEPT PROJECT</span></div>' +
        '<h1 class="text-4xl md:text-6xl heading-font tracking-tighter font-bold mt-4 leading-[1.05]">' + esc(project.title) + '</h1>' +
        '<p class="text-xl text-gray-600 dark:text-gray-300 mt-5 max-w-3xl">Work sample \u00B7 ' + esc(project.industry || '') + '</p></div>' +
        '<img src="' + esc(project.image) + '" alt="' + esc(project.title) + ' — work sample image" class="w-full aspect-[16/9] object-cover rounded-3xl mt-12" width="1400" height="800" fetchpriority="high">' +
        '<div class="grid md:grid-cols-4 gap-5 mt-8">' +
        '<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">CATEGORY</div><div class="font-bold mt-2 text-[#0A66C2]">' + esc(catLabel) + '</div></div>' +
        '<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">FOCUS</div><div class="font-semibold text-sm mt-2">' + esc(project.focus || '') + '</div></div>' +
        '<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">TIMELINE</div><div class="font-bold mt-2">' + esc(project.duration || '') + '</div></div>' +
        '<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"><div class="text-xs text-gray-500 font-semibold">TYPE</div><div class="font-bold mt-2">' + esc(project.client || '') + '</div></div></div>' +
        '<div class="grid lg:grid-cols-2 gap-12 mt-16"><div><div class="text-xs tracking-[3px] font-semibold text-[#16A34A]">PROJECT GOAL</div><h2 class="text-3xl heading-font font-bold mt-3">What this project set out to do</h2><p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">' + esc(project.goal || '') + '</p></div>' +
        '<div><div class="text-xs tracking-[3px] font-semibold text-[#F59E0B]">MY ROLE</div><h2 class="text-3xl heading-font font-bold mt-3">Responsibilities &amp; tools</h2><p class="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">' + esc(project.role || '') + '</p>' +
        '<div class="mt-5 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-5 text-sm"><span class="font-semibold text-[#0A66C2]">Tools &amp; technology:</span> <span class="text-gray-600 dark:text-gray-300">' + esc((project.tools || []).join(', ')) + '</span></div></div></div>' +
        '<div class="mt-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 md:p-10"><div class="text-xs tracking-[3px] font-semibold text-[#0A66C2]">WORK COMPLETED</div><h2 class="text-3xl heading-font font-bold mt-3">Deliverables in detail</h2><ul class="grid md:grid-cols-2 gap-4 mt-7 text-gray-600 dark:text-gray-300">' + (project.work || []).map(function (item) { return '<li class="border-l-2 border-[#0A66C2] pl-4">' + esc(item) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="mt-12"><div class="text-xs tracking-[3px] font-semibold text-[#16A34A]">OUTCOME</div><h2 class="text-3xl heading-font font-bold mt-3">Honest status of this work</h2><p class="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">' + esc(project.outcome || '') + '</p></div>' +
        '<div class="mt-14 flex flex-wrap justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">' +
        (prev ? '<a href="portfolio-details.html?id=' + esc(prev.id) + '" class="text-sm font-semibold text-[#0A66C2]">\u2190 ' + esc(prev.title) + '</a>' : '<span></span>') +
        (next ? '<a href="portfolio-details.html?id=' + esc(next.id) + '" class="text-sm font-semibold text-[#0A66C2]">' + esc(next.title) + ' \u2192</a>' : '') + '</div>';
      if (project.title) document.title = project.title + ' | Case Study | Prosengit Kundu';
    }).catch(function () {});
  }

  /* ---------------- Init ---------------- */
  /* ---------------- Contact form -> backend ---------------- */
  function hydrateContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var payload = {};
      fd.forEach(function (v, k) { payload[k] = v; });
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(API + '/contact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.success) { window.location.href = 'thank-you.html'; }
        else { alert(d.error || 'Something went wrong. Please try again.'); if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; } }
      }).catch(function () { if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; } alert('Network error. Please try again.'); });
    });
  }

  function init() {
    if (PAGE === 'blog-details.html') { safe(hydrateBlogDetails); return; }
    if (PAGE === 'portfolio-details.html') { safe(hydrateProjectDetails); return; }
    if (PAGE === 'contact.html') { safe(hydrateContactForm); }

    get('/settings').then(applySettings).catch(function () {});
    get('/navigation').then(applyNav).catch(function () {});
    get('/pages/sections/home').then(applyHero).catch(function () {});

    get('/services').then(function (list) { if (list && list.length) renderServices(list); }).catch(function () {});

    var isPortfolio = PAGE === 'portfolio.html';
    get(isPortfolio ? '/projects' : '/projects/featured').then(function (list) {
      if (list && list.length) renderProjects(isPortfolio ? list : list.slice(0, 6));
      else if (!isPortfolio) get('/projects').then(function (all) { if (all && all.length) renderProjects(all.slice(0, 6)); }).catch(function () {});
    }).catch(function () {});

    get('/blog').then(function (list) {
      if (list && list.length) renderBlog(PAGE === 'blog.html' ? list : list.slice(0, 3));
    }).catch(function () {});

    get('/testimonials').then(function (list) { if (list && list.length) renderTestimonials(list); }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safe(init));
  else safe(init);
})();
