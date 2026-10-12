import { cn } from '@taksu/ui/lib/utils';
import type { ReactNode } from 'react';

/** A strip of marking tape beside text that needs a caveat. */
export function Note({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'bg-accent-soft max-w-[62ch] rounded-md border-l-4 border-[#ffd23f] px-4 py-3',
        className,
      )}
    >
      {children}
    </p>
  );
}
