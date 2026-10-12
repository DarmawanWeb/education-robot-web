import { curricula, type EducationLevel, type Locale, pick } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { Container } from '../ui/container';

/** The facts printed on the side of the box. */
export async function KitSpecs({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const [t, rows, common, curriculumT] = await Promise.all([
    getTranslations('Kit'),
    getTranslations('Kits.rows'),
    getTranslations('Common'),
    getTranslations('Curriculum'),
  ]);
  const specs = [
    {
      label: t('build'),
      value: pick(level.build.label, locale),
      body: pick(level.build.body, locale),
    },
    { label: t('controller'), value: level.controller },
    { label: t('programming'), value: pick(level.programming, locale) },
    {
      label: rows('curriculum'),
      value: common('meetings', { count: level.meetings }),
      body: curriculumT('perMeeting', { count: curricula[level.slug].minutesPerMeeting }),
    },
  ];

  return (
    <section className="pb-16 lg:pb-20">
      <Container>
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label} className="border-edge border-t-2 pt-4">
              <dt className="text-muted-foreground">{spec.label}</dt>
              <dd className="mt-1">
                <span className="block text-xl font-bold">{spec.value}</span>
                {spec.body ? (
                  <span className="text-muted-foreground mt-2 block">{spec.body}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
