import type { ComponentProps } from 'react'

type H = ComponentProps<'h1'>
type P = ComponentProps<'p'>
type Anchor = ComponentProps<'a'>
type List = ComponentProps<'ul'>
type Code = ComponentProps<'code'>
type Pre = ComponentProps<'pre'>
type Quote = ComponentProps<'blockquote'>

export const mdxComponents = {
  h1: (props: H) => (
    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] mb-6 mt-10 uppercase" {...props} />
  ),
  h2: (props: H) => (
    <h2 className="text-3xl lg:text-4xl font-black tracking-tighter leading-tight mb-4 mt-12 uppercase" {...props} />
  ),
  h3: (props: H) => (
    <h3 className="text-2xl lg:text-3xl font-bold tracking-tighter leading-tight mb-3 mt-8" {...props} />
  ),
  h4: (props: H) => (
    <h4 className="text-xl lg:text-2xl font-bold tracking-tight leading-tight mb-3 mt-6" {...props} />
  ),
  p: (props: P) => <p className="text-lg leading-relaxed text-zinc-700 mb-5" {...props} />,
  a: (props: Anchor) => (
    <a
      className="text-black underline decoration-[#B9FF66] decoration-4 underline-offset-4 hover:bg-[#B9FF66] hover:text-black transition-colors"
      {...props}
    />
  ),
  ul: (props: List) => (
    <ul className="list-none pl-0 mb-6 space-y-3 marker:text-[#B9FF66]" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="list-decimal pl-6 mb-6 space-y-3 marker:font-black marker:text-[#B9FF66]" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li
      className="text-lg leading-relaxed text-zinc-700 pl-6 relative before:content-['▸'] before:absolute before:left-0 before:text-[#B9FF66] before:font-black"
      {...props}
    />
  ),
  blockquote: (props: Quote) => (
    <blockquote
      className="border-l-4 border-[#B9FF66] pl-6 py-1 italic text-black text-xl font-medium my-6"
      {...props}
    />
  ),
  code: (props: Code) => (
    <code
      className="bg-black text-[#B9FF66] px-2 py-0.5 rounded font-mono text-[0.9em]"
      {...props}
    />
  ),
  pre: (props: Pre) => (
    <pre
      className="bg-black text-[#B9FF66] border-4 border-black rounded-2xl p-6 brutalist-shadow-static overflow-x-auto my-6 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),
  strong: (props: ComponentProps<'strong'>) => (
    <strong className="font-black text-black" {...props} />
  ),
  em: (props: ComponentProps<'em'>) => <em className="italic" {...props} />,
  hr: () => <hr className="border-t-4 border-black my-10" />,
}
