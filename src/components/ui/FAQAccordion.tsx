import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  heading?: string
}

export function FAQAccordion({ items, heading }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <AnimatedSection>
      <div className="max-w-3xl mx-auto">
        {heading && (
          <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-10">
            {heading}
          </h2>
        )}
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="border-4 border-black rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-lg hover:bg-zinc-50 transition-colors"
              >
                <span className="pr-4">{item.question}</span>
                <ChevronDown
                  size={24}
                  className={`text-[#B9FF66] shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-5 pb-5 text-zinc-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
