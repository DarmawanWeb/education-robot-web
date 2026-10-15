import { cn } from '@ulik/ui/lib/utils';

/** A step's place on a learning path: these steps are meant to be done in order. */
export function StepNumber({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        'type-number border-edge grid size-10 shrink-0 place-items-center rounded-full border-2 text-base',
        className,
      )}
    >
      {n}
    </span>
  );
}
