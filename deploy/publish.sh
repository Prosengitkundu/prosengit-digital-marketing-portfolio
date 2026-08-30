#!/usr/bin/env bash
#
# publish.sh — validate and publish the Prosengit Kundu portfolio to GitHub Pages.
#
#   ./deploy/publish.sh                 # check, commit, push to main, wait for Pages
#   ./deploy/publish.sh --dry-run       # run every check, change nothing
#   ./deploy/publish.sh --check-only    # pre-flight only, then stop
#   ./deploy/publish.sh -m "message"    # custom commit message
#   ./deploy/publish.sh --strict        # warnings fail the build too
#   ./deploy/publish.sh --no-verify     # skip the post-deploy live URL probe
#   ./deploy/publish.sh --yes           # no interactive confirmation
#
# GitHub Pages serves the `main` branch of this repo at https://prosengitkundu.top.
# Publishing therefore means: get the working tree onto main, push it, wait for the
# pages-build-deployment run to go green, then confirm the live site responds 200.
#
set -Eeuo pipefail

# ------------------------------------------------------------------ settings

DEPLOY_BRANCH="main"
REMOTE="origin"
PAGES_URL="https://prosengitkundu.top"
BUILD_TIMEOUT=300          # seconds to wait for the Pages build
VERIFY_PATHS=("/" "/about.html" "/services.html" "/contact.html" "/sitemap.xml" "/robots.txt")

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

DRY_RUN=0
CHECK_ONLY=0
STRICT=0
VERIFY=1
ASSUME_YES=0
COMMIT_MSG=""

# ------------------------------------------------------------------- output

if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
  B=$'\033[1m'; R=$'\033[31m'; G=$'\033[32m'; Y=$'\033[33m'; C=$'\033[36m'; X=$'\033[0m'
else
  B=""; R=""; G=""; Y=""; C=""; X=""
fi

step() { printf '\n%s==>%s %s%s%s\n' "$C" "$X" "$B" "$*" "$X"; }
ok()   { printf '  %s✓%s %s\n' "$G" "$X" "$*"; }
info() { printf '    %s\n' "$*"; }
warn() { printf '  %s!%s %s\n' "$Y" "$X" "$*"; }
die()  { printf '\n%serror:%s %s\n' "$R" "$X" "$*" >&2; exit 1; }

trap 'die "failed at line $LINENO: ${BASH_COMMAND}"' ERR

usage() { sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0; }

# ---------------------------------------------------------------- arg parse

while (($#)); do
  case "$1" in
    --dry-run|-n)   DRY_RUN=1 ;;
    --check-only)   CHECK_ONLY=1 ;;
    --strict)       STRICT=1 ;;
    --no-verify)    VERIFY=0 ;;
    --yes|-y)       ASSUME_YES=1 ;;
    -m|--message)   shift; COMMIT_MSG="${1:-}"; [[ -n "$COMMIT_MSG" ]] || die "-m needs a message" ;;
    -h|--help)      usage ;;
    *)              die "unknown option: $1 (try --help)" ;;
  esac
  shift
done

cd "$ROOT"

printf '%s\n' "${B}Publish · Prosengit Kundu portfolio${X}"
info "root    $ROOT"
info "target  $REMOTE/$DEPLOY_BRANCH  ->  $PAGES_URL"
if ((DRY_RUN)); then warn "dry run — nothing will be committed or pushed"; fi

# ------------------------------------------------------- 1. tooling + repo

step "Environment"

for bin in git python3; do
  command -v "$bin" >/dev/null 2>&1 || die "$bin is required but not installed"
done
ok "git $(git --version | awk '{print $3}'), python $(python3 -c 'import sys;print("%d.%d.%d"%sys.version_info[:3])')"

HAVE_GH=0
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  HAVE_GH=1
  ok "gh CLI authenticated"
else
  warn "gh CLI unavailable or unauthenticated — build status will not be tracked"
fi

git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository"

SLUG="$(git remote get-url "$REMOTE" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')"
ok "repository $SLUG"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
info "current branch: $CURRENT_BRANCH"

# ------------------------------------------------------------ 2. pre-flight

step "Pre-flight checks"

PF_ARGS=(--root "$ROOT")
if ((STRICT)); then PF_ARGS+=(--strict); fi

if python3 "$SCRIPT_DIR/preflight.py" "${PF_ARGS[@]}"; then
  ok "site validation passed"
else
  die "pre-flight failed — fix the errors above, nothing was published"
fi

# JSON / XML files parse (belt and braces, preflight already covers sitemap)
while IFS= read -r -d '' f; do
  python3 -c "import json,sys;json.load(open(sys.argv[1]))" "$f" \
    || die "invalid JSON: ${f#$ROOT/}"
done < <(find "$ROOT" -name '*.json' -not -path '*/.git/*' -print0)

# Large files that would bloat the repo
while IFS= read -r -d '' f; do
  sz=$(( $(stat -c%s "$f" 2>/dev/null || stat -f%z "$f") / 1024 / 1024 ))
  if (( sz >= 10 )); then warn "large file ${f#$ROOT/} (${sz} MB) — GitHub warns above 50 MB"; fi
done < <(find "$ROOT" -type f -size +10M -not -path '*/.git/*' -print0)

# Secret scan on tracked + new files
step "Secret scan"
SECRET_HITS=0
SECRET_RE='(ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-[A-Za-z0-9]{32,}|xox[baprs]-[A-Za-z0-9-]{10,})'
while IFS= read -r line; do
  warn "possible secret: $line"
  SECRET_HITS=1
