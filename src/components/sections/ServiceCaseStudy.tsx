import { Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServiceCaseStudyProps {
  slug: string
}

export function ServiceCaseStudy({ slug }: ServiceCaseStudyProps) {
  const { t } = useTranslation()

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <div className="bg-black text-white border-4 border-black rounded-[40px] p-10 lg:p-16 brutalist-shadow-static">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#B9FF66] border-2 border-[#B9FF66] rounded-xl flex items-center justify-center">
              <Quote size={28} className="text-black" />
            </div>
            <span className="text-[#B9FF66] text-sm font-black uppercase tracking-widest">
              {t(`servicePages.${slug}.caseStudy.badge`)}
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="text-6xl lg:text-7xl font-black tracking-tighter text-[#B9FF66] leading-none mb-3">
                {t(`servicePages.${slug}.caseStudy.metric`)}
              </div>
              <p className="text-lg text-zinc-400 font-bold uppercase tracking-wide">
                {t(`servicePages.${slug}.caseStudy.metricLabel`)}
              </p>
            </div>

            <div className="lg:col-span-7">
              <h3 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4">
                {t(`servicePages.${slug}.caseStudy.title`)}
              </h3>
              <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                {t(`servicePages.${slug}.caseStudy.description`)}
              </p>
              <p className="text-sm text-zinc-500 italic">
                {t(`servicePages.${slug}.caseStudy.flag`)}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
