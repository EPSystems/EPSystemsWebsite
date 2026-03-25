# Pitfalls Research

**Domain:** Contact forms on static React SPA (bilingual agency site)
**Researched:** 2026-03-25
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Spam Floods Exhaust Free-Tier Quota in Hours

**What goes wrong:**
Within minutes of deploying a contact form with only a honeypot, automated bots discover the form endpoint and flood it with spam submissions. Web3Forms free tier allows 250 submissions per month. A bot attack can exhaust this in hours, blocking real client inquiries for the rest of the month.

**Why it happens:**
Bots continuously crawl the web for form endpoints. A bare `<form action="https://api.web3forms.com/submit">` is trivially exploitable. Developers assume "nobody knows my URL yet" -- bots do not care about obscurity. The free tier also lacks domain restriction (a pro-only feature), so anyone can submit to the endpoint from any origin.

**How to avoid:**
- Enable the Web3Forms honeypot field from day one: add a hidden `botcheck` input that bots fill but humans skip
- Add hCaptcha as a second layer -- this is available on the free tier and is the strongest protection available without paying
- Implement client-side rate limiting: disable the submit button for several seconds after submission
- Never rely on honeypot alone -- sophisticated bots ignore hidden fields entirely

**Warning signs:**
- Receiving submissions with gibberish names, URLs in the message body, or identical timestamps
- Monthly submission count climbing faster than actual site traffic warrants
- Web3Forms dashboard showing submissions from unexpected referrers

**Phase to address:**
Backend integration phase. Spam protection must be configured at the same time the form endpoint is wired up, not as a follow-up.

---

### Pitfall 2: Scroll-to-Contact Breaks When CTA Section Becomes a Modal Trigger

**What goes wrong:**
The Navbar "Get Started" button currently calls `scrollToSection('contact')` to scroll to the CTA section (the `<section id="contact">` in CTA.tsx). The Hero CTA is a `mailto:` link. Service page CTAs are also `mailto:` links. When these are replaced with modal triggers, the scroll target disappears. Users on service pages who click "Get Started" navigate home via `navigate(homePath)` + `setTimeout(() => scrollToSection('contact'), 100)` -- and then nothing happens because there is no `#contact` element to scroll to.

**Why it happens:**
The existing navigation relies on DOM element IDs for scroll targets. Replacing the CTA section with a modal removes these targets without updating the navigation logic. The Navbar.tsx cross-page scroll pattern (navigate then scroll after 100ms timeout) silently fails when the target element does not exist.

**How to avoid:**
- Audit every `scrollToSection('contact')` call and every element with `id="contact"` BEFORE modifying any CTA component
- Decision point: either (a) keep a lightweight CTA section with `id="contact"` that contains a "Open contact form" button, or (b) change all Navbar/Hero behavior to directly open the modal from anywhere
- If choosing modals: replace `scrollToSection('contact')` calls with a modal-open function passed via React context or prop drilling
- The Navbar cross-page pattern in particular (`navigate(homePath)` then `setTimeout(scrollToSection, 100)`) must be completely reworked

**Warning signs:**
- Clicking "Get Started" from a service page navigates home but no form appears
- Console shows no errors (scrollToSection silently fails on missing elements)
- Users report "nothing happens" when clicking contact buttons

**Phase to address:**
CTA replacement planning -- this must be the FIRST design decision before writing any form code. The trigger mechanism dictates the entire component architecture.

---

### Pitfall 3: Modal Form Unusable on Mobile (Keyboard Overlap)

**What goes wrong:**
A modal contact form opens, the user taps an input field, the mobile soft keyboard slides up, and the form content is pushed behind the keyboard or off-screen. The user cannot see what they are typing, cannot scroll to the submit button, and abandons the form. This is especially damaging for an agency site where mobile visitors are often decision-makers checking the site on their phone.

**Why it happens:**
Mobile browsers handle viewport resizing inconsistently when the soft keyboard opens. A CSS modal positioned with `position: fixed; top: 50%; transform: translateY(-50%)` does not reposition when the viewport shrinks. iOS Safari is particularly problematic -- it does not reliably fire resize events when the keyboard appears, and `100vh` includes the keyboard area.

