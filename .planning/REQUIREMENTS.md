# Requirements: E&P Systems v1.1 CTA Forms

**Defined:** 2026-03-25
**Core Value:** The site must present E&P Systems as a credible, professional software agency that potential clients trust enough to reach out to.

## v1.1 Requirements

Requirements for CTA forms milestone. Each maps to roadmap phases.

### Form Component

- [x] **FORM-01**: Reusable contact form with Name, Email, Phone, and Notes fields
- [x] **FORM-02**: Form submits to Web3Forms free backend (no additional costs)
- [ ] **FORM-03**: Form shows success state after successful submission
- [ ] **FORM-04**: Form shows error state if submission fails
- [x] **FORM-05**: Bilingual form labels, placeholders, and button text (EN/BG)

### Validation

- [x] **VALD-01**: Name and Email are required fields with inline validation
- [x] **VALD-02**: Email format validated before submission
- [x] **VALD-03**: Validation error messages displayed in current language (EN/BG)

### Context

- [ ] **CTXT-01**: Each CTA triggers a form with context-specific heading (e.g., "Tell us about your SEO goals")
- [x] **CTXT-02**: Hidden subject field sent with submission identifying the CTA source (e.g., "SEO Inquiry")

### CTA Conversion

- [ ] **CTA-01**: All mailto links removed from the entire site
- [ ] **CTA-02**: Homepage CTA section button opens contact form
- [ ] **CTA-03**: All 4 service page CTA buttons open service-specific contact forms
- [ ] **CTA-04**: Hero "Contact us" button opens contact form
- [ ] **CTA-05**: Navbar "Get Started" button opens contact form
- [ ] **CTA-06**: Footer contact CTA opens contact form

## Future Requirements

- **SPAM-01**: Honeypot or hCaptcha spam protection
- **ANIM-01**: Framer Motion modal entrance/exit animations

## Out of Scope

| Feature | Reason |
|---------|--------|
| Paid form backend | User requires zero additional costs |
| File upload in forms | Unnecessary complexity for contact inquiries |
| Multi-step forms | Over-engineering for 4 fields |
| reCAPTCHA | Hurts conversions and accessibility |
| Server-side form handling | Site is static SPA, no backend |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORM-01 | Phase 5 | Complete |
| FORM-02 | Phase 5 | Complete |
| FORM-03 | Phase 6 | Pending |
| FORM-04 | Phase 6 | Pending |
| FORM-05 | Phase 5 | Complete |
| VALD-01 | Phase 5 | Complete |
| VALD-02 | Phase 5 | Complete |
| VALD-03 | Phase 5 | Complete |
| CTXT-01 | Phase 6 | Pending |
| CTXT-02 | Phase 5 | Complete |
| CTA-01 | Phase 7 | Pending |
| CTA-02 | Phase 7 | Pending |
| CTA-03 | Phase 7 | Pending |
| CTA-04 | Phase 7 | Pending |
| CTA-05 | Phase 7 | Pending |
| CTA-06 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after roadmap phase mapping*
