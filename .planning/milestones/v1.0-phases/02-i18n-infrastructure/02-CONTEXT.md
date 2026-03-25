# Phase 2: i18n Infrastructure - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up react-i18next with JSON translation files for English and Bulgarian. Implement a language switcher in the navbar. Translate navbar and footer content as proof that the full pipeline works. Verify Cyrillic font support for Bricolage Grotesque. Update navbar to support multi-page routing from Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Language switcher design
- Text toggle format: "EN / BG" (not flags, not dropdown)
- Simple, minimal — fits the Brutalist aesthetic
- Current language should be visually distinguished from the inactive one

### Translation authorship
- Claude drafts Bulgarian translations for nav/footer content
- User reviews and corrects as needed during verification

### Claude's Discretion
- Switcher placement in navbar (before or after CTA, wherever fits best)
- Mobile menu behavior for the switcher (inside menu vs always visible)
- Active language indicator styling (bold, underline, lime accent — whatever fits Brutalist design)
- Cyrillic font fallback strategy if Bricolage Grotesque doesn't support it
- Translation file structure and namespace organization
- Exact scope boundary between Phase 2 (nav/footer only) and Phase 3 (all content)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User wants a clean, minimal text toggle that doesn't distract from the main navigation.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-i18n-infrastructure*
*Context gathered: 2026-03-24*