**How to avoid:**
- Use a bottom-anchored slide-up panel on mobile instead of a centered modal: `position: fixed; bottom: 0` keeps the form above the keyboard
- Ensure the form container uses `overflow-y: auto` so users can scroll within it
- Use `dvh` (dynamic viewport height) units instead of `vh` where supported
- Test on actual iOS Safari and Android Chrome -- Chrome DevTools mobile emulation does NOT simulate soft keyboard behavior
- Consider a dedicated contact page route instead of a modal for mobile, sidestepping the viewport problem entirely

**Warning signs:**
- Form works perfectly in desktop browser mobile emulation but fails on real devices
- Submit button not reachable without closing the keyboard
- Users report the form "jumps around" when they tap into fields

**Phase to address:**
Form UI/UX phase. The modal vs. inline vs. dedicated page decision must account for mobile keyboard behavior from the start.

---

### Pitfall 4: Focus Trap and Accessibility Failures in Form Modal

**What goes wrong:**
A modal form opens but keyboard users can Tab to elements behind the modal (Navbar, Footer). Screen readers announce the underlying page content instead of the form. When the modal closes, focus jumps to the top of the page instead of returning to the CTA button that opened it. Inputs use placeholder text only with no visible labels.

**Why it happens:**
Developers build modals with `div` + `z-index` without implementing focus trapping, `aria-modal="true"`, or focus restoration. Placeholder-only inputs persist as an anti-pattern because they "look cleaner" in Brutalist designs, but they violate WCAG 1.3.1 and 3.3.2. Note that the project has explicitly deferred a full WCAG audit, but basic form accessibility is table stakes for a professional agency site.

**How to avoid:**
- Use the HTML `<dialog>` element which provides built-in focus trapping, `Escape` key dismissal, and modal backdrop -- supported in all modern browsers since Safari 15.4
- Always use visible `<label>` elements linked to inputs via `htmlFor`/`id` -- placeholders are supplementary, not replacements
- Store a ref to the trigger button and call `.focus()` on it when the modal closes
- Add `aria-labelledby` pointing to the form heading
- Test with keyboard-only navigation: Tab, Shift+Tab, Escape, Enter

**Warning signs:**
- Tabbing through the form reaches the Navbar or Footer behind the modal
- Screen reader announces "E&P Systems" heading while the contact form is open
- No visible labels on form fields
- Closing modal leaves focus on an invisible element

**Phase to address:**
Form UI/UX phase. Accessibility must be built into the modal from first implementation.

---

## Moderate Pitfalls

### Pitfall 5: Validation Error Messages Not Translated

**What goes wrong:**
Form labels and placeholders are bilingual (EN/BG via react-i18next), but validation error messages appear only in English. Worse: if using HTML5 native validation (`required`, `type="email"`), error messages display in the browser's UI language, not the app's selected language. A Bulgarian user with an English-locale browser sees English validation errors on the Bulgarian version of the site.

**Why it happens:**
Developers add `required` and `type="email"` attributes for quick validation, forgetting that browser-native messages are outside the app's i18n control. Custom validation logic gets added as an afterthought with hardcoded English strings.

**How to avoid:**
- Add `noValidate` to the `<form>` element to disable browser-native validation entirely
- Implement all validation in the React submit handler using `t('form.errors.required')`, `t('form.errors.invalidEmail')`, etc.
- Store ALL validation messages in the i18n JSON files (`en/common.json`, `bg/common.json`)
- Test by switching to Bulgarian and triggering every possible validation error

**Warning signs:**
- Any validation message not wrapped in a `t()` call
- Using `required`, `type="email"`, or `pattern` attributes without `noValidate` on the form
- Error messages that do not change when switching language

**Phase to address:**
Form validation phase. Must use the i18n system from the start, not retrofitted.

---

### Pitfall 6: No Loading, Success, or Error Feedback

