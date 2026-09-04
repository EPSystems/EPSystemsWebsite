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

## Phase 3 — Status codes

**Status: repo side PASS (verified locally, committed); two items need the Vercel dashboard — see `SEO-DECISION.md` §3–4.**

### Live measurements before the change (2026-09-01)

```
http://epsystems.org/                        308 -> https://epsystems.org/        (HTTP→HTTPS, Vercel default)
https://epsystems.org/bg/pricing             307 -> https://www.epsystems.org/bg/pricing
https://www.epsystems.org/bg/does-not-exist  200   (soft 404: SPA catch-all rewrite)
https://www.epsystems.org/404.html           200
```

### What changed

- `vercel.json` — removed the `/(.*) → /index.html` catch-all rewrite. Every real route now exists as a static file (Phase 1), so the rewrite only served to turn unknown URLs into 200s. Added a 308 for locale-less section URLs (`/services/...`, `/pricing`, `/blog/...` etc. → `/bg/...`), consistent with the existing `/ → /bg/` rule. The host redirect stays `permanent: true` (308).
- `dist/404.html` — the app's `NotFoundPage` is prerendered via a pseudo-route (`NOT_FOUND_PRERENDER_ROUTE` in `scripts/routes.mjs`, written to `404.html` by the plugin's `postProcess`). Vercel serves a root `404.html` with a real 404 status for any path without a static file.
- `src/pages/NotFoundPage.tsx` — adds `<meta name="robots" content="noindex">` and syncs `<html lang>`.
- `scripts/verify-prerender.mjs` — gate now requires `dist/404.html` with one `<h1>`, `noindex`, no canonical, non-shell title.

### Why the 307 is not fixed in the repo

`origin/main` has had `permanent: true` on the host redirect since May 2026, yet production returns 307. The redirect is therefore the domain-level one in the Vercel dashboard (defaults to 307), which runs before `vercel.json`. Dashboard action logged in `SEO-DECISION.md` §3. Separately, production has not deployed from this repository since 2026-02-01 (§4), so no phase here is live until that is fixed.

### Verification (actual output, local `dist/` via `npx serve`)

```
/bg/ -> 78086 bytes        <title>E&amp;P Systems - AI Агенция от София | AI Решения за Бизнеса</title>  canonical /bg/   lang="bg"  <h1>Изграждаме
/en/ -> 74265 bytes        <title>E&amp;P Systems - AI Agency from Sofia | AI Solutions for Business</title>  canonical /en/  lang="en"  <h1>We build
/bg/services/ai-websites -> 49270 bytes   <title>AI Уеб Сайтове - E&amp;P Systems</title>  canonical self  <h1>Сайт, който разговаря с клиентите ви.
/bg/pricing -> 37220 bytes <title>Цени - E&amp;P Systems</title>  canonical self  <h1>Просто, прозрачно ценообразуване
--- status codes
/bg/ 200  /en/ 200  /bg/services/ai-websites 200  /bg/pricing 200
/bg/does-not-exist  404  <title>Страницата не е намерена - E&amp;P Systems</title> robots=noindex <h1>404
/de/                404  (same 404 page)
/en/blog/nope       404  (same 404 page)
/services/ai-websites 404 locally; on Vercel the new rule 308s it to /bg/services/ai-websites
[verify-prerender] OK — 60 routes … + 404.html checks
```

`vercel.json` redirects cannot be exercised by the local static server; they are validated by JSON parse and will be confirmed on the first preview deployment.

## Phase 4 — Structured data

**Status: PASS (verified locally, committed).**

### Inventory before (from the prerendered HTML, 60 routes)

`ProfessionalService+Organization` ×60 (sitewide), `Person` ×128, `WebSite` ×60 (with a SearchAction), `ItemList` ×60, `BreadcrumbList` ×48, `Article` ×10, `CollectionPage` ×8, `FAQPage` ×10, `Service` ×10. No `LocalBusiness` type literal; 12 routes without breadcrumbs (home, about, blog, contact, pricing, privacy-policy × 2 locales); `Article.author` was a bare `{"@id"}` reference to a Person declared in a different script block — fine for graph-aware parsers, a dangling reference for anything that validates the Article block alone (Google requires `author.name`).

