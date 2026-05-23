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
- ✓ Contact forms replacing all mailto CTA links - v1.1
- ✓ Different form context per CTA (service-specific subject/context) - v1.1
- ✓ Form fields: Name, Email, Phone, Notes - v1.1
- ✓ Form submission via free backend (Web3Forms, zero cost) - v1.1
- ✓ All forms bilingual (EN/BG) - v1.1
- ✓ Success/error/loading states after submission - v1.1

### Active

_Next milestone not yet formalized. The work below shipped after v1.1 **outside** the GSD
workflow and needs retroactive capture via `/gsd:new-milestone` (see Current State)._

- [ ] AI-agency repositioning (BG-first homepage, 5 AI service pillars, industries menu)
- [ ] MDX blog engine with bilingual starter articles
- [ ] Global SEO: schema markup, sitemap, canonical/hreflang, llms.txt, GA4 + Consent Mode v2
- [ ] Spam protection on forms (SPAM-01: honeypot or hCaptcha)
- [ ] Framer Motion modal entrance/exit animations (ANIM-01)

### Out of Scope

- Blog/Insights section - requires ongoing content commitment
- Backend/CMS - site is static, content lives in code
- Accessibility audit (WCAG) - deferred
- Page transition animations - deferred
- Client logo bar / trust badges - need client permission
- Pre-rendering for SEO - depends on hosting platform choice
- Paid form backend services - user requires zero cost

## Context

- Shipped v1.0 (bilingual multi-page foundation) and v1.1 (CTA contact forms)
- v1.1 added ~3,800 LOC across 64 files: ContactModalProvider, useContactForm/useContactModal hooks, portal-rendered modal, Web3Forms integration, per-context bilingual form copy
- Tech stack: React 19 + Vite 5 + Tailwind 3 + Framer Motion + react-i18next
- Bricolage Grotesque font doesn't support Cyrillic - Inter used as fallback
- "Custom Websites" renamed to "Custom Software" throughout (v1.0)
- Site is fully static SPA - SPA fallback rewrites added on Vercel
- ⚠ **Codebase has diverged from planning docs:** after v1.1, the site was repositioned as an AI agency (BG-first homepage, 5 AI service pillars, industries menu), an MDX blog engine was added, and global SEO/schema/sitemap + GA4 analytics were implemented — all outside the GSD workflow. This is unplanned, undocumented milestone work awaiting retroactive capture.

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
| Web3Forms as form backend                    | 250 free submissions/month, zero npm deps, simple JSON POST        | ✓ Good  |
| ContactModalProvider context pattern         | Single modal triggered from any CTA, carries subject + source      | ✓ Good  |
| FormContext carries subject + source         | Per-CTA context for analytics-ready, attributable submissions      | ✓ Good  |
| Flat per-context i18n keys for form copy     | Simpler than generic interpolation for 5 fixed CTA contexts        | ✓ Good  |

## Current State

**Shipped:** v1.1 CTA Forms (2026-03-25) — every CTA across the site opens a bilingual, context-aware contact form backed by Web3Forms; all mailto links removed.

**Reality vs. plan:** The live codebase is well ahead of the planning docs. A large body of work shipped after v1.1 — AI-agency repositioning, an MDX blog, and a full SEO/analytics layer — without going through GSD. The next GSD action is to formalize that work as a milestone rather than plan it from scratch.

## Next Milestone Goals (v1.2 — proposed: AI Agency & Content)

Retroactively capture and verify the already-shipped post-v1.1 work, then close the gaps:

- AI-agency repositioning: BG-first homepage, 5 AI service pillars, industries menu
- MDX blog engine with bilingual starter articles + AI-citation TL;DR blocks
- Global SEO: schema markup, sitemap, canonical/hreflang, llms.txt, cornerstone marking
- GA4 analytics with Consent Mode v2 (GDPR)
- Remaining gaps: form spam protection (SPAM-01), modal animations (ANIM-01)

---

_Last updated: 2026-05-23 after v1.1 milestone completion_
