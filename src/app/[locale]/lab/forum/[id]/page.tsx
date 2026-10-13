import type { Locale } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { categoryTitle, postAuthor } from '@/components/lab/cards';
import { labDate, paragraphs } from '@/components/lab/lab-format';
import { ReplyForm } from '@/components/lab/reply-form';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { lab } from '@/server/lab';
import { ID_PATTERN } from '@/server/lab/ids';
import { getThread, listReplies } from '@/server/lab/repo';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; id: string }> };

function publishedThread(id: string) {
  if (!ID_PATTERN.test(id)) return undefined;
  const thread = getThread(lab().db, id);
  return thread?.status === 'published' ? thread : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [locale, { id }] = await Promise.all([localeFromParams(params), params]);
  const thread = publishedThread(id);
  if (!thread) return {};
  return pageMetadata({
    locale,
    path: `/lab/forum/${thread.id}`,
    title: thread.title,
    description: thread.body.slice(0, 160),
  });
}

/** One post in a topic. Team posts carry a badge and no role, since the team is not a visitor. */
function Post({
  author,
  role,
  createdAt,
  locale,
  body,
  staffLabel,
}: {
  author: string;
  role: string | null;
  createdAt: string;
  locale: Locale;
  body: string;
  staffLabel: string | null;
}) {
  return (
    <div>
      <p className="font-bold">
        {author}
        {staffLabel ? (
          <span className="bg-ink text-ink-foreground ml-2 rounded-sm px-1.5 py-0.5 text-xs font-bold">
            {staffLabel}
          </span>
        ) : null}
      </p>
      <p className="text-muted-foreground text-sm">
        {role ? `${role}, ` : null}
        <time dateTime={createdAt}>{labDate(createdAt, locale)}</time>
      </p>
      <div className="mt-3 flex flex-col gap-3 text-lg leading-relaxed">
        {paragraphs(body).map((paragraph) => (
          <p key={paragraph} className="whitespace-pre-line [overflow-wrap:anywhere]">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export default async function ThreadPage({ params }: Props) {
  const [locale, { id }] = await Promise.all([resolveLocale(params), params]);
  const thread = publishedThread(id);
  if (!thread) notFound();
  const [t, nav] = await Promise.all([getTranslations('Lab'), getTranslations('Nav')]);
  const replies = listReplies(lab().db, thread.id);
  const staffLabel = t('forumPage.staff');
  const role = (post: { role: string; staff: boolean }) =>
    post.staff ? null : t(`roles.${post.role as 'teacher'}`);

  return (
    <section className="pt-8 pb-16 sm:pt-10 lg:pb-24">
      <Container>
        <nav aria-label={t('thread.breadcrumb')}>
          <ol className="text-muted-foreground flex flex-wrap gap-2 text-[0.95rem] font-semibold">
            <li>
              <Link
                href="/lab"
                className="hover:text-foreground underline-offset-4 hover:underline"
              >
                {nav('lab')}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href="/lab/forum"
                className="hover:text-foreground underline-offset-4 hover:underline"
              >
                {t('forumPage.title')}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={{ pathname: '/lab/forum', query: { category: thread.category } }}
                className="hover:text-foreground underline-offset-4 hover:underline"
              >
                {categoryTitle(thread.category, locale)}
              </Link>
            </li>
          </ol>
        </nav>
        <div className="mx-auto mt-8 max-w-[46rem]">
          <h1 className="type-label text-[clamp(2rem,4.4vw,3.2rem)] text-balance">
            {thread.title}
          </h1>
          <div className="border-edge mt-8 border-t-2 pt-6">
            <Post
              author={postAuthor(thread)}
              role={role(thread)}
              createdAt={thread.createdAt}
              locale={locale}
              body={thread.body}
              staffLabel={thread.staff ? staffLabel : null}
            />
          </div>

          <h2 className="type-label mt-14 text-2xl">
            {t('thread.repliesTitle')}
            <span className="text-muted-foreground ml-2 text-lg">{replies.length}</span>
          </h2>
          {replies.length > 0 ? (
            <ol className="mt-6 flex flex-col">
              {replies.map((reply) => (
                <li
                  key={reply.id}
                  className={
                    reply.staff
                      ? 'border-primary bg-surface-muted my-2 rounded-md border-l-4 p-5'
                      : 'border-border border-b py-6 first:pt-0'
                  }
                >
                  <Post
                    author={postAuthor(reply)}
                    role={role(reply)}
                    createdAt={reply.createdAt}
                    locale={locale}
                    body={reply.body}
                    staffLabel={reply.staff ? staffLabel : null}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground mt-4">{t('thread.noReplies')}</p>
          )}

          <div className="border-edge mt-14 border-t-2 pt-8">
            <h2 className="type-label text-2xl">{t('thread.replyTitle')}</h2>
            <p className="text-muted-foreground mt-2">{t('rules.review')}</p>
            <div className="mt-6">
              <ReplyForm threadId={thread.id} locale={locale} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
