import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getTeamMemberByAuthorName } from '../../data/team'

interface AuthorBylineProps {
  /** Author name as it appears in the post's frontmatter. */
  author: string
  /** Active locale, used to build the team-member link path. */
  lang: 'bg' | 'en'
}

/**
 * Renders a blog post's author byline: headshot + name, linking to the
 * author's team-member page when the author is a known team member.
 */
export function AuthorByline({ author, lang }: AuthorBylineProps) {
  const { t } = useTranslation()
  const member = getTeamMemberByAuthorName(author)
  const photo = member?.photo

  const inner = (
    <span className="flex items-center gap-2.5 group">
      {photo ? (
        <img
          src={photo}
          alt={author}
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className="w-9 h-9 rounded-full object-cover border-2 border-black"
          style={member?.photoPosition ? { objectPosition: member.photoPosition } : undefined}
        />
      ) : (
        <span className="w-9 h-9 rounded-full bg-zinc-800 text-[#B9FF66] text-xs font-black flex items-center justify-center border-2 border-black">
          {member?.initials ?? author.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="font-bold text-black group-hover:underline">{author}</span>
      {member && (
        <span className="text-xs text-zinc-400">
          {t('blog.byline.viewProfile', { defaultValue: 'View profile' })}
        </span>
      )}
    </span>
  )

  if (!member) {
    return <span className="font-bold text-black">· {author}</span>
  }

  return (
    <Link to={`/${lang}/about/team/${member.slug}`} className="inline-flex">
      {inner}
    </Link>
  )
}
