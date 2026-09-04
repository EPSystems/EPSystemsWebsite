// Generates a branded 1200×630 placeholder cover for every blog post whose
// frontmatter `coverImage` points at a file that does not exist in /public.
//
// Why: all ten posts declared covers such as /blog/n8n-claude-stack-cover.jpg
// that were never added, so og:image, twitter:image and Article.image were
// 404s (broken social previews; Article rich results invalid). These covers
// are deliberately simple — dark ground, brand lime accent, the post title —
// and are skipped when a real file already exists, so designers can replace
// any of them by dropping a JPG with the same name into public/blog/.
//
// Run: npm run generate:covers   (outputs are committed; not part of the build)

import { readdirSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import sharp from "sharp";
import { parseFrontmatter, LOCALES } from "./routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const BLOG_DIR = join(ROOT, "content/blog");

const W = 1200;
const H = 630;
const LIME = "#B9FF66";

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Greedy word wrap to at most `max` chars per line, at most 4 lines. */
function wrap(text, max = 30) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].replace(/\S+$/, "…");
  }
  return lines;
}

function svgFor({ title, category, locale }) {
  const lines = wrap(title, 30);
  const fontSize = lines.length >= 4 ? 52 : lines.length === 3 ? 58 : 64;
  const lineHeight = Math.round(fontSize * 1.15);
  const startY = 250;
  const tspans = lines
    .map((l, i) => `<tspan x="80" y="${startY + i * lineHeight}">${escapeXml(l)}</tspan>`)
    .join("");
  const label = locale === "bg" ? "E&amp;P Systems · AI агенция, София" : "E&amp;P Systems · AI agency, Sofia";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect x="80" y="120" width="120" height="14" fill="${LIME}"/>
  <text x="80" y="185" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${LIME}" letter-spacing="3">${escapeXml((category || "blog").toUpperCase())}</text>
  <text font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${tspans}</text>
  <text x="80" y="570" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${label}</text>
  <rect x="${W - 200}" y="${H - 60}" width="200" height="60" fill="${LIME}"/>
</svg>`;
}

let made = 0;
let kept = 0;
for (const locale of LOCALES) {
  const dir = join(BLOG_DIR, locale);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const fm = parseFrontmatter(readFileSync(join(dir, file), "utf8"));
    if (!fm?.coverImage || !fm.title) continue;
    const out = join(PUBLIC, fm.coverImage);
    if (existsSync(out)) {
      kept++;
      continue;
    }
    mkdirSync(dirname(out), { recursive: true });
    const svg = Buffer.from(svgFor({ title: fm.title, category: fm.category, locale }));
    await sharp(svg).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
    made++;
    console.log(`made ${fm.coverImage} ← "${fm.title}"`);
  }
}
console.log(`covers: ${made} generated, ${kept} already present`);
