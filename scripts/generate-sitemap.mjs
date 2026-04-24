// Generate public/sitemap.xml from the authoritative route + content list.
// BG-first: primary entries point at /bg/, x-default → /bg/.
// Run: node scripts/generate-sitemap.mjs
// Hooked into npm build via the "prebuild" script.

import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOMAIN = 'https://epsystems.bg' // [CONFIRM: final canonical domain — epsystems.org vs epsystems.bg]
const OUT = resolve(ROOT, 'public/sitemap.xml')
const BLOG_DIR = resolve(ROOT, 'content/blog')

/**
 * Static routes, priority + changefreq.
 * `path` is appended after the locale prefix.
 */
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai-websites', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai-automation', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai-agents', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai-seo', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai-ecommerce', priority: '0.9', changefreq: 'monthly' },
  { path: '/industries/insurance', priority: '0.85', changefreq: 'monthly' },
  { path: '/industries/ecommerce', priority: '0.7', changefreq: 'monthly' },
  { path: '/industries/fitness', priority: '0.7', changefreq: 'monthly' },
  { path: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
]

/** Parse the YAML frontmatter block of an MDX file (first `---...---`). */
function parseFrontmatter(src) {
  const match = src.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return null
  const body = match[1]
  const data = {}
  for (const line of body.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    // strip quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    data[m[1]] = value
  }
  return data
}

function loadBlogPosts() {
  const posts = []
  for (const locale of ['bg', 'en']) {
    const dir = join(BLOG_DIR, locale)
    const files = readdirSync(dir).filter((f) => f.endsWith('.mdx'))
    for (const file of files) {
      const full = join(dir, file)
      const src = readFileSync(full, 'utf8')
      const fm = parseFrontmatter(src)
      if (!fm || !fm.slug || !fm.locale) continue
      const mtime = statSync(full).mtime.toISOString().slice(0, 10)
      posts.push({
        locale: fm.locale,
        slug: fm.slug,
        alternateSlug: fm.alternateSlug,
        date: fm.date,
        lastmod: mtime,
      })
    }
  }
  return posts
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function urlEntry({ loc, alternates, priority, changefreq, lastmod }) {
  const alts = alternates
    .map(
      (a) =>
        `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
    )
    .join('\n')
  return `  <url>
    <loc>${loc}</loc>
${alts}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function buildStaticEntries() {
  const lastmod = todayIso()
  return staticRoutes.flatMap((r) => {
    const bgLoc = `${DOMAIN}/bg${r.path === '/' ? '/' : r.path}`
    const enLoc = `${DOMAIN}/en${r.path === '/' ? '/' : r.path}`
    const alternates = [
      { hreflang: 'bg', href: bgLoc },
      { hreflang: 'en', href: enLoc },
      { hreflang: 'x-default', href: bgLoc },
    ]
    return [
      urlEntry({ loc: bgLoc, alternates, priority: r.priority, changefreq: r.changefreq, lastmod }),
      urlEntry({
        loc: enLoc,
        alternates,
        priority: String(Math.max(0, parseFloat(r.priority) - 0.1).toFixed(1)),
        changefreq: r.changefreq,
        lastmod,
      }),
    ]
  })
}

function buildBlogEntries(posts) {
  const bySlugKey = (p) => `${p.locale}:${p.slug}`
  const index = new Map(posts.map((p) => [bySlugKey(p), p]))
  const seen = new Set()
  const entries = []
  for (const p of posts) {
    const key = bySlugKey(p)
    if (seen.has(key)) continue
    const altLocale = p.locale === 'bg' ? 'en' : 'bg'
    const alt =
      p.alternateSlug && index.get(`${altLocale}:${p.alternateSlug}`)
    const bgPost = p.locale === 'bg' ? p : alt
    const enPost = p.locale === 'en' ? p : alt
    if (bgPost) seen.add(bySlugKey(bgPost))
    if (enPost) seen.add(bySlugKey(enPost))
    const alternates = []
    if (bgPost) alternates.push({ hreflang: 'bg', href: `${DOMAIN}/bg/blog/${bgPost.slug}` })
    if (enPost) alternates.push({ hreflang: 'en', href: `${DOMAIN}/en/blog/${enPost.slug}` })
    if (bgPost) alternates.push({ hreflang: 'x-default', href: `${DOMAIN}/bg/blog/${bgPost.slug}` })
    if (bgPost) {
      entries.push(
        urlEntry({
          loc: `${DOMAIN}/bg/blog/${bgPost.slug}`,
          alternates,
          priority: '0.7',
          changefreq: 'monthly',
          lastmod: bgPost.lastmod || todayIso(),
        }),
      )
    }
    if (enPost) {
      entries.push(
        urlEntry({
          loc: `${DOMAIN}/en/blog/${enPost.slug}`,
          alternates,
          priority: '0.6',
          changefreq: 'monthly',
          lastmod: enPost.lastmod || todayIso(),
        }),
      )
    }
  }
  return entries
}

function build() {
  const posts = loadBlogPosts()
  const entries = [...buildStaticEntries(), ...buildBlogEntries(posts)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
  writeFileSync(OUT, xml, 'utf8')
  console.log(`Sitemap generated with ${entries.length} URL entries → ${OUT}`)
}

build()
