# Architecture

**Analysis Date:** 2026-03-24

## Pattern Overview

**Overall:** Component-driven marketing website with section-based page composition

**Key Characteristics:**
- Single-page application (SPA) with smooth scrolling navigation
- Data-driven service configuration from a centralized source
- Composition-based layout (App.tsx orchestrates page sections)
- Framer Motion-powered scroll animations on all major sections
- Tailwind CSS with custom Brutalist design system tokens

## Layers

**Presentation Layer:**
- Purpose: Render UI components and handle user interactions
- Location: `src/components/`
- Contains: Layout components (Navbar, Footer), section components (Hero, Services, CaseStudies), UI primitives (AnimatedSection)
- Depends on: Data layer for service definitions, Lucide icons, Framer Motion
- Used by: App.tsx entry point

**Data Layer:**
- Purpose: Centralized configuration and constants
- Location: `src/data/services.ts`
- Contains: Service definitions with metadata (title, description, features, styling variants)
- Depends on: Lucide icon exports
- Used by: Services, ServiceDetail, App.tsx for populating UI

**Layout Components:**
- Purpose: Provide structure and consistent UI frame
- Location: `src/components/layout/`
- Contains: Navbar (navigation + mobile menu), Footer (sitemap + contact info)
- Depends on: Lucide icons, internal navigation anchors
- Used by: Wrapped around page content in App.tsx

**Section Components:**
- Purpose: Render major content blocks with distinct visual styles
- Location: `src/components/sections/`
- Contains: Hero (CTAs + illustration), Services (service grid), ServiceDetail (detailed service descriptions), CaseStudies (project showcases), Marquee (scrolling service list), CTA (contact prompt)
- Depends on: Data layer, Framer Motion, Lucide icons, AnimatedSection wrapper
- Used by: Composed sequentially in App.tsx

**UI Component Layer:**
- Purpose: Reusable animation and presentation primitives
- Location: `src/components/ui/`
- Contains: AnimatedSection (scroll-triggered fade-in wrapper)
- Depends on: Framer Motion
- Used by: All section components for entrance animations

## Data Flow

**Service Configuration → Display:**

1. `src/data/services.ts` defines Service array with title, description, features, visual variants
2. `src/components/sections/Services.tsx` maps service array into grid of service cards
3. `src/App.tsx` finds specific services by ID and passes them to `ServiceDetail` components
4. ServiceDetail renders with variant-specific styling (left-dark, right-boxed, left-lime)

**Navigation & Scrolling:**

1. Navbar contains anchor links (#services, #seo, #ecommerce, #case-studies, #contact)
2. Each section uses id attribute to enable hash-based navigation
3. HTML scroll-smooth applied at root for smooth scrolling behavior
4. Mobile menu state managed in Navbar.tsx useState for responsive menu toggle

**Animation Flow:**

1. Framer Motion wraps Hero content with initial opacity/transform states
2. AnimatedSection uses whileInView to trigger animations as sections enter viewport
3. Component-level animations (icon rotation, shadow translation) use motion.div transition definitions
4. Custom brutalist-shadow class in CSS provides hover state elevation effect

**State Management:**

- Minimal: Only Navbar.tsx maintains local state (mobileOpen boolean)
- All other data is static and composition-based
- No global state manager required (React context not needed)

## Key Abstractions

**Service Definition:**
- Purpose: Single source of truth for service metadata and variations
- Examples: `src/data/services.ts` exports Service interface and services array
- Pattern: Configuration-driven rendering with TypeScript interfaces ensuring type safety

**Animated Section Wrapper:**
- Purpose: Consistent scroll-triggered entrance animation
- Examples: `src/components/ui/AnimatedSection.tsx`
- Pattern: HOC-style component that wraps content with Framer Motion viewport detection

**Variant-Based Styling:**
- Purpose: Adapt component appearance based on visual variant prop
- Examples: `src/components/sections/Services.tsx` (variantStyles object), `src/components/sections/ServiceDetail.tsx` (conditional class construction)
- Pattern: Object map of variant names to Tailwind class strings, computed at render time

**Brutalist Design System:**
- Purpose: Consistent bold visual language with strong borders and shadow effects
- Examples: `src/index.css` defines .brutalist-shadow, .brutalist-shadow-static custom components
- Pattern: CSS custom components in @layer directive, applied via class names (border-4 border-black, rounded-[30px])

## Entry Points

**Browser Entry:**
- Location: `index.html` with `<div id="root"></div>` and `<script src="/src/main.tsx"></script>`
- Triggers: Page load
- Responsibilities: HTML structure, font preload, meta tags, script initialization

**React Mount:**
- Location: `src/main.tsx`
- Triggers: Browser script execution
- Responsibilities: Create React root and render App component in StrictMode

**App Component:**
- Location: `src/App.tsx`
- Triggers: React mount
- Responsibilities: Compose all sections in sequence, fetch services data, map service IDs to detail sections

## Error Handling

**Strategy:** Defensive data access with TypeScript non-null assertions

**Patterns:**
- Services found via `.find()` use non-null assertion operator (!) to access matched service: `services.find(s => s.id === 'seo')!`
- Assumes all service IDs in App.tsx match entries in services.ts
- No error boundaries or fallback UI implemented
- Relies on build-time TypeScript checking to catch mismatches

## Cross-Cutting Concerns

**Styling:** Tailwind CSS with custom color tokens (lime: #B9FF66) and animations (marquee 20s linear infinite)

**Layout:** Max-width container (max-w-7xl) with horizontal padding (px-6) applied consistently across all sections

**Navigation:** Hash-based anchor navigation with scroll-smooth behavior in HTML root

**Animations:** Framer Motion applied at two levels:
  - Section-level: AnimatedSection component for sequential entrance
  - Component-level: Icon rotations, shadow transitions, hover effects via motion.div

**Icons:** Lucide React icons (Search, Globe, ShoppingCart, Bot, etc.) with size props and color customization

---

*Architecture analysis: 2026-03-24*
