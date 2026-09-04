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

## 1a. Update — the Vercel build path is now reproduced and fixed (post-loop)

Pushing the branch showed this repo *is* linked to a Vercel project (`ep-systems-website`, team `epsystems-projects` — a different project from `ep-systems`, which serves the domain from the personal repo). Its preview build for 05452b5 **failed**. Reproduced in Docker (node:22 + the same install/build) and fixed:

1. **Stale `pnpm-lock.yaml`.** The repo carries both lockfiles; Vercel builds with pnpm and `--frozen-lockfile`, and `pnpm-lock.yaml` predated every new dependency. Regenerated with pnpm 9 (lockfile only). `pnpm.overrides.puppeteer` mirrors the npm override — without it pnpm would nest `puppeteer@1.x` under the prerender plugin, which cannot drive Chromium 127.
2. **`@sparticuz/chromium` only unpacks its bundled shared libraries inside an AWS Lambda Node 20 runtime.** On any other Linux host (Vercel's build container included) the launch died with `libnss3.so: cannot open shared object file`. `vite.config.ts` now sets the runtime hint on Linux so the al2023 library bundle is extracted and put on `LD_LIBRARY_PATH`.

Verified in Docker (Debian, pnpm 9.15.9, `VERCEL=1`): frozen-lockfile install OK, 60 routes prerendered, gate OK. The next push re-triggers the Vercel preview build; its status is visible on the commit in GitHub.

**Still yours:** the production domain is served by project `ep-systems` (linked to `EDermendjiev/EPSystems`). Either point that project at this repo, or move the domains to `ep-systems-website`.

## 1b. Update — §1a's fix was incomplete; corrected and re-verified (post-merge)

§1a claimed the Vercel Chromium path was "reproduced and fixed". It was not. The
runtime hint was applied only when `AWS_EXECUTION_ENV` was unset, and Vercel's build
container sets it to a non-Lambda value — so the hint was skipped, `@sparticuz/chromium`
unpacked no shared libraries, and the merged build failed with the same
`libnss3.so: cannot open shared object file`. The §1a Docker check passed only because
`node:22` (Debian) leaves `AWS_EXECUTION_ENV` unset.

Corrected in `vite.config.ts` (unconditional hint, deterministic al2023 selection,
`LD_LIBRARY_PATH` re-asserted, pre-launch assertion + env diagnostic) and re-verified on
`amazonlinux:2023` under `VERCEL=1` **with** a non-Lambda `AWS_EXECUTION_ENV`: install OK,
60 routes prerendered, gate OK, `BUILD_EXIT=0`. Detail and the three-case table are in
`SEO-PROGRESS.md`.

**Still yours:** push so the Vercel build re-runs. The build log will now carry a
`[prerender] chromium=… libs=… env={…}` line — that line reports Vercel's actual
`AWS_EXECUTION_ENV` value, which is worth reading once even on a green build.

**Unchanged from §4:** the production domain is still served by project `ep-systems`
(Vercel team `edermendjievs-projects`, linked to `EDermendjiev/EPSystems`), whose last
deployment is `dpl_2bemWCJTtMERMecqGhpzdDqzCDfw`, 2026-02-01, from a commit not in this
repository — confirmed again today via the Vercel API. Nothing in this branch reaches
epsystems.org until that project is re-pointed at `EPSystems/EPSystemsWebsite` or the
domains move to `ep-systems-website`.
