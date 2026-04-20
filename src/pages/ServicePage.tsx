import { useParams, Navigate } from 'react-router-dom'
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
import { ServiceCTA } from '../components/sections/ServiceCTA'
import { SEOHead } from '../components/SEOHead'

const VALID_SLUGS = [
  'ai-websites',
  'ai-automation',
  'ai-agents',
  'ai-seo',
  'ai-ecommerce',
] as const
type ValidSlug = (typeof VALID_SLUGS)[number]

// Preserve legacy URLs as 301-style redirects to the new AI pillar equivalents
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

  const validSlug = slug && isValidSlug(slug) ? slug : 'ai-websites'
  usePageMeta(`servicePages.${validSlug}.meta.title`, `servicePages.${validSlug}.meta.description`)

  if (slug && LEGACY_REDIRECTS[slug]) {
    return <Navigate to={`/${lang || 'bg'}/services/${LEGACY_REDIRECTS[slug]}`} replace />
  }

  if (!slug || !isValidSlug(slug)) {
    return <Navigate to={`/${lang || 'bg'}/services`} replace />
  }

  return (
    <>
      <SEOHead />
      <Navbar />
      <ServiceHero slug={slug} />
      <ServiceFeatures slug={slug} />
      <ServicePersonas slug={slug} />
      <ServiceProcess slug={slug} />
      <ServiceCaseStudy slug={slug} />
      <ServicePricing slug={slug} />
      <ServiceFAQ slug={slug} />
      <ServiceCTA slug={slug} />
      <Footer />
    </>
  )
}
