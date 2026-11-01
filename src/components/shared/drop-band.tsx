import { type Drop, dropSteps, drops, type Locale, pick } from '@dctedu/catalog';
import { RaceNumber } from '@dctedu/ui/brand/race-number';
import { Button } from '@dctedu/ui/components/button';
import { cn } from '@dctedu/ui/lib/utils';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { contactHref } from '@/lib/contact';
import { AvailabilityBadge } from '../ui/price';

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

/** One line pointing at the Drop page, for pages where the robots are the subject. */
export async function DropTeaser({ className }: { className?: string }) {
  const [t, catalog] = await Promise.all([getTranslations('Drop'), getTranslations('Catalog')]);
  const drop = nextDrop();
  if (!drop) return null;
  return (
    <Link
      href="/drop"
      className={cn(
        'group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border-2 border-dashed border-[#ffb020] bg-[#fff8ea] px-5 py-4',
        className,
      )}
    >
      <span className="type-number grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-[#191b20] text-lg">
        ??
      </span>
      <span className="font-bold">{catalog('drop', { n: padNumber(drop.number) })}</span>
      <span className="ml-auto inline-flex items-center gap-1.5 font-bold underline decoration-[#ffb020] decoration-2 underline-offset-4 group-hover:decoration-[3px]">
        {t('more')}
        <ArrowRight className="size-4" aria-hidden />
      </span>
    </Link>
  );
}
