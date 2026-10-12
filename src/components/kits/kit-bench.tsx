import {
  curricula,
  type EducationLevel,
  type Locale,
  meetingCount,
  pick,
  simMissions,
} from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';
import { MeetingStrip } from '../home/meeting-strip';
import { ExternalAction } from '../ui/action-link';
import { Container } from '../ui/container';
import { TextLink } from '../ui/text-link';

/** One kit's simulator missions and syllabus, on the same mat as the home page bench. */
export async function KitBench({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const [t, simT, common, curriculumT] = await Promise.all([
    getTranslations('Kit'),
    getTranslations('Simulator'),
    getTranslations('Common'),
    getTranslations('Curriculum'),
  ]);
  const curriculum = curricula[level.slug];
  const missions = simMissions.filter((mission) => mission.robot === level.simTrack);

  return (
    <section className="bg-mat text-mat-foreground">
      <div aria-hidden className="ruler h-4 text-white/45" />
      <Container className="grid gap-14 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-20">
        <div>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('simulator')}</h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-white/90">
            {pick(level.simulator, locale)}
          </p>
          {missions.length > 0 && level.simTrack ? (
            <>
              <h3 className="mt-8 text-lg font-bold">{t('missions', { kit: level.kit })}</h3>
              <ol className="mt-3 flex flex-col gap-2">
                {missions.map((mission) => (
                  <li key={mission.id}>
                    <a
                      href={simulatorUrl(locale, mission.robot, mission.id)}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-baseline gap-3"
                    >
                      <span className="text-sm whitespace-nowrap text-white/70 tabular-nums">
                        {simT('module', { n: mission.module })}
                      </span>
                      <span className="font-semibold underline decoration-white/35 underline-offset-4 group-hover:decoration-white">
                        {pick(mission.title, locale)}
                      </span>
                      <span className="sr-only">{common('newTab')}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <ExternalAction
                href={simulatorUrl(locale, level.simTrack)}
                variant="onMat"
                newTabLabel={common('newTab')}
                className="mt-8"
              >
                {t('trySim', { kit: level.kit })}
              </ExternalAction>
            </>
          ) : null}
        </div>
        <div>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">
            {t('curriculumTitle', { count: meetingCount(curriculum) })}
          </h2>
          <p className="mt-4 text-lg text-white/90">
            {curriculumT('perMeeting', { count: curriculum.minutesPerMeeting })}
          </p>
          <ol className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {curriculum.modules.map((module, index) => (
              <li key={module.id} className="flex items-baseline gap-3">
                <span className="w-5 shrink-0 text-right text-sm text-white/70 tabular-nums">
                  {index + 1}
                </span>
                <span className="font-semibold">{pick(module.title, locale)}</span>
                <span className="ml-auto text-sm whitespace-nowrap text-white/70">
                  {common('meetings', { count: module.meetings.length })}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <MeetingStrip rows={[{ kit: level.kit, curriculum }]} locale={locale} compact />
          </div>
          <TextLink href={`/curriculum/${level.slug}`} tone="tape" className="mt-8 inline-block">
            {t('curriculumCta', { kit: level.kit })}
          </TextLink>
        </div>
      </Container>
      <div aria-hidden className="ruler h-4 rotate-180 text-white/45" />
    </section>
  );
}
