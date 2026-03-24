import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function stripLangPrefix(path: string): string {
  return path.replace(/^\/(en|bg)\//, '/')
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    const oldBase = stripLangPrefix(previousPathname.current)
    const newBase = stripLangPrefix(pathname)

    if (oldBase !== newBase) {
      window.scrollTo(0, 0)
    }

    previousPathname.current = pathname
  }, [pathname])

  return null
}
