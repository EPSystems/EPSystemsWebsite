import { useParams, Navigate } from 'react-router-dom'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ServiceHero } from '../components/sections/ServiceHero'
import { ServiceFeatures } from '../components/sections/ServiceFeatures'
import { ServiceProcess } from '../components/sections/ServiceProcess'
import { ServiceFAQ } from '../components/sections/ServiceFAQ'
import { ServiceCTA } from '../components/sections/ServiceCTA'
import { SEOHead } from '../components/SEOHead'

const VALID_SLUGS = ['seo', 'ecommerce', 'ai', 'software', 'landing', 'maintenance'] as const
type ValidSlug = (typeof VALID_SLUGS)[number]

function isValidSlug(slug: string): slug is ValidSlug {
  return (VALID_SLUGS as readonly string[]).includes(slug)
}

export function ServicePage() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  useLanguageSync()

  const validSlug = slug && isValidSlug(slug) ? slug : 'seo'
  usePageMeta(`servicePages.${validSlug}.meta.title`, `servicePages.${validSlug}.meta.description`)

  if (!slug || !isValidSlug(slug)) {
    return <Navigate to={`/${lang || 'bg'}/`} replace />
  }

  return (
    <>
      <SEOHead />
      <Navbar />
      <ServiceHero slug={slug} />
      <ServiceFeatures slug={slug} />
      <ServiceProcess slug={slug} />
      <ServiceFAQ slug={slug} />
      <ServiceCTA slug={slug} />
      <Footer />
    </>
  )
}
