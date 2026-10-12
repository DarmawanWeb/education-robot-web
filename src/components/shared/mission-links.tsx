import { type Locale, pick, type SimRobot, simMissions } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';

/** Deep links into the simulator, one per mission, for use on the green mat. */
export async function MissionLinks({ robot, locale }: { robot: SimRobot; locale: Locale }) {
  const [simT, common] = await Promise.all([
    getTranslations('Simulator'),
    getTranslations('Common'),
  ]);
  return (
    <ol className="flex flex-col gap-2">
      {simMissions
        .filter((mission) => mission.robot === robot)
        .map((mission) => (
          <li key={mission.id}>
            <a
              href={simulatorUrl(locale, mission.robot, mission.id)}
              target="_blank"
              rel="noopener"
              className="group flex items-baseline gap-3 rounded-sm py-0.5"
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
  );
}
