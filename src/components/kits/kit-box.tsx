import { type EducationLevel, type Locale, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { kitHero } from '@/lib/kit-media';
import { LevelChip, levelTone } from '../ui/level-chip';
import { StatusTag } from '../ui/status-tag';

/** A kit drawn as its box: level-coloured lid, product shot, and the label facts. */
export async function KitBox({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const [t, common, kitT] = await Promise.all([
    getTranslations('Kits.rows'),
    getTranslations('Common'),
    getTranslations('Kit'),
  ]);
  const image = kitHero[level.slug];
  return (
    <article className="box-ink bg-surface flex h-full flex-col overflow-hidden rounded-lg">
      <div className={cn('h-3 border-b-2 border-black', levelTone[level.slug])} />
      <Link
        href={`/kits/${level.slug}`}
        className="block bg-white focus-visible:outline-offset-[-4px]"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={image.src}
          alt=""
          placeholder="blur"
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className={cn(
            'aspect-[4/3] h-auto w-full',
            image.fit === 'contain' ? 'object-contain p-1.5' : 'object-cover',
          )}
        />
      </Link>
      <div className="border-border flex flex-1 flex-col border-t-2 p-6">
        <h3 className="type-label text-[2.6rem] whitespace-nowrap">
          <Link href={`/kits/${level.slug}`} className="hover:decoration-primary hover:underline">
            {level.kit}
          </Link>
        </h3>
        <p className="mt-3 flex flex-wrap items-center gap-2">
          <LevelChip level={level.slug}>{kitT('for', { level: level.short })}</LevelChip>
          <StatusTag status={level.status} />
        </p>
        <p className="text-muted-foreground mt-2 text-sm font-semibold">
          {pick(level.grades, locale)}, {pick(level.ageRange, locale).toLowerCase()}
        </p>
        <p className="mt-4 font-bold">{pick(level.tagline, locale)}</p>
        <p className="text-muted-foreground mt-2 flex-1">{pick(level.summary, locale)}</p>
        <dl className="border-border mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t pt-4 text-[0.95rem]">
          <dt className="text-muted-foreground">{t('build')}</dt>
          <dd className="font-semibold">{pick(level.build.label, locale)}</dd>
          <dt className="text-muted-foreground">{t('controller')}</dt>
          <dd className="font-semibold">{level.controller}</dd>
          <dt className="text-muted-foreground">{t('curriculum')}</dt>
          <dd className="font-semibold">{common('meetings', { count: level.meetings })}</dd>
        </dl>
        <Link
          href={`/kits/${level.slug}`}
          className="decoration-primary mt-6 self-start text-lg font-bold underline decoration-[3px] underline-offset-[6px] hover:decoration-[5px]"
        >
          {common('viewKit', { kit: level.kit })}
        </Link>
      </div>
    </article>
  );
}
