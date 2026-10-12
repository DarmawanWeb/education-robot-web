import { cn } from '@taksu/ui/lib/utils';
import { getTranslations } from 'next-intl/server';

const steps = ['trial', 'training', 'class', 'review'] as const;

/** The pilot runs in order, so the steps are numbered. Stacked for narrow side columns. */
export async function PilotSteps({ stacked = false }: { stacked?: boolean }) {
  const t = await getTranslations('Pilot.steps');
  return (
    <ol
      className={stacked ? 'flex flex-col' : 'grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'}
    >
      {steps.map((step, index) => (
        <li
          key={step}
          className={cn(
            'border-edge border-t-2',
            stacked ? 'grid grid-cols-[2.25rem_1fr] gap-x-3 py-4' : 'pt-5',
          )}
        >
          <span className={cn('type-label tabular-nums', stacked ? 'text-2xl' : 'text-4xl')}>
            {index + 1}
          </span>
          <div>
            <h3 className={cn('font-bold', stacked ? 'text-lg' : 'mt-3 text-xl')}>
              {t(`${step}.title`)}
            </h3>
            <p className="text-muted-foreground mt-1">{t(`${step}.body`)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
