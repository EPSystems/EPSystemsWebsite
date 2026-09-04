// Post-build gate: fail the build if prerendering silently produced the bare
// SPA shell instead of real per-route HTML, or if per-route <head> data is
// missing / duplicated / inconsistent.
//
// Why this exists: vite-plugin-prerender swallows renderer errors (it logs
// "Unable to prerender all routes!" and resolves), so a Chrome launch failure
// on the build machine would ship the exact defect this repo is fixing —
// every route serving the same empty <div id="root"> shell — as a "successful"
// deploy. This script turns that into a hard build failure.
//
// Checks, per route in scripts/routes.mjs → prerenderRoutes():
//   Phase 1
//   1. dist/<route>/index.html exists and #root is not empty
//   2. it contains a <title> that differs from the shell's default title
//   3. it contains exactly one <h1>, and that <h1> is not inline-hidden
//   4. it contains exactly one self-referencing <link rel="canonical">
//   5. <html lang="…"> matches the route's locale prefix
//   Phase 2
//   6. exactly one <meta name="description">
//   7. og:title / og:description / og:url / og:image / twitter:card present,
//      og:title == <title>, og:description == description, og:url == canonical
//   8. hreflang bg + en + x-default present; x-default == bg; self entry points
//      at this route; the counterpart route exists and points back (reciprocal)
// Across routes: titles and descriptions must be unique (no two routes share one).
//
// Run: node scripts/verify-prerender.mjs   (hooked into `postbuild`)

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { prerenderRoutes } from "./routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const BASE_URL = "https://www.epsystems.org";

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function attr(html, re) {
  const m = html.match(re);
  return m ? decodeEntities(m[1].trim()) : null;
}

function titleOf(html) {
  return attr(html, /<title>([^<]*)<\/title>/i);
}

function readRoute(route) {
  const file = join(DIST, route, "index.html");
  if (!existsSync(file)) return null;
  const html = readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>") + 7 || undefined);
  const hreflang = Object.fromEntries(
    [...head.matchAll(/<link[^>]+hreflang="([a-z-]+)"[^>]*href="([^"]+)"/gi)].map((m) => [m[1], m[2]]),
  );
  return {
    route,
    html,
    title: titleOf(head),
    description: attr(head, /<meta[^>]+name="description"[^>]*content="([^"]*)"/i),
    descriptionCount: (head.match(/<meta[^>]+name="description"/gi) || []).length,
    canonicals: [...head.matchAll(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/gi)].map((m) => m[1]),
    ogTitle: attr(head, /<meta[^>]+property="og:title"[^>]*content="([^"]*)"/i),
    ogDescription: attr(head, /<meta[^>]+property="og:description"[^>]*content="([^"]*)"/i),
    ogUrl: attr(head, /<meta[^>]+property="og:url"[^>]*content="([^"]*)"/i),
    ogImage: attr(head, /<meta[^>]+property="og:image"[^>]*content="([^"]*)"/i),
    twitterCard: attr(head, /<meta[^>]+name="twitter:card"[^>]*content="([^"]*)"/i),
    ogTitleCount: (head.match(/property="og:title"/gi) || []).length,
    hreflang,
    hreflangCount: Object.keys(hreflang).length,
    lang: attr(html, /<html[^>]*\slang="([a-z]{2})"/i),
    h1Count: (html.match(/<h1[\s>]/gi) || []).length,
    h1Hidden: /<h1[^>]*style="[^"]*opacity:\s*0[;"]/i.test(html),
    emptyRoot: html.includes('<div id="root"></div>'),
  };
}

// ---------------------------------------------------------------------------
// JSON-LD shape validation (Phase 4). Not a full schema.org validator: it checks
// the properties Google's rich-result docs require/recommend for the types this
// site emits, that every {"@id"} reference resolves on the same page, and that
// each page carries exactly the blocks its route type should.
// ---------------------------------------------------------------------------

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1].trim());
  const nodes = [];
  const errors = [];
  const seen = new Map();
  blocks.forEach((raw, i) => {
    if (seen.has(raw)) errors.push(`duplicate JSON-LD block (#${seen.get(raw)} and #${i})`);
    seen.set(raw, i);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      errors.push(`block #${i} is not valid JSON (${e.message.slice(0, 40)})`);
      return;
    }
    if (!parsed["@context"]) errors.push(`block #${i} has no @context`);
    const list = parsed["@graph"] ? parsed["@graph"] : [parsed];
    for (const n of list) nodes.push(n);
  });
  return { nodes, errors };
}

