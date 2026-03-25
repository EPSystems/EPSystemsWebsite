# Project Research Summary

**Project:** E&P Systems — v1.1 CTA Forms
**Domain:** Contact form integration into bilingual React SPA (agency site)
**Researched:** 2026-03-25
**Confidence:** HIGH

## Executive Summary

This milestone replaces every `mailto:` link and scroll-to-contact call across the E&P Systems website with a functional contact form system. The site is a fully bilingual (EN/BG) React 19 SPA with React Router, react-i18next, Framer Motion, and Tailwind CSS already installed and operational. All research confirms the correct approach is a single shared `ContactForm` component surfaced via two wrappers: an inline form embedded into existing CTA card sections (homepage CTA, all four service CTAs), and a modal form for locations where no layout space exists (Hero button, Footer button, Navbar "Get Started" on service pages). The form backend is Web3Forms — 250 free submissions per month, zero npm dependencies, JSON POST API — chosen over alternatives because it offers 5x more free submissions than Formspree and far better React documentation than any other zero-cost option.

The recommended architecture centers on a single `ContactModalProvider` React Context placed at the app root. All 9 CTA touchpoints being converted call `openContactForm({ subject, source })` via a convenience hook. This eliminates the anti-pattern of duplicating form logic across the codebase. A custom `useContactForm` hook handles all field state, validation, submission lifecycle, and status tracking. No new npm packages are required: native `fetch`, React `useState`, and the existing Framer Motion cover everything. Total new code is approximately 300 lines across 4 new files, plus 30 lines of modifications to 6 existing files.

The principal risk is spam exhausting the free-tier quota. Honeypot alone is insufficient — sophisticated bots bypass hidden fields — so hCaptcha (available on the Web3Forms free tier) must be enabled at the same time the form goes live, not as a follow-up task. The second architectural risk is the existing scroll-to-contact navigation pattern silently breaking once `scrollToSection('contact')` has no DOM target to reach. This failure is invisible in the console and creates a "nothing happens" user experience. It must be the first design decision addressed before any form code is written.

## Key Findings

### Recommended Stack

The entire v1.1 milestone adds zero new npm packages. Web3Forms operates as an external API endpoint reached via native `fetch`. Form field state and validation use React `useState`. Animations use Framer Motion `AnimatePresence`, already installed at v12.38.0. The modal renders via `createPortal` to `document.body` to avoid z-index conflicts with the Brutalist design system's heavy box-shadows and border layers. See `.planning/research/STACK.md` for the full service comparison matrix.

**Core technologies:**
- Web3Forms API: form submission backend — 250 free submissions per month, zero npm dependency, JSON POST, built-in spam protection, CORS-enabled from any origin
- Native `fetch` API: HTTP POST to Web3Forms — single async function, zero additional cost, no wrapper library needed
- React `useState` + `useContext`: form state and modal state — standard React 19, nothing new to install
- React `createPortal`: modal rendering — prevents z-index conflicts with existing `brutalist-shadow` and Navbar `z-50` layers
- Framer Motion `AnimatePresence` (already installed at v12.38.0): modal open/close animation — consistent with existing site animation language
- react-i18next (already installed at v16.6.6): all form text in EN and BG — mandatory; the site is fully bilingual

**Access key handling:** `VITE_WEB3FORMS_KEY` environment variable. This is a public API key — safe to embed in the client bundle at build time. Store in `.env`; confirm `.env` is in `.gitignore`.

### Expected Features

**Must have (table stakes — v1.1 launch):**
- Name, Email, Phone (optional), Notes fields — minimum viable contact form
- Client-side validation with inline per-field errors — users expect immediate feedback
- `noValidate` on the form element with all validation via `t()` calls — browser-native validation cannot be translated to Bulgarian
- Loading/submitting state with disabled button — prevents double-submit
- Success confirmation with "what happens next" copy — users must know their message was received
- Error state with retry option and obfuscated fallback email address — network failures are not edge cases
- Honeypot spam prevention — hidden input bots fill, humans skip
- hCaptcha as second spam layer — honeypot alone is insufficient for quota protection
- Full bilingual support EN/BG for all labels, placeholders, validation messages, and states
- Context-aware hidden subject field auto-populated per CTA location — agency lead routing
- Mobile-responsive layout — single column, minimum 44px tap targets
- Brutalist-styled inputs matching existing design system (thick borders, lime `#B9FF66` focus accent)

