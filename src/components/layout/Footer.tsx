import { ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import { useContactModal } from '../../hooks/useContactModal'

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61587315569860',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/epsystems/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
]

export function Footer() {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  const homePath = `/${lang || 'en'}/`

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
                    <li><Link to={`/${lang || 'en'}/about`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.about')}</Link></li>
                    <li><Link to={`/${lang || 'en'}/services`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.services')}</Link></li>
                    {/* <li><Link to={`/${lang || 'en'}/projects`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.projects')}</Link></li> */}
                    <li><Link to={`/${lang || 'en'}/pricing`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.pricing')}</Link></li>
                    <li><Link to={`/${lang || 'en'}/blog`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.blog')}</Link></li>
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
                    <li><Link to={`/${lang || 'en'}/contact`} className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">{t('footer.contact')}</Link></li>
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
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                data-social={social.name.toLowerCase()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="w-10 h-10 rounded-full bg-zinc-800 text-white hover:bg-[#B9FF66] hover:text-black flex items-center justify-center transition-colors duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <Link to={`/${lang || 'en'}/privacy-policy`} className="text-base text-zinc-500 hover:text-[#B9FF66] font-bold tracking-tight transition-colors">
            {t('footer.privacyPolicy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
