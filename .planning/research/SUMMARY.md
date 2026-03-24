# Project Research Summary

**Project:** E&P Systems — Bilingual Agency Website
**Domain:** Bilingual multi-page React SPA (i18n + routing addition to existing site)
**Researched:** 2026-03-24
**Confidence:** HIGH

## Executive Summary

E&P Systems has an existing React 19 + Vite + TypeScript SPA with a strong Brutalist design identity. The site currently has no router — all navigation is hash-anchor scrolling — and all content is hardcoded in English. The two core engineering tasks are: (1) add client-side routing with React Router v7 in declarative mode, using language-prefixed URLs (`/en/...`, `/bg/...`) as the single source of truth for locale, and (2) layer in react-i18next backed by JSON translation files to deliver full EN/BG bilingual content. These two additions are tightly coupled by design: the `:lang` URL param must drive both routing and i18next simultaneously. Done correctly, the result is a fully bilingual, multi-page agency website where every URL is shareable, language-specific, and independently indexable by search engines.

The recommended approach is incremental migration in four tightly sequenced phases. Phase 1 installs the router shell without changing any visible behavior. Phase 2 wires up i18n for nav/footer only. Phase 3 translates all page content. Phase 4 adds the new pages (service detail pages, team/about page). This phased order is non-negotiable: the router must precede i18n because the `:lang` param is how i18n detects locale, and content translation must precede new pages so the infrastructure is proven before new routes are added. Attempting a big-bang migration risks regressions across a codebase that currently has 11+ hash navigation links and content spread across both JSX components and TypeScript data files.

The primary risks are (1) broken hash navigation when React Router is introduced — there are at least 11 `#anchor` links that must be migrated to scroll handlers on day one, (2) incomplete string extraction leaving English fragments in service cards, case studies, and `<title>` tags, and (3) Bulgarian text running 15–30% longer than English breaking the tight Brutalist layout. All three are well-understood and have clear prevention strategies. The most consequential architectural decision — URL-prefixed locale over state/localStorage — must be made before any routing code is written, because retrofitting it later requires a full routing rewrite.

## Key Findings

### Recommended Stack

The stack additions are a tight, well-supported set: React Router v7.13.2 (declarative mode), i18next 25.10.9, react-i18next 16.6.6, i18next-browser-languagedetector 8.2.1, and i18next-resources-to-backend 1.2.1. All are fully compatible with the project's existing React 19.2.4 and TypeScript 6.0.2. The version constraints have been verified via npm. No build tooling changes are required — React Router declarative mode has no Vite plugin requirement, and resources-to-backend uses Vite's native dynamic imports instead of adding an HTTP fetch layer. See `.planning/research/STACK.md` for full alternatives analysis.

**Core technologies:**
- `react-router@7.13.2`: Client-side routing with `/:lang/*` URL structure — v7 consolidates react-router-dom into a single package, declarative mode is the correct choice for a static SPA (no SSR, no loaders)
- `i18next@25.10.9`: Translation engine — dominant runtime (2.1M weekly downloads), namespace support, TypeScript-native
- `react-i18next@16.6.6`: React bindings — `useTranslation` hook, `Trans` for JSX interpolation, Suspense support
- `i18next-browser-languagedetector@8.2.1`: Auto-detects user language from navigator/localStorage on first visit
- `i18next-resources-to-backend@1.2.1`: Lazy-loads translation JSON via Vite dynamic imports — eliminates extra HTTP fetches for a static site

### Expected Features

The feature picture is clear: the site needs a credible multi-page bilingual presence. The Brutalist design and Framer Motion animations are existing strengths to preserve and extend. The must-have list is constrained and achievable in a single focused effort. See `.planning/research/FEATURES.md` for the full prioritization matrix and competitor analysis.

