declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: {
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
  const MDXComponent: ComponentType<Record<string, unknown>>
  export default MDXComponent
}
