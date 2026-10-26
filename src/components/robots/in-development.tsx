import type { RobotInDevelopment } from '@dctedu/catalog';
import { RaceNumber } from '@dctedu/ui/brand/race-number';
import { Button } from '@dctedu/ui/components/button';
import { Wrench } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '../ui/container';

/** The plain "in development" tag, the only thing said about a robot that is still being built. */
async function DevelopmentTag({ className = '' }: { className?: string }) {
  const t = await getTranslations('InDevelopment');
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#ffb020] px-2.5 py-1 text-xs font-bold text-[#191b20] ${className}`}
    >
      <Wrench className="size-3.5" aria-hidden />
      {t('label')}
    </span>
  );
}

/** A robot that is still being built, parked in its numbered slot on the home page grid. */
export async function DevelopmentSlot({ robot }: { robot: RobotInDevelopment }) {
  const t = await getTranslations('Home.hero');
  return (
    <li className="relative pt-8 lg:even:mt-16">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-28 rounded-t-md border-x-[3px] border-t-[3px] border-dashed border-white/40"
      />
      <RaceNumber
        value={robot.number}
        size="lg"
        label={t('number', { n: robot.number })}
        className="absolute -top-7 left-6 z-10"
      />
      <Link
        href={`/robot/${robot.slug}`}
        className="group relative mx-3 flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg border border-white/15 bg-white/[0.04] p-5 text-white transition-transform hover:-translate-y-1 motion-reduce:transition-none sm:aspect-auto sm:h-full sm:min-h-[22rem]"
      >
        <span
          aria-hidden
          className="type-number absolute top-6 right-5 text-[5.5rem] leading-none text-white/10"
        >
          #{String(robot.number).padStart(2, '0')}
        </span>
        <DevelopmentTag className="self-start" />
        <p className="type-number mt-3 text-[1.875rem] group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
          {robot.name}
        </p>
      </Link>
    </li>
  );
}

/** A robot that is still being built, in the catalogue list. */
export async function DevelopmentRow({ robot }: { robot: RobotInDevelopment }) {
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed p-6 sm:p-8">
      <RaceNumber value={robot.number} size="md" />
      <h2 className="type-number text-[2.5rem]">
        <Link
          href={`/robot/${robot.slug}`}
          className="hover:underline hover:decoration-[3px] hover:underline-offset-4"
        >
          {robot.name}
        </Link>
      </h2>
      <DevelopmentTag />
    </article>
  );
}

/** The whole page of a robot that is still being built: its number, its name, and that is all. */
export async function DevelopmentPage({ robot }: { robot: RobotInDevelopment }) {
  const t = await getTranslations('InDevelopment');
  return (
    <section className="py-24 lg:py-32">
      <Container className="flex flex-col items-start">
        <RaceNumber value={robot.number} size="xl" />
        <h1 className="type-display mt-8 text-[clamp(3rem,8vw,6rem)]">{robot.name}</h1>
        <DevelopmentTag className="mt-4" />
        <p className="text-muted-foreground mt-6 max-w-[48ch] text-lg leading-relaxed">
          {t('body', { robot: robot.name })}
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/robot">{t('back')}</Link>
        </Button>
      </Container>
    </section>
  );
}
