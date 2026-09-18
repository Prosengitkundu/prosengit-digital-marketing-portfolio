#!/usr/bin/env node
/* Lightweight production QA for the static portfolio. Run after generation:
   node scripts/generate-static-pages.js && node scripts/qa-static-site.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://prosengitkundu.top';
let failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}
function read(relative) { return fs.readFileSync(path.join(ROOT, relative), 'utf8'); }
function exists(relative) { return fs.existsSync(path.join(ROOT, relative)); }
function allHtml(directory = ROOT) {
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'backend' || entry.name === 'node_modules') continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...allHtml(full));
    else if (entry.name.endsWith('.html')) output.push(full);
  }
  return output;
}
function loadProjects() {
  let source = read('assets/js/projects.js').replace('const PROJECTS', 'var PROJECTS');
  eval(`${source}\n;globalThis.__QA_PROJECTS__ = PROJECTS;`); // eslint-disable-line no-eval
  return globalThis.__QA_PROJECTS__;
}
function localPath(raw, sourceFile) {
  const value = raw.split('#')[0].split('?')[0];
  if (!value || value === '/') return path.join(ROOT, 'index.html');
  if (value.startsWith('/')) return path.join(ROOT, value.slice(1));
  return path.resolve(path.dirname(sourceFile), value);
}
function internalReference(value) {
  return value && value.indexOf('${') === -1 && !value.startsWith('#') && !/^(?:https?:)?\/\//i.test(value) && !/^(mailto:|tel:|javascript:|data:)/i.test(value);
}

const projects = loadProjects();
const ids = new Set();
const slugs = new Set();
projects.forEach((project) => {
  assert(Number.isInteger(project.id) && !ids.has(project.id), `Invalid or duplicate project ID: ${project.id}`);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) && !slugs.has(project.slug), `Invalid or duplicate project slug: ${project.slug}`);
  assert(project.url === `/portfolio/${project.slug}.html`, `Route does not match stable slug: ${project.slug}`);
  assert(exists(project.url.slice(1)), `Missing generated case-study page: ${project.url}`);
  ids.add(project.id);
  slugs.add(project.slug);
});

const homepage = read('index.html');
assert(homepage.includes('assets/js/projects.js'), 'Homepage does not load the shared project registry.');
assert(homepage.includes('featuredProjectIds'), 'Homepage is not selecting featured projects from the registry.');
assert(!/href="\$\{(?:project|article)\.url\}"[\s\S]{0,30}undefined/i.test(homepage), 'Homepage has an undefined literal project/article URL.');

const sitemap = read('sitemap.xml');
projects.forEach((project) => assert(sitemap.includes(`${SITE}${project.url}`), `Sitemap is missing ${project.url}`));
assert((sitemap.match(/<url>/g) || []).length >= projects.length + 28, 'Sitemap has incomplete generated coverage.');
assert(!sitemap.includes(`${SITE}about.html`) && !sitemap.includes(`${SITE}services.html`), 'Sitemap has a malformed root-page URL.');

const generatedCases = projects.map((project) => project.url.slice(1));
generatedCases.forEach((relative) => {
  const html = read(relative);
  const project = projects.find((item) => item.url.slice(1) === relative);
  assert((html.match(/<h1\b/gi) || []).length === 1, `${relative} must have exactly one H1.`);
  assert(html.includes(`<link rel="canonical" href="${SITE}${project.url}">`), `${relative} has a missing or wrong canonical URL.`);
  assert(html.includes('name="twitter:title"') && html.includes('property="og:title"'), `${relative} is missing social metadata.`);
  assert(html.includes('Practice / sample case study'), `${relative} is not clearly labelled as a sample case study.`);
  assert(html.includes('application/ld+json'), `${relative} is missing JSON-LD.`);
  assert(html.includes('RELATED SERVICES') && html.includes('/services.html#'), `${relative} is missing related-service internal links.`);
  assert(html.includes('/contact.html'), `${relative} is missing a contact CTA.`);
  assert(!html.includes('onerror='), `${relative} uses an external-image fallback instead of a stable local asset.`);
  assert(!html.includes('undefined'), `${relative} contains an undefined literal.`);
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  assert(blocks.some((block) => { try { JSON.parse(block.replace(/^.*?>/, '').replace(/<\/script>$/, '')); return true; } catch (_) { return false; } }), `${relative} has invalid JSON-LD.`);
});

let checkedInternalReferences = 0;
allHtml().forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  assert(!/href="[^"]+""|src="[^"]+""/.test(html), `${path.relative(ROOT, file)} contains a malformed double-quoted URL.`);
  assert(!/href="(?:\/)?undefined|src="(?:\/)?undefined/.test(html), `${path.relative(ROOT, file)} contains a literal undefined URL.`);
  assert(!/(?:href|src)="\/https?:\/\//.test(html), `${path.relative(ROOT, file)} has an invalid /https URL.`);
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/gi)].map((match) => match[1]);
  references.filter(internalReference).forEach((reference) => {
    const destination = localPath(reference, file);
    checkedInternalReferences += 1;
    assert(fs.existsSync(destination), `${path.relative(ROOT, file)} links to a missing local path: ${reference}`);
  });
});

if (failures.length) {
  console.error(`QA failed: ${failures.length} issue(s) found after ${checks} checks.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Static QA passed: ${projects.length} stable project routes, ${generatedCases.length} case studies, ${checkedInternalReferences} local links and ${checks} checks.`);
