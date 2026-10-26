import {
  guides,
  type LearnPath,
  learnPaths,
  pick,
  type Robot,
  robots,
  stepTitle,
} from '@dctedu/catalog';
import { RaceNumber } from '@dctedu/ui/brand/race-number';
import { Button } from '@dctedu/ui/components/button';
import { cn } from '@dctedu/ui/lib/utils';
import { Bot, Gamepad2, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import simEn from '@/assets/sim/sim-en.webp';
import simId from '@/assets/sim/sim-id.webp';
import { GuideList } from '@/components/learn/guide-list';
import { StepNumber } from '@/components/learn/step-number';
import { RobotChips } from '@/components/robots/robot-chips';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Link } from '@/i18n/navigation';
import { simulatorUrl } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { robotStyle } from '@/lib/robot-style';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Learn' });
  return pageMetadata({ locale, path: '/belajar', title: t('title'), description: t('meta') });
}

const PARTS = [
  { id: 'understand', icon: Lightbulb },
  { id: 'try', icon: Gamepad2 },
  { id: 'run', icon: Bot },
] as const;

export default async function LearnPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Learn');
  const paths = learnPaths
    .map((path) => ({ path, robot: robots.find((robot) => robot.slug === path.robot) }))
    .filter((entry): entry is { path: LearnPath; robot: Robot } => !!entry.robot);

  return (
    <>
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20">
        <Container>
          <h1 className="type-display max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)]">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-relaxed">
            {t('intro')}
          </p>
          <h2 className="mt-14 text-xl font-bold">{t('parts.title')}</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {PARTS.map((part) => (
              <li key={part.id} className="bg-surface flex gap-4 rounded-lg border p-5">
                <span className="bg-ink text-ink-foreground grid size-11 shrink-0 place-items-center rounded-md">
                  <part.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold">{t(`parts.${part.id}.title`)}</span>
                  <span className="text-muted-foreground mt-1 block leading-snug">
                    {t(`parts.${part.id}.body`)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="jalur" className="bg-surface scroll-mt-16 border-y py-16 lg:py-24">
        <Container>
          <SectionHeading title={t('paths')} />
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {paths.map(({ path, robot }) => {
              const full = path.steps.length > 1;
              return (
                <li key={robot.slug}>
                  <article className="bg-background relative flex h-full flex-col overflow-hidden rounded-xl border">
                    <div className={cn('h-3', robotStyle[robot.slug].fill)} />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3">
                        <RaceNumber value={robot.number} size="md" />
                        <h3 className="type-number text-[2rem]">{robot.name}</h3>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {full ? (
                          <span className="bg-ink text-ink-foreground rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold">
                            {t('steps', { count: path.steps.length })}
                          </span>
                        ) : null}
                        <RobotChips robot={robot} locale={locale} />
                      </div>
                      <p className="text-muted-foreground mt-4 leading-relaxed">
                        {pick(path.intro, locale)}
                      </p>
                      {full ? (
                        <ol className="mt-5 grid gap-2">
                          {path.steps.slice(0, 4).map((step, index) => (
                            <li key={step.id} className="flex items-center gap-3 font-semibold">
                              <StepNumber n={index + 1} className="size-8 border-2 text-sm" />
                              {pick(stepTitle(step), locale)}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="mt-5 font-semibold">{t('soon')}</p>
                      )}
                      <div className="mt-auto pt-7">
                        <Button asChild size="lg" variant={full ? 'ink' : 'outline'}>
                          <Link href={`/belajar/${robot.slug}`}>
                            {t('start', { robot: robot.name })}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <p className="text-muted-foreground mt-8 max-w-[70ch]">{t('notService')}</p>
        </Container>
      </section>

      <section className="asphalt py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div>
            <SectionHeading title={t('sim.title')} intro={t('sim.body')} tone="onDark" />
            <Button asChild size="lg" variant="light" className="mt-8">
              <a href={simulatorUrl(locale)}>
                <Gamepad2 aria-hidden />
                {t('sim.action')}
              </a>
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/15">
            <Image
              src={locale === 'en' ? simEn : simId}
              alt={t('sim.imageAlt')}
              placeholder="blur"
              sizes="(min-width: 1024px) 42rem, 100vw"
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>

      <section id="panduan" className="scroll-mt-16 py-16 lg:py-24">
        <Container>
          <SectionHeading title={t('guides.title')} intro={t('guides.intro')} />
          {(['owner', 'instructor'] as const).map((audience) => {
            const list = guides.filter((guide) => guide.audience === audience);
            return list.length > 0 ? (
              <div key={audience} className="mt-10">
                <h3 className="text-lg font-bold">{t(`guides.${audience}`)}</h3>
                <GuideList guides={list} locale={locale} className="mt-4" />
              </div>
            ) : null;
          })}
        </Container>
      </section>
    </>
  );
}
