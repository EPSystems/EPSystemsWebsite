import { ArrowUpRight, Target, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useServices } from '../../hooks/useServices'
import { AnimatedSection } from '../ui/AnimatedSection'

// New AI pillar IDs mapped to existing service subpage slugs.
// Phase 4 will add dedicated /services/ai-websites, /services/ai-agents, etc.
const SERVICE_SLUGS: Record<string, string> = {
  aiWebsites: 'software',
  aiAutomation: 'ai',
  aiAgents: 'ai',
  aiSeo: 'seo',
  aiEcommerce: 'ecommerce',
}

const variantStyles = {
  light: {
    card: 'bg-zinc-100 hover:bg-[#B9FF66]',
    icon: 'text-black',
    arrow: 'bg-white group-hover:bg-black group-hover:text-[#B9FF66]',
    text: '',
  },
  lime: {
    card: 'bg-[#B9FF66] hover:bg-black hover:text-white',
    icon: 'text-black group-hover:text-white',
    arrow: 'bg-white text-black group-hover:border-white',
    text: '',
  },
  dark: {
    card: 'bg-black text-white hover:bg-zinc-800',
    icon: 'text-[#B9FF66]',
    arrow: 'bg-zinc-900 border-zinc-700 group-hover:border-[#B9FF66] text-[#B9FF66]',
    text: 'text-[#B9FF66]',
  },
}

export function Services() {
  const { t } = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const services = useServices()

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24">
      <AnimatedSection>
        <div className="grid lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-8">
            <div className="inline-block bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2">
              {t('services.badge')}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight">
              {t('services.heading')}
            </h2>
          </div>
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
            <div className="w-48 h-48 bg-white border-4 border-black rounded-full brutalist-shadow flex flex-col items-center justify-center relative z-10 group">
              <Target size={80} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute w-48 h-48 bg-[#B9FF66] border-4 border-black rounded-full translate-x-4 translate-y-4" />
            <Sparkles size={36} className="absolute -top-4 right-10 rotate-12 z-20 animate-pulse" />
          </div>
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => {
          const styles = variantStyles[service.variant]
          const Icon = service.icon
          const hasPage = Boolean(SERVICE_SLUGS[service.id])
          return (
            <motion.div
              key={service.id}
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.1 }}
              className={`${styles.card} p-8 rounded-[30px] border-4 border-black brutalist-shadow flex flex-col justify-between min-h-[320px] group transition-colors`}
            >
              <div>
                <Icon size={56} className={`${styles.icon} mb-6 group-hover:rotate-12 transition-transform`} />
                <h3 className="text-3xl font-black tracking-tighter leading-tight mb-4">
                  {service.title}<br />{service.titleBreak}
                </h3>
              </div>
              {hasPage && (
                <Link
                  to={`/${lang || 'bg'}/services/${SERVICE_SLUGS[service.id]}`}
                  className={`flex items-center gap-4 text-xl font-bold mt-auto ${styles.text}`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center ${styles.arrow} transition-colors`}>
                    <ArrowUpRight size={24} />
                  </div>
                  {t('services.learnMore')}
                </Link>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
