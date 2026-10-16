import { cn } from '@taksu/ui/lib/utils';
import { ArrowRight } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

/** A plain link with a red underline that thickens on hover. */
export function TextLink({
  className,
  children,
  tone = 'default',
  ...props
}: ComponentProps<typeof Link> & { tone?: 'default' | 'onDark' }) {
  return (
    <Link
      className={cn(
        'group/link inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-[6px] hover:decoration-[3px]',
        tone === 'onDark' ? 'text-white decoration-[#ffb020]' : 'decoration-primary',
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform group-hover/link:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