**Must have (table stakes — P1):**
- React Router multi-page structure — foundational for everything else; without this nothing below is possible
- Bilingual i18n (EN/BG) with language switcher — the explicit core requirement of this project
- Dedicated service pages with unique URLs — SEO surface area and shareability; currently anchor-scroll only
- Team/About page — clients hire people, not logos; trust signal missing entirely from current site
- Updated case studies with real outcomes — proof of delivery; current content is too generic
- Fix all placeholder/broken links — minimum credibility bar
- Accessibility basics (alt text, semantic HTML, focus styles) — EU Accessibility Act 2025 compliance

**Should have (competitive — P2):**
- Per-page SEO meta tags with react-helmet — requires routing + i18n to be in place first
- Technology stack showcase — quick win for technical prospects
- Page transition animations with Framer Motion AnimatePresence — premium feel, extends existing system
- Interactive process/methodology section — differentiator from generic templates

**Defer (v2+):**
- Blog/Insights section — empty blog damages more than it helps; only with committed content strategy
- Contact form with email delivery — requires backend/serverless; start with prominent email/phone
- CMS integration — over-engineering for current team size and update frequency
- Additional languages beyond EN/BG — build the infrastructure to support it, don't implement it

### Architecture Approach

The architecture centers on a single foundational pattern: the URL is the single source of truth for language. `BrowserRouter` with `/:lang/*` routes provides language-prefixed URLs. A custom `useLanguageSync` hook reads the `:lang` param and calls `i18next.changeLanguage()` to keep the translation engine in sync. A `Layout` component provides the Navbar + `<Outlet />` + Footer shell shared across all pages. A `LocalizedLink` wrapper around React Router's `<Link>` auto-prepends the current language prefix to every internal link, eliminating an entire class of "wrong language" navigation bugs. Translation files live in `public/locales/{lang}/{namespace}.json`, organized by page namespace, and are loaded at runtime via i18next-resources-to-backend. Existing section components (`Hero`, `Services`, `CaseStudies`, etc.) are unchanged in location and responsibility — they gain `useTranslation()` calls internally but are not restructured. See `.planning/research/ARCHITECTURE.md` for full component map, code patterns, and directory structure.

**Major components:**
1. `BrowserRouter` + `/:lang/*` route tree — URL parsing, history management, language routing
2. `LanguageLayout` (new) — extracts `:lang`, calls `useLanguageSync`, renders `Layout` with `<Outlet />`
3. `Layout` (new) — shared Navbar + page content area + Footer shell
4. `useLanguageSync` hook (new) — syncs URL `:lang` param to i18next, updates `document.documentElement.lang`
5. `LocalizedLink` (new) — auto-prepends current `:lang` to all internal links
6. `LanguageSwitcher` (new) — navigates to same page in other locale via `useNavigate`
7. `HomePage` (new) — composes existing section components under the new routing structure
8. `ServicePage` (new) — individual service detail route
9. `TeamPage` (new) — team member profiles, bilingual

### Critical Pitfalls

Six critical pitfalls are identified, all specific to this codebase and well-evidenced. See `.planning/research/PITFALLS.md` for recovery cost estimates, phase mappings, and the complete "Looks Done But Isn't" checklist.

1. **Hash navigation broken by React Router** — The existing 11+ `href="#anchor"` links in Navbar, Footer, Hero, and CTA will all break when BrowserRouter is introduced. Must be audited and migrated to scroll handlers (`scrollIntoView`) or `react-router-hash-link` in the same commit that installs the router — not separately.

2. **Incomplete string extraction leaving English fragments** — Content is spread across JSX, `services.ts`, `CaseStudies.tsx` highlight arrays, `index.html` meta tags, and alt text. A dedicated grep-based string audit is mandatory before any translation work begins. `services.ts` data must become language-agnostic (IDs and keys only); strings move to JSON files.

3. **Locale not reflected in URL structure** — Storing language in state/localStorage only is the highest-recovery-cost pitfall (essentially a routing rewrite). The `:lang` URL prefix decision must be made before any routing code is written. This is the only correct approach for a bilingual site where SEO and shareability matter.

