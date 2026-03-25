# Architecture Research

**Domain:** Contact form modal integration into existing React SPA
**Researched:** 2026-03-25
**Confidence:** HIGH

## Current State Assessment

The existing codebase is a fully functional bilingual React 19 SPA with React Router, react-i18next, Framer Motion, and Tailwind CSS. There are 7 CTA touchpoints across the site that currently use either `mailto:` links or `scrollToSection('contact')` calls. The v1.1 milestone replaces all of these with a modal contact form that receives contextual metadata about which CTA triggered it.

No new routing is needed. No new major dependencies are needed. The architecture change is: add a React Context provider for modal state, a single modal component rendered via portal, and a custom hook for form logic.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx (Routes)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │         ContactModalProvider (React Context)         │    │
│  │  state: { isOpen, formContext }                      │    │
│  │  actions: openContactForm(ctx), closeContactForm()   │    │
│  └──────────────┬──────────────────────────┬───────────┘    │
│                 │                          │                 │
│    ┌────────────┴──────────┐    ┌─────────┴──────────┐      │
│    │   CTA Trigger Sites   │    │   ContactModal      │      │
│    │  Hero, Navbar, CTA,   │    │  (Portal to body)   │      │
│    │  ServiceCTA, Footer,  │    │  ┌───────────────┐  │      │
│    │  CaseStudies          │    │  │useContactForm │  │      │
│    │                       │    │  │ fields/errors │  │      │
│    │  useContactModal()    │    │  │ validate/POST │  │      │
│    │  -> openContactForm() │    │  └───────────────┘  │      │
│    └───────────────────────┘    └─────────────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                   Form Backend (Web3Forms)                   │
│              POST https://api.web3forms.com/submit           │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `ContactModalProvider` | Holds modal open/close state and form context (subject, source). Provides `openContactForm()` and `closeContactForm()` via React Context. Renders `ContactModal` internally. | React Context + `useState`. ~30 lines. |
| `ContactModal` | Modal overlay UI: form fields, validation feedback, submission states (idle/submitting/success/error). Reads context from provider. | Framer Motion `AnimatePresence` + `createPortal`. ~150 lines. |
| `useContactForm` | Form field state, field validation, POST submission to backend, status tracking, reset. | Custom hook with `useState` + `fetch`. ~60 lines. |
| `useContactModal` | Convenience consumer hook. Wraps `useContext` with error guard. | One-liner hook. ~5 lines. |
| CTA trigger sites (7 locations) | Call `openContactForm({ subject, source })` instead of `mailto:` or scroll-to-contact. | Replace `<a href="mailto:">` with `<button onClick={() => openContactForm(ctx)}>`. |

## Recommended Project Structure

New and modified files only (existing structure unchanged):

```
src/
├── components/
│   ├── contact/                       # NEW folder
│   │   ├── ContactModalProvider.tsx    # Context provider + renders ContactModal
│   │   └── ContactModal.tsx           # Modal UI: form, states, animations
│   ├── layout/
│   │   ├── Navbar.tsx                 # MODIFIED: openContactForm instead of scroll
│   │   └── Footer.tsx                 # MODIFIED: openContactForm instead of mailto
│   └── sections/
│       ├── Hero.tsx                   # MODIFIED: openContactForm instead of mailto
│       ├── CTA.tsx                    # MODIFIED: openContactForm instead of mailto
│       ├── ServiceCTA.tsx             # MODIFIED: openContactForm instead of mailto
│       └── CaseStudies.tsx            # MODIFIED: openContactForm instead of scroll
├── hooks/
│   ├── useContactForm.ts             # NEW: form state + validation + submission
│   └── useContactModal.ts            # NEW: context consumer convenience hook
├── App.tsx                            # MODIFIED: wrap routes in ContactModalProvider
└── i18n/
    └── locales/
        ├── en/common.json             # MODIFIED: add contactForm.* keys
        └── bg/common.json             # MODIFIED: add contactForm.* keys
```

### Structure Rationale

- **components/contact/:** Groups all contact-form-specific components in one folder. The provider and modal are tightly coupled, so they belong together. Follows the existing pattern of `components/layout/` and `components/sections/`.
- **hooks/useContactForm.ts:** Separates form logic from UI. Testable in isolation. Follows the existing pattern of `hooks/useServices.ts`, `hooks/useLanguageSync.ts`, and `hooks/usePageMeta.ts`.
- **hooks/useContactModal.ts:** Thin consumer wrapper. Lives with other hooks for discoverability.

## Architectural Patterns

