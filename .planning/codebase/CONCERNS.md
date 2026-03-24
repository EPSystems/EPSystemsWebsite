# Codebase Concerns

**Analysis Date:** 2026-03-24

## Tech Debt

**Hardcoded Color Values:**
- Issue: Lime green color `#B9FF66` is repeated throughout the codebase as hardcoded strings instead of using the Tailwind config token
- Files: `src/components/sections/ServiceDetail.tsx`, `src/components/sections/Services.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/Marquee.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/sections/CaseStudies.tsx`, `src/index.css`
- Impact: Inconsistent color usage, difficult to maintain brand colors, risk of typos. Changing the brand color requires updates in 8+ files
- Fix approach: Extract all `#B9FF66` references into Tailwind configuration or CSS variables. The config already defines `colors.lime: '#B9FF66'` but components use hardcoded hex instead of `bg-lime` class

**Non-semantic Markup in CaseStudies:**
- Issue: Complex nested `.map()` and `.split()` logic for text highlighting in `src/components/sections/CaseStudies.tsx` lines 41-61
- Files: `src/components/sections/CaseStudies.tsx`
- Impact: Difficult to read, maintain, and test. String splitting is fragile and breaks if highlight text changes. Hard to extract to separate component
- Fix approach: Create a reusable `HighlightedText` component that accepts text and highlight phrases as props, then renders properly marked-up JSX

**Missing Animation Keyframe Definition:**
- Issue: `animate-marquee` is used in `src/components/sections/Marquee.tsx` but defined in tailwind config with 50% offset that expects infinite loop
- Files: `src/components/sections/Marquee.tsx`, `tailwind.config.ts` line 20
- Impact: Marquee animation may have jump/stutter at loop boundary. Not critical but unpolished
- Fix approach: Verify animation loops smoothly by testing at various viewport sizes, or adjust the `-50%` transform to account for spacing

**Unused Service Detail Properties:**
- Issue: `detailHeadline`, `detailDescription`, and `ctaText` are optional in `Service` interface but rendered with non-null assertions in `App.tsx` lines 46-49
- Files: `src/data/services.ts`, `src/App.tsx`
- Impact: Silent failures if service data is incomplete. Two services (websites, landing, support) don't have detail sections but data structure allows them
- Fix approach: Either make these properties required, or conditionally render detail sections only for services that have them

## Known Bugs

**Color Hover Inconsistency in Navbar:**
- Symptoms: Links use hardcoded color `#88cc33` on hover instead of the brand lime `#B9FF66`
- Files: `src/components/layout/Navbar.tsx` lines 16, 17, 18, 19, 37, 38, 39, 40
- Trigger: Hover over any navigation link in desktop or mobile menu
- Workaround: None - but this appears intentional (different shade for accessibility), needs clarification
- Impact: Brand color inconsistency or intentional contrast design - unclear which

**Non-Functional CTA Button Link:**
- Symptoms: Button in Footer (line 34-36) with ArrowUpRight icon has no href - it's a button element, not a link
- Files: `src/components/layout/Footer.tsx` line 34
- Trigger: Click the arrow button in footer
- Workaround: Adjacent email link works
- Impact: Button appears interactive but does nothing. User confusion. Should navigate somewhere or be removed

## Security Considerations

**Plain Email in Markup:**
- Risk: Email address `engineering@epsystems.org` hardcoded in multiple locations exposed in HTML source code
- Files: `src/components/sections/Hero.tsx` line 48, `src/components/sections/CTA.tsx` line 16, `src/components/layout/Footer.tsx` line 29
- Current mitigation: Email address is public-facing (agency contact), so low risk of spam harvesting
- Recommendations: Consider email obfuscation if spam becomes issue. No immediate action needed for a public agency contact

**No Security Headers or Content Policy:**
- Risk: Website has no documented security headers (CSP, X-Frame-Options, etc.) in HTTP response configuration
- Files: Configuration would be in Vite config or deployment server
- Current mitigation: Vite dev server has minimal attack surface; check deployment hosting configuration
- Recommendations: Add security headers configuration when deploying to production. Document expected CSP directives for Google Fonts

## Performance Bottlenecks

**Large Font Import with Multiple Weights:**
- Problem: Google Fonts import of Bricolage Grotesque with display=swap loads multiple weights but only used weights unclear
- Files: `index.html` line 11
- Cause: Font family configured in tailwind but specific used weights not specified in link
- Improvement path: Use `font-weight` descriptor in link query string (e.g., `wght@400;700`) to load only necessary weights. Check actual usage in components (mostly `font-bold` = 700, `font-black` = 900)

**Excessive use of WebkitTextStroke:**
- Problem: Hero section uses `WebkitTextStroke: '2px black'` for accessibility contrast on lime green text
- Files: `src/components/sections/Hero.tsx` line 29
- Cause: Design requires high contrast for readability
- Improvement path: Consider alternative approaches: darker text color, text shadow, or background gradient for better performance

**Unused Animation Classes:**
- Problem: Tailwind config defines `marquee-slow` animation (line 15) but it's never used in the codebase
- Files: `tailwind.config.ts`
- Impact: Minor - increases CSS bundle size by negligible amount
- Fix approach: Remove `marquee-slow` from config or implement if it was planned for future use

