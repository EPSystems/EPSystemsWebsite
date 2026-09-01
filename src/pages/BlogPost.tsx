import { useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MDXProvider } from '@mdx-js/react'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { useContactModal } from '../hooks/useContactModal'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { SEOHead } from '../components/SEOHead'
import { BlogCard } from '../components/blog/BlogCard'
import { mdxComponents } from '../components/blog/MdxComponents'
import { ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react'
import { getPost, getRelatedPosts } from '../lib/blog'
import { AuthorByline } from '../components/blog/AuthorByline'

const BASE_URL = 'https://www.epsystems.org'

/**
 * Maps a frontmatter author name to the standalone Person @id defined in
 * index.html, so the Article schema links to the canonical Person entity
 * rather than declaring a disconnected inline Person. Falls back to a bare
 * name object for unknown authors.
 */
function authorRef(authorName: string): { '@id': string } | { '@type': string; name: string } {
  switch (authorName) {
    case 'Emil Dermendzhiev':
      return { '@id': `${BASE_URL}/#person-emil` }
    case 'Pavel Stefanov':
      return { '@id': `${BASE_URL}/#person-pavel` }
    default:
      return { '@type': 'Person', name: authorName }
  }
}

function formatDate(dateStr: string, lang: 'bg' | 'en'): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function BlogPost() {
  const lang = useLanguageSync()
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()

  const entry = slug ? getPost(lang, slug) : null

  useEffect(() => {
    if (!entry) return
    const { frontmatter } = entry
    document.title = `${frontmatter.title} - E&P Systems`
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = frontmatter.excerpt

    // Article schema
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: frontmatter.title,
      description: frontmatter.excerpt,
      datePublished: frontmatter.date,
      dateModified: frontmatter.date,
      author: authorRef(frontmatter.author),
      publisher: {
        '@type': 'Organization',
        name: 'E&P Systems',
        url: BASE_URL,
      },
      image: frontmatter.coverImage
        ? `${BASE_URL}${frontmatter.coverImage}`
        : undefined,
      inLanguage: frontmatter.locale === 'bg' ? 'bg-BG' : 'en-US',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/${frontmatter.locale}/blog/${frontmatter.slug}`,
      },
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-article-schema', frontmatter.slug)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      const existing = document.querySelector(
        `script[data-article-schema="${frontmatter.slug}"]`,
      )
      if (existing) existing.remove()
    }
  }, [entry])

  if (!entry) {
    return <Navigate to={`/${lang}/blog`} replace />
  }

  const { frontmatter, Component } = entry
  const related = getRelatedPosts(lang, frontmatter.slug, frontmatter.category)
  const categoryLabel = t(`blog.categories.${frontmatter.category}`, {
    defaultValue: frontmatter.category,
  })
  const homeLabel = t('nav.home', { defaultValue: 'Home' })
  const blogLabel = t('nav.blog', { defaultValue: 'Blog' })

  // When the counterpart locale uses a different slug, point hreflang at the
  // real counterpart path instead of the (non-existent) same-slug URL.
  const ownPath = `/blog/${frontmatter.slug}`
  const counterpartPath = frontmatter.alternateSlug
    ? `/blog/${frontmatter.alternateSlug}`
    : ownPath
  const alternates =
    lang === 'bg' ? { bg: ownPath, en: counterpartPath } : { bg: counterpartPath, en: ownPath }

  const breadcrumbs = [
    { name: homeLabel, url: `/${lang}/` },
    { name: blogLabel, url: `/${lang}/blog` },
    { name: frontmatter.title, url: `/${lang}/blog/${frontmatter.slug}` },
  ]

  return (
    <>
      <SEOHead
        breadcrumbs={breadcrumbs}
        title={`${frontmatter.title} - E&P Systems`}
        description={frontmatter.excerpt}
        image={frontmatter.coverImage ? `${BASE_URL}${frontmatter.coverImage}` : undefined}
        type="article"
        alternates={alternates}
      />
      <Navbar />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-6 pt-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm font-bold text-zinc-500 flex-wrap">
          <li>
            <Link to={`/${lang}/`} className="hover:text-black transition-colors">
              {homeLabel}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link to={`/${lang}/blog`} className="hover:text-black transition-colors">
              {blogLabel}
            </Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-black">{categoryLabel}</li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto px-6 pt-8 pb-16 lg:pt-12 lg:pb-20">
        <AnimatedSection>
          <Link
            to={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {t('blog.backToBlog')}
          </Link>

          <span className="inline-block bg-[#B9FF66] text-black text-xs font-black px-3 py-1.5 rounded-full border-2 border-black mb-6 uppercase tracking-wide">
            {categoryLabel}
          </span>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] mb-6">
            {frontmatter.title}
          </h1>

          <div className="flex items-center gap-5 text-sm text-zinc-500 font-medium mb-10 pb-8 border-b-4 border-black">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {formatDate(frontmatter.date, lang)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {frontmatter.readingTime} {t('blog.minRead')}
            </span>
            <span className="font-bold text-black">·{' '}
              <AuthorByline author={frontmatter.author} lang={lang} />
            </span>
          </div>

          <div className="blog-content">
            <MDXProvider components={mdxComponents}>
              <Component />
            </MDXProvider>
          </div>

          {frontmatter.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-zinc-200 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-zinc-100 border-2 border-black rounded-full px-4 py-1 text-sm font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </AnimatedSection>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-8">
              {t('blog.related', { defaultValue: 'Related articles' })}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((post) => (
                <BlogCard key={post.frontmatter.slug} post={post.frontmatter} lang={lang} />
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <AnimatedSection>
          <div className="bg-black border-4 border-black rounded-[30px] p-10 lg:p-14 text-center brutalist-shadow-static">
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
                  source: `blog-cta-${frontmatter.slug}`,
                })
              }
              className="bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
            >
              {t('blog.cta.button')}
            </button>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </>
  )
}
