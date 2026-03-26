# E&P Systems - Agency Landing Page

## What This Is

A client-ready bilingual (EN/BG) website for E&P Systems, a software agency. Built with React 19, TypeScript, Tailwind CSS, and Framer Motion in a bold Brutalist design style. Features a multi-page architecture with dedicated service pages, a team section, and full i18n support via react-i18next with language-prefixed URLs.

## Core Value

The site must present E&P Systems as a credible, professional software agency that potential clients trust enough to reach out to.

## Requirements

### Validated

- ✓ Hero section with agency positioning and CTAs - existing
- ✓ Services overview grid with styled cards - existing
- ✓ Case studies showcase section - existing
- ✓ Scrolling marquee of services - existing
- ✓ Contact CTA section - existing
- ✓ Responsive navbar with mobile menu - existing
- ✓ Footer with sitemap and contact info - existing
- ✓ Scroll-triggered animations via Framer Motion - existing
- ✓ Brutalist design system with custom tokens - existing
- ✓ React Router with BrowserRouter and language-prefixed URLs - v1.0
- ✓ All anchor links work as smooth-scroll within pages - v1.0
- ✓ Root URL redirects to default language route - v1.0
- ✓ All broken and placeholder links fixed - v1.0
- ✓ react-i18next integrated with JSON translation files (EN/BG) - v1.0
- ✓ Language switcher in Navbar (EN/BG text toggle) - v1.0
- ✓ Language preference persists via URL prefix - v1.0
- ✓ Cyrillic font support via Inter fallback - v1.0
- ✓ All JSX and service data content translated to Bulgarian - v1.0
- ✓ Dynamic meta tags and page titles per language - v1.0
- ✓ Content across all sections reviewed and updated - v1.0
- ✓ Dedicated service pages (SEO, E-Commerce, AI, Custom Software) with unique URLs - v1.0
- ✓ Service pages with Hero, Features, Process, CTA sections - v1.0
- ✓ Service pages fully bilingual - v1.0
- ✓ Seamless navigation between service pages and homepage - v1.0
- ✓ Team members section on homepage with profiles and roles - v1.0
- ✓ Team section bilingual - v1.0

### Active

- [ ] Contact forms replacing all mailto CTA links
- [ ] Different form context per CTA (service-specific subject/context)
- [ ] Form fields: Name, Email, Phone, Notes
- [ ] Form submission via free backend (no additional costs)
- [ ] All forms bilingual (EN/BG)
- [ ] Success state after submission

### Out of Scope

- Blog/Insights section - requires ongoing content commitment
- Backend/CMS - site is static, content lives in code
- Accessibility audit (WCAG) - deferred
- Page transition animations - deferred
- Client logo bar / trust badges - need client permission
- Pre-rendering for SEO - depends on hosting platform choice
- Paid form backend services - user requires zero cost

## Context

- Shipped v1.0 with 1,262 LOC TypeScript across 30 source files
- Tech stack: React 19 + Vite 5 + Tailwind 3 + Framer Motion + react-i18next
- Bricolage Grotesque font doesn't support Cyrillic - Inter used as fallback
- "Custom Websites" renamed to "Custom Software" throughout
- Team member data uses placeholders - user will provide real photos and details
- Site is fully static SPA - needs SPA fallback config on hosting platform

## Constraints

- **Tech stack**: React + TypeScript + Tailwind CSS + Vite - established
- **Design**: Brutalist design language - bold borders, lime #B9FF66 accents, rounded corners
- **Fonts**: Bricolage Grotesque (Latin) + Inter (Cyrillic fallback)
- **Static deployment**: No server-side rendering or backend - client-only
- **Languages**: English and Bulgarian only

## Key Decisions

| Decision                                     | Rationale                                                          | Outcome |
| -------------------------------------------- | ------------------------------------------------------------------ | ------- |
| Dedicated service pages over modals          | Better for SEO, more content space, shareable URLs                 | ✓ Good  |
| Full bilingual (EN/BG) with switcher         | Agency serves Bulgarian market, needs local language presence      | ✓ Good  |
| Keep static architecture                     | No backend needed for agency landing page, simpler deployment      | ✓ Good  |
| Language-prefixed URLs (/en/, /bg/)          | SEO-friendly, shareable, bookmarkable per language                 | ✓ Good  |
| Inter as Cyrillic fallback font              | Bricolage Grotesque lacks Cyrillic; Inter pairs well visually      | ✓ Good  |
| Shared ServicePage template                  | All 4 service pages have same structure, differentiated by content | ✓ Good  |
| "Custom Websites" → "Custom Software"        | Better reflects agency's actual service offering                   | ✓ Good  |
| Team section on homepage (not separate page) | Minimal team data, doesn't warrant full page                       | ✓ Good  |

## Current Milestone: v1.1 CTA Forms

**Goal:** Replace all mailto CTA links with functional contact forms, each tailored to its context (homepage, service pages, navbar, hero).

**Target features:**

- Modal/inline contact forms on all CTA buttons
- Form fields: Name, Email, Phone, Notes
- Hidden context field per CTA (e.g., "SEO Inquiry", "General Contact")
- Free form backend (Web3Forms, Formspree free tier, or similar)
- All forms bilingual
- Success feedback after submission

---

_Last updated: 2026-03-25 after v1.1 milestone start_
