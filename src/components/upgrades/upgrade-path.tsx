import { type Locale, pick, upgradePath } from '@taksu/content';

/** How a school's robots grow over the years, as stops along one strip of track. */
export function UpgradePath({ locale }: { locale: Locale }) {
  return (
    <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
      <span
        aria-hidden
        className="bg-track absolute top-0 bottom-0 left-[0.9rem] w-2 rounded-full sm:hidden lg:top-[0.9rem] lg:right-3 lg:bottom-auto lg:left-3 lg:block lg:h-2 lg:w-auto dark:bg-white"
      />
      {upgradePath.map((step, index) => (
        <li key={step.id} className="relative pl-12 sm:pl-0 lg:pt-12">
          <span
            aria-hidden
            className="border-edge bg-surface absolute top-0 left-0 size-[2.1rem] rounded-full border-[3px] sm:relative sm:mb-3 sm:block lg:absolute lg:mb-0"
          >
            {index === upgradePath.length - 1 ? (
              <span className="bg-primary absolute inset-1 rounded-full" />
            ) : null}
          </span>
          <h3 className="text-lg leading-snug font-bold">{pick(step.title, locale)}</h3>
          <p className="text-muted-foreground mt-1 text-[0.95rem]">{pick(step.body, locale)}</p>
        </li>
      ))}
    </ol>
  );
}
