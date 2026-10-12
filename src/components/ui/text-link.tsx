import { cn } from '@taksu/ui/lib/utils';
import type * as React from 'react';
import { Link } from '@/i18n/navigation';

const base =
  'text-lg font-bold underline decoration-[3px] underline-offset-[6px] transition-[text-decoration-thickness] hover:decoration-[5px]';

/** Secondary navigation: a bold link underlined like a strip of tape. */
export function TextLink({
  className,
  tone = 'signal',
  ...props
}: React.ComponentProps<typeof Link> & { tone?: 'signal' | 'tape' }) {
  return (
    <Link
      className={cn(
        base,
        tone === 'tape' ? 'decoration-[#ffd23f]' : 'decoration-primary',
        className,
      )}
      {...props}
    />
  );
}
