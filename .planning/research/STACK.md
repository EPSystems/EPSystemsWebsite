# Stack Research

**Domain:** Bilingual i18n + routing for existing React SPA
**Researched:** 2026-03-24
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| react-router | 7.13.2 | Client-side routing with dedicated service page URLs | The standard React routing library. v7 consolidates react-router-dom into a single package, supports React 19, and offers declarative mode that fits a Vite SPA perfectly. No migration overhead since the project has no existing router. |
| i18next | 25.10.9 | Translation engine and namespace management | Dominant i18n runtime with 2.1M weekly downloads, plugin ecosystem, namespace support for lazy-loading translations per page, and mature TypeScript support. |
| react-i18next | 16.6.6 | React bindings for i18next (hooks, components, HOC) | The official React integration. Provides `useTranslation` hook, `Trans` component for JSX interpolation, and `Suspense` support for async translation loading. Requires i18next >= 25.10.9 and TypeScript ^5 or ^6 (project uses TS 6.0.2). |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| i18next-browser-languagedetector | 8.2.1 | Auto-detect user language from browser settings | On first visit to determine initial language (EN vs BG) from Accept-Language header, localStorage, or navigator.language. |
| i18next-resources-to-backend | 1.2.1 | Lazy-load translation JSON files via dynamic import | Use instead of i18next-http-backend for Vite SPAs. Leverages Vite's native dynamic imports so translations are code-split without needing a separate HTTP fetch layer. Smaller and simpler than http-backend for static sites. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| i18next-parser | Extract translation keys from source code | Run as npm script to generate/update EN and BG JSON files from `t()` calls. Prevents missing keys. Optional but recommended after initial setup. |

## Installation

```bash
# Core - routing
npm install react-router@7.13.2

# Core - i18n
npm install i18next@25.10.9 react-i18next@16.6.6

# Supporting - language detection and lazy loading
npm install i18next-browser-languagedetector@8.2.1 i18next-resources-to-backend@1.2.1

# Dev dependencies (optional, for key extraction)
npm install -D i18next-parser
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| react-router (declarative mode) | React Router framework mode | Only if you need SSR/SSG. This project is a static SPA deployed client-only, so declarative mode is correct. Framework mode requires a Vite plugin and server runtime. |
| react-router (declarative mode) | TanStack Router | If you want file-based routing with first-class type safety. Overkill for a small agency site with ~10 routes. Better suited for large apps with complex data loading. |
| i18next + react-i18next | LinguiJS (@lingui/react 5.9.3) | If bundle size is the top priority. Lingui compiles translations at build time for smaller runtime (~5KB vs ~22KB). However, it requires a Babel/SWC macro pipeline, complicates the build, and has a much smaller community. Not worth the tradeoff for a 2-language site. |
| i18next + react-i18next | react-intl (FormatJS) | If you need advanced ICU message formatting (complex plurals, gender, ordinals). This site has simple string translations in 2 languages -- i18next's simpler API is a better DX fit. |
| i18next-resources-to-backend | i18next-http-backend 3.0.2 | If translations are served from a separate API or CDN. For this static SPA where JSON files live in the repo, resources-to-backend with Vite dynamic imports is simpler and eliminates extra HTTP requests in production. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-router-dom (v6 package name) | Deprecated naming in v7. The `react-router-dom` package still publishes but v7 consolidates everything into `react-router`. Using the old name causes confusion about imports. | `react-router` with `import { BrowserRouter } from "react-router"` |
| i18next-http-backend | Adds unnecessary HTTP fetching layer for a static site where translations are bundled. Creates a loading flash on language switch. | `i18next-resources-to-backend` with Vite dynamic imports for code-split but instant loading |
| next-i18next / next-intl | Next.js-specific libraries. This project is Vite + React, not Next.js. | `react-i18next` (framework-agnostic) |
| Manual i18n with React Context | Reinventing the wheel. No pluralization, no interpolation, no namespace support, no tooling ecosystem. | `i18next` which solves all of these out of the box |
| HashRouter | The project currently uses hash-based anchor navigation but dedicated service pages need clean URLs for SEO (`/services/web-development` not `/#services-web-development`). | `BrowserRouter` from react-router -- requires static host to redirect all paths to index.html (standard SPA config) |

## Stack Patterns

**For language-prefixed URLs (recommended for this project):**
- Use react-router with a `/:lang` prefix on all routes: `/:lang/services/web-development`
- Sync the language param with i18next via a layout route that calls `i18n.changeLanguage(lang)`
- Default `/` redirects to `/en` or `/bg` based on browser detection
- This gives each language version a unique, shareable, bookmarkable URL

**For non-prefixed URLs (simpler but worse for SEO):**
- Store language in localStorage only, no URL reflection
- Simpler routing but loses shareability of language-specific URLs
- Not recommended for a bilingual agency site where Bulgarian clients may share links

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| react-router@7.13.2 | react@>=18, react-dom@>=18 | Project has React 19.2.4 -- fully compatible |
| react-i18next@16.6.6 | i18next@>=25.10.9, react@>=16.8.0, typescript@^5 or ^6 | Project has TS 6.0.2 -- fully compatible |
| i18next-browser-languagedetector@8.2.1 | i18next@>=25.0.0 | Compatible with i18next 25.10.9 |
| i18next-resources-to-backend@1.2.1 | i18next@>=25.0.0 | Compatible with i18next 25.10.9 |
| All packages above | Vite 5.4.21 | No Vite-specific issues. react-router declarative mode has no Vite plugin requirement. |

## Sources

- [React Router v7 Modes Documentation](https://reactrouter.com/start/modes) -- Confirmed declarative mode for SPAs (HIGH confidence)
- [React Router v6 to v7 Upgrade Guide](https://reactrouter.com/upgrading/v6) -- Confirmed package consolidation to `react-router` (HIGH confidence)
- [npm registry](https://www.npmjs.com/) -- All version numbers verified via `npm view` CLI (HIGH confidence)
- [i18next Comparison to Others](https://www.i18next.com/overview/comparison-to-others) -- Official comparison page (HIGH confidence)
- [DEV Community: Best i18n Libraries 2026](https://dev.to/erayg/best-i18n-libraries-for-nextjs-react-react-native-in-2026-honest-comparison-3m8f) -- Ecosystem overview, bundle size data (MEDIUM confidence)
- [Locize Blog: react-intl vs react-i18next](https://www.locize.com/blog/react-intl-vs-react-i18next/) -- Detailed comparison (MEDIUM confidence)

---
*Stack research for: Bilingual i18n + routing addition to React SPA*
*Researched: 2026-03-24*
