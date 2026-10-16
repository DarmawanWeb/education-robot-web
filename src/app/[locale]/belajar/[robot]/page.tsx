import { getGuide, getRobot, learnPath, learnPaths, pick, robots, stepTitle } from '@taksu/catalog';
import { RaceNumber } from '@taksu/ui/brand/race-number';
import { Button } from '@taksu/ui/components/button';
import { cn } from '@taksu/ui/lib/utils';
import { BookOpen, Gamepad2 } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { StepNumber } from '@/components/learn/step-number';
import { StepVideo } from '@/components/learn/step-video';
import { RobotChips } from '@/components/robots/robot-chips';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/navigation';
import { simulatorUrl } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { robotStyle } from '@/lib/robot-style';

type Props = { params: Promise<{ locale: string; robot: string }> };

export function generateStaticParams() {
  return learnPaths.map((path) => ({ robot: path.robot }));
}

function find(slug: string) {
  const robot = getRobot(slug);
  const path = robot ? learnPath(robot.slug) : undefined;
  return robot && path ? { robot, path } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const found = find((await params).robot);
  if (!found) return {};
  const t = await getTranslations({ locale, namespace: 'Path' });
  const { robot, path } = found;
  return pageMetadata({
    locale,
    path: `/belajar/${robot.slug}`,
    title: t('title', { robot: robot.name }),
    description: t('meta', { count: path.steps.length, robot: robot.name }),
    image: robot.slug,
  });
}

export default async function PathPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const found = find((await params).robot);
  if (!found) notFound();
  const { robot, path } = found;
  const t = await getTranslations('Path');
  const next = robots.find((entry) => entry.number === robot.number + 1);
  const style = robotStyle[robot.slug];

  return (
    <>
      <section className="relative pt-8 pb-14 lg:pt-12 lg:pb-16">
        <Container>
          <nav aria-label={t('breadcrumb')} className="text-muted-foreground text-sm font-semibold">
            <Link href="/belajar" className="hover:text-foreground hover:underline">
              {t('learn')}
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-foreground">
              {robot.name}
            </span>
          </nav>
          <div className="mt-8 flex items-center gap-4">
            <RaceNumber value={robot.number} size="lg" />
            <h1 className="type-display text-[clamp(2.25rem,5.5vw,4rem)]">
              {t('title', { robot: robot.name })}
            </h1>
          </div>
          <p className="text-muted-foreground mt-5 max-w-[62ch] text-lg leading-relaxed">
            {pick(path.intro, locale)}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            <span className="bg-ink text-ink-foreground rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold">
              {t('steps', { count: path.steps.length })}
            </span>
            <RobotChips robot={robot} locale={locale} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {robot.sim ? (
              <Button asChild size="lg" variant="ink">
                <a href={simulatorUrl(locale, robot.sim)}>
                  <Gamepad2 aria-hidden />
                  {t('simulator')}
                </a>
              </Button>
            ) : null}
            <Button asChild size="lg" variant="outline">
              <Link href={`/robot/${robot.slug}`}>{t('robot', { robot: robot.name })}</Link>
            </Button>
          </div>
        </Container>
        <span aria-hidden className={cn('absolute inset-x-0 bottom-0 h-2', style.fill)} />
      </section>

      <section className="py-14 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <nav
            aria-labelledby="contents"
            className="hidden self-start lg:sticky lg:top-24 lg:block"
          >
            <h2 id="contents" className="text-muted-foreground text-sm font-bold">
              {t('contents')}
            </h2>
            <ol className="mt-3 grid gap-1">
              {path.steps.map((step, index) => (
                <li key={step.id}>
                  <a
                    href={`#${step.id}`}
                    className="hover:bg-surface-muted flex gap-2.5 rounded-md px-2 py-1.5 text-[0.9375rem] leading-snug font-semibold"
                  >
                    <span className="text-muted-foreground w-5 shrink-0 text-right tabular-nums">
                      {index + 1}
                    </span>
                    {pick(stepTitle(step), locale)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="grid gap-5">
            {path.steps.map((step, index) => {
              const guide = step.guide ? getGuide(step.guide) : undefined;
              const mission = step.mission && robot.sim ? step.mission : undefined;
              return (
                <li
                  key={step.id}
                  id={step.id}
                  className="bg-surface scroll-mt-20 rounded-xl border p-5 sm:p-7"
                >
                  <div className="grid gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5">
                    <StepNumber n={index + 1} />
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold sm:pt-1.5">
                        <span className="sr-only">{t('stepLabel', { n: index + 1 })}: </span>
                        {pick(stepTitle(step), locale)}
                      </h2>
                      <p className="mt-2 text-lg leading-relaxed">
                        {pick(step.understand, locale)}
                      </p>
                      {mission || guide ? (
                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                          {mission && robot.sim ? (
                            <Button asChild variant="ink">
                              <a
                                href={simulatorUrl(locale, robot.sim, mission)}
                                target="_blank"
                                rel="noopener"
                              >
                                <Gamepad2 aria-hidden />
                                {t('mission')}
                                <span className="sr-only"> {t('newTab')}</span>
                              </a>
                            </Button>
                          ) : null}
                          {guide ? (
                            <Link
                              href={`/belajar/panduan/${guide.slug}`}
                              className="decoration-primary inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-[6px] hover:decoration-[3px]"
                            >
                              <BookOpen className="size-4" aria-hidden />
                              {t('guide', { title: pick(guide.title, locale) })}
                            </Link>
                          ) : null}
                        </div>
                      ) : null}
                      {step.video ? (
                        <div className="mt-6 border-t pt-6">
                          <StepVideo
                            youtube={step.video.youtube}
                            title={step.video.title}
                            meta={t('video.by', {
                              channel: step.video.channel,
                              language: t(`video.languages.${step.video.language}`),
                            })}
                            note={pick(step.video.note, locale)}
                            locale={locale}
                            labels={{
                              play: t('video.play'),
                              watch: t('video.watch'),
                              newTab: t('newTab'),
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="asphalt py-16 lg:py-20">
        <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[46rem]">
            <h2 className="type-display text-[clamp(1.75rem,3.4vw,2.75rem)] text-white">
              {t('end.title')}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-white/75">{t('end.body')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="light">
              <Link href="/aksesori#upgrade">{t('end.addOns', { robot: robot.name })}</Link>
            </Button>
            {next ? (
              <Button asChild size="lg" variant="lightOutline">
                <Link href={`/robot/${next.slug}`}>{t('end.next', { robot: next.name })}</Link>
              </Button>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
