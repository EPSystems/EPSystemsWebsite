# E&P Systems — Strategic & Operational Audit

**Date:** 2026-07-06
**Prepared for:** Emil Dermendzhiev, Pavel Stefanov
**Status:** Final — decisions recorded in `DECISIONS.md`, execution plan in `ACTION-PLAN-30-60-90.md`

---

## Ground truth (established facts, not inferences)

- €0 lifetime revenue. All delivered "client work" (Ozonic, Universe Transport, InfinitiStore, ReflexGym) was free builds for friends.
- All three real pitches (Sandex €3,000 e-commerce migration + automation, Five Elements AI audit, FionaSushi) were rejected.
- Ozonic "flagship SEO case study" = a short SEO analysis sent over Viber. No work was ever performed; no traffic growth was caused by E&P.
- Outbound history: 30–40 cold calls offering websites (0% success), 100 cold emails to Spanish gyms (0 replies).
- Warm network (never pitched with a real offer): family businesses in insurance, ISP/TV, accounting, law, logistics, construction, coffee distribution, gym.
- Founders: both full-time at Mercedes-Benz (no contractual side-business constraints). Pavel's commitment currently unequal (franchise of a Sofia brand + meta-ads experience). Emil distracted by house renovation. 10–15 h/week each on paper; recently ~all hours on the surveillance SaaS.
- Surveillance SaaS: 2–3 days of work invested (Python AI pipeline by Pavel, landing/cloud by Emil). Zero conversations with any security firm, fuel station, or warehouse.
- Budget: <€1,000. No paid marketing. No pipeline.
- Goal: replace salary at 3x (≈ €8.1k/month) with location freedom; business as a cash engine for asset building.

## Core diagnosis

**E&P Systems is not yet a business — it is a portfolio plus a set of side bets.** Every hour to date has gone into building (free sites, BizAudit, affiliate portal, own-site repositioning, SaaS pipeline) and almost none into selling to people who can pay. The one deal that reached pricing (Sandex) was quoted ~40–60% below Bulgarian agency market rates and still lost — which means the binding constraint is **trust/proof, not price, not product, not tech stack**. Meanwhile the highest-trust channel available (8+ family business owners) has never been pitched.

The 3x-salary goal is **not reachable part-time with services at Bulgarian rates** (~1,000–1,300 total founder-hours/year vs ~1,700 billable-equivalent hours needed). The goal implies a staged plan: build MRR part-time → full-time transition trigger (recommended: €3.5k MRR sustained 3 months) → scale to €8k+.

---

## 1. Business model & unit economics

**Verdict: incoherent — five service lines, three side bets, zero revenue, ~25 combined part-time hours.**

