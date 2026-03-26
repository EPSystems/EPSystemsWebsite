# Project Retrospective

_A living document updated after each milestone. Lessons feed forward into future planning._

## Milestone: v1.0 - MVP

**Shipped:** 2026-03-25
**Phases:** 4 | **Plans:** 9

### What Was Built

- React Router with language-prefixed URLs (/en/, /bg/) replacing hash navigation
- Full bilingual i18n system (react-i18next) with EN/BG language switcher
- Complete site translation - 107 translation keys in both languages
- 4 dedicated service pages (SEO, E-Commerce, AI & Automation, Custom Software)
- Team members section on homepage
- "Custom Websites" → "Custom Software" site-wide rename

### What Worked

- Strict dependency ordering (Router → i18n → Translation → Pages) prevented rework
- Research phase caught Bricolage Grotesque Cyrillic gap early - Inter fallback added cleanly
- Human verification checkpoints caught the navbar link issue (SEO/E-Commerce pointing to removed sections)
- useServices hook pattern cleanly separated data structure from translations

### What Was Inefficient

- Navbar SEO/E-Commerce links weren't updated when ServiceDetail sections were removed from homepage - caught during human verification instead of during planning
- Phase 3 was pulled forward mid-Phase 2 checkpoint at user request - worked fine but broke the discuss→plan→execute flow

### Patterns Established

- `usePageMeta` hook for dynamic meta tags per language
- `useServices` hook for translating data-driven content
- `scrollToSection` utility for programmatic smooth-scroll
- Navigate-then-scroll pattern for cross-page navbar links
- Shared template approach for service pages (ServicePage + 4 section components)

### Key Lessons

1. When removing homepage sections that navbar links pointed to, the navigation update must be part of the same plan - not left for a later wave
2. Cyrillic font support should be verified before any i18n work begins - the Inter fallback was a good catch by research

### Cost Observations

- Model mix: Opus for research/planning/execution, Sonnet for plan-checking/verification, Haiku for codebase mapping
- Notable: 4 parallel codebase mapper agents and 4 parallel project research agents ran efficiently

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change                                                            |
| --------- | ------ | ----- | --------------------------------------------------------------------- |
| v1.0      | 4      | 9     | Initial project - established routing, i18n, and translation patterns |
