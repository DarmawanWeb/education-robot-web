import { getTranslations } from 'next-intl/server';

const steps = ['simulate', 'build', 'program', 'test'] as const;

/** The four steps of every meeting, strung along a strip of track tape. */
export async function LearningTrack() {
  const t = await getTranslations('Home.path.steps');
  return (
    <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
      <span
        aria-hidden
        className="bg-track absolute top-0 bottom-0 left-[1.15rem] w-2.5 rounded-full md:top-[1.15rem] md:right-4 md:bottom-auto md:left-4 md:h-2.5 md:w-auto dark:bg-white"
      />
      {steps.map((step, index) => (
        <li key={step} className="relative pl-14 md:pt-16 md:pl-0">
          <span className="border-edge bg-accent absolute top-0 left-0 flex size-[2.8rem] items-center justify-center rounded-full border-2 text-lg font-extrabold text-black md:top-0">
            {index + 1}
          </span>
          <h3 className="type-label text-2xl">{t(`${step}.title`)}</h3>
          <p className="text-muted-foreground mt-2">{t(`${step}.body`)}</p>
        </li>
      ))}
    </ol>
  );
}
