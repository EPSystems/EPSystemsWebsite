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
