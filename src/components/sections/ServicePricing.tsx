import { useTranslation } from 'react-i18next'
import { useContactModal } from '../../hooks/useContactModal'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServicePricingProps {
  slug: string
}

export function ServicePricing({ slug }: ServicePricingProps) {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <div className="bg-zinc-100 border-4 border-black rounded-[40px] p-10 lg:p-14 brutalist-shadow-static">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-tight mb-4">
                {t(`servicePages.${slug}.pricing.heading`)}
              </h2>
              <p className="text-lg text-zinc-700 font-medium leading-relaxed mb-4">
                {t(`servicePages.${slug}.pricing.description`)}
              </p>
              <p className="text-sm text-zinc-500 italic">
                {t(`servicePages.${slug}.pricing.flag`)}
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end">
              <div className="bg-[#B9FF66] border-4 border-black rounded-[30px] px-8 py-6 brutalist-shadow-static w-full">
                <div className="text-sm font-black uppercase tracking-widest mb-2">
                  {t(`servicePages.${slug}.pricing.rangeLabel`)}
                </div>
                <div className="text-4xl lg:text-5xl font-black tracking-tighter">
                  {t(`servicePages.${slug}.pricing.range`)}
                </div>
              </div>
              <button
                onClick={() => openContactForm({ subject: slug, source: `service-${slug}-pricing` })}
                className="mt-6 bg-black text-white text-lg font-black px-8 py-4 rounded-xl border-2 border-black brutalist-shadow hover:shadow-none transition-shadow"
              >
                {t(`servicePages.${slug}.pricing.button`)}
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
