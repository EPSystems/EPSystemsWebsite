import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SEOHead } from '../components/SEOHead'
import { Check } from 'lucide-react'

type ServiceKey = 'webDev' | 'seo' | 'ecommerce' | 'ai'

const SERVICE_KEYS: ServiceKey[] = ['webDev', 'seo', 'ecommerce', 'ai']

const TIER_KEYS = ['starter', 'growth', 'pro'] as const

const FEATURE_COUNTS: Record<ServiceKey, number[]> = {
  webDev: [5, 5, 5],
  seo: [3, 5, 5],
  ecommerce: [3, 5, 5],
  ai: [3, 3, 3],
}

export function Pricing() {
  const lang = useLanguageSync()
  usePageMeta('pricing.meta.title', 'pricing.meta.description')
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()
  const [activeService, setActiveService] = useState<ServiceKey>('webDev')

  const contactSources: Record<ServiceKey, string> = {
    webDev: 'software',
    seo: 'seo',
    ecommerce: 'ecommerce',
    ai: 'ai',
  }

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: t('nav.home', { defaultValue: 'Home' }), url: `/${lang}/` },
          { name: t('nav.pricing'), url: `/${lang}/pricing` },
        ]}
      />
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('pricing.hero.badge')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('pricing.hero.heading')}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('pricing.hero.subheading')}
          </p>
        </AnimatedSection>
      </section>

      {/* Service Selector Tabs */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <AnimatedSection>
          <div className="flex flex-wrap gap-4">
            {SERVICE_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setActiveService(key)}
                className={`px-6 py-3 rounded-xl text-base transition-colors duration-200 ${
                  activeService === key
                    ? 'bg-[#B9FF66] border-2 border-black font-black'
                    : 'bg-white border-2 border-black font-bold hover:bg-zinc-100'
                }`}
              >
                {t(`pricing.tabs.${key}`)}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20 lg:pb-28">
        <motion.div
          key={activeService}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {TIER_KEYS.map((tier, i) => {
            const isHighlighted = tier === 'growth'
            const featureCount = FEATURE_COUNTS[activeService][i]

            return (
              <div
                key={tier}
                className={`relative rounded-[30px] border-4 p-8 ${
                  isHighlighted
                    ? 'border-[#B9FF66] bg-white brutalist-shadow'
                    : 'border-black bg-white'
                }`}
              >
                {isHighlighted && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#B9FF66] text-black text-sm font-black px-4 py-1 rounded-full border-2 border-black whitespace-nowrap">
                    {t('pricing.mostPopular')}
                  </span>
                )}

                <h3 className="text-2xl font-black tracking-tight mb-2">
                  {t(`pricing.tiers.${tier}`)}
                </h3>
                <p className="text-3xl lg:text-4xl font-black tracking-tighter mb-6 text-black">
                  {t(`pricing.services.${activeService}.${tier}.price`)}
                </p>

                <ul className="space-y-3 mb-8">
                  {Array.from({ length: featureCount }, (_, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#B9FF66] rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-black">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-zinc-700 text-base leading-relaxed">
                        {t(`pricing.services.${activeService}.${tier}.features.${fi}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    openContactForm({
                      subject: contactSources[activeService],
                      source: `pricing-${activeService}-${tier}`,
                    })
                  }
                  className={`w-full py-3 rounded-xl text-base font-black transition-colors duration-300 border-2 ${
                    isHighlighted
                      ? 'bg-[#B9FF66] border-black hover:bg-black hover:text-[#B9FF66]'
                      : 'bg-black text-white border-black hover:bg-[#B9FF66] hover:text-black'
                  }`}
                >
                  {t('pricing.cta.cardButton')}
                </button>
              </div>
            )
          })}
        </motion.div>
      </section>

      {/* Pricing Notes */}
      <section className="bg-zinc-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg lg:text-xl text-zinc-600 font-bold leading-relaxed">
                {t('pricing.notes')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6">
              {t('pricing.cta.heading')}
            </h2>
            <p className="text-xl text-zinc-400 font-bold max-w-2xl mx-auto mb-10">
              {t('pricing.cta.description')}
            </p>
            <button
              onClick={() =>
                openContactForm({ subject: 'general', source: 'pricing-cta-bottom' })
              }
              className="bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
            >
              {t('pricing.cta.button')}
            </button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