**What goes wrong:**
User clicks "Submit" and nothing visible happens for 1-3 seconds during the API call. They click again, sending a duplicate. Or submission succeeds but the form silently resets, leaving the user uncertain whether their message was sent. For an agency site, this uncertainty can cost a real client lead.

**Why it happens:**
Developers focus on the "happy path" -- form submits, data reaches the backend. The intermediate states (loading, success, error) and edge cases (network failure, duplicate submission) are treated as polish rather than core functionality.

**How to avoid:**
- Implement three distinct states: `idle`, `submitting`, `success`, `error`
- During `submitting`: disable the submit button, show "Sending..." or a spinner
- On `success`: show a clear confirmation message ("Your message has been sent. We will respond within 24 hours.") translated in both languages
- On `error`: show an actionable error ("Something went wrong. Please try again or email us at...") with a fallback mailto link
- Keep success state visible until the user actively dismisses it or navigates away -- do not auto-hide after 3 seconds
- Prevent double submission by checking `isSubmitting` before the fetch call

**Warning signs:**
- No `isSubmitting`, `isSuccess`, or `isError` state in the form component
- Submit button has no disabled styling
- No conditional rendering for post-submission states

**Phase to address:**
Form submission flow phase. These states are core functionality, not polish.

---

### Pitfall 7: Hidden Context Field Not Passed from Different CTAs

**What goes wrong:**
The project has 6+ CTA entry points: Hero button, homepage CTA section, Navbar "Get Started" (desktop + mobile), and four service page CTA buttons. Each should send a different context (e.g., "General Contact" vs. "SEO Inquiry" vs. "E-Commerce Inquiry"). But every submission arrives with the same subject because the context is not passed from the trigger to the form.

**Why it happens:**
The form is built as a standalone modal component. Each CTA button opens it, but nobody wires up the context prop. The ServiceCTA component already has a `slug` prop (`seo`, `ecommerce`, `ai`, `custom-software`) that maps naturally to form context -- but this connection is easy to overlook.

**How to avoid:**
- Define a `FormContext` type: `'general' | 'seo' | 'ecommerce' | 'ai' | 'custom-software'`
- Pass context as a prop when opening the form from each CTA
- Include it as a hidden `<input type="hidden" name="subject">` in the Web3Forms submission
- Map ServiceCTA's existing `slug` prop directly to form context
- Verify by submitting from every CTA and checking the Web3Forms inbox for correct subjects

**Warning signs:**
- All test submissions show identical subject lines
- Form component has no props or parameters
- ServiceCTA's `slug` is not referenced anywhere in the form logic

**Phase to address:**
Form component architecture phase. The context-passing mechanism must be designed before building individual CTA integrations.

---

### Pitfall 8: Email Address Left in Source Code After Form Migration

**What goes wrong:**
After implementing the form backend, `mailto:engineering@epsystems.org` links remain in the source code. The email is currently hardcoded in at least three files: `Hero.tsx` (line 51), `CTA.tsx` (line 19), and `ServiceCTA.tsx` (line 22). Scraper bots harvest exposed emails from page source, leading to inbox spam unrelated to form submissions.

**Why it happens:**
Developers replace the visible CTA buttons but forget to remove the email from all locations. Or they keep `mailto:` as a "fallback" without realizing it exposes the address to automated scrapers. The recipient email for Web3Forms is configured in the dashboard, not in client code.

**How to avoid:**
- After implementing forms, grep the entire codebase for `mailto:` and for the email address itself
- Remove every instance -- the Web3Forms dashboard handles recipient routing
- If a fallback email display is needed (e.g., in error states), construct it dynamically to prevent simple scraping: `{['engineering', 'epsystems.org'].join('@')}`
- The Footer may also contain contact info that should be audited

**Warning signs:**
- `grep -r "mailto:" src/` returns any results after form implementation is "complete"
- `grep -r "epsystems.org" src/` returns results outside of structured data / JSON-LD

