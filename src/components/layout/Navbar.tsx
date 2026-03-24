import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-2">
        <span className="text-4xl font-bold tracking-tighter">
          E&P Systems
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-10 text-lg font-bold text-zinc-800 bg-white px-8 py-3 rounded-full border-2 border-black brutalist-shadow">
        <a href="#services" className="hover:text-[#88cc33] transition-colors">Services</a>
        <a href="#seo" className="hover:text-[#88cc33] transition-colors">SEO</a>
        <a href="#ecommerce" className="hover:text-[#88cc33] transition-colors">E-Commerce</a>
        <a href="#case-studies" className="hover:text-[#88cc33] transition-colors">Projects</a>
      </div>

      <div className="hidden lg:block">
        <a href="#contact" className="bg-[#B9FF66] border-2 border-black rounded-xl px-8 py-4 text-black font-bold text-lg brutalist-shadow">
          Get Started
        </a>
      </div>

      <button
        className="lg:hidden text-black bg-white p-2 border-2 border-black rounded-lg brutalist-shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-2 border-black rounded-2xl mx-6 mt-2 p-6 flex flex-col gap-4 text-lg font-bold brutalist-shadow-static lg:hidden z-50">
          <a href="#services" onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33]">Services</a>
          <a href="#seo" onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33]">SEO</a>
          <a href="#ecommerce" onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33]">E-Commerce</a>
          <a href="#case-studies" onClick={() => setMobileOpen(false)} className="hover:text-[#88cc33]">Projects</a>
          <a href="#contact" onClick={() => setMobileOpen(false)} className="bg-[#B9FF66] border-2 border-black rounded-xl px-6 py-3 text-center">Get Started</a>
        </div>
      )}
    </nav>
  )
}
