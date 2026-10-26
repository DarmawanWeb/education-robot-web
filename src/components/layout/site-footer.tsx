import { brand, type Locale, marketplaceNames, pick } from '@dctedu/catalog';
import { Wordmark } from '@dctedu/ui/brand/wordmark';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { marketplaceLinks, simulatorUrl, whatsappUrl } from '@/lib/links';
import { siteConfig } from '@/lib/site-config';
import { Container } from '../ui/container';

type FooterLink = { label: string; href: string; external?: boolean };

export async function SiteFooter() {
  const [t, nav, locale] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getLocale() as Promise<Locale>,
  ]);
  const whatsapp = whatsappUrl(t('whatsappHello'));
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t('shop'),
      links: [
        { label: nav('robots'), href: '/robot' },
        { label: nav('drop'), href: '/drop' },
        { label: nav('accessories'), href: '/aksesori' },
        { label: nav('cart'), href: '/keranjang' },
      ],
    },
    {
      title: nav('learn'),
      links: [
        { label: t('path', { robot: 'Ciko' }), href: '/belajar/ciko' },
        { label: t('path', { robot: 'Momo' }), href: '/belajar/momo' },
        { label: t('guides'), href: '/belajar#panduan' },
        { label: nav('simulator'), href: simulatorUrl(locale), external: true },
      ],
    },
    {
      title: nav('business'),
      links: [
        { label: t('bulk'), href: '/bisnis#beli-banyak' },
        { label: t('oem'), href: '/bisnis#oem' },
        { label: t('inquiry'), href: '/bisnis#tanya' },
      ],
    },
    {
      title: t('help'),
      links: [
        { label: t('faq'), href: '/bantuan' },
        { label: t('email'), href: `mailto:${siteConfig.email}`, external: true },
        ...(whatsapp ? [{ label: 'WhatsApp', href: whatsapp, external: true }] : []),
        ...marketplaceLinks().map((store) => ({
          label: marketplaceNames[store.id],
          href: store.url,
          external: true,
        })),
      ],
    },
  ];

  return (
    <footer className="asphalt mt-auto">
      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <Link href="/" className="group inline-block rounded-sm" aria-label={siteConfig.name}>
            <Wordmark title="" className="h-9 text-white" />
          </Link>
          <p className="type-display mt-5 text-2xl text-white">{pick(brand.tagline, locale)}</p>
          <p className="mt-3 max-w-[40ch] leading-relaxed text-white/70">
            {pick(brand.meaning, locale)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold text-white/60">{column.title}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href} className="min-w-0">
                    {link.external ? (
                      <a
                        href={link.href}
                        className="block truncate text-white hover:underline hover:decoration-[#ffb020] hover:decoration-2 hover:underline-offset-4"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white hover:underline hover:decoration-[#ffb020] hover:decoration-2 hover:underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 py-6 text-sm text-white/60">
        <p>{t('copyright', { year: new Date().getFullYear(), brand: brand.name })}</p>
        <p>{pick(brand.location, locale)}</p>
      </Container>
    </footer>
  );
}
