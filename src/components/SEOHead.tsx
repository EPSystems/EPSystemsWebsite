import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BASE_URL = 'https://www.epsystems.org'
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`

/** Marker attribute so we can find (and replace) the tags this component owns. */
const OWNED = 'data-seo-head'

interface Breadcrumb {
  name: string
  url: string
}

interface SEOHeadProps {
  breadcrumbs?: Breadcrumb[]
  /** Optional explicit title — if omitted, document.title is used. */
  title?: string
  /** Optional explicit description — if omitted, the existing meta[name=description] is used. */
  description?: string
  /** Absolute URL to an og:image. Defaults to the site logo. */
  image?: string
  /** og:type — "website" for hubs, "article" for blog posts. */
  type?: 'website' | 'article'
  /**
   * Explicit per-locale path overrides for hreflang, used when the BG and EN
   * paths for the same content differ (e.g. blog posts whose slugs differ by
   * language). Values are locale-agnostic paths like "/blog/ai-for-insurance-brokers".
   * When omitted, hreflang is derived from the current path (correct only when
   * both locales share the slug).
   */
  alternates?: {
    bg?: string
    en?: string
  }
}

/**
 * Imperatively injects per-page SEO tags:
 *   - canonical + hreflang (bg, en, x-default)
 *   - Open Graph (og:*) + Twitter card
 *   - BreadcrumbList JSON-LD (when breadcrumbs provided)
 *
 * Idempotent: any previously injected set (including one baked into the
 * prerendered HTML) is removed before the new set is written, so the live
 * document never carries two canonicals or two og:title tags.
 *
 * Timing: React runs a child's effects before its parent's, so if this
 * component read document.title synchronously it would see the *previous*
 * page's title (the parent page's usePageMeta effect hasn't run yet). The
 * injection is therefore deferred by one microtask — still before paint and
 * long before any crawler snapshot.
 *
 * Cleans up on unmount so SPA navigation doesn't leak stale tags.
 */
export function SEOHead({ breadcrumbs, title, description, image, type = 'website', alternates }: SEOHeadProps) {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const { i18n } = useTranslation()
  const currentLang = lang || (i18n.language === 'en' ? 'en' : 'bg')

  useEffect(() => {
    let cancelled = false
    const elements: HTMLElement[] = []

    const inject = () => {
      if (cancelled) return

      // Remove any earlier set (prerendered markup or a previous render).
      document.head.querySelectorAll(`[${OWNED}]`).forEach((el) => el.remove())

      const pathWithoutLang = location.pathname.replace(/^\/(en|bg)/, '')
      // When the BG and EN paths differ (different slugs), callers pass the
      // correct counterpart path via `alternates`. Fall back to the current path
      // — only correct when both locales share the slug.
      const bgPath = alternates?.bg ?? pathWithoutLang
      const enPath = alternates?.en ?? pathWithoutLang
      const currentUrl =
        currentLang === 'bg' ? `${BASE_URL}/bg${bgPath}` : `${BASE_URL}/en${enPath}`
      const bgUrl = `${BASE_URL}/bg${bgPath}`
      const enUrl = `${BASE_URL}/en${enPath}`
      const ogLocale = currentLang === 'bg' ? 'bg_BG' : 'en_US'
      const ogAltLocale = currentLang === 'bg' ? 'en_US' : 'bg_BG'

      const resolvedTitle = title ?? document.title
      const descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      const resolvedDescription = description ?? descMeta?.content ?? ''
      const resolvedImage = image ?? DEFAULT_OG_IMAGE

      const addLink = (attrs: Record<string, string>) => {
        const link = document.createElement('link')
        for (const [k, v] of Object.entries(attrs)) link.setAttribute(k, v)
        link.setAttribute(OWNED, '')
        document.head.appendChild(link)
        elements.push(link)
      }

      const addMeta = (name: string, content: string, useProperty = false) => {
        const meta = document.createElement('meta')
        meta.setAttribute(useProperty ? 'property' : 'name', name)
        meta.setAttribute('content', content)
        meta.setAttribute(OWNED, '')
        document.head.appendChild(meta)
        elements.push(meta)
      }

      // Canonical + hreflang
      addLink({ rel: 'canonical', href: currentUrl })
      addLink({ rel: 'alternate', hreflang: 'bg', href: bgUrl })
      addLink({ rel: 'alternate', hreflang: 'en', href: enUrl })
      addLink({ rel: 'alternate', hreflang: 'x-default', href: bgUrl })

      // Open Graph
      addMeta('og:type', type, true)
      addMeta('og:site_name', 'E&P Systems', true)
      addMeta('og:title', resolvedTitle, true)
      if (resolvedDescription) addMeta('og:description', resolvedDescription, true)
      addMeta('og:url', currentUrl, true)
      addMeta('og:image', resolvedImage, true)
      addMeta('og:locale', ogLocale, true)
      addMeta('og:locale:alternate', ogAltLocale, true)

      // Twitter
      addMeta('twitter:card', 'summary_large_image')
      addMeta('twitter:title', resolvedTitle)
      if (resolvedDescription) addMeta('twitter:description', resolvedDescription)
      addMeta('twitter:image', resolvedImage)

      // Breadcrumb schema
      if (breadcrumbs && breadcrumbs.length > 0) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
          })),
        }
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-breadcrumb-schema', 'true')
        script.setAttribute(OWNED, '')
        script.textContent = JSON.stringify(schema)
        document.head.appendChild(script)
        elements.push(script)
      }
    }

    queueMicrotask(inject)

    return () => {
      cancelled = true
      elements.forEach((el) => el.remove())
    }
  }, [currentLang, location.pathname, breadcrumbs, title, description, image, type, alternates])

  return null
}
