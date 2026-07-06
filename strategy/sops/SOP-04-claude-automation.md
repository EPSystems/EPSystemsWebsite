# SOP-04 — Claude Automation Layer

What runs automatically, what to run on demand, and the rules that keep automation from becoming another distraction. Manage routines at https://claude.ai/code/routines.

## Scheduled routines (cloud agents, run without anyone at a keyboard)

**1. EP Weekly Review Prep** — Sundays ~08:00 Sofia (05:00 UTC) · `trig_01T9jVU8FGvoWMrBAyAMivMt`
Reads `strategy/crm/pipeline.csv` + the decision log, and commits a draft agenda to `strategy/reviews/<date>.md`: pipeline snapshot by stage, stale rows with missing/past next steps, movement since last review, upcoming decision gates (Pavel agreement 2026-07-20, day-30 pilots 2026-08-05, day-60 surveillance 2026-09-04), and the SOP-01 hard-rule warning when zero meetings are in motion. The Sunday review (SOP-01) starts from this file — founders fill in decisions, commitments, and money.
**Depends on the tracker being maintained (SOP-02 step 1). Garbage in, garbage agenda out.**

**2. EP Site Health Check** — Mondays ~09:00 Sofia (06:00 UTC) · `trig_01XMfdMjJec9Q11e9MWGpxeB`
Curl-checks epsystems.org: HTTP status, title/meta description, noindex, robots.txt, sitemap validity + 3 sampled URLs, latest Vercel production deployment status. Also reports whether raw HTML contains real content — the tracker for the D-006 prerender fix going live. Quiet when healthy; on a critical failure (site down, noindex, broken sitemap, failed deploy) it commits an alert to `strategy/alerts/` so it's impossible to miss.

## On-demand tasks (run in a Claude Code session when the event happens)

| Trigger | Ask Claude to... |
|---|---|
| After a discovery meeting | "Draft the one-page proposal per SOP-02 from these notes: [paste]" — then send within 48h |
| During pilot delivery | "Draft the case study per SOP-03 template from these delivery notes + baseline numbers" |
| Day 61–90 outbound sprint | "Build the 50-contact list for [vertical] in Sofia/Plovdiv" — the **Vibe Prospecting** connector is available for company research/enrichment |
| Before sending any quote | "Sanity-check this quote against the D-003 pricing floor (€55/effective hour)" |
| Monthly | "Sweep pipeline.csv: flag dead rows to archive and quarterly re-touch candidates" |

## Rules

1. Routines produce **documents and alerts only** — they never touch site source code (D-006: own-site work is frozen).
2. No new routines without a Sunday-review decision. Automation of the business must not become the new way of avoiding sales conversations.
3. If a routine misfires or spams, disable it at https://claude.ai/code/routines and note it for the Sunday review.
4. Both routines run on `claude-sonnet-5` in the Default cloud environment against the GitHub repo — they see pushed commits only, so **push the tracker after updating it**.
