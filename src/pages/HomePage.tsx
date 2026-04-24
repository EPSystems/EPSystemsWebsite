import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { Marquee } from '../components/sections/Marquee'
import { Services } from '../components/sections/Services'
import { Results } from '../components/sections/Results'
import { WhyUs } from '../components/sections/WhyUs'
import { Team } from '../components/sections/Team'
import { CTA } from '../components/sections/CTA'
import { Testimonials } from '../components/sections/Testimonials'
import { TrustedBy } from '../components/sections/TrustedBy'
import { SEOHead } from '../components/SEOHead'

export function HomePage() {
  useLanguageSync()
  usePageMeta('meta.title', 'meta.description')

  return (
    <>
      <SEOHead />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Results />
      <WhyUs />
      <Testimonials />
      <TrustedBy />
      <Team />
      <CTA />
      <Footer />
    </>
  )
}