### Pattern 1: Single Modal Instance via Context

**What:** One `ContactModal` rendered at the app root inside `ContactModalProvider`. All CTA buttons trigger the same modal via `openContactForm(context)`. The modal is not duplicated at each CTA site.

**When to use:** Always for this project. Multiple trigger points for the same modal is the textbook use case for React Context.

**Trade-offs:** Requires wrapping the app with a provider (trivial one-line change to App.tsx). Slightly more indirection than `useState` in a parent, but prop drilling through 4+ component layers is far worse.

**Example:**
```typescript
// src/components/contact/ContactModalProvider.tsx
interface FormContext {
  subject: string  // "general" | "seo" | "ecommerce" | "ai" | "software"
  source: string   // "hero" | "navbar" | "service-page-seo" | etc.
}

interface ContactModalContextType {
  isOpen: boolean
  context: FormContext | null
  openContactForm: (ctx: FormContext) => void
  closeContactForm: () => void
}

const ContactModalContext = createContext<ContactModalContextType | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<FormContext | null>(null)

  const openContactForm = useCallback((ctx: FormContext) => {
    setContext(ctx)
    setIsOpen(true)
  }, [])

  const closeContactForm = useCallback(() => {
    setIsOpen(false)
    setContext(null)
  }, [])

  return (
    <ContactModalContext.Provider value={{ isOpen, context, openContactForm, closeContactForm }}>
      {children}
      <ContactModal />
    </ContactModalContext.Provider>
  )
}
```

### Pattern 2: Portal + Scroll Lock + Escape Key

**What:** Render the modal via `createPortal` to `document.body`. Lock body scroll when open. Close on Escape keypress and backdrop click.

**When to use:** Every modal in this codebase. The Brutalist design uses heavy `border-4`, `brutalist-shadow`, and `overflow` contexts that would clip or z-fight with an inline-rendered modal.

**Trade-offs:** Portal renders outside the React tree visually but stays inside it logically (Context still works through portals). Minor complexity increase vs inline rendering, but necessary for correct stacking.

**Example:**
```typescript
// Inside ContactModal.tsx
useEffect(() => {
  if (!isOpen) return
  document.body.style.overflow = 'hidden'
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeContactForm()
  }
  document.addEventListener('keydown', handleEsc)
  return () => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEsc)
  }
}, [isOpen, closeContactForm])

return createPortal(
  <AnimatePresence>
    {isOpen && (
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeContactForm}
        />
        <motion.div
          className="relative bg-white border-4 border-black rounded-[30px] p-8 lg:p-10 w-full max-w-lg brutalist-shadow"
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
        >
          {/* form content */}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>,
  document.body
)
```

### Pattern 3: Context-Driven Form Heading

**What:** The modal heading adapts based on which CTA opened it. Service-specific CTAs show a service-relevant heading; general CTAs show "Get in Touch".

**When to use:** Every time the modal opens.

**Trade-offs:** Small i18n lookup, but makes the form feel contextual rather than generic. Better UX when a user clicks "Get a Free SEO Audit" and the form acknowledges that context.

**Example:**
```typescript
const heading = context?.subject === 'general'
  ? t('contactForm.heading.general')
  : t('contactForm.heading.service', {
      service: t(`contactForm.services.${context?.subject}`)
    })
```

### Pattern 4: Reset Form State on Close

**What:** When the modal closes, reset all form fields, errors, and status back to idle. When it reopens, it is always fresh.

**When to use:** Every close action (X button, backdrop click, Escape key, success close).

**Trade-offs:** Users lose partially-filled data if they accidentally close. Acceptable for a short 4-field form. The alternative (preserving state) creates confusing stale data when opening from a different CTA context.

## Data Flow

### Modal Trigger Flow

```
User clicks CTA (e.g., "Get a Free SEO Audit" on /en/services/seo)
    |
    v
openContactForm({ subject: "seo", source: "service-page-seo" })
    |
    v
ContactModalProvider sets state: { isOpen: true, context: { subject: "seo", ... } }
    |
    v
ContactModal reads isOpen=true, renders portal with animated form
    |
    v
Heading reads context.subject, displays "Interested in SEO?"
```

### Form Submission Flow

```
User fills fields (name, email, phone, notes) and clicks Submit
    |
    v
useContactForm.handleSubmit(context) called
    |-- Validates: name required, email required + format
    |-- If errors: set errors state, return early
    |
    v (valid)
Set status = 'submitting' (disable fields, show spinner on button)
    |
    v
fetch POST to form backend with:
  { access_key, name, email, phone, notes, subject, source }
    |
    +---> 200 OK --> status = 'success' (show success message + close button)
    |
    +---> Error  --> status = 'error' (show error banner, fields still filled, retry button)
```

