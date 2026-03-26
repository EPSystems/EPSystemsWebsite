import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../../hooks/useContactModal'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  const homePath = `/${lang || 'en'}/`

  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <Link to={homePath} className="flex items-center gap-2">
        <span className="text-4xl font-bold tracking-tighter">
          E&P Systems
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-10 text-lg font-bold text-zinc-800 bg-white px-8 py-3 rounded-full border-2 border-black brutalist-shadow">
        <Link to={`/${lang || 'en'}/services`} className="hover:text-[#88cc33] transition-colors">{t('nav.services')}</Link>
        {/* <Link to={`/${lang || 'en'}/projects`} className="hover:text-[#88cc33] transition-colors">{t('nav.projects')}</Link> */}
        <Link to={`/${lang || 'en'}/pricing`} className="hover:text-[#88cc33] transition-colors">{t('nav.pricing')}</Link>
        <Link to={`/${lang || 'en'}/about`} className="hover:text-[#88cc33] transition-colors">{t('nav.about')}</Link>
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
          <Link to={`/${lang || 'en'}/services`} onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33] text-left">{t('nav.services')}</Link>
          {/* <Link to={`/${lang || 'en'}/projects`} onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33] text-left">{t('nav.projects')}</Link> */}
          <Link to={`/${lang || 'en'}/pricing`} onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33] text-left">{t('nav.pricing')}</Link>
          <Link to={`/${lang || 'en'}/about`} onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33] text-left">{t('nav.about')}</Link>
          <button onClick={() => { setMobileOpen(false); openContactForm({ subject: 'general', source: 'navbar-get-started' }) }} className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-center">{t('nav.getStarted')}</button>
        </div>
      )}
    </nav>
  )
}
