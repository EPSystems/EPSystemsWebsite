import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

const BASE_URL = 'https://epsystems.bg'

interface SEOHeadProps {
  breadcrumbs?: { name: string; url: string }[]
}

export function SEOHead({ breadcrumbs }: SEOHeadProps) {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()

  useEffect(() => {
    const pathWithoutLang = location.pathname.replace(/^\/(en|bg)/, '')
    const elements: HTMLElement[] = []

    // Canonical URL
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${BASE_URL}/${lang}${pathWithoutLang}`
    document.head.appendChild(canonical)
    elements.push(canonical)

    // Hreflang tags
    const hreflangData = [
      { hreflang: 'bg', href: `${BASE_URL}/bg${pathWithoutLang}` },
      { hreflang: 'en', href: `${BASE_URL}/en${pathWithoutLang}` },
      { hreflang: 'x-default', href: `${BASE_URL}/bg${pathWithoutLang}` },
    ]

    hreflangData.forEach(({ hreflang, href }) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = hreflang
      link.href = href
      document.head.appendChild(link)
      elements.push(link)
    })

    // Breadcrumb schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${BASE_URL}${item.url}`,
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
  }, [lang, location.pathname, breadcrumbs])

  return null
}