4. **Bulgarian text expansion breaking Brutalist layout** — Bulgarian runs 15–30% longer than English. The tight Brutalist aesthetic (hard borders, fixed-width cards, Marquee animation) makes overflow visually catastrophic, not subtle. Every component must be visually QA'd in Bulgarian. The Marquee animation's `-50%` translateX endpoint will break with longer Bulgarian content and needs recalculation.

5. **SPA SEO blindspot for new pages** — Adding service pages creates routes that serve empty `<div id="root"></div>` to crawlers. For an agency offering SEO services, having unindexable pages is a credibility problem. Add `vite-plugin-prerender` or `vite-ssg` in the same phase as new page creation, not deferred. At minimum, use react-helmet for per-page `<title>` and `<meta description>`.

6. **Scroll restoration loss on route changes** — SPAs don't restore scroll position by default. A `ScrollToTop` component must be added with the router. Also verify Framer Motion `whileInView` animations replay correctly on route return.

## Implications for Roadmap

Based on the dependency graph confirmed across all four research files, the work has a strict sequential backbone with one parallelizable branch. The architecture explicitly defines four phases in order. The routing layer must precede i18n (the `:lang` param is the i18n trigger), and both must precede new pages. The pitfall research confirms this order by identifying which pitfalls belong to which phase.

### Phase 1: Router Foundation

**Rationale:** Router is the dependency root for everything else. No i18n URL integration, no new pages, and no language switcher are possible without the routing layer. This phase also resolves the most dangerous pitfall (hash navigation conflict) immediately — before any other work is layered on top.

**Delivers:** Working multi-page URL structure at `/en` and `/bg` routes, with the app behaving identically to the current site visually. Hash navigation migrated to scroll handlers. `ScrollToTop` implemented. SPA fallback configured on the deployment host.

**Addresses:** React Router multi-page structure (P1), placeholder link fixes (P1 subset)

**Avoids:** Hash navigation conflict (Pitfall 1), scroll restoration loss (Pitfall 4), locale not in URL (Pitfall 5 — architectural commitment made here)

**Research flag:** Standard patterns — React Router declarative mode setup is well-documented. No additional research phase needed.

### Phase 2: i18n Infrastructure and Nav/Footer

**Rationale:** i18n wiring must come before content translation, and it is most safely validated on the smallest surface area first (Navbar and Footer strings are the smallest scope, highest visibility). The `:lang` param from Phase 1 is the i18n trigger — this phase activates it. The language switcher ships here as the primary feature users interact with.

**Delivers:** Working EN/BG language switcher in the Navbar. Navigation and footer content fully bilingual. `useLanguageSync` hook operational. i18next initialized and configured. Translation JSON file structure established. Font Cyrillic support verified.

**Addresses:** Bilingual i18n system (P1), language switcher (P1)

**Uses:** i18next@25.10.9, react-i18next@16.6.6, i18next-browser-languagedetector@8.2.1, i18next-resources-to-backend@1.2.1

**Avoids:** Locale not in URL (Pitfall 5 — enforced by Phase 1 architecture), flash of untranslated content (initialize i18next before ReactDOM.createRoot)

**Research flag:** Standard patterns — react-i18next setup with `useTranslation` and namespace-per-page is thoroughly documented. No additional research needed.

### Phase 3: Full Content Translation

**Rationale:** With infrastructure proven on nav/footer, the full string extraction can proceed safely. This phase is the most labor-intensive — the string audit alone is a dedicated task. Doing this before new pages ensures the translation pipeline is battle-tested before being applied to brand-new components.

**Delivers:** Complete EN/BG bilingual homepage. All section components (`Hero`, `Services`, `ServiceDetail`, `CaseStudies`, `CTA`) use `t('key')` calls. `services.ts` refactored to language-agnostic keys. `index.html` title and meta description dynamic via react-helmet. Translation JSON files complete for both languages.

**Addresses:** Bilingual content throughout site (P1), per-page SEO meta tags (P2 foundation)

**Avoids:** Incomplete string extraction (Pitfall 2 — dedicated audit task), Bulgarian text expansion breaking layout (Pitfall 3 — visual QA of every component in Bulgarian is exit criterion for this phase)

