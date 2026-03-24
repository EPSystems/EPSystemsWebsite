# Architecture Research

**Domain:** Bilingual multi-page React agency website (SPA with client-side routing and i18n)
**Researched:** 2026-03-24
**Confidence:** HIGH

## Current State Assessment

The existing codebase is a React 19 SPA with no router. Navigation uses hash-based anchor scrolling (`#services`, `#seo`, etc.). All content is hardcoded in English within components. App.tsx composes sections sequentially -- Navbar, Hero, Marquee, Services, ServiceDetail(x3), CTA, CaseStudies, Footer. State is minimal (one `useState` for mobile menu). There is no global state management and none is needed.

The transformation required: add client-side routing for multi-page navigation and wrap all user-visible strings in an i18n translation layer supporting English and Bulgarian.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / URL Bar                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Router (BrowserRouter)                  │  │
│  │         /:lang/* route structure                           │  │
│  └───────────────────┬───────────────────────────────────────┘  │
│                      │                                          │
│  ┌───────────────────▼───────────────────────────────────────┐  │
│  │              i18n Context (react-i18next)                  │  │
│  │         Language from URL param → i18next.changeLanguage   │  │
│  └───────────────────┬───────────────────────────────────────┘  │
│                      │                                          │
│  ┌───────────────────▼───────────────────────────────────────┐  │
│  │                   Layout Shell                             │  │
│  │    ┌─────────┐  ┌──────────────────┐  ┌──────────┐        │  │
│  │    │ Navbar  │  │  <Outlet /> Page  │  │  Footer  │        │  │
│  │    │ + Lang  │  │   Content Area    │  │          │        │  │
│  │    │ Switch  │  │                   │  │          │        │  │
│  │    └─────────┘  └──────────────────┘  └──────────┘        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Data Layer                               │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │  │
│  │  │ services │  │ translations │  │ team members (new)   │  │  │
│  │  │ .ts      │  │ /en/*.json   │  │ .ts                  │  │  │
│  │  │          │  │ /bg/*.json   │  │                      │  │  │
│  │  └──────────┘  └──────────────┘  └──────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Recommended Architecture

### Routing: React Router v7 Declarative Mode

Use `react-router` (v7) in **declarative mode** with `BrowserRouter`, `Routes`, and `Route`. This is the lightest integration path for the existing Vite + React SPA.

**Why declarative mode, not framework or data mode:**
- The site is static content -- no loaders, no actions, no server-side data fetching
- Framework mode would require restructuring the entire project to file-based routing conventions
- Data mode (`createBrowserRouter`) adds unnecessary complexity for a site with no async data needs
- Declarative mode drops in with minimal changes to the existing architecture

**URL structure:**

```
/                     → redirect to /en
/en                   → English homepage
/bg                   → Bulgarian homepage
/en/services/seo      → English SEO service page
/bg/services/seo      → Bulgarian SEO service page
/en/team              → English team page
/bg/team              → Bulgarian team page
```

The `:lang` param drives both routing and i18n language selection.

### i18n: react-i18next with JSON Translation Files

Use `react-i18next` + `i18next` with `i18next-browser-languagedetector`. Translation files stored as JSON in `public/locales/`.

**Why react-i18next:**
- De facto standard for React i18n (most downloaded, best documented)
- Works perfectly with React hooks (`useTranslation`)
- Namespace support maps cleanly to page boundaries
- No build-time complexity -- translations loaded at runtime from JSON
- Supports interpolation, pluralization, and nested keys out of the box

**Why NOT alternatives:**
- `next-intl` / `next-i18next`: Next.js specific, irrelevant for Vite SPA
- `react-intl` (FormatJS): More ceremony, less ergonomic hooks API, overkill for two languages
- `Intlayer`: Newer, smaller ecosystem, less battle-tested
- Custom solution: Reinventing the wheel for a solved problem

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `BrowserRouter` | URL parsing, history management | All route-aware components |
| `LanguageRoute` (new) | Extracts `:lang` from URL, syncs i18next language | i18next instance, child routes |
| `Layout` (new) | Wraps Navbar + Outlet + Footer, shared across all pages | Navbar, Footer, page components |
| `Navbar` (updated) | Navigation links using `<Link>`, language switcher | React Router (`Link`, `useParams`), i18next |
| `Footer` (updated) | Sitemap links using `<Link>` | React Router (`Link`) |
| `HomePage` (new) | Composes existing sections (Hero, Marquee, Services, etc.) | Section components |
| `ServicePage` (new) | Individual service detail page | Service data, i18next |
| `TeamPage` (new) | Team member profiles | Team data, i18next |
| `useLanguageSync` (new) | Custom hook: sync URL `:lang` param to i18next | React Router params, i18next |

## Recommended Project Structure

```
src/
├── i18n.ts                        # i18next initialization and config
├── main.tsx                       # React entry, wraps App in BrowserRouter
├── App.tsx                        # Route definitions, LanguageRoute wrapper
├── components/
│   ├── layout/
│   │   ├── Layout.tsx             # NEW: Navbar + Outlet + Footer shell
│   │   ├── Navbar.tsx             # UPDATED: <Link> instead of <a href="#...">
│   │   ├── Footer.tsx             # UPDATED: <Link> instead of <a>
│   │   └── LanguageSwitcher.tsx   # NEW: EN/BG toggle, changes URL prefix
│   ├── sections/                  # UNCHANGED: Hero, Services, etc.
│   │   ├── Hero.tsx
│   │   ├── Marquee.tsx
│   │   ├── Services.tsx
│   │   ├── ServiceDetail.tsx
│   │   ├── CaseStudies.tsx
│   │   └── CTA.tsx
│   ├── ui/
│   │   └── AnimatedSection.tsx    # UNCHANGED
│   └── common/                    # NEW: shared components
│       └── LocalizedLink.tsx      # NEW: Link that preserves :lang prefix
├── pages/                         # NEW: page-level components
│   ├── HomePage.tsx               # Composes existing sections
│   ├── ServicePage.tsx            # Individual service route
│   └── TeamPage.tsx               # Team member profiles
├── hooks/                         # NEW
│   └── useLanguageSync.ts         # Sync URL :lang to i18next
├── data/
│   ├── services.ts                # UNCHANGED: service definitions
│   └── team.ts                    # NEW: team member data
└── types/                         # NEW: shared TypeScript types
    └── index.ts

public/
└── locales/
    ├── en/
    │   ├── common.json            # Shared strings (nav, footer, buttons)
    │   ├── home.json              # Homepage section content
    │   ├── services.json          # Service descriptions
    │   └── team.json              # Team page content
    └── bg/
        ├── common.json
        ├── home.json
        ├── services.json
        └── team.json
```

### Structure Rationale

- **`pages/`**: Separates route-level components (what the router renders) from reusable sections. HomePage simply composes existing section components -- no duplication.
- **`public/locales/`**: JSON files in public directory so they can be loaded at runtime without bundling. Keeps translation strings out of component code.
- **`hooks/`**: The language sync hook is reused across the app. Centralizing hooks follows standard React convention.
- **`components/common/`**: `LocalizedLink` is a thin wrapper around React Router's `Link` that auto-prepends the current language prefix. Used everywhere instead of raw `<Link>`.
- **Existing `sections/` unchanged**: Section components stay where they are. They gain `useTranslation()` calls internally but their file locations and responsibilities do not change.

## Architectural Patterns

### Pattern 1: URL-Driven Language with Sync Hook

**What:** The URL is the single source of truth for current language. A custom hook reads `:lang` from React Router params and calls `i18next.changeLanguage()` to keep them in sync.

**When to use:** On every route that has the `:lang` parameter (all of them in this app).

**Trade-offs:** Simple, shareable URLs per language. Slight coupling between router and i18n, but that coupling is isolated in one hook.

**Example:**
```typescript
// src/hooks/useLanguageSync.ts
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export function useLanguageSync() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
    }
  }, [lang, i18n]);

  return lang || 'en';
}
```

### Pattern 2: Layout Route with Outlet

**What:** A `Layout` component renders Navbar, `<Outlet />`, and Footer. All page routes are nested inside it, so the shell is rendered once and only page content swaps on navigation.

**When to use:** Standard pattern for any multi-page SPA with shared header/footer.

**Trade-offs:** Clean separation. Navbar/Footer render once and survive navigation. Scroll position needs explicit management (scroll to top on route change).

**Example:**
```typescript
// src/App.tsx (simplified route structure)
<Routes>
  <Route path="/" element={<Navigate to="/en" replace />} />
  <Route path="/:lang" element={<LanguageLayout />}>
    <Route index element={<HomePage />} />
    <Route path="services/:serviceId" element={<ServicePage />} />
    <Route path="team" element={<TeamPage />} />
  </Route>
</Routes>
```

### Pattern 3: Namespace-Per-Page Translation Loading

**What:** Each page declares which i18n namespace(s) it needs. The `useTranslation('home')` call loads only the `home.json` file for the current language.

**When to use:** When you have multiple pages with distinct content to avoid loading all translations upfront.

**Trade-offs:** For a two-language, five-page site, the total translation payload is small. Namespaces add organizational value more than performance value here. But they keep translation files manageable and scoped.

**Example:**
```typescript
// In HomePage.tsx
const { t } = useTranslation('home');
// Reads from public/locales/en/home.json or public/locales/bg/home.json

// In Navbar.tsx
const { t } = useTranslation('common');
// Reads from public/locales/en/common.json
```

### Pattern 4: LocalizedLink Component

**What:** A wrapper around React Router's `<Link>` that automatically prepends the current language prefix to all internal links.

**When to use:** Every internal link in the application. Prevents manually passing `:lang` everywhere.

**Trade-offs:** One extra component, but eliminates an entire class of bugs (links forgetting the language prefix).

**Example:**
```typescript
// src/components/common/LocalizedLink.tsx
import { Link, useParams } from 'react-router';

export function LocalizedLink({ to, ...props }: { to: string } & React.ComponentProps<typeof Link>) {
  const { lang } = useParams<{ lang: string }>();
  const localizedTo = `/${lang || 'en'}${to.startsWith('/') ? to : '/' + to}`;
  return <Link to={localizedTo} {...props} />;
}
```

## Data Flow

### Language Change Flow

```
User clicks EN/BG toggle (LanguageSwitcher)
    │
    ▼
navigate(`/${newLang}/${currentPath}`)  ← React Router navigation
    │
    ▼
URL changes: /en/services/seo → /bg/services/seo
    │
    ▼
useLanguageSync() detects :lang param change
    │
    ▼
i18next.changeLanguage('bg')  ← triggers re-render of all useTranslation consumers
    │
    ▼
document.documentElement.lang = 'bg'  ← accessibility
    │
    ▼
All components re-render with Bulgarian translations
```

### Page Navigation Flow

```
User clicks nav link (LocalizedLink)
    │
    ▼
React Router matches new route
    │
    ▼
Layout stays rendered (Navbar + Footer persist)
    │
    ▼
<Outlet /> swaps to new page component
    │
    ▼
Page component calls useTranslation('namespace')
    │
    ▼
i18next loads namespace JSON if not cached
    │
    ▼
Page renders with translated content
```

### Translation Data Flow

```
public/locales/{lang}/{namespace}.json
    │
    ▼ (loaded by i18next-http-backend at runtime)
    │
i18next store (in-memory cache)
    │
    ▼ (accessed via useTranslation hook)
    │
Component renders t('key') → translated string
```

## Integration Strategy: Existing SPA to Multi-Page

This is the critical path. The migration must be incremental to avoid a risky big-bang rewrite.

### Phase 1: Add Router Shell (no content changes)

1. Install `react-router`
2. Wrap app in `BrowserRouter`
3. Create `Layout` component that renders Navbar + `<Outlet />` + Footer
4. Create `HomePage` that imports and renders all existing sections in order
5. Set up route: `/:lang` → `Layout` → `HomePage`
6. Add redirect: `/` → `/en`
7. Replace hash `<a href="#...">` links in Navbar with smooth-scroll behavior within the page

**Result:** App works exactly as before, but URL is now `/en` instead of `/`. No visual changes.

### Phase 2: Add i18n Infrastructure (no translations yet)

1. Install `react-i18next`, `i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`
2. Create `src/i18n.ts` config file
3. Create `public/locales/en/common.json` with English strings extracted from Navbar and Footer
4. Add `useTranslation('common')` to Navbar and Footer
5. Add `LanguageSwitcher` component to Navbar
6. Create `public/locales/bg/common.json` with Bulgarian translations for nav/footer

**Result:** Nav and footer are bilingual. Toggle works. Page content still hardcoded.

### Phase 3: Translate Page Content

1. Extract all hardcoded strings from section components into `home.json`, `services.json`
2. Replace strings with `t('key')` calls
3. Create Bulgarian translation files

**Result:** Full bilingual homepage.

### Phase 4: Add New Routes

1. Create `ServicePage` component for individual service pages
2. Add route: `/:lang/services/:serviceId`
3. Create `TeamPage` component
4. Add route: `/:lang/team`
5. Update Navbar with links to new pages

**Result:** Multi-page bilingual site.

### Build Order Dependencies

```
Router Shell (Phase 1)
    │
    ├──► i18n Infrastructure (Phase 2)  [depends on router for :lang param]
    │        │
    │        └──► Translate Content (Phase 3)  [depends on i18n setup]
    │
    └──► New Pages (Phase 4)  [depends on router, can parallel with Phase 3]
```

## Anti-Patterns

### Anti-Pattern 1: Storing Language in React State Instead of URL

**What people do:** Use `useState` or React Context to track current language, with no URL reflection.
**Why it is wrong:** URLs are not shareable per-language. Refreshing loses language selection. No SEO benefit from language-specific URLs. Breaks browser back/forward for language changes.
**Do this instead:** Language lives in the URL path (`/en/...`, `/bg/...`). URL is the source of truth. React state syncs from URL, never the other way around.

### Anti-Pattern 2: Translating at the Data Layer

**What people do:** Create separate `services-en.ts` and `services-bg.ts` data files, or put translation objects inside the service data.
**Why it is wrong:** Duplicates data structure. Translation changes require touching TypeScript files. Cannot leverage i18next features (interpolation, fallback). Scales poorly.
**Do this instead:** Keep data files language-agnostic (IDs, icons, structural data). Put all translatable strings in JSON translation files referenced by key.

### Anti-Pattern 3: Big-Bang Router Migration

**What people do:** Rewrite the entire app structure to add routing all at once, changing component hierarchy, navigation, and content simultaneously.
**Why it is wrong:** High risk of regressions. Impossible to test incrementally. Merge conflicts if any other work is in progress.
**Do this instead:** Follow the phased approach above. Phase 1 changes zero visual behavior. Each phase is independently testable and deployable.

### Anti-Pattern 4: Hardcoding Language Prefix in Links

**What people do:** Write `<Link to="/en/services/seo">` directly in components.
**Why it is wrong:** Every link must know the current language. Easy to forget, creating links that jump to the wrong language.
**Do this instead:** Use the `LocalizedLink` component that reads current `:lang` from URL params and prepends it automatically.

## Deployment Considerations

### SPA Fallback

All URLs must resolve to `index.html` for client-side routing to work. Current hash-based navigation does not require this, so deployment configuration must be updated.

| Host | Configuration |
|------|--------------|
| Netlify | `_redirects` file: `/* /index.html 200` |
| Vercel | `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |
| GitHub Pages | Use `404.html` redirect trick or a hash router fallback |
| Nginx | `try_files $uri $uri/ /index.html` |
| Apache | `.htaccess` with `FallbackResource /index.html` |

### SEO for Client-Side Rendered SPA

This site is client-rendered (no SSR). For a bilingual agency site, this is acceptable because:
- Agency sites are discovered via referrals and direct traffic, not primarily organic search
- Google's crawler renders JavaScript well enough for simple SPAs
- If SEO becomes critical later, prerendering can be added via `vite-plugin-ssr` or migration to a framework with SSR

To improve crawlability without SSR:
- Set `<html lang="...">` attribute dynamically
- Use `<link rel="alternate" hreflang="en" href="/en/..." />` tags
- Generate a sitemap with all language variants

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Router ↔ i18n | URL `:lang` param synced via `useLanguageSync` hook | One-directional: URL drives language, never reverse |
| Pages ↔ Sections | Pages import and compose section components | Sections are reusable, pages are route-specific |
| Components ↔ Translations | `useTranslation(namespace)` hook | Components never import JSON directly |
| Navbar ↔ Router | `<Link>` / `LocalizedLink` for navigation | Replace all `<a href="#...">` with router-aware links |
| LanguageSwitcher ↔ Router | `useNavigate` to swap `:lang` in current path | Preserves current page, only changes language prefix |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Fonts | `<link>` in `index.html` | Already configured for Bricolage Grotesque, no change needed |
| Translation files | HTTP fetch from `/public/locales/` | Served as static assets by Vite dev server and production host |
| Future contact form | Would be a new route + API integration | Out of scope, but architecture supports adding it as a page |

## Sources

- [React Router SPA Mode documentation](https://reactrouter.com/how-to/spa) - HIGH confidence
- [React Router Picking a Mode](https://reactrouter.com/start/modes) - HIGH confidence
- [React Router Declarative Mode Installation](https://reactrouter.com/start/declarative/installation) - HIGH confidence
- [react-i18next documentation](https://react.i18next.com/) - HIGH confidence
- [react-i18next useTranslation hook](https://react.i18next.com/latest/usetranslation-hook) - HIGH confidence
- [react-i18next Multiple Translation Files guide](https://react.i18next.com/guides/multiple-translation-files) - HIGH confidence
- [React Router + i18n discussion](https://github.com/remix-run/react-router/discussions/10510) - MEDIUM confidence
- [LogRocket: Choosing React Router v7 modes](https://blog.logrocket.com/react-router-v7-modes/) - MEDIUM confidence

---
*Architecture research for: Bilingual multi-page React agency website*
*Researched: 2026-03-24*
