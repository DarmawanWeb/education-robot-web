import { cn } from '@dctedu/ui/lib/utils';
import type { ReactNode } from 'react';

/** One card in the home page line-up. On phones the cards scroll sideways; from sm up they sit in a grid. */
export const lineupItemClass =
  'park flex w-[min(78%,20rem)] shrink-0 snap-start sm:w-auto sm:shrink [&>*]:w-full';

/** Where the photo goes once a robot is shown: for now, only its race number. */
export function UnrevealedSlot({
  tone = 'white',
  children,
}: {
  tone?: 'white' | 'signal';
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid aspect-[4/3] place-items-center rounded-lg border border-dashed',
        tone === 'white' ? 'border-band-fg/20' : 'border-[#ffb020]/60',
      )}
    >
      {children}
    </div>
  );
}
