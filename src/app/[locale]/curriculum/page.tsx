import { curricula, educationLevels, meetingCount, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Rubric } from '@/components/curriculum/rubric';
import { MeetingStrip } from '@/components/home/meeting-strip';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { levelTone } from '@/components/ui/level-chip';
import { SectionTitle } from '@/components/ui/section-title';
import { TextLink } from '@/components/ui/text-link';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Curriculum' });
  return pageMetadata({
    locale,
    path: '/curriculum',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function CurriculumPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [t, home, common] = await Promise.all([
    getTranslations('Curriculum'),
    getTranslations('Home.curriculum'),
    getTranslations('Common'),
  ]);
  const rows = educationLevels.map((level) => ({
    kit: level.kit,
    curriculum: curricula[level.slug],
  }));

  return (
    <>
      <section className="pt-12 pb-16 sm:pt-16 lg:pb-20">
        <Container>
          <SectionTitle as="h1" title={t('title')} intro={t('intro')} />
          <ul className="mt-12 grid gap-8 lg:grid-cols-3">
            {educationLevels.map((level) => {
              const curriculum = curricula[level.slug];
              return (
                <li
                  key={level.slug}
                  className="box-ink-sm bg-surface flex flex-col overflow-hidden rounded-lg"
                >
                  <span
                    className={`block h-2.5 border-b-2 border-black ${levelTone[level.slug]}`}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="type-label text-3xl">{level.kit}</h2>
                    <p className="text-muted-foreground mt-2 font-semibold">
                      {common('meetings', { count: meetingCount(curriculum) })},{' '}
                      {t('perMeeting', { count: curriculum.minutesPerMeeting })}
                    </p>
                    <ol className="mt-5 flex flex-1 flex-col gap-1.5">
                      {curriculum.modules.map((module, index) => (
                        <li key={module.id} className="flex items-baseline gap-3">
                          <span className="text-muted-foreground w-4 text-right text-sm tabular-nums">
                            {index + 1}
                          </span>
                          {pick(module.title, locale)}
                        </li>
                      ))}
                    </ol>
                    <TextLink href={`/curriculum/${level.slug}`} className="mt-6 self-start">
                      {t('open', { kit: level.kit })}
                    </TextLink>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="bg-mat text-mat-foreground">
        <div aria-hidden className="ruler h-4 text-white/45" />
        <Container className="py-16 lg:py-20">
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('overviewTitle')}</h2>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-white/90">{home('intro')}</p>
          <div className="mt-10">
            <MeetingStrip rows={rows} locale={locale} />
          </div>
          <p className="mt-8 max-w-[62ch] text-white/80">{home('kka')}</p>
        </Container>
        <div aria-hidden className="ruler h-4 rotate-180 text-white/45" />
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <Rubric locale={locale} />
          <TextLink href="/guides/panduan-guru" className="mt-12 inline-block">
            {t('teacherGuide')}
          </TextLink>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
