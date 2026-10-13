import { forumCategories, labChallenges, names, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import smpLine from '@/assets/kits/smp-line.webp';
import smpMonitor from '@/assets/kits/smp-monitor.webp';
import smpObstacle from '@/assets/kits/smp-obstacle.webp';
import smpVoice from '@/assets/kits/smp-voice.webp';
import { BuildCard } from '@/components/lab/build-card';
import { toBuildCard, toThreadRow } from '@/components/lab/cards';
import { ChallengeCard } from '@/components/lab/challenge-card';
import { ExampleCard } from '@/components/lab/example-card';
import { ThreadRow } from '@/components/lab/thread-row';
import { ActionLink } from '@/components/ui/action-link';
import { Container } from '@/components/ui/container';
import { Note } from '@/components/ui/note';
import { SectionTitle } from '@/components/ui/section-title';
import { TextLink } from '@/components/ui/text-link';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { lab } from '@/server/lab';
import { listBuilds, listThreads } from '@/server/lab/repo';

// Builds and topics change as moderators publish them.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Lab' });
  return pageMetadata({
    locale,
    path: '/lab',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

const examples = [
  { id: 'line', image: smpLine },
  { id: 'obstacle', image: smpObstacle },
  { id: 'voice', image: smpVoice },
  { id: 'monitor', image: smpMonitor },
] as const;

const steps = ['make', 'send', 'show'] as const;

export default async function LabPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [t, common] = await Promise.all([getTranslations('Lab'), getTranslations('Common')]);
  const { db } = lab();
  const featured = listBuilds(db, { featured: true, limit: 6 });
  const shown = featured.length > 0 ? featured : listBuilds(db, { limit: 6 });
  const threads = listThreads(db, { limit: 5 });

  return (
    <>
      <section className="bg-mat">
        <Container className="grid gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <h1 className="type-label max-w-[14ch] text-[clamp(2.4rem,5.6vw,4.4rem)] text-balance">
              {t('hero.title')}
            </h1>
            <p className="mt-5 max-w-[52ch] text-xl leading-relaxed opacity-90">{t('hero.body')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink href="/lab/submit" variant="onMat">
                {t('hero.submit')}
              </ActionLink>
              <ActionLink href="/lab/forum" variant="outline">
                {t('hero.forum')}
              </ActionLink>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold opacity-90">{t('steps.title')}</h2>
            <ol className="mt-4 flex flex-col gap-3">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-lg border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_0_#000]"
                >
                  <span className="bg-accent grid size-9 shrink-0 place-items-center rounded-md border-2 border-black font-bold">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-lg font-bold">{t(`steps.${step}.title`)}</span>
                    <span className="block text-[0.95rem] text-black/75">
                      {t(`steps.${step}.body`)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              title={shown.length > 0 ? t('featured.title') : t('featured.examplesTitle')}
              intro={shown.length > 0 ? t('featured.intro') : undefined}
            />
            {shown.length > 0 ? (
              <TextLink href="/lab/builds" className="shrink-0">
                {t('featured.all')}
              </TextLink>
            ) : null}
          </div>
          {shown.length > 0 ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((build) => (
                <li key={build.id}>
                  <BuildCard build={toBuildCard(build, t, locale)} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <Note className="mt-6">{t('featured.examplesNote')}</Note>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {examples.map((example) => (
                  <li key={example.id}>
                    <ExampleCard
                      image={example.image}
                      title={t(`examples.${example.id}.title`)}
                      body={t(`examples.${example.id}.body`)}
                      tag={t('team', { brand: names.edu })}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </section>

      <section className="bg-surface-muted py-16 lg:py-20">
        <Container>
          <SectionTitle title={t('challenges.title')} intro={t('challenges.intro')} />
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labChallenges.map((challenge) => (
              <li key={challenge.id}>
                <ChallengeCard
                  challenge={challenge}
                  locale={locale}
                  labels={{
                    kit: t(`kits.${challenge.kit}`),
                    doneWhen: t('challenges.doneWhen'),
                    tryInSim: t('challenges.tryInSim'),
                    submit: t('challenges.submit'),
                    newTab: common('newTab'),
                  }}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionTitle title={t('forum.title')} intro={t('forum.intro')} />
            <ActionLink href="/lab/forum/new" className="mt-8">
              {t('forum.ask')}
            </ActionLink>
            <ul className="mt-10 flex flex-wrap gap-2">
              {forumCategories.map((category) => (
                <li key={category.id}>
                  <TextLink
                    href={{ pathname: '/lab/forum', query: { category: category.id } }}
                    className="border-edge bg-surface inline-flex rounded-md border-2 px-3 py-1.5 text-[0.95rem] no-underline hover:underline"
                  >
                    {pick(category.title, locale)}
                  </TextLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="type-label text-2xl">{t('forum.latest')}</h3>
            {threads.length > 0 ? (
              <ul className="mt-6">
                {threads.map((thread) => (
                  <ThreadRow
                    key={thread.id}
                    thread={toThreadRow(thread, t, locale)}
                    labels={{ pinned: t('forumPage.pinned'), staff: t('forumPage.staff') }}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-6 text-lg">{t('forum.empty')}</p>
            )}
            <TextLink href="/lab/forum" className="mt-6 inline-block">
              {t('forum.open')}
            </TextLink>
          </div>
        </Container>
      </section>

      <section className="border-edge border-t-2 py-14">
        <Container>
          <h2 className="type-label text-2xl">{t('rules.title')}</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {(['review', 'faces', 'contact', 'removal'] as const).map((rule) => (
              <li key={rule} className="flex gap-3 text-[1.02rem] leading-relaxed">
                <span
                  aria-hidden
                  className="bg-primary mt-[0.55em] size-2 shrink-0 rounded-[2px]"
                />
                {t(`rules.${rule}`)}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
