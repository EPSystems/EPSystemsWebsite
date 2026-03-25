# Phase 4: New Pages and Content - Research

**Researched:** 2026-03-25
**Domain:** React Router service pages, i18n content expansion, component architecture
**Confidence:** HIGH

## Summary

Phase 4 adds 4 dedicated service pages (SEO, E-Commerce, AI & Automation, Custom Software) with unique URLs, a team section on the homepage, and renames "Custom Websites" to "Custom Software" site-wide. The existing codebase provides strong foundations: React Router v7 with BrowserRouter, react-i18next with bundled JSON resources, Framer Motion animations, and a Brutalist design system with Tailwind CSS.

The primary challenge is routing: the current `App.tsx` only has `/:lang` for HomePage and `*` for NotFound. Service pages need `/:lang/services/:slug` routes. The service data model in `services.ts` already has `id` fields that map naturally to URL slugs. The `useServices()` hook already overlays i18n translations onto static service data, so extending it for full page content is straightforward.

**Primary recommendation:** Create a shared `ServicePage` component template that receives service-specific data (hero, features, process steps, CTA) from expanded translation JSON files. Add routes in App.tsx, update Navbar/Footer links to use `<Link>` instead of `scrollToSection()` for services with dedicated pages, and add a Team section component to HomePage positioned after CaseStudies.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 4 dedicated service pages: SEO, E-Commerce/Online Store, AI & Automation, Custom Software
- Landing Pages and Maintenance & Support do NOT get dedicated pages
- "Custom Websites" renamed to "Custom Software" everywhere (homepage, nav, service cards, translations)
- Each page has 4 sections: Hero with service intro, Features/capabilities list, Process/How we work, CTA section
- Expanded detail pages (1-2 scrolls of content, not full landing pages)
- Each service has a unique CTA (e.g., "Get a free SEO audit", "Start selling online")
- Team section: 2-3 team members on homepage, each card shows name, role, and photo
- No bio text, no social links on team cards
- Team section positioned before the CTA section (after Case Studies)
- Placeholder names/roles for now
- User will provide real photos later -- use placeholder approach until then
- Claude drafts all service page content and Bulgarian translations

### Claude's Discretion
- Service page layout: shared template vs unique per service
- Navbar/footer behavior on service pages (same site-wide nav recommended)
- Team section card design (match Brutalist aesthetic)
- Process/how-we-work step count and naming per service
- Placeholder avatar approach for team photos until real ones are provided

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SERV-01 | Each service has a dedicated page with unique URL (e.g., /en/services/seo) | Route pattern `/:lang/services/:slug`, service slugs from `services.ts` id field |
| SERV-02 | Service pages include detailed description, features, and relevant content | Shared ServicePage template with 4 sections (Hero, Features, Process, CTA), content from i18n JSON |
| SERV-03 | Service pages are fully bilingual (EN/BG) | Extend existing en/common.json and bg/common.json with `servicePages.*` namespace |
| SERV-04 | Navigation between service pages and homepage is seamless | Update Navbar to use `<Link>` for service pages, add back-to-home navigation, same Navbar/Footer on all pages |
| CONT-01 | Team members section added to homepage with member profiles, roles, and bios | Team component after CaseStudies, before CTA. Note: user said "no bio text" so cards are name+role+photo only |
| CONT-02 | Team members section is bilingual (EN/BG) | Add `team.*` keys to both translation JSON files |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router-dom | ^7.13.2 | Page routing with `/:lang/services/:slug` | Already in use, supports nested routes |
| react-i18next | ^16.6.6 | Bilingual content for service pages and team | Already configured with bundled JSON resources |
| framer-motion | ^12.38.0 | Page animations, section reveals | Already used throughout (AnimatedSection, Services cards) |
| lucide-react | ^1.5.0 | Icons for service features and UI elements | Already used for all icons |
| tailwindcss | ^3.4.19 | Styling with Brutalist design system | All existing styles are Tailwind |

### No New Dependencies Needed
This phase requires zero new npm packages. Everything needed is already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
  pages/
    HomePage.tsx          # Add Team section, update service card links
    ServicePage.tsx       # NEW: shared template for all 4 service pages
    NotFoundPage.tsx      # Existing
  components/
    sections/
      Team.tsx            # NEW: team members grid for homepage
      ServiceHero.tsx     # NEW: service page hero section
      ServiceFeatures.tsx # NEW: features/capabilities list
      ServiceProcess.tsx  # NEW: process/how-we-work steps
      ServiceCTA.tsx      # NEW: unique CTA per service
    layout/
      Navbar.tsx          # UPDATE: add service page links, handle both scroll and route navigation
      Footer.tsx          # UPDATE: service links become <Link> to dedicated pages
  data/
    services.ts           # UPDATE: rename websites->software, add slug field
    team.ts               # NEW: team member static data (name placeholders, role keys)
  i18n/
    locales/
      en/common.json      # UPDATE: add servicePages.*, team.* keys, rename websites->software
      bg/common.json      # UPDATE: same structure in Bulgarian
