# Roadmap: E&P Systems Agency Website

## Overview

Transform the existing single-page English-only React SPA into a fully bilingual (EN/BG), multi-page agency website. The work follows a strict dependency chain: routing must precede i18n (the URL language prefix drives translation), i18n infrastructure must be proven before full content translation, and all translation infrastructure must be operational before new pages are built against it. Four phases deliver the complete v1 scope.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Router Foundation** - Replace hash navigation with React Router and language-prefixed URL structure
- [ ] **Phase 2: i18n Infrastructure** - Wire up bilingual translation system with language switcher on nav/footer
- [ ] **Phase 3: Full Content Translation** - Translate all existing page content to Bulgarian
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
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD

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
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Full Content Translation
**Goal**: The entire existing site is fully bilingual -- every visible string appears in both English and Bulgarian
**Depends on**: Phase 2
**Requirements**: BILN-04, BILN-05, BILN-06, CONT-04
**Success Criteria** (what must be TRUE):
  1. User browsing in Bulgarian sees all homepage sections (Hero, Services, Case Studies, CTA, Marquee) in Bulgarian with no English fragments
  2. All service card titles, descriptions, and feature lists display in the selected language
  3. Browser tab title and meta description reflect the current language
  4. Existing content across all sections is reviewed and up-to-date (not placeholder text)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

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
| 1. Router Foundation | 0/0 | Not started | - |
| 2. i18n Infrastructure | 0/0 | Not started | - |
| 3. Full Content Translation | 0/0 | Not started | - |
| 4. New Pages and Content | 0/0 | Not started | - |
