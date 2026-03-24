# Phase 2: i18n Infrastructure - Research

**Researched:** 2026-03-24
**Domain:** Internationalization (react-i18next) + Cyrillic font support
**Confidence:** HIGH

## Summary

This phase wires up react-i18next with bundled JSON translation files for English and Bulgarian, adds a language switcher to the navbar, translates navbar and footer content, verifies Cyrillic font support, and updates the navbar for multi-page routing.

The core i18n setup is straightforward: i18next + react-i18next with bundled resources (no HTTP backend needed for two languages). The main architectural challenge is synchronizing the URL language prefix (`:lang` param already in place from Phase 1) with the i18next language state. A custom hook or effect that reads the URL param and calls `i18n.changeLanguage()` solves this cleanly.

**Critical finding:** Bricolage Grotesque does NOT support Cyrillic. The font only ships with latin, latin-ext, and vietnamese subsets. A Cyrillic-capable fallback font is required for Bulgarian text. Recommended fallback: Inter (Google Fonts, full Cyrillic support, grotesque sans-serif, similar weight range).

**Primary recommendation:** Use i18next + react-i18next with bundled JSON resources, sync language state from URL `:lang` param via useEffect, and load Inter as Cyrillic fallback font alongside Bricolage Grotesque.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Language switcher design: Text toggle format "EN / BG" (not flags, not dropdown)
- Simple, minimal -- fits the Brutalist aesthetic
- Current language should be visually distinguished from the inactive one
- Claude drafts Bulgarian translations for nav/footer content
- User reviews and corrects as needed during verification

### Claude's Discretion
- Switcher placement in navbar (before or after CTA, wherever fits best)
- Mobile menu behavior for the switcher (inside menu vs always visible)
- Active language indicator styling (bold, underline, lime accent -- whatever fits Brutalist design)
- Cyrillic font fallback strategy if Bricolage Grotesque doesn't support it
- Translation file structure and namespace organization
- Exact scope boundary between Phase 2 (nav/footer only) and Phase 3 (all content)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BILN-01 | react-i18next integrated with JSON translation files for EN and BG | i18next + react-i18next with bundled resources pattern; init config with two language resources |
| BILN-02 | Language switcher in Navbar toggles between English and Bulgarian | EN/BG text toggle component using i18n.changeLanguage() + react-router navigate for URL update |
| BILN-03 | Language preference persists across page navigation via URL prefix | URL :lang param is single source of truth; useEffect syncs i18next language from URL on every route change |
| BILN-07 | Cyrillic font support verified for Bricolage Grotesque (fallback if needed) | Bricolage Grotesque lacks Cyrillic; Inter font as fallback with CSS font-stack strategy |
| CONT-03 | Navbar updated to support multi-page routing and language switcher | Navbar links use react-router Link with lang-prefixed paths; switcher component integrated |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| i18next | ^25.x | Core i18n engine | De facto standard for JS i18n; framework-agnostic, mature ecosystem |
| react-i18next | ^15.x | React bindings for i18next | Official React integration; hooks API, Suspense support, React 19 compatible |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Inter (Google Font) | Variable | Cyrillic fallback font | Bulgarian text rendering where Bricolage Grotesque lacks glyphs |

### What We Do NOT Need
| Library | Why Not |
|---------|---------|
| i18next-http-backend | Only 2 languages; bundled JSON resources are simpler and faster (no async loading) |
| i18next-browser-languagedetector | URL prefix is the single source of truth; no browser detection needed |
| react-router-i18n | Dead package; custom sync hook is trivial and more flexible |

**Installation:**
```bash
npm install i18next react-i18next
```

## Architecture Patterns

### Recommended File Structure
```
src/
├── i18n/
│   ├── index.ts              # i18next init config
│   ├── locales/
│   │   ├── en/
│   │   │   └── common.json   # English translations (nav, footer, shared)
│   │   └── bg/
│   │       └── common.json   # Bulgarian translations (nav, footer, shared)
├── hooks/
│   └── useLanguageSync.ts    # Syncs URL :lang param with i18next
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Updated with switcher + translated links
│   │   ├── Footer.tsx         # Updated with translated content
│   │   └── LanguageSwitcher.tsx  # EN / BG toggle component
```

### Pattern 1: Bundled Resources Init
**What:** Initialize i18next with JSON resources imported at build time
**When to use:** Small number of languages (2-5) where async loading adds complexity without benefit
**Example:**
```typescript
// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import bg from './locales/bg/common.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    bg: { common: bg },
  },
  lng: 'en',                    // default language
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,          // React already escapes
  },
})

export default i18n
```

### Pattern 2: URL-to-i18next Sync Hook
**What:** Keep i18next language in sync with the URL :lang parameter
**When to use:** When URL prefix is the source of truth for language
**Example:**
```typescript
// src/hooks/useLanguageSync.ts
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SUPPORTED_LANGS = ['en', 'bg'] as const
type Lang = typeof SUPPORTED_LANGS[number]

export function useLanguageSync() {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()

  useEffect(() => {
    const resolved = SUPPORTED_LANGS.includes(lang as Lang) ? lang! : 'en'
    if (i18n.language !== resolved) {
      i18n.changeLanguage(resolved)
    }
  }, [lang, i18n])

  return lang || 'en'
}
```

