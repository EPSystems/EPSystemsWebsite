import { ArrowUpRight } from 'lucide-react'
import { AnimatedSection } from '../ui/AnimatedSection'
import { scrollToSection } from '../../utils/scroll'

const cases = [
  {
    description: 'For a Bulgarian gift shop, we built a full e-commerce platform with Supabase backend, resulting in a complete digital storefront ready for launch.',
    highlight1: 'full e-commerce',
    highlight2: 'ready for launch',
  },
  {
    description: 'For our own agency, we developed an affiliate portal with commission tracking, multi-tier rewards, and bilingual support for partner management.',
    highlight1: 'affiliate portal',
    highlight2: 'multi-tier rewards',
  },
  {
    description: 'We created an AI-powered business audit tool that generates comprehensive reports with niche-specific scoring across multiple industries.',
    highlight1: 'AI-powered',
    highlight2: 'niche-specific scoring',
  },
]

export function CaseStudies() {
  return (
    <section id="case-studies" className="max-w-7xl mx-auto px-6 py-20 border-t-4 border-black border-dashed">
      <AnimatedSection className="mb-16 max-w-3xl">
        <div className="inline-block bg-white text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform rotate-2 brutalist-shadow">
          Our Projects
        </div>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
          Real Projects We've Built and Shipped.
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
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-3 text-[#B9FF66] text-xl font-bold group"
            >
              View Project
              <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