### Form State Lifecycle

```
Modal opens --> status: 'idle', fields: empty, errors: empty
    |
    v (user types, blur triggers validation)
    |
    v (user clicks submit)
status: 'submitting' --> fetch POST
    |
    +---> status: 'success' (form replaced with success view)
    |         |
    |         v (user clicks Close or backdrop)
    |         --> modal closes, full reset
    |
    +---> status: 'error' (error banner shown, fields preserved)
              |
              v (user clicks Retry)
              --> status: 'submitting' again
```

## CTA Touchpoint Inventory

These are the exact code locations that must change:

| File | Line(s) | Current Code | Form Context | Change |
|------|---------|-------------|--------------|--------|
| `Hero.tsx` | 50-56 | `<a href="mailto:...">` | `{ subject: 'general', source: 'hero' }` | Replace `<a>` with `<button>`, add `useContactModal()` |
| `CTA.tsx` | 18-23 | `<a href="mailto:...">` | `{ subject: 'general', source: 'homepage-cta' }` | Replace `<a>` with `<button>`, add `useContactModal()` |
| `ServiceCTA.tsx` | 21-26 | `<a href="mailto:...">` | `{ subject: slug, source: 'service-' + slug }` | Replace `<a>` with `<button>`, use slug prop as subject |
| `Navbar.tsx` | 53-56 | `scrollToSection('contact')` | `{ subject: 'general', source: 'navbar' }` | Replace scroll handler with openContactForm |
| `Navbar.tsx` | 76 | Mobile scroll-to-contact | `{ subject: 'general', source: 'navbar-mobile' }` | Replace scroll + close mobile menu |
| `Footer.tsx` | 48-52 | `<a href="mailto:...">` (CTA button) | `{ subject: 'general', source: 'footer' }` | Replace `<a>` with `<button>` |
| `CaseStudies.tsx` | 56 | `scrollToSection('contact')` | `{ subject: 'general', source: 'case-studies' }` | Replace scroll handler with openContactForm |

**Keep as-is:** `Footer.tsx` line 92 -- the email link in the contact info column (`engineering@epsystems.org`). This is informational, displaying the actual address. It stays as `mailto:`.

## Anti-Patterns

### Anti-Pattern 1: Duplicating Forms at Each CTA Location

**What people do:** Copy-paste a `<form>` into Hero, CTA, ServiceCTA, Navbar, Footer.
**Why it is wrong:** 6+ copies of form state, validation, and submission logic. Bug fixes must be applied everywhere. Inconsistent behavior guaranteed.
**Do this instead:** Single modal instance at root, context-based triggering.

### Anti-Pattern 2: Form Library for 4 Fields

**What people do:** Install react-hook-form or Formik + Zod for a name/email/phone/notes form.
**Why it is wrong:** These libraries pay off at 10+ fields or complex conditional validation. Two required fields need roughly 20 lines of validation. Adding 10-40KB of dependencies for this is not justified.
**Do this instead:** Custom `useContactForm` hook with manual validation. Revisit if form complexity grows.

### Anti-Pattern 3: Mixed CTA Behaviors

**What people do:** Keep some CTAs as scroll-to-contact, others as modal triggers, others as mailto links.
**Why it is wrong:** Inconsistent UX. Users expect the same-looking button to do the same thing everywhere.
**Do this instead:** ALL prominent CTA buttons open the modal. The homepage CTA section remains visually as a call-to-action area, but its button opens the modal.

### Anti-Pattern 4: Inline Modal Without Portal

**What people do:** Render the modal inside the component tree without `createPortal`.
**Why it is wrong:** This site uses `brutalist-shadow` (hard box-shadows), `border-4`, and z-index layers (Navbar at `z-50`). An inline modal will z-fight or get clipped.
**Do this instead:** `createPortal(modal, document.body)` with `z-[100]`.

### Anti-Pattern 5: State Management Library for Modal State

**What people do:** Add Zustand or Jotai for `{ isOpen: boolean, context: object }`.
**Why it is wrong:** Over-engineering. React Context with `useState` is the standard pattern for this exact use case. The state is two values with two setter functions.
**Do this instead:** `ContactModalProvider` with `useState`.

### Anti-Pattern 6: Keeping the Scroll-to-Contact Section

