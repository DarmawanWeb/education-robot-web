import { type Locale, pick, rubric } from '@taksu/content';
import { getTranslations } from 'next-intl/server';

/** Assessment criteria and the four-step scale they are scored on. */
export async function Rubric({ locale }: { locale: Locale }) {
  const t = await getTranslations('Curriculum');
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('rubricTitle')}</h2>
        <p className="text-muted-foreground mt-4 max-w-[52ch] text-lg leading-relaxed">
          {t('rubricIntro')}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-bold">{t('criteria')}</h3>
        <ol className="border-edge mt-3 border-t-2">
          {rubric.criteria.map((criterion, index) => (
            <li
              key={criterion.en}
              className="border-border flex items-baseline gap-4 border-b py-3 text-lg"
            >
              <span className="text-muted-foreground w-5 text-right text-base tabular-nums">
                {index + 1}
              </span>
              {pick(criterion, locale)}
            </li>
          ))}
        </ol>
        <h3 className="mt-8 text-lg font-bold">{t('scale')}</h3>
        <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {rubric.levels.map((level, index) => (
            <li
              key={level.en}
              className="border-edge rounded-md border-2 px-3 py-2.5 font-semibold"
              style={{
                background: `color-mix(in srgb, var(--level-smp) ${20 + index * 25}%, var(--surface))`,
              }}
            >
              <span className="block text-sm font-normal opacity-80">{index + 1}</span>
              {pick(level, locale)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
