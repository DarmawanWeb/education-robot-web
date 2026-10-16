import { type Guide, getRobot, type Locale, pick } from '@taksu/catalog';
import { cn } from '@taksu/edu-ui/lib/utils';
import { Clock } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { robotStyle } from '@/lib/robot-style';

/** Guides as a list of rows: title, what it covers, how long it takes, and which robots. */
export async function GuideList({
  guides,
  locale,
  className,
}: {
  guides: readonly Guide[];
  locale: Locale;
  className?: string;
}) {
  const t = await getTranslations('Guide');
  return (
    <ul className={cn('bg-surface divide-y rounded-xl border', className)}>
      {guides.map((guide) => (
        <li key={guide.slug}>
          <Link
            href={`/belajar/panduan/${guide.slug}`}
            className="group hover:bg-surface-muted/60 grid gap-2 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-6"
          >
            <span className="min-w-0">
              <span className="block text-lg font-bold group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {pick(guide.title, locale)}
              </span>
              <span className="text-muted-foreground mt-0.5 block leading-snug">
                {pick(guide.summary, locale)}
              </span>
            </span>
            <span className="flex flex-wrap items-center gap-1.5 sm:justify-end">
              {guide.robots.map((slug) => {
                const robot = getRobot(slug);
                return robot ? (
                  <span
                    key={slug}
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[0.8125rem] font-bold',
                      robotStyle[slug].fill,
                      robotStyle[slug].text,
                    )}
                  >
                    {robot.name}
                  </span>
                ) : null;
              })}
              <span className="text-muted-foreground inline-flex items-center gap-1 pl-1 text-sm font-semibold whitespace-nowrap">
                <Clock className="size-3.5" aria-hidden />
                {t('minutes', { minutes: guide.minutes })}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