- Five service lines (AI websites, automation, agents, SEO, e-commerce) is a full-service agency menu that 50-person shops struggle to deliver. For 2 part-time founders it guarantees every project is bespoke, every pitch is generic, and no case study compounds.
- Sandex unit economics: €3,000 for a 2,000-product migration + price/description automation ≈ 120–200 hours ⇒ €15–25/hour, at or below Emil's day-job effective rate (~€17/h), with zero margin for revisions, support, or the sales time to win it. And it still lost — underpricing did not buy the deal.
- Where time actually goes (non-revenue): surveillance SaaS build, own-site repositioning (current repo phase 08), BizAudit, affiliate portal, renovations/franchise. **Revenue-generating activity in the last quarter: ≈ 0 hours.**
- SEO as a standalone line is dead on arrival in this network: "no one pays for SEO" (Emil's own data). Websites are bought and understood. Automation is valuable but needs proof.

**Fix:** collapse to ONE flagship productized offer (ops automation pilot → retainer) + ONE secondary offer (fixed-price lead-gen website with local SEO baked in). Everything else becomes a feature or a custom upsell, not a menu item.

## 2. Market & ICP

- Bulgaria: ~467k SMEs (437k micro) per NSI 2023. Theoretically enormous; realistically, a 2-person part-time team can touch maybe 200–400 businesses/year through warm intros + targeted outbound.
- **Best-fit ICP:** Bulgarian owner-led service SMBs (5–50 staff) in document/ops-heavy verticals — accounting offices, insurance brokers, logistics/freight, construction back-office. Exactly the verticals the family network covers. They have repetitive workflows (invoices, quotes, client onboarding, price monitoring), pay for outcomes not technology, and refer within tight professional communities (e.g., accountants talk to accountants).
- Spanish gyms / "international businesses" as a target with zero case studies and no local presence: unreachable. Drop until there are 3 published Bulgarian case studies.
- Vertical selection mechanism: run 2 paid pilots via family network in 30 days; the vertical that converts and shows measurable hours-saved becomes the niche. Candidates ranked by fit: accounting > insurance brokerage > logistics > construction.

## 3. Competitive landscape

**Agency side — "AI-first automation agency" is already an occupied position in Bulgaria:**
- [Avtomatizirai.bg](https://avtomatizirai.bg/) — n8n workflow automation agency, self-hosted n8n setups.
- [Digital Agent](https://digitalagent.bg/) — n8n **Official Partner**, Anthropic-certified, AI chatbots/voice agents, targets Bulgaria + Balkans.
- [AutoPilot.bg](https://autopilot.bg/) — n8n/Make migrations, positions on cost vs Zapier.
- [Agenciq.ai](https://agenciqai.com/), [Vector Labs](https://vector-labs.ai/bg/expertise/ai-automation) — AI process automation.
- Web dev: crowded (Clutch/TechBehemoths list dozens; corporate site avg ~4,500 BGN, e-commerce €4,500–9,000 per [Ascend](https://ascend.bg/blog/how-much-does-a-website-cost-in-bulgaria)).
- SEO: mature market — Serpact (internationally recognized, Plovdiv), Netpeak BG, plus budget players at €199–350/month.

**Implication:** E&P is currently "just another agency with a nicer brand." The neo-brutalist identity is a tiebreaker, not a differentiator. Real differentiation available to E&P: (a) vertical specialization with **published, real outcome numbers** ("we saved X accounting office 22 h/month, here's the video"), which no BG generalist automation shop has per-vertical; (b) genuine senior engineering depth (automotive-grade, self-hosted/data-private n8n) — credible for regulated verticals like insurance/accounting.

**Surveillance side — incumbents already own the position E&P wants to white-label into:**
- [ASP](https://en.asp-bg.com/) — top-5 BG security firm, 30+ years, national 24/7 monitoring center, **already markets its own AI security solutions**.
- [GSM Security D.A.R.](https://gsmsecurity.bg/) — intelligent video surveillance productized, risk detection + alerting in seconds.
- [V-Guard](https://www.virtual-guard.bg/) — AI+IoT remote video monitoring, 24/7 center.
- Global software available for incumbents to license instead of E&P: SenSen (fuel drive-off + LPR + debt recovery), Petrosoft ($8k+/yr POS-linked video), viAct, icetana, Veesion.

Porter's snapshot applied: buyer power high (consolidated security firms, chain-owned fuel stations with procurement); rivalry high (incumbents have monitoring centers + AI already); E&P's entry barriers severe (SLA/liability for missed detections, on-site camera integration, 24/7 support expectation, 6–12 month B2B sales cycles) — **all incompatible with nights/weekends and <€1,000**.

## 4. Offer & pricing architecture

**Current state: five bespoke lines, no prices, no packages. Every sale requires inventing the offer.**

Recommended productized structure (Bulgarian-language one-pagers, fixed prices):

| Package | Scope | Price | Recurring |
|---|---|---|---|
| **Automation Pilot** (flagship) | Map 1 painful workflow, automate on self-hosted n8n, measure hours saved, 30-day support | €1,200 fixed (list €2,500; founding-client rate) | — |
| **Automation Retainer** | Maintain + extend workflows, monthly report of hours saved | — | €350–600/mo |
| **Lead-Gen Website** | Next.js site, Bulgarian copy, LocalBusiness schema, GBP setup, local SEO baked in | €1,800 fixed | €150/mo care plan |
| Custom (e-commerce migration, agents) | By proposal only, floor €55/effective hour | ≥€4,500 | — |

Rules: never quote below €55/effective-hour equivalent; SEO is never sold standalone (bundled into website package); every pilot contract includes case-study publication rights.

## 5. Sales & delivery process

- Actual historical motion: free work for friends + generic cold outreach. Both leak 100%: friends don't convert to payers (no urgency, no price anchor), and cold generic offers from an unknown 2-person shop convert ~0% everywhere, not just in Bulgaria.
- The Spanish-gym campaign was the worst possible configuration: cold + foreign market + saturated niche + no proof + no local presence.
- The unused channel: 8+ family business owners, each with 3–10 peer contacts in their industry. That is 30–80 warm conversations — worth more than 10,000 cold emails at this stage.
- Leak between signed and repeat/referral: untested (no signed clients), but the pilot→retainer→referral structure above is designed to close it: measurable outcome → monthly report → explicit referral ask at day 60.
- Leading metric to track weekly: **paid-conversation count** (meetings with someone who could sign a contract). Target: 3/week minimum.

## 6. Marketing & positioning + epsystems.org

- The credibility gap is real but the Ozonic problem is worse than the indexation problem: **presenting Ozonic as a "flagship SEO case study with documented organic traffic growth" when no work was performed is a false claim.** If a prospect calls Ozonic's founder, the agency's credibility is dead permanently. Take it down or reframe honestly as "sample SEO audit" this week.
- 4% indexation on an SEO-selling agency's site is embarrassing but is **not the growth lever** — the next 10 clients will come from warm intros, not organic search. Ship the prerender/SSR fix in one time-boxed week (it's already planned), then **freeze all own-site work** including the current repositioning phase. The storefront is being polished while the shop has no foot traffic.
- Positioning after vertical selection: "Автоматизация за счетоводни кантори" (or the winning vertical) beats "AI-first agency for SMBs" in every channel that matters here.

## 7. Strategic bets portfolio

| Bet | Verdict | Reasoning |
|---|---|---|
| Surveillance SaaS (FuelGuard/WarehouseGuard) | **FREEZE — discovery gate** | 2–3 days sunk (cheap to pause). Zero customer conversations. Incumbents (ASP, GSM D.A.R., V-Guard) already have AI + monitoring centers; global software (SenSen, Petrosoft) available to white-label instead of E&P. Liability/SLA/24-7 expectations incompatible with part-time. Gate: 10 discovery conversations (use logistics + construction family contacts for warehouse access) within 30 days, **zero new code**. One signed pilot LOI → re-evaluate. Otherwise kill. |
| Synta acquisition/clone | **KILL** | No cash (<€1,000 vs ~0.9x ARR price), platform risk already self-flagged, pure opportunity cost. |
| Screen Timely, PersonalBrandOS | **STAY DEAD** | Correctly set aside; do not revisit for 12 months. |
| BizAudit / affiliate portal | **FREEZE** | Internal tools for an agency with no clients. BizAudit may be repurposed later as a lead magnet — after first paying clients exist. |

The pattern to break: **serial building as procrastination on selling.** Every new build (SaaS, portal, repositioning) has been a socially acceptable way to avoid rejection. The 0% cold-call rate happened once and outreach stopped; the SaaS started instead.

## 8. Constraints (binding, non-negotiable in planning)

- Real combined capacity near-term: ~15–25 h/week (renovation + franchise erosion). Plans below assume 20 h/week combined.
- <€1,000 budget: no paid ads until first revenue; all channels must be free (warm network, walk-ins, LinkedIn/Viber, communities).
- Pavel asymmetry must be formalized, not wished away: either committed hours + owned role (outreach + meta ads later), or an equity structure that reflects contribution (vesting / dynamic split). A 50/50 static split with asymmetric effort is the most common founder-breakup cause.
- Full-time transition trigger (proposed): €3,500 MRR sustained 3 consecutive months → Emil goes full-time; goal of €8.1k/month is a 24–36 month path part-time, compressible to ~18 months with the full-time transition.

---

## Inferences vs. data (flagged per request)

Working from **your data**: all figures in "Ground truth" above. **Inferred/researched, verify before betting on them:** Bulgarian pricing norms (web-sourced, July 2026); Sandex effort estimate (120–200 h); SME counts (NSI 2023, latest found); competitor capabilities (from their own marketing sites — may overstate); accounting-vertical pain intensity (pattern-matched from n8n/LLM automation demand elsewhere, not validated in BG — the 2-pilot sprint validates it); the €3.5k MRR full-time trigger (judgment call, adjust to your savings).

## Sources

- [Ascend — website cost in Bulgaria](https://ascend.bg/blog/how-much-does-a-website-cost-in-bulgaria) · [Studio New Era pricing guide](https://studionewera.com/en/kolko-struva-sazdavaneto-na-profesionalen-uebsajt-v-balgariya-prez-2025/) · [Clutch BG web designers](https://clutch.co/bg/web-designers)
- [Avtomatizirai.bg](https://avtomatizirai.bg/) · [Digital Agent](https://digitalagent.bg/) · [AutoPilot.bg](https://autopilot.bg/uslugi/avtomatizacia-n8n) · [Agenciq.ai](https://agenciqai.com/) · [Vector Labs](https://vector-labs.ai/bg/expertise/ai-automation)
- [Serpact](https://serpact.com/) · [MySEO pricing](https://myseo.bg/seo-%D1%86%D0%B5%D0%BD%D0%B8/) · [StudioMax SEO prices 2026](https://studiomax.bg/blog/kolko-struva-seo-optimizaciyata-ceni-2026/)
- [ASP Security](https://en.asp-bg.com/) · [ASP AI services](https://en.asp-bg.com/innovative-ai-security-services-bulgaria/) · [GSM Security](https://gsmsecurity.bg/) · [V-Guard](https://www.virtual-guard.bg/)
- [SenSen fuel theft prevention](https://sensen.ai/fuel-theft-prevention/) · [Petrosoft](https://petrosoftinc.com/optimize-gas-stations/)
- [NSI enterprise counts](https://www.nsi.bg/statistical-data/372/1066) · [Forbes Bulgaria on SMEs](https://forbesbulgaria.com/2025/02/14/msp-v-balgariya-naj-mnogo-i-s-naj-golemi-problemi/)
