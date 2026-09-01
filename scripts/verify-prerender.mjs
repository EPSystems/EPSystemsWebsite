// Post-build gate: fail the build if prerendering silently produced the bare
// SPA shell instead of real per-route HTML.
//
// Why this exists: vite-plugin-prerender swallows renderer errors (it logs
// "Unable to prerender all routes!" and resolves), so a Chrome launch failure
// on the build machine would ship the exact defect this repo is fixing —
// every route serving the same empty <div id="root"> shell — as a "successful"
// deploy. This script turns that into a hard build failure.
//
// Checks, per route in scripts/routes.mjs → prerenderRoutes():
//   1. dist/<route>/index.html exists
//   2. it contains a <title> that differs from the shell's default title
//   3. it contains exactly one <h1>
//   4. it contains a self-referencing <link rel="canonical">
//   5. <html lang="…"> matches the route's locale prefix
// Then, across all routes: titles must not all be identical.
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

function titleOf(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : null;
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
  const titles = new Map();

  for (const route of routes) {
    const file = join(DIST, route, "index.html");
    const where = `dist${route}${route.endsWith("/") ? "" : "/"}index.html`;
    if (!existsSync(file)) {
      failures.push(`${route}: ${where} not generated`);
      continue;
    }
    const html = readFileSync(file, "utf8");
    const locale = route.split("/")[1];
    const problems = [];

    const title = titleOf(html);
    if (!title) problems.push("no <title>");
    else titles.set(route, title);

    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count !== 1) problems.push(`expected exactly 1 <h1>, found ${h1Count}`);

    const canonicalUrl = `${BASE_URL}${route}`;
    const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
    if (canonicals.length !== 1) problems.push(`expected 1 canonical, found ${canonicals.length}`);
    else if (canonicals[0] !== canonicalUrl) problems.push(`canonical is ${canonicals[0]}, expected ${canonicalUrl}`);

    const langMatch = html.match(/<html[^>]*\slang="([a-z]{2})"/i);
    if (!langMatch) problems.push("no <html lang>");
    else if (langMatch[1] !== locale) problems.push(`<html lang="${langMatch[1]}"> but route locale is ${locale}`);

    if (html.includes('<div id="root"></div>')) problems.push("empty #root — client-rendered shell");

    if (problems.length) failures.push(`${route}: ${problems.join("; ")}`);
  }

  const distinctTitles = new Set(titles.values());
  if (titles.size > 1 && distinctTitles.size === 1) {
    failures.push(`all ${titles.size} routes share one title ("${[...distinctTitles][0]}") — prerender captured the shell`);
  }
  const shellTitled = [...titles.entries()].filter(([, t]) => t === shellTitle).map(([r]) => r);
  // The BG home page legitimately uses the shell title; anything else is suspicious.
  const unexpectedShellTitled = shellTitled.filter((r) => r !== "/bg/");
  if (unexpectedShellTitled.length) {
    failures.push(`routes still carrying the shell <title>: ${unexpectedShellTitled.join(", ")}`);
  }

  if (failures.length) {
    console.error(`[verify-prerender] FAILED — ${failures.length} problem(s) across ${routes.length} routes:`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `[verify-prerender] OK — ${routes.length} routes prerendered, ${distinctTitles.size} distinct titles, canonical + lang + single <h1> verified.`,
  );
}

main();
