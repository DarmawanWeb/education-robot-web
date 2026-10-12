import { curricula, educationLevels, type Locale, type SimRobot } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';
import { MissionLinks } from '../shared/mission-links';
import { SimShot } from '../shared/sim-shot';
import { ExternalAction } from '../ui/action-link';
import { Container } from '../ui/container';
import { TextLink } from '../ui/text-link';
import { MeetingStrip } from './meeting-strip';

const simRobots: SimRobot[] = ['sd', 'smp'];
const kitName = (slug: string) => educationLevels.find((level) => level.slug === slug)?.kit ?? slug;

/**
 * The workbench band: the simulator and the curriculum share the green cutting mat,
 * because that is where a lesson is planned and tried before the robot leaves the box.
 */
export async function Bench({ locale }: { locale: Locale }) {
  const [t, common] = await Promise.all([getTranslations('Home'), getTranslations('Common')]);
  const rows = educationLevels.map((level) => ({
    kit: level.kit,
    curriculum: curricula[level.slug],
  }));

  return (
    <section className="bg-mat text-mat-foreground">
      <div aria-hidden className="ruler h-4 text-white/45" />
      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
          <div>
            <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('sim.title')}</h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-white/90">
              {t('sim.body')}
            </p>
            <ExternalAction
              href={simulatorUrl(locale)}
              variant="onMat"
              newTabLabel={common('newTab')}
              className="mt-8"
            >
              {common('openSimulator')}
            </ExternalAction>
          </div>
          <SimShot locale={locale} alt={t('sim.imageAlt')} />
        </div>
        <h3 className="mt-14 text-xl font-bold">{t('sim.missions')}</h3>
        <div className="mt-5 grid gap-8 md:grid-cols-2">
          {simRobots.map((robot) => (
            <div key={robot}>
              <p className="type-label text-lg">{kitName(robot)}</p>
              <div className="mt-3">
                <MissionLinks robot={robot} locale={locale} />
              </div>
            </div>
          ))}
        </div>

        <div aria-hidden className="ruler my-16 h-4 text-white/45 lg:my-20" />

        <h2 className="type-label max-w-[22ch] text-[clamp(1.9rem,3.8vw,3rem)]">
          {t('curriculum.title')}
        </h2>
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-white/90">
          {t('curriculum.intro')}
        </p>
        <div className="mt-10">
          <MeetingStrip rows={rows} locale={locale} />
        </div>
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          <p className="max-w-[62ch] text-white/80">{t('curriculum.kka')}</p>
          <TextLink href="/curriculum" tone="tape">
            {t('curriculum.cta')}
          </TextLink>
        </div>
      </Container>
      <div aria-hidden className="ruler h-4 rotate-180 text-white/45" />
    </section>
  );
}
