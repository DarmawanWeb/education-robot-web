import { type EducationLevel, type Locale, pick } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { Container } from '../ui/container';

/** What is in the box and what students take away from it. */
export async function KitContents({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const t = await getTranslations('Kit');
  return (
    <section className="pb-16 lg:pb-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('inBox')}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {level.components.map((group) => (
              <div key={group.group.en}>
                <h3 className="text-lg font-bold">{pick(group.group, locale)}</h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li key={item.en} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.6em] size-2 shrink-0 rounded-[2px] bg-current"
                      />
                      <span>{pick(item, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface-muted rounded-lg p-6 sm:p-8">
          <h2 className="type-label text-3xl">{t('learns')}</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {level.highlights.map((item) => (
              <li key={item.en} className="border-edge border-l-4 pl-4 text-lg font-semibold">
                {pick(item, locale)}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
