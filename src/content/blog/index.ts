import type { Locale } from '@taksu/content';
import type { MDXContent } from 'mdx/types';
import * as floorEn from './lantai-kelas/en.mdx';
import * as floorId from './lantai-kelas/id.mdx';
import * as simulatorEn from './simulator-dulu/en.mdx';
import * as simulatorId from './simulator-dulu/id.mdx';
import type { PostMeta } from './types';
import * as leftOutEn from './yang-kami-buang/en.mdx';
import * as leftOutId from './yang-kami-buang/id.mdx';

export type { PostMeta } from './types';

type PostModule = { default: MDXContent; meta: PostMeta };

export interface Post {
  slug: string;
  meta: Record<Locale, PostMeta>;
  Body: Record<Locale, MDXContent>;
}

const post = (slug: string, id: PostModule, en: PostModule): Post => ({
  slug,
  meta: { id: id.meta, en: en.meta },
  Body: { id: id.default, en: en.default },
});

/**
 * Every post, newest first. To add one: create src/content/blog/<slug>/id.mdx and en.mdx,
 * each exporting `meta`, then list it here.
 */
export const posts: readonly Post[] = [
  post('simulator-dulu', simulatorId, simulatorEn),
  post('lantai-kelas', floorId, floorEn),
  post('yang-kami-buang', leftOutId, leftOutEn),
].sort((a, b) => b.meta.id.date.localeCompare(a.meta.id.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((entry) => entry.slug === slug);
}

/** "7 Oktober 2026" or "7 October 2026". */
export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
