# Prosengit Kundu — international digital marketing portfolio

Static website for **Prosengit Kundu**, positioned as a Digital Marketing Expert, SEO & Performance Marketing Specialist, Web Developer, Professional Trainer and Freelancer.

The site is designed for business owners in Bangladesh and remote clients worldwide. It separates commercial search intent across focused service pages instead of trying to rank every service from one homepage.

## What is included

- Semantic, responsive homepage focused on digital marketing + web development.
- Service hub plus dedicated pages for:
  - SEO services
  - Meta Ads / Facebook and Instagram advertising
  - Google Ads and YouTube advertising
  - Custom HTML/CSS/JavaScript web development
  - WordPress development and optimisation
  - Local SEO and Google Business Profile
  - B2B lead generation and prospect research
  - Digital marketing consulting, keyword research and training
- Clear starting-price page with scope and limitations.
- Work-sample page that labels concept/demo work honestly.
- Blog hub with SEO, paid media, web, WordPress and lead-generation clusters.
- FAQ, About and Contact pages with international/remote project context.
- Unique title tags, meta descriptions, canonical URLs, Open Graph/Twitter metadata and relevant JSON-LD.
- Updated `robots.txt`, XML sitemap, favicon and shared navigation/footer behaviour.
- Formspree contact route with service, market and project-context fields.

## Audit and strategy document

The complete audit, keyword map, information architecture, page plan, blog clusters, internal-linking model and technical SEO backlog are in:

- [`docs/seo-audit-and-content-plan.md`](docs/seo-audit-and-content-plan.md)

## Run locally

The public site is plain HTML/CSS/JavaScript and does not require a build step. From the repository root:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Then open `http://localhost:8000/`.

The repository also contains an optional Node/Express CMS under `backend/`. It is not required for the static public pages. See [`backend/README.md`](backend/README.md) before deploying it; configure credentials and environment variables outside version control.

## Important honesty and maintenance notes

- Portfolio entries are labelled demo/concept unless verified otherwise.
- The public site does not display fabricated client names, testimonials, ratings, rankings, awards or performance results.
- SEO, advertising and lead-generation pages explicitly avoid guarantees.
- Prices are starting points and must be confirmed against the current scope before quoting a client.
- Search Console, privacy-appropriate analytics, form delivery and conversion events should be verified on the production host after deployment.

## Key files

```text
index.html                         Homepage
services.html                      Service architecture
seo-services.html                  SEO service page
meta-ads.html                      Meta Ads service page
google-youtube-ads.html             Google/YouTube Ads service page
web-development.html                Custom web development
wordpress-development.html          WordPress service page
local-seo.html                      Local SEO service page
b2b-lead-generation.html             B2B lead generation
digital-marketing-consulting.html   Consulting/research/training
assets/css/style.css                Shared design system
assets/js/site.js                   Shared navigation, footer and UI behaviour
docs/seo-audit-and-content-plan.md  Audit, keyword map and content plan
robots.txt                          Crawl rules
sitemap.xml                         Public URL sitemap
```