### Pattern 3: Language Switcher with Navigation
**What:** Toggle language by navigating to the equivalent URL with the other language prefix
**When to use:** Language switch must update both URL and i18next state
**Example:**
```typescript
// src/components/layout/LanguageSwitcher.tsx
import { useParams, useNavigate, useLocation } from 'react-router-dom'

export function LanguageSwitcher() {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const switchTo = lang === 'bg' ? 'en' : 'bg'

  const handleSwitch = () => {
    const newPath = location.pathname.replace(`/${lang}`, `/${switchTo}`)
    navigate(newPath)
  }

  return (
    <button onClick={handleSwitch} className="flex items-center gap-1 font-bold text-lg">
      <span className={lang === 'en' ? 'text-black' : 'text-zinc-400'}>EN</span>
      <span className="text-zinc-400">/</span>
      <span className={lang === 'bg' ? 'text-black' : 'text-zinc-400'}>BG</span>
    </button>
  )
}
```

### Pattern 4: Using Translations in Components
**What:** Access translated strings via the useTranslation hook
**Example:**
```typescript
import { useTranslation } from 'react-i18next'

export function Navbar() {
  const { t } = useTranslation()

  return (
    <nav>
      <button>{t('nav.services')}</button>
      <button>{t('nav.projects')}</button>
      <button>{t('nav.getStarted')}</button>
    </nav>
  )
}
```

### Anti-Patterns to Avoid
- **Storing language in React state alongside URL:** URL prefix is the single source of truth. Never duplicate it in useState or context. The sync hook reads URL and pushes to i18next -- that is the only flow.
- **Using i18n.changeLanguage() without navigation:** This changes the translations but leaves the URL stale. Always navigate to the new URL; the sync hook handles the rest.
- **Hardcoding text strings alongside t() calls:** All user-visible text in navbar/footer must go through t(). Mixing hardcoded and translated strings leads to partially-translated UI.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Translation lookup | Custom key-value store | i18next t() function | Handles fallbacks, interpolation, pluralization, missing keys |
| Language detection from URL | Manual regex parsing | react-router useParams + sync hook | Already have :lang param from Phase 1 routing |
| Font fallback for Cyrillic | JavaScript-based glyph detection | CSS font-family stack | Browser natively falls back to next font in stack when glyphs missing |

## Common Pitfalls

### Pitfall 1: i18n Init Race Condition
**What goes wrong:** Components render before i18next finishes initializing, showing raw translation keys
**Why it happens:** i18n.init() is async; if i18n/index.ts is imported too late, React renders first
**How to avoid:** Import `src/i18n/index.ts` in `main.tsx` BEFORE the App import. With bundled resources (no HTTP backend), init is synchronous, but the import order still matters.
**Warning signs:** Flash of translation keys like "nav.services" on first load

### Pitfall 2: Language Switcher Breaks Scroll Anchors
**What goes wrong:** Switching language on a section-scrolled page loses scroll position
**Why it happens:** navigate() to new URL triggers ScrollToTop component (from Phase 1)
**How to avoid:** When switching language, preserve the current hash/scroll position. The LanguageSwitcher should replace the path without triggering scroll-to-top, or ScrollToTop should be aware of language-only changes.
**Warning signs:** User clicks EN/BG and page jumps to top

### Pitfall 3: Missing Translations Show Keys
**What goes wrong:** If a translation key is missing in BG, users see "nav.services" instead of text
**Why it happens:** Default i18next behavior shows the key when translation is missing
**How to avoid:** Set `fallbackLng: 'en'` so missing BG translations fall back to English. Also use `saveMissing: true` in development to log missing keys.
**Warning signs:** Raw key strings appearing in Bulgarian mode

### Pitfall 4: Cyrillic Font Rendering Inconsistency
**What goes wrong:** Some Bulgarian text renders in Bricolage Grotesque (Latin chars like numbers, punctuation) while Cyrillic chars use fallback font, creating visual inconsistency
**Why it happens:** CSS font-family fallback is per-glyph, not per-element
**How to avoid:** Accept per-glyph fallback (this is standard browser behavior) and choose a fallback font (Inter) that visually pairs well with Bricolage Grotesque at similar weights.
**Warning signs:** Mixed font appearance in Bulgarian mode -- this is expected and acceptable if fonts pair well

### Pitfall 5: URL Param Doesn't Validate Language
**What goes wrong:** User visits /xx/ and gets broken state
**Why it happens:** Route `/:lang` matches any string, not just 'en' or 'bg'
**How to avoid:** The sync hook should validate lang against supported languages and default to 'en'. Consider redirecting invalid lang params to /en/.
**Warning signs:** Visiting /fr/ or /xyz/ shows blank or broken content

## Code Examples

