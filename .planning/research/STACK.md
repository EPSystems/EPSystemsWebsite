# Stack Research

**Domain:** Bilingual i18n + routing for existing React SPA
**Researched:** 2026-03-24 (v1.0), updated 2026-03-25 (v1.1 forms)
**Confidence:** HIGH

---

## v1.0 Stack (Established -- Already Installed)

### Core Technologies

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| react-router-dom | 7.13.2 | Client-side routing with language-prefixed URLs | Installed |
| i18next | 25.10.9 | Translation engine | Installed |
| react-i18next | 16.6.6 | React bindings for i18next | Installed |
| framer-motion | 12.38.0 | Scroll-triggered animations | Installed |
| lucide-react | 1.5.0 | Icon library | Installed |

---

## v1.1 Stack Addition: Contact Form Backend

### Recommendation: Web3Forms

**Use Web3Forms because** it offers 5x more free submissions than Formspree (250 vs 50/month), requires zero npm packages (plain fetch POST), needs only an email to get an access key, and has first-class React documentation with proven integration patterns. For a low-traffic agency landing page, 250 submissions/month is effectively unlimited.

### Comparison Matrix

| Criterion | Web3Forms | Formspree | Static Forms | Getform/Forminit |
|-----------|-----------|-----------|--------------|------------------|
| **Free submissions/month** | 250 | 50 | ~500 | 25-50 |
| **Signup required** | Email only (for access key) | Account required | Account required | Account required |
| **npm package needed** | No (optional plugin exists) | No | No | No |
| **Integration method** | POST JSON to API | POST to form endpoint | POST to API | POST to endpoint |
| **Spam protection** | Built-in botcheck + hCaptcha option | reCAPTCHA | reCAPTCHA v2 | Basic |
| **Custom subject line** | Yes (free) | Yes | Yes | Yes |
| **Custom redirect** | Yes (free) | Paid only | Unknown | Yes |
| **File uploads (free)** | No | No | No (Pro only) | No |
| **Submission storage** | 30 days | 30 days | Unknown | Limited |
| **Email notifications** | Yes | Yes | Yes | Yes |
| **React documentation** | Excellent (official guides) | Good | Minimal | Minimal |
| **Confidence level** | HIGH | HIGH | MEDIUM | LOW |

### Why NOT the Alternatives

| Service | Why Not |
|---------|---------|
| **Formspree** | Only 50 submissions/month free -- too restrictive even for low traffic. First paid tier is $15/month, violating zero-cost constraint. |
| **Static Forms** | Higher free limit (~500/mo) but less React documentation, newer service, less community adoption. Acceptable fallback if Web3Forms changes terms. |
| **Getform/Forminit** | Rebranded to Forminit in Jan 2026 (instability signal), only 25-50 free submissions, least generous free tier. |
| **Netlify Forms** | Only works on Netlify hosting. Locks deployment platform. 100 submissions/month free. |
| **EmailJS** | 200/month free but exposes email service credentials client-side. More complex setup with template IDs and service IDs. |
| **Formcarry** | 100 submissions/month free, less documentation, smaller community. |
| **Self-hosted (EasyForm, etc.)** | Requires a server -- violates static-only deployment constraint. |
| **`@web3forms/react` plugin** | Unnecessary wrapper around a single fetch call. Adds an npm dependency for zero benefit on a 4-field form. Use native fetch instead. |
| **react-hook-form** | Overkill. One form with 4 visible fields + 1 hidden context field. Native controlled inputs with useState are simpler and zero-dependency. |
| **formik** | Same reasoning as react-hook-form -- unnecessary complexity for a simple contact form. |
| **yup / zod** | Client-side validation for Name/Email/Phone/Notes does not warrant a schema validation library. Inline validation is sufficient. |

### Form Backend Service

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Web3Forms API | Current | Form submission endpoint | 250 free submissions/month, JSON POST API, zero npm dependencies, built-in spam protection, CORS-enabled for any domain |

### Form Handling (Client-Side) -- Zero New Dependencies

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Native fetch API | N/A | HTTP POST to Web3Forms | Zero dependencies. A single async function. |
| React useState | N/A | Form state, loading/success/error states | Already available in React 19. No external state library needed. |
| Inline validation | N/A | Required fields, email format check | 4 fields do not justify a validation library. |

### Integration Pattern

**API Endpoint:**
```
POST https://api.web3forms.com/submit
Content-Type: application/json
```

