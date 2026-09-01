# SEO / GEO remediation — running log

Branch: `seo/prerender-and-technical-seo` (off `main` @ dce3a3a).
Definition of done (from the brief): four sample routes return different byte counts and titles, each with an `<h1>` and a self-referencing canonical, and `/en/` reports `lang="en"`.

## Phase 1 — Prerender all routes at build time

**Status: PASS (verified locally).**

### Root cause

Vite + React SPA; `index.html` was the only HTML on disk, so every route served the same 10.3 KB shell. Titles, descriptions, `lang`, canonical, hreflang, OG and the `<h1>` all exist in the app — but only after JavaScript runs (`usePageMeta`, `useLanguageSync`, `SEOHead`). Non-JS crawlers never saw them.

### Approach chosen

Headless-browser snapshot at build time (`vite-plugin-prerender` → `@prerenderer/renderer-puppeteer`), the "react-snap" family. Rationale:

- Zero changes to page components: the capture sees the same DOM a visitor sees, so the existing runtime-injected head tags and JSON-LD land in the static file.
- True SSG (`vite-react-ssg` / `vike`) would need every page's head logic rewritten off `useEffect` and an audit of `window`/`document` use in ~70 framer-motion call sites. Not the smallest change.
- Routes are enumerated from `scripts/routes.mjs`, the same source the sitemap generator uses (17 static paths × 2 locales + 10 blog posts + 8 team pages + 8 category pages = 60 routes). This matches the 40 URLs in `audit-pages.json` plus the pages added since that crawl.

### What changed

- `vite.config.ts` — prerender plugin wired for all 60 routes; environment-aware Chromium selection: puppeteer's managed Chrome locally, `@sparticuz/chromium` (statically linked, built for Amazon Linux) when `VERCEL=1`, because Vercel's build image lacks Chrome's shared libraries.
- `package.json` — `puppeteer@22.15.0` and `@sparticuz/chromium@127.0.0` as devDependencies (versions paired: both target Chrome 127); npm `overrides` now reference the direct dep (`$puppeteer`); new `postbuild` gate.
- `scripts/verify-prerender.mjs` — **build gate.** The plugin swallows renderer errors and would happily ship the empty shell as a "successful" build. This script fails the build unless every route has its own file, a `<title>`, exactly one `<h1>`, a self-referencing canonical and the right `<html lang>`, and titles are not all identical.
- `src/pages/Projects.tsx` — was the only page without `SEOHead`; the gate caught it (no canonical on `/bg/projects`, `/en/projects`).
- Carried forward from the uncommitted working tree: `scripts/routes.mjs`, sitemap generator refactor, new pages (`BlogCategory`, `TeamMember`, `Resources`), `AuthorByline`, team data and locale strings. These were already on disk and the build depends on them.

### Environment fix needed on this machine

The first build failed: puppeteer 22.15 expects Chrome 127.0.6533.88 but only Chrome 146 was in `~/.cache/puppeteer`. Fixed by running puppeteer's own `install.mjs`; `npm install` does this automatically on a fresh clone.

### Verification (actual output, local `dist/` via `npx serve`)

```
/bg/ -> 78195 bytes
lang="bg"
<title>E&amp;P Systems - AI Агенция от София | AI Решения за Бизнеса</title>
rel="canonical" href="https://www.epsystems.org/bg/"
<h1 class="..." style="opacity: 0; transform: translateY(40px);">Изграждаме
/en/ -> 74631 bytes
lang="en"
<title>E&amp;P Systems - AI Agency from Sofia | AI Solutions for Business</title>
rel="canonical" href="https://www.epsystems.org/en/"
<h1 class="..." style="opacity: 0; transform: translateY(40px);">We build
/bg/services/ai-websites -> 49341 bytes
lang="bg"
<title>AI Уеб Сайтове - E&amp;P Systems</title>
rel="canonical" href="https://www.epsystems.org/bg/services/ai-websites"
<h1 class="...">Сайт, който разговаря с клиентите ви.
/bg/pricing -> 37308 bytes
lang="bg"
<title>Цени - E&amp;P Systems</title>
rel="canonical" href="https://www.epsystems.org/bg/pricing"
<h1 class="...">Просто, прозрачно ценообразуване
--- status codes (npx serve)
/bg/ 200  /en/ 200  /bg/services/ai-websites 200  /bg/pricing 200  /bg/does-not-exist 404
```

Aggregate over all 60 prerendered routes: 0 empty `#root`, 0 missing `<h1>`, 0 missing description, 52 distinct titles, 54 distinct descriptions.

### Carried into Phase 2 (found while verifying)

