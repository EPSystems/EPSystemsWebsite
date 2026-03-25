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
  { id: 'seo', icon: Search, variant: 'left-dark' as const },
  { id: 'ecommerce', icon: ShoppingCart, variant: 'right-boxed' as const },
  { id: 'ai', icon: Bot, variant: 'left-lime' as const },
]

export function HomePage() {
  useLanguageSync()
  const services = useServices()

  const detailSections = detailConfig
    .map(({ id, icon, variant }) => {
      const service = services.find((s) => s.id === id)
      return service ? { service, icon, variant } : null
    })
    .filter(Boolean) as { service: (typeof services)[number]; icon: typeof Search; variant: 'left-dark' | 'right-boxed' | 'left-lime' }[]

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      {detailSections.map(({ service, icon, variant }) => (
        <ServiceDetail
          key={service.id}
          id={service.id}
          icon={icon}
          label={service.title}
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
