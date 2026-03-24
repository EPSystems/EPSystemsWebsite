# Feature Research

**Domain:** Bilingual software agency landing page / marketing website
**Researched:** 2026-03-24
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume a credible software agency website has. Missing these causes prospects to leave or lose trust.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear hero with value proposition and CTA | First thing visitors see; must communicate what the agency does and why in under 5 seconds | LOW | Already exists. Needs content polish and bilingual support |
| Service pages with dedicated URLs | Prospects share service links, Google indexes them, each service needs its own SEO surface area | MEDIUM | Currently anchor-scroll only. Requires routing (React Router) and per-service page components |
| Case studies / portfolio with results | #1 trust signal for agencies. Prospects need proof you deliver. Show challenge, solution, outcome | MEDIUM | Exists as a section. Needs real content with measurable outcomes, not just project names |
| Contact section with clear CTA | Visitors must know how to reach you without hunting. Email, phone, or form prominently displayed | LOW | Exists. Currently a CTA block. Needs real contact info (email, phone) visible |
| Mobile-responsive design | Over 60% of traffic is mobile. Non-responsive = immediate bounce | LOW | Already responsive via Tailwind. Verify all new pages maintain this |
| Fast load times (LCP under 2.5s) | 53% of mobile users abandon pages over 3 seconds. Also a direct SEO ranking factor | LOW | Static SPA with Vite should meet this. Monitor after adding images/content |
| Professional navigation with logical page structure | Visitors need to orient themselves instantly. Confusing nav = amateur impression | LOW | Navbar exists. Needs update for multi-page routing and language switcher |
| Footer with sitemap, contact details, social links | Industry standard. Missing footer info makes agencies look fly-by-night | LOW | Exists. Needs real social links and bilingual content |
| About / Team page | Clients hire people, not logos. Faces and bios build trust, especially for a smaller agency | MEDIUM | Not yet built. Needs team member profiles with photos, roles, short bios |
| Bilingual content (EN/BG) with language switcher | Agency serves Bulgarian market. Bulgarian visitors expect native language. English for international reach | HIGH | Core requirement. Needs i18n system, all content translated, persistent language preference |
| SSL / HTTPS | Browser warnings on non-HTTPS sites destroy trust instantly | LOW | Deployment concern, not code. Ensure hosting provider has SSL |
| Accessibility basics | Screen reader support, keyboard navigation, color contrast. Legal requirements in EU (European Accessibility Act 2025) | MEDIUM | Needs audit. Add alt text, ARIA labels, semantic HTML, focus indicators |

### Differentiators (Competitive Advantage)

Features that set E&P Systems apart from generic agency sites. Not required but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Brutalist design system | Distinctive visual identity that stands out from cookie-cutter agency templates. Memorable first impression | LOW | Already exists and is a strength. Maintain consistency across new pages |
| Scroll-triggered animations | Creates polished, premium feel. Shows the agency practices what it preaches (good UX) | LOW | Already implemented via Framer Motion. Extend to new pages/sections |
| Interactive process/methodology section | Shows clients how you work, not just what you deliver. Builds confidence in your approach | MEDIUM | Not built. Could be a visual timeline or step-by-step workflow diagram |
| Technology stack showcase | Technical prospects (CTOs, tech leads) want to see what you build with. Demonstrates competence | LOW | Simple grid of tech logos with labels. Quick win |
| Client logo bar / trust badges | Social proof shortcut. Recognizable logos = instant credibility | LOW | Not built. Add when real client logos are available |
| Results-oriented case study format | "We increased X by Y%" is far more compelling than "We built a website" | MEDIUM | Restructure existing case studies around metrics: challenge, solution, measurable result |
| SEO-optimized service pages | Individual service pages rank for specific search terms ("web development Bulgaria", "SEO agency Sofia") | MEDIUM | Requires routing + unique meta tags per page. Major SEO benefit for local search |
| Micro-interactions on service cards | Hover effects, icon animations that reinforce the Brutalist aesthetic. Shows craft | LOW | Partially exists (brutalist-shadow hover). Can enhance with more intentional micro-interactions |
| Smooth page transitions | Route transitions with Framer Motion create app-like polish | MEDIUM | Needs AnimatePresence wrapper around route outlet. Worth it for premium feel |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for a static agency site at this stage.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Blog / content section | "Agencies need blogs for SEO" | Requires ongoing content commitment. Empty or stale blog is worse than no blog. Creates maintenance burden with no CMS | Defer entirely. Focus on static service pages with good copy. Add blog in v2 only if there is a content strategy and commitment to publish |
| Live chat / chatbot | "Clients expect instant responses" | Requires backend service, ongoing monitoring, or AI integration. Broken/unresponsive chat is worse than no chat | Clear contact email and phone number. Fast response to inquiries matters more than chat widget |
| Contact form with email delivery | "Forms are standard" | Requires backend (serverless function, email API), spam filtering, error handling. Complexity for a static site | Simple mailto link or prominent email/phone. Add form in later milestone with proper backend |
| CMS / admin panel | "Non-devs should edit content" | Massive scope increase. Content changes are infrequent for a small agency. Over-engineering for the current need | Content lives in code (translation JSON files). Devs update directly. Revisit only if non-technical team members need to edit frequently |
| Pricing page | "Clients want to see prices" | Custom software agencies rarely have fixed pricing. Showing prices either undervalues your work or scares prospects away | "Let's discuss your project" approach. Guide prospects to conversation, not price comparison |
| Animations on everything | "More animation = more premium" | Excessive animation causes motion sickness (vestibular disorders), hurts performance, distracts from content | Use animations strategically: entrance animations on scroll, hover micro-interactions. Respect prefers-reduced-motion media query |
| Multi-language beyond EN/BG | "Future-proof for more languages" | Over-engineering i18n for hypothetical languages adds complexity now. Two languages is manageable; five requires different architecture | Build i18n system that supports adding languages later, but only implement EN and BG now |
| Single-page app with hash navigation (current) | "Simpler than routing" | Kills SEO for individual services. URLs not shareable. Browser back button behavior is broken | Migrate to React Router with proper routes. Essential for multi-page structure |

