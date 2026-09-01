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
