import { curricula, educationLevels, getLevel, meetingCount, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ModuleCard } from '@/components/curriculum/module-card';
import { Rubric } from '@/components/curriculum/rubric';
import { SdTiers } from '@/components/curriculum/sd-tiers';
import { MeetingStrip } from '@/components/home/meeting-strip';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { LevelChip } from '@/components/ui/level-chip';
import { TextLink } from '@/components/ui/text-link';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; level: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return educationLevels.map((level) => ({ level: level.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [locale, { level: slug }] = await Promise.all([localeFromParams(params), params]);
  const level = getLevel(slug);
  if (!level) return {};
  const t = await getTranslations({ locale, namespace: 'Curriculum' });
  return pageMetadata({
    locale,
    path: `/curriculum/${level.slug}`,
    title: t('syllabus', { kit: level.kit }),
    description: t('metaDescription'),
  });
}

export default async function SyllabusPage({ params }: Props) {
  const [locale, { level: slug }] = await Promise.all([resolveLocale(params), params]);
  const level = getLevel(slug);
  if (!level) notFound();
  const curriculum = curricula[level.slug];
  const [t, common, kitT, nav] = await Promise.all([
    getTranslations('Curriculum'),
    getTranslations('Common'),
    getTranslations('Kit'),
    getTranslations('Nav'),
  ]);
  const firstMeeting = curriculum.modules.map((_, index) =>
    curriculum.modules.slice(0, index).reduce((total, module) => total + module.meetings.length, 1),
  );

  return (
    <>
      <section className="pt-8 pb-14 sm:pt-10">
        <Container>
          <nav aria-label={kitT('breadcrumb')}>
            <ol className="text-muted-foreground flex flex-wrap gap-2 text-[0.95rem] font-semibold">
              <li>
                <Link
                  href="/curriculum"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {nav('curriculum')}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {level.kit}
              </li>
            </ol>
          </nav>
          <h1 className="type-label mt-8 text-[clamp(2.6rem,7vw,5.2rem)]">
            {t('syllabus', { kit: level.kit })}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <LevelChip level={level.slug}>{kitT('for', { level: level.short })}</LevelChip>
            <span className="text-muted-foreground font-semibold">
              {common('meetings', { count: meetingCount(curriculum) })},{' '}
              {t('perMeeting', { count: curriculum.minutesPerMeeting })},{' '}
              {t('modulesCount', { count: curriculum.modules.length })}
            </span>
          </p>
        </Container>
      </section>

      <section className="bg-mat text-mat-foreground">
        <div aria-hidden className="ruler h-4 text-white/45" />
        <Container className="py-12">
          <MeetingStrip rows={[{ kit: level.kit, curriculum }]} locale={locale} compact />
        </Container>
        <div aria-hidden className="ruler h-4 rotate-180 text-white/45" />
      </section>

      <section className="py-14 lg:py-20">
        <Container
          className={level.slug === 'sd' ? 'grid gap-12 lg:grid-cols-2 lg:gap-16' : 'grid gap-12'}
        >
          <div>
            <h2 className="type-label text-3xl">{t('kkaTitle')}</h2>
            <p className="text-muted-foreground mt-2">
              {t('kkaIntro')} {pick(curriculum.kkaPhase, locale)}
            </p>
            <ul className="mt-6 flex flex-col gap-4">
              {curriculum.kka.map((item) => (
                <li key={item.element.en} className="border-edge border-l-4 pl-4">
                  <p className="text-lg font-semibold">{pick(item.element, locale)}</p>
                  <p className="text-muted-foreground">{pick(item.how, locale)}</p>
                </li>
              ))}
            </ul>
          </div>
          {level.slug === 'sd' ? <SdTiers locale={locale} /> : null}
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container className="flex flex-col gap-8">
          {curriculum.modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              total={curriculum.modules.length}
              firstMeeting={firstMeeting[index] ?? 1}
              locale={locale}
            />
          ))}
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <Rubric locale={locale} />
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            <TextLink href="/guides/panduan-guru">{t('teacherGuide')}</TextLink>
            <TextLink href={`/kits/${level.slug}`}>
              {common('viewKit', { kit: level.kit })}
            </TextLink>
          </div>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
