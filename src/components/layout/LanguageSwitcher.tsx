import { useParams, useNavigate, useLocation } from 'react-router-dom'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const currentLang = lang || 'bg'

  const switchTo = (targetLang: string) => {
    if (targetLang === currentLang) return
    const newPath = location.pathname.replace(`/${currentLang}`, `/${targetLang}`)
    navigate(newPath, { replace: true })
  }

  return (
    <div className={`flex items-center gap-1 font-bold text-lg ${className || ''}`}>
      <button
        onClick={() => switchTo('bg')}
        className={`px-2 py-1 rounded-lg transition-colors ${currentLang === 'bg' ? 'bg-[#B9FF66] text-black border-2 border-black' : 'text-zinc-400 hover:text-zinc-600'}`}
      >
        BG
      </button>
      <span className="text-zinc-400">/</span>
      <button
        onClick={() => switchTo('en')}
        className={`px-2 py-1 rounded-lg transition-colors ${currentLang === 'en' ? 'bg-[#B9FF66] text-black border-2 border-black' : 'text-zinc-400 hover:text-zinc-600'}`}
      >
        EN
      </button>
    </div>
  )
}
