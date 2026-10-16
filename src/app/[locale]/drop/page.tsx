import { drops, nextReleaseNumber, pick, robots } from '@taksu/catalog';
import { RaceNumber } from '@taksu/edu-ui/brand/race-number';
import { cn } from '@taksu/edu-ui/lib/utils';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DropSteps, NextDropCard, nextDrop, padNumber } from '@/components/shared/drop-band';
import { Container } from '@/components/ui/container';
import { AvailabilityBadge } from '@/components/ui/price';
import { SectionHeading } from '@/components/ui/section-heading';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { robotStyle } from '@/lib/robot-style';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'DropPage' });
  return pageMetadata({ locale, path: '/drop', title: t('title'), description: t('intro') });
}

export default async function DropPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('DropPage');
  const drop = nextDrop();
  const series = [...robots].sort((a, b) => a.number - b.number);
  const open = padNumber(nextReleaseNumber());

  return (
    <>
      <section className="asphalt py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <h1 className="type-display text-[clamp(2.5rem,6vw,4.5rem)] text-white">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-white/75">{t('intro')}</p>
            <h2 className="mt-12 text-xl font-bold text-white">{t('how')}</h2>
            <DropSteps locale={locale} className="mt-6" />
          </div>
          {drop ? <NextDropCard drop={drop} locale={locale} /> : null}
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading title={t('series.title')} intro={t('series.intro')} />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {series.map((robot) => (
              <li key={robot.slug}>
                <Link
                  href={`/robot/${robot.slug}`}
                  className="group bg-surface hover:border-edge relative flex h-full flex-col overflow-hidden rounded-lg border p-5 pb-7 transition-colors"
                >
                  <RaceNumber
                    value={robot.number}
                    size="lg"
                    label={t('series.number', { n: padNumber(robot.number) })}
                  />
                  <span className="type-number mt-4 text-[1.75rem] group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
                    {robot.name}
                  </span>
                  <span className="text-muted-foreground mt-1 text-sm leading-snug">
                    {pick(robot.tagline, locale)}
                  </span>
                  <span
                    aria-hidden
                    className={cn('absolute inset-x-0 bottom-0 h-1.5', robotStyle[robot.slug].fill)}
                  />
                </Link>
              </li>
            ))}
            {drops.map((entry) => (
              <li key={entry.slug}>
                <div className="flex h-full flex-col rounded-lg border-2 border-dashed border-[#ffb020] bg-[#fff8ea] p-5">
                  <RaceNumber
                    value={entry.name ? entry.number : null}
                    size="lg"
                    label={
                      entry.name
                        ? t('series.number', { n: padNumber(entry.number) })
                        : t('series.mystery', { n: padNumber(entry.number) })
                    }
                  />
                  <span className="type-number mt-4 text-[1.75rem]">
                    {entry.name ?? `Drop #${padNumber(entry.number)}`}
                  </span>
                  {entry.status === 'soon' ? (
                    <AvailabilityBadge
                      availability="soon"
                      locale={locale}
                      className="mt-2 self-start"
                    />
                  ) : null}
                </div>
              </li>
            ))}
            <li>
              <div className="text-muted-foreground flex h-full flex-col rounded-lg border-2 border-dashed p-5">
                <span
                  aria-hidden
                  className="type-number grid size-16 place-items-center rounded-full border-4 border-dashed pr-[0.08em] text-2xl"
                >
                  {open}
                </span>
                <span className="mt-4 text-sm leading-snug font-semibold">
                  {t('series.open', { n: open })}
                </span>
              </div>
            </li>
          </ol>
        </Container>
      </section>
    </>
  );
}
