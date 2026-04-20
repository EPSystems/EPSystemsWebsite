import type { ComponentType } from 'react'

export interface BlogFrontmatter {
  title: string
  slug: string
  locale: 'bg' | 'en'
  date: string
  author: string
  category: string
  tags: string[]
  excerpt: string
  coverImage?: string
  readingTime: number
  alternateSlug?: string
}

export interface BlogEntry {
  frontmatter: BlogFrontmatter
  Component: ComponentType<Record<string, unknown>>
}

interface MdxModule {
  frontmatter: BlogFrontmatter
  default: ComponentType<Record<string, unknown>>
}

// Vite static glob import. Paths are relative from project root.
const modules = import.meta.glob<MdxModule>('/content/blog/**/*.mdx', {
  eager: true,
})

const allPosts: BlogEntry[] = Object.values(modules)
  .map((m) => {
    if (!m.frontmatter || !m.default) return null
    return { frontmatter: m.frontmatter, Component: m.default }
  })
  .filter((x): x is BlogEntry => x !== null)
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  )

export function getPosts(locale: 'bg' | 'en'): BlogEntry[] {
  return allPosts.filter((p) => p.frontmatter.locale === locale)
}

export function getPost(locale: 'bg' | 'en', slug: string): BlogEntry | null {
  return (
    getPosts(locale).find((p) => p.frontmatter.slug === slug) ?? null
  )
}

export function getCategories(locale: 'bg' | 'en'): string[] {
  const set = new Set<string>()
  for (const post of getPosts(locale)) {
    set.add(post.frontmatter.category)
  }
  return Array.from(set)
}

export function getRelatedPosts(
  locale: 'bg' | 'en',
  currentSlug: string,
  category: string,
  limit = 3,
): BlogEntry[] {
  return getPosts(locale)
    .filter(
      (p) =>
        p.frontmatter.slug !== currentSlug &&
        p.frontmatter.category === category,
    )
    .slice(0, limit)
}