```

### Pattern 1: Shared Service Page Template
**What:** A single `ServicePage.tsx` component that renders all 4 service pages using data from the URL slug
**When to use:** When all pages share the same 4-section structure (Hero, Features, Process, CTA)
**Why chosen:** User specified identical section structure for all services; a shared template avoids code duplication and ensures visual consistency
**Example:**
```typescript
// src/pages/ServicePage.tsx
import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ServiceHero } from '../components/sections/ServiceHero'
import { ServiceFeatures } from '../components/sections/ServiceFeatures'
import { ServiceProcess } from '../components/sections/ServiceProcess'
import { ServiceCTA } from '../components/sections/ServiceCTA'

const VALID_SLUGS = ['seo', 'ecommerce', 'ai', 'software'] as const

export function ServicePage() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  useLanguageSync()
  const { t } = useTranslation()

  if (!slug || !VALID_SLUGS.includes(slug as any)) {
    return <Navigate to={`/${lang || 'en'}/`} replace />
  }

  usePageMeta(`servicePages.${slug}.meta.title`, `servicePages.${slug}.meta.description`)

  return (
    <>
      <Navbar />
      <ServiceHero slug={slug} />
      <ServiceFeatures slug={slug} />
      <ServiceProcess slug={slug} />
      <ServiceCTA slug={slug} />
      <Footer />
    </>
  )
}
```

### Pattern 2: Route Registration
**What:** Add service page route to App.tsx between HomePage and NotFound
**Example:**
```typescript
// App.tsx - add route for service pages
<Routes>
  <Route path="/" element={<Navigate to="/en/" replace />} />
  <Route path="/:lang" element={<HomePage />} />
  <Route path="/:lang/services/:slug" element={<ServicePage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Pattern 3: Service Card Links to Dedicated Pages
**What:** Service cards on homepage link to dedicated service pages instead of scrolling to detail sections
**Key insight:** Currently `scrollToSection(service.id)` is used for services with `detailHeadline`. For the 4 services getting dedicated pages, this should become `<Link to={/${lang}/services/${slug}}>`. Services without pages (Landing Pages, Maintenance) remain as static cards.
**Example:**
```typescript
// In Services.tsx, for services with dedicated pages:
import { Link, useParams } from 'react-router-dom'

// Map service IDs to URL slugs
const SERVICE_SLUGS: Record<string, string> = {
  seo: 'seo',
  ecommerce: 'ecommerce',
  ai: 'ai',
  software: 'software',  // renamed from 'websites'
}

// In the card render:
const slug = SERVICE_SLUGS[service.id]
if (slug) {
  return (
    <Link to={`/${lang}/services/${slug}`} className="...">
      Learn more <ArrowUpRight />
    </Link>
  )
}
```

### Pattern 4: i18n Content Structure for Service Pages
**What:** Organize service page content under `servicePages` namespace in translation JSON
**Example:**
```json
{
  "servicePages": {
    "seo": {
      "meta": {
        "title": "SEO Services - E&P Systems",
        "description": "..."
      },
      "hero": {
        "badge": "SEO Services",
        "heading": "Dominate Search Results",
        "subheading": "..."
      },
      "features": {
        "heading": "What We Deliver",
        "items": {
          "0": { "title": "Technical SEO Audits", "description": "..." },
          "1": { "title": "On-Page Optimization", "description": "..." },
          "2": { "title": "Authority Link Building", "description": "..." }
        }
      },
      "process": {
        "heading": "How We Work",
        "steps": {
          "0": { "title": "Audit", "description": "..." },
          "1": { "title": "Strategy", "description": "..." },
          "2": { "title": "Execute", "description": "..." },
          "3": { "title": "Report", "description": "..." }
        }
      },
      "cta": {
        "heading": "Ready to Rank Higher?",
        "description": "...",
        "button": "Get a Free SEO Audit"
      }
    }
  }
}
```

### Pattern 5: Team Section Data
**What:** Static team data with i18n overlay (same pattern as services)
**Example:**
```typescript
// src/data/team.ts
export interface TeamMember {
  id: string
  photo: string  // path to placeholder or real photo
}

export const teamMembers: TeamMember[] = [
  { id: 'member1', photo: '/team/placeholder-1.svg' },
  { id: 'member2', photo: '/team/placeholder-2.svg' },
  { id: 'member3', photo: '/team/placeholder-3.svg' },
]
```
```json
// In translation JSON:
{
  "team": {
    "badge": "Our Team",
    "heading": "The People Behind E&P Systems",
    "members": {
      "member1": { "name": "Emil Petrov", "role": "Founder & Lead Developer" },
      "member2": { "name": "Petar Ivanov", "role": "Full-Stack Developer" },
      "member3": { "name": "Maria Dimitrova", "role": "UI/UX Designer" }
    }
  }
}
```

### Anti-Patterns to Avoid
- **Separate route files per service:** Do not create `/pages/SeoPage.tsx`, `/pages/EcommercePage.tsx` etc. Use a single shared template.
- **Hardcoded content in components:** All text must go through `t()`. Never embed English or Bulgarian strings directly in JSX.
- **Removing homepage service detail sections prematurely:** The homepage detail sections (ServiceDetail for SEO, E-Commerce, AI) can stay or be replaced with links to dedicated pages. Decision: replace the 3 inline ServiceDetail sections on homepage with "Learn more" links to service pages, keeping the homepage shorter.
- **Breaking scroll navigation for non-paged services:** Landing Pages and Maintenance & Support still appear as cards on the homepage. Do not add broken "Learn more" links for them.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Routing params | Custom URL parsing | `useParams()` from react-router-dom | Already set up, handles `:lang` and `:slug` |
| Language sync | Manual i18n detection | `useLanguageSync()` hook | Already built in Phase 2, handles edge cases |
| Page meta tags | Manual DOM manipulation | `usePageMeta()` hook | Already built in Phase 3, handles title + description |
| Scroll-to-top on nav | Custom scroll logic | `ScrollToTop` component | Already handles lang-prefix stripping |
| Placeholder avatars | Complex SVG generation | Simple div with initials or generic icon | Keep minimal, user replaces with real photos later |

## Common Pitfalls

### Pitfall 1: Navbar Breaks on Service Pages
**What goes wrong:** Navbar currently uses `scrollToSection()` for all links. On service pages, there are no `#services` or `#seo` sections to scroll to.
**Why it happens:** Navbar was built for single-page scroll navigation only.
**How to avoid:** Navbar must detect whether user is on homepage or a service page. On service pages, nav links should navigate to `/${lang}/#services` (homepage with scroll target). Use `useLocation()` to check current path.
**Warning signs:** Clicking "Services" or "SEO" in navbar does nothing on service pages.

### Pitfall 2: "Custom Websites" Rename Incomplete
**What goes wrong:** Old "Custom Websites" text appears somewhere -- in service data, translation files, or component references.
**Why it happens:** The rename touches: `services.ts` (id, title, titleBreak), both translation JSON files, Navbar links, Footer links, homepage detailConfig, and the service card slug mapping.
**How to avoid:** Search for all occurrences of "websites", "Websites", "Уеб сайтове" across the entire codebase. The service `id` changes from `'websites'` to `'software'`.
**Warning signs:** Any reference to "Custom Websites" or the old `websites` id in code or JSON.

### Pitfall 3: Service Slug Mismatch
**What goes wrong:** URL slug doesn't match service data `id`, causing page to show "not found" or wrong content.
**Why it happens:** Service IDs in `services.ts` were chosen for scroll targets, not URLs. The `id: 'ai'` is fine for URL, but the rename from `websites` to `software` must be consistent.
**How to avoid:** Define a single source of truth for valid slugs. Map them explicitly to service IDs.

### Pitfall 4: Missing useLanguageSync on Service Pages
**What goes wrong:** Language doesn't sync from URL on service pages, content shows in wrong language.
**Why it happens:** `useLanguageSync()` must be called in every page component that uses `:lang` param.
**How to avoid:** Call `useLanguageSync()` at the top of `ServicePage` component (same as `HomePage` does).

### Pitfall 5: Homepage Gets Too Long After Adding Team
**What goes wrong:** Adding Team section without removing inline ServiceDetail sections makes homepage excessively long.
**Why it happens:** Homepage currently has 3 ServiceDetail sections that duplicate content going to dedicated pages.
**How to avoid:** Remove the 3 inline `ServiceDetail` sections from `HomePage.tsx` when adding service page routes. Replace the "Learn more" action on service cards with links to dedicated pages.

### Pitfall 6: Team Photos Not Found
**What goes wrong:** Broken image tags when real photos aren't provided yet.
**Why it happens:** Using `<img src="/team/photo.jpg">` with no file at that path.
**How to avoid:** Use a CSS-based placeholder (colored div with initials, or a lucide-react User icon) rather than an `<img>` tag pointing to a nonexistent file. Only switch to `<img>` when real photos are added.

## Code Examples

### Updating Services.ts for Rename
```typescript
// services.ts - change 'websites' entry
{
  id: 'software',  // was 'websites'
  icon: Globe,
  title: 'Custom',
  titleBreak: 'Software',  // was 'Websites'
  description: '...',
  features: ['...', '...', '...'],
  variant: 'lime',
  detailHeadline: 'Custom software solutions tailored to your business.',
  detailDescription: '...',
  ctaText: 'Discuss Your Project',
}
```

### Navbar with Dual Navigation (Scroll + Route)
```typescript
// Pattern for navbar links that work on both homepage and service pages
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'

const { lang } = useParams<{ lang: string }>()
const location = useLocation()
const navigate = useNavigate()
const isHomePage = location.pathname === `/${lang}/` || location.pathname === `/${lang}`

const handleNavClick = (sectionId: string) => {
  if (isHomePage) {
    scrollToSection(sectionId)
  } else {
    navigate(`/${lang}/`)
    // ScrollToTop resets position; need setTimeout for scroll after navigation
    setTimeout(() => scrollToSection(sectionId), 100)
  }
}
```

### Team Card with Brutalist Aesthetic
```typescript
// Brutalist team card matching existing design language
<div className="bg-white p-8 rounded-[30px] border-4 border-black brutalist-shadow-static text-center">
  {/* Placeholder avatar */}
  <div className="w-32 h-32 mx-auto mb-6 bg-[#B9FF66] border-4 border-black rounded-full flex items-center justify-center">
    <User size={48} className="text-black" />
  </div>
  <h3 className="text-2xl font-black tracking-tighter">{t(`team.members.${id}.name`)}</h3>
  <p className="text-lg text-zinc-600 font-bold mt-2">{t(`team.members.${id}.role`)}</p>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hash-based scroll nav | React Router route-based pages | Phase 1 | Enables `/:lang/services/:slug` pattern |
| Hardcoded English text | i18next translation keys | Phase 2-3 | All new content must use `t()` calls |
| Static service data | `useServices()` hook with i18n overlay | Phase 3 | Service page content follows same pattern |
| No page meta | `usePageMeta()` hook | Phase 3 | Each service page needs meta title/description keys |

## Open Questions

1. **Homepage ServiceDetail sections after adding service pages**
   - What we know: Homepage currently renders 3 ServiceDetail sections inline (SEO, E-Commerce, AI)
   - What's unclear: Should these remain on homepage as previews, or be removed since dedicated pages now exist?
   - Recommendation: Remove them to keep homepage concise. Service cards link directly to dedicated pages. This is Claude's discretion per CONTEXT.md.

2. **Custom Software service -- was it intentionally without a detail section?**
   - What we know: The old `websites` service had no `detailHeadline` (no detail section on homepage). Now it's being promoted to "Custom Software" with a dedicated page.
   - What's unclear: Nothing blocking -- just needs `detailHeadline`, `detailDescription`, and `ctaText` added to `services.ts` and translations.
   - Recommendation: Add these fields as part of the rename task.

3. **Navbar link structure on service pages**
   - What we know: Current navbar has scroll-to links (Services, SEO, E-Commerce, Projects)
   - What's unclear: Should navbar links change to route to service pages directly, or remain as homepage scroll targets?
   - Recommendation: Keep "Services" as scroll/navigate to homepage services section. Individual service names in footer can link to dedicated pages. This balances discoverability with simplicity.

## Sources

### Primary (HIGH confidence)
- Codebase analysis of `src/App.tsx`, `src/data/services.ts`, `src/hooks/useServices.ts`, `src/pages/HomePage.tsx`
- Codebase analysis of `src/i18n/locales/en/common.json` and `bg/common.json` for translation structure
- Codebase analysis of `src/components/layout/Navbar.tsx` and `Footer.tsx` for navigation patterns
- React Router v7 `useParams`, `Navigate`, `Link` -- already in use in codebase

### Secondary (MEDIUM confidence)
- Brutalist design patterns derived from existing component styles (border-4, rounded-[30px], brutalist-shadow classes)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all libraries already in use and verified in codebase
- Architecture: HIGH - extending existing patterns (useServices, useLanguageSync, usePageMeta, translation JSON)
- Pitfalls: HIGH - identified from direct codebase analysis of navigation and data flow
- Content drafting: MEDIUM - Bulgarian translations are Claude-drafted, user reviews during verification

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable -- no external dependency changes expected)
