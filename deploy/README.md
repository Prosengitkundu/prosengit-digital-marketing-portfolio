# deploy/

Publishing tooling for the portfolio. GitHub Pages serves the **`main`** branch of
this repo at <https://prosengitkundu.top>, so "publish" means getting a validated
working tree onto `main`.

## Usage

```bash
./deploy/publish.sh --check-only     # validate only, change nothing
./deploy/publish.sh --dry-run        # full run, but no commit/push
./deploy/publish.sh                  # validate → commit → push main → verify live
./deploy/publish.sh --yes -m "New pricing tiers"
```

| Flag | Effect |
| --- | --- |
| `--check-only` | Run pre-flight, then stop |
| `--dry-run`, `-n` | Everything except commit/push |
| `--strict` | Warnings fail the build too |
| `-m`, `--message` | Commit message (default: `Publish site update (YYYY-MM-DD)`) |
| `--yes`, `-y` | Skip the confirmation prompt (required in CI / non-interactive shells) |
| `--no-verify` | Skip the post-deploy live URL probe |
| `-h`, `--help` | Usage |

## What it does

1. **Environment** — checks `git`, `python3`, optional authenticated `gh`.
2. **Pre-flight** — runs `preflight.py` (below). Any error aborts before anything is written.
3. **Secret scan** — refuses to publish if GitHub/AWS/OpenAI/Slack token patterns or a private key appear anywhere in the tree.
4. **Working tree** — shows what changed.
5. **Confirm** — interactive prompt unless `--yes`.
6. **Publish** — fetches `origin/main`, commits, refuses to push if `main` is ahead (tells you to rebase), then pushes `HEAD:main`.
7. **Pages build** — polls the Pages build API until `built`, fails loudly on `errored`, times out at 5 min.
8. **Verify** — curls `/`, `/about.html`, `/services.html`, `/contact.html`, `/sitemap.xml`, `/robots.txt` and reports status codes.

The script is `set -Eeuo pipefail` with an ERR trap, so any unexpected failure stops it
with the offending line number rather than half-publishing.

## `preflight.py`

Pure stdlib, no network, no dependencies. Run standalone:

```bash
python3 deploy/preflight.py --root . [--strict] [--quiet]
```

Checks:

- **Required files** — `index.html`, `404.html`, `CNAME`, `robots.txt`, `sitemap.xml`
- **HTML sanity** — unclosed / stray tags (SVG self-closing aware, HTML5 optional-close aware), duplicate `id`s, missing `DOCTYPE`, missing `lang`
- **Head essentials** — `<title>` (and length), meta description (and length), viewport, canonical, `og:title` / `og:image`, exactly one `<h1>`
- **Links** — every internal `href`/`src`/`srcset`/form action resolves on disk; `#fragments` must exist in the target page; `mailto:`/`tel:`/external skipped
- **Sitemap** — well-formed XML, https-only, host matches `CNAME`, every `<loc>` maps to a real file, valid `lastmod`, flags pages missing from the sitemap
- **robots.txt** — has `User-agent`, has a `Sitemap:` line pointing at the right host, blocks an accidental site-wide `Disallow: /`
- **CNAME** — exactly one line, valid domain, agrees with every page's canonical host
- **Images** — warns >250 KB, errors >900 KB, flags JPG/PNG with no `.webp` sibling, missing `alt`
- **CSS/JS** — warns on large unminified bundles, leftover `console.log`, errors on `debugger`
- **JSON-LD** — every `application/ld+json` block must parse
- **Mixed content** — any `http://` reference is an error

Exit code `0` = safe to publish, `1` = errors (or warnings under `--strict`).

## Current state

The site passes with **0 errors, 12 warnings**. The warnings are all cosmetic/SEO polish:

- `404.html`, `thank-you.html` — no `rel=canonical` (intentional; these shouldn't be indexed)
- `disclaimer.html`, `privacy-policy.html`, `terms.html`, `thank-you.html` — no `og:title`/`og:image`
- `portfolio-details.html` — no `<h1>` (title is injected client-side from `projects.js`)
- `assets/images/prosengit-kundu-professional.jpg` — no `.webp` sibling
