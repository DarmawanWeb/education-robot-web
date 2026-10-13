import { cn } from '@taksu/ui/lib/utils';
import type { ReactNode } from 'react';

/** Section heading with an optional lede. Headings carry the content; no eyebrow labels. */
export function SectionTitle({
  title,
  intro,
  as: Tag = 'h2',
  id,
  className,
  children,
}: {
  title: string;
  /** For `aria-labelledby` on the section. */
  id?: string;
  intro?: string;
  as?: 'h1' | 'h2';
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <Tag
        id={id}
        className={cn(
          'type-label text-balance',
          Tag === 'h1' ? 'text-[clamp(2.4rem,5.6vw,4.4rem)]' : 'text-[clamp(1.9rem,3.8vw,3rem)]',
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <p className="text-muted-foreground mt-4 max-w-[62ch] text-lg leading-relaxed">{intro}</p>
      ) : null}
      {children}
    </div>
  );
}
