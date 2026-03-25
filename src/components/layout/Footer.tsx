import { ArrowUpRight } from 'lucide-react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import { scrollToSection } from '../../utils/scroll'
import { useContactModal } from '../../hooks/useContactModal'

export function Footer() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()
  const location = useLocation()
  const navigate = useNavigate()

  const homePath = `/${lang || 'en'}/`
  const isHomePage = location.pathname === homePath || location.pathname === `/${lang || 'en'}`

  const handleScroll = (sectionId: string) => {
    if (isHomePage) {
      scrollToSection(sectionId)
    } else {
      navigate(homePath)
      setTimeout(() => scrollToSection(sectionId), 100)
    }
  }

  return (
    <footer className="bg-black pt-20 pb-10" id="footer">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 mb-16 w-full">
            {/* Branding */}
            <div className="col-span-1 md:col-span-12 flex gap-3 md:gap-5 items-baseline pb-4">
              <h2 className="text-6xl md:text-9xl lg:text-[10rem] leading-[0.8] tracking-tighter font-black text-white select-none">
                E&P Systems
              </h2>
              <span className="text-xl md:text-3xl font-bold text-[#B9FF66] tracking-tighter relative -top-1 md:-top-3 border-2 border-[#B9FF66] px-3 py-1 rounded-full transform rotate-3">
                AGENCY
              </span>
            </div>

            {/* Content */}
            <div className="col-span-1 md:col-span-12 grid grid-cols-1 lg:grid-cols-12 mt-2 gap-x-12 gap-y-12 border-t-4 border-zinc-800 pt-16">
              {/* CTA */}
              <div className="col-span-1 lg:col-span-5 flex flex-col items-start justify-between gap-10">
                <p className="text-2xl text-zinc-400 font-bold tracking-tight leading-relaxed max-w-md">
                  {t('footer.cta')}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openContactForm({ subject: 'general', source: 'footer-cta' })}
                    className="bg-[#B9FF66] hover:bg-white text-black px-8 py-4 rounded-xl text-lg font-black transition-colors duration-300 border-4 border-[#B9FF66] hover:border-white tracking-tighter"
                  >
                    {t('footer.getInTouch')}
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-[#B9FF66] text-white hover:text-black flex items-center justify-center transition-colors duration-300 group border-4 border-zinc-800 hover:border-[#B9FF66]"
                  >
                    <ArrowUpRight size={28} className="group-hover:rotate-45 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="col-span-1 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:pl-10 w-full">
                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    {t('footer.sitemap')}
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><Link to={homePath} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.home')}</Link></li>
                    <li><button onClick={() => handleScroll('services')} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.services')}</button></li>
                    <li><button onClick={() => handleScroll('case-studies')} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.projects')}</button></li>
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    {t('footer.servicesColumn')}
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><Link to={`/${lang || 'en'}/services/seo`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.seo')}</Link></li>
                    <li><Link to={`/${lang || 'en'}/services/ecommerce`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.ecommerce')}</Link></li>
                    <li><Link to={`/${lang || 'en'}/services/ai`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.aiAutomation')}</Link></li>
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    {t('footer.contact')}
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><button onClick={() => openContactForm({ subject: 'general', source: 'footer-email' })} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.email')}</button></li>
                    <li><a href="tel:+359879503151" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.phone')}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="border-t-4 border-zinc-900 pt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-base text-zinc-500 font-bold tracking-tight">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
