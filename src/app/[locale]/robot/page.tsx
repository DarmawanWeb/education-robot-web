import { goalLabels, pick, robots } from '@taksu/catalog';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GoalFilter } from '@/components/robots/goal-filter';
import { RobotRow } from '@/components/robots/robot-row';
import { DropBand } from '@/components/shared/drop-band';
import { Container } from '@/components/ui/container';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Catalog' });
  return pageMetadata({ locale, path: '/robot', title: t('title'), description: t('intro') });
}

export default async function RobotsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Catalog');
  const goals = (Object.keys(goalLabels) as (keyof typeof goalLabels)[]).map((id) => ({
    id,
    label: pick(goalLabels[id], locale),
  }));

  return (
    <>
      <section className="pt-14 pb-20 lg:pt-20 lg:pb-28">
        <Container>
          <h1 className="type-display text-[clamp(2.5rem,6vw,4.5rem)]">{t('title')}</h1>
          <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-relaxed">
            {t('intro')}
          </p>
          <div className="mt-10">
            <GoalFilter
              label={t('filter')}
              allLabel={t('all')}
              options={goals}
              goals={robots.map((robot) => robot.goals)}
            >
              {robots.map((robot) => (
                <RobotRow key={robot.slug} robot={robot} locale={locale} />
              ))}
            </GoalFilter>
          </div>
        </Container>
      </section>
      <DropBand locale={locale} compact />
    </>
  );
}