**Phase to address:**
Backend integration phase. Email removal should be part of the same task that wires up Web3Forms.

---

## Minor Pitfalls

### Pitfall 9: Phone Field Validation Rejects Valid International Numbers

**What goes wrong:**
A strict regex like `/^\d{10}$/` rejects `+359 88 123 4567` (Bulgarian mobile), `089 123 4567` (Bulgarian local format), or `+1 (555) 123-4567` (US format). Potential international clients cannot submit the form.

**How to avoid:**
- Make the phone field optional -- email is the primary contact method, phone is supplementary
- If validated, use a permissive pattern: `/^\+?[\d\s\-().]{7,20}$/` (7-20 characters of digits, spaces, dashes, parens, optional leading +)
- Do not use a country-specific regex -- the agency serves an international market

**Warning signs:**
- Phone validation regex requires exactly N digits with no punctuation
- No support for `+` prefix or spaces

**Phase to address:**
Form validation phase.

---

### Pitfall 10: Framer Motion AnimatePresence Conflicts with Form State

**What goes wrong:**
The CTA sections are wrapped in `AnimatedSection` (Framer Motion `whileInView`). If the form modal also uses Framer Motion `AnimatePresence` for open/close animations, exit animations can unmount form fields while React state still holds their values. On reopening, the form shows stale data or briefly flashes empty then repopulates.

**How to avoid:**
- Use CSS transitions or the `<dialog>` element's native show/hide for modal animation instead of Framer Motion `AnimatePresence`
- If using Framer Motion, manage form state OUTSIDE the animated wrapper -- lift it to a parent or use a ref
- Do not unmount form inputs during exit animation; use `opacity: 0` + `pointer-events: none` instead

**Warning signs:**
- Form field values reset when closing and reopening the modal quickly
- Brief flash of empty form during open animation
- Console warnings about state updates on unmounted components

**Phase to address:**
Form UI/UX phase.

---

### Pitfall 11: hCaptcha Script Loaded Globally on Every Page

**What goes wrong:**
The hCaptcha script (~50-100KB) is loaded in `index.html` or at app root, adding to initial bundle size and load time on every page, even though the contact form may never be opened during a visit.

**How to avoid:**
- Dynamically load the hCaptcha script only when the form modal opens for the first time
- Use `@hcaptcha/react-hcaptcha` which handles script loading, or manually inject the script tag on first form mount
- Remove the script from `index.html` if added there

**Warning signs:**
- Network tab shows hCaptcha scripts loading on initial page visit
- Lighthouse flags third-party scripts affecting performance score

