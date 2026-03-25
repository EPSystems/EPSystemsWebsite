import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { teamMembers } from '../../data/team'
import { AnimatedSection } from '../ui/AnimatedSection'

export function Team() {
  const { t } = useTranslation()

  return (
    <AnimatedSection>
      <section className="max-w-7xl mx-auto px-6 py-24">
        <span className="inline-block bg-[#B9FF66] text-black font-bold px-4 py-2 border-2 border-black rounded-lg mb-6 transform -rotate-2">
          {t('team.badge')}
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mb-16">
          {t('team.heading')}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              className="bg-white p-8 rounded-[30px] border-4 border-black brutalist-shadow-static text-center"
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.15 }}
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-[#B9FF66] border-4 border-black rounded-full flex items-center justify-center">
                <User size={48} className="text-black" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">
                {t(`team.members.${member.id}.name`)}
              </h3>
              <p className="text-lg text-zinc-600 font-bold mt-2">
                {t(`team.members.${member.id}.role`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  )
}
