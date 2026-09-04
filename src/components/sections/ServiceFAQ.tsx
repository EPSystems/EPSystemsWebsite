import { useTranslation } from 'react-i18next'
import { FAQAccordion } from '../ui/FAQAccordion'
import { faqItemsFromBundle, useFaqSchema } from '../../hooks/useFaqSchema'

interface ServiceFAQProps {
  slug: string
}

/**
 * Service-page FAQ. Items live in the locale bundles under
 * `servicePages.<slug>.faq.items.<n>.{q,a}`; the count is whatever the bundle
 * holds, so adding a question is a locale-only change. Emits FAQPage JSON-LD.
 */
export function ServiceFAQ({ slug }: ServiceFAQProps) {
  const { t } = useTranslation()

  const items = faqItemsFromBundle(
    t(`servicePages.${slug}.faq.items`, { returnObjects: true, defaultValue: {} }),
  )

  useFaqSchema(slug, items)

  if (items.length === 0) return null

  const heading = t(`servicePages.${slug}.faq.heading`)

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <FAQAccordion items={items} heading={heading} />
    </section>
  )
}
