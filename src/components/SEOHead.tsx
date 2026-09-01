import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BASE_URL = 'https://www.epsystems.org'
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`

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
 * Cleans up on unmount so SPA navigation doesn't leak stale tags.
 */
export function SEOHead({ breadcrumbs, title, description, image, type = 'website', alternates }: SEOHeadProps) {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const { i18n } = useTranslation()
  const currentLang = lang || (i18n.language === 'en' ? 'en' : 'bg')

  useEffect(() => {
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

    const elements: HTMLElement[] = []

    const upsertLink = (attrs: Record<string, string>) => {
      const link = document.createElement('link')
      for (const [k, v] of Object.entries(attrs)) link.setAttribute(k, v)
      document.head.appendChild(link)
      elements.push(link)
    }

    const upsertMeta = (name: string, content: string, useProperty = false) => {
      const meta = document.createElement('meta')
      meta.setAttribute(useProperty ? 'property' : 'name', name)
      meta.setAttribute('content', content)
      document.head.appendChild(meta)
      elements.push(meta)
    }

    // Canonical + hreflang
    upsertLink({ rel: 'canonical', href: currentUrl })
    upsertLink({ rel: 'alternate', hreflang: 'bg', href: bgUrl })
    upsertLink({ rel: 'alternate', hreflang: 'en', href: enUrl })
    upsertLink({ rel: 'alternate', hreflang: 'x-default', href: bgUrl })

    // Open Graph
    upsertMeta('og:type', type, true)
    upsertMeta('og:site_name', 'E&P Systems', true)
    upsertMeta('og:title', resolvedTitle, true)
    if (resolvedDescription) upsertMeta('og:description', resolvedDescription, true)
    upsertMeta('og:url', currentUrl, true)
    upsertMeta('og:image', resolvedImage, true)
    upsertMeta('og:locale', ogLocale, true)
    upsertMeta('og:locale:alternate', ogAltLocale, true)

    // Twitter
    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', resolvedTitle)
    if (resolvedDescription) upsertMeta('twitter:description', resolvedDescription)
    upsertMeta('twitter:image', resolvedImage)

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
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
      elements.push(script)
    }

    return () => {
      elements.forEach((el) => el.remove())
    }
  }, [currentLang, location.pathname, breadcrumbs, title, description, image, type, alternates])

  return null
}