### What changed

- `index.html` — the single entity `#organization` is now typed `["Organization", "LocalBusiness", "ProfessionalService"]` with `PostalAddress` (Sofia, BG), `telephone`, `email`, `priceRange`, `currenciesAccepted`, `knowsLanguage`, `contactPoint`, `areaServed`, founders, `sameAs`. No street address or opening hours were invented — none are published anywhere on the site (see `SEO-DECISION.md` §5). Founder `Person.url` now points at the team profile pages. The `WebSite.potentialAction` SearchAction was removed: the blog has no `?q=` search, so the claim was false.
- `src/pages/BlogPost.tsx` — `Article.author` is a full Person (`@type`, `@id`, `name`, `url`), `publisher` carries `@id` + `logo`, `image` falls back to the logo when a post has no cover.
- `About`, `Blog`, `Contact`, `Pricing`, `PrivacyPolicy` — now pass breadcrumbs to `SEOHead`, so `BreadcrumbList` is on every non-home route (58/60).
- `scripts/verify-prerender.mjs` — JSON-LD validator: every block parses and has `@context`/`@type`; no duplicate blocks; every reference-only `{"@id"}` resolves on the same page; `#organization` has both `Organization` and `LocalBusiness` plus name/url/telephone/email/logo/image/priceRange/PostalAddress/sameAs; exactly one `WebSite` without SearchAction; exactly one well-formed `BreadcrumbList` per non-home page whose last item is the page itself; one `Article` per post with headline ≤ 110 chars, ISO dates, `author.name`, image, publisher name + logo, `mainEntityOfPage`, `inLanguage`; `Service` + `FAQPage` shape on service pages; one Person entity per team profile.

### Verification (actual output)

```
[verify-prerender] OK — 60 routes prerendered; unique title + description on each;
canonical, lang, single visible <h1>, OG/Twitter and reciprocal hreflang verified.
TYPE COUNTS: Organization+LocalBusiness+ProfessionalService ×60, Person ×128, WebSite ×60,
ItemList ×60, BreadcrumbList ×58, Article ×10, CollectionPage ×8, FAQPage ×10, Service ×10
ROUTES WITHOUT BreadcrumbList: /bg/, /en/ (by design)   PARSE ERRORS: none
Definition-of-done block: /bg/ 78722 B, /en/ 74901 B, /bg/services/ai-websites 49906 B,
/bg/pricing 38218 B — distinct titles, self-canonicals, visible <h1>, /en/ lang="en"; unknown URL → 404
```

Sample `Article` (`/en/blog/n8n-claude-api-stack`): author `{Person, #person-emil, "Emil Dermendzhiev", /en/about/team/emil-dermendzhiev}`, publisher `{Organization, #organization, logo}`, image = cover JPG, `datePublished 2026-04-18`, `inLanguage en-US`.

## Phase 5 — GEO layer

**Status: PASS (verified locally, committed).**

### What existed

- `public/llms.txt` — good overview, but stale against the new routes (team profiles, case studies, resources, blog categories) and silent on pricing.
- Service pages already had a 5-question FAQ with `FAQPage` JSON-LD (`ServiceFAQ`), answer-first and well written — but none asked the buyer's first question, price. The pricing page had no FAQ at all.
- FAQ answers are always in the DOM (collapsed via CSS), so non-JS crawlers read them.

### What changed