## Fragile Areas

**Service Data Structure Brittleness:**
- Files: `src/data/services.ts`, `src/App.tsx`
- Why fragile: Services array has optional fields that are required at runtime. Code uses `.find()` with non-null assertions, will crash if service ID not found
- Safe modification: Always validate `.find()` results before rendering. Consider moving detail sections to separate data structure. Add unit tests for service lookups
- Test coverage: No tests for service data retrieval or ID mapping

**DetailSection Mapping in App Component:**
- Files: `src/App.tsx` lines 12-31, 40-52
- Why fragile: Hardcoded `detailSections` array manually maps service IDs to components. Adding new detail sections requires manual coordination
- Safe modification: Create a service configuration that includes detail metadata (icon, variant, label) with the service itself
- Test coverage: No tests verifying all mapped services exist in services array

**Navbar Mobile State Management:**
- Files: `src/components/layout/Navbar.tsx`
- Why fragile: `mobileOpen` state uses simple boolean toggle. No click-outside handler to close menu. Menu stays open if user navigates internally
- Safe modification: Add useEffect to close menu on navigation, add keyboard Escape handler, add click-outside detection
- Test coverage: No tests for mobile menu interaction

## Scaling Limits

**Single Services Array for All Pages:**
- Current capacity: 6 services (currently defined in `src/data/services.ts`)
- Limit: If scaling to 20+ services, grid layouts on Services section (3-column) will become unwieldy. All services rendered in detail sections sequentially
- Scaling path: Implement service filtering/categories. Lazy-load service detail sections. Create a dedicated service listing page

**Animation Library Dependency:**
- Problem: Heavy reliance on Framer Motion for scroll-triggered animations
- Files: Multiple components use `motion.div`, `whileInView`, `animate`
- Limit: If adding 20+ animated sections, bundle size and DOM overhead increases. Intersection Observer used by Framer Motion can become bottleneck on low-end devices
- Scaling path: Consider lighter animation library or native Intersection Observer for non-interactive scroll effects

## Dependencies at Risk

**Framer Motion at ^12.38.0:**
- Risk: Caret version allows minor/patch updates. If breaking change in 13.x releases, automatic updates could break animations
- Impact: All scroll and motion animations break. Site becomes static/unpolished
- Migration plan: Pin exact version `12.38.0`, monitor Framer Motion releases, migrate to v13 only after testing

**TypeScript at ^6.0.2:**
- Risk: Very recent TypeScript version (released 2024). Rapid iteration means potential for edge cases
- Impact: Build errors, type checking surprises in future projects
- Migration plan: Consider pinning to stable LTS versions like 5.x for production, keep 6.x for development

**Lucide React Icons at ^1.5.0:**
- Risk: Caret version allows updates. Icon rendering could change
- Impact: Inconsistent icon appearance across deployments
- Migration plan: Monitor releases, pin to specific version if icon consistency is critical for branding

## Missing Critical Features

**No Contact Form:**
- Problem: Multiple CTA buttons link to `mailto:engineering@epsystems.org`, no actual contact form
- Blocks: Cannot collect structured inquiry data, no email tracking, accessibility issues with mailto links on some devices
- Recommendation: Implement contact form with validation. Consider form submission service (Formspree, Netlify Forms) for serverless handling

**No Analytics:**
- Problem: No analytics library integrated to track user behavior, page views, conversions
- Blocks: Cannot measure marketing effectiveness, understand which services drive interest, optimize UX
- Recommendation: Add Google Analytics 4 (GA4) or Plausible. Track CTA clicks, service section views, scroll depth

**No Error Boundary:**
- Problem: React component crashes not caught, entire page goes blank
- Blocks: Production site down if any component throws
- Recommendation: Implement error boundary component. Handle and log errors gracefully

**No Loading States:**
- Problem: All content loads synchronously, no handling for slow networks
- Blocks: Cannot show skeleton loaders, perceived performance degrades on slow connections
- Recommendation: Add suspense boundaries around lazy-loaded sections (CaseStudies, ServiceDetails)

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: Service data validation, component prop validation, utility functions
- Files: `src/data/services.ts`, `src/App.tsx`
- Risk: Service ID changes or missing properties cause silent failures in production
- Priority: Medium - build simple Jest tests for data layer

**No Component Tests:**
- What's not tested: Navbar mobile menu toggle, ServiceDetail variant rendering, responsive grid breakpoints
- Files: `src/components/layout/Navbar.tsx`, `src/components/sections/ServiceDetail.tsx`, `src/components/sections/Services.tsx`
- Risk: UI regressions go undetected. Responsive layout breaks on certain screen sizes
- Priority: Medium - add Vitest with React Testing Library for critical components

**No E2E Tests:**
- What's not tested: Navigation flow, CTA button clicks, scroll animation triggers
- Risk: User journeys break without detection
- Priority: Low - consider Cypress or Playwright once feature set stabilizes

**No Visual Regression Tests:**
- What's not tested: Brutalist design consistency (shadows, borders, colors), animation smoothness
- Risk: CSS refactors inadvertently change visual appearance
- Priority: Low - add visual regression suite after design is finalized

---

*Concerns audit: 2026-03-24*
