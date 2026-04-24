import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ServiceHero } from '../components/sections/ServiceHero'
import { ServiceFeatures } from '../components/sections/ServiceFeatures'
import { ServicePersonas } from '../components/sections/ServicePersonas'
import { ServiceProcess } from '../components/sections/ServiceProcess'
import { ServiceCaseStudy } from '../components/sections/ServiceCaseStudy'
import { ServicePricing } from '../components/sections/ServicePricing'
import { ServiceFAQ } from '../components/sections/ServiceFAQ'
import { ServiceRelated } from '../components/sections/ServiceRelated'
import { ServiceCTA } from '../components/sections/ServiceCTA'
import { SEOHead } from '../components/SEOHead'

const BASE_URL = 'https://epsystems.bg'

const VALID_SLUGS = [
  'ai-websites',
  'ai-automation',
  'ai-agents',
  'ai-seo',
  'ai-ecommerce',
] as const
type ValidSlug = (typeof VALID_SLUGS)[number]

const LEGACY_REDIRECTS: Record<string, ValidSlug> = {
  seo: 'ai-seo',
  software: 'ai-websites',
  ecommerce: 'ai-ecommerce',
  ai: 'ai-automation',
  landing: 'ai-websites',
  maintenance: 'ai-websites',
}

function isValidSlug(slug: string): slug is ValidSlug {
  return (VALID_SLUGS as readonly string[]).includes(slug)
}

export function ServicePage() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  useLanguageSync()
  const { t } = useTranslation()

  const language = (lang === 'en' ? 'en' : 'bg') as 'bg' | 'en'
  const validSlug = slug && isValidSlug(slug) ? slug : 'ai-websites'
  usePageMeta(`servicePages.${validSlug}.meta.title`, `servicePages.${validSlug}.meta.description`)

  // Service schema — one per subpage, linked to Organization
  useEffect(() => {
    if (!slug || !isValidSlug(slug)) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: t(`servicePages.${slug}.hero.heading`),
      description: t(`servicePages.${slug}.hero.subheading`),
      url: `${BASE_URL}/${language}/services/${slug}`,
      inLanguage: language === 'bg' ? 'bg-BG' : 'en-US',
      provider: {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'E&P Systems',
        url: BASE_URL,
      },
      areaServed: ['BG', 'EU'],
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-service-schema', slug)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      const existing = document.querySelector(`script[data-service-schema="${slug}"]`)
      if (existing) existing.remove()
    }
  }, [slug, language, t])

  if (slug && LEGACY_REDIRECTS[slug]) {
    return <Navigate to={`/${lang || 'bg'}/services/${LEGACY_REDIRECTS[slug]}`} replace />
  }

  if (!slug || !isValidSlug(slug)) {
    return <Navigate to={`/${lang || 'bg'}/services`} replace />
  }

  const breadcrumbs = [
    { name: t('nav.home', { defaultValue: 'Home' }), url: `/${language}/` },
    { name: t('nav.services'), url: `/${language}/services` },
    { name: t(`servicePages.${slug}.hero.badge`), url: `/${language}/services/${slug}` },
  ]

  return (
    <>
      <SEOHead
        breadcrumbs={breadcrumbs}
        title={t(`servicePages.${slug}.meta.title`)}
        description={t(`servicePages.${slug}.meta.description`)}
      />
      <Navbar />
      <ServiceHero slug={slug} />
      <ServiceFeatures slug={slug} />
      <ServicePersonas slug={slug} />
      <ServiceProcess slug={slug} />
      <ServiceCaseStudy slug={slug} />
      <ServicePricing slug={slug} />
      <ServiceFAQ slug={slug} />
      <ServiceRelated slug={slug} />
      <ServiceCTA slug={slug} />
      <Footer />
    </>
  )
}
