import type { AddOnStatus, KitStatus } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { useTranslations } from 'next-intl';

/** Marking-tape tag: anything not shipping yet says so plainly. */
export function StatusTag({
  status,
  className,
}: {
  status: KitStatus | AddOnStatus;
  className?: string;
}) {
  const t = useTranslations('Common.status');
  const ready = status === 'available';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-sm font-bold',
        ready ? 'bg-level-smp text-black' : 'bg-accent text-black',
        className,
      )}
    >
      {t(status)}
    </span>
  );
}
