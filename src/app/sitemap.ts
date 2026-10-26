import { guides, learnPaths, products, robots } from '@dctedu/catalog';
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';

/** Every public page in both languages. The cart is left out; it is different for everyone. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/robot',
    ...robots.map((robot) => `/robot/${robot.slug}`),
    '/drop',
    '/accessories',
    ...products.map((product) => `/accessories/${product.slug}`),
    '/learn',
    ...learnPaths.map((path) => `/learn/${path.robot}`),
    ...guides.map((guide) => `/learn/guides/${guide.slug}`),
    '/business',
    '/help',
  ];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((entry) => [entry, `${siteConfig.url}/${entry}${path}`]),
        ),
      },
    })),
  );
}
