# Pitfalls Research

**Domain:** Bilingual agency SPA -- adding i18n, routing, and new pages to existing React site
**Researched:** 2026-03-24
**Confidence:** HIGH (codebase-specific pitfalls verified against source; ecosystem pitfalls verified across multiple sources)

## Critical Pitfalls

### Pitfall 1: Hash Navigation Conflict with React Router

**What goes wrong:**
The existing site uses `href="#services"`, `href="#seo"`, `href="#ecommerce"`, `href="#case-studies"`, and `href="#contact"` for in-page navigation (see `Navbar.tsx` lines 16-19, 37-40). Introducing React Router with `BrowserRouter` breaks all of these -- hash anchors no longer scroll to sections because React Router intercepts navigation. Users clicking "Services" in the navbar get routed to a 404 or blank page instead of scrolling.

**Why it happens:**
Developers add React Router for new pages but forget to migrate existing hash-based navigation. React Router's `<Link>` component and `BrowserRouter` don't handle `#anchor` scrolling natively -- they treat the hash as a route fragment.

**How to avoid:**
1. Audit every `href="#..."` in Navbar, Footer, Hero, CTA before adding the router. There are at least 11 hash links across the codebase.
2. Replace hash links on the homepage with a scroll utility (e.g., `scrollIntoView` with `behavior: 'smooth'`) wrapped in an `onClick` handler, or use React Router's `<HashLink>` from `react-router-hash-link`.
3. For cross-page links (e.g., from `/services/seo` back to `/#case-studies`), use React Router `navigate` followed by a scroll after navigation completes.
4. Test every existing navigation path after router introduction.

**Warning signs:**
- Clicking navbar links navigates away from homepage instead of scrolling
- `scroll-smooth` class on `<html>` stops working
- Browser back button behavior changes unexpectedly

**Phase to address:**
Routing introduction phase -- this must be the FIRST thing handled when adding React Router, before any new pages are created.

---

### Pitfall 2: Extracting Hardcoded Strings Incompletely

**What goes wrong:**
The entire site has English strings hardcoded in JSX across every component -- Hero headlines, service titles/descriptions in `services.ts`, CTA copy, case study data in `CaseStudies.tsx`, Navbar links, Footer content. When adding i18n, developers extract strings from a few visible components but miss strings in data files (`services.ts`), alt text, aria-labels, document `<title>`, meta description, and button labels buried in conditional renders. The result: a site that appears bilingual on the homepage but has English fragments scattered throughout -- especially in service cards, case study highlights, and footer contact info.

**Why it happens:**
String extraction is tedious. The codebase has content in at least 3 locations: JSX components, the `services.ts` data file, and `index.html` meta tags. Developers extract the obvious UI strings but miss data-layer content.

**How to avoid:**
1. Create a complete string inventory BEFORE writing any translation code. Grep for every quoted string in `.tsx` and `.ts` files.
2. Move ALL content out of `services.ts` into translation files. The service data structure should reference translation keys, not literal English strings.
3. Handle `index.html` `<title>` and `<meta description>` dynamically via `react-helmet` or equivalent -- these cannot be i18n'd with react-i18next alone.
4. Create a "no hardcoded strings" lint rule or PR checklist item after i18n is set up.

**Warning signs:**
- Switching to Bulgarian shows English text in service cards, footer, or case studies
- Browser tab title stays in English regardless of language
- Search engines index only English meta descriptions

**Phase to address:**
i18n setup phase -- string extraction must be exhaustive before translation begins. Do a dedicated "string audit" task.

---

### Pitfall 3: Bulgarian Text Expansion Breaking Brutalist Layout

**What goes wrong:**
Bulgarian translations are typically 15-30% longer than English equivalents. The site's Brutalist design uses tight, deliberate spacing with fixed-width cards, bold borders, and specific visual rhythm. Longer Bulgarian text overflows cards in the Services grid, breaks the Marquee animation timing, causes Navbar pill to overflow on desktop, and disrupts the carefully balanced Hero headline typography (which uses `WebkitTextStroke` and large font sizes).

**Why it happens:**
Designs are built and tested exclusively in English. Bulgarian (Cyrillic) words are often longer than their English equivalents. The Brutalist style with hard borders and shadows makes overflow visually catastrophic -- unlike soft designs where overflow is subtle, brutalist borders and shadows make clipped or wrapped text look broken.

