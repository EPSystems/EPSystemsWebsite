# SEO remediation — decisions needed / assumptions made

## 1. Vercel build verification (Phase 1)

The prerender now depends on launching headless Chromium during `npm run build`. Locally this uses puppeteer's Chrome; on Vercel (`VERCEL=1`) it switches to `@sparticuz/chromium` because Vercel's Amazon Linux build image lacks Chrome's shared libraries. That Vercel path cannot be exercised from a Windows dev machine.

**Consequence if it fails:** `scripts/verify-prerender.mjs` (postbuild) fails the build on purpose, so a broken prerender blocks the deploy instead of silently shipping the empty shell again.

**Ask:** push `seo/prerender-and-technical-seo` to trigger a Vercel preview deployment (I have not pushed — that publishes to the remote and starts a build). If the preview build fails in the Chromium launch, the fallback is to bump `@sparticuz/chromium`/`puppeteer` to a matching newer pair or set `PUPPETEER_CACHE_DIR` inside the project so Vercel's build cache keeps the browser.

## 2. `postbuild` gate blocks deploys on any regression (Phase 1)

Assumption made: a build that would reintroduce the single-shell defect should fail rather than deploy. If you would rather deploy-with-warning, change `process.exit(1)` in `scripts/verify-prerender.mjs` to a warning.
