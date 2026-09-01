// Shared route enumeration for sitemap generation AND prerendering.
// Single source of truth so the two never drift.
//
// Used by:
//   - scripts/generate-sitemap.mjs   (build-time sitemap, runs in `prebuild`)
//   - vite.config.ts                 (vite-plugin-prerender route list)
//
// Exports:
//   - STATIC_ROUTE_PATHS: locale-agnostic path parts (e.g. "/services/ai-websites")
//   - LOCALES: ["bg", "en"]
//   - blogPostSlugs(): { bg: string[], en: string[] } read from MDX frontmatter
//   - prerenderRoutes(): string[]  — full paths like "/bg/services/ai-websites"

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BLOG_DIR = resolve(ROOT, "content/blog");

export const LOCALES = ["bg", "en"];

// Team member slugs — mirror src/data/team.ts (the .ts can't be imported from
// here). If team.ts slugs change, update this array too.
export const TEAM_SLUGS = [
  "emil-dermendzhiev",
  "pavel-stefanov",
  "emi-letkova",
  "yoana-todorova",
];

export const STATIC_ROUTE_PATHS = [
  "/",
  "/services",
  "/services/ai-websites",
  "/services/ai-automation",
  "/services/ai-agents",
  "/services/ai-seo",
  "/services/ai-ecommerce",
  "/industries/insurance",
  "/industries/ecommerce",
  "/industries/fitness",
  "/projects",
  "/pricing",
  "/about",
  "/contact",
  "/blog",
  "/resources",
  "/privacy-policy",
];

/** Parse the first YAML frontmatter block of an MDX file. Tolerates CRLF. */
export function parseFrontmatter(src) {
  const match = src.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.replace(/\r$/, "");
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[m[1]] = value;
  }
  return data;
}

/** Returns { bg: string[], en: string[] } of blog post slugs per locale. */
export function blogPostSlugs() {
  const out = { bg: [], en: [] };
  for (const locale of LOCALES) {
    const dir = join(BLOG_DIR, locale);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    } catch {
      // directory missing — treat as no posts
      continue;
    }
    for (const file of files) {
      const src = readFileSync(join(dir, file), "utf8");
      const fm = parseFrontmatter(src);
      if (fm && fm.slug) out[locale].push(fm.slug);
    }
  }
  return out;
}

/** Returns the deduplicated set of blog categories across all locales. */
export function blogCategories() {
  const set = new Set();
  for (const locale of LOCALES) {
    const dir = join(BLOG_DIR, locale);
    let files = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    } catch {
      continue;
    }
    for (const file of files) {
      const src = readFileSync(join(dir, file), "utf8");
      const fm = parseFrontmatter(src);
      if (fm && fm.category) set.add(fm.category);
    }
  }
  return [...set].sort();
}

/**
 * Full route paths for the prerenderer, locale-prefixed.
 * Order: locale → static routes → blog posts.
 * Does NOT include "/" (the SPA redirects "/" → "/bg/" client-side;
 * vercel.json handles the canonical redirect and the prerenderer would
 * capture an empty Navigate shell, so it is intentionally omitted).
 */
export function prerenderRoutes() {
  const { bg: bgSlugs, en: enSlugs } = blogPostSlugs();
  const categories = blogCategories();
  const routes = [];
  for (const locale of LOCALES) {
    for (const pathPart of STATIC_ROUTE_PATHS) {
      routes.push(`/${locale}${pathPart === "/" ? "/" : pathPart}`);
    }
    for (const slug of locale === "bg" ? bgSlugs : enSlugs) {
      routes.push(`/${locale}/blog/${slug}`);
    }
    for (const slug of TEAM_SLUGS) {
      routes.push(`/${locale}/about/team/${slug}`);
    }
    for (const cat of categories) {
      routes.push(`/${locale}/blog/category/${cat}`);
    }
  }
  return routes;
}
