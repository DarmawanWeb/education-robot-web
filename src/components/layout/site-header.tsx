import { names } from '@taksu/content';
import { ThemeToggle } from '@taksu/ui/brand/theme-toggle';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ActionLink } from '../ui/action-link';
import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { NavLinks } from './nav-links';
import { Wordmark } from './wordmark';

export async function SiteHeader() {
  const t = await getTranslations('Nav');
  const items = [
    { href: '/kits', label: t('kits') },
    { href: '/upgrades', label: t('upgrades') },
    { href: '/curriculum', label: t('curriculum') },
    { href: '/simulator', label: t('simulator') },
    { href: '/schools', label: t('schools') },
    { href: '/guides', label: t('guides') },
    { href: '/blog', label: t('blog') },
  ];

  return (
    <header className="border-edge bg-background/95 sticky top-0 z-40 border-b-2 backdrop-blur print:hidden">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-[76rem] items-center gap-4 px-5 sm:px-8">
        <Link href="/" className="shrink-0 rounded-sm" aria-label={`${names.edu}, ${t('home')}`}>
          <Wordmark />
        </Link>
        <NavLinks items={items} className="hidden min-[1100px]:ml-1 min-[1100px]:block xl:ml-4" />
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher label={t('language')} />
          <ThemeToggle label={t('theme')} className="hidden sm:inline-flex" />
          <ActionLink
            href="/contact"
            className="hidden min-h-10 px-4 text-sm whitespace-nowrap md:inline-flex"
          >
            {t('cta')}
          </ActionLink>
          <MobileNav
            items={items}
            labels={{ menu: t('menu'), close: t('close'), cta: t('cta'), theme: t('theme') }}
          />
        </div>
      </div>
    </header>
  );
}
