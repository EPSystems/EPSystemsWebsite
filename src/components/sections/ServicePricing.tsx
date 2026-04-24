import { ArrowUpRight } from 'lucide-react'
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
  const button = t(`servicePages.${slug}.pricing.button`)

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

            <div className="lg:col-span-5">
              <button
                onClick={openForm}
                aria-label={button}
                className="group w-full text-left bg-[#B9FF66] border-4 border-black rounded-[30px] px-8 py-7 brutalist-shadow hover:shadow-none transition-all cursor-pointer"
              >
                {rangeLabel && rangeLabel.trim() !== '' && (
                  <div className="text-sm font-black uppercase tracking-widest mb-1">
                    {rangeLabel}
                  </div>
                )}
                <div className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">
                  {range}
                </div>
                <div className="mt-5 pt-4 border-t-2 border-black/80 flex items-center justify-between gap-3">
                  <span className="text-base lg:text-lg font-black">{button}</span>
                  <ArrowUpRight
                    size={24}
                    strokeWidth={3}
                    className="shrink-0 group-hover:rotate-45 transition-transform"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