**How to avoid:**
1. Test EVERY component with Bulgarian placeholder text BEFORE final translations arrive. Use long dummy strings.
2. Use `min-w-0` and `overflow-hidden` / `text-ellipsis` as safety nets on cards, but prefer flexible layouts.
3. For the Marquee component: Bulgarian text changes the total width of the scrolling content, which affects the `-50%` transform endpoint. Recalculate animation duration based on content width, or use a JS-driven animation instead of CSS `translateX(-50%)`.
4. For Hero headlines: design separate headline treatments per language rather than assuming 1:1 text replacement works visually.
5. For Navbar: the pill-shaped nav container (`rounded-full border-2`) has fixed padding -- test with Bulgarian link labels and adjust or allow wrapping.

**Warning signs:**
- Text truncation or overflow on any card/button after switching language
- Marquee animation stutters or has a visible gap at loop boundary
- Navbar links wrap to two lines inside the pill

**Phase to address:**
Component polish phase -- AFTER translations are in place. Requires visual QA in both languages.

---

### Pitfall 4: Scroll Restoration and Position Loss on Route Changes

**What goes wrong:**
When users navigate from a service detail page (e.g., `/services/seo`) back to the homepage, the browser doesn't scroll to the top -- they land mid-page at whatever scroll position the previous page had. Conversely, when using browser back from a detail page, the homepage scroll position from before navigation is lost. This creates a disorienting UX where users feel lost in the page.

**Why it happens:**
SPAs use `history.pushState` for navigation, so the browser's native scroll restoration doesn't work. React Router doesn't handle scroll restoration by default. Content renders asynchronously (especially with Framer Motion `whileInView` animations), so the page height isn't known at navigation time.

**How to avoid:**
1. Add a `ScrollToTop` component that calls `window.scrollTo(0, 0)` on every route change -- place it inside the Router, triggered by `useLocation` changes.
2. For the homepage with animated sections: ensure scroll-to-top fires BEFORE `whileInView` animations trigger, or animations replay confusingly.
3. Test the back button specifically: home -> service page -> back should restore home scroll position.
4. If using hash links cross-page (e.g., `/en/#services`), add a small delay before `scrollIntoView` to let the DOM render.

**Warning signs:**
- Navigating to a new page starts in the middle instead of the top
- Browser back button shows the right URL but wrong scroll position
- Framer Motion animations don't replay when returning to homepage

**Phase to address:**
Routing introduction phase -- implement alongside the router setup, not as an afterthought.

---

### Pitfall 5: Locale Not Reflected in URL Structure

**What goes wrong:**
Developers add i18n with a language toggle that switches content via React state or localStorage, but the URL stays the same (`/services/seo` for both English and Bulgarian). This means: URLs cannot be shared in a specific language, search engines cannot index both language versions separately, there are no `hreflang` tags possible, and the Bulgarian version is effectively invisible to Google.

**Why it happens:**
It's simpler to store locale in state/localStorage than to integrate it into routing. Many i18n tutorials show the "easy" approach of state-based language switching without discussing URL implications.

**How to avoid:**
1. Use locale-prefixed URLs from the start: `/en/services/seo` and `/bg/services/seo`. This is the SEO-recommended subdirectory approach for bilingual sites.
2. Set a default locale (English) with optional prefix -- either always show `/en/...` or treat no-prefix as English and `/bg/...` as Bulgarian. The "always prefix" approach is cleaner and avoids ambiguity.
3. Add `<link rel="alternate" hreflang="en" href="...">` and `hreflang="bg"` tags to every page.
4. Integrate locale into React Router: the locale prefix should be a route parameter that drives i18next language detection.
5. Generate a sitemap with both language versions of every URL.

**Warning signs:**
- Language toggle changes content but URL stays the same
- No `hreflang` tags in page source
- Google Search Console shows only one language version indexed

**Phase to address:**
Routing and i18n phases -- these two features MUST be designed together, not sequentially. The URL structure decision affects both routing config and i18n setup.

---

### Pitfall 6: SPA SEO Blindspot -- Client-Rendered Content Invisible to Crawlers

**What goes wrong:**
The site is a Vite SPA with client-side rendering. Adding pages with unique URLs (e.g., `/services/web-development`) creates routes that return empty HTML shells to crawlers. Google's two-phase indexing (crawl raw HTML first, render JS later) means new pages may take weeks to appear in search results, or never appear if the crawl budget is exhausted. For an agency that offers SEO services, having an un-indexable website is particularly damaging to credibility.

**Why it happens:**
The project constraint is "no SSR, keep it client-only." This is a valid constraint for simplicity, but it means all SEO content is JS-dependent. The current single-page site has one URL to index; adding 10+ pages multiplies the SEO risk.

**How to avoid:**
1. Use `vite-plugin-prerender` or `vite-ssg` to pre-render static HTML for each route at build time. This gives crawlers real HTML while keeping the SPA architecture at runtime.
2. At minimum, ensure each page's `<title>`, `<meta description>`, and `<h1>` are present in the pre-rendered HTML.
3. Create a `sitemap.xml` listing all pages in both languages.
4. Add structured data (JSON-LD) for the organization and services.
5. If pre-rendering is rejected as too complex: at minimum, use `react-helmet` to manage per-page `<title>` and `<meta>` tags, and submit the sitemap to Google Search Console.

