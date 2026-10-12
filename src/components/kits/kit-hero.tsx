import { type EducationLevel, type Locale, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { kitHero } from '@/lib/kit-media';
import { simulatorUrl } from '@/lib/links';
import { ActionLink, ExternalAction } from '../ui/action-link';
import { Container } from '../ui/container';
import { LevelChip, levelTone } from '../ui/level-chip';
import { Note } from '../ui/note';
import { StatusTag } from '../ui/status-tag';

export async function KitHero({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const [t, nav, common] = await Promise.all([
    getTranslations('Kit'),
    getTranslations('Nav'),
    getTranslations('Common'),
  ]);
  const image = kitHero[level.slug];

  return (
    <section className="pt-8 pb-16 sm:pt-10 lg:pb-20">
      <Container>
        <nav aria-label={t('breadcrumb')}>
          <ol className="text-muted-foreground flex flex-wrap gap-2 text-[0.95rem] font-semibold">
            <li>
              <Link
                href="/kits"
                className="hover:text-foreground underline-offset-4 hover:underline"
              >
                {nav('kits')}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {level.kit}
            </li>
          </ol>
        </nav>
        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="type-label text-[clamp(3.6rem,10vw,7.4rem)] whitespace-nowrap">
              {level.kit}
            </h1>
            <p className="mt-6 flex flex-wrap items-center gap-2">
              <LevelChip level={level.slug}>{t('for', { level: level.short })}</LevelChip>
              <StatusTag status={level.status} />
            </p>
            <p className="text-muted-foreground mt-2 font-semibold">
              {pick(level.grades, locale)}, {pick(level.ageRange, locale).toLowerCase()}
            </p>
            <p className="mt-6 text-2xl leading-snug font-bold text-balance">
              {pick(level.tagline, locale)}
            </p>
            <p className="text-muted-foreground mt-3 max-w-[56ch] text-lg leading-relaxed">
              {pick(level.summary, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink href="/contact">{common('requestProposal')}</ActionLink>
              {level.simTrack ? (
                <ExternalAction
                  href={simulatorUrl(locale, level.simTrack)}
                  variant="plain"
                  newTabLabel={common('newTab')}
                >
                  {t('trySim', { kit: level.kit })}
                </ExternalAction>
              ) : null}
            </div>
            {level.status === 'development' ? (
              <Note className="mt-8">{t('developmentNote', { kit: level.kit })}</Note>
            ) : null}
          </div>
          <figure className="box-ink overflow-hidden rounded-lg bg-white">
            <div className={cn('h-3 border-b-2 border-black', levelTone[level.slug])} />
            <Image
              src={image.src}
              alt={pick(image.alt, locale)}
              placeholder="blur"
              priority
              sizes="(min-width: 1024px) 36rem, 100vw"
              className={cn(
                'aspect-[6/5] h-auto w-full',
                image.fit === 'contain' ? 'object-contain p-4' : 'object-cover',
              )}
            />
          </figure>
        </div>
      </Container>
    </section>
  );
}
