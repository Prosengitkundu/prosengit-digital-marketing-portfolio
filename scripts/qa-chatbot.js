#!/usr/bin/env node
/* Deterministic knowledge and link checks for assets/js/chatbot.js. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let failures = [];
let checks = 0;
function assert(condition, message) { checks += 1; if (!condition) failures.push(message); }
function fakeElement() {
  return {
    className: '', style: {}, innerHTML: '', scrollTop: 0, scrollHeight: 0,
    setAttribute() {}, appendChild() {}, addEventListener() {}, focus() {},
    querySelector() { return fakeElement(); },
    classList: { add() {}, remove() {}, contains() { return false; } }
  };
}
const context = {
  window: { setTimeout(fn) { fn(); }, fetch() { return Promise.resolve({ ok: true, json() { return Promise.resolve([]); } }); } },
  document: { readyState: 'complete', createElement: fakeElement, body: { appendChild() {} }, getElementById() { return null; }, addEventListener() {} },
  console
};
context.window.document = context.document;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/portfolio-index.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/chatbot.js'), 'utf8'), context);
const reply = context.window.PkChatbot._getReply;

function expect(question, textFragment, hrefs) {
  const answer = reply(question);
  assert(answer.text.includes(textFragment), `Unexpected reply for “${question}”: ${answer.text}`);
  (hrefs || []).forEach((href) => assert(answer.links.some((link) => link.href === href), `Missing ${href} for “${question}”.`));
  answer.links.forEach((link) => {
    assert(/^https?:\/\//.test(link.href) || (link.href.startsWith('/') && !link.href.includes('undefined')), `Unsafe assistant link for “${question}”: ${link.href}`);
    if (link.href.startsWith('/')) {
      const local = link.href.split(/[?#]/)[0];
      const file = local === '/' ? 'index.html' : local.slice(1);
      assert(fs.existsSync(path.join(ROOT, file)), `Assistant link does not resolve to a local file: ${link.href}`);
    }
  });
}

expect('Show me your SEO projects.', 'Here are the most relevant practice case studies.', [
  '/portfolio/local-seo-growth-system.html', '/portfolio/keyword-research-content-mapping.html', '/portfolio/technical-seo-audit-report.html'
]);
expect('Can I see a Google Ads case study?', 'Here are the most relevant practice case studies.', ['/portfolio/google-ads-search-campaign.html']);
expect('Do you provide technical SEO?', 'SEO & Website Optimization', ['/services.html#digital-marketing', '/pricing.html']);
expect('How much does an HTML CSS JavaScript website cost?', 'Website pricing published on the website', ['/pricing.html']);
expect('How much is YouTube SEO?', 'YouTube SEO pricing published on the services page', ['/services.html#digital-marketing']);
expect('Can you help with email marketing?', 'Email Marketing Support', ['/services.html#digital-marketing']);
expect('How much does marketplace research cost?', 'Custom-quote services', ['/pricing.html', '/contact.html']);
expect('How do I book an appointment?', 'You can contact Prosengit Kundu', ['/contact.html?plan=Free%20Consultation']);
expect('Which countries do you target?', 'Bangladesh, the USA, UK, Canada, Australia', ['/about.html']);
expect('Do you have testimonials?', 'verified-feedback policy', ['/testimonials.html']);
expect('What is the capital of Mars?', 'do not want to guess', ['/contact.html']);

const source = fs.readFileSync(path.join(ROOT, 'assets/js/chatbot.js'), 'utf8');
assert(source.includes("event.key === 'Escape'"), 'Assistant has no Escape-key close behavior.');
assert(source.includes("aria-controls', 'pk-chatbot-panel'"), 'Assistant launcher is not associated with its dialog.');
assert(fs.readFileSync(path.join(ROOT, 'assets/js/site.js'), 'utf8').includes("registry.src = '/assets/js/portfolio-index.js'"), 'Assistant index is not loaded with a root-relative nested-route-safe URL.');

if (failures.length) {
  console.error(`Chatbot QA failed: ${failures.length} issue(s) after ${checks} checks.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Chatbot QA passed: ${checks} evidence-safe replies, service/pricing routes and accessibility checks.`);