**Research flag:** Standard patterns for string extraction. Visual QA of Bulgarian layout is execution work, not research.

### Phase 4: New Pages and Content

**Rationale:** With routing proven and full translation infrastructure operational, new pages can be built against the established patterns. Service pages and the team page both require routing (Phase 1) and bilingual support (Phases 2-3). This phase also handles real content — case studies, team bios, service descriptions — which is content work that runs in parallel with component development.

**Delivers:** Individual service pages at `/:lang/services/:serviceId`. Team/About page at `/:lang/team`. Updated case studies with real outcomes and metrics. Navbar updated with links to all new pages. Pre-rendering configured for SEO. hreflang tags on all pages.

**Addresses:** Dedicated service pages (P1), Team/About page (P1), updated case studies (P1), SEO meta per page (P2), hreflang (P2)

**Avoids:** SPA SEO blindspot (Pitfall 6 — pre-rendering added in this phase, not deferred), accessibility gaps (audit all new pages)

**Research flag:** Pre-rendering configuration (`vite-plugin-prerender` or `vite-ssg`) may benefit from a focused research spike — the build config options have trade-offs and the right choice depends on hosting environment. Flag for research-phase during planning.

### Phase 5: Polish and Accessibility

**Rationale:** Polish layers (animations, micro-interactions, accessibility audit) are correctly deferred until all content and structure are stable. Accessibility audit in particular requires final components to be in place. Page transition animations require all routes to exist before AnimatePresence can be configured correctly.

**Delivers:** Page transition animations with Framer Motion AnimatePresence. Full accessibility audit (alt text, ARIA labels, keyboard navigation, color contrast). Mobile QA of language switcher. Any remaining Bulgarian layout tweaks from visual regression review.

**Addresses:** Page transitions (P2), accessibility compliance (P1 completion), technology stack showcase (P2)

**Avoids:** Framer Motion + React Router animation conflicts (use AnimatePresence with `mode="wait"` and unique page keys)

**Research flag:** Standard patterns — Framer Motion AnimatePresence with React Router is well-documented.

### Phase Ordering Rationale

- **Router before i18n:** The `:lang` URL param is the trigger that feeds i18next. You cannot implement URL-based locale detection without the router in place first.
- **Nav/footer i18n before full content translation:** Validates the entire i18n pipeline on a small, controlled surface. Catches setup errors (flash of untranslated content, missing font Cyrillic glyphs) before the scope expands to 10+ components.
- **Full translation before new pages:** New pages built against proven i18n patterns avoid repeating setup mistakes. Also ensures the string audit catches everything before surface area grows.
- **New pages before polish:** Polish must be applied to final components. Animating a component that will be restructured wastes effort.
- **Pitfall 1 (hash navigation) and Pitfall 5 (URL locale) are both Phase 1 decisions** — they cannot be deferred. Both require architectural commitments before any subsequent code is written.

### Research Flags

Needs research during planning:
- **Phase 4 (pre-rendering):** `vite-plugin-prerender` vs `vite-ssg` trade-offs depend on hosting environment and build pipeline. Current host is unknown — this decision needs a spike before Phase 4 planning is finalized.

Standard patterns (skip research-phase):
- **Phase 1 (React Router declarative mode):** Thoroughly documented, no ambiguity in the approach.
- **Phase 2 (react-i18next setup):** Official docs are comprehensive and the pattern (namespace-per-page, URL-driven language) is established.
- **Phase 3 (string extraction):** Mechanical work with clear tooling (`i18next-parser`, grep audit).
- **Phase 5 (Framer Motion + AnimatePresence):** Documented integration pattern.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified via npm CLI. Compatibility matrix confirmed against project's React 19.2.4 and TypeScript 6.0.2. Official docs consulted for all three core libraries. |
| Features | HIGH | Multiple independent sources (agency website studies, B2B best practice guides, competitor analysis). Feature list is conservative and well-grounded. |
| Architecture | HIGH | Patterns sourced from official React Router and react-i18next documentation. `useLanguageSync` and `LocalizedLink` patterns are established in the community. Architecture is grounded in the actual current codebase structure. |
| Pitfalls | HIGH | Pitfalls 1 and 2 verified by direct codebase inspection (Navbar.tsx hash links, services.ts English strings). Pitfalls 3–6 sourced from multiple independent i18n and SPA SEO references. |

