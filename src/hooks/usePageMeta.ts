import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Sets document.title and <meta name="description"> from i18n keys.
 *
 * `values` are i18next interpolation values, for templates such as
 * "{{category}} — статии | E&P Systems" so a shared key can still yield a
 * unique title per page.
 */
export function usePageMeta(
  titleKey: string,
  descriptionKey?: string,
  values?: Record<string, string | number>,
) {
  const { t, i18n } = useTranslation()
  // Serialise for the dependency array so callers can pass fresh object literals.
  const valuesKey = values ? JSON.stringify(values) : ''

  useEffect(() => {
    const opts: Record<string, string | number> = valuesKey ? JSON.parse(valuesKey) : {}
    document.title = t(titleKey, opts)

    if (descriptionKey) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = t(descriptionKey, opts)
    }
  }, [t, i18n.language, titleKey, descriptionKey, valuesKey])
}
