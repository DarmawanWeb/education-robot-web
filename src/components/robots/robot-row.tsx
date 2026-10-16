import { type Locale, pick, type Robot } from '@taksu/catalog';
import { RaceNumber } from '@taksu/ui/brand/race-number';
import { Button } from '@taksu/ui/components/button';
import { cn } from '@taksu/ui/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { contactHref } from '@/lib/contact';
import { imageFit, robotImages } from '@/lib/images';
import { robotStyle } from '@/lib/robot-style';
import { AddToCart } from '../cart/add-to-cart';
import { AvailabilityBadge, RobotPrice } from '../ui/price';
import { RobotChips } from './robot-chips';

/** One robot in the catalogue: picture, what it does, price, and how to get it. */
export async function RobotRow({ robot, locale }: { robot: Robot; locale: Locale }) {
  const t = await getTranslations('Catalog');
  const image = robotImages[robot.slug];
  const style = robotStyle[robot.slug];
  return (
    <article className="bg-surface grid overflow-hidden rounded-xl border md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Link href={`/robot/${robot.slug}`} className="relative block bg-white" tabIndex={-1}>
        <div className="relative aspect-[4/3] h-full">
          <Image
            src={image.src}
            alt={pick(image.alt, locale)}
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 30rem, 100vw"
            className={imageFit(image, 'p-6')}
          />
        </div>
        <RaceNumber value={robot.number} size="md" className="absolute top-4 left-4" />
        <span aria-hidden className={cn('absolute inset-x-0 bottom-0 h-2', style.fill)} />
      </Link>
      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="type-number text-[2.5rem]">
            <Link
              href={`/robot/${robot.slug}`}
              className="hover:underline hover:decoration-[3px] hover:underline-offset-4"
            >
              {robot.name}
            </Link>
          </h2>
          <AvailabilityBadge availability={robot.availability} locale={locale} />
        </div>
        <p className="mt-2 text-lg leading-snug font-bold">{pick(robot.tagline, locale)}</p>
        <RobotChips robot={robot} locale={locale} className="mt-3" />
        <ul className="mt-5 grid gap-2">
          {robot.abilities.slice(0, 3).map((ability) => (
            <li key={ability.en} className="text-muted-foreground flex gap-2.5">
              <Check className="text-success mt-1 size-4 shrink-0" aria-hidden />
              {pick(ability, locale)}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
          <RobotPrice robot={robot} locale={locale} className="text-xl" />
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="lg">
              <Link href={`/robot/${robot.slug}`}>{t('see', { robot: robot.name })}</Link>
            </Button>
            {robot.availability === 'soon' ? (
              <Button asChild variant="ink" size="lg">
                <a
                  href={contactHref(
                    t('notifyMessage', { robot: robot.name }),
                    t('notifySubject', { robot: robot.name }),
                  )}
                >
                  {t('notify')}
                </a>
              </Button>
            ) : robot.price !== null ? (
              <AddToCart slug={robot.slug} />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
