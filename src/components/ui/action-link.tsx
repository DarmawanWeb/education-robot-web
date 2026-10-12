import { cn } from '@taksu/ui/lib/utils';
import type * as React from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'signal' | 'plain' | 'onMat';

const variants: Record<Variant, string> = {
  signal:
    'border-edge bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--edge)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--edge)]',
  plain: 'border-edge bg-surface text-foreground hover:bg-surface-muted',
  onMat:
    'border-black bg-accent text-black shadow-[3px_3px_0_0_#000] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#000]',
};

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 px-5 text-base font-bold transition-[transform,box-shadow,background-color] [&_svg]:size-5 [&_svg]:shrink-0';

export function actionClass(variant: Variant = 'signal', className?: string) {
  return cn(base, variants[variant], className);
}

/** Primary actions: an inked button that presses in when hovered. */
export function ActionLink({
  variant = 'signal',
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={actionClass(variant, className)} {...props} />;
}

/** Same look for links that leave this site (the simulator, the company profile). */
export function ExternalAction({
  variant = 'signal',
  className,
  newTabLabel,
  children,
  ...props
}: React.ComponentProps<'a'> & { variant?: Variant; newTabLabel: string }) {
  return (
    <a target="_blank" rel="noopener" className={actionClass(variant, className)} {...props}>
      {children}
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}