- Home `<h1>` (bg + en) is captured mid-animation with inline `opacity: 0; transform: translateY(40px)` — framer-motion's initial state. Text is in the HTML but styled invisible.
- Duplicate titles: the 8 blog-category pages share one generic title/description per locale; "AI E-Commerce" and "AI SEO" titles each appear on two EN routes.
- `SEOHead` appends tags instead of upserting, so after client-side render the live DOM carries two canonical/OG sets (raw HTML is fine; Google's renderer would see duplicates).
- Blog `Article` JSON-LD is injected at runtime — confirm it is present in the static file (Phase 4).

### Not verifiable from this machine

- The Vercel build path (`@sparticuz/chromium`) has not been exercised; it needs a preview deployment. Pushing this branch would trigger one. Logged in `SEO-DECISION.md`.

## Phase 2 — Per-route `<head>` and a real `<h1>`

**Status: PASS (verified locally, committed).**

### Found while auditing the Phase 1 output

- **30 of 60 routes had `og:title`/`og:description` that did not match their own title/description.** `SEOHead` read `document.title` inside its effect, but React runs a child's effects before its parent's, so it saw the *previous* page's title (on a cold load: the shell's Bulgarian default, even on `/en/`).
- Blog-category pages (8) shared one generic title and description per locale; two BG service pages carried English-only titles identical to their EN twins.
- Every entrance animation was captured at its initial state: 527 inline `opacity: 0` styles across the site, including the home `<h1>`. Root cause measured with puppeteer: with 4 concurrent tabs, 3 are background tabs (`visibilityState === "hidden"`, 0 animation frames in 2 s), so framer-motion never wrote final styles.
- `SEOHead` appended tags on every run, so after client-side boot the live DOM carried two canonical/OG sets.

### What changed

- `src/components/SEOHead.tsx` — injection deferred by one microtask (runs after the parent's `usePageMeta` effect, still before paint); every owned tag is marked `data-seo-head` and any earlier set is removed first, so prerendered HTML + client render never yield duplicates.
- `src/hooks/usePageMeta.ts` — accepts i18n interpolation values.
- `src/pages/BlogCategory.tsx`, locale files — category title/description templates (`{{category}} — статии и ръководства | E&P Systems`, description written in Bulgarian, not translated); BG titles for AI SEO / AI E-Commerce services rewritten in Bulgarian.
- `src/pages/TeamMember.tsx`, `BlogCategory.tsx` — dropped explicit `SEOHead` titles so `og:title` always equals `<title>`.
- `src/main.tsx` — prerender mode (flag injected by the renderer): framer-motion `MotionGlobalConfig.skipAnimations` + an IntersectionObserver shim that reports every element visible, so `whileInView` sections below the fold render in final state; a `prerender-ready` event after first commit + 2 frames; Vercel Analytics not injected into the snapshot. On real visits that booted from prerendered HTML, entrance animations are skipped until first interaction (1.5 s max) so the already-visible hero does not blink to `opacity: 0` and fade back in.
- `vite.config.ts` — `maxConcurrentRoutes: 1` (see root cause above), `renderAfterDocumentEvent: 'prerender-ready'` instead of a fixed 2 s wait. Full build with prerender now takes ~30 s.
- `scripts/verify-prerender.mjs` — gate extended: unique title and description across all routes; `og:title == title`, `og:description == description`, `og:url == canonical`, `og:image`, `twitter:card`; hreflang bg/en/x-default present, x-default = bg, self entry correct, counterpart prerendered and reciprocal; `<h1>` not inline-hidden.

### Verification (actual output)

```
/bg/ -> 78086 bytes
lang="bg"
<title>E&amp;P Systems - AI Агенция от София | AI Решения за Бизнеса</title>
rel="canonical" href="https://www.epsystems.org/bg/" data-seo-head=""
<h1 class="..." style="opacity: 1; transform: none;">Изграждаме
/en/ -> 74265 bytes
lang="en"
<title>E&amp;P Systems - AI Agency from Sofia | AI Solutions for Business</title>
rel="canonical" href="https://www.epsystems.org/en/" data-seo-head=""
<h1 class="..." style="opacity: 1; transform: none;">We build
/bg/services/ai-websites -> 49270 bytes
lang="bg"
<title>AI Уеб Сайтове - E&amp;P Systems</title>
rel="canonical" href="https://www.epsystems.org/bg/services/ai-websites" data-seo-head=""
<h1 class="...">Сайт, който разговаря с клиентите ви.
/bg/pricing -> 37220 bytes
lang="bg"
<title>Цени - E&amp;P Systems</title>
rel="canonical" href="https://www.epsystems.org/bg/pricing" data-seo-head=""
<h1 class="...">Просто, прозрачно ценообразуване
--- status codes (npx serve)
/bg/ 200  /en/ 200  /bg/services/ai-websites 200  /bg/pricing 200  /bg/does-not-exist 404

[verify-prerender] OK — 60 routes prerendered; unique title + description on each;
canonical, lang, single visible <h1>, OG/Twitter and reciprocal hreflang verified.
```

Aggregate over all 60 routes: 60 distinct titles, 60 distinct descriptions, 0 `opacity: 0` inline styles (was 527), hreflang reciprocal on all 30 bg/en pairs.

Live DOM after JavaScript boot (puppeteer, 2.5 s after load) on `/en/pricing`, `/bg/`, `/en/blog/category/ai-seo`: 1 canonical, 1 `og:title`, 1 meta description, correct title and `lang`, `<h1>` at `opacity: 1`, no page errors.

### Notes for later phases

- Thinnest pages are the four team profiles (132–141 words) and the insurance category (148). Real content, but thin; a content decision, not a rendering defect.
- `og:image` defaults to `/logo.png` on every page; a 1200×630 social image per section would be better but is a design asset, not code.
