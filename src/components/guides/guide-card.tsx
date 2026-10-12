import { educationLevels, type Guide, type Locale, pick } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { LevelChip } from '../ui/level-chip';

const kitName = (slug: string) => educationLevels.find((level) => level.slug === slug)?.kit ?? slug;

/** A guide as a printed sheet: audience, title, summary, and the kits it covers. */
export async function GuideCard({ guide, locale }: { guide: Guide; locale: Locale }) {
  const [t, common] = await Promise.all([getTranslations('Guides'), getTranslations('Common')]);
  return (
    <article className="border-edge bg-surface relative flex h-full flex-col rounded-lg border-2 p-6 transition-shadow focus-within:shadow-[4px_4px_0_0_var(--edge)] hover:shadow-[4px_4px_0_0_var(--edge)]">
      <p className="text-muted-foreground text-[0.95rem] font-semibold">
        {t(`audience.${guide.audience}`)}, {common('minutes', { count: guide.minutes })}
      </p>
      <h3 className="mt-3 text-xl leading-snug font-bold">
        <Link
          href={`/guides/${guide.slug}`}
          className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
        >
          {pick(guide.title, locale)}
        </Link>
      </h3>
      <p className="text-muted-foreground mt-2 flex-1">{pick(guide.summary, locale)}</p>
      <p className="mt-5 flex flex-wrap gap-2">
        {guide.levels.map((level) => (
          <LevelChip key={level} level={level}>
            {kitName(level)}
          </LevelChip>
        ))}
      </p>
    </article>
  );
}
