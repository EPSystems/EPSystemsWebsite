# Site Health Alert — 2026-08-03

## Critical: production deploy appears stale / disconnected from this repo

**Vercel project:** `ep-systems` (`prj_BiEAhNazAKP6VxB1SaHlzlmG5nEn`), domains include
`epsystems.org` and `www.epsystems.org`, framework `vite`. Project field `live: false`.

**Latest production deployment:**
- id `dpl_2bemWCJTtMERMecqGhpzdDqzCDfw`, state `READY`, target `production`
- created `2026-02-01 18:15 UTC` — **~6 months old**
- commit `4a5340e9574aec12103a1ec4a434b2a6ee8fa265`, message "feat: Introduce a
  comprehensive agent system with new skills, agents, workflows, UI/UX data, and
  configuration."
- deployment metadata attributes this commit to GitHub repo `EDermendjiev/EPSystems`
  (personal account, repo id `1100734760`)

**Verification against this repo (`epsystems/epsystemswebsite`):**
- `mcp__github__get_commit` for SHA `4a5340e9574aec12103a1ec4a434b2a6ee8fa265` returns
  `422 No commit found` — this commit does not exist in `epsystems/epsystemswebsite`.
- This repo has ~60 commits after 2026-02-01, including substantive site changes:
  - `63d3508` (2026-05-03) SEO canonicalization to www, schema hardening, llms.txt
  - `71df3a1` (2026-05-03) GA4 with Consent Mode v2
  - `304c090` (2026-07-06) retire fabricated Ozonic case study (D-004)
  - the D-006 prerender/indexation fix (accepted 2026-07-06, strategy/DECISIONS.md)

**Conclusion:** the Vercel project bound to the `epsystems.org` domain is not
serving a build of this repository. Either the Git integration on that Vercel
project points at the wrong/legacy source, or production deploys have stopped
triggering from pushes to `epsystems/epsystemswebsite`. Everything shipped in this
repo since Feb 2026 — including the D-006 prerender fix — may not be live on the
public site. Needs manual check in the Vercel dashboard of the project's connected
Git repository and deploy hooks.

## Checks that could not run: outbound network blocked

This sandbox's network policy rejected all outbound HTTPS to `epsystems.org`
(curl CONNECT → 403 "policy denial or upstream failure"; WebFetch → 403 via the
same path). So checks 1–4 (homepage status/latency, raw-HTML content/SEO tags,
robots.txt, sitemap.xml + sample URLs) could not be executed this run and are
**inconclusive**, not confirmed-passing. This is an environment/tooling gap, not
evidence the live site itself is down.

## Evidence
- Vercel `list_deployments` for `prj_BiEAhNazAKP6VxB1SaHlzlmG5nEn`: all 8 returned
  deployments show `state: READY`, none failed; the newest is the Feb 2026 one above.
- Proxy status endpoint confirmed policy-level rejection, not a DNS/TLS failure.