### Translation File Structure
```json
// src/i18n/locales/en/common.json
{
  "nav": {
    "services": "Services",
    "seo": "SEO",
    "ecommerce": "E-Commerce",
    "projects": "Projects",
    "getStarted": "Get Started"
  },
  "footer": {
    "cta": "Let's build something great together. We're ready to bring your digital vision to life.",
    "getInTouch": "Get in touch",
    "sitemap": "Sitemap",
    "home": "Home",
    "services": "Services",
    "projects": "Projects",
    "servicesColumn": "Services",
    "seo": "SEO",
    "ecommerce": "E-Commerce",
    "aiAutomation": "AI & Automation",
    "contact": "Contact",
    "email": "Email",
    "phone": "Phone",
    "copyright": "E&P Systems. All rights reserved."
  }
}
```

```json
// src/i18n/locales/bg/common.json
{
  "nav": {
    "services": "Услуги",
    "seo": "SEO",
    "ecommerce": "Е-Комерс",
    "projects": "Проекти",
    "getStarted": "Започнете"
  },
  "footer": {
    "cta": "Нека изградим нещо страхотно заедно. Готови сме да превърнем вашата дигитална визия в реалност.",
    "getInTouch": "Свържете се",
    "sitemap": "Карта на сайта",
    "home": "Начало",
    "services": "Услуги",
    "projects": "Проекти",
    "servicesColumn": "Услуги",
    "seo": "SEO",
    "ecommerce": "Е-Комерс",
    "aiAutomation": "AI и Автоматизация",
    "contact": "Контакт",
    "email": "Имейл",
    "phone": "Телефон",
    "copyright": "E&P Systems. Всички права запазени."
  }
}
```

### Cyrillic Font Fallback CSS
```css
/* In index.css or where fonts are configured */
body {
  font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
}
```

```html
<!-- In index.html, add Inter font loading -->
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@200..900&display=swap" rel="stylesheet" />
```

### i18n Import in Entry Point
```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './i18n'   // MUST be before App import
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| i18next-http-backend for all setups | Bundled resources for small apps | Always valid, but community now recommends simplicity for < 5 languages | Fewer packages, no loading states, instant language switch |
| react-i18next withTranslation HOC | useTranslation hook | react-i18next v10+ (2019) | Cleaner functional component API |
| Separate language context/state | URL prefix as single source of truth | react-router v6+ patterns | No state duplication; URL is bookmarkable and shareable |

## Open Questions

1. **Inter font pairing quality with Bricolage Grotesque**
   - What we know: Inter is a clean grotesque with full Cyrillic; weight range 200-900 overlaps Bricolage's 200-800
   - What's unclear: Visual harmony at all weights in actual use -- may need optical adjustments
   - Recommendation: Implement and verify visually; user can swap fallback font if Inter doesn't pair well. Alternative candidates: Manrope (cyrillic, semi-grotesque), Space Grotesk (cyrillic, geometric-grotesque)

2. **Bulgarian-specific Cyrillic letterforms**
   - What we know: Bulgarian Cyrillic has distinct letterforms from Russian Cyrillic (different shapes for some letters)
   - What's unclear: Whether Inter's Cyrillic includes proper Bulgarian alternates
   - Recommendation: Test with actual Bulgarian text during verification; standard Google Fonts Cyrillic typically covers Bulgarian correctly

3. **html lang attribute update**
   - What we know: Currently `<html lang="en">` is hardcoded in index.html
   - What's unclear: Whether to update it dynamically in Phase 2 or defer to Phase 3 (BILN-06 meta tags)
   - Recommendation: Update `document.documentElement.lang` in the sync hook -- trivial to add and improves accessibility now

## Sources

### Primary (HIGH confidence)
- [react-i18next Quick Start](https://react.i18next.com/guides/quick-start) - initialization pattern, useTranslation hook, changeLanguage API
- [react-i18next useTranslation docs](https://react.i18next.com/latest/usetranslation-hook) - hook API reference
- [Fontsource Bricolage Grotesque](https://fontsource.org/fonts/bricolage-grotesque) - confirmed subsets: latin, latin-ext, vietnamese only (NO Cyrillic)

### Secondary (MEDIUM confidence)
- [Google Fonts Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) - font specimen page
- [Bricolage Grotesque GitHub](https://github.com/ateliertriay/bricolage) - source repo, no Cyrillic mentioned
- [i18next npm](https://www.npmjs.com/package/i18next) - v25.x current
- [type.today Cyrillic Neo-Grotesques](https://type.today/en/journal/neo) - Cyrillic font analysis

### Tertiary (LOW confidence)
- Bulgarian translation accuracy -- Claude-drafted translations need native speaker review

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - i18next/react-i18next is the undisputed standard; setup pattern well-documented
- Architecture: HIGH - URL-prefix-as-source-of-truth pattern is established; sync hook is trivial
- Cyrillic fallback: MEDIUM - Inter is a strong candidate but visual pairing needs verification
- Pitfalls: HIGH - common issues well-documented in i18next ecosystem

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable domain, slow-moving libraries)
