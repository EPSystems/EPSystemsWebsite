import { useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { useContactModal } from '../hooks/useContactModal'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { blogPosts } from '../data/blogPosts'
import { SEOHead } from '../components/SEOHead'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'

const categoryColors: Record<string, string> = {
  'web-development': 'bg-blue-100 text-blue-800',
  seo: 'bg-green-100 text-green-800',
  ai: 'bg-purple-100 text-purple-800',
}

const categoryLabels: Record<string, { en: string; bg: string }> = {
  'web-development': { en: 'Web Development', bg: 'Уеб разработка' },
  seo: { en: 'SEO', bg: 'SEO' },
  ai: { en: 'AI & Automation', bg: 'AI и Автоматизация' },
}

export function BlogPost() {
  useLanguageSync()
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const { openContactForm } = useContactModal()
  const lang = i18n.language as 'en' | 'bg'

  const post = blogPosts.find((p) => p.slug === slug)

  // Set document title dynamically based on the blog post
  useEffect(() => {
    if (post) {
      document.title = `${post.title[lang]} - E&P Systems`
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = post.excerpt[lang]
    }
  }, [post, lang])

  if (!post) {
    return <Navigate to="/404" replace />
  }

  return (
    <>
      <SEOHead />
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AnimatedSection>
          {/* Back link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {t('blog.backToBlog')}
          </Link>

          {/* Category */}
          <span
            className={`inline-block text-xs font-bold px-3 py-1 rounded-full border border-black/10 mb-4 ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}
          >
            {categoryLabels[post.category]?.[lang] || post.category}
          </span>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] mb-6">
            {post.title[lang]}
          </h1>

          {/* Date + Read time */}
          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-12 pb-8 border-b-2 border-zinc-200">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readTime} {t('blog.minRead')}
            </span>
          </div>

          {/* Content */}
          <div
            className="blog-content max-w-none text-lg leading-relaxed text-zinc-600
              [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-black [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:lg:text-2xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-4 [&_p]:leading-relaxed
              [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc
              [&_li]:my-2 [&_li]:leading-relaxed
              [&_strong]:text-black [&_strong]:font-bold
              [&_em]:italic
              [&_a]:text-black [&_a]:underline [&_a]:hover:text-[#B9FF66]"
            dangerouslySetInnerHTML={{ __html: post.content[lang] }}
          />
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection>
          <div className="mt-16 bg-black rounded-[30px] border-4 border-black p-10 lg:p-14 text-center">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white mb-4">
              {t('blog.cta.heading')}
            </h2>
            <p className="text-lg text-zinc-400 font-bold max-w-2xl mx-auto mb-8">
              {t('blog.cta.description')}
            </p>
            <button
              onClick={() =>
                openContactForm({
                  subject: 'general',
                  source: `blog-cta-${post.slug}`,
                })
              }
              className="bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
            >
              {t('blog.cta.button')}
            </button>
          </div>
        </AnimatedSection>
      </article>

      <Footer />
    </>
  )
}
