# E&P Systems — Agency Landing Page

## What This Is

A client-facing landing page for E&P Systems, a software agency. Built with React, TypeScript, Tailwind CSS, and Framer Motion in a bold Brutalist design style. Currently a single-page site with service cards, case studies, and contact CTA. Being enhanced into a full bilingual (EN/BG), multi-page professional agency website.

## Core Value

The site must present E&P Systems as a credible, professional software agency that potential clients trust enough to reach out to.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from existing code. -->

- ✓ Hero section with agency positioning and CTAs — existing
- ✓ Services overview grid with styled cards — existing
- ✓ Detailed service sections (SEO, E-Commerce, AI/Automation) — existing
- ✓ Case studies showcase section — existing
- ✓ Scrolling marquee of services — existing
- ✓ Contact CTA section — existing
- ✓ Responsive navbar with mobile menu — existing
- ✓ Footer with sitemap and contact info — existing
- ✓ Scroll-triggered animations via Framer Motion — existing
- ✓ Brutalist design system with custom tokens — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Full bilingual support (English/Bulgarian) with language switcher
- [ ] Dedicated service pages with unique URLs (e.g., /services/web-development)
- [ ] Team page with member profiles, roles, and bios
- [ ] Content updates across existing sections
- [ ] Fix all broken and placeholder links
- [ ] Component polish and visual refinement
- [ ] New sections/pages consistent with existing Brutalist design

### Out of Scope

- Blog/Insights section — not needed for v1, can add later
- Backend/CMS — site is static, content lives in code
- Contact form with email delivery — defer to later milestone
- Portfolio detail pages beyond case studies — current case studies section sufficient

## Context

- Existing codebase is a React SPA with hash-based anchor navigation
- Moving to multi-page requires routing (React Router or similar)
- Bilingual support needs i18n solution — all existing content is English only
- Design system uses Tailwind with custom Brutalist tokens (lime #B9FF66, bold borders, shadow effects, Bricolage Grotesque font)
- Site is fully static, deployed as SPA — no backend dependencies
- Codebase map available at `.planning/codebase/`

## Constraints

- **Tech stack**: React + TypeScript + Tailwind CSS + Vite — keep existing stack
- **Design**: Must match existing Brutalist design language — bold borders, lime accents, rounded corners
- **Font**: Bricolage Grotesque — already loaded from Google Fonts
- **Static deployment**: No server-side rendering or backend — keep it client-only
- **Languages**: English and Bulgarian only

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dedicated service pages over modals | Better for SEO, more content space, shareable URLs | — Pending |
| Full bilingual (EN/BG) with switcher | Agency serves Bulgarian market, needs local language presence | — Pending |
| Keep static architecture | No backend needed for agency landing page, simpler deployment | — Pending |

---
*Last updated: 2026-03-24 after initialization*
