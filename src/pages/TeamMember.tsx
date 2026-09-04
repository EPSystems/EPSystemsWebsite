import { useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { SEOHead } from '../components/SEOHead'
import { BlogCard } from '../components/blog/BlogCard'
import { getTeamMember } from '../data/team'
import { getPosts } from '../lib/blog'
import { ChevronRight, ArrowLeft } from 'lucide-react'

const BASE_URL = 'https://www.epsystems.org'

export function TeamMember() {
  const lang = useLanguageSync()
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  const member = slug ? getTeamMember(slug) : undefined

  usePageMeta(
    member ? `team.members.${member.id}.metaTitle` : 'notFound.title',
    member ? `team.members.${member.id}.metaDescription` : undefined,
  )

  // Person JSON-LD: reference the canonical Person @id when one exists
  // (founders); otherwise declare an inline Person entity.
  useEffect(() => {
    if (!member) return
    const name = t(`team.members.${member.id}.name`, { defaultValue: member.id })
    const role = t(`team.members.${member.id}.role`, { defaultValue: '' })
    const schema = member.personId
      ? {
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': member.personId,
          name,
          jobTitle: role || undefined,
          worksFor: { '@id': `${BASE_URL}/#organization` },
          url: `${BASE_URL}/${lang}/about/team/${member.slug}`,
          ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name,
          jobTitle: role || undefined,
          worksFor: { '@id': `${BASE_URL}/#organization` },
          url: `${BASE_URL}/${lang}/about/team/${member.slug}`,
          ...(member.photo ? { image: `${BASE_URL}${member.photo}` } : {}),
          ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
        }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-person-schema', member.id)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      document
        .querySelector(`script[data-person-schema="${member.id}"]`)
        ?.remove()
    }
  }, [member, lang, t])

  if (!member) {
    return <Navigate to={`/${lang}/about`} replace />
  }

  const name = t(`team.members.${member.id}.name`, { defaultValue: member.id })
  const role = t(`team.members.${member.id}.role`, { defaultValue: '' })
  const bio = t(`team.members.${member.id}.bio`, { defaultValue: '' })
  const authoredPosts = member.authorName
    ? getPosts(lang).filter((p) => p.frontmatter.author === member.authorName)
    : []

  const homeLabel = t('nav.home', { defaultValue: 'Home' })
  const aboutLabel = t('nav.about', { defaultValue: 'About' })
  const teamLabel = t('team.heading', { defaultValue: 'Team' })

  const breadcrumbs = [
    { name: homeLabel, url: `/${lang}/` },
    { name: aboutLabel, url: `/${lang}/about` },
    { name: name, url: `/${lang}/about/team/${member.slug}` },
  ]

  return (
    <>
      {/* title/description fall back to the page's metaTitle/metaDescription (usePageMeta) */}
      <SEOHead breadcrumbs={breadcrumbs} />

      <Navbar />

      <nav className="max-w-4xl mx-auto px-6 pt-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm font-bold text-zinc-500 flex-wrap">
          <li>
            <Link to={`/${lang}/`} className="hover:text-black transition-colors">{homeLabel}</Link>
          </li>
          <ChevronRight size={14} />
          <li>
            <Link to={`/${lang}/about`} className="hover:text-black transition-colors">{aboutLabel}</Link>
          </li>
          <ChevronRight size={14} />
          <li className="text-black">{teamLabel}</li>
        </ol>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-8 pb-12 lg:pt-12">
        <AnimatedSection>
          <Link
            to={`/${lang}/about`}
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {t('teamMember.backToTeam', { defaultValue: 'Back to team' })}
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#B9FF66] flex-shrink-0">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={name}
                  width={160}
                  height={160}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={member.photoPosition ? { objectPosition: member.photoPosition } : undefined}
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-[#B9FF66] text-4xl font-black">{member.initials}</span>
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] mb-3">
                {name}
              </h1>
              {role && (
                <p className="text-xl text-zinc-600 font-bold mb-4">{role}</p>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black hover:bg-white transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {bio && (
            <p className="text-lg text-zinc-700 leading-relaxed whitespace-pre-line">
              {bio}
            </p>
          )}
        </AnimatedSection>
      </section>

      {authoredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-8">
              {t('teamMember.authoredPosts', { defaultValue: 'Articles by' })} {name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authoredPosts.map((post) => (
                <BlogCard key={post.frontmatter.slug} post={post.frontmatter} lang={lang} />
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      <Footer />
    </>
  )
}
