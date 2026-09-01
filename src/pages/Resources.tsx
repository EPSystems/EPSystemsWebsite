import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { SEOHead } from '../components/SEOHead'
import { ArrowRight } from 'lucide-react'

// Lead-magnet placeholders. Each maps to a USER-track deliverable (A4.9/A4.10):
// the gated PDF content. The page is live so the route + schema exist for
// crawlers; the download wiring (Mailchimp/ConvertKit form) lands with content.
const RESOURCES = [
  {
    key: 'automationAudit',
    status: 'comingSoon' as const,
    userTrack: 'A4.9',
  },
  {
    key: 'insurancePlaybook',
    status: 'comingSoon' as const,
    userTrack: 'A4.10',
  },
]

export function Resources() {
  const lang = useLanguageSync()
  usePageMeta('resources.meta.title', 'resources.meta.description')
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  const homeLabel = t('nav.home', { defaultValue: 'Home' })

  const breadcrumbs = [
    { name: homeLabel, url: `/${lang}/` },
    { name: t('resources.hero.badge', { defaultValue: 'Resources' }), url: `/${lang}/resources` },
  ]

  return (
    <>
      <SEOHead breadcrumbs={breadcrumbs} />

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('resources.hero.badge', { defaultValue: 'Resources' })}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('resources.hero.heading', { defaultValue: 'Free AI resources' })}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('resources.hero.subheading', {
              defaultValue:
                'Practical, no-fluff guides and checklists for Bulgarian and European businesses adopting AI.',
            })}
          </p>
        </AnimatedSection>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 lg:pb-28">
        <div className="grid md:grid-cols-2 gap-8">
          {RESOURCES.map((r) => (
            <AnimatedSection key={r.key}>
              <div className="bg-white border-4 border-black rounded-[30px] overflow-hidden brutalist-shadow flex flex-col">
                <div className="aspect-video bg-zinc-900 border-b-2 border-[#B9FF66] flex items-center justify-center">
                  <span className="text-zinc-500 font-bold text-sm tracking-tight uppercase">
                    {t(`resources.items.${r.key}.tagline`, { defaultValue: r.key })}
                  </span>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-black tracking-tight mb-3">
                    {t(`resources.items.${r.key}.name`, { defaultValue: r.key })}
                  </h2>
                  <p className="text-zinc-600 font-medium leading-relaxed mb-6 flex-1">
                    {t(`resources.items.${r.key}.description`, { defaultValue: '' })}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-zinc-400 bg-zinc-100 border-2 border-zinc-300 rounded-full px-4 py-2 w-fit">
                    {t('resources.comingSoon', { defaultValue: 'Coming soon' })}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <AnimatedSection>
          <div className="bg-black border-4 border-black rounded-[30px] p-10 lg:p-14 text-center brutalist-shadow-static">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white mb-4">
              {t('resources.cta.heading', { defaultValue: "Can't wait?" })}
            </h2>
            <p className="text-lg text-zinc-400 font-bold max-w-2xl mx-auto mb-8">
              {t('resources.cta.description', {
                defaultValue:
                  'Tell us where your team loses hours. We will send a prioritized AI opportunity map — no commitment.',
              })}
            </p>
            <button
              onClick={() => openContactForm({ subject: 'general', source: 'resources-cta' })}
              className="inline-flex items-center gap-2 bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
            >
              {t('resources.cta.button', { defaultValue: 'Talk to us' })}
              <ArrowRight size={18} />
            </button>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </>
  )
}
