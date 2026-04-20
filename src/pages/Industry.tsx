import { useParams, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, Check, ArrowUpRight } from 'lucide-react'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { useContactModal } from '../hooks/useContactModal'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { SEOHead } from '../components/SEOHead'

const VALID_SLUGS = ['insurance', 'ecommerce', 'fitness'] as const
type ValidSlug = (typeof VALID_SLUGS)[number]

function isValidSlug(slug: string): slug is ValidSlug {
  return (VALID_SLUGS as readonly string[]).includes(slug)
}

export function Industry() {
  const { lang, slug } = useParams<{ lang: string; slug: string }>()
  useLanguageSync()

  const validSlug = slug && isValidSlug(slug) ? slug : 'insurance'
  usePageMeta(`industries.${validSlug}.meta.title`, `industries.${validSlug}.meta.description`)
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  if (!slug || !isValidSlug(slug)) {
    return <Navigate to={`/${lang || 'bg'}/`} replace />
  }

  const problems = [0, 1, 2, 3]
  const solutions = [0, 1, 2, 3]

  return (
    <>
      <SEOHead />
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <AnimatedSection>
          <Link
            to={`/${lang || 'bg'}/`}
            className="inline-flex items-center gap-2 text-lg font-bold hover:text-[#88cc33] transition-colors mb-10"
          >
            <ArrowLeft size={20} />
            {t('industries.backHome')}
          </Link>

          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t(`industries.${slug}.hero.badge`)}
          </span>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-6 max-w-4xl">
            {t(`industries.${slug}.hero.heading`)}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-700 font-medium max-w-3xl leading-relaxed">
            {t(`industries.${slug}.hero.subheading`)}
          </p>
        </AnimatedSection>
      </section>

      {/* Problems */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="mb-12 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-black text-[#B9FF66] text-sm font-black px-4 py-2 rounded-full mb-6">
                <AlertTriangle size={16} />
                {t(`industries.${slug}.problems.badge`)}
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
                {t(`industries.${slug}.problems.heading`)}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {problems.map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                  className="bg-white border-4 border-black rounded-[24px] p-6 brutalist-shadow-static"
                >
                  <div className="text-5xl font-black tracking-tighter text-zinc-300 leading-none mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-black tracking-tighter mb-2">
                    {t(`industries.${slug}.problems.items.${i}.title`)}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {t(`industries.${slug}.problems.items.${i}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="mb-12 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
                <Check size={16} strokeWidth={3} />
                {t(`industries.${slug}.solutions.badge`)}
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
                {t(`industries.${slug}.solutions.heading`)}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-20%' }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                  className="bg-[#B9FF66] border-4 border-black rounded-[24px] p-6 brutalist-shadow-static"
                >
                  <h3 className="text-xl font-black tracking-tighter mb-2">
                    {t(`industries.${slug}.solutions.items.${i}.title`)}
                  </h3>
                  <p className="text-zinc-800 leading-relaxed font-medium">
                    {t(`industries.${slug}.solutions.items.${i}.description`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Proof */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-black text-white border-4 border-black rounded-[40px] p-10 lg:p-16">
              <span className="text-[#B9FF66] text-sm font-black uppercase tracking-widest mb-4 inline-block">
                {t(`industries.${slug}.proof.badge`)}
              </span>
              <h3 className="text-3xl lg:text-4xl font-black tracking-tighter mb-6 max-w-3xl">
                {t(`industries.${slug}.proof.heading`)}
              </h3>
              <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl mb-4">
                {t(`industries.${slug}.proof.description`)}
              </p>
              <p className="text-sm text-zinc-500 italic">
                {t(`industries.${slug}.proof.flag`)}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#B9FF66] py-20 lg:py-28 border-t-4 border-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6">
              {t(`industries.${slug}.cta.heading`)}
            </h2>
            <p className="text-xl text-zinc-800 font-medium max-w-2xl mx-auto mb-10">
              {t(`industries.${slug}.cta.description`)}
            </p>
            <button
              onClick={() => openContactForm({ subject: 'general', source: `industry-${slug}-cta` })}
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-xl text-lg font-black border-2 border-black brutalist-shadow hover:shadow-none transition-shadow"
            >
              {t(`industries.${slug}.cta.button`)}
              <ArrowUpRight size={22} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