- **Buyer price question on every service page** (`servicePages.<slug>.faq.items.5`, BG written in Bulgarian, EN separately): "Колко струва изработка на онлайн магазин?", "Колко струва AI автоматизация за малък бизнес?", "Колко струва персонален AI агент?", "Колко струва AI SEO оптимизация на месец?", "Колко струва изработка на AI уеб сайт?" — each answered in the first sentence with the tiers published on the pricing page (no new prices invented).
- **Pricing page FAQ** (`pricing.faq`, 6 questions × 2 locales): website cost, online-store cost, SEO per month, AI automation cost, "are prices final?", delivery time — rendered with `FAQAccordion` and marked up as `FAQPage`.
- `src/hooks/useFaqSchema.ts` — one idempotent FAQPage injector (`faqItemsFromBundle` + `useFaqSchema`) used by `ServiceFAQ` and `Pricing`; `ServiceFAQ` no longer hard-codes question counts. `FAQAccordion` buttons expose `aria-expanded`.
- `public/llms.txt` — rewritten: BG + EN URLs per service, a "Pricing (starting points)" section with the published tiers and delivery times, team profile URLs, case studies, resources, blog categories, citation guidance for BG vs EN, last-updated date, and a note that all pages are static HTML with FAQPage blocks.
- `scripts/verify-prerender.mjs` — gate: every service page and `/pricing` must carry exactly one `FAQPage` with ≥ 5 questions, each ending in "?", each answer ≥ 40 chars, at least one price question, and the first question's text present in the page body (not JSON-LD only); every URL in `dist/llms.txt` must resolve to a built route or file.

### Verification (actual output)

```
[verify-prerender] OK — 60 routes prerendered; unique title + description on each; canonical, lang,
single visible <h1>, OG/Twitter and reciprocal hreflang verified.
FAQPage ×12 (5 services × 2 locales + pricing × 2); /bg/pricing 6 Qs, price Q in body, answer 306 chars;
/bg/services/ai-ecommerce 6 Qs, "Колко струва изработка на онлайн магазин?" in body, answer 353 chars
dist/llms.txt == public/llms.txt, 34 URLs, all resolve
Definition-of-done block: /bg/ 78722 B, /en/ 74901 B, /bg/services/ai-websites 52206 B, /bg/pricing 49324 B —
distinct titles, self-canonicals, visible <h1>, /en/ lang="en"; unknown URL → 404
```

`robots.txt` left as `User-agent: * / Allow: /` — AI crawlers are already permitted; explicitly blocking training bots is a policy call, not made here.

## Phase 6 — Performance

**Status: PASS (re-measured, committed).**

### Re-measurement first

`audit-performance.json` (pre-fix, live site): mobile average 75 (min 58 on `/bg/`), LCP average 6.2 s (max 13.5 s); desktop average 95. Those numbers were taken against the client-rendered shell, so they were re-measured against the prerendered `dist/` before changing anything (Lighthouse 12.8, simulated mobile, local static server):

| Route | Perf | FCP | LCP | Bytes | Top causes |
|---|---|---|---|---|---|
| /bg/ | 66 | 3.4 s | 12.7 s | 3,924 KB | images 3.2 MB oversized, fonts block 1.4 s, unused JS 172 KB |
| /bg/about | 64 | 3.4 s | 16.1 s | 2,787 KB | one 1.9 MB headshot rendered at 160 px |
| /bg/services/ai-websites | 74 | 3.4 s | 4.5 s | 510 KB | fonts block 1.4 s, unused JS |

Real regressions, not shell artifacts: a 1,937 KB PNG headshot and 500 KB partner logos (one 5000×5000) displayed at 160 px / ~100 px; render-blocking Google Fonts CSS; one 837 KB JS bundle (235 KB gz) holding every page and every blog post.

### What changed

- `scripts/optimize-images.mjs` (+ `npm run optimize:images`, `sharp` devDependency) — WebP variants sized to their display budget: `team/emil.png` 1,937 KB → 17 KB, `partners/discipline.png` 498 KB → 2 KB, `partners/infiniti.png` 523 KB → 24 KB, `logo.png` 621 KB → 189 KB (og:image, kept PNG). Originals kept for the static JSON-LD. `<img>` tags now carry `width`/`height`, `loading="lazy"`/`decoding="async"` below the fold and `fetchPriority="high"` on the profile hero.
- `index.html` — Google Fonts stylesheet loads via `preload` + media-swap with a `<noscript>` fallback: render-blocking time 1.4 s → 0.
- `src/App.tsx`, `src/main.tsx` — route-level code splitting with React Router's data router (`createBrowserRouter` + `lazy` routes). `main.tsx` waits for the router to load the current route's chunk before mounting, so prerendered HTML is never replaced by a fallback. Main chunk 837 KB → 504 KB raw (235 → 154 KB gz); blog MDX (133 KB) now loads only on blog pages; home downloads ~208 KB gz of JS instead of 235 KB.
- `scripts/generate-blog-covers.mjs` (+ `npm run generate:covers`) — the gate's new image check found every post's `og:image` / `Article.image` pointed at a file that never existed; ten branded placeholder covers were generated (BG posts got `-bg.jpg` files so titles match the language). See `SEO-DECISION.md` §6.
- `scripts/verify-prerender.mjs` — every local `<img src>` must exist and be ≤ 250 KB; every `og:image` must exist and be ≤ 400 KB.

