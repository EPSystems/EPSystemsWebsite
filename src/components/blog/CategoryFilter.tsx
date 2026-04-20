import { useTranslation } from 'react-i18next'

interface CategoryFilterProps {
  categories: string[]
  active: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onChange(null)}
        className={`px-5 py-2 text-sm font-black uppercase tracking-wide rounded-full border-2 border-black transition-colors ${
          active === null
            ? 'bg-black text-[#B9FF66]'
            : 'bg-white text-black hover:bg-[#B9FF66]'
        }`}
      >
        {t('blog.filters.all', { defaultValue: 'All' })}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 text-sm font-black uppercase tracking-wide rounded-full border-2 border-black transition-colors ${
            active === cat
              ? 'bg-black text-[#B9FF66]'
              : 'bg-white text-black hover:bg-[#B9FF66]'
          }`}
        >
          {t(`blog.categories.${cat}`, { defaultValue: cat })}
        </button>
      ))}
    </div>
  )
}
