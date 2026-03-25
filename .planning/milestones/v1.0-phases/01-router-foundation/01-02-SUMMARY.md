---
phase: 01-router-foundation
plan: 02
subsystem: ui
tags: [smooth-scroll, navigation, link-cleanup, react-router]

# Dependency graph
requires:
  - phase: 01-01
    provides: BrowserRouter and language-prefixed route structure
provides:
  - scrollToSection utility for programmatic smooth-scroll
  - Router-aware Navbar with smooth-scroll to all section anchors
  - Cleaned Footer with no placeholder or legal links
  - Conditional "Learn more" links on service cards (only when detail section exists)
  - All CTA and contact links router-aware
affects: [02-i18n-infrastructure, 04-new-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [scroll-utility-pattern, conditional-link-rendering]

key-files:
  created:
    - src/utils/scroll.ts
  modified:
    - src/components/layout/Navbar.tsx
    - src/components/layout/Footer.tsx
    - src/components/sections/Hero.tsx
    - src/components/sections/Services.tsx
    - src/components/sections/CaseStudies.tsx

key-decisions:
  - "scrollToSection utility wraps getElementById + scrollIntoView for reuse across components"
  - "Removed Legal column from Footer (Privacy Policy, Terms of Use) -- better no link than broken link"
  - "Service cards conditionally render Learn more only when detailHeadline exists"

patterns-established:
  - "Scroll utility in src/utils/scroll.ts for all same-page navigation"
  - "onClick handlers with scrollToSection replace href='#section' pattern"

requirements-completed: [ROUT-02, ROUT-05]

# Metrics
duration: 3min
completed: 2026-03-24
---

# Phase 1 Plan 2: Link Migration Summary

**Migrated all hash links to scrollToSection utility, removed placeholder links, conditionally hidden dead Learn more links on service cards**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-24T21:25:00Z
- **Completed:** 2026-03-24T21:31:02Z
- **Tasks:** 2 (1 auto + 1 checkpoint)
- **Files modified:** 6

## Accomplishments
- Created scrollToSection utility for reusable smooth-scroll across all components
- Converted all Navbar anchor links (Services, SEO, E-Commerce, Projects, Get Started) to smooth-scroll via onClick handlers
- Cleaned Footer: removed Legal column, converted sitemap links to scrollToSection, Home link uses React Router Link
- Service cards only show "Learn more" when a detail section exists (SEO, E-Commerce, AI) -- no dead links for Websites, Landing Pages, Maintenance
- Hero "Browse Services" and CaseStudies "contact" links use scrollToSection
- Zero bare href="#" placeholders remain in the codebase

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate all hash links to router-aware smooth-scroll and remove placeholder links** - `3dbcb97` (feat)
2. **Task 2: Verify all navigation works end-to-end** - checkpoint, user-approved

## Files Created/Modified
- `src/utils/scroll.ts` - scrollToSection utility wrapping getElementById + scrollIntoView with smooth behavior
- `src/components/layout/Navbar.tsx` - All anchor links replaced with scrollToSection onClick handlers, logo uses Router Link
- `src/components/layout/Footer.tsx` - Legal column removed, sitemap links use scrollToSection, Home uses Router Link, ArrowUpRight scrolls to top
- `src/components/sections/Hero.tsx` - Browse Services link uses scrollToSection
- `src/components/sections/Services.tsx` - Learn more conditionally rendered only for services with detailHeadline
- `src/components/sections/CaseStudies.tsx` - Contact link uses scrollToSection

## Decisions Made
- Used a simple scrollToSection utility rather than react-router hash navigation -- keeps things straightforward for single-page scroll targets
- Removed Legal column entirely from Footer rather than leaving disabled/grayed links
- Conditional rendering of "Learn more" based on detailHeadline presence -- data-driven approach avoids hardcoding service IDs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 (Router Foundation) is fully complete
- All navigation works: router links, smooth-scroll anchors, external links (mailto, tel)
- Ready for Phase 2 (i18n Infrastructure): /:lang param available, all components use Router-compatible patterns
- Language switcher in Phase 2 can reuse scrollToSection for maintaining scroll position during language switch

## Self-Check: PASSED

- All 6 created/modified source files verified on disk
- Task commit 3dbcb97 verified in git log

---
*Phase: 01-router-foundation*
*Completed: 2026-03-24*