const typesOf = (n) => (Array.isArray(n?.["@type"]) ? n["@type"] : n?.["@type"] ? [n["@type"]] : []);
const has = (n, t) => typesOf(n).includes(t);
const isUrl = (v) => typeof v === "string" && /^https?:\/\//.test(v);
const isIsoDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v);

function walkRefs(value, out) {
  if (Array.isArray(value)) return value.forEach((v) => walkRefs(v, out));
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === "@id") out.push(value["@id"]);
    for (const k of keys) walkRefs(value[k], out);
  }
}

function validateJsonLd(p) {
  const { route } = p;
  const { nodes, errors } = extractJsonLd(p.html);
  const problems = [...errors];
  const isHome = /^\/(bg|en)\/$/.test(route);
  const isBlogPost = /^\/(bg|en)\/blog\/(?!category\/)[^/]+$/.test(route);
  const isService = /^\/(bg|en)\/services\/[^/]+$/.test(route);
  const isTeam = /^\/(bg|en)\/about\/team\/[^/]+$/.test(route);

  for (const n of nodes) if (typesOf(n).length === 0) problems.push("node without @type");

  // Every reference-only {"@id"} must resolve to a node on this page.
  const declaredIds = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
  const refs = [];
  for (const n of nodes) walkRefs(n, refs);
  for (const id of new Set(refs)) if (!declaredIds.has(id)) problems.push(`dangling @id reference ${id}`);

  // Sitewide organisation entity.
  const orgs = nodes.filter((n) => n["@id"] === `${BASE_URL}/#organization`);
  if (orgs.length !== 1) problems.push(`expected 1 #organization node, found ${orgs.length}`);
  else {
    const o = orgs[0];
    for (const t of ["Organization", "LocalBusiness"]) if (!has(o, t)) problems.push(`#organization lacks @type ${t}`);
    for (const k of ["name", "url", "telephone", "email", "logo", "image", "priceRange"]) if (!o[k]) problems.push(`#organization missing ${k}`);
    if (!o.address || o.address["@type"] !== "PostalAddress" || !o.address.addressLocality || !o.address.addressCountry)
      problems.push("#organization address must be a PostalAddress with locality + country");
    if (!Array.isArray(o.sameAs) || o.sameAs.length === 0) problems.push("#organization missing sameAs");
  }
  const sites = nodes.filter((n) => has(n, "WebSite"));
  if (sites.length !== 1) problems.push(`expected 1 WebSite, found ${sites.length}`);
  else if (sites[0].potentialAction) problems.push("WebSite declares a SearchAction the site does not implement");

  // Breadcrumbs: every page except home, exactly one, well-formed, ends at this page.
  const crumbs = nodes.filter((n) => has(n, "BreadcrumbList"));
  if (isHome) {
    if (crumbs.length) problems.push("home page should not carry a BreadcrumbList");
  } else if (crumbs.length !== 1) problems.push(`expected 1 BreadcrumbList, found ${crumbs.length}`);
  else {
    const items = crumbs[0].itemListElement;
    if (!Array.isArray(items) || items.length < 2) problems.push("BreadcrumbList needs >= 2 items");
    else {
      items.forEach((it, i) => {
        if (it["@type"] !== "ListItem") problems.push(`breadcrumb ${i} not a ListItem`);
        if (it.position !== i + 1) problems.push(`breadcrumb ${i} position ${it.position} != ${i + 1}`);
        if (!it.name || typeof it.name !== "string") problems.push(`breadcrumb ${i} has no name`);
        if (!isUrl(it.item)) problems.push(`breadcrumb ${i} item is not an absolute URL`);
      });
      const last = items[items.length - 1]?.item;
      if (last !== `${BASE_URL}${route}`) problems.push(`last breadcrumb ${last} != ${BASE_URL}${route}`);
    }
  }

  // Blog posts: one Article with what Google requires.
  const articles = nodes.filter((n) => typesOf(n).some((t) => /Article$/.test(t)));
  if (isBlogPost) {
    if (articles.length !== 1) problems.push(`expected 1 Article, found ${articles.length}`);
    else {
      const a = articles[0];
      if (!a.headline) problems.push("Article missing headline");
      else if (a.headline.length > 110) problems.push(`Article headline > 110 chars (${a.headline.length})`);
      if (!isIsoDate(a.datePublished)) problems.push("Article datePublished not ISO");
      if (!isIsoDate(a.dateModified)) problems.push("Article dateModified not ISO");
      if (!a.author || !a.author.name) problems.push("Article author.name missing");
      if (!isUrl(a.image) && !isUrl(a.image?.url)) problems.push("Article image missing");
      if (!a.publisher?.name || !a.publisher?.logo) problems.push("Article publisher needs name + logo");
      if (!a.mainEntityOfPage) problems.push("Article missing mainEntityOfPage");
      if (!a.inLanguage) problems.push("Article missing inLanguage");
      if (!a.description) problems.push("Article missing description");
    }
  } else if (articles.length) problems.push("Article on a non-post route");

  // Service pages: Service + FAQPage.
  if (isService) {
    const services = nodes.filter((n) => has(n, "Service") && n.url);
    if (services.length !== 1) problems.push(`expected 1 page-level Service, found ${services.length}`);
    else {
      const s = services[0];
      if (!s.name || !s.description || !s.provider) problems.push("Service needs name, description, provider");
    }
  }
  // FAQPage (Phase 5 GEO): required on every service page and on /pricing —
  // at least 5 buyer questions, each a real question with a substantive
  // answer, and at least one price question ("Колко струва…" / "How much…").
  const faqs = nodes.filter((n) => has(n, "FAQPage"));
  const isPricing = /^\/(bg|en)\/pricing$/.test(route);
  if (faqs.length > 1) problems.push(`more than one FAQPage (${faqs.length})`);
  if ((isService || isPricing) && faqs.length !== 1) problems.push(`expected 1 FAQPage on this page, found ${faqs.length}`);
  for (const f of faqs) {
    if (!Array.isArray(f.mainEntity) || f.mainEntity.length === 0) problems.push("FAQPage without questions");
    else {
      f.mainEntity.forEach((q, i) => {
        if (q["@type"] !== "Question" || !q.name) problems.push(`FAQ ${i} not a named Question`);
        else if (!/\?\s*$/.test(q.name)) problems.push(`FAQ ${i} question does not end with "?": ${q.name}`);
        if (q.acceptedAnswer?.["@type"] !== "Answer" || !q.acceptedAnswer?.text) problems.push(`FAQ ${i} lacks acceptedAnswer.text`);
        else if (q.acceptedAnswer.text.length < 40) problems.push(`FAQ ${i} answer too short to be useful`);
      });
      if (isService || isPricing) {
        if (f.mainEntity.length < 5) problems.push(`FAQPage has only ${f.mainEntity.length} questions (need >= 5)`);
        if (!f.mainEntity.some((q) => /колко струва|how much/i.test(q.name || ""))) problems.push("FAQPage has no price question");
        // GEO: the Q&A text must be in the page body too, not only in JSON-LD.
        const first = f.mainEntity[0]?.name;
        if (first && !p.html.includes(first.replace(/&/g, "&amp;"))) problems.push("FAQ question text not present in page body");
      }
    }
  }

  // Team profiles: exactly one Person *entity* whose url is this page. Nodes
  // sharing an @id are one entity (the founders appear in the sitewide block
  // and again on their own page), so count distinct @ids, not nodes.
  if (isTeam) {
    const persons = nodes.filter((n) => has(n, "Person") && n.url === `${BASE_URL}${route}`);
    const entities = new Map();
    persons.forEach((n, i) => entities.set(n["@id"] ?? `anon-${i}`, n));
    if (entities.size !== 1) problems.push(`expected 1 Person entity with url == page, found ${entities.size}`);
    else if (![...entities.values()][0].name) problems.push("Person missing name");
  }

  return problems;
}