done < <(grep -rInE "$SECRET_RE" "$ROOT" \
           --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=deploy 2>/dev/null \
         | cut -c1-160 || true)
if (( SECRET_HITS )); then
  die "potential credentials found — refusing to publish"
fi
ok "no credential patterns found"

if ((CHECK_ONLY)); then
  step "Done"
  ok "checks only — stopping before publish"
  exit 0
fi

# -------------------------------------------------------------- 3. changes

step "Working tree"

if [[ -z "$(git status --porcelain)" ]]; then
  NO_LOCAL_CHANGES=1
  ok "clean — nothing new to commit"
else
  NO_LOCAL_CHANGES=0
  git -c color.status=always status --short | sed 's/^/    /'
  CHANGED=$(git status --porcelain | wc -l | tr -d ' ')
  info "$CHANGED path(s) changed"
fi

if [[ -z "$COMMIT_MSG" ]]; then
  COMMIT_MSG="Publish site update ($(date +%Y-%m-%d))"
fi

# ------------------------------------------------------------- 4. confirm

if ((!DRY_RUN)) && ((!ASSUME_YES)); then
  step "Confirm"
  info "commit  : $COMMIT_MSG"
  info "push to : $REMOTE/$DEPLOY_BRANCH (live immediately at $PAGES_URL)"
  if [[ -t 0 ]]; then
    read -r -p "  Publish now? [y/N] " reply
    [[ "$reply" =~ ^[Yy]$ ]] || { warn "aborted by user"; exit 0; }
  else
    warn "non-interactive shell — pass --yes to publish without a prompt"
    exit 0
  fi
fi

# ------------------------------------------------------------- 5. publish

step "Publish"

if ((DRY_RUN)); then
  ok "dry run: would commit \"$COMMIT_MSG\""
  ok "dry run: would push $CURRENT_BRANCH -> $REMOTE/$DEPLOY_BRANCH"
  step "Done"
  ok "dry run complete — no changes made"
  exit 0
fi

git fetch "$REMOTE" "$DEPLOY_BRANCH" --quiet
ok "fetched $REMOTE/$DEPLOY_BRANCH"

if ((!NO_LOCAL_CHANGES)); then
  git add -A
  git commit -q -m "$COMMIT_MSG"
  ok "committed $(git rev-parse --short HEAD) — $COMMIT_MSG"
fi

LOCAL_SHA="$(git rev-parse HEAD)"
REMOTE_SHA="$(git rev-parse "$REMOTE/$DEPLOY_BRANCH")"

if [[ "$LOCAL_SHA" == "$REMOTE_SHA" ]]; then
  ok "$REMOTE/$DEPLOY_BRANCH already matches local HEAD — nothing to push"
  PUSHED=0
else
  AHEAD=$(git rev-list --count "$REMOTE/$DEPLOY_BRANCH..HEAD")
  BEHIND=$(git rev-list --count "HEAD..$REMOTE/$DEPLOY_BRANCH")
  info "ahead $AHEAD / behind $BEHIND vs $REMOTE/$DEPLOY_BRANCH"

  if (( BEHIND > 0 )); then
    die "$REMOTE/$DEPLOY_BRANCH has $BEHIND commit(s) you don't have. Rebase first: git pull --rebase $REMOTE $DEPLOY_BRANCH"
  fi

  git push "$REMOTE" "HEAD:$DEPLOY_BRANCH"
  ok "pushed $(git rev-parse --short HEAD) to $REMOTE/$DEPLOY_BRANCH"
  PUSHED=1
fi

# --------------------------------------------------------- 6. pages build

if (( HAVE_GH )); then
  step "GitHub Pages build"
  deadline=$(( SECONDS + BUILD_TIMEOUT ))
  status=""
  printf '    waiting'
  while (( SECONDS < deadline )); do
    status="$(gh api "repos/$SLUG/pages/builds/latest" --jq '.status' 2>/dev/null || echo '')"
    case "$status" in
      built)    printf '\n'; ok "build succeeded"; break ;;
      errored)  printf '\n'
                gh api "repos/$SLUG/pages/builds/latest" --jq '.error.message' 2>/dev/null | sed 's/^/    /'
                die "Pages build errored" ;;
      *)        printf '.'; sleep 6 ;;
    esac
  done
  [[ "$status" == "built" ]] || { printf '\n'; warn "timed out after ${BUILD_TIMEOUT}s (status: ${status:-unknown}) — check the Actions tab"; }
fi

# ------------------------------------------------------------- 7. verify

if (( VERIFY )) && command -v curl >/dev/null 2>&1; then
  step "Live verification"
  sleep 4
  fails=0
  for path in "${VERIFY_PATHS[@]}"; do
    code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 -L "${PAGES_URL}${path}" || echo 000)"
    if [[ "$code" == "200" ]]; then
      ok "200  ${path}"
    else
      warn "$code  ${path}"
      fails=$((fails + 1))
    fi
  done
  if (( fails > 0 )); then
    warn "$fails path(s) did not return 200 — CDN propagation can lag a minute or two"
  else
    ok "all ${#VERIFY_PATHS[@]} paths healthy"
  fi
fi

# ---------------------------------------------------------------- 8. done

step "Done"
ok "live at $PAGES_URL"
info "commit  $(git rev-parse --short HEAD)  on $DEPLOY_BRANCH"
info "actions https://github.com/$SLUG/actions"
