/* TODO: Replace with real testimonials */
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

const TESTIMONIAL_KEYS = ['0', '1', '2'] as const

export function Testimonials() {
  const { t } = useTranslation()

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter">
            {t('testimonials.heading')}
          </h2>
          <div className="w-24 h-1 bg-[#B9FF66] mx-auto mt-4" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        {/* Mobile: horizontal scroll | Desktop: 3-column grid */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {TESTIMONIAL_KEYS.map((key) => {
            const initials = t(`testimonials.items.${key}.initials`)
            return (
              <div
                key={key}
                className="min-w-[85vw] sm:min-w-[300px] snap-start bg-white border-4 border-black rounded-[30px] p-6 brutalist-shadow flex-shrink-0 lg:flex-shrink lg:min-w-0"
              >
                {/* Avatar + Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#B9FF66] flex items-center justify-center text-black font-bold text-lg flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-black">
                      {t(`testimonials.items.${key}.name`)}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {t(`testimonials.items.${key}.company`)}
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-zinc-700 leading-relaxed">
                  &ldquo;{t(`testimonials.items.${key}.quote`)}&rdquo;
                </p>
              </div>
            )
          })}
        </div>
      </AnimatedSection>
    </section>
  )
}
