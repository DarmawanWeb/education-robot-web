import type { LevelSlug } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import type { ReactNode } from 'react';

const tone: Record<LevelSlug, string> = {
  sd: 'bg-level-sd',
  smp: 'bg-level-smp',
  sma: 'bg-level-sma',
};

/** Level swatch used on kit boxes and compatibility lists. */
export function LevelChip({
  level,
  children,
  className,
}: {
  level: LevelSlug;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-sm font-bold text-black',
        tone[level],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const levelTone = tone;
