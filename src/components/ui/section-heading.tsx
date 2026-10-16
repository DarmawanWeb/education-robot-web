import { cn } from '@taksu/edu-ui/lib/utils';
import type { ReactNode } from 'react';

/** A section's title, an optional intro, and an optional link on the right. */
export function SectionHeading({
  title,
  intro,
  action,
  className,
  tone = 'default',
  id,
}: {
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: 'default' | 'onDark';
  id?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-x-10 gap-y-4', className)}>
      <div className="max-w-[46rem]">
        <h2
          id={id}
          className={cn(
            'type-display text-[clamp(2rem,4.2vw,3.25rem)]',
            tone === 'onDark' && 'text-white',
          )}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className={cn(
              'mt-4 text-lg leading-relaxed',
              tone === 'onDark' ? 'text-white/75' : 'text-muted-foreground',
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
