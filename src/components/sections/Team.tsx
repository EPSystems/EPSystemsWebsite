import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { teamMembers } from '../../data/team'
import { AnimatedSection } from '../ui/AnimatedSection'

const INITIALS: Record<string, string> = {
  member1: 'ED',
  member2: 'PS',
  member3: 'EL',
  member4: 'YT',
}

const PHOTOS: Record<string, { src: string; position?: string }> = {
  member1: { src: '/team/emil.png' },
  member2: { src: '/team/pavel.jpg' },
  member3: { src: '/team/emi.jpg' },
  member4: { src: '/team/yoana.png', position: 'center 20%' },
}

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              className="bg-white p-8 rounded-[30px] border-4 border-black brutalist-shadow-static text-center group hover:-translate-y-2 transition-transform duration-300"
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.15 }}
            >
              <div className="w-[160px] h-[160px] mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#B9FF66]">
                {PHOTOS[member.id] ? (
                  <img
                    src={PHOTOS[member.id].src}
                    alt={t(`team.members.${member.id}.name`)}
                    className="w-full h-full object-cover"
                    style={PHOTOS[member.id].position ? { objectPosition: PHOTOS[member.id].position } : undefined}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-[#B9FF66] text-3xl font-black">{INITIALS[member.id] || '??'}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h3 className="text-2xl font-black tracking-tighter">
                  {t(`team.members.${member.id}.name`)}
                </h3>
              </div>
              <p className="text-lg text-zinc-600 font-bold mt-1">
                {t(`team.members.${member.id}.role`)}
              </p>
              <p className="text-sm text-zinc-500 mt-3 leading-relaxed">
                {t(`team.members.${member.id}.bio`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </AnimatedSection>
  )
}
