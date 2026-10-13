import { forumCategories, getLabChallenge, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ActionButton } from '@/components/lab/admin/action-button';
import { LoginForm } from '@/components/lab/admin/login-form';
import { categoryTitle } from '@/components/lab/cards';
import { fieldClass, submitClass } from '@/components/lab/form-parts';
import { labDate, paragraphs } from '@/components/lab/lab-format';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/lib/locale';
import { lab } from '@/server/lab';
import { isAdmin } from '@/server/lab/http';
import { photoUrl } from '@/server/lab/media';
import {
  type Build,
  listBuilds,
  listThreads,
  pendingCounts,
  pendingReplies,
  type Thread,
} from '@/server/lab/repo';
import { logout, teamReply, teamThread } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lab admin',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
};

const tabs = ['queue', 'builds', 'forum'] as const;
type Tab = (typeof tabs)[number];

function Text({ value }: { value: string }) {
  return (
    <>
      {paragraphs(value).map((paragraph) => (
        <p key={paragraph} className="mt-2 whitespace-pre-line [overflow-wrap:anywhere]">
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default async function AdminPage({ params, searchParams }: Props) {
  const [locale, query] = await Promise.all([resolveLocale(params), searchParams]);
  const t = await getTranslations('Lab');
  const { config, db } = lab();

  if (!config.adminPassword || !(await isAdmin(config))) {
    return (
      <section className="py-16">
        <Container>
          <h1 className="type-label text-4xl">{t('admin.title')}</h1>
          <div className="mt-8">
            {config.adminPassword ? (
              <LoginForm locale={locale} />
            ) : (
              <p className="text-muted-foreground max-w-xl text-lg">{t('admin.locked')}</p>
            )}
          </div>
        </Container>
      </section>
    );
  }

  const tab: Tab = (tabs as readonly string[]).includes(query.tab ?? '')
    ? (query.tab as Tab)
    : 'queue';
  const counts = pendingCounts(db);
  const waiting = counts.builds + counts.threads + counts.replies;
  const role = (value: string) => t(`roles.${value as 'teacher'}`);

  const BuildDetails = ({ build }: { build: Build }) => {
    const challenge = build.challenge ? getLabChallenge(build.challenge) : undefined;
    return (
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-sm">
          {t(`kits.${build.kit}`)}
          {challenge ? `, ${t('challengeTag', { title: pick(challenge.title, locale) })}` : ''}
          {', '}
          {t('admin.submitted', { date: labDate(build.createdAt, locale) })}
        </p>
        <h3 className="mt-1 text-xl font-bold">{build.title}</h3>
        <p className="mt-1 font-semibold">
          {build.author}, {role(build.role)}
          {build.school ? `, ${build.school}` : ''}
          {build.city ? `, ${build.city}` : ''}
        </p>
        <Text value={build.summary} />
        {build.changes ? (
          <div className="text-muted-foreground">
            <Text value={build.changes} />
          </div>
        ) : null}
        {build.videoId ? (
          <a
            href={`https://www.youtube.com/watch?v=${build.videoId}`}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-block font-semibold underline"
          >
            YouTube: {build.videoId}
          </a>
        ) : null}
        <p className="bg-accent-soft mt-3 rounded-md px-3 py-2 text-sm">
          <span className="font-bold">{t('admin.contact')}:</span>{' '}
          {build.contact || t('admin.noContact')}
        </p>
      </div>
    );
  };

  const Photos = ({ build }: { build: Build }) => (
    <ul className="flex flex-wrap gap-2 lg:w-72">
      {build.photos.map((photo) => (
        <li key={photo.id}>
          <a href={photoUrl(photo.id, 'lg')} target="_blank" rel="noopener">
            {/* biome-ignore lint/performance/noImgElement: moderation thumbnails from the Lab API */}
            <img
              src={photoUrl(photo.id, 'sm')}
              alt=""
              className="border-edge size-32 rounded-md border-2 object-cover"
            />
          </a>
        </li>
      ))}
    </ul>
  );

  const ThreadSummary = ({ thread }: { thread: Thread }) => (
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground text-sm">
        {categoryTitle(thread.category, locale)},{' '}
        {t('admin.submitted', { date: labDate(thread.createdAt, locale) })}
      </p>
      <h3 className="mt-1 text-xl font-bold">{thread.title}</h3>
      <p className="mt-1 font-semibold">
        {thread.author}, {role(thread.role)}
        {thread.school ? `, ${thread.school}` : ''}
      </p>
      <Text value={thread.body} />
      {!thread.staff ? (
        <p className="bg-accent-soft mt-3 rounded-md px-3 py-2 text-sm">
          <span className="font-bold">{t('admin.contact')}:</span>{' '}
          {thread.contact || t('admin.noContact')}
        </p>
      ) : null}
    </div>
  );

  const card = 'border-edge bg-surface flex flex-col gap-5 rounded-lg border-2 p-5 lg:flex-row';

  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="type-label text-4xl">{t('admin.title')}</h1>
          <form action={logout}>
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="font-bold underline underline-offset-4">
              {t('admin.logout')}
            </button>
          </form>
        </div>
        <nav className="border-edge mt-8 flex flex-wrap gap-2 border-b-2 pb-3">
          {tabs.map((entry) => (
            <Link
              key={entry}
              href={{ pathname: '/lab/admin', query: { tab: entry } }}
              aria-current={tab === entry ? 'page' : undefined}
              className={cn(
                'border-edge rounded-md border-2 px-4 py-2 font-bold',
                tab === entry ? 'bg-ink text-ink-foreground' : 'bg-surface',
              )}
            >
              {t(`admin.tabs.${entry}`)}
              {entry === 'queue' && waiting > 0 ? (
                <span className="bg-primary ml-2 rounded-full px-2 py-0.5 text-sm text-black">
                  {waiting}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        {tab === 'queue' ? (
          <div className="mt-8 flex flex-col gap-12">
            {waiting === 0 ? (
              <p className="text-muted-foreground text-lg">{t('admin.queueEmpty')}</p>
            ) : null}
            {counts.builds > 0 ? (
              <section>
                <h2 className="type-label text-2xl">
                  {t('admin.pendingBuilds')} ({counts.builds})
                </h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {listBuilds(db, { status: 'pending', limit: 100 }).map((build) => (
                    <li key={build.id} className={card}>
                      <Photos build={build} />
                      <BuildDetails build={build} />
                      <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col">
                        <ActionButton action="publish-build" id={build.id} tone="primary">
                          {t('admin.publish')}
                        </ActionButton>
                        <ActionButton
                          action="delete-build"
                          id={build.id}
                          tone="danger"
                          confirm={t('admin.confirmDelete')}
                        >
                          {t('admin.reject')}
                        </ActionButton>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {counts.threads > 0 ? (
              <section>
                <h2 className="type-label text-2xl">
                  {t('admin.pendingThreads')} ({counts.threads})
                </h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {listThreads(db, { status: 'pending', limit: 100 }).map((thread) => (
                    <li key={thread.id} className={card}>
                      <ThreadSummary thread={thread} />
                      <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col">
                        <ActionButton action="publish-thread" id={thread.id} tone="primary">
                          {t('admin.publish')}
                        </ActionButton>
                        <ActionButton
                          action="delete-thread"
                          id={thread.id}
                          tone="danger"
                          confirm={t('admin.confirmDelete')}
                        >
                          {t('admin.reject')}
                        </ActionButton>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {counts.replies > 0 ? (
              <section>
                <h2 className="type-label text-2xl">
                  {t('admin.pendingReplies')} ({counts.replies})
                </h2>
                <ul className="mt-5 flex flex-col gap-4">
                  {pendingReplies(db).map((reply) => (
                    <li key={reply.id} className={card}>
                      <div className="min-w-0 flex-1">
                        <p className="text-muted-foreground text-sm">
                          {t('admin.inThread', { title: reply.threadTitle })}
                        </p>
                        <p className="mt-1 font-semibold">
                          {reply.author}, {role(reply.role)}
                        </p>
                        <Text value={reply.body} />
                      </div>
                      <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col">
                        <ActionButton action="publish-reply" id={reply.id} tone="primary">
                          {t('admin.publish')}
                        </ActionButton>
                        <ActionButton
                          action="delete-reply"
                          id={reply.id}
                          tone="danger"
                          confirm={t('admin.confirmDelete')}
                        >
                          {t('admin.reject')}
                        </ActionButton>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}

        {tab === 'builds' ? (
          <ul className="mt-8 flex flex-col gap-4">
            {listBuilds(db, { limit: 200 }).map((build) => (
              <li key={build.id} className={card}>
                <Photos build={build} />
                <div className="min-w-0 flex-1">
                  {build.featured ? (
                    <span className="bg-accent rounded-sm px-2 py-0.5 text-sm font-bold text-black">
                      {t('admin.featured')}
                    </span>
                  ) : null}
                  <BuildDetails build={build} />
                </div>
                <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col">
                  <Link
                    href={`/lab/builds/${build.id}`}
                    className="border-edge inline-flex min-h-10 items-center rounded-md border-2 px-3.5 text-[0.95rem] font-bold"
                  >
                    {t('admin.view')}
                  </Link>
                  <ActionButton
                    action={build.featured ? 'unfeature-build' : 'feature-build'}
                    id={build.id}
                    tone={build.featured ? 'plain' : 'primary'}
                  >
                    {build.featured ? t('admin.unfeature') : t('admin.feature')}
                  </ActionButton>
                  <ActionButton action="unpublish-build" id={build.id}>
                    {t('admin.unpublish')}
                  </ActionButton>
                  <ActionButton
                    action="delete-build"
                    id={build.id}
                    tone="danger"
                    confirm={t('admin.confirmDelete')}
                  >
                    {t('admin.delete')}
                  </ActionButton>
                </div>
              </li>
            ))}
            {listBuilds(db, { limit: 1 }).length === 0 ? (
              <p className="text-muted-foreground text-lg">{t('admin.noBuilds')}</p>
            ) : null}
          </ul>
        ) : null}

        {tab === 'forum' ? (
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <ul className="flex flex-col gap-4">
              {listThreads(db, { limit: 200 }).map((thread) => (
                <li key={thread.id} className={cn(card, 'lg:flex-col')}>
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <ThreadSummary thread={thread} />
                    <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col">
                      <Link
                        href={`/lab/forum/${thread.id}`}
                        className="border-edge inline-flex min-h-10 items-center rounded-md border-2 px-3.5 text-[0.95rem] font-bold"
                      >
                        {t('admin.view')}
                      </Link>
                      <ActionButton
                        action={thread.pinned ? 'unpin-thread' : 'pin-thread'}
                        id={thread.id}
                      >
                        {thread.pinned ? t('admin.unpin') : t('admin.pin')}
                      </ActionButton>
                      <ActionButton
                        action="delete-thread"
                        id={thread.id}
                        tone="danger"
                        confirm={t('admin.confirmDelete')}
                      >
                        {t('admin.delete')}
                      </ActionButton>
                    </div>
                  </div>
                  <form action={teamReply} className="flex flex-col gap-2">
                    <input type="hidden" name="threadId" value={thread.id} />
                    <label className="text-sm font-bold" htmlFor={`reply-${thread.id}`}>
                      {t('admin.teamReply')}
                    </label>
                    <textarea
                      id={`reply-${thread.id}`}
                      name="body"
                      rows={3}
                      required
                      className={cn(fieldClass, 'py-2')}
                    />
                    <button
                      type="submit"
                      className={cn(submitClass, 'min-h-10 self-start px-4 text-[0.95rem]')}
                    >
                      {t('admin.teamReplySend')}
                    </button>
                  </form>
                </li>
              ))}
              {listThreads(db, { limit: 1 }).length === 0 ? (
                <p className="text-muted-foreground text-lg">{t('admin.noThreads')}</p>
              ) : null}
            </ul>
            <aside>
              <form
                action={teamThread}
                className="border-edge flex flex-col gap-3 rounded-lg border-2 p-5"
              >
                <input type="hidden" name="locale" value={locale} />
                <h2 className="text-lg font-bold">{t('admin.newTeamThread')}</h2>
                <p className="text-muted-foreground text-sm">{t('admin.newTeamThreadHint')}</p>
                <select
                  name="category"
                  className={cn(fieldClass, 'h-11')}
                  aria-label={t('newThread.category')}
                >
                  {forumCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {pick(category.title, locale)}
                    </option>
                  ))}
                </select>
                <input
                  name="title"
                  required
                  maxLength={120}
                  aria-label={t('newThread.title_label')}
                  placeholder={t('newThread.title_label')}
                  className={cn(fieldClass, 'h-11')}
                />
                <textarea
                  name="body"
                  required
                  rows={6}
                  aria-label={t('newThread.body')}
                  placeholder={t('newThread.body')}
                  className={cn(fieldClass, 'py-2')}
                />
                <button type="submit" className={cn(submitClass, 'min-h-11 self-start px-4')}>
                  {t('admin.teamThreadSend')}
                </button>
              </form>
            </aside>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
