import { ArrowUpRight } from 'lucide-react'
import { AnimatedSection } from '../ui/AnimatedSection'

export function Footer() {
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
                  Let's build something great together. We're ready to bring your digital vision to life.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:engineering@epsystems.org"
                    className="bg-[#B9FF66] hover:bg-white text-black px-8 py-4 rounded-xl text-lg font-black transition-colors duration-300 border-4 border-[#B9FF66] hover:border-white tracking-tighter"
                  >
                    Get in touch
                  </a>
                  <button className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-[#B9FF66] text-white hover:text-black flex items-center justify-center transition-colors duration-300 group border-4 border-zinc-800 hover:border-[#B9FF66]">
                    <ArrowUpRight size={28} className="group-hover:rotate-45 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="col-span-1 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-10 lg:pl-10 w-full">
                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    Sitemap
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><a href="#" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Home</a></li>
                    <li><a href="#services" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Services</a></li>
                    <li><a href="#case-studies" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Projects</a></li>
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    Services
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><a href="#seo" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">SEO</a></li>
                    <li><a href="#ecommerce" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">E-Commerce</a></li>
                    <li><a href="#ai" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">AI & Automation</a></li>
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    Contact
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><a href="mailto:engineering@epsystems.org" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Email</a></li>
                    <li><a href="tel:+359879503151" className="text-lg text-white hover:text-[#B9FF66] transition-colors font-bold tracking-tight">Phone</a></li>
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <span className="text-[13px] uppercase tracking-widest text-[#B9FF66] font-black border-b-2 border-zinc-800 pb-2">
                    Legal
                  </span>
                  <ul className="flex flex-col gap-4">
                    <li><a href="#" className="text-lg text-zinc-500 hover:text-white transition-colors font-bold tracking-tight">Privacy Policy</a></li>
                    <li><a href="#" className="text-lg text-zinc-500 hover:text-white transition-colors font-bold tracking-tight">Terms of Use</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="border-t-4 border-zinc-900 pt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-base text-zinc-500 font-bold tracking-tight">
            &copy; {new Date().getFullYear()} E&P Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
