// Generate public/sitemap.xml from the authoritative route + content list.
// BG-first: primary entries point at /bg/, x-default → /bg/.
// Run: node scripts/generate-sitemap.mjs
// Hooked into npm build via the "prebuild" script.

import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { STATIC_ROUTE_PATHS, parseFrontmatter, TEAM_SLUGS, blogCategories } from "./routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DOMAIN = "https://www.epsystems.org";
const OUT = resolve(ROOT, "public/sitemap.xml");
const BLOG_DIR = resolve(ROOT, "content/blog");

/**
 * Static routes, priority + changefreq.
 * `path` is appended after the locale prefix.
 * Path list is sourced from scripts/routes.mjs (shared with the prerenderer)
 * so sitemap and prerender can never drift. Priority/changefreq stay here.
 */
const STATIC_PRIORITIES = {
  "/": { priority: "1.0", changefreq: "weekly" },
  "/services": { priority: "0.9", changefreq: "monthly" },
  "/services/ai-websites": { priority: "0.9", changefreq: "monthly" },
  "/services/ai-automation": { priority: "0.9", changefreq: "monthly" },
  "/services/ai-agents": { priority: "0.9", changefreq: "monthly" },
  "/services/ai-seo": { priority: "0.9", changefreq: "monthly" },
  "/services/ai-ecommerce": { priority: "0.9", changefreq: "monthly" },
  "/industries/insurance": { priority: "0.85", changefreq: "monthly" },
  "/industries/ecommerce": { priority: "0.7", changefreq: "monthly" },
  "/industries/fitness": { priority: "0.7", changefreq: "monthly" },
  "/projects": { priority: "0.7", changefreq: "monthly" },
  "/pricing": { priority: "0.8", changefreq: "monthly" },
  "/about": { priority: "0.7", changefreq: "monthly" },
  "/contact": { priority: "0.7", changefreq: "monthly" },
  "/blog": { priority: "0.8", changefreq: "weekly" },
  "/resources": { priority: "0.7", changefreq: "monthly" },
  "/privacy-policy": { priority: "0.3", changefreq: "yearly" },
};
const staticRoutes = STATIC_ROUTE_PATHS.map((path) => ({
  path,
  priority: STATIC_PRIORITIES[path]?.priority ?? "0.6",
  changefreq: STATIC_PRIORITIES[path]?.changefreq ?? "monthly",
}));