### Verification (actual output)

Mobile, same three routes, before → after:

| Route | Perf | FCP | LCP | TBT | CLS | Bytes |
|---|---|---|---|---|---|---|
| /bg/ | 66 → **81** | 3.4 → 2.4 s | 12.7 → **3.5 s** | 159 → 298 ms | 0.010 → 0.011 | 3,924 → 492 KB |
| /bg/about | 64 → **91** | 3.4 → 2.3 s | 16.1 → **2.5 s** | 192 → 188 ms | 0.060 → 0.060 | 2,787 → 483 KB |
| /bg/services/ai-websites | 74 → **81** | 3.4 → 2.5 s | 4.5 → 3.7 s | 202 → 253 ms | 0.027 → 0.022 | 510 → 518 KB |

Desktop `/bg/`: 98 (FCP 0.8 s, LCP 1.0 s, TBT 0, CLS 0) vs 86 / LCP 2.5 s in the old audit. Remaining opportunity on every page is unused framework JS (138–167 KB); the about page's 0.06 CLS comes from one section and was identical before this pass. Both are logged in `SEO-DECISION.md` §7.

```
[verify-prerender] OK — 60 routes prerendered; unique title + description on each; canonical, lang,
single visible <h1>, OG/Twitter and reciprocal hreflang verified.
Definition-of-done block: /bg/ 80875 B, /en/ 77054 B, /bg/services/ai-websites 53656 B, /bg/pricing 50680 B —
distinct titles, self-canonicals, visible <h1>, /en/ lang="en"; unknown URL → 404
Client boot (puppeteer, lazy routes): /en/pricing, /bg/, /en/blog/category/ai-seo — 1 canonical, 1 og:title,
1 description, h1 visible, no page errors
```

## Status at the end of the loop

All six phases are committed on `seo/prerender-and-technical-seo` and the definition-of-done block passes. Nothing here is live until the items in `SEO-DECISION.md` are actioned — above all §4 (production is not deploying from this repository) and §1 (first Vercel preview build exercises the `@sparticuz/chromium` path).

## Post-loop — Vercel preview build (first real Linux run)

Pushing the branch triggered a preview build on Vercel project `ep-systems-website` (linked to this repo; not the project that serves the domain). It **failed**. Reproduced in Docker with the same flow (`pnpm install --frozen-lockfile` + `pnpm run build`, `VERCEL=1`):

1. `ERR_PNPM_OUTDATED_LOCKFILE` — `pnpm-lock.yaml` was stale (Vercel uses pnpm because that lockfile exists; it predated puppeteer, the prerender plugin, sharp and sparticuz). Regenerated, plus `pnpm.overrides.puppeteer` so the prerender plugin gets puppeteer 22 instead of its declared `^1.7.0`.
2. `/tmp/chromium: error while loading shared libraries: libnss3.so` — `@sparticuz/chromium` extracts its bundled libraries only when it detects a Node 20 Lambda runtime. `vite.config.ts` now sets that hint on Linux.

```
Done in 10s using pnpm v9.15.9
[vite-plugin-prerender] All routes rendered successfully!
[verify-prerender] OK — 60 routes prerendered; unique title + description on each; canonical, lang, single visible <h1>, OG/Twitter and reciprocal hreflang verified.
BUILD_EXIT=0   dist/404.html present   /en/pricing <title>Pricing - E&P Systems</title>
```

Local Windows build unaffected (uses puppeteer's own Chrome). Definition-of-done block unchanged from Phase 6.
