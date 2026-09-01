import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { SEOHead } from '../components/SEOHead'
import { BlogCard } from '../components/blog/BlogCard'
import { CategoryFilter } from '../components/blog/CategoryFilter'
import { getCategories, getPosts } from '../lib/blog'

const PAGE_SIZE = 9

export function Blog() {
  const lang = useLanguageSync()
  usePageMeta('blog.meta.title', 'blog.meta.description')
  const { t } = useTranslation()

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const allPosts = useMemo(() => getPosts(lang), [lang])
  const categories = useMemo(() => getCategories(lang), [lang])

  const filtered = useMemo(() => {
    if (!activeCategory) return allPosts
    return allPosts.filter((p) => p.frontmatter.category === activeCategory)
  }, [allPosts, activeCategory])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: t('nav.home', { defaultValue: 'Home' }), url: `/${lang}/` },
          { name: t('nav.blog'), url: `/${lang}/blog` },
        ]}
      />
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
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

      <section className="max-w-7xl mx-auto px-6 pb-8">
        <AnimatedSection>
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={(c) => {
              setActiveCategory(c)
              setPage(1)
            }}
          />
        </AnimatedSection>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-20 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          {paginated.length === 0 ? (
            <AnimatedSection>
              <p className="text-center text-xl text-zinc-500 py-16">
                {t('blog.empty', { defaultValue: 'No articles yet in this category.' })}
              </p>
            </AnimatedSection>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginated.map((post) => (
                <AnimatedSection key={post.frontmatter.slug}>
                  <BlogCard post={post.frontmatter} lang={lang} />
                </AnimatedSection>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 border-2 border-black rounded-xl font-black transition-colors ${
                    currentPage === i + 1
                      ? 'bg-black text-[#B9FF66]'
                      : 'bg-white text-black hover:bg-[#B9FF66]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
