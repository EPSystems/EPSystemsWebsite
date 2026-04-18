import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import bg from './locales/bg/common.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: en },
    bg: { common: bg },
  },
  lng: 'bg',
  fallbackLng: 'bg',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
