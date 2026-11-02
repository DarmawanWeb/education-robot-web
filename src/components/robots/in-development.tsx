import type { RobotInDevelopment } from '@dctedu/catalog';
import { RaceNumber } from '@dctedu/ui/brand/race-number';
import { Button } from '@dctedu/ui/components/button';
import { Wrench } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '../ui/container';
import { lineupItemClass, UnrevealedSlot } from './lineup';

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

/** A robot that is still being built, in its place in the home page line-up. */
export async function DevelopmentSlot({
  robot,
  order,
}: {
  robot: RobotInDevelopment;
  order: number;
}) {
  const t = await getTranslations('Home.hero');
  return (
    <li className={lineupItemClass} style={{ '--slot': order } as CSSProperties}>
      <Link
        href={`/robot/${robot.slug}`}
        className="group flex flex-col rounded-xl border border-white/12 bg-white/[0.03] p-3 text-white transition-[transform,background-color] hover:-translate-y-1 hover:bg-white/[0.06] motion-reduce:transition-none"
      >
        <UnrevealedSlot>
          <RaceNumber value={robot.number} size="lg" label={t('number', { n: robot.number })} />
        </UnrevealedSlot>
        <div className="px-2 pt-3 pb-2">
          <DevelopmentTag />
          <p className="type-number mt-3 text-[1.75rem] group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
            {robot.name}
          </p>
        </div>
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