**Overall confidence:** HIGH

### Gaps to Address

- **Hosting environment for SPA fallback and pre-rendering:** The current deployment host is unknown. SPA fallback configuration (redirecting all paths to `index.html`) and pre-rendering plugin choice depend on the host (Netlify, Vercel, GitHub Pages, Nginx, etc.). This must be confirmed before Phase 1 is executed and Phase 4 is planned.

- **Bulgarian translation sourcing:** Research confirms the technical i18n architecture but cannot assess the quality or availability of Bulgarian translations. If professional translation is needed (rather than in-house), this should be scoped as a content task that runs in parallel with Phase 3 component work, not as a dependency that blocks it.

- **Bricolage Grotesque Cyrillic coverage:** Research flags this as a risk (Bulgarian Cyrillic glyphs may not be included in the current Google Fonts load), but verification requires rendering actual Bulgarian text in the browser. This is an early Phase 2 exit criterion, not a blocker to starting.

- **Hosting SSL status:** SSL/HTTPS is a table-stakes requirement. Assumed to be in place given the site is live, but should be confirmed — especially if the host changes during this migration.

## Sources

### Primary (HIGH confidence)
- [React Router v7 Modes Documentation](https://reactrouter.com/start/modes) — declarative mode selection
- [React Router Declarative Mode Installation](https://reactrouter.com/start/declarative/installation) — setup patterns
- [React Router SPA Mode](https://reactrouter.com/how-to/spa) — BrowserRouter for static SPAs
- [react-i18next documentation](https://react.i18next.com/) — useTranslation, namespace loading
- [react-i18next Multiple Translation Files](https://react.i18next.com/guides/multiple-translation-files) — namespace-per-page pattern
- [npm registry](https://www.npmjs.com/) — all version numbers verified
- [Multilingual SEO URL Structure (Search Engine Journal)](https://www.searchenginejournal.com/multilingual-seo-url-structure/298747/) — subdirectory locale URL approach
- Codebase analysis: `Navbar.tsx`, `App.tsx`, `services.ts`, `index.html`, `CONCERNS.md` — direct hash link audit

### Secondary (MEDIUM confidence)
- [DEV Community: Best i18n Libraries 2026](https://dev.to/erayg/best-i18n-libraries-for-nextjs-react-react-native-in-2026-honest-comparison-3m8f) — ecosystem overview
- [Locize Blog: react-intl vs react-i18next](https://www.locize.com/blog/react-intl-vs-react-i18next/) — library comparison
- [LogRocket: React Router v7 modes](https://blog.logrocket.com/react-router-v7-modes/) — mode selection guidance
- [Caffeine Marketing: Top Software Dev Landing Pages](https://www.caffeinemarketing.com/blog/top-15-software-development-landing-page-designs) — feature expectations
- [Directive Consulting: B2B Website Best Practices 2026](https://directiveconsulting.com/blog/15-b2b-website-best-practices-for-2026-built-for-buyers-not-just-browsers/) — trust signals
- [Evil Martians: 100 Dev Tool Landing Pages Study](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025) — data-driven landing page analysis
- [DEV: Why SPAs Still Struggle with SEO (2025)](https://dev.to/arkhan/why-spas-still-struggle-with-seo-and-what-developers-can-actually-do-in-2025-237b) — SPA SEO pitfalls
- [20 i18n Mistakes in React Apps](https://www.translatedright.com/blog/20-i18n-mistakes-developers-make-in-react-apps-and-how-to-fix-them/) — pitfall catalog
- [Scroll Restoration in React Router](https://dev.to/tene/scroll-restoration-in-react-router-4gnm) — scroll handling patterns

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
