import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SUPPORTED_LANGS = ['en', 'bg'] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

function isSupportedLang(lang: string): lang is SupportedLang {
  return SUPPORTED_LANGS.includes(lang as SupportedLang)
}

export function useLanguageSync(): SupportedLang {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()

  const resolved: SupportedLang = lang && isSupportedLang(lang) ? lang : 'en'

  useEffect(() => {
    if (i18n.language !== resolved) {
      i18n.changeLanguage(resolved)
    }
    document.documentElement.lang = resolved
  }, [resolved, i18n])

  return resolved
}
