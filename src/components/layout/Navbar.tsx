import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { scrollToSection } from '../../utils/scroll'
import { useContactModal } from '../../hooks/useContactModal'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
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

  const handleMobileScroll = (sectionId: string) => {
    setMobileOpen(false)
    if (isHomePage) {
      scrollToSection(sectionId)
    } else {
      navigate(homePath)
      setTimeout(() => scrollToSection(sectionId), 100)
    }
  }

  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <Link to={homePath} className="flex items-center gap-2">
        <span className="text-4xl font-bold tracking-tighter">
          E&P Systems
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-10 text-lg font-bold text-zinc-800 bg-white px-8 py-3 rounded-full border-2 border-black brutalist-shadow">
        <button onClick={() => handleScroll('services')} className="hover:text-[#88cc33] transition-colors">{t('nav.services')}</button>
        <Link to={`/${lang || 'en'}/services/seo`} className="hover:text-[#88cc33] transition-colors">{t('nav.seo')}</Link>
        <Link to={`/${lang || 'en'}/services/ecommerce`} className="hover:text-[#88cc33] transition-colors">{t('nav.ecommerce')}</Link>
        <button onClick={() => handleScroll('case-studies')} className="hover:text-[#88cc33] transition-colors">{t('nav.projects')}</button>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={() => openContactForm({ subject: 'general', source: 'navbar-get-started' })}
          className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold text-lg brutalist-shadow"
        >
          {t('nav.getStarted')}
        </button>
        <LanguageSwitcher />
      </div>

      <button
        className="lg:hidden text-black bg-white p-2 border-2 border-black rounded-lg brutalist-shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-2 border-black rounded-2xl mx-6 mt-2 p-6 flex flex-col gap-4 text-lg font-bold brutalist-shadow-static lg:hidden z-50">
          <LanguageSwitcher className="mb-2" />
          <button onClick={() => handleMobileScroll('services')} className="hover:text-[#88cc33] text-left">{t('nav.services')}</button>
          <Link to={`/${lang || 'en'}/services/seo`} onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33] text-left">{t('nav.seo')}</Link>
          <Link to={`/${lang || 'en'}/services/ecommerce`} onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33] text-left">{t('nav.ecommerce')}</Link>
          <button onClick={() => handleMobileScroll('case-studies')} className="hover:text-[#88cc33] text-left">{t('nav.projects')}</button>
          <button onClick={() => { setMobileOpen(false); openContactForm({ subject: 'general', source: 'navbar-get-started' }) }} className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-center">{t('nav.getStarted')}</button>
        </div>
      )}
    </nav>
  )
}
