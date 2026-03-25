import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import { useContactModal } from '../../hooks/useContactModal'

export function CaseStudies() {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  const cases = [0, 1, 2].map((i) => ({
    description: t(`caseStudies.cases.${i}.description`),
    highlight1: t(`caseStudies.cases.${i}.highlight1`),
    highlight2: t(`caseStudies.cases.${i}.highlight2`),
  }))

  return (
    <section id="case-studies" className="max-w-7xl mx-auto px-6 py-20 border-t-4 border-black border-dashed">
      <AnimatedSection className="mb-16 max-w-3xl">
        <div className="inline-block bg-white text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform rotate-2 brutalist-shadow">
          {t('caseStudies.badge')}
        </div>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
          {t('caseStudies.heading')}
        </h2>
      </AnimatedSection>

      <div className="grid lg:grid-cols-3 gap-8">
        {cases.map((c, i) => (
          <div
            key={i}
            className="bg-black text-white p-10 rounded-[30px] border-4 border-black shadow-[8px_8px_0_0_#B9FF66] flex flex-col justify-between min-h-[350px] transform transition-transform hover:-translate-y-2"
          >
            <p className="text-xl leading-relaxed text-zinc-300 font-medium mb-8">
              {c.description.split(c.highlight1).map((part, j) =>
                j === 0 ? (
                  <span key={j}>
                    {part}
                    <span className="text-[#B9FF66] font-bold">{c.highlight1}</span>
                  </span>
                ) : (
                  <span key={j}>
                    {part.split(c.highlight2).map((p2, k) =>
                      k === 0 ? (
                        <span key={k}>
                          {p2}
                          <span className="text-[#B9FF66] font-bold">{c.highlight2}</span>
                        </span>
                      ) : (
                        <span key={k}>{p2}</span>
                      )
                    )}
                  </span>
                )
              )}
            </p>
            <button
              onClick={() => openContactForm({ subject: 'general', source: 'case-studies' })}
              className="flex items-center gap-3 text-[#B9FF66] text-xl font-bold group"
            >
              {t('caseStudies.viewProject')}
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
