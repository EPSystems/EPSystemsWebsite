import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServicePersonasProps {
  slug: string
}

export function ServicePersonas({ slug }: ServicePersonasProps) {
  const { t } = useTranslation()
  const items = [0, 1, 2]

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-12">
          {t(`servicePages.${slug}.personas.heading`)}
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((i) => (
          <motion.div
            key={i}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
            className="bg-[#B9FF66] border-4 border-black rounded-[30px] p-8 brutalist-shadow-static"
          >
            <div className="text-5xl font-black tracking-tighter mb-4">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-3">
              {t(`servicePages.${slug}.personas.items.${i}.title`)}
            </h3>
            <p className="text-zinc-800 text-lg leading-relaxed font-medium">
              {t(`servicePages.${slug}.personas.items.${i}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
