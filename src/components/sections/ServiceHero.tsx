import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServiceHeroProps {
  slug: string
}

export function ServiceHero({ slug }: ServiceHeroProps) {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()

  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-16">
      <AnimatedSection>
        <Link
          to={`/${lang || 'en'}/`}
          className="inline-flex items-center gap-2 text-lg font-bold hover:text-[#88cc33] transition-colors mb-10"
        >
          <ArrowLeft size={20} />
          {t('servicePages.backToServices')}
        </Link>

        <div className="inline-block bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2">
          {t(`servicePages.${slug}.hero.badge`)}
        </div>

        <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">
          {t(`servicePages.${slug}.hero.heading`)}
        </h1>

        <p className="text-xl text-zinc-600 font-medium max-w-2xl">
          {t(`servicePages.${slug}.hero.subheading`)}
        </p>
      </AnimatedSection>
    </section>
  )
}
