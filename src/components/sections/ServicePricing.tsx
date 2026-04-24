import { useTranslation } from 'react-i18next'
import { useContactModal } from '../../hooks/useContactModal'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServicePricingProps {
  slug: string
}

export function ServicePricing({ slug }: ServicePricingProps) {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()
  const flag = t(`servicePages.${slug}.pricing.flag`)
  const rangeLabel = t(`servicePages.${slug}.pricing.rangeLabel`)
  const range = t(`servicePages.${slug}.pricing.range`)

  // When rangeLabel is empty, the "range" is a CTA phrase
  // (e.g. "Request a consultation"), not a price. Merge the lime
  // card and the action button so clicking the prominent lime
  // element actually opens the contact form.
  const rangeIsCta = !rangeLabel || rangeLabel.trim() === ''
  const openForm = () =>
    openContactForm({ subject: slug, source: `service-${slug}-pricing` })

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
              {flag && flag.trim() !== '' && (
                <p className="text-sm text-zinc-500 italic">{flag}</p>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end">
              {rangeIsCta ? (
                <button
                  onClick={openForm}
                  className="bg-[#B9FF66] border-4 border-black rounded-[30px] px-8 py-6 brutalist-shadow hover:shadow-none transition-shadow w-full text-left cursor-pointer"
                >
                  <div className="text-4xl lg:text-5xl font-black tracking-tighter">
                    {range}
                  </div>
                </button>
              ) : (
                <>
                  <div className="bg-[#B9FF66] border-4 border-black rounded-[30px] px-8 py-6 brutalist-shadow-static w-full">
                    <div className="text-sm font-black uppercase tracking-widest mb-2">
                      {rangeLabel}
                    </div>
                    <div className="text-4xl lg:text-5xl font-black tracking-tighter">
                      {range}
                    </div>
                  </div>
                  <button
                    onClick={openForm}
                    className="mt-6 bg-black text-white text-lg font-black px-8 py-4 rounded-xl border-2 border-black brutalist-shadow hover:shadow-none transition-shadow"
                  >
                    {t(`servicePages.${slug}.pricing.button`)}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
