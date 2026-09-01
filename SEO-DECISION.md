# SEO remediation — decisions needed / assumptions made

## 1. Vercel build verification (Phase 1)

The prerender now depends on launching headless Chromium during `npm run build`. Locally this uses puppeteer's Chrome; on Vercel (`VERCEL=1`) it switches to `@sparticuz/chromium` because Vercel's Amazon Linux build image lacks Chrome's shared libraries. That Vercel path cannot be exercised from a Windows dev machine.

**Consequence if it fails:** `scripts/verify-prerender.mjs` (postbuild) fails the build on purpose, so a broken prerender blocks the deploy instead of silently shipping the empty shell again.

**Ask:** push `seo/prerender-and-technical-seo` to trigger a Vercel preview deployment (I have not pushed — that publishes to the remote and starts a build). If the preview build fails in the Chromium launch, the fallback is to bump `@sparticuz/chromium`/`puppeteer` to a matching newer pair or set `PUPPETEER_CACHE_DIR` inside the project so Vercel's build cache keeps the browser.

## 2. `postbuild` gate blocks deploys on any regression (Phase 1)

Assumption made: a build that would reintroduce the single-shell defect should fail rather than deploy. If you would rather deploy-with-warning, change `process.exit(1)` in `scripts/verify-prerender.mjs` to a warning.

## 3. The non-www → www 307 is a Vercel dashboard setting, not `vercel.json` (Phase 3)

Measured 2026-09-01: `https://epsystems.org/bg/pricing` → `307 Temporary Redirect` → `https://www.epsystems.org/bg/pricing`.
`vercel.json` on `origin/main` has carried `permanent: true` (308) for that host redirect since commit 63d3508. A 307 still being served means the redirect is applied *before* the project's `vercel.json`, i.e. it is the domain-level redirect configured in **Vercel → Project → Settings → Domains → `epsystems.org` → "Redirect to www.epsystems.org"**, which defaults to 307.

**Ask (dashboard, 1 minute):** open that domain's redirect setting and change the status code to **308 Permanent** — or remove the domain-level redirect entirely so the `vercel.json` rule (308) takes over. The repo rule is kept either way.

## 4. Production is not deployed from this repository (blocks *every* phase from reaching users)

`origin/main` commit 4ad1190 (2026-08-03, `strategy/alerts/2026-08-03-site-health.md`) found that the Vercel project bound to `epsystems.org` (`ep-systems`, `prj_BiEAhNazAKP6VxB1SaHlzlmG5nEn`) last deployed on **2026-02-01** from a commit that does not exist in `EPSystems/EPSystemsWebsite`; its Git integration points at `EDermendjiev/EPSystems`. Live probes today are consistent with that: the site still serves the 10 KB shell and the pre-May-2026 redirect behaviour.

**Consequence:** merging this branch changes nothing on the public site until the Vercel project is re-pointed at this repository (Settings → Git → connect `EPSystems/EPSystemsWebsite`, production branch `main`) or a deploy is triggered from it. Verifying the `@sparticuz/chromium` build path (item 1) needs the same connection.

**Ask:** reconnect the Vercel project to this repo, then push this branch to get a preview build before merging.

## 5. LocalBusiness is as complete as the published facts allow (Phase 4)

The `#organization` entity is now `Organization + LocalBusiness + ProfessionalService`, but three fields that materially strengthen a local-business entity are missing because the site publishes none of them and I will not invent them:

- **Street address** (`PostalAddress.streetAddress`, `postalCode`) — currently locality-level only ("Sofia, BG").
- **Opening hours** (`openingHoursSpecification`).
- **Founder LinkedIn URLs** (`Person.sameAs`; `src/data/team.ts` has `linkedin: undefined // TODO(A1.8)`).

**Ask:** if you want a Google Business Profile / map-pack presence, provide the address you are willing to publish and the hours; add the founders' LinkedIn URLs to `src/data/team.ts` and the `Person` blocks in `index.html`. Each is a one-line change once the facts exist.

## 6. Blog cover images are generated placeholders (Phase 6)

Every post's frontmatter pointed at a cover (`/blog/*-cover.jpg`) that had never been added, so `og:image`, `twitter:image` and `Article.image` were 404s on all ten posts. `scripts/generate-blog-covers.mjs` now renders a simple branded 1200×630 JPG per post (dark ground, lime accent, post title; BG posts got their own `-bg.jpg` so the title matches the language) and skips any file that already exists.

**Ask:** if you want designed covers, drop JPGs with the same names into `public/blog/` — nothing else changes. Until then the placeholders keep previews and Article rich results valid.

## 7. Performance follow-ups not done in this pass (Phase 6)

Measured after this pass (Lighthouse 12, simulated mobile, local static server): home 81, about 91, service page 81 (was 66 / 64 / 74). What remains is framework weight, not assets:

- **Both locale bundles ship on every page** (bg 110 KB + en 75 KB raw inside the main chunk). Loading only the active language via `i18next-resources-to-backend` would save ~15 KB gzipped per page but changes i18n boot and language switching; left for a dedicated change.
- **`createRoot` re-renders the prerendered DOM on boot.** Switching to `hydrateRoot` would skip that work but requires the client's first render to match the snapshot byte-for-byte (framer-motion initial styles differ). Not attempted.
- **Google Fonts still come from a third-party origin.** Self-hosting the two families would remove a connection but is a design/licensing call.
