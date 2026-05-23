# Phase 08 — Verification Findings

> Log defects here as they are found. Trivial defects (broken link, missing
> translation key, wrong slug) are fixed inline in the same task. Substantial
> defects (missing page, broken feature) are logged here and flagged for a
> follow-up gap plan — do NOT silently rebuild.

## Build & Route Inventory (Plan 08-01)

- Build (`pnpm build`): **PASS** exit 0 — `prebuild` regenerated sitemap (40 URLs), `tsc` clean (no `error TS`), `vite build` transformed 2244 modules, `dist/index.html` produced.
  - Non-blocking warning: main JS chunk is 746 kB (gzip 227 kB) — over Vite's 500 kB advisory. Not a defect; potential future perf/code-split improvement (out of Phase 8 scope).

### Route inventory (`INVENTORY OK`, exit 0)

| # | Check | Result |
|---|-------|--------|
| 1 | Root redirect `/` → `/bg/` (`Navigate to="/bg/" replace` in App.tsx) | PASS |
| 2 | i18n default `lng: 'bg'` + `fallbackLng: 'bg'` (i18n/index.ts) | PASS |
| 3 | All 10 page routes wired in App.tsx (`/:lang`, services, services/:slug, industries/:slug, contact, pricing, about, privacy-policy, blog, blog/:slug) | PASS |
| 4 | Service slugs in ServicePage.tsx VALID_SLUGS (ai-websites, ai-automation, ai-agents, ai-seo, ai-ecommerce) | PASS |
| 5 | Industry slugs in Industry.tsx VALID_SLUGS (insurance, ecommerce, fitness) | PASS |
| 6 | Each route maps to an imported component | PASS |

**REPO-01 persistence note (informational, not a defect):** `src/i18n/index.ts` has **no** `i18next-browser-languagedetector` and **no** `localStorage` read (both confirmed absent). The active language is URL-driven only (via `useLanguageSync` on the `/:lang` segment). REPO-01's "returning-user preference persists" clause is satisfied only by URL/bookmark persistence, not by a detector. **Recommendation:** correct the REPO-01 wording in REQUIREMENTS.md to "locale persists via URL/bookmark," or add a language detector in a future milestone if true cross-visit persistence is desired.

## Core pages (Plan 08-02)

Verified in-browser via Playwright against `http://localhost:4173` (vite preview of the green `dist/`). Console note: 2 console errors on every page are `/_vercel/insights/script.js` + `/_vercel/speed-insights/script.js` 404s — expected in local preview (those endpoints exist only on Vercel). **Not a defect.** Corroborates ANLY-04 wiring (full verify deferred to Phase 10). A cookie-consent bar ("Приемам всички" / "Управление на предпочитания") renders on pages — corroborates ANLY-03 (full verify Phase 10).

### REPO-02 Homepage — PASS
- Base URL: `http://localhost:4173`. `/` → redirected to `/bg/` ✓ (corroborates REPO-01 in-browser).
- `/bg/`: 8 `<section>`s, footer present, no error boundary. Sections found: Hero, Services ("5 AI стълба…"), Results ("Реални цифри от реални клиенти."), Why Us ("Не сме просто агенция. Инженери сме…"), Testimonials ("Какво казват нашите клиенти"), Team ("Хората зад E&P Systems"), Footer.
- BG_HERO = `ИЗГРАЖДАМЕ AI СИСТЕМИ / КОИТО ПРАВЯТ БИЗНЕСА ВИ ПО-УМЕН.`
- `/en/`: 8 sections, footer, no error boundary, `document.documentElement.lang === 'en'`.
- EN_HERO = `WE BUILD AI SYSTEMS / THAT MAKE YOUR BUSINESS SMARTER.`
- Lang switch: **PASS** — `BG_HERO !== EN_HERO`, and `documentElement.lang` flips bg↔en.

### REPO-06 Navbar — PASS
- Desktop (1440×900) Services dropdown opens → 5 links: `/bg/services/{ai-websites,ai-automation,ai-agents,ai-seo,ai-ecommerce}` + all-services `/bg/services`. **PASS**
- Desktop Industries dropdown opens → 3 links: `/bg/industries/{insurance,ecommerce,fitness}`. **PASS**
- Bilingual labels: BG `Услуги`/`Индустрии` → EN `Services`/`Industries`; EN dropdown links point to `/en/services/{slug}`. **PASS**
- Mobile (390×844): `aria-label="Toggle menu"` opens the menu (Blog/About/Contact links present + Services/Industries accordions + cookie bar). **PASS**
- Mobile Services accordion expands → 5 service links; clicking `ai-agents` navigated to `/bg/services/ai-agents` (h1 "AI служител, който не спи.", not NotFound). **PASS**

### Standalone pages (REPO-07/08/09) — PASS (8/8)

| Route | locale | rendered? | heading captured | localized (bg≠en)? |
|-------|--------|-----------|------------------|--------------------|
| `/bg/pricing` | bg | yes | Просто, прозрачно ценообразуване | — |
| `/en/pricing` | en | yes | Simple, Transparent Pricing | yes (vs bg) |
| `/bg/about` | bg | yes | За E&P Systems (team present) | — |
| `/en/about` | en | yes | About E&P Systems | yes (heading differs) |
| `/bg/contact` | bg | yes | Нека поговорим (form present) | — |
| `/en/contact` | en | yes | Let's Talk | yes (vs bg) |
| `/bg/privacy-policy` | bg | yes | Политика за поверителност | — |
| `/en/privacy-policy` | en | yes | Privacy Policy | yes (vs bg) |

None rendered NotFound, blank, or an error boundary. **No defects found in Plan 08-02.**
