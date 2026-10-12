// TypeScript 6 no longer loads @types packages on its own, so the MDX module shape lives here.
// Every blog post also exports its front matter as `meta` (see src/content/blog/types.ts).
declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';

  export const meta: import('@/content/blog/types').PostMeta;
  export default function MDXContent(props: MDXProps): import('react').JSX.Element;
}
