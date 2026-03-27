import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import { useContactModal } from '../../hooks/useContactModal'

export function CTA() {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 pb-24">
      <AnimatedSection>
        <div className="bg-zinc-100 p-10 lg:p-16 rounded-[40px] border-4 border-black brutalist-shadow flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#B9FF66] border-4 border-black rounded-full opacity-50 z-0" />
          <div className="max-w-2xl relative z-10">
            <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6">{t('cta.heading')}</h3>
            <p className="text-xl text-zinc-700 font-medium">
              {t('cta.description')}
            </p>
          </div>
          <button
            onClick={() => openContactForm({ subject: 'general', source: 'homepage-cta' })}
            className="bg-black text-white text-lg sm:text-xl font-bold px-6 sm:px-10 py-5 rounded-2xl brutalist-shadow border-4 border-black hover:bg-zinc-800 transition-colors relative z-10 w-full md:w-auto text-center"
          >
            {t('cta.button')}
          </button>
        </div>
      </AnimatedSection>
    </section>
  )
}
