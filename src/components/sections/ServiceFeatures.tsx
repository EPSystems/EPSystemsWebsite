import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'

interface ServiceFeaturesProps {
  slug: string
}

export function ServiceFeatures({ slug }: ServiceFeaturesProps) {
  const { t } = useTranslation()

  const features = [0, 1, 2, 3]

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-12">
          {t(`servicePages.${slug}.features.heading`)}
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((i) => (
          <motion.div
            key={i}
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.1 }}
            className={`bg-white p-8 rounded-[30px] border-4 border-black brutalist-shadow-static ${
              i % 2 === 0 ? 'border-t-[#B9FF66]' : ''
            }`}
          >
            <h3 className="text-2xl font-black tracking-tighter mb-4">
              {t(`servicePages.${slug}.features.items.${i}.title`)}
            </h3>
            <p className="text-lg text-zinc-600">
              {t(`servicePages.${slug}.features.items.${i}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