function main() {
  const shellPath = join(DIST, "index.html");
  if (!existsSync(shellPath)) {
    console.error(`[verify-prerender] dist/index.html missing — did vite build run?`);
    process.exit(1);
  }
  const shellTitle = titleOf(readFileSync(shellPath, "utf8"));

  const routes = prerenderRoutes();
  const failures = [];
  const pages = new Map();

  for (const route of routes) {
    const p = readRoute(route);
    if (!p) {
      failures.push(`${route}: dist${route}${route.endsWith("/") ? "" : "/"}index.html not generated`);
      continue;
    }
    pages.set(route, p);
  }

  for (const p of pages.values()) {
    const { route } = p;
    const locale = route.split("/")[1];
    const selfUrl = `${BASE_URL}${route}`;
    const problems = [];

    // Phase 1
    if (p.emptyRoot) problems.push("empty #root — client-rendered shell");
    if (!p.title) problems.push("no <title>");
    if (p.h1Count !== 1) problems.push(`expected exactly 1 <h1>, found ${p.h1Count}`);
    if (p.h1Hidden) problems.push("<h1> is inline-hidden (opacity: 0)");
    if (p.canonicals.length !== 1) problems.push(`expected 1 canonical, found ${p.canonicals.length}`);
    else if (p.canonicals[0] !== selfUrl) problems.push(`canonical is ${p.canonicals[0]}, expected ${selfUrl}`);
    if (!p.lang) problems.push("no <html lang>");
    else if (p.lang !== locale) problems.push(`<html lang="${p.lang}"> but route locale is ${locale}`);

    // Phase 2 — description + social
    if (p.descriptionCount !== 1) problems.push(`expected 1 meta description, found ${p.descriptionCount}`);
    if (!p.description) problems.push("empty meta description");
    if (p.ogTitleCount !== 1) problems.push(`expected 1 og:title, found ${p.ogTitleCount}`);
    if (!p.ogTitle) problems.push("no og:title");
    else if (p.title && p.ogTitle !== p.title) problems.push(`og:title "${p.ogTitle}" != title "${p.title}"`);
    if (!p.ogDescription) problems.push("no og:description");
    else if (p.description && p.ogDescription !== p.description) problems.push("og:description != meta description");
    if (!p.ogUrl) problems.push("no og:url");
    else if (p.ogUrl !== selfUrl) problems.push(`og:url ${p.ogUrl} != ${selfUrl}`);
    if (!p.ogImage) problems.push("no og:image");
    if (!p.twitterCard) problems.push("no twitter:card");

    // Phase 2 — hreflang reciprocity
    const hl = p.hreflang;
    if (p.hreflangCount !== 3 || !hl.bg || !hl.en || !hl["x-default"]) {
      problems.push(`hreflang set incomplete (${Object.keys(hl).join(",") || "none"})`);
    } else {
      if (hl["x-default"] !== hl.bg) problems.push("hreflang x-default != bg");
      const selfEntry = locale === "bg" ? hl.bg : hl.en;
      if (selfEntry !== selfUrl) problems.push(`hreflang self entry ${selfEntry} != ${selfUrl}`);
      const otherUrl = locale === "bg" ? hl.en : hl.bg;
      const otherRoute = otherUrl.replace(BASE_URL, "");
      const other = pages.get(otherRoute);
      if (!other) problems.push(`hreflang counterpart ${otherRoute} is not a prerendered route`);
      else {
        const back = locale === "bg" ? other.hreflang.bg : other.hreflang.en;
        if (back !== selfUrl) problems.push(`hreflang not reciprocal: ${otherRoute} points back to ${back}`);
      }
    }

    if (problems.length) failures.push(`${route}: ${problems.join("; ")}`);
  }

  // Cross-route uniqueness
  const byTitle = new Map();
  const byDesc = new Map();
  for (const p of pages.values()) {
    if (p.title) byTitle.set(p.title, [...(byTitle.get(p.title) || []), p.route]);
    if (p.description) byDesc.set(p.description, [...(byDesc.get(p.description) || []), p.route]);
  }
  for (const [t, rs] of byTitle) if (rs.length > 1) failures.push(`duplicate <title> "${t}" on ${rs.join(", ")}`);
  for (const [d, rs] of byDesc) if (rs.length > 1) failures.push(`duplicate description "${d.slice(0, 60)}…" on ${rs.join(", ")}`);

  const shellTitled = [...pages.values()].filter((p) => p.title === shellTitle && p.route !== "/bg/").map((p) => p.route);
  if (shellTitled.length) failures.push(`routes still carrying the shell <title>: ${shellTitled.join(", ")}`);

  // Phase 4 — structured data shape, per page.
  for (const p of pages.values()) {
    const problems = validateJsonLd(p);
    if (problems.length) failures.push(`${p.route} [json-ld]: ${problems.join("; ")}`);
  }

  // Phase 6 — image weight budget. Every local <img src> and the og:image must
  // exist in dist and stay under budget (the pre-fix site shipped a 1.9 MB
  // headshot rendered at 160 px, which alone put mobile LCP past 12 s).
  const IMG_BUDGET = 250 * 1024;
  const OG_BUDGET = 400 * 1024;
  const checkedImages = new Map();
  for (const p of pages.values()) {
    const srcs = [...p.html.matchAll(/<img[^>]+src="(\/[^"]+)"/gi)].map((m) => m[1]);
    const oversized = [];
    for (const src of new Set(srcs)) {
      if (!checkedImages.has(src)) {
        const file = join(DIST, src);
        checkedImages.set(src, existsSync(file) ? readFileSync(file).length : -1);
      }
      const size = checkedImages.get(src);
      if (size < 0) oversized.push(`${src} (missing)`);
      else if (size > IMG_BUDGET) oversized.push(`${src} (${Math.round(size / 1024)} KB)`);
    }
    if (oversized.length) failures.push(`${p.route} [images]: over ${IMG_BUDGET / 1024} KB or missing: ${oversized.join(", ")}`);
    if (p.ogImage && p.ogImage.startsWith(BASE_URL)) {
      const og = join(DIST, p.ogImage.slice(BASE_URL.length));
      if (!existsSync(og)) failures.push(`${p.route} [images]: og:image ${p.ogImage} not in dist`);
      else if (readFileSync(og).length > OG_BUDGET) failures.push(`${p.route} [images]: og:image over ${OG_BUDGET / 1024} KB`);
    }
  }

  // Phase 5 — llms.txt must only link to URLs that actually exist in dist.
  const llmsPath = join(DIST, "llms.txt");
  if (!existsSync(llmsPath)) failures.push("dist/llms.txt missing");
  else {
    const llms = readFileSync(llmsPath, "utf8");
    const urls = [...new Set([...llms.matchAll(/https:\/\/www\.epsystems\.org(\/[^\s)]*)/g)].map((m) => m[1]))];
    const dead = urls.filter((path) => {
      const clean = path.replace(/[.,;:]+$/, "");
      if (/\.[a-z0-9]+$/i.test(clean)) return !existsSync(join(DIST, clean));
      return !existsSync(join(DIST, clean, "index.html"));
    });
    if (dead.length) failures.push(`llms.txt links to routes that are not built: ${dead.join(", ")}`);
    if (urls.length < 20) failures.push(`llms.txt looks truncated (${urls.length} URLs)`);
  }

  // Phase 3 — dist/404.html: the prerendered NotFoundPage that Vercel serves
  // with a 404 status for paths without a static file.
  const notFoundPath = join(DIST, "404.html");
  if (!existsSync(notFoundPath)) {
    failures.push("dist/404.html not generated (NOT_FOUND_PRERENDER_ROUTE postProcess)");
  } else {
    const nf = readFileSync(notFoundPath, "utf8");
    const nfProblems = [];
    if (nf.includes('<div id="root"></div>')) nfProblems.push("empty #root");
    if ((nf.match(/<h1[\s>]/gi) || []).length !== 1) nfProblems.push("expected exactly 1 <h1>");
    if (!/<meta[^>]+name="robots"[^>]+content="noindex"/i.test(nf)) nfProblems.push('missing <meta name="robots" content="noindex">');
    if (titleOf(nf) === shellTitle) nfProblems.push("still has the shell <title>");
    if (/rel="canonical"/i.test(nf)) nfProblems.push("must not declare a canonical");
    if (nfProblems.length) failures.push(`404.html: ${nfProblems.join("; ")}`);
  }

  if (failures.length) {
    console.error(`[verify-prerender] FAILED — ${failures.length} problem(s) across ${routes.length} routes:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `[verify-prerender] OK — ${routes.length} routes prerendered; unique title + description on each; ` +
      `canonical, lang, single visible <h1>, OG/Twitter and reciprocal hreflang verified.`,
  );
}

main();
