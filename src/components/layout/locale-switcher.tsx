'use client';

import { locales } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';

/** Two-letter language switch; both options stay visible so nobody hunts for a menu. */
export function LocaleSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <fieldset aria-label={label} className="border-edge flex rounded-md border-2 p-0.5">
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={option === locale}
          disabled={pending}
          onClick={() => startTransition(() => router.replace(pathname, { locale: option }))}
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
