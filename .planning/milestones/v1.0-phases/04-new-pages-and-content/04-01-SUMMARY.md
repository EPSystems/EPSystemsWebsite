---
phase: 04-new-pages-and-content
plan: 01
subsystem: i18n, data
tags: [i18next, typescript, translations, bilingual, services, team]

# Dependency graph
requires:
  - phase: 03-full-content-translation
    provides: "Bilingual translation infrastructure with EN/BG JSON files and useServices hook"
provides:
  - "Renamed 'software' service with detail fields in services.ts"
  - "servicePages.* translation keys for all 4 services (seo, ecommerce, ai, software) in EN/BG"
  - "team.* translation keys with 3 member name/role pairs in EN/BG"
  - "TeamMember interface and teamMembers data array in team.ts"
affects: [04-02-service-pages, 04-03-team-section]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Service page content keyed as servicePages.{serviceId}.{section} in translation JSON"
    - "Team member data uses ID-based lookup into team.members.{id} translation keys"

key-files:
  created:
    - src/data/team.ts
  modified:
    - src/data/services.ts
    - src/i18n/locales/en/common.json
    - src/i18n/locales/bg/common.json

key-decisions:
  - "No photo field in TeamMember -- use CSS placeholder (lucide User icon) until real images provided"
  - "Service page content structured as meta/hero/features/process/cta per service for consistent rendering"

patterns-established:
  - "servicePages.{serviceId} pattern for per-service page translations"
  - "team.members.{memberId} pattern for team member translations"

requirements-completed: [SERV-03, CONT-02]

# Metrics
duration: 3min
completed: 2026-03-25
---

# Phase 4 Plan 01: Content & Data Foundation Summary

**Renamed 'websites' to 'software' service site-wide and added full bilingual content for 4 service pages and team section across EN/BG translation files**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-25T12:45:49Z
- **Completed:** 2026-03-25T12:49:18Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Renamed "Custom Websites" to "Custom Software" across services.ts and both EN/BG translation JSONs with no stale references
- Added comprehensive servicePages translations for all 4 services (seo, ecommerce, ai, software) with meta, hero, features, process, and cta sections -- 105 keys each language
- Created team.ts data file and team translations with 3 members in both languages
- All 4 service detail fields (detailHeadline, detailDescription, ctaText) now populated including the newly renamed software service

## Task Commits

Each task was committed atomically:

1. **Task 1: Rename websites to software in services.ts and translation JSONs** - `ef02018` (feat)
2. **Task 2: Add service page content and team data to translations** - `555ec99` (feat)

## Files Created/Modified
- `src/data/services.ts` - Renamed websites->software service, added detail fields
- `src/data/team.ts` - New file with TeamMember interface and 3 member entries
- `src/i18n/locales/en/common.json` - Updated software service keys, added servicePages and team sections
- `src/i18n/locales/bg/common.json` - Updated software service keys, added servicePages and team sections in Bulgarian

## Decisions Made
- No photo field in TeamMember interface -- CSS-based placeholder with lucide User icon per research guidance, real photos to be added when user provides images
- Service page content structured as meta/hero/features/process/cta per service for consistent rendering pattern that Plan 02 components will consume

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Service page content is ready for Plan 02 (service detail page components) to render
- Team data and translations are ready for Plan 03 (team section component)
- All 4 services have complete bilingual content with matching key structures

## Self-Check: PASSED

All files exist, all commits verified, all content keys present in both languages.

---
*Phase: 04-new-pages-and-content*
*Completed: 2026-03-25*