**Should have (competitive — add if time allows):**
- Context-specific form headings per CTA ("Interested in SEO?" vs "Get in Touch")
- Framer Motion form entrance animation — consistent with existing site animations
- Focus trap and focus restoration in modal — keyboard accessibility and professional presentation

**Defer (v2+):**
- Form analytics tracking (which CTA generates most leads)
- Multi-step project brief form
- File attachment support
- Calendar/meeting booking integration
- Auto-reply confirmation emails

**Anti-features confirmed by research:** CAPTCHA/reCAPTCHA (hurts conversion, accessibility nightmare — use honeypot plus hCaptcha instead), multi-step wizard form (overkill for 4 fields), file uploads on free tier, dedicated `/contact` page route (fragments the section-based architecture), budget range field (scares prospects before first conversation).

### Architecture Approach

One `ContactModalProvider` wraps the entire app at `App.tsx`. It owns `{ isOpen, context }` state and exposes `openContactForm(ctx)` and `closeContactForm()` via React Context. All 7 CTA component files are modified to call `openContactForm()` instead of `mailto:` or `scrollToSection`. A single `ContactModal` renders via `createPortal` to `document.body` and contains the shared form. The inline form pattern — used in `CTA.tsx` and `ServiceCTA.tsx` — embeds the same form component directly in the CTA card layout rather than in a modal wrapper. See `.planning/research/ARCHITECTURE.md` for complete component map, data flow diagrams, code patterns, and exact CTA file locations with line numbers.

**Major components:**
1. `ContactModalProvider` (new) — holds modal open/close state and form context; renders `ContactModal` internally; approximately 30 lines
2. `ContactModal` (new) — portal-rendered overlay with Framer Motion animations, scroll lock, Escape key handler, backdrop click to close; approximately 150 lines
3. `useContactForm` (new) — all form field state, validation, Web3Forms POST, status lifecycle (idle/submitting/success/error); approximately 60 lines
4. `useContactModal` (new) — thin convenience hook wrapping `useContext` with error guard; approximately 5 lines
5. 7 modified CTA components — replace `<a href="mailto:">` and `scrollToSection()` calls with `openContactForm({ subject, source })`
6. i18n JSON files (EN + BG) — new `contactForm.*` key namespace covering all form text, labels, validation messages, and states

**Build order (dependency-safe):**
Steps 1-3 are independent and can be built in parallel: `ContactModalProvider` plus `useContactModal` plus types; `useContactForm` hook; i18n keys in both JSON files. Step 4 is the main UI work: `ContactModal` component (requires steps 1, 2, 3). Steps 5-7 are integration: wrap `App.tsx` with provider, convert all 7 CTA touchpoints, wire Web3Forms API key.

### Critical Pitfalls

1. **Spam floods exhaust free-tier quota** — Enable honeypot AND hCaptcha simultaneously when the form goes live. Deploying the endpoint without hCaptcha active, even temporarily, creates a window where the 250/month quota can be burned by bots within hours. hCaptcha is available on the Web3Forms free tier. Load hCaptcha lazily (on first modal open) — not globally in `index.html` — to avoid adding 50-100KB to every page load.

2. **Scroll-to-contact silently breaks** — Audit every `scrollToSection('contact')` call and every `id="contact"` DOM element before writing any form code. The Navbar cross-page pattern (`navigate(homePath)` plus `setTimeout(scrollToSection, 100)`) silently fails when the scroll target disappears. No console errors appear. Decision: replace all `scrollToSection('contact')` calls with `openContactForm()` via modal context.

3. **Modal unusable on mobile with soft keyboard** — Center-positioned fixed modals (`top: 50%; transform: translateY(-50%)`) push content behind the soft keyboard on iOS Safari. Use `overflow-y: auto` inside the modal container so users can scroll within it. Test on a real iOS device — Chrome DevTools mobile emulation does not simulate soft keyboard viewport behavior.

4. **Validation messages not translated** — Add `noValidate` to the `<form>` element. All validation messages must use `t('contactForm.validation.*')` keys stored in both `en/common.json` and `bg/common.json`. Browser-native validation messages render in the browser's locale, not the app's selected language. A Bulgarian user with an English-locale browser sees English errors on the Bulgarian version of the site.

5. **Email address left in source code after migration** — After wiring the form backend, `grep -r "mailto:" src/` and `grep -r "epsystems.org" src/` must return zero results. The recipient email lives in the Web3Forms dashboard, not client code. In error state fallback copy, construct the address dynamically (e.g., `['engineering', 'epsystems.org'].join('@')`) to prevent scraper harvesting.

