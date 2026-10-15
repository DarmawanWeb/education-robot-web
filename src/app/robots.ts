import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: routing.locales.map((locale) => `/${locale}/keranjang`),
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
