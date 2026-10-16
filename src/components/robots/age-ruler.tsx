import { type Locale, levelLabels, pick, type Robot, robots } from '@taksu/catalog';
import { RaceNumber } from '@taksu/edu-ui/brand/race-number';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '../ui/container';
import { SectionHeading } from '../ui/section-heading';

const MIN_AGE = 6;
const MAX_AGE = 18;
const position = (age: number) => ((age - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100;

async function RobotFit({ robot, locale }: { robot: Robot; locale: Locale }) {
  const t = await getTranslations('Home.ages');
  return (
    <div className="bg-surface flex h-full flex-col rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <RaceNumber value={robot.number} size="sm" />
        <p className="type-number text-2xl">{robot.name}</p>
      </div>
      <p className="mt-3 flex flex-wrap gap-1.5 text-[0.8125rem] font-bold">
        <span className="bg-surface-muted rounded-full px-2.5 py-0.5">
          {t('age', { age: robot.age })}
        </span>
        <span className="bg-surface-muted rounded-full px-2.5 py-0.5">
          {pick(levelLabels[robot.level], locale)}
        </span>
      </p>
      <p className="mt-3 text-[0.95rem] leading-snug font-bold">{pick(robot.tagline, locale)}</p>
      <p className="text-muted-foreground mt-1 text-[0.95rem] leading-snug">
        {pick(robot.competition, locale)}
      </p>
      <Link
        href={`/robot/${robot.slug}`}
        className="decoration-primary mt-auto pt-3 text-[0.95rem] font-bold underline decoration-2 underline-offset-4 hover:decoration-[3px]"
      >
        {t('see', { robot: robot.name })}
      </Link>
    </div>
  );
}

/**
 * Which robot fits whom: a ruler of ages from 6 to 18+, with each robot standing at the age it
 * is designed to start from.
 */
export async function AgeRuler({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.ages');
  const ticks = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, index) => MIN_AGE + index);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading title={t('title')} intro={t('intro')} />

        <div className="mt-16 hidden md:block">
          <div className="relative h-[17rem]">
            {robots.map((robot) => (
              <div
                key={robot.slug}
                className="absolute bottom-0 flex h-full w-[23%] flex-col"
                style={{ left: `${position(robot.age)}%` }}
              >
                <RobotFit robot={robot} locale={locale} />
                <span className="bg-edge h-6 w-[3px] shrink-0" />
              </div>
            ))}
          </div>
          <div aria-hidden className="border-edge relative h-14 border-t-[3px]">
            {ticks.map((age) => (
              <span
                key={age}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${position(age)}%` }}
              >
                <span className={age % 2 === 0 ? 'bg-edge h-3 w-0.5' : 'bg-border h-2 w-0.5'} />
                {age % 2 === 0 ? (
                  <span className="mt-1 text-sm font-bold tabular-nums">
                    {age === MAX_AGE ? `${age}+` : age}
                  </span>
                ) : null}
              </span>
            ))}
            <span className="text-muted-foreground absolute right-0 bottom-0 text-sm">
              {t('axis')}
            </span>
          </div>
        </div>

        <ul className="mt-10 grid gap-4 md:hidden">
          {robots.map((robot) => (
            <li key={robot.slug} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3">
              <p className="type-number pt-3 text-2xl">{t('ageShort', { age: robot.age })}</p>
              <RobotFit robot={robot} locale={locale} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
