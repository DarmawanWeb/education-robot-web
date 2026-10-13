import { type LabChallenge, type Locale, pick } from '@taksu/content';
import { Link } from '@/i18n/navigation';
import { simulatorUrl } from '@/lib/links';
import { actionClass } from '../ui/action-link';
import { KitChip } from './kit-chip';

/** A challenge: what to build, when it counts as done, and where to try or submit it. */
export function ChallengeCard({
  challenge,
  locale,
  labels,
}: {
  challenge: LabChallenge;
  locale: Locale;
  labels: { kit: string; doneWhen: string; tryInSim: string; submit: string; newTab: string };
}) {
  return (
    <article className="border-edge bg-surface flex h-full flex-col rounded-lg border-2 p-5 sm:p-6">
      <KitChip kit={challenge.kit} label={labels.kit} />
      <h3 className="mt-3 text-xl leading-snug font-bold">{pick(challenge.title, locale)}</h3>
      <p className="text-muted-foreground mt-2">{pick(challenge.brief, locale)}</p>
      <p className="mt-4 text-sm font-bold">{labels.doneWhen}</p>
      <ul className="mt-2 flex flex-col gap-1.5 text-[0.95rem]">
        {challenge.doneWhen.map((item) => (
          <li key={item.en} className="flex gap-2.5">
            <span
              aria-hidden
              className="mt-[0.45em] size-2 shrink-0 rounded-[2px] bg-black dark:bg-white"
            />
            {pick(item, locale)}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <Link
          href={{ pathname: '/lab/submit', query: { challenge: challenge.id } }}
          className={actionClass('signal', 'min-h-11 px-4 text-[0.95rem]')}
        >
          {labels.submit}
        </Link>
        {challenge.mission ? (
          <a
            href={simulatorUrl(locale, challenge.kit, challenge.mission)}
            target="_blank"
            rel="noopener"
            className={actionClass('plain', 'min-h-11 px-4 text-[0.95rem]')}
          >
            {labels.tryInSim}
            <span className="sr-only"> {labels.newTab}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
