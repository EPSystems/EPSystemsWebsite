import { useParams, Link } from 'react-router-dom'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { motion } from 'framer-motion'
import { Code2, ShoppingCart, Search, Bot, FileText, Wrench, ArrowUpRight, Cpu, Globe, Layers, DollarSign } from 'lucide-react'

const services = [
  { key: 'webDev', icon: Code2, href: 'software', enabled: true },
  { key: 'ecommerce', icon: ShoppingCart, href: 'ecommerce', enabled: true },
  { key: 'seo', icon: Search, href: 'seo', enabled: true },
  { key: 'ai', icon: Bot, href: 'ai', enabled: true },
  { key: 'landing', icon: FileText, href: 'landing', enabled: true },
  { key: 'maintenance', icon: Wrench, href: 'maintenance', enabled: true },
] as const

const differentiators = [
  { key: 'engineering', icon: Cpu },
  { key: 'bilingual', icon: Globe },
  { key: 'fullStack', icon: Layers },
  { key: 'pricing', icon: DollarSign },
] as const

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
}

export function Services() {
  const { lang } = useParams<{ lang: string }>()
  useLanguageSync()
  usePageMeta('servicesHub.meta.title', 'servicesHub.meta.description')
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('servicesHub.hero.badge')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('servicesHub.hero.heading')}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('servicesHub.hero.subheading')}
          </p>
        </AnimatedSection>
      </section>

      {/* Service Grid */}
      <section className="bg-zinc-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12">
              {t('servicesHub.grid.heading')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(({ key, icon: Icon, href, enabled }, i) => {
                const card = (
                  <motion.div
                    key={key}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    className={`bg-zinc-100 border-4 border-black rounded-[30px] p-8 brutalist-shadow transition-transform duration-300 ${
                      enabled
                        ? 'hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#B9FF66] cursor-pointer'
                        : 'opacity-70 cursor-default'
                    }`}
                  >
                    <div className="w-14 h-14 bg-[#B9FF66] rounded-xl flex items-center justify-center mb-6 border-2 border-black">
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-3">
                      {t(`servicesHub.grid.cards.${key}.title`)}
                    </h3>
                    <p className="text-zinc-600 text-lg leading-relaxed mb-6">
                      {t(`servicesHub.grid.cards.${key}.description`)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 text-lg font-black ${
                        enabled ? 'text-black' : 'text-zinc-400'
                      }`}
                    >
                      {enabled
                        ? t('servicesHub.grid.learnMore')
                        : t('servicesHub.grid.comingSoon')}
                      {enabled && <ArrowUpRight size={20} strokeWidth={2.5} />}
                    </span>
                  </motion.div>
                )

                if (enabled) {
                  return (
                    <Link key={key} to={`/${lang || 'en'}/services/${href}`} className="block">
                      {card}
                    </Link>
                  )
                }

                return card
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12">
              {t('servicesHub.whyUs.heading')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {differentiators.map(({ key, icon: Icon }, i) => (
                <motion.div
                  key={key}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardVariants}
                  className="bg-zinc-100 border-4 border-black rounded-[30px] p-8 brutalist-shadow"
                >
                  <div className="w-14 h-14 bg-[#B9FF66] rounded-xl flex items-center justify-center mb-6 border-2 border-black">
                    <Icon size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-3">
                    {t(`servicesHub.whyUs.items.${key}.title`)}
                  </h3>
                  <p className="text-zinc-600 text-base leading-relaxed">
                    {t(`servicesHub.whyUs.items.${key}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6">
              {t('servicesHub.cta.heading')}
            </h2>
            <p className="text-xl text-zinc-400 font-bold max-w-2xl mx-auto mb-10">
              {t('servicesHub.cta.description')}
            </p>
            <button
              onClick={() => openContactForm({ subject: 'general', source: 'services-hub-cta' })}
              className="bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
            >
              {t('servicesHub.cta.button')}
            </button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
