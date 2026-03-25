import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import { useContactModal } from '../../hooks/useContactModal'

interface ServiceCTAProps {
  slug: string
}

export function ServiceCTA({ slug }: ServiceCTAProps) {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-6">
            {t(`servicePages.${slug}.cta.heading`)}
          </h2>
          <p className="text-xl text-zinc-600 font-medium mb-10">
            {t(`servicePages.${slug}.cta.description`)}
          </p>
          <button
            onClick={() => openContactForm({ subject: slug, source: `service-${slug}-cta` })}
            className="inline-block bg-[#B9FF66] border-4 border-black rounded-xl px-10 py-5 text-xl font-black brutalist-shadow hover:shadow-none transition-shadow"
          >
            {t(`servicePages.${slug}.cta.button`)}
          </button>
        </div>
      </AnimatedSection>
    </section>
  )
}