**Phase to address:**
Backend integration phase.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline form copy-pasted into each CTA section | Quick to prototype | 6+ form instances to maintain; bug fixes missed in some copies | Never -- extract a shared `ContactForm` component from the start |
| Browser-native HTML5 validation instead of custom | No JS validation code | Cannot translate error messages; inconsistent across browsers | Never for a bilingual site |
| Hardcoded Web3Forms access key in each form instance | Works immediately | Key rotation requires changing every file | Never -- store in a single constant or env variable |
| Skip hCaptcha, rely on honeypot only | Simpler setup, no third-party script | Sophisticated bots bypass honeypot; free-tier quota burned by spam | Only acceptable temporarily during development; must add hCaptcha before production |
| No form state management library | Fewer dependencies | Messy validation with many useState calls | Acceptable -- a 4-field contact form does not justify a form library |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Web3Forms fetch | Sending JSON without `Content-Type: application/json` header | Include the header explicitly, or use `FormData` which Web3Forms also accepts |
| Web3Forms access key | Forgetting the `access_key` field in submission payload | The access key must be present in every submission as a hidden input or JSON field |
| Web3Forms honeypot | Making the honeypot visible to users, or placing `display:none` on the input element itself | Wrap the honeypot input in a container `div` with `style="display:none"` -- some bots detect hidden inputs but not hidden containers |
| Web3Forms + React controlled inputs | Inputs have `value` and `onChange` but no `name` attribute | Every input needs a `name` attribute for Web3Forms to parse the submission correctly |
| hCaptcha | Testing with hCaptcha on `localhost` using production site key | Use hCaptcha test keys for development (`10000000-ffff-ffff-ffff-000000000001`); configure production key per domain |
| react-i18next in form | Validation messages use `t()` but keys missing from translation JSON | Add ALL form-related keys to both `en/common.json` and `bg/common.json` before implementing validation logic |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| hCaptcha loaded globally | Extra 50-100KB on every page load; slower initial paint | Lazy-load hCaptcha only when form opens | Affects all users from day one on slow connections |
| Re-rendering CTA sections on form state changes | AnimatedSection animations replay; visible jank | Isolate form state in the modal component; CTA sections remain static triggers | Noticeable on mid-range mobile devices |
| Validation running on every keystroke | Input lag on slow devices; excessive re-renders | Validate on blur or on submit, not on every `onChange` event | Noticeable on older phones with complex regex patterns |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Leaving `mailto:engineering@epsystems.org` in source after form migration | Email harvested by scrapers; increased inbox spam | Remove all `mailto:` references; recipient is configured in Web3Forms dashboard |
| No rate limiting of any kind | Attacker scripts rapid-fire submissions; 250/month quota burned | Disable button during/after submit; add cooldown; hCaptcha as primary defense |
| Displaying raw user input in success message | XSS vector if user input is rendered with `dangerouslySetInnerHTML` | Never render user-submitted values in the DOM; use static translated success messages |
| Exposing Web3Forms webhook URLs in client code | Attackers can trigger webhooks directly | Webhooks are configured in the Web3Forms dashboard, not in client code; verify none leak into source |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Placeholder-only labels that disappear on focus | Users forget which field they are filling; fails WCAG | Persistent visible labels above each input |
| No indication which fields are required vs. optional | Users submit incomplete forms, get errors, feel frustrated | Mark optional fields as "(optional)"; assume all others are required |
| Success message auto-hides after 3 seconds | User was not looking; unsure if form sent | Keep success state visible until user dismisses it or navigates away |
| Form resets on accidental modal close (clicking backdrop) | User loses all typed content | Either: require explicit close (X button only), or confirm before closing with content ("Discard your message?") |
| Form button styles do not match existing Brutalist CTAs | Visual inconsistency makes the form feel foreign to the site | Reuse existing button patterns: `brutalist-shadow`, `border-4 border-black`, lime `#B9FF66` accent, `rounded-2xl` |
| No fallback when Web3Forms is down | User has no way to contact the agency | Show fallback message with obfuscated email on submission error |

## "Looks Done But Isn't" Checklist

