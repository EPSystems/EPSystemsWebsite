# External Integrations

**Analysis Date:** 2026-03-24

## APIs & External Services

**Not detected.**
- No API client libraries (axios, fetch wrappers) in codebase
- No service SDKs (Stripe, Supabase, Firebase, AWS, etc.) configured
- Application is purely frontend/presentational with no backend API calls

## Data Storage

**Databases:**
- Not applicable - No persistent data storage configured
- Application is client-side only, no database connections

**File Storage:**
- Not applicable - Local filesystem only for development assets
- No cloud storage integrations (AWS S3, Google Cloud Storage, etc.)

**Caching:**
- Browser cache only - Handled by HTTP headers and service workers (if configured)
- No dedicated caching service (Redis, Memcached) integrated

## Authentication & Identity

**Auth Provider:**
- Not configured - No authentication system implemented
- Application is public-facing marketing site with no user accounts or login

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integrated (Sentry, LogRocket, Rollbar, etc.)
- Console errors logged to browser developer tools only

**Logs:**
- Browser console only - `console.log` / `console.error` if used
- No structured logging framework or external log aggregation service

**Analytics:**
- Not detected - No analytics library integrated (Google Analytics, Mixpanel, Amplitude, etc.)
- No tracking pixels or analytics configuration in `index.html`

## CI/CD & Deployment

**Hosting:**
- Not specified in configuration
- Likely candidates based on static SPA nature: Vercel, Netlify, CloudFlare Pages, GitHub Pages, AWS S3 + CloudFront

**CI Pipeline:**
- Not configured - No GitHub Actions, GitLab CI, or other CI/CD configuration detected
- Build process is manual or handled by hosting platform

## Environment Configuration

**Required env vars:**
- None - Application is fully static with no environment-specific configuration
- No `.env` file or environment variable references in codebase

**Secrets location:**
- Not applicable - No secrets or credentials required for frontend application

## Webhooks & Callbacks

**Incoming:**
- Not applicable - No server to receive webhooks

**Outgoing:**
- Email contact forms - Static links to `mailto:engineering@epsystems.org` in:
  - `src/components/layout/Footer.tsx` - Email link in footer
  - `src/components/sections/Hero.tsx` - Email link in CTA
  - `src/components/sections/CTA.tsx` - Email link in main call-to-action
- No form submission backend - Links open default email client only

## External Resources

**Content Delivery:**
- Google Fonts API - Bricolage Grotesque font family loaded from `https://fonts.googleapis.com` and `https://fonts.gstatic.com`
- Preconnect hints configured in `index.html` for font delivery optimization

## Third-Party Scripts

**Not detected:**
- No analytics scripts (Google Analytics, Mixpanel, etc.)
- No chat/support widgets (Intercom, Drift, etc.)
- No social media SDKs
- No payment processing scripts (Stripe, PayPal, etc.)

---

*Integration audit: 2026-03-24*
