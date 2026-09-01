import { useEffect, useMemo } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { SEOHead } from '../components/SEOHead'
import { BlogCard } from '../components/blog/BlogCard'
import { getPosts } from '../lib/blog'
import { ChevronRight } from 'lucide-react'

const BASE_URL = 'https://www.epsystems.org'

export function BlogCategory() {
  const lang = useLanguageSync()
  const { slug: category } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  const posts = useMemo(() => getPosts(lang), [lang])
  const categoryPosts = useMemo(
    () => (category ? posts.filter((p) => p.frontmatter.category === category) : []),
    [posts, category],
  )

  const categoryLabel = t(`blog.categories.${category ?? ''}`, {
    defaultValue: category ?? '',
  })

  // Shared template keys interpolated with the category label, so every
  // category page gets its own <title> and description.
  usePageMeta(`blog.categoryMeta.title`, `blog.categoryMeta.description`, {
    category: categoryLabel,
  })

  // CollectionPage JSON-LD for the category listing.
  useEffect(() => {
    if (!category || categoryPosts.length === 0) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${categoryLabel} — E&P Systems`,
      description: t('blog.categoryMeta.description', {
        defaultValue: `Articles in the ${categoryLabel} category.`,
      }),
      url: `${BASE_URL}/${lang}/blog/category/${category}`,
      inLanguage: lang === 'bg' ? 'bg-BG' : 'en-US',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: categoryPosts.length,
        itemListElement: categoryPosts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE_URL}/${lang}/blog/${p.frontmatter.slug}`,
          name: p.frontmatter.title,
        })),
      },
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-collection-schema', category)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      document
        .querySelector(`script[data-collection-schema="${category}"]`)
        ?.remove()
    }
  }, [category, categoryPosts, categoryLabel, lang, t])

  if (!category || categoryPosts.length === 0) {
    return <Navigate to={`/${lang}/blog`} replace />
  }

  const homeLabel = t('nav.home', { defaultValue: 'Home' })
  const blogLabel = t('nav.blog', { defaultValue: 'Blog' })

  const breadcrumbs = [
    { name: homeLabel, url: `/${lang}/` },
    { name: blogLabel, url: `/${lang}/blog` },
    { name: categoryLabel, url: `/${lang}/blog/category/${category}` },
  ]

  return (
    <>
      <SEOHead breadcrumbs={breadcrumbs} />

      <Navbar />

      <nav className="max-w-7xl mx-auto px-6 pt-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm font-bold text-zinc-500 flex-wrap">
          <li>
            <Link to={`/${lang}/`} className="hover:text-black transition-colors">{homeLabel}</Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link to={`/${lang}/blog`} className="hover:text-black transition-colors">{blogLabel}</Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-black">{categoryLabel}</li>
        </ol>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-8 pb-12 lg:pt-12 lg:pb-16">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {categoryLabel}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
            {categoryLabel}
          </h1>
        </AnimatedSection>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-20 border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <AnimatedSection key={post.frontmatter.slug}>
                <BlogCard post={post.frontmatter} lang={lang} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