**Warning signs:**
- Viewing page source shows empty `<div id="root"></div>` with no content
- Google Search Console shows "Discovered - currently not indexed" for new pages
- Social media link previews show generic title/description instead of page-specific content

**Phase to address:**
Should be addressed in the routing/pages phase. Pre-rendering config should be set up when the first new page is created, not deferred.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Store locale in localStorage only (no URL prefix) | Faster to implement, no routing changes | No SEO for Bulgarian, non-shareable URLs, breaks bookmarks | Never -- for a bilingual agency site, URL-based locale is mandatory |
| Duplicate JSX for each language instead of using translation keys | Quick for 2 languages | Every content change requires edits in 2 places, component files become enormous | Never -- even for 2 languages, translation files are the correct approach |
| Hardcode Bulgarian strings alongside English in `services.ts` | No i18n library needed | Data file becomes unreadable, no separation of content from code, breaks if a 3rd language ever added | Never |
| Skip pre-rendering, rely on JS-only rendering | No build config changes | All new pages invisible to crawlers, hurts agency credibility | Only if SEO is genuinely not a goal (it is for this project) |
| Use separate Navbar components per language | Avoids i18n in navigation | Double maintenance, drift between versions | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| react-i18next + React Router | Initializing i18n after Router mounts, causing flash of untranslated content | Initialize i18n synchronously before `ReactDOM.createRoot`. Use `i18next.init()` with `initImmediate: false` or load translations synchronously via bundled JSON |
| react-helmet + i18n | Setting `<html lang="en">` once in `index.html` and never updating it | Use `react-helmet` to set `<html lang={currentLocale}>` dynamically on every language change |
| Framer Motion + React Router | Page transitions conflicting with `whileInView` animations, causing animations to not replay on revisit | Use `AnimatePresence` with `mode="wait"` for page transitions. Set unique `key` on page components so Framer Motion treats route changes as unmount/remount |
| Google Fonts (Bricolage Grotesque) + Bulgarian | Assuming the font supports Cyrillic characters | Verify that Bricolage Grotesque includes Cyrillic glyphs. If not, Bulgarian text falls back to system font, breaking the design. Check Google Fonts character set coverage |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading both language bundles on initial load | Doubled JS payload, slower first paint | Use dynamic `import()` for non-default language translations. Only load active locale's strings | Noticeable when translation files grow beyond 20KB per language |
| Framer Motion animations on 20+ sections across multiple pages | Scroll jank, high CPU on mobile, slow page transitions | Lazy-load page components with `React.lazy`. Use `viewport` option on `whileInView` to limit observer scope | When total animated elements exceed 15-20 on a single page |
| Pre-rendering all locale+page combinations | Build time doubles with each new page (2 languages x N pages) | Acceptable for small site (<20 pages). Only becomes a problem at 50+ pages, which this project won't reach | Not a concern for this project's scale |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using URL locale parameter without validation | Path traversal or injection via crafted URLs like `/../../etc/passwd/services` | Validate locale parameter against whitelist `['en', 'bg']` in router config. Reject unknown locales with redirect to default |
| Exposing translation keys in error messages | Internal key names leak structure information | Ensure fallback text is a user-friendly string, not the raw key. Configure i18next `fallbackLng` and `parseMissingKeyHandler` |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Language switcher resets to homepage | User loses their place, must re-navigate to current page in new language | Language switcher should navigate to the same page in the other locale (e.g., `/en/services/seo` to `/bg/services/seo`) |
| No language detection on first visit | Bulgarian users see English by default, may not notice the language switcher | Detect `navigator.language` on first visit. If `bg`, suggest or auto-switch. Store preference for return visits |
| Translating the brand name "E&P Systems" | Inconsistent branding, confusion | Keep brand name untranslated in all languages. Only translate descriptive taglines and content |
| Missing Cyrillic-friendly typography tuning | Cyrillic characters may have different visual weight, line-height, and kerning than Latin at the same font size | Test Cyrillic rendering at all heading sizes. May need per-locale CSS adjustments for `letter-spacing` or `line-height` |
| Flash of wrong language on page load | User briefly sees English before Bulgarian loads, feels unpolished | Load translations synchronously (bundle them) rather than async-fetching from separate files. For a small bilingual site the payload cost is negligible |

## "Looks Done But Isn't" Checklist

