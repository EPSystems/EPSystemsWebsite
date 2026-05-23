# Roadmap: E&P Systems Agency Website

## Milestones

- ✅ **v1.0 MVP** - Phases 1-4 (shipped 2026-03-25)
- ✅ **v1.1 CTA Forms** - Phases 5-7 (shipped 2026-03-25)
- 🔄 **v2.0 AI Agency** - Phases 8-10 (retroactive: verify shipped + close gaps)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) - SHIPPED 2026-03-25</summary>

- [x] Phase 1: Router Foundation (2/2 plans) - completed 2026-03-24
- [x] Phase 2: i18n Infrastructure (2/2 plans) - completed 2026-03-25
- [x] Phase 3: Full Content Translation (2/2 plans) - completed 2026-03-25
- [x] Phase 4: New Pages and Content (3/3 plans) - completed 2026-03-25

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 CTA Forms (Phases 5-7) - SHIPPED 2026-03-25</summary>

- [x] Phase 5: Form Infrastructure (2/2 plans) - completed 2026-03-25
- [x] Phase 6: Form UI and States (1/1 plan) - completed 2026-03-25
- [x] Phase 7: CTA Conversion (1/1 plan) - completed 2026-03-25

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

### 🔄 v2.0 AI Agency (Phases 8-10) - RETROACTIVE

> **Mode: Retroactive.** The AI-agency repositioning, MDX blog engine, and SEO/GEO + analytics
> layer already shipped on `origin/main` after v1.1. These phases do **not** build features from
> scratch — phase work is (1) confirm each shipped capability works end-to-end via
> `/gsd:verify-work`-style auditing, and (2) build only the 6 `(GAP → build)` items via normal
> planning. Dependencies reflect **verification order**, not build order — all the code already
> coexists.

- [ ] **Phase 8: AI-Agency Repositioning** - Verify BG-first homepage, 5 AI service pillars, 3 industry verticals, services hub, navbar dropdowns, pricing/about/contact/privacy
- [ ] **Phase 9: Content & Blog Engine** - Verify MDX engine, 10 bilingual posts, cornerstones, related posts, category filter, TL;DR + hub-links; build reading-time display (BLOG-10)
- [ ] **Phase 10: SEO/GEO, Analytics & Hardening** - Verify canonical/hreflang, sitemap, robots/llms.txt, JSON-LD, GA4 + Consent Mode v2; build per-page Service schema, Search Console verify, hCaptcha, modal animations

## Phase Details

### Phase 8: AI-Agency Repositioning
**Goal**: The shipped AI-agency repositioning is verified working end-to-end — BG-first defaulting, the agency homepage, five AI service pillar pages, the services hub, three industry verticals, navbar dropdowns, and the pricing/about/contact/privacy pages all render correctly and bilingually. (No gaps in this phase; all requirements are verify-type.)
**Depends on**: v1.1 complete (Phases 5-7 shipped)
**Requirements**: REPO-01, REPO-02, REPO-03, REPO-04, REPO-05, REPO-06, REPO-07, REPO-08, REPO-09
**Success Criteria** (what must be TRUE):
  1. Visiting `/` redirects to `/bg/` and the homepage shows the AI-agency positioning (Hero, Why Us, Results, Testimonials, TrustedBy, Team, CTA) in Bulgarian; switching to `/en/` shows the same content in English.
  2. All five AI service pages resolve at `/:lang/services/{ai-websites, ai-automation, ai-agents, ai-seo, ai-ecommerce}`, each rendering hero, features, process, personas, pricing, FAQ, case-study, and related sections in both locales; the services hub at `/:lang/services` links to all five.
  3. All three industry verticals resolve at `/:lang/industries/{insurance, ecommerce, fitness}` and render bilingually.
  4. The navbar exposes the AI-pillar dropdown and industries menu in both languages, and the mobile menu opens and navigates correctly.
  5. The pricing (`/:lang/pricing`), about/team (`/:lang/about`), contact (`/:lang/contact`), and privacy-policy (`/:lang/privacy-policy`) pages all load and render bilingually.
**Plans**: TBD
**Recommended execution**: `/gsd:verify-work`-style auditing for all nine reqs (all verify-type; no gap items to build).
**UI hint**: yes

