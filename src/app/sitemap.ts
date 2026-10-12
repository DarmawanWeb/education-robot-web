import { educationLevels, guides } from '@taksu/content';
import type { MetadataRoute } from 'next';
import { posts } from '@/content/blog';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';

const staticPaths = [
  '',
  '/kits',
  '/upgrades',
  '/curriculum',
  '/simulator',
  '/schools',
  '/guides',
  '/blog',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...educationLevels.flatMap((level) => [`/kits/${level.slug}`, `/curriculum/${level.slug}`]),
    ...guides.map((guide) => `/guides/${guide.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
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
