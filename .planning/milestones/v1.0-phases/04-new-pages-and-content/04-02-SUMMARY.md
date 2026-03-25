---
phase: 04-new-pages-and-content
plan: 02
subsystem: ui, routing
tags: [react-router, service-pages, brutalist, bilingual, navigation]

# Dependency graph
requires:
  - phase: 04-new-pages-and-content
    provides: "servicePages.* translation keys for all 4 services in EN/BG"
provides:
  - "ServicePage template rendering 4 service pages at /:lang/services/:slug"
  - "ServiceHero, ServiceFeatures, ServiceProcess, ServiceCTA section components"
  - "Updated navigation: service cards link to pages, navbar/footer navigate-then-scroll"
  - "Cleaned homepage without inline ServiceDetail sections"
affects: [04-03-team-section]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Navigate-then-scroll pattern for cross-page section links (navigate to homepage, setTimeout scroll)"
    - "Slug-based service page template: single component renders all 4 services via URL param"
    - "SERVICE_SLUGS constant maps service IDs to URL slugs for link generation"

key-files:
  created:
    - src/pages/ServicePage.tsx
    - src/components/sections/ServiceHero.tsx
    - src/components/sections/ServiceFeatures.tsx
    - src/components/sections/ServiceProcess.tsx
    - src/components/sections/ServiceCTA.tsx
  modified:
    - src/App.tsx
    - src/pages/HomePage.tsx
    - src/components/sections/Services.tsx
    - src/components/layout/Navbar.tsx
    - src/components/layout/Footer.tsx

key-decisions:
  - "usePageMeta called with fallback slug before conditional Navigate to avoid React hooks-after-return violation"
  - "Footer sitemap uses navigate-then-scroll pattern since Footer appears on service pages too"

patterns-established:
  - "Navigate-then-scroll: navigate(homePath) then setTimeout(() => scrollToSection(id), 100)"
  - "isHomePage detection via location.pathname comparison for conditional scroll/navigate behavior"

requirements-completed: [SERV-01, SERV-02, SERV-04]

# Metrics
duration: 3min
completed: 2026-03-25
---

# Phase 4 Plan 02: Service Pages Summary

**Slug-based service page template with 4 section components, route registration, and seamless navigate-then-scroll navigation between homepage and service pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-25T12:52:11Z
- **Completed:** 2026-03-25T12:55:14Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Created ServicePage template that renders all 4 services (seo, ecommerce, ai, software) from a single component using URL slug
- Built 4 Brutalist-styled section components: ServiceHero, ServiceFeatures, ServiceProcess, ServiceCTA -- all consuming servicePages.{slug}.* translation keys
- Updated all navigation across the site: service cards link to dedicated pages, navbar and footer use navigate-then-scroll for cross-page section links
- Removed inline ServiceDetail sections from homepage for a shorter, cleaner page

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ServicePage template and 4 section components** - `025024b` (feat)
2. **Task 2: Register route and update all navigation** - `bea514c` (feat)

## Files Created/Modified
- `src/pages/ServicePage.tsx` - Shared service page template with slug validation and redirect
- `src/components/sections/ServiceHero.tsx` - Hero with back link, badge, heading, subheading
- `src/components/sections/ServiceFeatures.tsx` - 4-card feature grid with stagger animation
- `src/components/sections/ServiceProcess.tsx` - Numbered steps in boxed container with dashed connector
- `src/components/sections/ServiceCTA.tsx` - CTA with service-specific button text and mailto link
- `src/App.tsx` - Added /:lang/services/:slug route
- `src/pages/HomePage.tsx` - Removed ServiceDetail sections and unused imports
- `src/components/sections/Services.tsx` - Cards now Link to service pages instead of scrollToSection
- `src/components/layout/Navbar.tsx` - Added navigate-then-scroll for cross-page support
- `src/components/layout/Footer.tsx` - Service links are now Links, sitemap uses navigate-then-scroll

## Decisions Made
- usePageMeta called with fallback slug ('seo') before conditional Navigate to avoid React hooks-after-early-return violation
- Footer sitemap buttons use navigate-then-scroll pattern since Footer now appears on service pages as well as homepage

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed React hooks ordering in ServicePage**
- **Found during:** Task 1 (ServicePage creation)
- **Issue:** usePageMeta was called after an early return (Navigate for invalid slugs), which violates React's rules of hooks
- **Fix:** Computed a fallback validSlug before the conditional return and called usePageMeta unconditionally before the guard
- **Files modified:** src/pages/ServicePage.tsx
- **Verification:** Build passes, no React hooks warnings
- **Committed in:** 025024b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Essential fix for React correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Service pages fully operational with bilingual content
- All navigation paths tested via successful build
- Ready for Plan 03 (team section component)

## Self-Check: PASSED

All 10 files verified present. Both commits (025024b, bea514c) verified in git log. Build succeeds.

---
*Phase: 04-new-pages-and-content*
*Completed: 2026-03-25*
