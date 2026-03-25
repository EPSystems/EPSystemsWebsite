---
phase: 07-cta-conversion
plan: 01
subsystem: ui
tags: [react, cta, contact-form, modal, accessibility]

# Dependency graph
requires:
  - phase: 05-form-infrastructure
    provides: "ContactModalProvider, useContactModal hook, FormContext interface"
  - phase: 06-form-ui-and-states
    provides: "Per-context form headings/descriptions and state handling"
provides:
  - "All 6 CTA locations wired to openContactForm with correct FormContext"
  - "Zero mailto links in source code"
  - "Zero email addresses in client-side source (except form placeholders)"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: ["useContactModal hook pattern for CTA conversion", "button elements replacing mailto anchors for accessibility"]

key-files:
  created: []
  modified:
    - src/components/sections/Hero.tsx
    - src/components/sections/CTA.tsx
    - src/components/sections/ServiceCTA.tsx
    - src/components/sections/CaseStudies.tsx
    - src/components/layout/Navbar.tsx
    - src/components/layout/Footer.tsx

key-decisions:
  - "Kept scrollToSection import in Hero/Navbar/Footer where still used for services/case-studies navigation"
  - "Removed scrollToSection import from CaseStudies (no longer used)"
  - "Bulgarian form placeholder ivan@example.com treated as acceptable (form placeholder, not exposed email)"

patterns-established:
  - "openContactForm call pattern: { subject: contextKey, source: 'component-location' }"
  - "Service CTA uses dynamic slug for both subject and source"

requirements-completed: [CTA-01, CTA-02, CTA-03, CTA-04, CTA-05, CTA-06]

# Metrics
duration: 3min
completed: 2026-03-25
---

# Phase 7 Plan 1: CTA Conversion Wiring Summary

**All 6 CTA touchpoints wired to openContactForm modal with 8 total calls passing correct FormContext (subject + source)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-25T15:40:19Z
- **Completed:** 2026-03-25T15:43:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Replaced 5 mailto anchor links with openContactForm button clicks across Hero, CTA, ServiceCTA, and Footer
- Replaced scrollToSection('contact') calls in CaseStudies and Navbar with openContactForm
- Each CTA passes correct FormContext: subject matches context key, source identifies button location
- Zero mailto links and zero email addresses remain in client-side source

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert all mailto links and scrollToSection('contact') calls to openContactForm** - `2c7e920` (feat)
2. **Task 2: Remove email addresses from i18n and verify clean build** - no file changes needed (i18n files already clean, build verified passing)

## Files Created/Modified
- `src/components/sections/Hero.tsx` - Contact button opens form with subject:general, source:hero-contact
- `src/components/sections/CTA.tsx` - Homepage CTA opens form with subject:general, source:homepage-cta
- `src/components/sections/ServiceCTA.tsx` - Service CTA opens form with dynamic subject:slug, source:service-{slug}-cta
- `src/components/sections/CaseStudies.tsx` - View Project opens form with subject:general, source:case-studies
- `src/components/layout/Navbar.tsx` - Get Started buttons (desktop+mobile) open form with subject:general, source:navbar-get-started
- `src/components/layout/Footer.tsx` - Footer CTA and email link open form with subject:general, source:footer-cta/footer-email

## Decisions Made
- Kept scrollToSection import in Hero, Navbar, and Footer where still used for services/case-studies navigation
- Fully removed scrollToSection import from CaseStudies (no other usages in that file)
- Bulgarian form placeholder ivan@example.com is acceptable (equivalent to john@example.com in English)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CTA conversion complete -- all CTA touchpoints now open the contact form modal
- v1.1 CTA Forms milestone is functionally complete
- No blockers or concerns

## Self-Check: PASSED

- All 6 modified files exist on disk
- Commit 2c7e920 verified in git log
- Build passes with zero errors
- Zero mailto links in src/
- 8 openContactForm calls across 6 files confirmed

---
*Phase: 07-cta-conversion*
*Completed: 2026-03-25*
