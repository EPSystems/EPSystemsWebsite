import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { blogPosts } from '../data/blogPosts'
import { Clock, Calendar } from 'lucide-react'

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

export function Blog() {
  useLanguageSync()
  usePageMeta('blog.meta.title', 'blog.meta.description')
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'en' | 'bg'

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('blog.hero.badge')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('blog.hero.heading')}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('blog.hero.subheading')}
          </p>
        </AnimatedSection>
      </section>

      {/* Blog Cards */}
      <section className="bg-zinc-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <AnimatedSection key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="block bg-white border-4 border-black rounded-[30px] p-6 brutalist-shadow hover:-translate-y-2 transition-transform duration-300 h-full"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Category pill */}
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full border border-black/10 mb-4 ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {categoryLabels[post.category]?.[lang] || post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-black tracking-tight leading-tight mb-3">
                    {post.title[lang]}
                  </h2>

                  {/* Excerpt - 2 lines */}
                  <p className="text-zinc-600 text-base leading-relaxed mb-6 line-clamp-2">
                    {post.excerpt[lang]}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 text-sm text-zinc-500 mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime} {t('blog.minRead')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                  </div>

                  {/* Read more */}
                  <span className="inline-block mt-4 text-sm font-bold text-black hover:text-[#B9FF66] transition-colors">
                    {t('blog.readMore')} &rarr;
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
