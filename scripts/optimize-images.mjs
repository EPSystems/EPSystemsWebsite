// One-off (idempotent) image optimisation for the static assets in /public.
//
// Why: Lighthouse on the prerendered site measured 3.9 MB of images on the
// home page and 2.1 MB on /about — a 1.9 MB PNG headshot displayed at 160 px,
// a 5000×5000 partner logo shown ~100 px tall. That alone pushed mobile LCP
// past 12 s. Originals stay in place (they are referenced by og:image and the
// static JSON-LD); the site's <img> tags point at the WebP variants written here.
//
// Run: npm run optimize:images   (outputs are committed; not part of the build)

import { readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, parse } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");

/** Display budgets (CSS px × ~2.5 DPR headroom). Aspect ratios are preserved;
 *  the CSS `object-cover` + `object-position` crops exactly as before. */
const TARGETS = [
  // Team headshots: rendered in 160×160 circles (36 px in bylines).
  { dir: "team", resize: { width: 480, fit: "inside", withoutEnlargement: true }, quality: 80 },
  // Partner logos: rendered up to ~120 px tall inside fixed-height boxes.
  { dir: "partners", resize: { height: 256, fit: "inside", withoutEnlargement: true }, quality: 82 },
];

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function convertDir({ dir, resize, quality }) {
  const abs = join(PUBLIC, dir);
  const files = readdirSync(abs).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const file of files) {
    const src = join(abs, file);
    const out = join(abs, `${parse(file).name}.webp`);
    const before = statSync(src).size;
    await sharp(src).rotate().resize(resize).webp({ quality, effort: 6 }).toFile(out);
    const after = statSync(out).size;
    const meta = await sharp(out).metadata();
    console.log(`${dir}/${file} ${kb(before)} → ${parse(file).name}.webp ${kb(after)} (${meta.width}×${meta.height})`);
  }
}

async function compressLogo() {
  // Used only as og:image / schema logo; keep PNG + dimensions, drop the weight.
  const src = join(PUBLIC, "logo.png");
  if (!existsSync(src)) return;
  const before = statSync(src).size;
  if (before < 200 * 1024) {
    console.log(`logo.png already ${kb(before)}, skipping`);
    return;
  }
  const buf = await sharp(src).png({ palette: true, quality: 90, compressionLevel: 9, effort: 8 }).toBuffer();
  await sharp(buf).toFile(src);
  console.log(`logo.png ${kb(before)} → ${kb(statSync(src).size)}`);
}

for (const t of TARGETS) await convertDir(t);
await compressLogo();
