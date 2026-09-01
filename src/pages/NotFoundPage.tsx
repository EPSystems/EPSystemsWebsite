import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function NotFoundPage() {
  // Syncs i18n + <html lang> from the URL prefix; unknown/missing prefix → bg.
  const language = useLanguageSync()
  const { t } = useTranslation()
  usePageMeta('notFound.meta.title')

  // A 404 must never be indexed. The build also prerenders this page to
  // dist/404.html, which Vercel serves with a 404 status, so the tag lands in
  // the static file as well.
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border-2 border-black p-12 text-center">
          <h1 className="mb-4 text-6xl font-bold">{t('notFound.heading')}</h1>
          <p className="mb-8 text-xl font-medium">{t('notFound.message')}</p>
          <Link
            to={`/${language}/`}
            className="inline-block rounded-full border-2 border-black bg-black px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-black"
          >
            {t('notFound.backHome')}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
