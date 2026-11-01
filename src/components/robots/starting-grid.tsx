import {
  brand,
  drops,
  type Locale,
  learnPaths,
  pick,
  type Robot,
  robots,
  robotsInDevelopment,
  simMissions,
} from '@dctedu/catalog';
import { RaceNumber } from '@dctedu/ui/brand/race-number';
import { Button } from '@dctedu/ui/components/button';
import { cn } from '@dctedu/ui/lib/utils';
import { BookOpenCheck, Code2, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { imageFit, robotImages } from '@/lib/images';
import { simulatorUrl } from '@/lib/links';
import { Container } from '../ui/container';
import { AvailabilityBadge, RobotPrice } from '../ui/price';
import { DevelopmentSlot } from './in-development';
import { RobotChips } from './robot-chips';

/** The painted box of a grid slot: a top line and two short sides, like on a race track. */
function SlotMarking({ tone = 'white' }: { tone?: 'white' | 'signal' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute inset-x-0 top-0 h-28 rounded-t-md border-x-[3px] border-t-[3px]',
        tone === 'white' ? 'border-white/65' : 'border-dashed border-[#ffb020]',
      )}
    />
  );
}

async function RobotSlot({
  robot,
  locale,
  order,
}: {
  robot: Robot;
  locale: Locale;
  order: number;
}) {
  const t = await getTranslations('Home.hero');
  const image = robotImages[robot.slug];
  return (
    <li className="relative lg:even:mt-16">
      <SlotMarking />
      {/* The robot drives into its painted slot: the one moment of motion on the page. */}
      <div className="park relative pt-8" style={{ '--slot': order } as CSSProperties}>
        <RaceNumber
          value={robot.number}
          size="lg"
          label={t('number', { n: robot.number })}
          className="absolute -top-7 left-6 z-10"
        />
        <Link
          href={`/robot/${robot.slug}`}
          className="group relative mx-3 block overflow-hidden rounded-lg bg-white text-[#191b20] transition-transform hover:-translate-y-1 motion-reduce:transition-none"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={image.src}
              alt={pick(image.alt, locale)}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 16rem, (min-width: 640px) 45vw, 90vw"
              className={imageFit(image, 'p-3')}
            />
            {robot.availability === 'soon' ? (
              <AvailabilityBadge
                availability="soon"
                locale={locale}
                className="absolute top-3 right-3"
              />
            ) : null}
          </div>
          <div className="border-t border-[#dadde3] px-4 pt-3 pb-4">
            <p className="type-number text-[1.875rem] group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
              {robot.name}
            </p>
            <RobotChips robot={robot} locale={locale} className="mt-2" />
            <RobotPrice robot={robot} locale={locale} className="mt-3" />
          </div>
        </Link>
      </div>
    </li>
  );
}

async function DropSlot({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.hero');
  const drop = drops.find((entry) => entry.status === 'soon');
  if (!drop) return null;
  return (
    <li className="relative pt-8 lg:even:mt-16">
      <SlotMarking tone="signal" />
      <RaceNumber value={null} size="lg" className="absolute -top-7 left-6 z-10" />
      <Link
        href="/drop"
        className="group relative mx-3 flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg border border-white/15 bg-white/[0.04] p-5 text-white transition-transform hover:-translate-y-1 motion-reduce:transition-none sm:aspect-auto sm:h-full sm:min-h-[22rem]"
      >
        <span
          aria-hidden
          className="type-number absolute top-6 right-5 text-[5.5rem] leading-none text-white/10"
        >
          #{String(drop.number).padStart(2, '0')}
        </span>
        <AvailabilityBadge availability="soon" locale={locale} className="self-start" />
        <p className="type-number mt-3 text-[1.875rem]">
          {t('dropName', { n: String(drop.number).padStart(2, '0') })}
        </p>
        <p className="mt-2 text-white/75">{t('dropBody')}</p>
        <p className="mt-4 font-bold text-[#ffb020] group-hover:underline group-hover:underline-offset-4">
          {t('dropLink')}
        </p>
      </Link>
    </li>
  );
}

/**
 * The home page opens on a starting grid: every robot parked in a painted slot with its race
 * number, the ones still being built in dashed slots, and an empty slot waiting for the next Drop.
 */
export async function StartingGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.hero');
  const steps = learnPaths.reduce((sum, path) => sum + path.steps.length, 0);
  return (
    <section className="asphalt relative overflow-hidden">
      <Container className="relative pt-14 pb-20 sm:pt-20 lg:pb-28">
        <div>
          <h1 className="type-display max-w-[16ch] text-[clamp(2.75rem,7.4vw,6rem)] text-white">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-white/80 sm:text-xl">
            {t('body', { company: brand.company })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/robot">{t('pick')}</Link>
            </Button>
            <Button asChild size="lg" variant="lightOutline">
              <a href={simulatorUrl(locale)}>{t('simulator')}</a>
            </Button>
          </div>
          <ul
            aria-label={t('statsLabel')}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.95rem] font-bold text-white/85"
          >
            <li className="flex items-center gap-2">
              <BookOpenCheck className="size-5 text-[#ffb020]" aria-hidden />
              {t('steps', { count: steps })}
            </li>
            <li className="flex items-center gap-2">
              <Gamepad2 className="size-5 text-[#ffb020]" aria-hidden />
              {t('missions', { count: simMissions.length })}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="size-5 text-[#ffb020]" aria-hidden />
              {t('code')}
            </li>
          </ul>
        </div>
        <ol
          aria-label={t('gridLabel')}
          className="mt-20 grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {robots.map((robot, index) => (
            <RobotSlot key={robot.slug} robot={robot} locale={locale} order={index} />
          ))}
          {robotsInDevelopment.map((robot) => (
            <DevelopmentSlot key={robot.slug} robot={robot} />
          ))}
          <DropSlot locale={locale} />
        </ol>
      </Container>
    </section>
  );
}
