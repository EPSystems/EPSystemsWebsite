# Phase 7: CTA Conversion - Research

**Researched:** 2026-03-25
**Domain:** React component wiring, mailto removal, modal context integration
**Confidence:** HIGH

## Summary

Phase 7 is a pure wiring phase. All infrastructure is already built: ContactModalProvider wraps the entire app in App.tsx, the `useContactModal` hook exposes `openContactForm(ctx: FormContext)`, and per-context headings/descriptions exist for all 5 context keys (general, seo, ecommerce, ai, software). The work is replacing every `<a href="mailto:...">` and every `scrollToSection('contact')` call with `openContactForm()` calls carrying the correct FormContext.

There are exactly 5 mailto links across 4 files (Hero, CTA, ServiceCTA, Footer x2) and 3 scrollToSection('contact') calls across 2 files (Navbar desktop+mobile "Get Started", CaseStudies "View Project"). The Footer also has a mailto email display link (line 92) that needs conversion.

**Primary recommendation:** Replace all mailto/scrollToSection('contact') with openContactForm(), passing appropriate context keys. Verify zero mailto and zero email addresses remain in source.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CTA-01 | All mailto links removed from the entire site | 5 mailto instances found in 4 files -- all documented below with exact locations |
| CTA-02 | Homepage CTA section button opens contact form | CTA.tsx line 19 -- replace `<a href="mailto:...">` with button calling `openContactForm({ subject: 'general', source: 'homepage-cta' })` |
| CTA-03 | All 4 service page CTA buttons open service-specific contact forms | ServiceCTA.tsx line 22 -- replace mailto with `openContactForm({ subject: slug, source: \`service-\${slug}-cta\` })`. Context keys (seo, ecommerce, ai, software) all exist in i18n |
| CTA-04 | Hero "Contact us" button opens contact form | Hero.tsx line 50-56 -- replace `<a href="mailto:...">` with button calling `openContactForm({ subject: 'general', source: 'hero-contact' })` |
| CTA-05 | Navbar "Get Started" button opens contact form | Navbar.tsx lines 53-56 (desktop) and line 76 (mobile) -- replace `handleScroll('contact')` with `openContactForm({ subject: 'general', source: 'navbar-get-started' })` |
| CTA-06 | Footer contact CTA opens contact form | Footer.tsx lines 48-52 (main CTA button) and line 92 (email link in contact column) -- both need conversion |
</phase_requirements>

## Standard Stack

### Core (already in place)
| Library | Purpose | Status |
|---------|---------|--------|
| ContactModalProvider | React context wrapping App -- provides openContactForm/closeContactForm | COMPLETE in App.tsx |
| useContactModal hook | Consumes context, returns { openContactForm, closeContactForm } | COMPLETE in hooks/ |
| ContactModal | Portal-rendered modal with form, success/error states | COMPLETE in components/contact/ |
| i18n context keys | Per-context headings for general, seo, ecommerce, ai, software | COMPLETE in locales/ |

No new libraries or packages are needed. This phase is entirely component modification.

## Architecture Patterns

### Pattern: Import hook, call openContactForm

Every CTA conversion follows the same pattern:

1. Import `useContactModal` hook
2. Destructure `openContactForm`
3. Replace `<a href="mailto:...">` with `<button>` (or keep `<a>` but switch to `onClick`)
4. Replace `scrollToSection('contact')` with `openContactForm(ctx)`
5. Pass correct `FormContext` object: `{ subject: string, source: string }`

```typescript
// Before
import { scrollToSection } from '../../utils/scroll'

<a href="mailto:engineering@epsystems.org" className="...">
  {t('cta.button')}
</a>

// After
import { useContactModal } from '../../hooks/useContactModal'

const { openContactForm } = useContactModal()

<button
  onClick={() => openContactForm({ subject: 'general', source: 'homepage-cta' })}
  className="..."
>
  {t('cta.button')}
</button>
```

### Context Key Mapping

| CTA Location | subject | source | Context heading (EN) |
|--------------|---------|--------|---------------------|
| Homepage CTA section | `'general'` | `'homepage-cta'` | "Get in Touch" |
| Hero "Contact us" | `'general'` | `'hero-contact'` | "Get in Touch" |
| Navbar "Get Started" | `'general'` | `'navbar-get-started'` | "Get in Touch" |
| Footer main CTA | `'general'` | `'footer-cta'` | "Get in Touch" |
| Footer email link | `'general'` | `'footer-email'` | "Get in Touch" |
| Service CTA (seo) | `'seo'` | `'service-seo-cta'` | "Ready to Rank Higher?" |
| Service CTA (ecommerce) | `'ecommerce'` | `'service-ecommerce-cta'` | "Ready to Sell Online?" |
| Service CTA (ai) | `'ai'` | `'service-ai-cta'` | "Ready to Work Smarter?" |
| Service CTA (software) | `'software'` | `'service-software-cta'` | "Have a Project in Mind?" |
| CaseStudies "View Project" | `'general'` | `'case-studies'` | "Get in Touch" |

