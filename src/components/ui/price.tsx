import {
  availabilityLabels,
  formatRupiah,
  type Locale,
  type Localized,
  pick,
  type Robot,
  startingPrice,
} from '@ulik/catalog';
import { cn } from '@ulik/ui/lib/utils';
import { getTranslations } from 'next-intl/server';

/** A robot's price: the unit price, "from" for packages, or "price soon". */
export async function RobotPrice({
  robot,
  locale,
  className,
}: {
  robot: Robot;
  locale: Locale;
  className?: string;
}) {
  const t = await getTranslations('Price');
  const from = startingPrice(robot);
  if (from === null) return <p className={cn('font-bold', className)}>{t('soon')}</p>;
  const amount = formatRupiah(from, locale);
  return (
    <p className={cn('font-bold tabular-nums', className)}>
      {robot.price === null ? t('from', { amount }) : amount}
      {robot.priceNote ? (
        <span className="text-muted-foreground block text-sm font-semibold">
          {pick(robot.priceNote, locale)}
        </span>
      ) : null}
    </p>
  );
}

/** A product's price, or nothing while it has none. */
export function productPrice(price: number | null, locale: Locale): string | null {
  return price === null ? null : formatRupiah(price, locale);
}

const tone = {
  available: 'bg-success/12 text-success',
  preorder: 'bg-eye-soft text-foreground',
  soon: 'bg-accent text-[#191b20]',
} as const;

export function AvailabilityBadge({
  availability,
  locale,
  className,
}: {
  availability: keyof typeof availabilityLabels;
  locale: Locale;
  className?: string;
}) {
  const label: Localized = availabilityLabels[availability];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold whitespace-nowrap',
        tone[availability],
        className,
      )}
    >
      {pick(label, locale)}
    </span>
  );
}
