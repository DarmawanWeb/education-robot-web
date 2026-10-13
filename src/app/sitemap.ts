import { educationLevels, guides } from '@taksu/content';
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';
import { lab } from '@/server/lab';
import { listBuilds, listThreads } from '@/server/lab/repo';

// Lab builds and topics are published while the site runs, so the sitemap is built per request.
export const dynamic = 'force-dynamic';

const staticPaths = [
  '',
  '/kits',
  '/upgrades',
  '/curriculum',
  '/simulator',
  '/schools',
  '/guides',
  '/lab',
  '/lab/builds',
  '/lab/forum',
  '/contact',
];

/** Published Lab pages, or none if the Lab database cannot be opened. */
function labPaths(): string[] {
  try {
    const { db } = lab();
    return [
      ...listBuilds(db, { limit: 1000 }).map((build) => `/lab/builds/${build.id}`),
      ...listThreads(db, { limit: 1000 }).map((thread) => `/lab/forum/${thread.id}`),
    ];
  } catch (error) {
    console.error('[lab] sitemap could not read the Lab database', error);
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...educationLevels.flatMap((level) => [`/kits/${level.slug}`, `/curriculum/${level.slug}`]),
    ...guides.map((guide) => `/guides/${guide.slug}`),
    ...labPaths(),
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
