# Testing Patterns

**Analysis Date:** 2026-03-24

## Test Framework

**Runner:**
- Not configured - No test framework installed or configured
- No `jest.config.js`, `vitest.config.ts`, or test runner in `package.json`
- No test scripts defined (dev/build/preview only)

**Assertion Library:**
- Not applicable - No testing infrastructure present

**Run Commands:**
- None configured
- Would need to add test script and framework

## Test File Organization

**Location:**
- No test files exist in `/src/`
- Test infrastructure not implemented

**Naming:**
- No test files to reference
- Recommended pattern would be: `.test.tsx` or `.spec.tsx` alongside component files

**Structure:**
- Not yet established

## Test Coverage

**Requirements:**
- None enforced - No testing infrastructure or coverage reporting configured

**Current State:**
- 0% - No tests exist

## Implementation Recommendations

**Priority Testing Areas:**

1. **Component Rendering:**
   - Navbar mobile menu toggle
   - ServiceDetail variant rendering (left-dark, right-boxed, left-lime)
   - AnimatedSection visibility animations
   - Footer responsive grid layout

2. **Data Processing:**
   - Services.ts type exports
   - CaseStudies.tsx text highlighting logic (splitting description on highlight1/highlight2)
   - ServiceDetail className conditional logic

3. **State Management:**
   - Navbar.tsx mobile open/close state
   - Menu visibility toggle functionality

4. **Integration Points:**
   - Hero section motion animations
   - Services section animation on scroll
   - CTA section element visibility

## Next Steps for Testing

**Phase 1: Setup**
```bash
# Install test runner (recommended: Vitest for Vite project)
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui
```

**Phase 2: Configuration**
- Create `vitest.config.ts`
- Add test script to `package.json`
- Add TypeScript support for test files

**Phase 3: Test Files**
- Example test for `AnimatedSection.tsx`:
  ```typescript
  import { describe, it, expect } from 'vitest'
  import { render, screen } from '@testing-library/react'
  import { AnimatedSection } from './AnimatedSection'

  describe('AnimatedSection', () => {
    it('renders children correctly', () => {
      render(
        <AnimatedSection>
          <div>Test Content</div>
        </AnimatedSection>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <AnimatedSection className="custom-class">
          <div>Content</div>
        </AnimatedSection>
      )
      const container = screen.getByText('Content').closest('div')
      expect(container).toHaveClass('custom-class')
    })
  })
  ```

- Example test for `Navbar.tsx` state:
  ```typescript
  import { describe, it, expect } from 'vitest'
  import { render, screen, fireEvent } from '@testing-library/react'
  import { Navbar } from './Navbar'

  describe('Navbar', () => {
    it('toggles mobile menu on button click', () => {
      render(<Navbar />)
      const menuButton = screen.getByRole('button')

      // Menu should not be visible initially
      expect(screen.queryByText('Services')).not.toBeInTheDocument()

      // Click button to open menu
      fireEvent.click(menuButton)
      expect(screen.getByText('Services')).toBeInTheDocument()

      // Click button to close menu
      fireEvent.click(menuButton)
      expect(screen.queryByText('Services')).not.toBeInTheDocument()
    })
  })
  ```

## Component Testing Strategy

**Components Requiring Tests:**

**Layout Components:**
- `Navbar.tsx` - State management (mobileOpen toggle), responsive behavior
- `Footer.tsx` - Static rendering, copyright year generation

**Section Components:**
- `Hero.tsx` - Motion animations, icon rotation on hover
- `Services.tsx` - Service card rendering from data, variant styling application
- `ServiceDetail.tsx` - Variant prop handling (left-dark, right-boxed, left-lime), conditional className logic
- `CaseStudies.tsx` - Case highlighting logic, text splitting on multiple highlight strings
- `Marquee.tsx` - Infinite scroll animation, item duplication

**UI Components:**
- `AnimatedSection.tsx` - Motion animation props, children rendering, custom className application

**Data/Type Safety:**
- `services.ts` - Interface definitions validate against consumer components

## Testing Best Practices for This Codebase

**What to Test:**
- Component state changes (Navbar mobile menu)
- Conditional rendering based on props (ServiceDetail variants)
- Data-driven rendering (Services list from services array)
- Animation trigger conditions (scroll-based visibility)
- Text transformation logic (CaseStudies highlighting)

**What NOT to Test:**
- Third-party animation libraries (framer-motion) - trust library behavior
- Tailwind CSS class application - verify output visually, not unit test
- Icon rendering from lucide-react - assume library works correctly
- Pixel-perfect styling - test classes are applied, not exact styling

**Recommended Testing Approach:**
- Use Vitest (optimized for Vite projects)
- Combine with React Testing Library for component testing
- Focus on user interactions and data flow
- Keep tests colocated with components: `Navbar.test.tsx` next to `Navbar.tsx`
- Avoid testing implementation details; test behavior instead

---

*Testing analysis: 2026-03-24*
