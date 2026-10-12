import { educationLevels, type SimRobot } from '@taksu/content';
import {
  Activity,
  Code2,
  type LucideIcon,
  Radar,
  ScanLine,
  Smile,
  Thermometer,
} from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MissionLinks } from '@/components/shared/mission-links';
import { SimShot } from '@/components/shared/sim-shot';
import { ActionLink, ExternalAction } from '@/components/ui/action-link';
import { Container } from '@/components/ui/container';
import { simulatorUrl } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

type FeatureId = 'physics' | 'line' | 'distance' | 'outputs' | 'env' | 'code';

const features: { id: FeatureId; icon: LucideIcon }[] = [
  { id: 'physics', icon: Activity },
  { id: 'line', icon: ScanLine },
  { id: 'distance', icon: Radar },
  { id: 'outputs', icon: Smile },
  { id: 'env', icon: Thermometer },
  { id: 'code', icon: Code2 },
];

const simRobots: SimRobot[] = ['sd', 'smp'];
const kitName = (slug: string) => educationLevels.find((level) => level.slug === slug)?.kit ?? slug;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Simulator' });
  return pageMetadata({
    locale,
    path: '/simulator',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function SimulatorPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [t, common, home] = await Promise.all([
    getTranslations('Simulator'),
    getTranslations('Common'),
    getTranslations('Home.sim'),
  ]);

  return (
    <>
      <section className="pt-12 pb-16 sm:pt-16 lg:pb-20">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
          <div>
            <h1 className="type-label text-[clamp(2.4rem,4.6vw,3.8rem)] text-balance">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-4 max-w-[52ch] text-lg leading-relaxed">
              {t('intro')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ExternalAction href={simulatorUrl(locale)} newTabLabel={common('newTab')}>
                {common('openSimulator')}
              </ExternalAction>
              <ActionLink href="/contact" variant="plain">
                {t('trialCta')}
              </ActionLink>
            </div>
          </div>
          <SimShot locale={locale} alt={home('imageAlt')} priority />
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('featuresTitle')}</h2>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ id, icon: Icon }) => (
              <li key={id} className="border-edge flex gap-4 border-t-2 pt-5">
                <span className="bg-ink text-ink-foreground flex size-11 shrink-0 items-center justify-center rounded-md">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-lg font-semibold">{t(`features.${id}`)}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mat text-mat-foreground">
        <div aria-hidden className="ruler h-4 text-white/45" />
        <Container className="py-16 lg:py-20">
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('missionsTitle')}</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {simRobots.map((robot) => (
              <div key={robot}>
                <h3 className="type-label text-2xl">{kitName(robot)}</h3>
                <div className="mt-4">
                  <MissionLinks robot={robot} locale={locale} />
                </div>
              </div>
            ))}
          </div>
        </Container>
        <div aria-hidden className="ruler h-4 rotate-180 text-white/45" />
      </section>

      <section className="bg-ink text-ink-foreground">
        <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
          <div className="max-w-2xl">
            <h2 className="type-label text-[clamp(2.2rem,4.6vw,3.6rem)]">{t('trialTitle')}</h2>
            <p className="mt-4 text-lg leading-relaxed opacity-85">{t('trialBody')}</p>
          </div>
          <ActionLink href="/contact" variant="onMat" className="shrink-0">
            {t('trialCta')}
          </ActionLink>
        </Container>
      </section>
    </>
  );
}
