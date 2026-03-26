/* TODO: Replace with real client logos and names */
import { useTranslation } from 'react-i18next'

const LOGO_KEYS = ['0', '1', '2', '3', '4', '5'] as const

export function TrustedBy() {
  const { t } = useTranslation()

  const logos = LOGO_KEYS.map((key) => (
    <div
      key={key}
      className="w-40 h-14 flex-shrink-0 bg-white/5 border border-[#B9FF66]/20 rounded-lg flex items-center justify-center text-zinc-500 font-bold text-sm"
    >
      {t(`trustedBy.logos.${key}`)}
    </div>
  ))

  return (
    <section className="bg-zinc-100 py-16 overflow-hidden">
      <p className="text-sm text-zinc-500 font-bold text-center uppercase tracking-widest mb-10">
        {t('trustedBy.heading')}
      </p>

      <div className="group relative">
        <div className="flex gap-10 animate-marquee group-hover:[animation-play-state:paused]">
          {/* First copy */}
          <div className="flex gap-10 flex-shrink-0">
            {logos}
          </div>
          {/* Second copy for seamless loop */}
          <div className="flex gap-10 flex-shrink-0">
            {logos}
          </div>
        </div>
      </div>
    </section>
  )
}
