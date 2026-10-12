import { getTranslations } from 'next-intl/server';

const steps = ['trial', 'training', 'class', 'review'] as const;

/** The pilot runs in order, so the steps are numbered. */
export async function PilotSteps() {
  const t = await getTranslations('Pilot.steps');
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step} className="border-edge border-t-2 pt-5">
          <span className="type-label text-4xl tabular-nums">{index + 1}</span>
          <h3 className="mt-3 text-xl font-bold">{t(`${step}.title`)}</h3>
          <p className="text-muted-foreground mt-2">{t(`${step}.body`)}</p>
        </li>
      ))}
    </ol>
  );
}
