import { Star } from 'lucide-react'

const items = [
  'Web Development',
  'E-Commerce',
  'SEO',
  'AI Automation',
  'Landing Pages',
  'Custom Apps',
]

export function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-[#B9FF66] border-y-4 border-black py-4 mt-12 transform -rotate-1 relative z-20 shadow-[0_8px_0_0_rgba(0,0,0,1)]">
      <div className="flex whitespace-nowrap">
        {[0, 1].map((set) => (
          <div
            key={set}
            className="animate-marquee flex shrink-0 gap-10 text-3xl md:text-5xl font-black tracking-tighter uppercase items-center text-black px-5"
          >
            {items.map((item) => (
              <span key={`${set}-${item}`} className="flex shrink-0 items-center gap-10">
                <span>{item}</span>
                <Star size={24} fill="currentColor" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
