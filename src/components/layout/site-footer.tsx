import { names } from '@taksu/content';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { companyUrl, whatsappUrl } from '@/lib/links';
import { siteConfig } from '@/lib/site-config';
import { Container } from '../ui/container';
import { Wordmark } from './wordmark';

export async function SiteFooter() {
  const [t, nav, locale] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getLocale(),
  ]);
  const whatsapp = whatsappUrl(names.edu);
  const explore = [
    { href: '/kits', label: nav('kits') },
    { href: '/upgrades', label: nav('upgrades') },
    { href: '/curriculum', label: nav('curriculum') },
    { href: '/simulator', label: nav('simulator') },
  ];
  const support = [
    { href: '/schools', label: nav('schools') },
    { href: '/guides', label: nav('guides') },
    { href: '/contact', label: nav('contact') },
  ];

  return (
    <footer className="border-edge border-t-2">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Wordmark />
          <p className="text-muted-foreground max-w-xs">{t('tagline')}</p>
        </div>
        {[
          { title: t('explore'), links: explore },
          { title: t('support'), links: support },
        ].map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="mb-3 text-base font-bold">{group.title}</h2>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="decoration-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className="flex flex-col gap-2">
          <a
            href={`mailto:${siteConfig.email}`}
            className="decoration-primary break-all underline-offset-4 hover:underline"
          >
            {siteConfig.email}
          </a>
          {whatsapp ? (
            <a href={whatsapp} className="decoration-primary underline-offset-4 hover:underline">
              WhatsApp
            </a>
          ) : null}
          <p className="text-muted-foreground mt-2">{t('partOf', { parent: names.parent })}</p>
          <a
            href={companyUrl(locale)}
            className="decoration-primary underline-offset-4 hover:underline"
          >
            {t('company')}
          </a>
        </div>
      </Container>
      <div className="border-border border-t">
        <Container className="text-muted-foreground py-5 text-sm">
          {t('rights', { year: new Date().getFullYear(), brand: names.edu })}
        </Container>
      </div>
    </footer>
  );
}
