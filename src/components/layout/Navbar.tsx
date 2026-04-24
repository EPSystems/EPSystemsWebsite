import { useEffect, useRef, useState } from 'react'
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../../hooks/useContactModal'
import { LanguageSwitcher } from './LanguageSwitcher'

const SERVICES = [
  { slug: 'ai-websites', labelKey: 'footerServices.aiWebsites' },
  { slug: 'ai-automation', labelKey: 'footerServices.aiAutomation' },
  { slug: 'ai-agents', labelKey: 'footerServices.aiAgents' },
  { slug: 'ai-seo', labelKey: 'footerServices.aiSeo' },
  { slug: 'ai-ecommerce', labelKey: 'footerServices.aiEcommerce' },
] as const

const INDUSTRIES = [
  { slug: 'insurance', labelKey: 'footer.industries.insurance' },
  { slug: 'ecommerce', labelKey: 'footer.industries.ecommerce' },
  { slug: 'fitness', labelKey: 'footer.industries.fitness' },
] as const

type DropdownKey = 'services' | 'industries'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopDropdown, setDesktopDropdown] = useState<DropdownKey | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<DropdownKey | null>(null)
  const { lang } = useParams<{ lang: string }>()
  const location = useLocation()
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()
  const navRef = useRef<HTMLElement | null>(null)

  const l = lang || 'bg'
  const homePath = `/${l}/`

  // Close dropdowns on route change
  useEffect(() => {
    setDesktopDropdown(null)
    setMobileDropdown(null)
    setMobileOpen(false)
  }, [location.pathname])

  // Close desktop dropdown on outside click
  useEffect(() => {
    if (!desktopDropdown) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDesktopDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [desktopDropdown])

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileDropdown(null)
  }

  return (
    <nav
      ref={navRef}
      className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50"
    >
      <Link to={homePath} className="flex items-center gap-2 flex-shrink-0">
        <span className="text-3xl xl:text-4xl font-bold tracking-tighter">E&P Systems</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden xl:flex items-center gap-8 text-base font-bold text-zinc-800 bg-white px-6 py-3 rounded-full border-2 border-black brutalist-shadow">
        {/* Services dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setDesktopDropdown(desktopDropdown === 'services' ? null : 'services')
            }
            className="inline-flex items-center gap-1 hover:text-[#88cc33] transition-colors"
            aria-expanded={desktopDropdown === 'services'}
            aria-haspopup="true"
          >
            {t('nav.services')}
            <ChevronDown
              size={16}
              className={`transition-transform ${desktopDropdown === 'services' ? 'rotate-180' : ''}`}
              strokeWidth={3}
            />
          </button>
          {desktopDropdown === 'services' && (
            <div className="absolute top-full left-0 mt-4 w-72 bg-white border-2 border-black rounded-2xl p-4 brutalist-shadow-static">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  to={`/${l}/services/${s.slug}`}
                  className="block px-4 py-3 rounded-xl hover:bg-[#B9FF66] transition-colors"
                >
                  {t(s.labelKey)}
                </Link>
              ))}
              <div className="border-t-2 border-black mt-2 pt-2">
                <Link
                  to={`/${l}/services`}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-black text-[#B9FF66] hover:bg-zinc-900"
                >
                  {t('nav.allServices')}
                  <ArrowUpRight size={16} strokeWidth={3} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Industries dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setDesktopDropdown(desktopDropdown === 'industries' ? null : 'industries')
            }
            className="inline-flex items-center gap-1 hover:text-[#88cc33] transition-colors"
            aria-expanded={desktopDropdown === 'industries'}
            aria-haspopup="true"
          >
            {t('nav.industries')}
            <ChevronDown
              size={16}
              className={`transition-transform ${desktopDropdown === 'industries' ? 'rotate-180' : ''}`}
              strokeWidth={3}
            />
          </button>
          {desktopDropdown === 'industries' && (
            <div className="absolute top-full left-0 mt-4 w-64 bg-white border-2 border-black rounded-2xl p-4 brutalist-shadow-static">
              {INDUSTRIES.map((i) => (
                <Link
                  key={i.slug}
                  to={`/${l}/industries/${i.slug}`}
                  className="block px-4 py-3 rounded-xl hover:bg-[#B9FF66] transition-colors"
                >
                  {t(i.labelKey)}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to={`/${l}/blog`} className="hover:text-[#88cc33] transition-colors">
          {t('nav.blog')}
        </Link>
        <Link to={`/${l}/about`} className="hover:text-[#88cc33] transition-colors">
          {t('nav.about')}
        </Link>
        <Link to={`/${l}/contact`} className="hover:text-[#88cc33] transition-colors">
          {t('nav.contact')}
        </Link>
      </div>

      {/* Desktop right side */}
      <div className="hidden xl:flex items-center gap-4">
        <LanguageSwitcher />
        <button
          onClick={() =>
            openContactForm({ subject: 'general', source: 'navbar-consultation' })
          }
          className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-black font-bold text-base brutalist-shadow inline-flex items-center gap-2"
        >
          {t('nav.consultation')}
          <ArrowUpRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Mobile toggle */}
      <button
        className="xl:hidden text-black bg-white p-2 border-2 border-black rounded-lg brutalist-shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-2 border-black rounded-2xl mx-6 mt-2 p-6 flex flex-col gap-3 text-lg font-bold brutalist-shadow-static xl:hidden z-50 max-h-[80vh] overflow-y-auto">
          <LanguageSwitcher className="mb-2" />

          {/* Services accordion */}
          <div>
            <button
              type="button"
              onClick={() =>
                setMobileDropdown(mobileDropdown === 'services' ? null : 'services')
              }
              className="w-full flex items-center justify-between py-2"
              aria-expanded={mobileDropdown === 'services'}
            >
              {t('nav.services')}
              <ChevronDown
                size={20}
                className={`transition-transform ${mobileDropdown === 'services' ? 'rotate-180' : ''}`}
                strokeWidth={3}
              />
            </button>
            {mobileDropdown === 'services' && (
              <div className="pl-4 border-l-4 border-[#B9FF66] ml-2 space-y-2 mt-2 text-base">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/${l}/services/${s.slug}`}
                    onClick={closeMobile}
                    className="block py-1 font-medium hover:text-[#88cc33]"
                  >
                    {t(s.labelKey)}
                  </Link>
                ))}
                <Link
                  to={`/${l}/services`}
                  onClick={closeMobile}
                  className="block py-1 font-bold text-black"
                >
                  {t('nav.allServices')} →
                </Link>
              </div>
            )}
          </div>

          {/* Industries accordion */}
          <div>
            <button
              type="button"
              onClick={() =>
                setMobileDropdown(mobileDropdown === 'industries' ? null : 'industries')
              }
              className="w-full flex items-center justify-between py-2"
              aria-expanded={mobileDropdown === 'industries'}
            >
              {t('nav.industries')}
              <ChevronDown
                size={20}
                className={`transition-transform ${mobileDropdown === 'industries' ? 'rotate-180' : ''}`}
                strokeWidth={3}
              />
            </button>
            {mobileDropdown === 'industries' && (
              <div className="pl-4 border-l-4 border-[#B9FF66] ml-2 space-y-2 mt-2 text-base">
                {INDUSTRIES.map((i) => (
                  <Link
                    key={i.slug}
                    to={`/${l}/industries/${i.slug}`}
                    onClick={closeMobile}
                    className="block py-1 font-medium hover:text-[#88cc33]"
                  >
                    {t(i.labelKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to={`/${l}/blog`} onClick={closeMobile} className="py-2 hover:text-[#88cc33]">
            {t('nav.blog')}
          </Link>
          <Link to={`/${l}/about`} onClick={closeMobile} className="py-2 hover:text-[#88cc33]">
            {t('nav.about')}
          </Link>
          <Link to={`/${l}/contact`} onClick={closeMobile} className="py-2 hover:text-[#88cc33]">
            {t('nav.contact')}
          </Link>

          <button
            onClick={() => {
              closeMobile()
              openContactForm({ subject: 'general', source: 'navbar-consultation-mobile' })
            }}
            className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-center mt-2 inline-flex items-center justify-center gap-2"
          >
            {t('nav.consultation')}
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </nav>
  )
}
