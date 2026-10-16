import { type Locale, levelLabels, pick, type Robot } from '@taksu/catalog';
import { cn } from '@taksu/ui/lib/utils';
import { getTranslations } from 'next-intl/server';

/** Age and level, the two things a buyer checks first. */
export async function RobotChips({
  robot,
  locale,
  className,
  tone = 'default',
}: {
  robot: Robot;
  locale: Locale;
  className?: string;
  tone?: 'default' | 'onColor';
}) {
  const t = await getTranslations('Robot');
  const chip = cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold whitespace-nowrap',
    tone === 'onColor' ? 'bg-white/90 text-[#191b20]' : 'bg-surface-muted text-foreground',
  );
  return (
    <span className={cn('flex flex-wrap gap-1.5', className)}>
      <span className={chip}>{t('age', { age: robot.age })}</span>
      <span className={chip}>{pick(levelLabels[robot.level], locale)}</span>
    </span>
  );
}
