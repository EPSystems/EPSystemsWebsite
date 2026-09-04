import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// vite-plugin-prerender ships a broken ESM build (uses `require` in an .mjs),
// so load its CommonJS entry via createRequire.
const require = createRequire(import.meta.url)
const vitePrerender = require('vite-plugin-prerender') as typeof import('vite-plugin-prerender')

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Pick the headless Chromium the prerenderer launches.
 *
 * - Vercel's build image (Amazon Linux) lacks the shared libraries that
 *   puppeteer's own "Chrome for Testing" download needs (libnss3, libatk, …),
 *   so there we use @sparticuz/chromium — a statically linked headless
 *   Chromium built for AWS Lambda / Amazon Linux. Version 127 matches the
 *   Chrome 127 that puppeteer 22.15 targets.
 * - Everywhere else (dev machines, generic CI) we use puppeteer's managed
 *   Chrome, which `npm install` downloads via puppeteer's postinstall.
 *
 * Set PRERENDER_CHROMIUM=sparticuz to force the Vercel path locally on Linux.
 */
async function resolveChromium(): Promise<{
  executablePath: string
  args: string[]
  headless: boolean | 'shell'
}> {
  const useSparticuz = process.env.VERCEL === '1' || process.env.PRERENDER_CHROMIUM === 'sparticuz'
  if (useSparticuz) {
    // @sparticuz/chromium ships the shared libraries its binary needs
    // (libnss3, libatk, …) as bin/al2023.tar.br, but only unpacks them — and
    // prepends /tmp/al2023/lib to LD_LIBRARY_PATH — when it detects a Node 20
    // AWS Lambda runtime via AWS_EXECUTION_ENV / AWS_LAMBDA_JS_RUNTIME. A build
    // container is not Lambda, so without this hint the launch dies with
    // "libnss3.so: cannot open shared object file" (reproduced in Docker).
    // The check runs at require() time, so the variable must be set first.
    if (process.platform === 'linux' && !process.env.AWS_LAMBDA_JS_RUNTIME && !process.env.AWS_EXECUTION_ENV) {
      process.env.AWS_LAMBDA_JS_RUNTIME = 'nodejs20.x'
    }
    const mod = require('@sparticuz/chromium')
    const chromium = mod.default ?? mod
    return {
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      headless: chromium.headless,
    }
  }
  const puppeteer = require('puppeteer') as typeof import('puppeteer')
  const executablePath = puppeteer.executablePath()
  if (!existsSync(executablePath)) {
    throw new Error(
      `[prerender] Chrome not found at ${executablePath}.\n` +
        `Run "npx puppeteer browsers install chrome" (puppeteer's postinstall normally does this).`,
    )
  }
  return { executablePath, args: [], headless: true }
}

export default defineConfig(async () => {
  // Route list is shared with the sitemap generator so the two never drift.
  // (Dynamic import keeps routes.mjs — plain ESM JS — out of TS's type-checking.)
  const { prerenderRoutes, NOT_FOUND_PRERENDER_ROUTE } = await import('./scripts/routes.mjs')
  const chromium = await resolveChromium()
  const notFoundOutput = resolve(__dirname, 'dist', '404.html')

  return {
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            [remarkMdxFrontmatter, { name: 'frontmatter' }],
          ],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
          providerImportSource: '@mdx-js/react',
        }),
      },
      react(),
      // Prerender every sitemap route to static HTML so AI/web crawlers see real
      // content, per-route <title>/meta/hreflang, and JSON-LD — not an empty
      // <div id="root">. The puppeteer capture sees the same DOM a visitor does,
      // so SEOHead's runtime-injected tags (canonical, OG, BreadcrumbList),
      // BlogPost's Article schema, and ServiceFAQ's FAQPage schema all land in
      // the static file with zero changes to those components.
      //
      // NOTE: the plugin swallows renderer failures, so scripts/verify-prerender.mjs
      // (npm postbuild) fails the build if any route came out as the bare shell.
      vitePrerender({
        staticDir: resolve(__dirname, 'dist'),
        // Real routes + one pseudo-route that renders NotFoundPage. With the
        // SPA catch-all rewrite removed from vercel.json, Vercel serves
        // dist/404.html with a genuine 404 status for any path without a
        // static file (previously every unknown URL was a 200 "soft 404").
        routes: [...prerenderRoutes(), NOT_FOUND_PRERENDER_ROUTE],
        postProcess(renderedRoute: { route: string; html: string; outputPath?: string }) {
          if (renderedRoute.route === NOT_FOUND_PRERENDER_ROUTE) {
            renderedRoute.outputPath = notFoundOutput
          }
          return renderedRoute
        },
        renderer: new vitePrerender.PuppeteerRenderer({
          executablePath: chromium.executablePath,
          args: chromium.args,
          headless: chromium.headless,
          // Exposes window.__PRERENDER_INJECTED = { prerender: true } to the app
          // before any script runs. main.tsx uses it to complete framer-motion
          // animations instantly and to treat every whileInView section as
          // visible, so the snapshot holds final styles, not opacity:0 states.
          inject: { prerender: true },
          // One route at a time, on purpose. Extra puppeteer tabs are background
          // tabs: document.visibilityState === "hidden" and requestAnimationFrame
          // never fires, so framer-motion never applies its final styles and the
          // snapshot keeps every entrance animation at `opacity: 0` (measured:
          // 0 frames in 2s on hidden tabs vs ~400 on the visible one).
          maxConcurrentRoutes: 1,
          // main.tsx dispatches this once React has committed and framer-motion
          // has had two frames to settle (with an 8s safety fallback). Faster and
          // more deterministic than a fixed renderAfterTime.
          renderAfterDocumentEvent: 'prerender-ready',
          // Block cross-origin (Google Fonts, gtag) during prerender — the SEO
          // tags we care about are first-party DOM mutations. Faster + avoids
          // consent-banner/cookie noise in the snapshot.
          skipThirdPartyRequests: true,
        }),
      }),
    ],
  }
})