## Implications for Roadmap

Based on the dependency graph from ARCHITECTURE.md and the pitfall phase warnings from PITFALLS.md, a three-phase implementation is recommended. All three research files converge on the same sequencing: infrastructure before UI, spam protection concurrent with form launch, CTA conversion last.

### Phase 1: Foundation (Infrastructure and Architecture)

**Rationale:** The context-passing architecture must be established first. Every subsequent phase depends on it. Building CTA integrations or the form UI before the provider and hooks exist forces rework. This phase has no user-visible UI — it is pure infrastructure. i18n keys must be written in this phase so validation logic can reference them without hardcoded strings.

**Delivers:** `ContactModalProvider`, `useContactModal`, `useContactForm`, `App.tsx` updated with the provider wrapper, all `contactForm.*` i18n keys populated in both EN and BG JSON files.

**Addresses:** Context-aware hidden subject field system (architecture), bilingual form content foundation (i18n), prevents context-lost-across-CTAs pitfall by designing the passing mechanism before individual CTAs are wired.

**Avoids:** Pitfall 7 (context field not passed — must be designed in, not retrofitted), Pitfall 5 (validation messages not translated — keys established before any validation logic is written).

**Research flag:** Standard patterns. React Context with `useState` for modal state is the canonical React pattern; well-documented in official React docs. No research-phase needed.

### Phase 2: Form UI and Spam Protection

**Rationale:** With hooks and context interfaces established, the modal and inline form UI can be built against real, stable APIs. Spam protection ships in this same phase — it is not polish. Deploying the form endpoint without hCaptcha active risks exhausting the monthly quota before Phase 3 is even complete.

**Delivers:** `ContactModal` component (portal rendering, scroll lock, Escape key, Framer Motion animations, Brutalist design system styling); `ContactForm` with all 4 fields, all validation states, success/error/loading UI; honeypot field; hCaptcha integration (lazy-loaded on first modal open).

**Uses:** Framer Motion `AnimatePresence` (existing), lucide-react X icon (existing), Tailwind Brutalist design tokens (existing), Web3Forms API (external service).

**Implements:** Portal pattern with `createPortal`, focus trap, mobile keyboard-safe layout, inline validation with `noValidate`.

**Avoids:** Pitfall 1 (spam floods — honeypot plus hCaptcha in same phase as form launch), Pitfall 3 (mobile keyboard overlap — modal scroll layout), Pitfall 4 (focus trap failures), Pitfall 6 (no loading/success/error states), Pitfall 10 (Framer Motion AnimatePresence conflicts with form state — manage state outside animated wrapper).

**Research flag:** Mobile keyboard layout on iOS Safari warrants real-device testing before the phase is marked done. Chrome DevTools emulation is explicitly insufficient for this validation.

### Phase 3: CTA Integration and Cleanup

**Rationale:** Convert all 7 CTA touchpoints last, after the form component is tested and stable in isolation. This is also when the scroll-to-contact navigation rework happens and the `mailto:` cleanup is performed. Doing cleanup before the form is stable complicates debugging — broken navigation states become entangled with form bugs.

**Delivers:** All 7 modified CTA component files (Hero, CTA, ServiceCTA x4, Navbar desktop, Navbar mobile, Footer, CaseStudies); all `scrollToSection('contact')` calls replaced with `openContactForm()`; all `mailto:` links and email addresses removed from source; Web3Forms access key wired via `.env`; end-to-end submission tested from every CTA location.

**Avoids:** Pitfall 2 (scroll-to-contact breaks — all scroll calls replaced), Pitfall 8 (email address in source — grep verification as exit criterion), Pitfall 7 (context not passed — verified by submitting from each CTA and confirming distinct subjects in Web3Forms inbox).

**Research flag:** Standard patterns. CTA conversion is mechanical once the architecture is in place. No research-phase needed.

### Phase Ordering Rationale

- Infrastructure before UI: `useContactForm` and `ContactModalProvider` are consumed by `ContactModal`. Building the modal before the hook would require immediate refactoring.
- Spam protection concurrent with form launch: the form endpoint and spam protection must ship together. There is no safe "deploy now, add protection later" window when the free tier is capped at 250/month.
- i18n keys in Phase 1: all translation keys must exist before writing the form UI, so validation logic can reference `t()` calls instead of hardcoded strings that need to be refactored later.
- CTA conversion last: converting CTAs while the form is still being built creates a broken running app. Phase 3 is a clean cut-over once the form is stable and tested.
- Pitfall 2 (scroll-to-contact) and the architectural commitment to modal-based triggering must be the very first design decision — before any code — because retrofitting it later requires revisiting every component touched in Phases 2 and 3.

