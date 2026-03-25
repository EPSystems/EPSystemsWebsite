# Roadmap: E&P Systems Agency Website

## Overview

Transform the existing single-page English-only React SPA into a fully bilingual (EN/BG), multi-page agency website. The work follows a strict dependency chain: routing must precede i18n (the URL language prefix drives translation), i18n infrastructure must be proven before full content translation, and all translation infrastructure must be operational before new pages are built against it. Four phases deliver the complete v1 scope.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Router Foundation** - Replace hash navigation with React Router and language-prefixed URL structure
- [x] **Phase 2: i18n Infrastructure** - Wire up bilingual translation system with language switcher on nav/footer (completed 2026-03-25)
- [x] **Phase 3: Full Content Translation** - Translate all existing page content to Bulgarian (completed 2026-03-25)
- [ ] **Phase 4: New Pages and Content** - Build service detail pages and team section, fully bilingual

## Phase Details

### Phase 1: Router Foundation
**Goal**: Users can navigate the site via real URLs with language prefixes, and all existing navigation continues to work
**Depends on**: Nothing (first phase)
**Requirements**: ROUT-01, ROUT-02, ROUT-03, ROUT-04, ROUT-05
**Success Criteria** (what must be TRUE):
  1. User can navigate to /en/ and /bg/ and see the homepage at both paths
  2. Visiting the root URL (/) redirects the user to a language-prefixed route
  3. All previously working anchor links (#services, #seo, etc.) scroll smoothly to their sections
  4. No broken or placeholder links exist anywhere on the site
  5. Page loads at the top when navigating between routes (scroll restoration works)
**Plans:** 2/2 plans complete

Plans:
- [x] 01-01-PLAN.md — Install React Router, create language-prefixed route structure with root redirect and 404 page
- [x] 01-02-PLAN.md — Migrate all hash links to smooth-scroll, remove placeholder links, verify navigation end-to-end

### Phase 2: i18n Infrastructure
**Goal**: Users can switch between English and Bulgarian, with nav and footer content translating immediately
**Depends on**: Phase 1
**Requirements**: BILN-01, BILN-02, BILN-03, BILN-07, CONT-03
**Success Criteria** (what must be TRUE):
  1. User can click a language switcher in the navbar to toggle between English and Bulgarian
  2. Switching language changes the URL prefix (/en/ to /bg/ or vice versa) and the navbar and footer display in the selected language
  3. Language preference persists when navigating between pages (URL prefix is maintained)
  4. Bulgarian text renders correctly with proper Cyrillic font support (no missing glyphs)
  5. Navbar supports multi-page routing with links to all site sections
**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — Install i18next, create EN/BG translation files, build language sync hook, add Cyrillic fallback font
- [x] 02-02-PLAN.md — Create language switcher component, translate Navbar and Footer via t() calls, verify end-to-end

### Phase 3: Full Content Translation
**Goal**: The entire existing site is fully bilingual -- every visible string appears in both English and Bulgarian
**Depends on**: Phase 2
**Requirements**: BILN-04, BILN-05, BILN-06, CONT-04
**Success Criteria** (what must be TRUE):
  1. User browsing in Bulgarian sees all homepage sections (Hero, Services, Case Studies, CTA, Marquee) in Bulgarian with no English fragments
  2. All service card titles, descriptions, and feature lists display in the selected language
  3. Browser tab title and meta description reflect the current language
  4. Existing content across all sections is reviewed and up-to-date (not placeholder text)
**Plans:** 2/2 plans complete

Plans:
- [x] 03-01-PLAN.md — Expand EN/BG translation JSON with all section keys, convert services.ts to i18n, wire Hero/Marquee/Services/CTA to t() calls
- [x] 03-02-PLAN.md — Wire CaseStudies/ServiceDetail/NotFound to t(), add dynamic meta tags, human-verify full translation quality

### Phase 4: New Pages and Content
**Goal**: Users can visit dedicated service pages and a team section, all fully bilingual and integrated into site navigation
**Depends on**: Phase 3
**Requirements**: SERV-01, SERV-02, SERV-03, SERV-04, CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. User can navigate to individual service pages at unique URLs (e.g., /en/services/seo, /bg/services/seo) with detailed content
  2. Service pages display full descriptions, features, and relevant content in both English and Bulgarian
  3. User can view a team section with member profiles, roles, and bios in both languages
  4. Navigation between service pages, team section, and homepage is seamless with consistent header/footer
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Router Foundation | 2/2 | Complete    | 2026-03-24 |
| 2. i18n Infrastructure | 2/2 | Complete    | 2026-03-25 |
| 3. Full Content Translation | 2/2 | Complete    | 2026-03-25 |
| 4. New Pages and Content | 0/0 | Not started | - |
