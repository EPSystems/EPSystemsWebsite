import { CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import type { LucideIcon } from 'lucide-react'

interface ServiceDetailProps {
  id: string
  icon: LucideIcon
  label: string
  headline: string
  description: string
  features: string[]
  ctaText: string
  variant: 'left-dark' | 'right-boxed' | 'left-lime'
}

export function ServiceDetail({
  id,
  icon: Icon,
  label,
  headline,
  description,
  features,
  ctaText,
  variant,
}: ServiceDetailProps) {
  const { t } = useTranslation()
  const isReversed = variant === 'right-boxed'
  const wrapperClass = variant === 'right-boxed'
    ? 'bg-zinc-100 rounded-[50px] my-10 border-x-4 border-b-4 border-black brutalist-shadow-static'
    : ''

  const labelStyle = variant === 'right-boxed'
    ? 'bg-[#B9FF66] text-black'
    : variant === 'left-lime'
      ? 'bg-black text-white'
      : 'bg-black text-[#B9FF66]'

  const btnStyle = variant === 'right-boxed'
    ? 'bg-black text-white hover:bg-zinc-800'
    : variant === 'left-lime'
      ? 'bg-white text-black hover:bg-[#B9FF66] border-4'
      : 'bg-[#B9FF66] text-black hover:bg-white'

  const illustrationBg = variant === 'left-lime' ? 'bg-[#B9FF66]' : 'bg-white'
  const illustrationShadow = variant === 'left-lime' ? 'bg-black' : variant === 'right-boxed' ? 'bg-[#B9FF66]' : 'bg-black'

  return (
    <section id={id} className={`max-w-7xl mx-auto px-6 py-24 border-t-4 border-black border-dashed ${wrapperClass}`}>
      <AnimatedSection>
        <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
          {/* Illustration */}
          <div className={`relative h-[400px] ${isReversed ? 'order-2' : 'order-2 lg:order-1'}`}>
            <div className={`absolute inset-0 ${illustrationBg} border-4 border-black rounded-[30px] brutalist-shadow-static p-8 flex flex-col justify-between z-10`}>
              <div className="w-full h-1/2 bg-zinc-100 border-4 border-black rounded-xl p-4 flex gap-4">
                <div className="w-12 h-12 bg-zinc-300 rounded-full border-2 border-black shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="w-3/4 h-4 bg-zinc-300 rounded" />
                  <div className="w-1/2 h-4 bg-zinc-300 rounded" />
                </div>
              </div>
              <div className="w-full h-[40%] bg-[#B9FF66] border-4 border-black rounded-xl p-4 flex items-center justify-between">
                <span className="text-2xl font-black uppercase tracking-tighter">
                  {variant === 'right-boxed' ? t('serviceDetail.illustration.roiTracked') : variant === 'left-lime' ? t('serviceDetail.illustration.leads') : t('serviceDetail.illustration.rankFirst')}
                </span>
                <Icon size={36} />
              </div>
            </div>
            <div className={`absolute inset-0 ${illustrationShadow} border-4 border-black rounded-[30px] translate-x-4 translate-y-4`} />
          </div>

          {/* Content */}
          <div className={`${isReversed ? 'order-1' : 'order-1 lg:order-2'}`}>
            <div className={`inline-flex items-center gap-2 ${labelStyle} font-bold px-4 py-2 border-2 border-black rounded-full mb-6`}>
              <Icon size={18} /> {label}
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight mb-6">
              {headline}
            </h2>
            <p className="text-xl text-zinc-700 font-medium mb-8">
              {description}
            </p>
            <ul className="space-y-4 mb-10 font-bold text-lg">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-[#B9FF66] bg-black rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`${btnStyle} text-xl font-bold px-8 py-4 rounded-xl brutalist-shadow border-2 border-black transition-colors`}>
              {ctaText}
            </button>
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}
