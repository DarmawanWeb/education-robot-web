import {
  type CurriculumModule,
  getSimMission,
  type Locale,
  pick,
  type SimMissionInfo,
} from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';
import { moduleColour } from '@/lib/module-colours';
import { ModuleVideo } from './module-video';

/** One module of the syllabus: what it is for, how learning shows, and every meeting. */
export async function ModuleCard({
  module,
  index,
  total,
  firstMeeting,
  locale,
}: {
  module: CurriculumModule;
  index: number;
  total: number;
  firstMeeting: number;
  locale: Locale;
}) {
  const [t, common] = await Promise.all([getTranslations('Curriculum'), getTranslations('Common')]);
  const missions = [...new Set(module.meetings.map((meeting) => meeting.sim))]
    .map((id) => (id ? getSimMission(id) : undefined))
    .filter((mission): mission is SimMissionInfo => mission !== undefined);

  return (
    <article
      id={module.id}
      className="border-edge bg-surface scroll-mt-24 overflow-hidden rounded-lg border-2"
    >
      <header className="border-edge grid gap-6 border-b-2 p-6 lg:grid-cols-2 lg:gap-10 print:break-inside-avoid">
        <div>
          <p className="text-muted-foreground flex items-center gap-2 font-semibold">
            <span
              aria-hidden
              className="size-3.5 rounded-[3px] border border-black"
              style={{ backgroundColor: moduleColour(index) }}
            />
            {t('module', { n: index + 1, total })}
          </p>
          <h2 className="type-label mt-2 text-[1.9rem]">{pick(module.title, locale)}</h2>
          <p className="mt-3">
            <span className="font-bold">{t('goal')}: </span>
            {pick(module.goal, locale)}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <p>
            <span className="font-bold">{t('concepts')}: </span>
            {module.concepts.map((concept) => pick(concept, locale)).join(', ')}
          </p>
          <p>
            <span className="font-bold">{t('evidence')}: </span>
            {pick(module.evidence, locale)}
          </p>
          {missions.length > 0 ? (
            <p>
              <span className="font-bold">{t('simMission')}: </span>
              {missions.map((mission, position) => (
                <span key={mission.id}>
                  {position > 0 ? ', ' : null}
                  <a
                    href={simulatorUrl(locale, mission.robot, mission.id)}
                    target="_blank"
                    rel="noopener"
                    className="decoration-primary font-semibold underline decoration-2 underline-offset-4 hover:decoration-[3px]"
                  >
                    {pick(mission.title, locale)}
                    <span className="sr-only"> {common('newTab')}</span>
                  </a>
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </header>
      {module.video ? (
        <div className="border-edge border-b-2 px-6 py-5">
          <ModuleVideo
            youtube={module.video.youtube}
            title={module.video.title}
            meta={[
              module.video.channel,
              t(`videoLang.${module.video.lang}`),
              ...(module.video.minutes ? [common('minutes', { count: module.video.minutes })] : []),
            ].join(', ')}
            note={pick(module.video.note, locale)}
            locale={locale}
            labels={{
              video: t('video'),
              play: t('playVideo'),
              watch: t('watchVideo'),
              newTab: common('newTab'),
            }}
          />
        </div>
      ) : null}
      <ol>
        {module.meetings.map((meeting, meetingIndex) => {
          const mission = meeting.sim ? getSimMission(meeting.sim) : undefined;
          return (
            <li
              key={meeting.title.en}
              className="border-border grid gap-1 border-t px-6 py-3.5 first:border-t-0 sm:grid-cols-[8.5rem_minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-5 print:break-inside-avoid"
            >
              <span className="text-muted-foreground font-semibold tabular-nums">
                {t('meeting', { n: firstMeeting + meetingIndex })}
              </span>
              <span className="font-bold">{pick(meeting.title, locale)}</span>
              <span className="text-muted-foreground">
                {pick(meeting.activity, locale)}
                {mission ? (
                  <>
                    {' '}
                    <a
                      href={simulatorUrl(locale, mission.robot, mission.id)}
                      target="_blank"
                      rel="noopener"
                      className="text-foreground decoration-primary font-semibold whitespace-nowrap underline decoration-2 underline-offset-4 hover:decoration-[3px] print:hidden"
                    >
                      {t('tryMission')}
                      <span className="sr-only">
                        : {pick(mission.title, locale)} {common('newTab')}
                      </span>
                    </a>
                  </>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
