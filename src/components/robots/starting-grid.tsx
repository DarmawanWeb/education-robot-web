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
import { lineupItemClass, UnrevealedSlot } from './lineup';
import { RobotChips } from './robot-chips';

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
    // The robots roll in one after another: the one moment of motion on the page. The card is
    // white in both themes, so it keeps the light theme's text colours inside.
    <li className={lineupItemClass} style={{ '--slot': order } as CSSProperties}>
      <Link
        href={`/robot/${robot.slug}`}
        className="group flex flex-col overflow-hidden rounded-xl bg-white text-[#191b20] ring-1 ring-band-fg/10 [--border:#dadde3] [--foreground:#191b20] [--muted-foreground:#5a606c] [--surface-muted:#eceef2] transition-transform hover:-translate-y-1 motion-reduce:transition-none"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={image.src}
            alt={pick(image.alt, locale)}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 16rem, (min-width: 640px) 45vw, 78vw"
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
        <div className="flex flex-1 flex-col border-t border-[#e6e8ec] px-4 pt-3 pb-4">
          <div className="flex items-center justify-between gap-3">
            <p className="type-number text-[1.75rem] group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
              {robot.name}
            </p>
            <RaceNumber value={robot.number} size="sm" label={t('number', { n: robot.number })} />
          </div>
          <RobotChips robot={robot} locale={locale} className="mt-2" />
          <RobotPrice robot={robot} locale={locale} className="mt-auto pt-3" />
        </div>
      </Link>
    </li>
  );
}

async function DropSlot({ locale, order }: { locale: Locale; order: number }) {
  const t = await getTranslations('Home.hero');
  const drop = drops.find((entry) => entry.status === 'soon');
  if (!drop) return null;
  return (
    <li className={lineupItemClass} style={{ '--slot': order } as CSSProperties}>
      <Link
        href="/drop"
        className="group flex flex-col rounded-xl border border-band-fg/12 bg-band-fg/[0.03] p-3 text-band-fg transition-[transform,background-color] hover:-translate-y-1 hover:bg-band-fg/[0.06] motion-reduce:transition-none"
      >
        <UnrevealedSlot tone="signal">
          <RaceNumber value={null} size="lg" />
        </UnrevealedSlot>
        <div className="px-2 pt-3 pb-2">
          <AvailabilityBadge availability="soon" locale={locale} />
          <p className="type-number mt-3 text-[1.75rem]">
            {t('dropName', { n: String(drop.number).padStart(2, '0') })}
          </p>
          <p className="mt-1.5 text-band-fg/70">{t('dropBody')}</p>
          <p className="mt-4 font-bold text-band-accent group-hover:underline group-hover:underline-offset-4">
            {t('dropLink')}
          </p>
        </div>
      </Link>
    </li>
  );
}

/**
 * The home page opens on the line-up: every robot with its race number, the ones still being
 * built, and the next Drop, in release order.
 */
export async function StartingGrid({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.hero');
  const steps = learnPaths.reduce((sum, path) => sum + path.steps.length, 0);
  return (
    <section className="track relative overflow-hidden">
      <Container className="relative pt-14 pb-20 sm:pt-20 lg:pb-28">
        <div>
          <h1 className="type-display max-w-[16ch] text-[clamp(2.75rem,7.4vw,6rem)] text-band-fg">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-band-fg/80 sm:text-xl">
            {t('body', { company: brand.company })}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/robot">{t('pick')}</Link>
            </Button>
            <Button asChild size="lg" variant="trackOutline">
              <a href={simulatorUrl(locale)}>{t('simulator')}</a>
            </Button>
          </div>
          <ul
            aria-label={t('statsLabel')}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[0.95rem] font-bold text-band-fg/85"
          >
            <li className="flex items-center gap-2">
              <BookOpenCheck className="size-5 text-band-accent" aria-hidden />
              {t('steps', { count: steps })}
            </li>
            <li className="flex items-center gap-2">
              <Gamepad2 className="size-5 text-band-accent" aria-hidden />
              {t('missions', { count: simMissions.length })}
            </li>
            <li className="flex items-center gap-2">
              <Code2 className="size-5 text-band-accent" aria-hidden />
              {t('code')}
            </li>
          </ul>
        </div>
        <ol
          aria-label={t('gridLabel')}
          className="-mx-4 mt-14 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-16 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          {robots.map((robot, index) => (
            <RobotSlot key={robot.slug} robot={robot} locale={locale} order={index} />
          ))}
          {robotsInDevelopment.map((robot, index) => (
            <DevelopmentSlot key={robot.slug} robot={robot} order={robots.length + index} />
          ))}
          <DropSlot locale={locale} order={robots.length + robotsInDevelopment.length} />
        </ol>
      </Container>
    </section>
  );
}