## Feature Dependencies

```
[Bilingual Support (i18n system)]
    └──requires──> [Translation JSON files / content structure]
    └──requires──> [Language switcher in Navbar]
    └──enhances──> [SEO-optimized service pages] (hreflang tags)

[Dedicated Service Pages]
    └──requires──> [React Router setup]
    └──requires──> [Page layout component]
    └──enhances──> [SEO optimization] (unique meta per page)

[React Router]
    └──requires──> [Route definitions]
    └──enables──> [Dedicated Service Pages]
    └──enables──> [Team/About Page]
    └──enables──> [Page transitions]

[Team/About Page]
    └──requires──> [React Router]
    └──requires──> [Team member data/content]
    └──requires──> [Bilingual content for bios]

[Page Transitions]
    └──requires──> [React Router]
    └──requires──> [Framer Motion AnimatePresence]

[Accessibility Audit]
    └──independent (can happen any time)
    └──enhances──> [All pages and components]

[SEO Optimization]
    └──requires──> [Dedicated Service Pages]
    └──requires──> [Bilingual Support] (for hreflang)
    └──enhanced-by──> [React Helmet or equivalent for meta tags]
```

### Dependency Notes

- **Dedicated Service Pages require React Router:** Cannot have individual URLs without a routing solution. This is the foundational change that enables multi-page architecture.
- **Bilingual Support requires content structure first:** The i18n system needs organized translation files before the language switcher can work. Design the content structure before implementing the switcher.
- **Team Page requires both Router and bilingual content:** Cannot build the team page without routing (needs its own URL) and translations (names, roles, bios in both languages).
- **SEO optimization is most effective after routing + i18n:** Meta tags, hreflang, and page-specific SEO require the routing and bilingual systems to be in place first.

## MVP Definition

### Launch With (v1)

Minimum viable bilingual agency website that builds credibility.

- [ ] React Router with multi-page structure -- foundational for everything else
- [ ] Bilingual i18n system with EN/BG translations and language switcher -- core project requirement
- [ ] Dedicated service pages with unique URLs and real content -- SEO and shareability
- [ ] Team/About page with member profiles -- trust building, clients hire people
- [ ] Updated case studies with real outcomes -- proof of delivery
- [ ] All placeholder links fixed and functional -- broken links destroy credibility
- [ ] Accessibility basics (alt text, semantic HTML, focus styles) -- legal compliance and professionalism

### Add After Validation (v1.x)

Features to add once the core site is live and generating traffic.

- [ ] Contact form with email delivery -- add when backend solution is chosen (Formspree, serverless function)
- [ ] Client logo bar -- add when permission is secured from actual clients
- [ ] Interactive process/methodology section -- add when agency has codified its workflow
- [ ] Page transition animations -- polish layer, add after core content is solid
- [ ] Performance optimization (image lazy loading, code splitting per route) -- optimize based on real Lighthouse scores

### Future Consideration (v2+)

