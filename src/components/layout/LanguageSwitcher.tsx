import { useParams, useNavigate, useLocation } from 'react-router-dom'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const currentLang = lang || 'en'

  const switchTo = (targetLang: string) => {
    if (targetLang === currentLang) return
    const newPath = location.pathname.replace(`/${currentLang}/`, `/${targetLang}/`)
    navigate(newPath, { replace: true })
  }

  return (
    <div className={`flex items-center gap-1 font-bold text-lg ${className || ''}`}>
      <button
        onClick={() => switchTo('en')}
        className={currentLang === 'en' ? 'text-current' : 'text-zinc-400 hover:text-zinc-300 transition-colors'}
      >
        EN
      </button>
      <span className="text-zinc-400">/</span>
      <button
        onClick={() => switchTo('bg')}
        className={currentLang === 'bg' ? 'text-current' : 'text-zinc-400 hover:text-zinc-300 transition-colors'}
      >
        BG
      </button>
    </div>
  )
}
