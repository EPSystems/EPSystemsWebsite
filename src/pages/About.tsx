import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { Target, Zap, Users } from 'lucide-react'

export function About() {
  useLanguageSync()
  usePageMeta('about.meta.title', 'about.meta.description')
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  const values = [
    { icon: Target, key: 'precision' },
    { icon: Zap, key: 'speed' },
    { icon: Users, key: 'transparency' },
  ]

  const teamMembers = [
    { key: 'member1', initials: 'EP', photo: '/team/emil.png' },
    { key: 'member2', initials: 'PS', photo: '/team/pavel.jpg' },
    { key: 'member3', initials: 'EL', photo: '/team/emi.jpg' },
    { key: 'member4', initials: 'YT', photo: '/team/yoana.png', photoPosition: 'center 20%' },
  ]

  const stats = [
    { key: 'years' },
    { key: 'projects' },
    { key: 'languages' },
    { key: 'focus' },
  ]

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('about.hero.badge')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('about.hero.heading')}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('about.hero.subheading')}
          </p>
        </AnimatedSection>
      </section>

      {/* Our Story */}
      <section className="bg-zinc-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-8">
              {t('about.story.heading')}
            </h2>
            <div className="max-w-3xl space-y-6">
              <p className="text-lg text-zinc-600 leading-relaxed">
                {t('about.story.p1')}
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                {t('about.story.p2')}
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                {t('about.story.p3')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12">
              {t('about.values.heading')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map(({ icon: Icon, key }, i) => (
                <div
                  key={key}
                  className="bg-zinc-100 border-4 border-black rounded-[30px] p-8 brutalist-shadow"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-14 h-14 bg-[#B9FF66] rounded-xl flex items-center justify-center mb-6 border-2 border-black">
                    <Icon size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3">
                    {t(`about.values.${key}.title`)}
                  </h3>
                  <p className="text-zinc-600 text-lg leading-relaxed">
                    {t(`about.values.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Team */}
      <section className="bg-zinc-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
              {t('about.team.badge')}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12">
              {t('about.team.heading')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map(({ key, initials, photo, photoPosition }, i) => (
                <div
                  key={key}
                  className="bg-white border-4 border-black rounded-[30px] p-8 brutalist-shadow"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-[160px] h-[160px] rounded-full overflow-hidden border-4 border-[#B9FF66] mb-6 mx-auto">
                    {photo ? (
                      <img src={photo} alt={t(`about.team.members.${key}.name`)} className="w-full h-full object-cover" style={photoPosition ? { objectPosition: photoPosition } : undefined} />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-[#B9FF66] text-3xl font-black">{initials}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-2xl font-black tracking-tight">
                      {t(`about.team.members.${key}.name`)}
                    </h3>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B9FF66] hover:text-black transition-colors"
                      aria-label={`LinkedIn - ${t(`about.team.members.${key}.name`)}`}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                  <p className="text-[#B9FF66] font-bold text-sm mb-4 text-center">
                    {t(`about.team.members.${key}.role`)}
                  </p>
                  <p className="text-zinc-600 text-base leading-relaxed text-center">
                    {t(`about.team.members.${key}.bio`)}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12 text-center">
              {t('about.stats.heading')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ key }, i) => (
                <div
                  key={key}
                  className="text-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <p className="text-5xl lg:text-6xl font-black tracking-tighter text-[#B9FF66]" style={{ WebkitTextStroke: '2px black' }}>
                    {t(`about.stats.items.${key}.value`)}
                  </p>
                  <p className="text-lg font-bold text-zinc-700 mt-2">
                    {t(`about.stats.items.${key}.label`)}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6">
              {t('about.cta.heading')}
            </h2>
            <p className="text-xl text-zinc-400 font-bold max-w-2xl mx-auto mb-10">
              {t('about.cta.description')}
            </p>
            <button
              onClick={() => openContactForm({ subject: 'general', source: 'about-cta-work-with-us' })}
              className="bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
            >
              {t('about.cta.button')}
            </button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
