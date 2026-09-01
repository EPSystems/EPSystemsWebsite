import { useEffect } from 'react'

export interface FaqItem {
  question: string
  answer: string
}

/**
 * Normalises a locale-bundle FAQ list (`items.<n>.{q,a}` — an object keyed by
 * index, or an array) into FaqItem[]; entries missing q or a are dropped.
 */
export function faqItemsFromBundle(raw: unknown): FaqItem[] {
  if (!raw || typeof raw !== 'object') return []
  return Object.values(raw as Record<string, unknown>).flatMap((entry) => {
    const it = entry as { q?: unknown; a?: unknown } | null
    return it && typeof it.q === 'string' && typeof it.a === 'string'
      ? [{ question: it.q, answer: it.a }]
      : []
  })
}

/**
 * Injects a schema.org FAQPage block for the given Q&A items.
 *
 * `key` identifies the block (e.g. the service slug or "pricing") so the
 * injection is idempotent: an existing block with the same key — including
 * one baked into the prerendered HTML — is replaced rather than duplicated.
 * The block is removed on unmount so SPA navigation never leaks it.
 */
export function useFaqSchema(key: string, items: FaqItem[]) {
  // Serialise so callers can pass fresh arrays without re-running every render.
  const serialised = JSON.stringify(items)

  useEffect(() => {
    const parsed: FaqItem[] = JSON.parse(serialised)
    if (parsed.length === 0) return

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: parsed.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    document.querySelectorAll(`script[data-faq-schema="${key}"]`).forEach((el) => el.remove())
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-faq-schema', key)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [key, serialised])
}
