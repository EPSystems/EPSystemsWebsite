# Coding Conventions

**Analysis Date:** 2026-03-24

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Navbar.tsx`, `Hero.tsx`, `AnimatedSection.tsx`)
- Data/utilities: camelCase or kebab-case for directories (e.g., `src/components/layout/`, `src/data/services.ts`)
- Test files: Would follow `[ComponentName].test.tsx` or `[ComponentName].spec.tsx` pattern (not yet implemented)

**Functions:**
- Component functions: PascalCase (e.g., `function Navbar()`, `export function Services()`)
- Utility/helper functions: camelCase (e.g., `const variantStyles = {...}`)
- Event handlers: camelCase with `on` prefix or descriptive name (e.g., `onClick={() => setMobileOpen(!mobileOpen)}`)

**Variables:**
- State variables: camelCase (e.g., `const [mobileOpen, setMobileOpen] = useState(false)`)
- Constants: camelCase or UPPER_SNAKE_CASE for semantic constants (e.g., `const items = [...]`, `const services: Service[]`)
- CSS class strings: kebab-case (e.g., `className="max-w-7xl mx-auto px-6 py-8"`)

**Types:**
- Interfaces: PascalCase with `Props` suffix for component props (e.g., `interface AnimatedSectionProps`, `interface ServiceDetailProps`)
- Types: PascalCase (e.g., `type LucideIcon`, `type Service`)
- Enums: PascalCase (variant: `'light' | 'lime' | 'dark'` as union types preferred over enums)

## Code Style

**Formatting:**
- No explicit formatter configured (no `.eslintrc`, `.prettierrc`, or `biome.json`)
- TypeScript strict mode enabled in `tsconfig.json`
- Files use 2-space indentation (observed in actual files)
- JSX props follow single-line or multi-line depending on length
- Trailing semicolons: Present in imports, optional in function bodies (both patterns observed)

**Linting:**
- TypeScript strict mode: `"strict": true` in `tsconfig.json`
- Unused locals/parameters flagged: `"noUnusedLocals": true`, `"noUnusedParameters": true`
- Switch statement checking: `"noFallthroughCasesInSwitch": true`
- No ESLint configuration detected
- Recommended: Add ESLint or Prettier for consistency

## Import Organization

**Order:**
1. External library imports (React, lucide-react, framer-motion)
2. Type imports (`import type { ... } from ...`)
3. Local component imports (relative paths with `./` or `../`)
4. Data imports (from `data/` directory)

**Path Aliases:**
- Not configured - all imports use relative paths
- Examples:
  - `import { Navbar } from './components/layout/Navbar'`
  - `import { AnimatedSection } from '../ui/AnimatedSection'`
  - `import { services } from '../../data/services'`

**Pattern Examples:**
```typescript
// Hero.tsx - Consistent pattern
import { motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp } from 'lucide-react'

// AnimatedSection.tsx - Type import separate
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Services.tsx - Multiple external imports first, then local
import { ArrowUpRight, Target, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { services } from '../../data/services'
import { AnimatedSection } from '../ui/AnimatedSection'
```

## Error Handling

**Patterns:**
- Type safety with TypeScript strict mode prevents null reference errors
- Non-null assertion operator used where needed (e.g., `services.find(s => s.id === 'seo')!`)
- No explicit try-catch blocks observed in codebase
- UI resilience through prop defaults and optional chaining
- Example from `AnimatedSection.tsx`:
  ```typescript
  export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps)
  ```

## Logging

**Framework:** No logging framework detected
- No console.log patterns observed in component code
- Would need to be added if debugging/monitoring required

## Comments

**When to Comment:**
- No extensive comments in codebase
- Code is generally self-documenting through clear naming
- Inline comments avoided in favor of clear function/variable names

**JSDoc/TSDoc:**
- Not used - interfaces and types documented through TypeScript types themselves
- Example: Interface props are self-documenting:
  ```typescript
  interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    delay?: number
  }
  ```

## Function Design

**Size:**
- Component functions: Range from 10-150 lines
- Inline complex logic: Arrays of config objects (e.g., `detailSections`, `variantStyles`) stored above return
- Example: `Services.tsx` keeps style mapping (`variantStyles`) at module level

**Parameters:**
- Destructured in component signatures: `function ServiceDetail({ id, icon, label, ... }: ServiceDetailProps)`
- Props always have interface type definitions
- Optional props use `?:` syntax with defaults

**Return Values:**
- Components always return JSX
- No custom hooks or utility returns observed yet
- Implicit return for arrow function component bodies

## Module Design

**Exports:**
- Named exports for all components: `export function Navbar() {}`
- Single export per component file
- Data exports as arrays/objects: `export const services: Service[]`
- Type exports use `export interface` or `export type`

**Barrel Files:**
- Not used - no index.ts files in component directories
- Import directly from component files

**File Organization by Layer:**
- `/src/components/layout/` - Page structure components (Navbar, Footer)
- `/src/components/sections/` - Page sections (Hero, Services, CaseStudies, etc.)
- `/src/components/ui/` - Reusable UI components (AnimatedSection)
- `/src/data/` - Static data and types (services.ts with Service interface)
- `/src/` - App root and entry point (App.tsx, main.tsx)

## TypeScript-Specific Patterns

**Type Imports:**
- Use `import type` for type-only imports: `import type { ReactNode } from 'react'`
- Use `import type` for Lucide icons when only needed for typing: `import type { LucideIcon } from 'lucide-react'`

**Union Types:**
- Variant patterns use union types: `variant: 'left-dark' | 'right-boxed' | 'left-lime'`
- Preferred over enums for variant styling

**Interface Props Pattern:**
```typescript
interface ServiceDetailProps {
  id: string
  icon: LucideIcon
  label: string
  headline: string
  description: string
  features: string[]
  ctaText: string
  variant: 'left-dark' | 'right-boxed' | 'left-lime'
}

export function ServiceDetail({
  id,
  icon: Icon,  // Destructure and rename for usage
  label,
  headline,
  description,
  features,
  ctaText,
  variant,
}: ServiceDetailProps) {
  // ...
}
```

---

*Convention analysis: 2026-03-24*
