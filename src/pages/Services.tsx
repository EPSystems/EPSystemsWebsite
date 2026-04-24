import { useParams, Link } from 'react-router-dom'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { motion } from 'framer-motion'
import { SEOHead } from '../components/SEOHead'
import { Globe, Workflow, Bot, Search, ShoppingCart, ArrowUpRight, Cpu, Rocket, Users, Eye } from 'lucide-react'

const services = [
  { key: 'aiWebsites', icon: Globe, href: 'ai-websites' },
  { key: 'aiAutomation', icon: Workflow, href: 'ai-automation' },
  { key: 'aiAgents', icon: Bot, href: 'ai-agents' },
  { key: 'aiSeo', icon: Search, href: 'ai-seo' },
  { key: 'aiEcommerce', icon: ShoppingCart, href: 'ai-ecommerce' },
] as const

const differentiators = [
  { key: 'engineering', icon: Cpu },
  { key: 'production', icon: Rocket },
  { key: 'founders', icon: Users },
  { key: 'transparent', icon: Eye },
] as const

const processSteps = [0, 1, 2, 3] as const

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

  const breadcrumbs = [
    { name: t('nav.home', { defaultValue: 'Home' }), url: `/${lang || 'bg'}/` },
    { name: t('nav.services'), url: `/${lang || 'bg'}/services` },
  ]

  return (
    <>
      <SEOHead
        breadcrumbs={breadcrumbs}
        title={t('servicesHub.meta.title')}
        description={t('servicesHub.meta.description')}
      />
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
          <p className="mt-6 text-lg text-zinc-700 font-medium max-w-3xl leading-relaxed">
            {t('servicesHub.hero.intro')}
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
              {services.map(({ key, icon: Icon, href }, i) => (
                <Link key={key} to={`/${lang || 'bg'}/services/${href}`} className="block">
                  <motion.div
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    className="bg-zinc-100 border-4 border-black rounded-[30px] p-8 brutalist-shadow transition-transform duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#B9FF66] cursor-pointer h-full flex flex-col"
                  >
                    <div className="w-14 h-14 bg-[#B9FF66] rounded-xl flex items-center justify-center mb-6 border-2 border-black">
                      <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-3">
                      {t(`servicesHub.grid.cards.${key}.title`)}
                    </h3>
                    <p className="text-zinc-600 text-lg leading-relaxed mb-6 flex-1">
                      {t(`servicesHub.grid.cards.${key}.description`)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-lg font-black text-black">
                      {t('servicesHub.grid.learnMore')}
                      <ArrowUpRight size={20} strokeWidth={2.5} />
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How We Work — 4 steps */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-zinc-100 rounded-[50px] border-4 border-black p-10 lg:p-16 brutalist-shadow-static">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-12">
                {t('servicesHub.howWeWork.heading')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] border-t-4 border-dashed border-black" />

                {processSteps.map((i) => (
                  <div key={i} className="relative text-center lg:text-left">
                    <span className="text-6xl font-black text-[#B9FF66] leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-black tracking-tighter mt-4 mb-2">
                      {t(`servicesHub.howWeWork.steps.${i}.title`)}
                    </h3>
                    <p className="text-zinc-600">
                      {t(`servicesHub.howWeWork.steps.${i}.description`)}
                    </p>
                  </div>
                ))}
              </div>
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
