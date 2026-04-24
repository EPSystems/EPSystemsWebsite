import { Cpu, Rocket, Users, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

const ITEMS = [
  { key: 'engineering', Icon: Cpu },
  { key: 'production', Icon: Rocket },
  { key: 'founders', Icon: Users },
  { key: 'transparent', Icon: Eye },
] as const

export function WhyUs() {
  const { t } = useTranslation()

  return (
    <section id="why-us" className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedSection>
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-8">
            <div className="inline-block bg-white text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2 brutalist-shadow">
              {t('whyUs.badge')}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight">
              {t('whyUs.heading')}
            </h2>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-8">
        {ITEMS.map(({ key, Icon }, i) => (
          <AnimatedSection key={key} delay={0.1 + i * 0.1}>
            <div className="bg-white border-4 border-black rounded-[30px] p-8 brutalist-shadow h-full flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-[#B9FF66] border-2 border-black rounded-2xl flex items-center justify-center">
                <Icon size={32} className="text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tighter mb-3">
                  {t(`whyUs.items.${key}.title`)}
                </h3>
                <p className="text-zinc-700 text-lg leading-relaxed font-medium">
                  {t(`whyUs.items.${key}.description`)}
                </p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}
