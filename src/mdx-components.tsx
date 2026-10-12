import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ReactNode } from 'react';
import { Photo } from '@/components/blog/photo';
import { SimMission } from '@/components/blog/sim-mission';

const linkClass =
  'decoration-primary font-semibold underline decoration-2 underline-offset-4 hover:decoration-[3px]';

/** Typography for blog posts, plus the components a post can use without importing them. */
const components: MDXComponents = {
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="type-label mt-12 text-[1.75rem] leading-tight" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => <h3 className="mt-8 text-xl font-bold" {...props} />,
  p: (props: ComponentProps<'p'>) => <p className="mt-5 text-lg leading-relaxed" {...props} />,
  ul: (props: ComponentProps<'ul'>) => (
    <ul
      className="marker:text-muted-foreground mt-5 flex list-disc flex-col gap-2 pl-6 text-lg leading-relaxed"
      {...props}
    />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol
      className="marker:text-muted-foreground mt-5 flex list-decimal flex-col gap-2 pl-6 text-lg leading-relaxed marker:font-semibold"
      {...props}
    />
  ),
  li: (props: ComponentProps<'li'>) => <li className="pl-1" {...props} />,
  a: (props: ComponentProps<'a'>) => <a className={linkClass} {...props} />,
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote className="border-edge mt-6 border-l-4 pl-5 text-lg" {...props} />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code className="bg-surface-muted rounded px-1.5 py-0.5 font-mono text-[0.92em]" {...props} />
  ),
  hr: () => <hr className="border-border my-10" />,
  // MDX wraps the text inside <Note> in its own paragraphs, so this one is a div.
  Note: ({ children }: { children: ReactNode }) => (
    <div className="bg-accent-soft mt-6 rounded-md border-l-4 border-[#ffd23f] px-4 py-1 [&>p]:mt-3 [&>p:last-child]:mb-3">
      {children}
    </div>
  ),
  Photo,
  SimMission,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
