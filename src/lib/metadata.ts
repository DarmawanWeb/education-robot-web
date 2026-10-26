import type { Locale } from '@dctedu/catalog';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from './site-config';

/** Canonical + hreflang alternates for a path that exists in every locale. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description: string;
  /** A path under /og, without the locale and extension; defaults to the site card. */
  image?: string;
}): Metadata {
  const suffix = path === '/' ? '' : path;
  const languages = Object.fromEntries(
    routing.locales.map((entry) => [entry, `/${entry}${suffix}`]),
  );
  const card = `/og/${image ?? 'site'}-${locale}.jpg`;
  return {
    // Left out when absent, so the home page keeps the layout's default title.
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: `/${locale}${suffix}`, languages },
    openGraph: {
      title: title ?? siteConfig.name,
      description,
      url: `${siteConfig.url}/${locale}${suffix}`,
      siteName: siteConfig.name,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
      images: [{ url: card, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: [card] },
  };
}
