# Phase 3: Full Content Translation - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Translate every visible string on the existing site to Bulgarian. This includes Hero, Services grid, ServiceDetail sections, Case Studies, CTA, Marquee, and all data-driven content in services.ts. Also add dynamic page titles and meta descriptions per language. Content review to ensure nothing is placeholder text.

</domain>

<decisions>
## Implementation Decisions

### Translation approach
- Claude drafts all Bulgarian translations
- User reviews during verification checkpoint
- "Е-Комерс" must be "Онлайн магазин" everywhere (already fixed in nav/footer)

### Content scope
- All JSX hardcoded strings → t() calls with translation keys
- services.ts data (titles, descriptions, features) → translated via i18n
- Case study content → translated
- Marquee text → translated
- Hero section (heading, subheading, CTA labels) → translated
- CTA section → translated
- index.html title and meta description → dynamic per language

### Claude's Discretion
- Translation file organization (single file vs namespace splitting)
- How to handle services.ts data translation (inline t() vs separate data structure)
- Meta tag implementation approach (react-helmet-async or manual DOM manipulation)
- Exact Bulgarian phrasing (user will review)

</decisions>

<specifics>
## Specific Ideas

- Use "Онлайн магазин" not "Е-Комерс" for e-commerce references
- Bulgarian translations should sound natural, not mechanical/literal

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-full-content-translation*
*Context gathered: 2026-03-25*
