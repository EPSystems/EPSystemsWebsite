import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { scrollToSection } from '../../utils/scroll'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang } = useParams<{ lang: string }>()

  const handleScroll = (sectionId: string) => {
    scrollToSection(sectionId)
  }

  const handleMobileScroll = (sectionId: string) => {
    setMobileOpen(false)
    scrollToSection(sectionId)
  }

  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <Link to={`/${lang || 'en'}/`} className="flex items-center gap-2">
        <span className="text-4xl font-bold tracking-tighter">
          E&P Systems
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-10 text-lg font-bold text-zinc-800 bg-white px-8 py-3 rounded-full border-2 border-black brutalist-shadow">
        <button onClick={() => handleScroll('services')} className="hover:text-[#88cc33] transition-colors">Services</button>
        <button onClick={() => handleScroll('seo')} className="hover:text-[#88cc33] transition-colors">SEO</button>
        <button onClick={() => handleScroll('ecommerce')} className="hover:text-[#88cc33] transition-colors">E-Commerce</button>
        <button onClick={() => handleScroll('case-studies')} className="hover:text-[#88cc33] transition-colors">Projects</button>
      </div>

      <div className="hidden lg:block">
        <button
          onClick={() => handleScroll('contact')}
          className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold text-lg brutalist-shadow"
        >
          Get Started
        </button>
      </div>

      <button
        className="lg:hidden text-black bg-white p-2 border-2 border-black rounded-lg brutalist-shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-2 border-black rounded-2xl mx-6 mt-2 p-6 flex flex-col gap-4 text-lg font-bold brutalist-shadow-static lg:hidden z-50">
          <button onClick={() => handleMobileScroll('services')} className="hover:text-[#88cc33] text-left">Services</button>
          <button onClick={() => handleMobileScroll('seo')} className="hover:text-[#88cc33] text-left">SEO</button>
          <button onClick={() => handleMobileScroll('ecommerce')} className="hover:text-[#88cc33] text-left">E-Commerce</button>
          <button onClick={() => handleMobileScroll('case-studies')} className="hover:text-[#88cc33] text-left">Projects</button>
          <button onClick={() => handleMobileScroll('contact')} className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-center">Get Started</button>
        </div>
      )}
    </nav>
  )
}
