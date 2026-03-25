# Feature Research

**Domain:** Agency website contact forms (replacing mailto CTAs)
**Researched:** 2026-03-25
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Basic form fields (Name, Email, Message/Notes) | Every contact form has these; visitors won't use a form missing them | LOW | Name, Email, and a free-text message field are the absolute minimum |
| Phone field (optional) | PROJECT.md specifies Name, Email, Phone, Notes as fields; phone gives agency a direct contact channel | LOW | Mark as optional; some leads prefer phone callbacks |
| Form validation with inline errors | Users expect immediate feedback on invalid input (empty required fields, malformed email) | LOW | Use HTML5 validation attributes + light JS validation; show errors per-field, not as a summary |
| Success confirmation after submit | Users need to know their message was received; without it they'll submit multiple times | LOW | Show an in-place success message with "what happens next" copy (e.g., "We'll respond within 24h") |
| Loading/submitting state | Users expect visual feedback that form is processing; prevents double-submit | LOW | Disable button + show spinner or "Sending..." text during API call |
| Bilingual form (EN/BG) | Site is already fully bilingual; a form in only one language breaks the experience | LOW | All labels, placeholders, validation messages, success/error messages via react-i18next |
| Mobile-responsive layout | 60%+ traffic is mobile; form must be usable on small screens | LOW | Single-column layout, large tap targets (min 44px), full-width inputs on mobile |
| Context-aware subject/service tag | Each CTA exists in a specific context (homepage, SEO page, AI page); the agency needs to know what the lead is about | LOW | Hidden field populated automatically based on which CTA triggered the form |
| Email delivery to agency inbox | The whole point -- form submissions must reach engineering@epsystems.org reliably | LOW | Use Web3Forms or equivalent free backend; zero server infrastructure needed |
| Spam prevention (honeypot) | Without spam protection, inbox gets flooded with bot submissions within weeks | LOW | Honeypot field (hidden input bots fill, humans don't); zero UX friction, no CAPTCHA puzzle |
| Error state on submission failure | Network errors happen; users need to know their message was NOT sent so they can retry | LOW | Show error message with retry option; don't clear form fields on failure |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not expected, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Context-specific CTA copy per location | Each form trigger (Hero, Homepage CTA, Service pages, Navbar, Footer) shows copy relevant to where the user clicked -- feels personalized, not generic | LOW | Pass a `context` prop that sets form heading, description, and hidden subject field |
| Animated form entrance (Framer Motion) | Consistent with the site's existing animation language; form appearance feels polished, not jarring | LOW | Use existing AnimatedSection component or simple Framer Motion fade/slide |
| Service-specific form headings | "Tell us about your SEO goals" on the SEO page vs "Let's build something" on homepage -- matches user intent and increases conversion | LOW | i18n keys per context: `form.seo.heading`, `form.general.heading`, etc. |
| Keyboard accessibility (focus trap in modal, tab order) | Demonstrates agency professionalism; required for any future accessibility work | MEDIUM | If using modal: trap focus inside, return focus on close, ESC to dismiss |
| Brutalist-styled form inputs | Form matches the site's bold design language instead of looking like a generic Bootstrap form | LOW | Thick borders, rounded corners, bold labels, lime accent on focus -- consistent with existing design tokens |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| CAPTCHA / reCAPTCHA | "We need spam protection" | Hurts conversion rates significantly; frustrates users; accessibility nightmare for visually impaired; adds Google dependency | Honeypot field -- invisible to users, catches most bots, zero friction |
| Multi-step / wizard form | "Feels modern and engaging" | Massively over-engineered for a 4-field contact form; adds complexity without value; users abandon multi-step flows more than simple forms | Single-view form. Four fields don't need steps |
| File upload on contact form | "Clients might want to attach a brief" | Complicates the free backend (most free tiers don't support files or have tiny limits); increases spam surface | Include in success message: "We'll follow up by email where you can share documents" |
| Real-time chat widget | "More immediate than a form" | Requires someone online to respond; creates expectation of instant reply; third-party dependency; clashes with Brutalist aesthetic | Contact form with clear response-time expectation |
| Dedicated /contact page | "Industry standard for agencies" | This site uses section-based architecture; a separate page fragments the flow and adds a navigation hop; CTA sections already exist in the right contexts | Inline form or modal triggered from existing CTAs -- keeps users in flow |
| Auto-reply email to submitter | "Professional touch" | Requires email sending capability beyond simple form backends; free tiers often don't support it; can end up in spam folders | Success state with clear "what happens next" copy serves the same trust purpose |
| Service dropdown selector on every form | "Let users pick which service" | Adds decision friction to forms that already have context (user clicked from SEO page -- they want SEO); redundant in context-aware forms | Auto-populate from CTA context. Only show dropdown on homepage/general forms if context is ambiguous |
| Budget range field | "Helps qualify leads" | Scares away prospects who don't know their budget yet or don't want to commit to a number before talking; reduces form completions | Let the agency ask about budget in the follow-up conversation |

## CTA Inventory (All Locations Needing Forms)

Every current mailto link and scroll-to-contact CTA, mapped to recommended pattern.

| Location | Current Behavior | Component | Context Label | Recommended Pattern |
|----------|-----------------|-----------|---------------|-------------------|
| Hero section | `mailto:` link | `Hero.tsx` | "General Inquiry" | Open modal (hero should not expand with inline form) |
| Homepage CTA section | `mailto:` link | `CTA.tsx` | "General Inquiry" | **Inline form** -- replace the button with a form embedded in the existing card |
| Navbar "Get Started" (desktop) | Scrolls to `#contact` | `Navbar.tsx` | "General Inquiry" | On homepage: scroll to inline form. On service pages: open modal |
| Navbar "Get Started" (mobile) | Scrolls to `#contact` | `Navbar.tsx` | "General Inquiry" | Same as desktop Navbar behavior |
| Service CTA -- SEO | `mailto:` link | `ServiceCTA.tsx` | "SEO Inquiry" | **Inline form** -- replace button with form in existing CTA section |
| Service CTA -- E-Commerce | `mailto:` link | `ServiceCTA.tsx` | "E-Commerce Inquiry" | Inline form (same ServiceCTA pattern) |
| Service CTA -- AI Automation | `mailto:` link | `ServiceCTA.tsx` | "AI Automation Inquiry" | Inline form (same ServiceCTA pattern) |
| Service CTA -- Custom Software | `mailto:` link | `ServiceCTA.tsx` | "Custom Software Inquiry" | Inline form (same ServiceCTA pattern) |
| Footer "Get in Touch" button | `mailto:` link | `Footer.tsx` | "General Inquiry" | Open modal (footer has no space for inline form) |
| Footer email link | `mailto:` link | `Footer.tsx` | N/A | **Keep as mailto** -- this is an explicit email link, not a CTA |
| Case Studies "View Project" | Scrolls to `#contact` | `CaseStudies.tsx` | "Project Discussion" | Scroll to homepage CTA inline form |

**Total: 10 CTA touchpoints, 1 kept as mailto, 9 converted to forms.**

## Form UX Pattern Recommendation: Hybrid (Inline Primary + Modal Secondary)

**Primary pattern: Inline form** in the CTA sections (Homepage CTA, all ServiceCTA components). The existing CTA card layout is perfect for housing a form -- replace the mailto button with form fields inside the same styled card. Users clicking a CTA in a dedicated CTA section expect to act right there, not get pulled into an overlay.

**Secondary pattern: Modal** for CTAs without layout space for inline forms (Hero button, Footer button, Navbar "Get Started" when on service pages). The modal should be minimal -- same form component, just wrapped in an overlay.

**Why this hybrid approach:**

1. **Inline avoids modal problems:** No accidental dismissal (ESC key, backdrop click losing filled data), no shareability issues, no accessibility complexity of focus trapping.
2. **Modal covers edge cases:** Hero, Footer, and Navbar triggers have no natural space for a form. A lightweight modal is the right tool here.
3. **One component, two wrappers:** Build one `ContactForm` component. Render inline in CTA sections, or inside a `ContactModal` for secondary locations. Same form, same backend, same validation.

**Why not modal-only:** Forces all interactions through an overlay pattern, even where inline works better. Modals break scrolling context and feel interruptive in a content-heavy section.

**Why not inline-only:** Hero, Footer, and Navbar physically cannot expand to hold a form without breaking layout.

## Feature Dependencies

```
[ContactForm Component]
    |-- requires --> [Web3Forms Backend Integration]
    |-- requires --> [i18n Keys for Form Content]
    |-- requires --> [Context Prop System]

[Context Prop System]
    |-- requires --> [CTA Inventory Mapping (which CTA = which context)]

[Inline Form in CTA Sections]
    |-- requires --> [ContactForm Component]
    |-- modifies --> [CTA.tsx layout]
    |-- modifies --> [ServiceCTA.tsx layout]

[ContactModal Wrapper]
    |-- requires --> [ContactForm Component]
    |-- requires --> [Modal Component with focus management]

[Honeypot Spam Prevention]
    |-- requires --> [ContactForm Component (hidden field in form)]

[Success / Error States]
    |-- requires --> [Web3Forms Backend Integration (response handling)]

[Bilingual Form Content]
    |-- requires --> [New i18n keys in EN and BG JSON files]
```

### Dependency Notes

- **ContactForm requires Web3Forms first:** The form HTML must POST to a working endpoint before anything else can be tested end-to-end.
- **Context system requires CTA inventory:** All 10 CTA touchpoints must be mapped to context labels before building context-aware headings.
- **Modal requires ContactForm:** Build the form component first, then wrap it in a modal. Don't build them simultaneously.
- **Inline modifications require ContactForm:** CTA.tsx and ServiceCTA.tsx layouts change only after the form component exists.

## MVP Definition

### Launch With (v1.1)

Minimum to replace all mailto links with working, context-aware forms.

- [ ] `ContactForm` component -- Name, Email, Phone (optional), Notes fields
- [ ] Web3Forms integration -- free tier, zero backend, email to inbox
- [ ] Honeypot spam prevention -- hidden field, zero UX friction
- [ ] Client-side validation -- required fields, email format, inline error display
- [ ] Success state -- thank you message with "what happens next" copy
- [ ] Error state -- submission failure message with retry
- [ ] Loading state -- disabled button + visual feedback during submit
- [ ] Inline form in Homepage CTA section (`CTA.tsx`)
- [ ] Inline form in ServiceCTA section (all 4 service pages via `ServiceCTA.tsx`)
- [ ] Modal form for Hero, Footer, and Navbar-on-service-page CTAs
- [ ] Context-aware hidden field -- auto-populated per CTA location
- [ ] Context-specific form headings and descriptions
- [ ] Full bilingual support (EN/BG) for all form text, labels, validation, states
- [ ] Brutalist-styled form inputs matching existing design system

### Add After Validation (v1.x)

Features to add once core forms are working and receiving real submissions.

- [ ] Form analytics tracking (which CTA context generates most leads) -- trigger: forms live and receiving submissions
- [ ] Service dropdown on homepage form -- trigger: if agency finds general inquiries too vague to route
- [ ] Advanced spam measures (rate limiting) -- trigger: if honeypot proves insufficient against real spam

### Future Consideration (v2+)

Features to defer until clear need.

- [ ] Multi-step project brief form -- trigger: agency wants detailed scoping through website
- [ ] File attachment support -- trigger: agency needs briefs/assets upfront
- [ ] Calendar/meeting booking integration -- trigger: agency wants automated scheduling
- [ ] Auto-reply confirmation emails -- trigger: if free backend supports it or agency upgrades

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| ContactForm component (fields, validation, states) | HIGH | LOW | P1 |
| Web3Forms backend integration | HIGH | LOW | P1 |
| Inline form in Homepage CTA section | HIGH | LOW | P1 |
| Inline form in ServiceCTA sections (x4) | HIGH | LOW | P1 |
| Context-aware hidden subject field | HIGH | LOW | P1 |
| Bilingual form content (all i18n keys) | HIGH | LOW | P1 |
| Honeypot spam prevention | HIGH | LOW | P1 |
| Success / error / loading states | HIGH | LOW | P1 |
| Modal wrapper for Hero/Footer/Navbar CTAs | MEDIUM | MEDIUM | P1 |
| Context-specific headings per CTA | MEDIUM | LOW | P1 |
| Brutalist-styled form inputs | MEDIUM | LOW | P1 |
| Framer Motion form entrance animations | LOW | LOW | P2 |
| Service dropdown (homepage form only) | LOW | LOW | P3 |
| Form submission analytics | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Should have, add during implementation if time allows
- P3: Nice to have, defer to future milestone

## Competitor Feature Analysis

| Feature | Typical Agency Sites | Premium Agency Sites | Our Approach |
|---------|---------------------|---------------------|--------------|
| Contact form location | Dedicated /contact page | Inline on every page + dedicated page | Hybrid: inline in CTA sections + modal for nav/hero/footer |
| Form fields | Name, Email, Message, sometimes Phone | Name, Email, Phone, Company, Budget, Project type | Name, Email, Phone (optional), Notes -- lean and fast, no friction |
| Context awareness | None -- same generic form everywhere | Service pre-selected based on referring page | Hidden context field auto-populated + context-specific headings per CTA |
| Spam prevention | reCAPTCHA (hurts UX) | Honeypot + server-side validation | Honeypot (zero friction). Budget range dropped to avoid scaring leads |
| Success feedback | Generic "Thank you" | Personalized with next steps and timeline | "Thank you" with specific next-step copy, fully bilingual |
| Form backend | Custom server or paid SaaS (Formspree Pro, HubSpot) | Custom API with CRM integration | Web3Forms free tier (zero cost, zero infrastructure, constraint-compliant) |
| Design consistency | Forms use default browser styling or generic UI kit | Forms match site design system perfectly | Brutalist-styled inputs: thick borders, rounded corners, lime focus accent |
| Bilingual forms | Rare; usually English-only or machine-translated | Native translations with proper i18n | Full react-i18next integration, all form text in EN and BG |

## Sources

- [Venture Harbour - 15 Best Contact Form Design Examples](https://ventureharbour.com/15-contact-form-examples-help-design-ultimate-contact-page/) - Form design patterns and best practices
- [Creative Bloq - 6 Form UX Patterns](https://www.creativebloq.com/features/6-form-ux-patterns-and-when-to-avoid-them) - When to use each form pattern
- [UX Planet - Modal vs Page Decision Framework](https://uxplanet.org/modal-vs-page-a-decision-making-framework-34453e911129) - Modal vs inline vs page decision criteria
- [LogRocket - Modal UX Design Patterns](https://blog.logrocket.com/ux-design/modal-ux-design-patterns-examples-best-practices/) - Why forms in modals have accessibility and shareability problems
- [Friendly Captcha - Honeypot vs CAPTCHA](https://friendlycaptcha.com/insights/honeypot-captcha/) - Honeypot vs reCAPTCHA comparison, UX tradeoffs
- [Web3Forms vs Formspree](https://web3forms.com/alternatives/formspree-alternative) - Free form backend comparison for static sites
- [Mailchimp - Contact Form Design Tips](https://mailchimp.com/resources/contact-form-design/) - General form best practices
- [Design Studio - Form UX Best Practices 2026](https://www.designstudiouiux.com/blog/form-ux-design-best-practices/) - Current form UX patterns
- [Prosper Marketing - Contact Form Best Practices 2025](https://www.prospermarketingsolutions.com/blogs-contact-form-best-practices-for-2025/) - Single-column layout, trust signals, button copy
- [Eleken - Modal UX Best Practices](https://www.eleken.co/blog-posts/modal-ux) - When modals help vs hurt

---
*Feature research for: E&P Systems v1.1 CTA Forms*
*Researched: 2026-03-25*