**Request body:**
```json
{
  "access_key": "YOUR_ACCESS_KEY",
  "name": "User Name",
  "email": "user@example.com",
  "phone": "+359 888 123 456",
  "message": "User's notes",
  "subject": "SEO Inquiry",
  "from_name": "E&P Systems Website",
  "botcheck": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Key implementation details:**

1. **Access key**: Get from web3forms.com (free, email-only signup). Store as `VITE_WEB3FORMS_KEY` environment variable -- this is a public API key (not a secret), safe to embed in client bundle at build time.

2. **Hidden context field**: Each CTA passes a different `subject` value so the agency knows which page/service generated the lead:
   - Hero CTA: "General Inquiry"
   - SEO service page: "SEO Inquiry"
   - E-Commerce service page: "E-Commerce Inquiry"
   - AI service page: "AI Solutions Inquiry"
   - Custom Software page: "Custom Software Inquiry"
   - Navbar contact button: "General Contact"

3. **Spam protection**: Include a hidden `botcheck` checkbox field (CSS `display: none`). Bots fill hidden fields; humans cannot see them. Web3Forms validates this server-side.

4. **Bilingual labels**: Form field labels, placeholders, validation messages, and success/error text come from react-i18next translation JSON files. The `subject` field stays English for internal lead routing consistency.

5. **No CORS issues**: Web3Forms API allows cross-origin requests from any domain. No proxy, backend, or hosting-specific config needed.

### Free Tier Sustainability

| Concern | Assessment |
|---------|------------|
| **250 submissions/month sufficient?** | Yes. An agency landing page receiving 250+ form submissions/month would be an exceptional success problem. At that volume, upgrading to Pro (~$10/mo) is trivially justified by client acquisition ROI. |
| **Service reliability** | Web3Forms has operated since ~2020, widely used in the static site community. Low risk of sudden shutdown. |
| **Vendor lock-in risk** | Minimal. Integration is a single fetch POST. Switching to Formspree or any other service means changing one URL and the request body shape -- a 30-minute migration. |
| **Data retention** | 30 days on free tier. Email notifications serve as the primary record. For an agency contact form, leads are acted on immediately, not archived long-term. |
| **Rate limiting** | Warning email at 90% of monthly limit. Submissions pause at 100% until next billing cycle. No overage charges. |

## Installation

```bash
# v1.1 forms milestone: NO new npm packages needed.
# Web3Forms works with native fetch -- zero dependencies to add.
```

**Setup steps:**

1. Go to https://web3forms.com/ and enter the target email (e.g., engineering@epsystems.org)
2. Receive access key via email
3. Create `.env` file with `VITE_WEB3FORMS_KEY=your-access-key-here`
4. Ensure `.env` is in `.gitignore`
5. Build ContactForm component that POSTs to the API

## Sources

### v1.1 Form Backend Research

- [Web3Forms Official Site](https://web3forms.com/) -- MEDIUM confidence (403 on pricing page, details corroborated by multiple search results)
- [Web3Forms React Hook Form Integration](https://docs.web3forms.com/how-to-guides/js-frameworks/react-js/react-js) -- HIGH confidence (fetched and verified: endpoint, body shape, response format)
- [Web3Forms React Plugin on npm](https://www.npmjs.com/package/@web3forms/react) -- MEDIUM confidence
- [Formspree Pricing Page](https://formspree.io/plans) -- HIGH confidence (fetched: 50 submissions/month free, $15/mo personal tier)
- [Formspree Account Limits](https://help.formspree.io/hc/en-us/articles/47605896654227-Account-limits) -- HIGH confidence
- [Static Forms FAQ](https://www.staticforms.dev/faq) -- MEDIUM confidence (exact free limit not in FAQ, ~500/mo from comparison articles)
- [Getform/Forminit Pricing](https://getform.io/pricing) -- LOW confidence (Jan 2026 rebrand complicates verification)
- [DEV Community: Netlify Forms Alternatives 2026](https://dev.to/allenarduino/netlify-forms-is-getting-expensive-here-are-the-best-alternatives-in-2026-3a7k) -- LOW confidence (community article, useful for landscape overview)
- [DEV Community: Getform Alternatives 2026](https://dev.to/allenarduino/getform-alternatives-in-2026-cheaper-open-source-and-self-hostable-5h62) -- LOW confidence

### v1.0 Stack Research (Prior)

- [React Router v7 Modes Documentation](https://reactrouter.com/start/modes) -- HIGH confidence
- [npm registry](https://www.npmjs.com/) -- HIGH confidence
- [i18next Comparison to Others](https://www.i18next.com/overview/comparison-to-others) -- HIGH confidence

---
*Stack research updated: 2026-03-25 for v1.1 CTA Forms milestone*