- [ ] **i18n:** All strings extracted -- verify by searching codebase for English prose in `.tsx`/`.ts` files (especially `services.ts` data, `CaseStudies.tsx` highlight text, `CTA.tsx` copy)
- [ ] **i18n:** `<html lang>` attribute updates dynamically when locale changes -- inspect DOM after switching
- [ ] **i18n:** Document `<title>` and `<meta description>` change per page AND per language -- check with View Source, not just the rendered page
- [ ] **i18n:** Pluralization rules work for Bulgarian (Bulgarian has different plural forms than English) -- test with counts
- [ ] **Routing:** Every old hash link (`#services`, `#seo`, `#ecommerce`, `#case-studies`, `#contact`) still works after router is added -- click each one
- [ ] **Routing:** Direct URL access works (e.g., pasting `/bg/services/seo` in a new tab) -- SPA fallback configured in hosting
- [ ] **Routing:** 404 page exists for unknown routes in both languages
- [ ] **Routing:** Browser back/forward buttons work correctly across page transitions
- [ ] **SEO:** `hreflang` tags present on every page linking EN and BG versions
- [ ] **SEO:** Sitemap includes all pages in both languages
- [ ] **Font:** Bricolage Grotesque renders Cyrillic correctly at all weights used (400, 700, 900)
- [ ] **Layout:** Every component visually tested in Bulgarian -- especially Service cards, Hero, Navbar pill, Marquee
- [ ] **Mobile:** Language switcher is accessible and usable on mobile nav menu

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Hash navigation broken by router | LOW | Add `react-router-hash-link` or custom scroll handler. 1-2 hour fix if caught early |
| Incomplete string extraction | MEDIUM | Run a grep audit for English strings, extract remaining ones to translation files. Cost scales with number of missed strings |
| Layout breaks from Bulgarian text | MEDIUM | Requires per-component visual QA and CSS fixes. Budget 1-2 days of polish |
| No locale in URLs (state-only) | HIGH | Requires restructuring all routes, updating all internal links, setting up redirects from old URLs. Essentially a routing rewrite. Do it right the first time |
| SPA pages not indexed by Google | MEDIUM | Add pre-rendering plugin. Requires build config changes and testing, but doesn't touch application code |
| Scroll position bugs | LOW | Add ScrollToTop component, test all navigation paths. Quick fix |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Hash navigation conflict | Routing setup | Click every navbar/footer link on homepage, verify scroll behavior |
| Incomplete string extraction | i18n setup | Grep for English prose in source files. Zero results = complete |
| Bulgarian text expansion | Component polish (post-translation) | Visual QA of every page in Bulgarian on desktop and mobile |
| Scroll restoration | Routing setup | Navigate home -> detail -> back, verify positions |
| Locale not in URL | Routing + i18n design (must be co-designed) | URLs change when language switches, both versions independently accessible |
| SPA SEO blindspot | Routing/pages phase | View source of any page shows real HTML content |
| Font Cyrillic support | i18n setup (early verification) | Render Bulgarian text in Bricolage Grotesque, confirm no fallback glyphs |
| Flash of untranslated content | i18n setup | Hard-refresh page set to Bulgarian, observe no English flash |
| Language switcher UX | i18n + routing integration | Switch language on a deep page, verify same page loads in other locale |

## Sources

- [20 i18n Mistakes Developers Make in React Apps](https://www.translatedright.com/blog/20-i18n-mistakes-developers-make-in-react-apps-and-how-to-fix-them/) -- MEDIUM confidence, comprehensive list of common i18n mistakes
- [Why SPAs Still Struggle with SEO (2025)](https://dev.to/arkhan/why-spas-still-struggle-with-seo-and-what-developers-can-actually-do-in-2025-237b) -- MEDIUM confidence, covers SPA SEO challenges
- [Scroll Restoration in React Router](https://dev.to/tene/scroll-restoration-in-react-router-4gnm) -- MEDIUM confidence, practical scroll restoration patterns
- [Multilingual SEO URL Structure](https://www.searchenginejournal.com/multilingual-seo-url-structure/298747/) -- HIGH confidence, authoritative SEO source on locale URL patterns
- [From Hardcoded Strings to Global-Ready (Locize)](https://www.locize.com/blog/i18next-cli-instrument/) -- MEDIUM confidence, i18next migration tooling
- [URLs in Website Localization (SimpleLocalize)](https://simplelocalize.io/blog/posts/urls-in-website-localization/) -- MEDIUM confidence, URL structure patterns for i18n
- Codebase analysis: `Navbar.tsx`, `App.tsx`, `services.ts`, `index.html`, `CONCERNS.md` -- HIGH confidence, direct source inspection

---
*Pitfalls research for: E&P Systems bilingual agency site rebuild*
*Researched: 2026-03-24*
