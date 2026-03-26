import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { teamMembers } from '../../data/team'
import { AnimatedSection } from '../ui/AnimatedSection'

const INITIALS: Record<string, string> = {
  member1: 'EP',
  member2: 'PI',
  member3: 'MD',
}

const PHOTOS: Record<string, string> = {
  member1: '/team/emil.png',
  member3: '/team/emi.jpg',
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

        <div className="grid md:grid-cols-3 gap-8">
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
                    src={PHOTOS[member.id]}
                    alt={t(`team.members.${member.id}.name`)}
                    className="w-full h-full object-cover"
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
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t(`team.members.${member.id}.name`)} LinkedIn`}
                  className="text-zinc-400 hover:text-[#B9FF66] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
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
