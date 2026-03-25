# Roadmap: E&P Systems Agency Website

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-25)
- 🚧 **v1.1 CTA Forms** — Phases 5-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-03-25</summary>

- [x] Phase 1: Router Foundation (2/2 plans) — completed 2026-03-24
- [x] Phase 2: i18n Infrastructure (2/2 plans) — completed 2026-03-25
- [x] Phase 3: Full Content Translation (2/2 plans) — completed 2026-03-25
- [x] Phase 4: New Pages and Content (3/3 plans) — completed 2026-03-25

</details>

### v1.1 CTA Forms

- [ ] **Phase 5: Form Infrastructure** - Reusable contact form component with validation, bilingual support, Web3Forms backend, and context-passing architecture
- [ ] **Phase 6: Form UI and States** - Modal/inline presentation, success/error/loading states, context-specific headings, Brutalist styling
- [ ] **Phase 7: CTA Conversion** - Wire all CTA buttons site-wide to open contact forms, remove all mailto links

## Phase Details

### Phase 5: Form Infrastructure
**Goal**: A reusable, validated, bilingual contact form exists with backend submission capability and context-passing architecture
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: FORM-01, FORM-02, FORM-05, VALD-01, VALD-02, VALD-03, CTXT-02
**Success Criteria** (what must be TRUE):
  1. A contact form renders with Name, Email, Phone, and Notes fields
  2. Submitting the form sends data to Web3Forms and a submission arrives in the dashboard inbox
  3. Name and Email are required; submitting without them shows inline error messages in the current language (EN or BG)
  4. Email field rejects invalid formats with a translated error message
  5. A hidden subject field is included in the submission payload identifying the CTA source
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md — Context provider, hooks (useContactForm + useContactModal), i18n keys, App.tsx wiring
- [ ] 05-02-PLAN.md — ContactModal component with form UI, portal rendering, validation display, submission states

### Phase 6: Form UI and States
**Goal**: Users see polished form presentation with clear feedback for every submission outcome
**Depends on**: Phase 5
**Requirements**: FORM-03, FORM-04, CTXT-01
**Success Criteria** (what must be TRUE):
  1. After successful submission, user sees a confirmation message replacing the form fields
  2. If submission fails, user sees an error message with a way to retry
  3. Each CTA location displays a context-specific heading on the form (e.g., "Tell us about your SEO goals")
  4. Form shows a loading/disabled state while submission is in progress, preventing double-submit
**Plans**: TBD

Plans:
- [ ] 06-01: TBD

### Phase 7: CTA Conversion
**Goal**: Every CTA across the entire site opens a contact form instead of triggering mailto or scroll-to-contact
**Depends on**: Phase 6
**Requirements**: CTA-01, CTA-02, CTA-03, CTA-04, CTA-05, CTA-06
**Success Criteria** (what must be TRUE):
  1. Zero mailto links remain anywhere in the source code (verified by grep)
  2. Homepage CTA section button opens the contact form
  3. All 4 service page CTA buttons open service-specific contact forms with correct subject context
  4. Hero "Contact us", Navbar "Get Started", and Footer contact CTA all open the contact form
  5. No email addresses appear in client-side source code
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Router Foundation | v1.0 | 2/2 | Complete | 2026-03-24 |
| 2. i18n Infrastructure | v1.0 | 2/2 | Complete | 2026-03-25 |
| 3. Full Content Translation | v1.0 | 2/2 | Complete | 2026-03-25 |
| 4. New Pages and Content | v1.0 | 3/3 | Complete | 2026-03-25 |
| 5. Form Infrastructure | v1.1 | 0/2 | Not started | - |
| 6. Form UI and States | v1.1 | 0/? | Not started | - |
| 7. CTA Conversion | v1.1 | 0/? | Not started | - |
