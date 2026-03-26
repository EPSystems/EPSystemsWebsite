import { useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'

interface SEOHeadProps {
  breadcrumbs?: { name: string; url: string }[]
}

export function SEOHead({ breadcrumbs }: SEOHeadProps) {
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()

  useEffect(() => {
    const base = 'https://epsystems.bg'
    const pathWithoutLang = location.pathname.replace(/^\/(en|bg)/, '')

    // Hreflang tags
    const hreflangData = [
      { hreflang: 'bg', href: `${base}/bg${pathWithoutLang}` },
      { hreflang: 'en', href: `${base}/en${pathWithoutLang}` },
      { hreflang: 'x-default', href: `${base}/bg${pathWithoutLang}` },
    ]

    const hreflangEls: HTMLLinkElement[] = []
    hreflangData.forEach(({ hreflang, href }) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = hreflang
      link.href = href
      document.head.appendChild(link)
      hreflangEls.push(link)
    })

    // Breadcrumb schema
    let breadcrumbScript: HTMLScriptElement | null = null
    if (breadcrumbs && breadcrumbs.length > 0) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${base}${item.url}`,
        })),
      }
      breadcrumbScript = document.createElement('script')
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.setAttribute('data-breadcrumb-schema', 'true')
      breadcrumbScript.textContent = JSON.stringify(schema)
      document.head.appendChild(breadcrumbScript)
    }

    return () => {
      hreflangEls.forEach((el) => el.remove())
      if (breadcrumbScript) breadcrumbScript.remove()
    }
  }, [lang, location.pathname, breadcrumbs])

  return null
}