Features to defer until the site is established and traffic warrants investment.

- [ ] Blog/Insights section -- only with committed content strategy and publishing cadence
- [ ] Live chat or chatbot -- only if inquiry volume justifies it
- [ ] CMS integration -- only if non-developers need to edit content frequently
- [ ] Additional languages beyond EN/BG -- only if expanding to new markets

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| React Router (multi-page) | HIGH | MEDIUM | P1 |
| Bilingual i18n (EN/BG) | HIGH | HIGH | P1 |
| Language switcher in Navbar | HIGH | LOW | P1 |
| Dedicated service pages | HIGH | MEDIUM | P1 |
| Team/About page | HIGH | MEDIUM | P1 |
| Fix broken/placeholder links | HIGH | LOW | P1 |
| Updated case study content | HIGH | LOW | P1 |
| Accessibility basics | MEDIUM | MEDIUM | P1 |
| SEO meta tags per page | MEDIUM | LOW | P2 |
| Technology stack showcase | MEDIUM | LOW | P2 |
| Client logo bar | MEDIUM | LOW | P2 |
| Interactive methodology section | MEDIUM | MEDIUM | P2 |
| Page transition animations | LOW | MEDIUM | P2 |
| Contact form with email | MEDIUM | MEDIUM | P3 |
| Blog section | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch -- without these the site is incomplete
- P2: Should have, add when possible -- polish and competitive advantage
- P3: Nice to have, future consideration -- only with clear justification

## Competitor Feature Analysis

| Feature | Typical Small Agency | Top-tier Agency | E&P Systems Approach |
|---------|---------------------|-----------------|---------------------|
| Hero section | Generic stock photo + tagline | Custom illustration/video + sharp value prop | Bold Brutalist design with custom illustration (existing strength) |
| Service pages | Single page with anchors | Dedicated pages with detailed content | Migrate to dedicated pages with routing (P1) |
| Case studies | Screenshot + paragraph | Full case study with metrics, process, results | Restructure existing around outcomes (P1) |
| Team page | Grid of headshots | Detailed bios with personality | Build with photos, roles, bios in EN/BG (P1) |
| Bilingual | Rarely done well; often Google Translate widget | Proper i18n with native translations | Proper i18n with react-i18next or similar (P1) |
| Contact | Basic form | Multiple paths (form, Calendly, chat) | Start with prominent email/phone, add form in v1.x |
| Blog | Often started, rarely maintained | Regular publishing with real insights | Explicitly defer. Empty blog hurts more than no blog |
| Design | Template-based, generic | Custom, distinctive, memorable | Brutalist system is already distinctive (existing strength) |
| Performance | Often slow (WordPress, heavy images) | Optimized, fast loading | Static SPA with Vite gives inherent speed advantage |
| Accessibility | Usually ignored | WCAG AA compliance | Basic compliance as P1, full audit as P2 |

## Sources

- [Caffeine Marketing: Top Software Development Landing Pages](https://www.caffeinemarketing.com/blog/top-15-software-development-landing-page-designs) -- landing page patterns and essential elements
- [Caffeine Marketing: Best Software Development Website Examples](https://www.caffeinemarketing.com/blog/16-best-software-development-website-examples) -- effective agency website patterns
- [Directive Consulting: B2B Website Best Practices 2026](https://directiveconsulting.com/blog/15-b2b-website-best-practices-for-2026-built-for-buyers-not-just-browsers/) -- conversion optimization and trust signals
- [Grafit Agency: High-Performing B2B Website 2026](https://www.grafit.agency/blog/best-practices-for-building-a-high-performing-b2b-website-in-2026) -- performance and design best practices
- [SlashExperts: Website Trust Signals 2025](https://www.slashexperts.com/post/website-trust-signals-the-hidden-elements-costing-you-sales) -- trust signal effectiveness data
- [Code Conspirators: Trust Signals for Professional Services](https://www.codeconspirators.com/the-7-trust-signals-missing-from-most-professional-service-websites-with-examples/) -- agency-specific trust signals
- [i18next Best Practices](https://www.i18next.com/principles/best-practices) -- i18n implementation patterns
- [Locize: Website Internationalization Best Practices](https://www.locize.com/blog/website-internationalization-best-practices/) -- bilingual website patterns
- [Evil Martians: 100 Dev Tool Landing Pages Study](https://evilmartians.com/chronicles/we-studied-100-devtool-landing-pages-here-is-what-actually-works-in-2025) -- data-driven landing page analysis

---
*Feature research for: Bilingual software agency landing page*
*Researched: 2026-03-24*
