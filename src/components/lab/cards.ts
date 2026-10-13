import { forumCategories, getLabChallenge, type Locale, names, pick } from '@taksu/content';
import type { getTranslations } from 'next-intl/server';
import { photoUrl } from '@/server/lab/media';
import type { Build, Thread } from '@/server/lab/repo';
import type { BuildCardData } from './build-card';
import { labDate } from './lab-format';
import type { ThreadRowData } from './thread-row';

type LabT = Awaited<ReturnType<typeof getTranslations<'Lab'>>>;

/** Who made it and where, e.g. "Kelas 5A, SD Negeri 1 Ubud". */
export function buildByline(build: Pick<Build, 'author' | 'school'>): string {
  return build.school ? `${build.author}, ${build.school}` : build.author;
}

/**
 * The name on a forum post. Team posts always show the current brand name, so renaming the
 * brand also renames every answer the team has already given.
 */
export function postAuthor(post: { author: string; staff: boolean; school?: string }): string {
  if (post.staff) return names.edu;
  return post.school ? `${post.author}, ${post.school}` : post.author;
}

export function toBuildCard(build: Build, t: LabT, locale: Locale): BuildCardData {
  const challenge = build.challenge ? getLabChallenge(build.challenge) : undefined;
  const photo = build.photos[0];
  return {
    id: build.id,
    title: build.title,
    kit: build.kit,
    kitLabel: t(`kits.${build.kit}`),
    byline: buildByline(build),
    challenge: challenge ? t('challengeTag', { title: pick(challenge.title, locale) }) : null,
    photo: photo
      ? {
          src: photoUrl(photo.id, 'sm'),
          width: Math.min(640, photo.width),
          height: Math.round((Math.min(640, photo.width) / photo.width) * photo.height),
        }
      : null,
  };
}

export function categoryTitle(id: string, locale: Locale): string {
  const category = forumCategories.find((entry) => entry.id === id);
  return category ? pick(category.title, locale) : id;
}

export function toThreadRow(thread: Thread, t: LabT, locale: Locale): ThreadRowData {
  return {
    id: thread.id,
    title: thread.title,
    category: categoryTitle(thread.category, locale),
    byline: thread.staff
      ? names.edu
      : t('byline', { author: thread.author, role: t(`roles.${thread.role}`).toLowerCase() }),
    replies: t('forumPage.replies', { count: thread.replyCount }),
    activity: t('forumPage.lastActivity', { date: labDate(thread.lastActivityAt, locale) }),
    pinned: thread.pinned,
    staff: thread.staff,
  };
}