- [ ] **Honeypot field:** Present in form HTML but hidden from users -- verify visually AND check that screen readers skip it (`aria-hidden="true"`, `tabindex="-1"`)
- [ ] **hCaptcha:** Works on both localhost (test key) and production domain (production key) -- verify in both environments
- [ ] **Mobile keyboard:** Form is fully usable when soft keyboard is open on iOS Safari -- verify on a real device, not emulator
- [ ] **Bulgarian validation messages:** Every error string comes from `bg/common.json` -- switch to BG and trigger each validation error
- [ ] **Context field:** Each CTA sends the correct subject -- submit from all 6+ CTAs and check Web3Forms inbox
- [ ] **Scroll-to-contact migration:** Navbar "Get Started" works from both homepage and service pages -- test both paths
- [ ] **Focus management:** Opening modal traps focus; closing modal returns focus to trigger button -- test with Tab key only
- [ ] **Success state:** Visible after submission and persists until dismissed -- verify it does not auto-fade
- [ ] **Double-submit prevention:** Button disabled during submission -- click rapidly to verify
- [ ] **No mailto links remain:** `grep -r "mailto:" src/` returns zero results
- [ ] **No email in source:** `grep -r "epsystems.org" src/` returns zero results (except structured data if applicable)
- [ ] **Form accessible in both languages:** Full form flow (open, fill, validate, submit, success) tested in both EN and BG

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Spam floods exhaust free quota | LOW | Rotate Web3Forms access key in dashboard; add hCaptcha if not present; wait for monthly quota reset |
| Modal breaks on mobile keyboard | MEDIUM | Refactor to bottom-sheet or dedicated `/contact` page route; CSS and layout changes required |
| Missing accessibility (no labels, no focus trap) | MEDIUM | Add visible labels; switch to `<dialog>` element; add focus restoration; may restructure form markup |
| Validation messages not translated | LOW | Add missing keys to i18n JSON files; replace hardcoded strings with `t()` calls |
| All submissions show same context | LOW | Add context prop to form component; pass from each CTA; small refactor |
| Scroll-to-contact broken after CTA replacement | LOW | Update Navbar handlers to open modal directly; audit all `scrollToSection('contact')` calls |
| Email left in source code | LOW | Grep and remove all instances; 10-minute fix |
| hCaptcha loaded globally | LOW | Move script loading into form component mount lifecycle; remove from index.html |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Spam floods (honeypot + hCaptcha) | Backend integration | Submit test form; verify honeypot and hCaptcha active; check Web3Forms dashboard |
| Scroll-to-contact breaks | CTA replacement planning (FIRST) | Click every "Get Started" and CTA button from every page; verify form opens |
| Mobile keyboard overlap | Form UI/UX design | Test on real iOS Safari and Android Chrome with keyboard open |
| Focus trap / accessibility | Form UI/UX implementation | Tab through form with keyboard only; test with screen reader |
| Validation messages untranslated | Form validation | Switch to BG; trigger every validation error; all messages in Bulgarian |
| No loading/success/error states | Form submission flow | Submit form; verify button disables; success message appears; test with network offline |
| Context lost across CTAs | Form component architecture | Submit from each CTA; verify different subjects in Web3Forms inbox |
| Email exposed in source | Backend integration (cleanup) | `grep -r "mailto:" src/` and `grep -r "epsystems" src/` return zero matches |
| Phone validation too strict | Form validation | Enter +359, 0888, +1, and formatted numbers; all accepted |
| Framer Motion conflicts | Form UI/UX | Open/close modal rapidly; verify no state loss or animation glitches |
| hCaptcha global loading | Backend integration | Check network tab on homepage; hCaptcha scripts absent until form opens |

## Sources

- [Web3Forms Spam Protection Documentation](https://docs.web3forms.com/getting-started/customizations/spam-protection) -- HIGH confidence, official docs
- [Web3Forms Pricing](https://web3forms.com/pricing) -- HIGH confidence, verified 250 free submissions/month
- [Web3Forms FAQ](https://docs.web3forms.com/getting-started/faq) -- HIGH confidence, official docs
- [Solving Contact Form Security in Static Sites and SPAs](https://dev.to/fourtwentydev/solving-the-contact-form-security-dilemma-in-static-sites-and-spas-59n7) -- MEDIUM confidence
- [Common ARIA Mistakes in Forms and Fixes](https://www.reform.app/blog/common-aria-mistakes-in-forms-and-fixes) -- MEDIUM confidence
- [Building an Accessible Modal Dialog in React](https://clhenrick.io/blog/react-a11y-modal-dialog/) -- MEDIUM confidence
- [Mastering Modal UX: Best Practices](https://www.eleken.co/blog-posts/modal-ux) -- MEDIUM confidence
- [Localized Form Validation (Phrase)](https://phrase.com/blog/posts/localized-form-validation/) -- MEDIUM confidence
- [MDN Client-side Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) -- HIGH confidence
- [Adding Contact Forms to Static Sites Guide](https://www.staticforms.dev/blog/adding-contact-forms-to-static-sites) -- MEDIUM confidence
- Codebase inspection: `CTA.tsx`, `ServiceCTA.tsx`, `Hero.tsx`, `Navbar.tsx` -- HIGH confidence, direct source analysis

---
*Pitfalls research for: E&P Systems v1.1 CTA Forms milestone*
*Researched: 2026-03-25*
