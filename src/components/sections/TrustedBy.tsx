import { useTranslation } from 'react-i18next'

interface Partner {
  key: string
  logo?: string
}

const PARTNERS: Partner[] = [
  { key: '0', logo: '/partners/discipline.png' },
  { key: '1', logo: '/partners/gastrolink.png' },
  { key: '2', logo: '/partners/recoffee.jpg' },
  { key: '3', logo: '/partners/infiniti.png' },
  { key: '4', logo: '/partners/bosconsult.png' },
  { key: '5', logo: '/partners/insurancepro.png' },
]

export function TrustedBy() {
  const { t } = useTranslation()

  const logos = PARTNERS.map(({ key, logo }) => (
    <div
      key={key}
      className="w-72 h-32 flex-shrink-0 bg-white/5 border border-[#B9FF66]/20 rounded-lg flex items-center justify-center"
    >
      {logo ? (
        <img
          src={logo}
          alt={t(`trustedBy.logos.${key}`)}
          className="h-full w-auto object-contain p-1"
        />
      ) : (
        <span className="text-zinc-500 font-bold text-sm">
          {t(`trustedBy.logos.${key}`)}
        </span>
      )}
    </div>
  ))

  return (
    <section className="bg-zinc-100 py-16 overflow-hidden">
      <p className="text-sm text-zinc-500 font-bold text-center uppercase tracking-widest mb-10">
        {t('trustedBy.heading')}
      </p>

      <div className="group relative">
        <div className="flex gap-6 sm:gap-10 animate-marquee-fast sm:animate-marquee group-hover:[animation-play-state:paused]">
          {/* First copy */}
          <div className="flex gap-6 sm:gap-10 flex-shrink-0">
            {logos}
          </div>
          {/* Second copy for seamless loop */}
          <div className="flex gap-6 sm:gap-10 flex-shrink-0">
            {logos}
          </div>
        </div>
      </div>
    </section>
  )
}