### Exact File Changes Required

**File 1: `src/components/sections/Hero.tsx`**
- Line 4: Remove `scrollToSection` import (still used for 'services' scroll -- keep if needed)
- Line 50-56: Change `<a href="mailto:...">` to `<button onClick={() => openContactForm(...)}>`
- Add: `import { useContactModal } from '../../hooks/useContactModal'`
- Note: `scrollToSection('services')` on line 58 stays -- only the mailto changes

**File 2: `src/components/sections/CTA.tsx`**
- Line 19: Change `<a href="mailto:...">` to `<button onClick={() => openContactForm(...)}>`
- Add: `import { useContactModal } from '../../hooks/useContactModal'`

**File 3: `src/components/sections/ServiceCTA.tsx`**
- Line 22: Change `<a href="mailto:...">` to `<button onClick={() => openContactForm({ subject: slug, source: \`service-${slug}-cta\` })}>`
- Add: `import { useContactModal } from '../../hooks/useContactModal'`

**File 4: `src/components/layout/Navbar.tsx`**
- Line 54: Desktop "Get Started" -- replace `handleScroll('contact')` with `openContactForm({ subject: 'general', source: 'navbar-get-started' })`
- Line 76: Mobile "Get Started" -- same replacement (also close mobile menu)
- Add: `import { useContactModal } from '../../hooks/useContactModal'`
- Note: `scrollToSection` import stays for 'services' and 'case-studies' navigation

**File 5: `src/components/layout/Footer.tsx`**
- Line 48-52: Main CTA button -- replace `<a href="mailto:...">` with `<button onClick={() => openContactForm(...)}>`
- Line 92: Email link in contact column -- replace with `<button onClick={() => openContactForm(...)}>`
- Add: `import { useContactModal } from '../../hooks/useContactModal'`
- Note: `scrollToSection` import stays for 'services' and 'case-studies' navigation

**File 6: `src/components/sections/CaseStudies.tsx`**
- Line 56: Replace `scrollToSection('contact')` with `openContactForm({ subject: 'general', source: 'case-studies' })`
- Replace `scrollToSection` import with `useContactModal` import

### Anti-Patterns to Avoid
- **Leaving `<a>` tags without href:** When converting mailto links to buttons, use `<button>` elements, not `<a>` without href. This preserves accessibility semantics.
- **Forgetting mobile menu close:** In Navbar, the mobile "Get Started" must still call `setMobileOpen(false)` before/after opening the form.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form context passing | Custom prop drilling | useContactModal hook | Already built, context-based |
| Per-service headings | Switch statements | i18n context keys | All 5 context keys already exist |

## Common Pitfalls

### Pitfall 1: Forgetting the mobile Navbar CTA
**What goes wrong:** Desktop "Get Started" is converted but mobile menu "Get Started" still scrolls to contact section
**Why it happens:** Navbar has TWO "Get Started" buttons -- desktop (line 54) and mobile (line 76)
**How to avoid:** Convert both. Mobile also needs `setMobileOpen(false)` call.

