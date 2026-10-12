import type { Locale } from '@taksu/content';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from './site-config';

/** Canonical + hreflang alternates for a path that exists in every locale. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title?: string;
  description: string;
}): Metadata {
  const suffix = path === '/' ? '' : path;
  const languages = Object.fromEntries(
    routing.locales.map((entry) => [entry, `/${entry}${suffix}`]),
  );
  return {
    title,
    description,
    alternates: { canonical: `/${locale}${suffix}`, languages },
    openGraph: {
      title: title ?? siteConfig.name,
      description,
      url: `${siteConfig.url}/${locale}${suffix}`,
      siteName: siteConfig.name,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
  };
}
