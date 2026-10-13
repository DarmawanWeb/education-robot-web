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
    { href: '/lab', label: nav('lab') },
    { href: '/contact', label: nav('contact') },
  ];

  return (
    <footer className="border-edge border-t-2 print:hidden">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
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
        <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
          <h2 className="mb-1 text-base font-bold">{nav('contact')}</h2>
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
          <a
            href={companyUrl(locale)}
            className="decoration-primary mt-3 font-bold underline-offset-4 hover:underline"
          >
            {t('partOf', { parent: names.company })}
          </a>
          <a
            href={companyUrl(locale, '/blog')}
            className="decoration-primary underline-offset-4 hover:underline"
          >
            {t('blog')}
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
