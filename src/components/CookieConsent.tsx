import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'ep_cookie_consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function updateConsent(granted: boolean) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  // Push directly to dataLayer so this works even before gtag.js finishes loading
  window.dataLayer.push([
    'consent',
    'update',
    {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      functionality_storage: granted ? 'granted' : 'denied',
      personalization_storage: granted ? 'granted' : 'denied',
    },
  ])
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setVisible(true)
  }, [])

  if (!visible) return null

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    updateConsent(true)
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined')
    updateConsent(false)
    setVisible(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] bg-black border-t-4 border-[#B9FF66]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-white text-sm sm:text-base font-medium flex-1">
          {t('cookieConsent.message')}{' '}
          <Link
            to={`/${lang || 'bg'}/privacy-policy`}
            className="text-[#B9FF66] underline hover:no-underline font-bold"
          >
            {t('cookieConsent.learnMore')}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-[#B9FF66] text-black px-6 py-2 rounded-xl font-bold text-sm border-2 border-[#B9FF66] hover:bg-[#a8e65c] transition-colors"
          >
            {t('cookieConsent.accept')}
          </button>
          <button
            onClick={decline}
            className="bg-transparent text-white px-6 py-2 rounded-xl font-bold text-sm border-2 border-zinc-600 hover:border-white transition-colors"
          >
            {t('cookieConsent.manage')}
          </button>
        </div>
      </div>
    </div>
  )
}
