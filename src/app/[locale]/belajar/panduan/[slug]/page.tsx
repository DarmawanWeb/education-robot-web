import { getGuide, getRobot, guides, learnPaths, pick } from '@dctedu/catalog';
import { cn } from '@dctedu/ui/lib/utils';
import { Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { TextLink } from '@/components/ui/text-link';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { robotStyle } from '@/lib/robot-style';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return pageMetadata({
    locale,
    path: `/belajar/panduan/${guide.slug}`,
    title: pick(guide.title, locale),
    description: pick(guide.summary, locale),
  });
}

export default async function GuidePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const t = await getTranslations('Guide');
  // Where this guide sits on the learning paths, so a reader can jump back to their step.
  const placements = learnPaths.flatMap((path) =>
    path.steps.flatMap((step, index) =>
      step.guide === guide.slug ? [{ robot: path.robot, step: step.id, n: index + 1 }] : [],
    ),
  );
  const more = guides
    .filter(
      (entry) =>
        entry.slug !== guide.slug && entry.robots.some((robot) => guide.robots.includes(robot)),
    )
    .slice(0, 5);

  return (
    <article className="pt-8 pb-20 lg:pt-12 lg:pb-28">
      <Container>
        <nav aria-label={t('breadcrumb')} className="text-muted-foreground text-sm font-semibold">
          <Link href="/belajar" className="hover:text-foreground hover:underline">
            {t('learn')}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <Link href="/belajar#panduan" className="hover:text-foreground hover:underline">
            {t('guides')}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span aria-current="page" className="text-foreground">
            {pick(guide.title, locale)}
          </span>
        </nav>

        <header className="mt-8 max-w-[48rem]">
          <h1 className="type-display text-[clamp(2.25rem,5vw,3.75rem)]">
            {pick(guide.title, locale)}
          </h1>
          <p className="text-muted-foreground mt-4 text-xl leading-relaxed">
            {pick(guide.summary, locale)}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <span className="bg-ink text-ink-foreground rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold">
              {t(`audience.${guide.audience}`)}
            </span>
            {guide.robots.map((slug) => {
              const robot = getRobot(slug);
              return robot ? (
                <Link
                  key={slug}
                  href={`/robot/${slug}`}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold hover:underline',
                    robotStyle[slug].fill,
                    robotStyle[slug].text,
                  )}
                >
                  {robot.name}
                </Link>
              ) : null;
            })}
            <span className="text-muted-foreground inline-flex items-center gap-1 pl-1 text-sm font-semibold">
              <Clock className="size-3.5" aria-hidden />
              {t('minutes', { minutes: guide.minutes })}
            </span>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className="grid max-w-[48rem] gap-6">
            {guide.sections.map((section) => (
              <section key={section.title.en} className="bg-surface rounded-xl border p-6 sm:p-8">
                <h2 className="type-display text-[clamp(1.5rem,2.6vw,2rem)]">
                  {pick(section.title, locale)}
                </h2>
                <ol className="mt-5 grid gap-4">
                  {section.steps.map((step, index) => (
                    <li key={step.en} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                      <span className="type-number text-primary pt-0.5 text-lg">{index + 1}</span>
                      <p className="text-lg leading-relaxed">{pick(step, locale)}</p>
                    </li>
                  ))}
                </ol>
                {section.note ? (
                  <p className="border-l-accent bg-accent-soft mt-6 rounded-md border-l-[5px] px-4 py-3 leading-relaxed">
                    <span className="font-bold">{t('note')}: </span>
                    {pick(section.note, locale)}
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          <aside className="grid content-start gap-10 lg:sticky lg:top-24 lg:self-start">
            {placements.length > 0 ? (
              <div>
                <h2 className="text-muted-foreground text-sm font-bold">{t('inPath')}</h2>
                <ul className="mt-3 grid gap-2">
                  {placements.map((place) => (
                    <li key={`${place.robot}-${place.step}`}>
                      <TextLink href={`/belajar/${place.robot}#${place.step}`}>
                        {t('step', {
                          n: place.n,
                          robot: getRobot(place.robot)?.name ?? place.robot,
                        })}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {more.length > 0 ? (
              <div>
                <h2 className="text-muted-foreground text-sm font-bold">{t('more')}</h2>
                <ul className="mt-3 grid gap-3">
                  {more.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/belajar/panduan/${entry.slug}`}
                        className="font-bold hover:underline hover:decoration-2 hover:underline-offset-4"
                      >
                        {pick(entry.title, locale)}
                      </Link>
                      <p className="text-muted-foreground text-sm">
                        {t('minutes', { minutes: entry.minutes })}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </article>
  );
}