### Pitfall 2: Footer email display link
**What goes wrong:** The Footer has a mailto link that displays the email address text via `t('footer.email')`. Converting this to a button removes the visible email, but leaving it keeps a mailto link.
**How to avoid:** Convert to button with openContactForm. The translation key `footer.email` probably shows "engineering@epsystems.org" -- this text should stay visible (it's just contact info display) but the click action should open the form instead of mailto. Requirement CTA-01 says ALL mailto removed. Requirement says no email addresses in client-side source -- check if `footer.email` translation contains the email address.

### Pitfall 3: Removing scrollToSection import prematurely
**What goes wrong:** Build error because other buttons in same file still use scrollToSection
**Why it happens:** Hero uses it for 'services', Navbar for 'services' and 'case-studies', Footer for 'services' and 'case-studies'
**How to avoid:** Only remove the import when NO other call sites remain in the file. CaseStudies.tsx is the only file where the import can be fully removed.

### Pitfall 4: ServiceCTA slug mismatch with context keys
**What goes wrong:** ServiceCTA passes a slug that doesn't match an i18n context key
**Why it happens:** The 4 valid slugs are: seo, ecommerce, ai, software. All 4 have matching contactForm.contexts entries. No mismatch risk, but verify.
**How to avoid:** The slug comes from URL params and is validated in ServicePage.tsx (VALID_SLUGS array). All 4 match i18n keys.

### Pitfall 5: Email address in translation files
**What goes wrong:** CTA-01 says "zero mailto links" and success criteria #5 says "no email addresses in client-side source code"
**Why it happens:** The footer.email translation key may contain the literal email string
**How to avoid:** Check both en/bg common.json for the email address text. If present, decide: keep for display (users need to see contact info) or replace with "Email Us" text. The requirement likely means no mailto: protocol links and no exposed email in code -- translation display text showing an email for users to see may be acceptable, but verify intent.

## Code Examples

### Converting a mailto anchor to a form-opening button
```typescript
// CTA.tsx - complete conversion
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../../hooks/useContactModal'
import { AnimatedSection } from '../ui/AnimatedSection'

export function CTA() {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 pb-24">
      <AnimatedSection>
        <div className="bg-zinc-100 p-10 lg:p-16 rounded-[40px] border-4 border-black brutalist-shadow flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#B9FF66] border-4 border-black rounded-full opacity-50 z-0" />
          <div className="max-w-2xl relative z-10">
            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6">{t('cta.heading')}</h3>
            <p className="text-xl text-zinc-700 font-medium">{t('cta.description')}</p>
          </div>
          <button
            onClick={() => openContactForm({ subject: 'general', source: 'homepage-cta' })}
            className="bg-black text-white text-xl font-bold px-10 py-5 rounded-2xl brutalist-shadow border-4 border-black whitespace-nowrap hover:bg-zinc-800 transition-colors relative z-10 w-full md:w-auto text-center"
          >
            {t('cta.button')}
          </button>
        </div>
      </AnimatedSection>
    </section>
  )
}
```

### Converting ServiceCTA with dynamic slug context
```typescript
// ServiceCTA.tsx - uses slug as subject
const { openContactForm } = useContactModal()

<button
  onClick={() => openContactForm({ subject: slug, source: `service-${slug}-cta` })}
  className="inline-block bg-[#B9FF66] border-4 border-black rounded-xl px-10 py-5 text-xl font-black brutalist-shadow hover:shadow-none transition-shadow"
>
  {t(`servicePages.${slug}.cta.button`)}
</button>
```

### Converting Navbar with mobile menu handling
```typescript
// Navbar - desktop
<button
  onClick={() => openContactForm({ subject: 'general', source: 'navbar-get-started' })}
  className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold text-lg brutalist-shadow"
>
  {t('nav.getStarted')}
</button>

// Navbar - mobile (must close menu too)
<button
  onClick={() => {
    setMobileOpen(false)
    openContactForm({ subject: 'general', source: 'navbar-get-started' })
  }}
  className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-center"
>
  {t('nav.getStarted')}
</button>
```

## Verification Checklist

After all changes, run these verifications:

```bash
# CTA-01: Zero mailto links
grep -r "mailto" src/
# Expected: no output

# CTA-01 + Success Criteria #5: No email addresses in source code
grep -r "engineering@epsystems" src/
# Expected: no output (check i18n files too)

# Structural: All openContactForm calls have correct context
grep -r "openContactForm" src/
# Expected: calls in Hero, CTA, ServiceCTA, Navbar, Footer, CaseStudies

# Build verification
npm run build
# Expected: clean build, no errors
```

## Open Questions

1. **Footer email display text**
   - What we know: Footer line 92 shows `t('footer.email')` as link text inside a mailto anchor
   - What's unclear: Whether the translation value contains the literal email address "engineering@epsystems.org" and whether success criteria #5 ("no email addresses in client-side source code") means the display text must also be scrubbed
   - Recommendation: Check the translation value. If it contains the email, replace with "Email Us" / equivalent. The requirement is clear: "No email addresses appear in client-side source code." Translation JSON is client-side source code.

2. **CaseStudies "View Project" context**
   - What we know: Currently scrolls to contact section. The button text is "View Project" which is more of a project inquiry than general contact.
   - What's unclear: Whether this should use 'general' context or a more specific one
   - Recommendation: Use 'general' context -- there's no project-specific context key and this isn't tied to a specific service.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all 6 affected files
- ContactModalProvider.tsx -- verified FormContext interface: `{ subject: string, source: string }`
- useContactModal.ts -- verified hook API: `{ openContactForm, closeContactForm }`
- i18n/locales/en/common.json -- verified all 5 context keys exist (general, seo, ecommerce, ai, software)
- ServicePage.tsx -- verified VALID_SLUGS: ['seo', 'ecommerce', 'ai', 'software']

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all infrastructure already built and verified in codebase
- Architecture: HIGH - pattern is simple hook import + function call, repeated 6 times
- Pitfalls: HIGH - all edge cases identified through direct code reading

**Research date:** 2026-03-25
**Valid until:** Indefinite -- this is project-specific wiring, not library-dependent
