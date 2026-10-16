import { guides, learnPaths, products, robots } from '@taksu/catalog';
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
    '/aksesori',
    ...products.map((product) => `/aksesori/${product.slug}`),
    '/belajar',
    ...learnPaths.map((path) => `/belajar/${path.robot}`),
    ...guides.map((guide) => `/belajar/panduan/${guide.slug}`),
    '/bisnis',
    '/bantuan',
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
