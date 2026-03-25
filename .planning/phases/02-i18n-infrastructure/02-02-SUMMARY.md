---
phase: 02-i18n-infrastructure
plan: 02
subsystem: ui
tags: [react-i18next, language-switcher, i18n, cyrillic, navbar, footer]

# Dependency graph
requires:
  - phase: 02-i18n-infrastructure/02-01
    provides: i18next config, EN/BG JSON translations, useLanguageSync hook, Inter font
provides:
  - LanguageSwitcher component (EN/BG text toggle in navbar)
  - Translated Navbar with t() calls for all visible text
  - Translated Footer with t() calls for all visible text
  - Language-aware ScrollToTop that ignores lang-only path changes
  - useLanguageSync wired into HomePage layout
affects: [03-full-content-translation]

# Tech tracking
tech-stack:
  added: []
  patterns: [t() translation calls in layout components, language-aware scroll behavior]

key-files:
  created:
    - src/components/layout/LanguageSwitcher.tsx
  modified:
    - src/components/layout/Navbar.tsx
    - src/components/layout/Footer.tsx
    - src/pages/HomePage.tsx
    - src/components/ScrollToTop.tsx
    - src/i18n/locales/bg/common.json

key-decisions:
  - "User requested 'Онлайн магазин' instead of 'Е-Комерс' for BG e-commerce label"

patterns-established:
  - "LanguageSwitcher: EN / BG text toggle with bold active state, navigate with replace:true"
  - "ScrollToTop: strip lang prefix before comparing paths to avoid scroll on language switch"

requirements-completed: [BILN-02, CONT-03]

# Metrics
duration: 2min
completed: 2026-03-25
---

# Phase 2 Plan 02: Language Switcher and Nav/Footer Translation Summary

**EN/BG text toggle in navbar with all Navbar and Footer text translated via react-i18next t() calls**

## Performance

- **Duration:** ~2 min (auto task) + human verification checkpoint
- **Started:** 2026-03-25T00:20:00Z
- **Completed:** 2026-03-25T09:45:00Z
- **Tasks:** 2 (1 auto + 1 checkpoint)
- **Files modified:** 6

## Accomplishments
- LanguageSwitcher component renders EN / BG text toggle with bold active language, uses navigate with replace:true to avoid history clutter
- All hardcoded English text in Navbar replaced with t() calls (Services, SEO, E-Commerce, Projects, Get Started)
- All hardcoded English text in Footer replaced with t() calls (CTA, column headers, links, contact, copyright)
- useLanguageSync wired into HomePage so URL lang param drives i18next language on every render
- ScrollToTop updated to ignore language-only path changes (strips /en/ or /bg/ prefix before comparing)
- LanguageSwitcher placed in desktop nav (after CTA) and mobile menu (top, before links)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create LanguageSwitcher and wire translations into Navbar and Footer** - `0f17ccf` (feat)
2. **Task 2: Verify language switching, translations, and Cyrillic rendering** - checkpoint approved, no commit needed

**Additional fix:** `3f161a2` (fix) - Changed BG "E-Commerce" label from "Е-Комерс" to "Онлайн магазин" per user feedback

## Files Created/Modified
- `src/components/layout/LanguageSwitcher.tsx` - EN/BG text toggle component with className prop for context styling
- `src/components/layout/Navbar.tsx` - All visible text now uses t() calls, LanguageSwitcher integrated
- `src/components/layout/Footer.tsx` - All visible text now uses t() calls
- `src/pages/HomePage.tsx` - useLanguageSync() call added for URL-to-i18next sync
- `src/components/ScrollToTop.tsx` - Ignores language-only path changes to preserve scroll position
- `src/i18n/locales/bg/common.json` - Updated e-commerce label to "Онлайн магазин"

## Decisions Made
- User requested "Онлайн магазин" instead of "Е-Комерс" for the Bulgarian e-commerce navigation label -- applied as a post-verification fix

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] BG e-commerce label changed per user feedback**
- **Found during:** Task 2 (checkpoint verification)
- **Issue:** User preferred "Онлайн магазин" over the transliterated "Е-Комерс"
- **Fix:** Updated bg/common.json nav.ecommerce and footer.ecommerce values
- **Files modified:** src/i18n/locales/bg/common.json
- **Verification:** User confirmed after change
- **Committed in:** 3f161a2

---

**Total deviations:** 1 auto-fixed (1 bug/preference fix)
**Impact on plan:** Minor translation label change. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- i18n infrastructure is fully operational: language switcher, translated nav/footer, Cyrillic rendering verified
- Phase 3 (Full Content Translation) can proceed to translate all remaining homepage sections
- All service card content, hero, case studies, CTA, and marquee sections still need t() translation

## Self-Check: PASSED

- All 6 key files verified present on disk
- Commits 0f17ccf and 3f161a2 verified in git log

---
*Phase: 02-i18n-infrastructure*
*Completed: 2026-03-25*
