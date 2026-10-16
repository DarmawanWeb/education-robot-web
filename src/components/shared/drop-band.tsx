import { type Drop, dropSteps, drops, type Locale, pick } from '@taksu/catalog';
import { RaceNumber } from '@taksu/ui/brand/race-number';
import { Button } from '@taksu/ui/components/button';
import { cn } from '@taksu/ui/lib/utils';
import { getTranslations } from 'next-intl/server';
import { contactHref } from '@/lib/contact';
import { Container } from '../ui/container';
import { AvailabilityBadge } from '../ui/price';
import { SectionHeading } from '../ui/section-heading';
import { TextLink } from '../ui/text-link';

/** The Drop still to be revealed, if there is one. */
export function nextDrop(): Drop | undefined {
  return drops.find((entry) => entry.status === 'soon');
}

export const padNumber = (n: number) => String(n).padStart(2, '0');

/** How a Drop works, in the order a buyer meets it, on asphalt. */
export function DropSteps({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <ol className={cn('grid gap-6', className)}>
      {dropSteps.map((step, index) => (
        <li key={step.id} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4">
          <span className="type-number grid size-11 place-items-center rounded-full border-2 border-[#ffb020] text-lg text-[#ffb020]">
            {index + 1}
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">{pick(step.title, locale)}</h3>
            <p className="mt-1 leading-relaxed text-white/70">{pick(step.body, locale)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The next number waiting to be revealed: a dashed slot with a question mark. */
export async function NextDropCard({
  drop,
  locale,
  className,
}: {
  drop: Drop;
  locale: Locale;
  className?: string;
}) {
  const t = await getTranslations('Drop');
  const name = t('name', { n: padNumber(drop.number) });
  return (
    <div
      className={cn(
        'relative rounded-xl border-2 border-dashed border-[#ffb020] p-6 text-white sm:p-8',
        className,
      )}
    >
      <span
        aria-hidden
        className="type-number pointer-events-none absolute top-4 right-6 hidden text-[7rem] leading-none text-white/[0.07] sm:block"
      >
        #{padNumber(drop.number)}
      </span>
      <RaceNumber value={null} size="xl" />
      <p className="type-number mt-6 text-[2.5rem]">{name}</p>
      <AvailabilityBadge availability="soon" locale={locale} className="mt-3" />
      <p className="mt-4 max-w-[40ch] leading-relaxed text-white/75">{pick(drop.teaser, locale)}</p>
      <Button asChild size="lg" variant="light" className="mt-8">
        <a href={contactHref(t('notifyMessage', { name }), t('notifySubject', { name }))}>
          {t('notify')}
        </a>
      </Button>
    </div>
  );
}

/** The Drop programme on asphalt: how it works, and the next number waiting to be revealed. */
export async function DropBand({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = await getTranslations('Drop');
  const drop = nextDrop();
  if (!drop) return null;
  return (
    <section className="asphalt py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHeading title={t('title')} intro={t('intro')} tone="onDark" />
          <DropSteps locale={locale} className="mt-10" />
          {compact ? (
            <TextLink href="/drop" tone="onDark" className="mt-10">
              {t('more')}
            </TextLink>
          ) : null}
        </div>
        <NextDropCard drop={drop} locale={locale} />
      </Container>
    </section>
  );
}
