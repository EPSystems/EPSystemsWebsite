import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServiceProcessProps {
  slug: string
}

export function ServiceProcess({ slug }: ServiceProcessProps) {
  const { t } = useTranslation()

  const steps = [0, 1, 2, 3]

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <div className="bg-zinc-100 rounded-[50px] border-4 border-black p-10 lg:p-16">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-12">
            {t(`servicePages.${slug}.process.heading`)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting dashed line on desktop */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] border-t-4 border-dashed border-black" />

            {steps.map((i) => (
              <div key={i} className="relative text-center lg:text-left">
                <span className="text-6xl font-black text-[#B9FF66] leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-black tracking-tighter mt-4 mb-2">
                  {t(`servicePages.${slug}.process.steps.${i}.title`)}
                </h3>
                <p className="text-zinc-600">
                  {t(`servicePages.${slug}.process.steps.${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
