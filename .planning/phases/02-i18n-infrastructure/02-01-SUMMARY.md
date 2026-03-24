---
phase: 02-i18n-infrastructure
plan: 01
subsystem: i18n
tags: [i18next, react-i18next, i18n, cyrillic, inter-font, google-fonts]

# Dependency graph
requires:
  - phase: 01-router-foundation
    provides: URL :lang param routing structure
provides:
  - i18next initialized with bundled EN/BG resources
  - Translation JSON files for nav and footer keys
  - useLanguageSync hook syncing URL :lang to i18next
  - Inter font loaded for Cyrillic fallback
affects: [02-i18n-infrastructure plan 02, 03-translate-components]

# Tech tracking
tech-stack:
  added: [i18next, react-i18next]
  patterns: [bundled-resources i18n init, URL-driven language sync]

key-files:
  created:
    - src/i18n/index.ts
    - src/i18n/locales/en/common.json
    - src/i18n/locales/bg/common.json
    - src/hooks/useLanguageSync.ts
  modified:
    - package.json
    - src/main.tsx
    - index.html
    - src/index.css

key-decisions:
  - "Bundled JSON resources for synchronous i18n init (no async loading)"
  - "Inter font as Cyrillic fallback in CSS font stack"
  - "useLanguageSync sets document.documentElement.lang for accessibility"

patterns-established:
  - "Translation namespace: 'common' as default namespace for all keys"
  - "Language sync: URL param is source of truth, hook syncs to i18next"
  - "i18n import before App import in main.tsx to prevent race conditions"

requirements-completed: [BILN-01, BILN-03, BILN-07]

# Metrics
duration: 2min
completed: 2026-03-24
---

# Phase 2 Plan 1: i18n Foundation Summary

**i18next with bundled EN/BG resources, URL-driven language sync hook, and Inter Cyrillic fallback font**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-24T22:15:10Z
- **Completed:** 2026-03-24T22:16:49Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- i18next initialized synchronously with bundled EN and BG translation resources
- Translation JSON files created with all nav and footer keys in both languages
- useLanguageSync hook reads URL :lang param and syncs to i18next language state
- Inter font added to Google Fonts link and CSS font stack for Cyrillic rendering

## Task Commits

Each task was committed atomically:

1. **Task 1: Install i18next, create translation files, and init config** - `b40684e` (feat)
2. **Task 2: Create language sync hook, add Inter font, wire i18n into entry point** - `e1ba93a` (feat)

## Files Created/Modified
- `src/i18n/index.ts` - i18next initialization with bundled EN/BG resources
- `src/i18n/locales/en/common.json` - English translation keys for nav and footer
- `src/i18n/locales/bg/common.json` - Bulgarian translation keys for nav and footer
- `src/hooks/useLanguageSync.ts` - Hook syncing URL :lang param to i18next language
- `src/main.tsx` - Added i18n import before App import
- `index.html` - Added Inter font to Google Fonts link
- `src/index.css` - Added Inter to font-family stack
- `package.json` - Added i18next and react-i18next dependencies

## Decisions Made
- Bundled JSON resources for synchronous i18n init (no async loading, no flash of untranslated content)
- Inter font as Cyrillic fallback in CSS font stack (Bricolage Grotesque primary, Inter catches Cyrillic glyphs)
- useLanguageSync sets document.documentElement.lang for screen reader accessibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- i18n foundation complete, ready for Plan 02 (language switcher component and translated components)
- useLanguageSync hook available for import in any route-level component
- Translation keys ready for useTranslation() consumption in Navbar and Footer

## Self-Check: PASSED

All created files verified on disk. Both task commits (b40684e, e1ba93a) verified in git log.

---
*Phase: 02-i18n-infrastructure*
*Completed: 2026-03-24*