**What people do:** Keep the `#contact` section as the scroll target and have the Navbar/CaseStudies buttons scroll to it, while other CTAs open a modal.
**Why it is wrong:** Two different interaction patterns for the same intent. The `#contact` section becomes redundant once all CTAs open a modal.
**Do this instead:** The CTA section on the homepage stays as a visual banner, but its button opens the modal. Remove all `scrollToSection('contact')` calls.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Web3Forms (or similar free tier) | POST JSON to `https://api.web3forms.com/submit` with `access_key` field | Free tier: 250 submissions/month. No CORS issues from client-side. API key stored in `VITE_WEB3FORMS_KEY` env var. Not committed to git. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| CTA sites <-> ContactModalProvider | React Context via `useContactModal` hook | One-way: CTAs call `openContactForm()`, never read form state |
| ContactModal <-> useContactForm | Hook return values (fields, errors, status, handlers) | Modal is the only consumer of this hook |
| ContactModal <-> i18n | `useTranslation()` | All text from `contactForm.*` keys in common.json |
| ContactModal <-> Framer Motion | `AnimatePresence` + `motion` components | Enter/exit animations, consistent with existing site animations |
| Form backend <-> useContactForm | `fetch` POST, JSON response | Hook handles the async lifecycle, modal just reads status |

### i18n Keys to Add

New keys under `contactForm` namespace in both `en/common.json` and `bg/common.json`:

```json
{
  "contactForm": {
    "heading": {
      "general": "Get in Touch",
      "service": "Interested in {{service}}?"
    },
    "services": {
      "seo": "SEO",
      "ecommerce": "E-Commerce",
      "ai": "AI & Automation",
      "software": "Custom Software"
    },
    "fields": {
      "name": { "label": "Your Name", "placeholder": "John Doe" },
      "email": { "label": "Email", "placeholder": "john@example.com" },
      "phone": { "label": "Phone (optional)", "placeholder": "+359..." },
      "notes": { "label": "Tell us about your project", "placeholder": "Describe what you need..." }
    },
    "validation": {
      "nameRequired": "Name is required",
      "emailRequired": "Email is required",
      "emailInvalid": "Please enter a valid email"
    },
    "submit": "Send Message",
    "submitting": "Sending...",
    "success": {
      "heading": "Message Sent!",
      "description": "We will get back to you within 24 hours.",
      "close": "Close"
    },
    "error": {
      "heading": "Something went wrong",
      "description": "Please try again or email us directly at engineering@epsystems.org",
      "retry": "Try Again"
    }
  }
}
```

### Styling Integration

The modal must follow the established Brutalist design system:
- Card: `border-4 border-black rounded-[30px] brutalist-shadow bg-white`
- Submit button: `bg-[#B9FF66] border-4 border-black rounded-xl font-black` (matches existing CTA buttons)
- Input fields: `border-2 border-black rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#B9FF66] focus:border-[#B9FF66]`
- Error text: `text-red-600 text-sm font-bold`
- Close button: `X` icon from lucide-react (already in project, used in Navbar mobile menu)
- Backdrop: `bg-black/60` with blur optional

## Build Order

Based on dependency analysis:

| Step | What | Depends On | Effort |
|------|------|-----------|--------|
| 1 | `ContactModalProvider` + `useContactModal` hook + types | Nothing | Small |
| 2 | `useContactForm` hook (state, validation, submission) | Nothing | Small |
| 3 | i18n keys for EN and BG | Nothing | Small |
| 4 | `ContactModal` component (form UI, all states, animations) | Steps 1, 2, 3 | Medium |
| 5 | Wrap App.tsx with `ContactModalProvider` | Step 1 | Trivial |
| 6 | Convert all 7 CTA touchpoints to `openContactForm()` | Steps 1, 4, 5 | Medium |
| 7 | Wire form backend (Web3Forms API key, real POST) | Step 2 | Small |

Steps 1, 2, and 3 are independent and can be built in parallel. Step 4 is the main UI work. Steps 5-7 are integration. Total estimated new code: ~300 lines across 4 new files, plus ~30 lines of modifications across 6 existing files.

## Sources

- Existing codebase: all source files read directly, CTA locations identified via grep (HIGH confidence)
- React Context API: standard React 19 pattern (HIGH confidence)
- React `createPortal`: standard ReactDOM API (HIGH confidence)
- Framer Motion `AnimatePresence`: already used throughout project for animations (HIGH confidence)
- Web3Forms free tier: referenced in PROJECT.md as candidate backend (MEDIUM confidence -- API specifics to verify during implementation)

---
*Architecture research for: Contact form modal integration into E&P Systems SPA*
*Researched: 2026-03-25*
