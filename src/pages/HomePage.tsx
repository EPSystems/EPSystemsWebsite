import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Services } from '../components/sections/Services'
import { CaseStudies } from '../components/sections/CaseStudies'
import { Team } from '../components/sections/Team'
import { CTA } from '../components/sections/CTA'
import { Testimonials } from '../components/sections/Testimonials'
import { TrustedBy } from '../components/sections/TrustedBy'

export function HomePage() {
  useLanguageSync()
  usePageMeta('meta.title', 'meta.description')

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Testimonials />
      <TrustedBy />
      <CaseStudies />
      <Team />
      <CTA />
      <Footer />
    </>
  )
}
