import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Services } from '../components/sections/Services'
import { CaseStudies } from '../components/sections/CaseStudies'
import { CTA } from '../components/sections/CTA'

export function HomePage() {
  useLanguageSync()
  usePageMeta('meta.title', 'meta.description')

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <CTA />
      <CaseStudies />
      <Footer />
    </>
  )
}
