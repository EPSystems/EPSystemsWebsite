import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedSection } from '../ui/AnimatedSection'
import { getPosts } from '../../lib/blog'

interface ServiceRelatedProps {
  slug: string
}

const ALL_SERVICE_SLUGS = [
  'ai-websites',
  'ai-automation',
  'ai-agents',
  'ai-seo',
  'ai-ecommerce',
] as const

/** Map a service slug → the blog category that most closely matches it. */
const CATEGORY_MAP: Record<string, string> = {
  'ai-websites': 'ai-websites',
  'ai-automation': 'ai-automation',
  'ai-agents': 'ai-agents',
  'ai-seo': 'ai-seo',
  'ai-ecommerce': 'ai-ecommerce',
}

/** Slug → servicesHub.grid.cards.* key (camelCase in locale). */
const SERVICE_LOCALE_KEY: Record<string, string> = {
  'ai-websites': 'aiWebsites',
  'ai-automation': 'aiAutomation',
  'ai-agents': 'aiAgents',
  'ai-seo': 'aiSeo',
  'ai-ecommerce': 'aiEcommerce',
}

export function ServiceRelated({ slug }: ServiceRelatedProps) {
  const { lang } = useParams<{ lang: string }>()
  const { t } = useTranslation()
  const language = (lang === 'en' ? 'en' : 'bg') as 'bg' | 'en'

  const relatedServices = ALL_SERVICE_SLUGS
    .filter((s) => s !== slug)
    .slice(0, 2)

  // Pick one related blog post: prefer same category, fall back to most recent
  const category = CATEGORY_MAP[slug]
  const posts = getPosts(language)
  const relatedPost =
    posts.find((p) => p.frontmatter.category === category) ?? posts[0]

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <AnimatedSection>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-tight mb-10">
          {t('servicePages.related.heading', { defaultValue: 'Continue exploring' })}
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedServices.map((s) => {
          const key = SERVICE_LOCALE_KEY[s]
          return (
            <AnimatedSection key={s}>
              <Link
                to={`/${language}/services/${s}`}
                className="group block bg-zinc-100 border-4 border-black rounded-[24px] p-6 brutalist-shadow hover:-translate-y-1 transition-transform h-full"
              >
                <span className="inline-block bg-[#B9FF66] text-black text-xs font-black px-3 py-1 rounded-full border-2 border-black mb-4 uppercase">
                  {t('servicePages.related.serviceTag', { defaultValue: 'Service' })}
                </span>
                <h3 className="text-xl font-black tracking-tighter mb-2">
                  {t(`servicesHub.grid.cards.${key}.title`)}
                </h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {t(`servicesHub.grid.cards.${key}.description`)}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-black">
                  {t('servicesHub.grid.learnMore')}
                  <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
                </span>
              </Link>
            </AnimatedSection>
          )
        })}

        {relatedPost && (
          <AnimatedSection>
            <Link
              to={`/${language}/blog/${relatedPost.frontmatter.slug}`}
              className="group block bg-white border-4 border-black rounded-[24px] p-6 brutalist-shadow hover:-translate-y-1 transition-transform h-full"
            >
              <span className="inline-block bg-black text-[#B9FF66] text-xs font-black px-3 py-1 rounded-full mb-4 uppercase">
                {t('servicePages.related.blogTag', { defaultValue: 'Blog' })}
              </span>
              <h3 className="text-xl font-black tracking-tighter mb-2 line-clamp-3">
                {relatedPost.frontmatter.title}
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {relatedPost.frontmatter.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-black">
                {t('blog.readMore')}
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </span>
            </Link>
          </AnimatedSection>
        )}

        <AnimatedSection>
          <Link
            to={`/${language}/industries/insurance`}
            className="group block bg-[#B9FF66] border-4 border-black rounded-[24px] p-6 brutalist-shadow hover:-translate-y-1 transition-transform h-full"
          >
            <span className="inline-flex items-center gap-1 bg-black text-[#B9FF66] text-xs font-black px-3 py-1 rounded-full mb-4 uppercase">
              <Shield size={12} />
              {t('servicePages.related.industryTag', { defaultValue: 'Industry' })}
            </span>
            <h3 className="text-xl font-black tracking-tighter mb-2">
              {t('industries.insurance.hero.badge')}
            </h3>
            <p className="text-zinc-800 text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
              {t('industries.insurance.hero.subheading')}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-black">
              {t('servicesHub.grid.learnMore')}
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
