import { getSimMission, type Locale, missionPlace, pick } from '@taksu/content';
import { getLocale, getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';

const kitName = { sd: 'SD v1', smp: 'SMP v1' } as const;

/** A simulator mission mentioned in a post, linked straight to the simulator. */
export async function SimMission({ id }: { id: string }) {
  const mission = getSimMission(id);
  if (!mission) return null;
  const locale = (await getLocale()) as Locale;
  const [t, common, simT] = await Promise.all([
    getTranslations('Blog'),
    getTranslations('Common'),
    getTranslations('Simulator'),
  ]);
  const place = missionPlace(mission);

  return (
    <aside className="border-edge bg-surface mt-8 rounded-lg border-2 p-5">
      <p className="text-muted-foreground text-sm font-semibold">
        {t('mission')}, {kitName[mission.robot]}
        {place ? `, ${simT('module', { n: place.module })}` : null}
      </p>
      <p className="mt-1 text-xl font-bold">{pick(mission.title, locale)}</p>
      <p className="text-muted-foreground mt-1">{pick(mission.brief, locale)}</p>
      <a
        href={simulatorUrl(locale, mission.robot, mission.id)}
        target="_blank"
        rel="noopener"
        className="decoration-primary mt-3 inline-block font-semibold underline decoration-2 underline-offset-4 hover:decoration-[3px]"
      >
        {t('openMission')}
        <span className="sr-only"> {common('newTab')}</span>
      </a>
    </aside>
  );
}
