/* Consistency check: every page must build the same shared chrome. */
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();

(async () => {
  let allPass = true;
  const summary = [];

  for (const page of pages) {
    const errors = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', e => errors.push('JS: ' + e.message.split('\n')[0]));

    const dom = new JSDOM(fs.readFileSync(path.join(ROOT, page), 'utf8'), {
      runScripts: 'outside-only',
      pretendToBeVisual: true,
      virtualConsole: vc,
      url: 'http://localhost:8080/' + page
    });

    const { window } = dom;
    const doc = window.document;

    // --- polyfills jsdom lacks ---
    window.matchMedia = q => ({
      matches: false, media: q, onchange: null,
      addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }
    });
    window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe() {} unobserve() {} disconnect() {}
    };
    window.scrollTo = () => {};

    // --- execute local scripts in document order (defer last).
    // Concatenated into ONE eval so top-level `const` bindings (ARTICLES,
    // PROJECTS) are visible to later scripts, exactly like a real browser. ---
    const immediate = [];
    const deferred = [];
    for (const s of doc.querySelectorAll('script')) {
      const src = s.getAttribute('src');
      if (src && /^https?:/.test(src)) continue;              // CDN: skip
      if (s.type && s.type !== 'text/javascript') continue;   // ld+json / tailwindcss
      try {
        const code = src ? fs.readFileSync(path.join(ROOT, src), 'utf8') : s.textContent;
        (s.hasAttribute('defer') ? deferred : immediate).push(code);
      } catch (e) {
        errors.push((src || 'inline') + ': ' + e.message.split('\n')[0]);
      }
    }
    try {
      window.eval([...immediate, ...deferred].join('\n;\n'));
    } catch (e) {
      errors.push('script: ' + e.message.split('\n')[0]);
    }

    doc.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));
    await new Promise(r => setTimeout(r, 80));

    const c = {
      navLinks: doc.querySelectorAll('.site-nav .nav-link').length,
      activeNav: doc.querySelectorAll('.site-nav .nav-link.is-active').length,
      mobileLinks: doc.querySelectorAll('.mobile-menu a').length,
      footerLinks: doc.querySelectorAll('.site-footer a').length,
      header: !!doc.querySelector('.site-header'),
      footer: !!doc.querySelector('.site-footer'),
      loader: !!doc.querySelector('.page-loader'),
      backToTop: !!doc.getElementById('backToTop'),
      whatsapp: !!doc.querySelector('.floating-contact'),
      theme: !!doc.getElementById('themeToggle'),
      shell: !!doc.querySelector('.page-shell'),
      progress: !!doc.getElementById('scrollProgressBar'),
      inlineStyle: doc.querySelectorAll('style:not([type])').length,
      cv: /download\s*cv/i.test(doc.body.textContent) || /downloadCV/.test(doc.documentElement.outerHTML)
    };

    const bad = [];
    if (!c.header) bad.push('no header');
    if (!c.footer) bad.push('no footer');
    if (!c.loader) bad.push('no loader');
    if (!c.backToTop) bad.push('no back-to-top');
    if (!c.whatsapp) bad.push('no whatsapp');
    if (!c.theme) bad.push('no theme toggle');
    if (!c.shell) bad.push('no page-shell');
    if (!c.progress) bad.push('no progress bar');
    if (c.navLinks !== 9) bad.push('navLinks=' + c.navLinks);
    if (c.activeNav > 1) bad.push('multiple active nav');
    if (c.mobileLinks !== 10) bad.push('mobileLinks=' + c.mobileLinks);
    if (c.inlineStyle > 0) bad.push('inline <style> x' + c.inlineStyle);
    if (c.cv) bad.push('*** DOWNLOAD CV PRESENT ***');
    errors.forEach(e => bad.push(e));

    if (bad.length) allPass = false;
    summary.push({ page, c, bad });
    window.close();
  }

  for (const { page, c, bad } of summary) {
    console.log(
      (bad.length ? 'FAIL ' : 'PASS ') + page.padEnd(24),
      'nav=' + c.navLinks,
      'active=' + c.activeNav,
      'mob=' + c.mobileLinks,
      'foot=' + String(c.footerLinks).padEnd(2),
      bad.length ? ':: ' + bad.join(' | ') : ''
    );
  }
  console.log('\n' + (allPass ? 'ALL PAGES CONSISTENT' : 'issues above'));
})();
