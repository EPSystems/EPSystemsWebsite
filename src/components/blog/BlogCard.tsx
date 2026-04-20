import { Link } from 'react-router-dom'
import { Clock, ArrowUpRight, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { BlogFrontmatter } from '../../lib/blog'

interface BlogCardProps {
  post: BlogFrontmatter
  lang: 'bg' | 'en'
}

function formatDate(dateStr: string, lang: 'bg' | 'en'): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function BlogCard({ post, lang }: BlogCardProps) {
  const { t } = useTranslation()
  return (
    <Link
      to={`/${lang}/blog/${post.slug}`}
      className="group block bg-white border-4 border-black rounded-[30px] p-6 brutalist-shadow transition-all duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#B9FF66] h-full"
    >
      <div className="flex flex-col h-full">
        <span className="inline-block self-start bg-[#B9FF66] text-black text-xs font-black px-3 py-1 rounded-full border-2 border-black mb-4 uppercase tracking-wide">
          {t(`blog.categories.${post.category}`, { defaultValue: post.category })}
        </span>

        <h2 className="text-2xl font-black tracking-tighter leading-tight mb-3 group-hover:text-black">
          {post.title}
        </h2>

        <p className="text-zinc-600 text-base leading-relaxed mb-6 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-zinc-200">
          <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(post.date, lang)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readingTime} {t('blog.minRead')}
            </span>
          </div>
          <ArrowUpRight
            size={22}
            strokeWidth={2.5}
            className="text-black group-hover:rotate-45 transition-transform"
          />
        </div>
      </div>
    </Link>
  )
}
