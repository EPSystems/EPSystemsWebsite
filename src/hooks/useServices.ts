import { useTranslation } from 'react-i18next'
import { services as serviceBase } from '../data/services'
import type { Service } from '../data/services'

export function useServices(): Service[] {
  const { t } = useTranslation()
  return serviceBase.map((s) => ({
    ...s,
    title: t(`services.${s.id}.title`),
    titleBreak: t(`services.${s.id}.titleBreak`),
    description: t(`services.${s.id}.description`),
    features: [0, 1, 2].map((i) => t(`services.${s.id}.features.${i}`)),
    ...(s.detailHeadline
      ? {
          detailHeadline: t(`services.${s.id}.detailHeadline`),
          detailDescription: t(`services.${s.id}.detailDescription`),
          ctaText: t(`services.${s.id}.ctaText`),
        }
      : {}),
  }))
}
