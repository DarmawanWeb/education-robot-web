import { forumCategories, isForumCategory, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { toThreadRow } from '@/components/lab/cards';
import { ThreadRow } from '@/components/lab/thread-row';
import { ActionLink } from '@/components/ui/action-link';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { lab } from '@/server/lab';
import { listThreads, threadCounts } from '@/server/lab/repo';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Lab.forumPage' });
  return pageMetadata({
    locale,
    path: '/lab/forum',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function ForumPage({ params, searchParams }: Props) {
  const [locale, query] = await Promise.all([resolveLocale(params), searchParams]);
  const t = await getTranslations('Lab');
  const category = query.category && isForumCategory(query.category) ? query.category : undefined;
  const { db } = lab();
  const threads = listThreads(db, { category, limit: 100 });
  const counts = threadCounts(db);
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const item = (active: boolean) =>
    cn(
      'flex items-center justify-between gap-3 rounded-md px-3 py-2 font-semibold',
      active ? 'bg-ink text-ink-foreground' : 'hover:bg-surface-muted',
    );

  return (
    <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle as="h1" title={t('forumPage.title')} intro={t('forumPage.intro')} />
          <ActionLink
            href={category ? { pathname: '/lab/forum/new', query: { category } } : '/lab/forum/new'}
            className="shrink-0 self-start lg:self-end"
          >
            {t('forum.ask')}
          </ActionLink>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <nav aria-label={t('forumPage.categories')}>
            <h2 className="text-muted-foreground mb-3 text-sm font-bold">
              {t('forumPage.categories')}
            </h2>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/lab/forum"
                  aria-current={!category ? 'page' : undefined}
                  className={item(!category)}
                >
                  {t('forumPage.all')}
                  <span className="text-sm tabular-nums opacity-70">{total}</span>
                </Link>
              </li>
              {forumCategories.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={{ pathname: '/lab/forum', query: { category: entry.id } }}
                    aria-current={category === entry.id ? 'page' : undefined}
                    className={item(category === entry.id)}
                  >
                    {pick(entry.title, locale)}
                    <span className="text-sm tabular-nums opacity-70">
                      {counts.get(entry.id) ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            {category ? (
              <p className="text-muted-foreground mb-6">
                {pick(
                  forumCategories.find((entry) => entry.id === category)?.summary ?? {
                    id: '',
                    en: '',
                  },
                  locale,
                )}
              </p>
            ) : null}
            {threads.length > 0 ? (
              <ul>
                {threads.map((thread) => (
                  <ThreadRow
                    key={thread.id}
                    thread={toThreadRow(thread, t, locale)}
                    labels={{ pinned: t('forumPage.pinned'), staff: t('forumPage.staff') }}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-lg">
                {category ? t('forumPage.empty') : t('forum.empty')}
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
