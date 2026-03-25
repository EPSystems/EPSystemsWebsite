# Requirements: E&P Systems Agency Website

**Defined:** 2026-03-24
**Core Value:** The site must present E&P Systems as a credible, professional software agency that potential clients trust enough to reach out to.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Routing

- [x] **ROUT-01**: Site uses React Router with BrowserRouter replacing hash-based navigation
- [x] **ROUT-02**: All existing anchor links (#services, #seo, etc.) continue to work as smooth-scroll within pages
- [x] **ROUT-03**: Language-prefixed URL structure implemented (/en/..., /bg/...)
- [x] **ROUT-04**: Root URL (/) redirects to default language route
- [x] **ROUT-05**: All broken and placeholder links across the site are fixed or removed

### Bilingual

- [x] **BILN-01**: react-i18next integrated with JSON translation files for EN and BG
- [x] **BILN-02**: Language switcher in Navbar toggles between English and Bulgarian
- [x] **BILN-03**: Language preference persists across page navigation via URL prefix
- [x] **BILN-04**: All JSX text content translated to Bulgarian
- [x] **BILN-05**: All service data (titles, descriptions, features in services.ts) translated to Bulgarian
- [x] **BILN-06**: Meta tags and page titles reflect current language
- [x] **BILN-07**: Cyrillic font support verified for Bricolage Grotesque (fallback if needed)

### Service Pages

- [x] **SERV-01**: Each service has a dedicated page with unique URL (e.g., /en/services/seo)
- [x] **SERV-02**: Service pages include detailed description, features, and relevant content
- [x] **SERV-03**: Service pages are fully bilingual (EN/BG)
- [x] **SERV-04**: Navigation between service pages and homepage is seamless

### Content

- [ ] **CONT-01**: Team members section added to homepage with member profiles, roles, and bios
- [x] **CONT-02**: Team members section is bilingual (EN/BG)
- [x] **CONT-03**: Navbar updated to support multi-page routing and language switcher
- [x] **CONT-04**: Content across existing sections reviewed and updated

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Polish

- **PLSH-01**: Accessibility audit with alt text, semantic HTML, focus styles, ARIA labels
- **PLSH-02**: Framer Motion page transition animations between routes
- **PLSH-03**: Technology stack showcase grid on homepage

### Trust Signals

- **TRST-01**: Client logo bar / trust badges section
- **TRST-02**: Case studies restructured with measurable outcomes and metrics
- **TRST-03**: Interactive process/methodology section

### Contact

- **CTCT-01**: Contact form with email delivery (Formspree or serverless)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / Insights section | Requires ongoing content commitment; empty blog hurts more than no blog |
| Live chat / chatbot | Requires backend service and monitoring; clear contact info is sufficient |
| CMS / admin panel | Over-engineering for a small agency; content lives in code |
| Pricing page | Custom agency work doesn't suit fixed pricing; guide prospects to conversation |
| Languages beyond EN/BG | Over-engineering i18n for hypothetical markets; system supports adding later |
| Contact form | Requires backend (serverless/email API); defer to v2 with proper setup |
| Pre-rendering / SSR | Depends on hosting platform; evaluate after routing is in place |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| ROUT-01 | Phase 1 | Complete |
| ROUT-02 | Phase 1 | Complete |
| ROUT-03 | Phase 1 | Complete |
| ROUT-04 | Phase 1 | Complete |
| ROUT-05 | Phase 1 | Complete |
| BILN-01 | Phase 2 | Complete |
| BILN-02 | Phase 2 | Complete |
| BILN-03 | Phase 2 | Complete |
| BILN-04 | Phase 3 | Complete |
| BILN-05 | Phase 3 | Complete |
| BILN-06 | Phase 3 | Complete |
| BILN-07 | Phase 2 | Complete |
| SERV-01 | Phase 4 | Complete |
| SERV-02 | Phase 4 | Complete |
| SERV-03 | Phase 4 | Complete |
| SERV-04 | Phase 4 | Complete |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after roadmap creation*
