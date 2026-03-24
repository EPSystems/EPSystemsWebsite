import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

export function NotFoundPage() {
  const { lang } = useParams<{ lang: string }>()
  const language = lang || 'en'

  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border-2 border-black p-12 text-center">
          <h1 className="mb-4 text-6xl font-bold">404</h1>
          <p className="mb-8 text-xl font-medium">Page Not Found</p>
          <Link
            to={`/${language}/`}
            className="inline-block rounded-full border-2 border-black bg-black px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-black"
          >
            Back to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