function loadBlogPosts() {
  const posts = [];
  for (const locale of ["bg", "en"]) {
    const dir = join(BLOG_DIR, locale);
    const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const full = join(dir, file);
      const src = readFileSync(full, "utf8");
      const fm = parseFrontmatter(src);
      if (!fm || !fm.slug || !fm.locale) continue;
      // lastmod: prefer the frontmatter `date` (deterministic across builds);
      // fall back to file mtime, then today.
      const dateNormalized = (fm.date || "").slice(0, 10);
      const mtime = statSync(full).mtime.toISOString().slice(0, 10);
      const lastmod = dateNormalized || mtime || todayIso();
      const cornerstone =
        fm.cornerstone === "true" || fm.cornerstone === true;
      posts.push({
        locale: fm.locale,
        slug: fm.slug,
        alternateSlug: fm.alternateSlug,
        date: fm.date,
        lastmod,
        cornerstone,
      });
    }
  }
  return posts;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function urlEntry({ loc, alternates, priority, changefreq, lastmod }) {
  const alts = alternates
    .map(
      (a) =>
        `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
    )
    .join("\n");
  return `  <url>
    <loc>${loc}</loc>
${alts}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildStaticEntries() {
  const lastmod = todayIso();
  return staticRoutes.flatMap((r) => {
    const bgLoc = `${DOMAIN}/bg${r.path === "/" ? "/" : r.path}`;
    const enLoc = `${DOMAIN}/en${r.path === "/" ? "/" : r.path}`;
    const alternates = [
      { hreflang: "bg", href: bgLoc },
      { hreflang: "en", href: enLoc },
      { hreflang: "x-default", href: bgLoc },
    ];
    return [
      urlEntry({
        loc: bgLoc,
        alternates,
        priority: r.priority,
        changefreq: r.changefreq,
        lastmod,
      }),
      urlEntry({
        loc: enLoc,
        alternates,
        priority: String(Math.max(0, parseFloat(r.priority) - 0.1).toFixed(1)),
        changefreq: r.changefreq,
        lastmod,
      }),
    ];
  });
}

function buildBlogEntries(posts) {
  const bySlugKey = (p) => `${p.locale}:${p.slug}`;
  const index = new Map(posts.map((p) => [bySlugKey(p), p]));
  const seen = new Set();
  const entries = [];
  for (const p of posts) {
    const key = bySlugKey(p);
    if (seen.has(key)) continue;
    const altLocale = p.locale === "bg" ? "en" : "bg";
    const alt = p.alternateSlug && index.get(`${altLocale}:${p.alternateSlug}`);
    const bgPost = p.locale === "bg" ? p : alt;
    const enPost = p.locale === "en" ? p : alt;
    if (bgPost) seen.add(bySlugKey(bgPost));
    if (enPost) seen.add(bySlugKey(enPost));
    const alternates = [];
    if (bgPost)
      alternates.push({
        hreflang: "bg",
        href: `${DOMAIN}/bg/blog/${bgPost.slug}`,
      });
    if (enPost)
      alternates.push({
        hreflang: "en",
        href: `${DOMAIN}/en/blog/${enPost.slug}`,
      });
    if (bgPost)
      alternates.push({
        hreflang: "x-default",
        href: `${DOMAIN}/bg/blog/${bgPost.slug}`,
      });
    // Cornerstone posts get a sitemap-priority bump (0.8 BG / 0.7 EN);
    // supporting posts default to 0.6 BG / 0.5 EN.
    const isCornerstone = (bgPost && bgPost.cornerstone) || (enPost && enPost.cornerstone);
    const bgPriority = isCornerstone ? "0.8" : "0.6";
    const enPriority = isCornerstone ? "0.7" : "0.5";
    if (bgPost) {
      entries.push(
        urlEntry({
          loc: `${DOMAIN}/bg/blog/${bgPost.slug}`,
          alternates,
          priority: bgPriority,
          changefreq: "monthly",
          lastmod: bgPost.lastmod || todayIso(),
        }),
      );
    }
    if (enPost) {
      entries.push(
        urlEntry({
          loc: `${DOMAIN}/en/blog/${enPost.slug}`,
          alternates,
          priority: enPriority,
          changefreq: "monthly",
          lastmod: enPost.lastmod || todayIso(),
        }),
      );
    }
  }
  return entries;
}

// Dynamic-but-enumerable routes: team-member pages and blog-category pages.
// These get hreflang alternates (same slug both locales) and modest priority.
function buildDynamicDirEntries(prefix, slugs, { bgPriority, enPriority, changefreq }) {
  const lastmod = todayIso();
  const entries = [];
  for (const slug of slugs) {
    const bgLoc = `${DOMAIN}/bg/${prefix}/${slug}`;
    const enLoc = `${DOMAIN}/en/${prefix}/${slug}`;
    const alternates = [
      { hreflang: "bg", href: bgLoc },
      { hreflang: "en", href: enLoc },
      { hreflang: "x-default", href: bgLoc },
    ];
    entries.push(
      urlEntry({ loc: bgLoc, alternates, priority: bgPriority, changefreq, lastmod }),
      urlEntry({ loc: enLoc, alternates, priority: enPriority, changefreq, lastmod }),
    );
  }
  return entries;
}

function build() {
  const posts = loadBlogPosts();
  const categories = blogCategories();
  const entries = [
    ...buildStaticEntries(),
    ...buildBlogEntries(posts),
    ...buildDynamicDirEntries("about/team", TEAM_SLUGS, {
      bgPriority: "0.5",
      enPriority: "0.4",
      changefreq: "monthly",
    }),
    ...buildDynamicDirEntries("blog/category", categories, {
      bgPriority: "0.5",
      enPriority: "0.4",
      changefreq: "weekly",
    }),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
  writeFileSync(OUT, xml, "utf8");
  console.log(`Sitemap generated with ${entries.length} URL entries → ${OUT}`);
}

build();
