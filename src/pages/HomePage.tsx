import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { useServices } from '../hooks/useServices'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Services } from '../components/sections/Services'
import { ServiceDetail } from '../components/sections/ServiceDetail'
import { CaseStudies } from '../components/sections/CaseStudies'
import { CTA } from '../components/sections/CTA'
import { Search, ShoppingCart, Bot } from 'lucide-react'

const detailConfig = [
  { id: 'seo', labelKey: 'serviceDetail.labels.seo', icon: Search, variant: 'left-dark' as const },
  { id: 'ecommerce', labelKey: 'serviceDetail.labels.ecommerce', icon: ShoppingCart, variant: 'right-boxed' as const },
  { id: 'ai', labelKey: 'serviceDetail.labels.ai', icon: Bot, variant: 'left-lime' as const },
]

export function HomePage() {
  useLanguageSync()
  const { t } = useTranslation()
  const services = useServices()

  const detailSections = detailConfig
    .map(({ id, labelKey, icon, variant }) => {
      const service = services.find((s) => s.id === id)
      return service ? { service, labelKey, icon, variant } : null
    })
    .filter(Boolean) as { service: (typeof services)[number]; labelKey: string; icon: typeof Search; variant: 'left-dark' | 'right-boxed' | 'left-lime' }[]

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      {detailSections.map(({ service, labelKey, icon, variant }) => (
        <ServiceDetail
          key={service.id}
          id={service.id}
          icon={icon}
          label={t(labelKey)}
          headline={service.detailHeadline!}
          description={service.detailDescription!}
          features={service.features}
          ctaText={service.ctaText!}
          variant={variant}
        />
      ))}
      <CTA />
      <CaseStudies />
      <Footer />
    </>
  )
}
