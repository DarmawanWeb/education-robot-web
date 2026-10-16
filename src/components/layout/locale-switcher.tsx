'use client';

import { locales } from '@taksu/catalog';
import { cn } from '@taksu/ui/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';

/** Two-letter language switch; both options stay visible so nobody hunts for a menu. */
export function LocaleSwitcher({ label, className }: { label: string; className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  return (
    <fieldset aria-label={label} className={cn('flex rounded-md border p-0.5', className)}>
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={option === locale}
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              router.replace(
                { pathname, query: Object.fromEntries(searchParams.entries()) },
                { locale: option, scroll: false },
              ),
            )
          }
          className={cn(
            'h-8 min-w-9 rounded-sm px-2 text-sm font-bold uppercase',
            option === locale ? 'bg-ink text-ink-foreground' : 'hover:bg-surface-muted',
          )}
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}