### Research Flags

Phases needing deeper research during planning:
- **Phase 2 (hCaptcha lazy loading strategy):** The mechanism for lazy-loading the hCaptcha script on first modal open — whether via `@hcaptcha/react-hcaptcha`, manual script tag injection, or another approach — should be decided during planning, not improvised during implementation. This decision affects whether a new npm dependency is introduced.
- **Phase 2 (mobile keyboard layout validation):** Real-device iOS Safari testing is required before Phase 2 is closed. The pitfalls research confirms the problem and mitigation direction but cannot substitute for device verification.

Phases with standard patterns (skip research-phase):
- **Phase 1:** React Context plus `useState` for modal state is canonical React. Thoroughly documented.
- **Phase 3:** Replacing `<a href="mailto:">` with `<button onClick>` and updating scroll handlers to context calls is mechanical work. No novel patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Web3Forms API endpoint and request shape verified from official docs. All existing dependencies confirmed from installed package versions. Zero new npm packages removes compatibility risk entirely. |
| Features | HIGH | CTA inventory derived from direct codebase inspection of actual source files. Feature decisions grounded in multiple UX research sources and validated against the zero-cost, zero-infrastructure project constraints. |
| Architecture | HIGH | Pattern is canonical React (Context plus Portal plus custom hooks). All 7 CTA locations identified with exact file paths and line numbers from codebase inspection. Build order derived from the actual dependency graph. |
| Pitfalls | HIGH | Critical pitfalls sourced from official Web3Forms documentation and MDN. Mobile keyboard pitfall is a widely documented iOS Safari behavior. Codebase-specific pitfalls (scroll-to-contact, email in source) confirmed by direct source file inspection. |

**Overall confidence:** HIGH

### Gaps to Address

- **Web3Forms domain restriction is Pro-only:** The free tier cannot lock the access key to the production domain, meaning the key is embeddable from any origin. Mitigation is hCaptcha, which validates submissions server-side. Confirm this is acceptable during implementation planning, or decide if upgrading to Pro tier (~$10/month) is warranted.
- **hCaptcha test key for local development:** hCaptcha production site keys reject requests from unregistered domains including `localhost`. The test key (`10000000-ffff-ffff-ffff-000000000001`) must be used locally and the production key set via environment variable in the deployment environment. Document this separation in the Phase 2 implementation task.
- **Web3Forms pricing page inaccessible during research:** The pricing page returned a 403 during research. The 250/month free limit was corroborated from multiple secondary sources and the official FAQ. Re-verify the limit when setting up the account — terms may have changed.

## Sources

### Primary (HIGH confidence)
- Web3Forms React Integration Docs (`https://docs.web3forms.com/how-to-guides/js-frameworks/react-js/react-js`) — endpoint, request body shape, response format verified by fetch
- Web3Forms Spam Protection Docs (`https://docs.web3forms.com/getting-started/customizations/spam-protection`) — honeypot field configuration and hCaptcha integration
- Web3Forms FAQ (`https://docs.web3forms.com/getting-started/faq`) — free tier limits and policy details
- MDN Client-side Form Validation (`https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation`) — `noValidate` plus custom validation pattern
- Formspree Pricing and Account Limits pages — verified 50/month free limit; confirms Web3Forms selection
- Codebase direct inspection — all 7 CTA locations with exact file paths and line numbers; scroll-to-contact pattern identified

### Secondary (MEDIUM confidence)
- UX Planet — Modal vs Page decision framework
- LogRocket — Modal UX design patterns and accessibility
- Friendly Captcha — Honeypot vs CAPTCHA conversion rate tradeoffs
- Venture Harbour — Contact form design examples and best practices
- Eleken — Modal UX best practices
- Creative Bloq — Form UX patterns and when to avoid them
- DEV Community — Netlify Forms alternatives 2026 (landscape overview for backend comparison)
- Phrase Blog — Localized form validation patterns
- Reform Blog — Common ARIA mistakes in forms

### Tertiary (LOW confidence)
- Static Forms FAQ — Free submission limit not stated in official FAQ; sourced from comparison articles (~500/month)
- Getform/Forminit pricing — Rebranded January 2026; pricing details unverifiable during research window; excluded from recommendation

---
*Research completed: 2026-03-25*
*Ready for roadmap: yes*
