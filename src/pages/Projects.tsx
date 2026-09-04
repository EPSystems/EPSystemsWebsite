import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { SEOHead } from '../components/SEOHead'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type FilterCategory = 'all' | 'webdev' | 'ecommerce' | 'seo' | 'ai'

interface Project {
  key: string
  category: FilterCategory
  tech: string[]
  hasPage: boolean
}

const projects: Project[] = [
  {
    key: 'giftShop',
    category: 'ecommerce',
    tech: ['React', 'Supabase', 'Tailwind'],
    hasPage: false,
  },
  {
    key: 'affiliatePortal',
    category: 'webdev',
    tech: ['React', 'Node.js', 'Supabase'],
    hasPage: false,
  },
  {
    key: 'aiAudit',
    category: 'ai',
    tech: ['React', 'OpenAI', 'Python'],
    hasPage: false,
  },
  {
    key: 'seoDashboard', // [REPLACE: Add real project]
    category: 'seo',
    tech: ['React', 'D3.js', 'Python'],
    hasPage: false,
  },
  {
    key: 'restaurantSite', // [REPLACE: Add real project]
    category: 'webdev',
    tech: ['React', 'Tailwind', 'Supabase'],
    hasPage: false,
  },
  {
    key: 'fashionStore', // [REPLACE: Add real project]
    category: 'ecommerce',
    tech: ['React', 'Stripe', 'Supabase'],
    hasPage: false,
  },
]

const filterCategories: { key: FilterCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'projects.filters.all' },
  { key: 'webdev', labelKey: 'projects.filters.webdev' },
  { key: 'ecommerce', labelKey: 'projects.filters.ecommerce' },
  { key: 'seo', labelKey: 'projects.filters.seo' },
  { key: 'ai', labelKey: 'projects.filters.ai' },
]

export function Projects() {
  const { lang } = useParams<{ lang: string }>()
  useLanguageSync()
  usePageMeta('projects.meta.title', 'projects.meta.description')
  const { t } = useTranslation()
  const { openContactForm } = useContactModal()
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const breadcrumbs = [
    { name: t('nav.home', { defaultValue: 'Home' }), url: `/${lang || 'bg'}/` },
    { name: t('nav.projects'), url: `/${lang || 'bg'}/projects` },
  ]

  return (
    <>
      <SEOHead
        breadcrumbs={breadcrumbs}
        title={t('projects.meta.title')}
        description={t('projects.meta.description')}
      />
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('projects.hero.badge')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('projects.hero.heading')}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('projects.hero.subheading')}
          </p>
        </AnimatedSection>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <AnimatedSection>
          <div className="flex flex-wrap gap-3">
            {filterCategories.map(({ key, labelKey }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black tracking-tight transition-colors duration-200 border-2 border-black ${
                  activeFilter === key
                    ? 'bg-[#B9FF66] text-black'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Project Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20 lg:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white border-4 border-black rounded-[30px] overflow-hidden brutalist-shadow flex flex-col"
              >
                {/* Screenshot placeholder */}
                <div className="aspect-video bg-zinc-900 border-b-2 border-[#B9FF66] flex items-center justify-center">
                  <span className="text-zinc-500 font-bold text-sm tracking-tight">
                    {t(`projects.items.${project.key}.name`)}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Project name */}
                  <h3 className="text-xl font-black tracking-tight mb-2">
                    {t(`projects.items.${project.key}.name`)}
                  </h3>

                  {/* Industry tag */}
                  <span className="inline-block bg-zinc-100 text-zinc-700 text-xs font-bold px-3 py-1 rounded-full border border-zinc-300 mb-4 w-fit">
                    {t(`projects.items.${project.key}.industry`)}
                  </span>

                  {/* Results */}
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {[0, 1, 2].map((idx) => {
                      const result = t(
                        `projects.items.${project.key}.results.${idx}`,
                        { defaultValue: '' }
                      )
                      if (!result) return null
                      return (
                        <li
                          key={idx}
                          className="text-sm text-zinc-600 font-medium flex items-start gap-2"
                        >
                          <span className="text-[#B9FF66] font-black mt-0.5">
                            +
                          </span>
                          {result}
                        </li>
                      )
                    })}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-bold bg-zinc-900 text-white px-2.5 py-1 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* View Case Study */}
                  <button
                    disabled={!project.hasPage}
                    className={`flex items-center gap-2 text-sm font-black tracking-tight transition-colors ${
                      project.hasPage
                        ? 'text-black hover:text-[#B9FF66]'
                        : 'text-zinc-400 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {t('projects.viewCaseStudy')}
                    <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-6">
              {t('projects.cta.heading')}
            </h2>
            <p className="text-xl text-zinc-400 font-bold max-w-2xl mx-auto mb-10">
              {t('projects.cta.description')}
            </p>
            <button
              onClick={() =>
                openContactForm({ subject: 'general', source: 'projects-cta' })
              }
              className="bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-10 py-4 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter inline-flex items-center gap-2"
            >
              {t('projects.cta.button')}
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
