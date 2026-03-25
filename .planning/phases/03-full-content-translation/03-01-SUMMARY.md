---
phase: 03-full-content-translation
plan: 01
subsystem: ui
tags: [i18n, react-i18next, translations, bulgarian, homepage]

# Dependency graph
requires:
  - phase: 02-i18n-infrastructure
    provides: "i18next configured with bundled JSON, useTranslation hook, useLanguageSync"
provides:
  - "EN/BG translation keys for hero, services (6), marquee, cta sections"
  - "useServices() hook for translated service data"
  - "Hero, Marquee, CTA, Services components wired to i18n t() calls"
affects: [03-full-content-translation]

# Tech tracking
tech-stack:
  added: []
  patterns: [useServices hook pattern for translating data-driven content]

key-files:
  created:
    - src/hooks/useServices.ts
  modified:
    - src/i18n/locales/en/common.json
    - src/i18n/locales/bg/common.json
    - src/components/sections/Hero.tsx
    - src/components/sections/Marquee.tsx
    - src/components/sections/Services.tsx
    - src/components/sections/CTA.tsx
    - src/pages/HomePage.tsx

key-decisions:
  - "useServices() hook overlays translations on static service data rather than replacing it"
  - "Bulgarian e-commerce label uses Онлайн магазин per user decision"
  - "HomePage detailSections label now uses translated service title instead of hardcoded English"

patterns-established:
  - "useServices hook: data files keep structural info (id, icon, variant), hook overlays t() translations"
  - "Marquee dynamic items: array indices as translation keys (marquee.0 through marquee.5)"

requirements-completed: [BILN-04, BILN-05]

# Metrics
duration: 4min
completed: 2026-03-25
---

# Phase 3 Plan 1: Homepage Content Translation Summary

**EN/BG translation keys for all homepage sections with useServices hook and t() wiring across Hero, Marquee, Services, CTA**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-25T08:02:09Z
- **Completed:** 2026-03-25T08:06:29Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Complete EN/BG translation JSON with hero, 6 services, marquee, and CTA keys
- useServices() hook that overlays i18n translations onto static service data
- Hero, Marquee, CTA, and Services components fully wired to t() calls with zero hardcoded display strings

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand EN/BG translation JSON files** - `e3a6988` (feat)
2. **Task 2: Convert services.ts to use i18n** - `516c26a` (feat)
3. **Task 3: Wire Hero, Marquee, CTA to t() calls** - `85cc912` (feat)

## Files Created/Modified
- `src/i18n/locales/en/common.json` - All English translation keys for homepage sections
- `src/i18n/locales/bg/common.json` - All Bulgarian translation keys matching EN structure
- `src/hooks/useServices.ts` - Hook that returns services array with translated strings
- `src/components/sections/Hero.tsx` - Badge, headings, subheading, CTAs, dashboard title via t()
- `src/components/sections/Marquee.tsx` - Dynamic items array from translation keys
- `src/components/sections/Services.tsx` - Badge, heading, learnMore via t(); uses useServices()
- `src/components/sections/CTA.tsx` - Heading, description, button via t()
- `src/pages/HomePage.tsx` - Uses useServices() for translated detailSections

## Decisions Made
- Created useServices() hook that overlays translations rather than modifying services.ts directly -- keeps static data as fallback and structural definition
- HomePage detailSections label now uses translated service.title instead of hardcoded English strings
- Bulgarian translations written in natural, professional tone appropriate for a software agency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All primary homepage sections (Hero, Services grid, Marquee, CTA) now render bilingual content
- Ready for Plan 02 to handle remaining components (ServiceDetail, CaseStudies, etc.)
- TypeScript compiles and production build succeeds

## Self-Check: PASSED

All 8 files verified present. All 3 commit hashes verified in git log.

---
*Phase: 03-full-content-translation*
*Completed: 2026-03-25*
