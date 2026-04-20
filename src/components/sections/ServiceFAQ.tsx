import { useTranslation } from 'react-i18next'
import { FAQAccordion } from '../ui/FAQAccordion'
import { useEffect } from 'react'

interface ServiceFAQProps {
  slug: string
}

const FAQ_COUNTS: Record<string, number> = {
  'ai-websites': 5,
  'ai-automation': 5,
  'ai-agents': 5,
  'ai-seo': 5,
  'ai-ecommerce': 5,
}

export function ServiceFAQ({ slug }: ServiceFAQProps) {
  const { t, i18n } = useTranslation()
  const count = FAQ_COUNTS[slug]

  if (!count) return null

  const items = Array.from({ length: count }, (_, i) => ({
    question: t(`servicePages.${slug}.faq.items.${i}.q`),
    answer: t(`servicePages.${slug}.faq.items.${i}.a`),
  }))

  const heading = t(`servicePages.${slug}.faq.heading`)

  // Inject FAQPage schema for SEO
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-faq-schema', slug)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      const existing = document.querySelector(`script[data-faq-schema="${slug}"]`)
      if (existing) existing.remove()
    }
  }, [slug, i18n.language])

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <FAQAccordion items={items} heading={heading} />
    </section>
  )
}
