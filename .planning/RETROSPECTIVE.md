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

## Milestone: v1.1 - CTA Forms

**Shipped:** 2026-03-25
**Phases:** 3 | **Plans:** 4

### What Was Built

- ContactModalProvider context + useContactModal/useContactForm hooks for site-wide modal triggering
- Portal-rendered contact modal: 4 fields, inline validation, success/error/loading states, scroll lock, Escape handling, Brutalist styling
- Web3Forms backend integration (zero-cost, 250 free submissions/month) with subject + source context per CTA
- Per-context bilingual (EN/BG) form headings/descriptions for 5 CTA contexts
- All 6 CTA touchpoints wired (8 total calls); every mailto link removed from source

### What Worked

- Three-phase split (infrastructure → UI/states → CTA wiring) kept each phase tightly scoped; whole milestone executed in ~5 hours
- Context-provider pattern meant CTA wiring in Phase 7 was almost mechanical — the hard architecture was settled in Phase 5
- Carrying subject + source in FormContext made submissions analytics-ready without rework

### What Was Inefficient

- No milestone audit was run before completion (requirements were 16/16 but cross-phase/E2E verification was skipped)
- **Major process break:** after Phase 7, ~40 commits of AI-agency/blog/SEO work shipped entirely outside GSD — the planning docs went stale while the codebase moved on. Discovered only at milestone-completion time.

### Patterns Established

- `ContactModalProvider` + `useContactModal` for global modal state
- `useContactForm` hook encapsulating validation + Web3Forms POST
- Flat per-context i18n keys for fixed CTA copy (vs. generic interpolation)
- Hidden subject/source fields for attributable form submissions

### Key Lessons

1. When work continues past a milestone's planned scope, either open the next milestone in GSD immediately or the planning layer silently desyncs from reality. Ad-hoc post-milestone work should still be captured.
2. Run `/gsd:audit-milestone` before completing — "all requirement boxes checked" is not the same as "verified end-to-end."

### Cost Observations

- Model mix: Opus for research/planning/execution (quality profile), yolo mode (auto-approved gates)
- Velocity: 4 plans, ~2.8min avg execution per plan — fastest milestone so far

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change                                                            |
| --------- | ------ | ----- | --------------------------------------------------------------------- |
| v1.0      | 4      | 9     | Initial project - established routing, i18n, and translation patterns |
| v1.1      | 3      | 4     | CTA contact forms; surfaced GSD/codebase desync from untracked post-milestone work |
