# Codebase Structure

**Analysis Date:** 2026-03-24

## Directory Layout

```
/d/Claude/EPSystems/
├── src/                        # Source code
│   ├── components/             # React components organized by type
│   │   ├── layout/             # Header and footer layout components
│   │   ├── sections/           # Page section components (Hero, Services, etc.)
│   │   └── ui/                 # Reusable UI primitives
│   ├── data/                   # Configuration and constants
│   ├── App.tsx                 # Root application component
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles and custom components
│   └── vite-env.d.ts           # Vite environment type definitions
├── public/                     # Static assets (images, favicon)
├── index.html                  # HTML entry point
├── package.json                # NPM dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── .planning/                  # Planning documentation
```

## Directory Purposes

**src/:**
- Purpose: All application source code
- Contains: TypeScript/TSX components, data files, styles
- Key files: `App.tsx` (root), `main.tsx` (mount point), `index.css` (global styles)

**src/components/:**
- Purpose: Organizational folder for all React components
- Contains: Layout, sections, and UI sub-folders
- Key files: All `.tsx` component files

**src/components/layout/:**
- Purpose: Structural layout components that frame the page
- Contains: Navigation and footer components
- Key files:
  - `Navbar.tsx` - Responsive navigation with mobile menu
  - `Footer.tsx` - Footer with sitemap, contact links, and branding

**src/components/sections/:**
- Purpose: Self-contained page sections with distinct visual design
- Contains: Major content blocks composing the homepage
- Key files:
  - `Hero.tsx` - Hero section with headline, CTA buttons, illustration
  - `Marquee.tsx` - Scrolling service showcase banner
  - `Services.tsx` - Service card grid with 3-column layout
  - `ServiceDetail.tsx` - Full-page service details with variants
  - `CaseStudies.tsx` - Project portfolio showcase
  - `CTA.tsx` - Contact call-to-action section

**src/components/ui/:**
- Purpose: Reusable low-level UI components
- Contains: Animation wrappers and primitives
- Key files:
  - `AnimatedSection.tsx` - Framer Motion scroll-triggered fade-in wrapper

**src/data/:**
- Purpose: Configuration and constant data
- Contains: Service definitions and metadata
- Key files:
  - `services.ts` - Service array with titles, descriptions, features, variants, and detail sections

**public/:**
- Purpose: Static assets served as-is
- Contains: favicon, images, or other unprocessed files
- Generated: No (committed to repo)

## Key File Locations

**Entry Points:**
- `index.html`: HTML document with root div and script tag
- `src/main.tsx`: React root creation and App component mount
- `src/App.tsx`: Root React component that composes all page sections

**Configuration:**
- `tsconfig.json`: TypeScript compiler options (target ES2020, jsx react-jsx)
- `vite.config.ts`: Vite build server with React plugin
- `tailwind.config.ts`: Theme extension with lime color and custom animations
- `postcss.config.js`: PostCSS with Tailwind and Autoprefixer

**Core Logic:**
- `src/data/services.ts`: Service definitions and interface
- `src/App.tsx`: Service composition and section orchestration
- `src/components/sections/ServiceDetail.tsx`: Variant-driven detail rendering

**Styling:**
- `src/index.css`: Global styles, Tailwind directives, custom components (.brutalist-shadow)

## Naming Conventions

**Files:**
- Components: PascalCase.tsx (e.g., `Navbar.tsx`, `Hero.tsx`)
- Data/Config: camelCase.ts (e.g., `services.ts`)
- Styles: index.css (global only, no component-scoped CSS)
- Environment: `vite-env.d.ts`, `.env*` for secrets (not tracked)

**Directories:**
- Feature-based: `components/`, `data/`
- Component grouping: `layout/`, `sections/`, `ui/`
- All lowercase with no spaces

**Variables & Functions:**
- React components: PascalCase (e.g., `function Hero()`)
- Hooks/utilities: camelCase (e.g., `useState`, `const service = ...`)
- Constants: CONSTANT_CASE or camelCase (e.g., `const variantStyles = {}`, `const detailSections = []`)
- CSS classes: kebab-case (e.g., `brutalist-shadow`, `animate-marquee`)

## Where to Add New Code

**New Section/Page Feature:**
- Location: `src/components/sections/[FeatureName].tsx`
- Template: Export default function component, use AnimatedSection for entrance animation
- Register in: `src/App.tsx` by adding `<FeatureName />` to JSX
- Styling: Use Tailwind classes with custom tokens (lime color, rounded-[30px], border-4)

**New Service Type:**
- Location: `src/data/services.ts`
- Add to: `services` array with Service interface fields (id, icon, title, description, features, variant)
- Map in: `src/components/sections/Services.tsx` for card display
- Optionally add detail section: Create variant in ServiceDetail.tsx props and map in App.tsx

**New UI Component:**
- Location: `src/components/ui/[ComponentName].tsx`
- Pattern: Accept children or content as props, wrap with Framer Motion or animation logic
- Export: Named export for use in sections

**Shared Utilities:**
- Create: `src/utils/[utility].ts` (folder doesn't exist yet, follow naming pattern)
- Import: Use relative imports from components
- Example: Animation constants, color definitions, validation helpers

**New Layout Component:**
- Location: `src/components/layout/[ComponentName].tsx`
- Used by: Wrap sections in App.tsx or as page frame component
- Examples: Sidebar, header variants, modal containers

## Special Directories

**node_modules/:**
- Purpose: NPM dependencies
- Generated: Yes (from package.json and package-lock.json)
- Committed: No (.gitignore)

**.git/:**
- Purpose: Version control metadata
- Generated: Yes (git init)
- Committed: No (system folder)

**.planning/:**
- Purpose: GSD planning documentation
- Generated: Yes (created during planning)
- Committed: Yes (guidance for future phases)

**public/:**
- Purpose: Static assets
- Generated: No (manually added)
- Committed: Yes (favicon, images needed for deployment)

## Import Patterns

**React/Framework:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { motion } from 'framer-motion'
```

**Components:**
```typescript
// Relative imports
import { Navbar } from './components/layout/Navbar'
import { Hero } from './components/sections/Hero'
import { AnimatedSection } from '../ui/AnimatedSection'
```

**Data & Types:**
```typescript
import { services } from './data/services'
import type { Service } from './data/services'
import type { LucideIcon } from 'lucide-react'
```

**Icons:**
```typescript
import { Search, ShoppingCart, Bot, ArrowUpRight } from 'lucide-react'
```

---

*Structure analysis: 2026-03-24*
