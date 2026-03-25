import { motion } from 'framer-motion'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { scrollToSection } from '../../utils/scroll'
import { useContactModal } from '../../hooks/useContactModal'

export function Hero() {
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block bg-white border-2 border-black px-4 py-2 rounded-full font-bold mb-6 transform -rotate-2 brutalist-shadow"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {t('hero.badge')}
          </motion.div>
          <motion.h1
            className="text-6xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-8 uppercase"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          >
            {t('hero.heading1')} <br />
            <span className="text-[#B9FF66]" style={{ WebkitTextStroke: '2px black' }}>
              {t('hero.heading2')}
            </span>
          </motion.h1>
          <motion.p
            className="text-2xl text-zinc-800 mb-10 leading-snug font-medium"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            {t('hero.subheading')}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 font-bold"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <button
              onClick={() => openContactForm({ subject: 'general', source: 'hero-contact' })}
              className="bg-black text-[#B9FF66] text-xl px-10 py-5 rounded-2xl brutalist-shadow border-2 border-black flex justify-center items-center gap-3 group"
            >
              {t('hero.cta.contact')}
              <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="bg-white text-black text-xl px-10 py-5 rounded-2xl brutalist-shadow border-2 border-black flex justify-center items-center gap-3"
            >
              {t('hero.cta.work')}
            </button>
          </motion.div>
        </motion.div>

        {/* Dashboard Illustration */}
        <motion.div
          className="relative w-full h-[500px] lg:h-[600px] items-center justify-center hidden md:flex"
          initial={{ scale: 0.9, rotate: 5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-[85%] h-[75%] bg-[#B9FF66] border-4 border-black rounded-[30px] transform rotate-6 brutalist-shadow-static translate-x-4 translate-y-4" />
            <div className="absolute w-[85%] h-[75%] bg-white border-4 border-black rounded-[30px] p-8 flex flex-col z-10 brutalist-shadow-static">
              <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-zinc-200 border-2 border-black" />
                  <div className="w-4 h-4 rounded-full bg-zinc-200 border-2 border-black" />
                  <div className="w-4 h-4 rounded-full bg-zinc-200 border-2 border-black" />
                </div>
                <div className="text-xl font-bold tracking-tighter uppercase">{t('hero.dashboard.title')}</div>
              </div>
              <div className="flex-1 flex items-end justify-between gap-4 relative">
                <div className="w-1/4 h-[30%] bg-zinc-100 border-4 border-black rounded-t-xl hover:bg-zinc-200 transition-colors" />
                <div className="w-1/4 h-[50%] bg-zinc-100 border-4 border-black rounded-t-xl hover:bg-zinc-200 transition-colors" />
                <div className="w-1/4 h-[75%] bg-[#B9FF66] border-4 border-black rounded-t-xl relative">
                  <motion.div
                    className="absolute -top-16 left-1/2 -translate-x-1/2"
                    animate={{ y: [-15, 0, -15] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <TrendingUp size={48} />
                  </motion.div>
                </div>
                <div className="w-1/4 h-[100%] bg-black border-4 border-black rounded-t-xl relative">
                  <div className="absolute -top-8 -right-8 bg-white border-4 border-black px-4 py-2 rounded-full font-black text-xl tracking-tighter brutalist-shadow-static rotate-12 z-20">
                    +428%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
