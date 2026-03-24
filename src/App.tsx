import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Services } from './components/sections/Services'
import { ServiceDetail } from './components/sections/ServiceDetail'
import { CaseStudies } from './components/sections/CaseStudies'
import { CTA } from './components/sections/CTA'
import { services } from './data/services'
import { Search, ShoppingCart, Bot } from 'lucide-react'

const detailSections = [
  {
    service: services.find(s => s.id === 'seo')!,
    icon: Search,
    variant: 'left-dark' as const,
    label: 'SEO Services',
  },
  {
    service: services.find(s => s.id === 'ecommerce')!,
    icon: ShoppingCart,
    variant: 'right-boxed' as const,
    label: 'E-Commerce',
  },
  {
    service: services.find(s => s.id === 'ai')!,
    icon: Bot,
    variant: 'left-lime' as const,
    label: 'AI & Automation',
  },
]

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      {detailSections.map(({ service, icon, variant, label }) => (
        <ServiceDetail
          key={service.id}
          id={service.id}
          icon={icon}
          label={label}
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

export default App