### Phase 9: Content & Blog Engine
**Goal**: The shipped MDX blog engine is verified working end-to-end — posts render from `content/blog/` with parsed frontmatter, the index and category filter work, related posts and cornerstone/TL;DR/hub-link signals are present, and EN↔BG pairing is wired — and the remaining gap (reading-time display, BLOG-10) is closed.
**Depends on**: Phase 8
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07, BLOG-08, BLOG-09, BLOG-10
**Success Criteria** (what must be TRUE):
  1. The blog index at `/:lang/blog` lists the locale's posts and the category filter narrows the list to the selected category; ten posts exist as five EN/BG pairs, each carrying title, excerpt, date, author, category, tags, and readingTime.
  2. A post page at `/:lang/blog/:slug` renders its MDX with auto-linked headings and breadcrumbs, shows three category-matched related posts, and links to its EN/BG counterpart via `alternateSlug`.
  3. The eight cornerstone-flagged posts carry the `cornerstone` frontmatter, contain TL;DR blocks structured for AI-citation extraction, and embed contextual hub-links to relevant service/industry pages.
  4. **(GAP — BLOG-10)** Each post page visibly displays its reading time (sourced from the existing frontmatter `readingTime`), in both locales.
**Plans**: TBD
**Recommended execution**: `/gsd:verify-work`-style auditing for BLOG-01…BLOG-09 (verify-type); normal planning for BLOG-10 (gap — render reading time on post pages).
**UI hint**: yes

### Phase 10: SEO/GEO, Analytics & Hardening
**Goal**: The shipped SEO/GEO and analytics layer is verified working end-to-end — canonical/hreflang injection, generated sitemap, robots.txt, llms.txt, site- and per-page JSON-LD, per-page meta/OG/Twitter, GA4 with Consent Mode v2 and cookie consent, and Vercel Analytics/Speed Insights — and the remaining gaps are closed: per-page Service schema (SEO-09), Search Console verification (SEO-10), hCaptcha on the contact form (HARD-01), and ContactModal Framer Motion animations (HARD-02).
**Depends on**: Phase 9
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10, ANLY-01, ANLY-02, ANLY-03, ANLY-04, HARD-01, HARD-02
**Success Criteria** (what must be TRUE):
  1. Each page injects a canonical URL against `https://www.epsystems.org`, bg↔en hreflang pairs plus `x-default → /bg/`, and a per-page `<title>`, meta description, Open Graph, and Twitter Card via `usePageMeta`/`SEOHead`; the generated `sitemap.xml` (~40 URLs with the documented priority scheme), `robots.txt` (referencing the sitemap), and `llms.txt` (agency/services/industries/founders/cornerstones with citation guidance) are all present and valid.
  2. Site-level JSON-LD in `index.html` exposes Organization/ProfessionalService, WebSite, and both founder Person entities; per-page JSON-LD adds Article on posts, BreadcrumbList site-wide, FAQPage on service pages, and the Service ItemList on the homepage — all validating in a structured-data tester.
  3. GA4 (`G-ZBK171SEN6`) loads via gtag and reports pageviews only after consent; Consent Mode v2 defaults to deny-all and restores stored consent for returning users; the bilingual cookie-consent banner persists the choice and updates GA4 consent state on accept/decline; Vercel Analytics and Speed Insights report in production.
  4. **(GAP — SEO-09, SEO-10)** Each individual service page injects its own dedicated Service schema (not just the homepage ItemList), and the Google Search Console verification meta tag is active (uncommented) in `index.html`.
  5. **(GAP — HARD-01, HARD-02)** Submitting the contact form triggers an hCaptcha challenge (layered on the existing honeypot, gated to protect conversions) before send, and the ContactModal opens/closes with Framer Motion entrance/exit animations instead of an instant portal toggle.
**Plans**: TBD
**Recommended execution**: `/gsd:verify-work`-style auditing for SEO-01…SEO-08 and ANLY-01…ANLY-04 (verify-type); normal planning for SEO-09, SEO-10, HARD-01, HARD-02 (gaps — build Service schema, activate Search Console tag, add hCaptcha, animate modal).
**UI hint**: yes

## Progress

| Phase                                  | Milestone | Plans Complete | Status      | Completed  |
| -------------------------------------- | --------- | -------------- | ----------- | ---------- |
| 1. Router Foundation                   | v1.0      | 2/2            | Complete    | 2026-03-24 |
| 2. i18n Infrastructure                 | v1.0      | 2/2            | Complete    | 2026-03-25 |
| 3. Full Content Translation            | v1.0      | 2/2            | Complete    | 2026-03-25 |
| 4. New Pages and Content               | v1.0      | 3/3            | Complete    | 2026-03-25 |
| 5. Form Infrastructure                 | v1.1      | 2/2            | Complete    | 2026-03-25 |
| 6. Form UI and States                  | v1.1      | 1/1            | Complete    | 2026-03-25 |
| 7. CTA Conversion                      | v1.1      | 1/1            | Complete    | 2026-03-25 |
| 8. AI-Agency Repositioning             | v2.0      | 0/?            | Not started | -          |
| 9. Content & Blog Engine               | v2.0      | 0/?            | Not started | -          |
| 10. SEO/GEO, Analytics & Hardening     | v2.0      | 0/?            | Not started | -          |
