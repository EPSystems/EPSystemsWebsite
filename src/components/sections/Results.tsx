import { ArrowUpRight, TrendingUp, MessageSquare, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

const SECONDARY_ICONS = [MessageSquare, ShoppingBag] as const

export function Results() {
  const { t } = useTranslation()

  const secondary = (t('results.secondary', { returnObjects: true }) as Array<{
    metric: string
    label: string
    description: string
  }>)

  return (
    <section id="results" className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedSection>
        <div className="mb-14">
          <div className="inline-block bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2">
            {t('results.badge')}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight max-w-3xl">
            {t('results.heading')}
          </h2>
        </div>
      </AnimatedSection>

      <div className="grid lg:grid-cols-3 gap-8">
        <AnimatedSection delay={0.1}>
          <div className="lg:col-span-1 bg-black text-white border-4 border-black rounded-[30px] p-10 brutalist-shadow flex flex-col justify-between min-h-[360px] lg:row-span-1">
            <div>
              <TrendingUp size={56} className="text-[#B9FF66] mb-6" />
              <div className="text-7xl lg:text-8xl font-black tracking-tighter text-[#B9FF66] leading-none mb-3">
                {t('results.featured.metric')}
              </div>
              <p className="text-lg text-zinc-300 font-bold uppercase tracking-wide mb-6">
                {t('results.featured.metricLabel')}
              </p>
              <p className="text-2xl font-black mb-2">{t('results.featured.client')}</p>
              <p className="text-zinc-400 leading-relaxed">{t('results.featured.description')}</p>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[#B9FF66] font-bold text-lg group cursor-not-allowed opacity-80">
              {t('results.featured.cta')}
              <ArrowUpRight size={22} className="group-hover:rotate-45 transition-transform" />
            </div>
          </div>
        </AnimatedSection>

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
          {secondary.map((item, i) => {
            const Icon = SECONDARY_ICONS[i] ?? TrendingUp
            const isLime = i % 2 === 0
            return (
              <AnimatedSection key={item.label} delay={0.2 + i * 0.1}>
                <div
                  className={`${isLime ? 'bg-[#B9FF66]' : 'bg-white'} border-4 border-black rounded-[30px] p-8 brutalist-shadow h-full flex flex-col justify-between min-h-[360px]`}
                >
                  <div>
                    <Icon size={44} className="text-black mb-6" />
                    <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-3">
                      {item.metric}
                    </div>
                    <p className="text-lg font-bold uppercase tracking-wide mb-4">{item.label}</p>
                    <p className="text-zinc-800 leading-relaxed font-medium">{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
