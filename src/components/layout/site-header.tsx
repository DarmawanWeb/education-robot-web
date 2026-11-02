import type { Locale } from '@dctedu/catalog';
import { Wordmark } from '@dctedu/ui/brand/wordmark';
import { Gamepad2 } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { simulatorUrl } from '@/lib/links';
import { siteConfig } from '@/lib/site-config';
import { Container } from '../ui/container';
import { CartButton } from './cart-button';
import { HeaderShell } from './header-shell';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { NavLinks } from './nav-links';

export async function SiteHeader() {
  const [t, locale] = await Promise.all([getTranslations('Nav'), getLocale()]);
  const items = [
    { href: '/robot', label: t('robots') },
    { href: '/accessories', label: t('accessories') },
    { href: '/learn', label: t('learn') },
    { href: '/business', label: t('business') },
  ];
  const simulator = { href: simulatorUrl(locale as Locale), label: t('simulator') };

  return (
    <HeaderShell>
      <Container className="flex h-16 items-center gap-4 transition-[height] duration-300 group-data-[docked]/header:h-14 lg:gap-8 motion-reduce:transition-none">
        <Link href="/" className="group shrink-0 rounded-sm" aria-label={siteConfig.name}>
          <Wordmark title="" className="h-7" />
        </Link>
        <NavLinks items={items} className="hidden lg:block" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <a
            href={simulator.href}
            className="hover:bg-surface-muted hidden h-10 items-center gap-2 rounded-md px-3 text-[0.95rem] font-bold xl:inline-flex"
          >
            <Gamepad2 className="size-4" aria-hidden />
            {simulator.label}
          </a>
          <Suspense>
            <LocaleSwitcher label={t('language')} className="hidden sm:flex" />
          </Suspense>
          <CartButton />
          <Suspense>
            <MobileNav
              items={items}
              simulator={simulator}
              labels={{ menu: t('menu'), close: t('close'), language: t('language') }}
            />
          </Suspense>
        </div>
      </Container>
    </HeaderShell>
  );
}
