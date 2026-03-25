import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function usePageMeta(titleKey: string, descriptionKey?: string) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t(titleKey)

    if (descriptionKey) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = t(descriptionKey)
    }
  }, [t, i18n.language, titleKey, descriptionKey])
}
