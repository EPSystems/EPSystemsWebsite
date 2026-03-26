# Phase 1: Router Foundation - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace hash-based anchor navigation with React Router using BrowserRouter. Implement language-prefixed URL structure (/en/..., /bg/...). Fix all broken and placeholder links. All existing navigation must continue to work after migration - smooth scroll to anchors, working CTAs, no dead links.

</domain>

<decisions>
## Implementation Decisions

### URL structure

- Language-prefixed paths: `/en/services/seo`, `/bg/services/seo`
- Homepage at `/en/` and `/bg/` (no trailing path segment like /home)
- Service pages follow pattern: `/:lang/services/:service-slug`
- Root URL (/) redirects to language-prefixed route

### Navigation feel

- Instant SPA transitions between pages - no page reload, content swaps immediately
- Smooth scroll animation for anchor links on the homepage (preserve current behavior)
- Scroll to top of page when navigating to a new route
- Anchor links within the homepage (#services, #seo, etc.) must continue working as smooth-scroll

### Link audit

- Remove all placeholder links (# or javascript:void(0)) - better no link than a broken one
- External links (social profiles, etc.) open in a new tab (target="\_blank")
- CTA buttons ("Contact Us", "Get Started") scroll to the contact section on the homepage
- User will provide real social media URLs for footer links

### Claude's Discretion

- Root URL (/) redirect behavior - pick best practice (browser language detection vs default to English)
- 404 handling - custom page vs redirect, Claude picks best approach
- SPA fallback configuration for hosting
- Exact route structure and React Router configuration

</decisions>

<specifics>
## Specific Ideas

- Social media profile URLs will be provided by the user before or during implementation - leave as configurable data
- The existing 11+ hash-based anchor links in Navbar, Footer, and CTA sections must all be migrated to work with the new router

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

_Phase: 01-router-foundation_
_Context gathered: 2026-03-24_
