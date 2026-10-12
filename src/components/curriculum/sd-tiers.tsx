import { type Locale, pick, sdTiers } from '@taksu/content';
import { getTranslations } from 'next-intl/server';

/** Three ways to run the same SD v1 activity, each one step harder. */
export async function SdTiers({ locale }: { locale: Locale }) {
  const t = await getTranslations('Curriculum');
  return (
    <div>
      <h2 className="type-label text-3xl">{t('tiersTitle')}</h2>
      <p className="text-muted-foreground mt-2">{t('tiersIntro')}</p>
      <ol className="mt-6 flex flex-col gap-5">
        {sdTiers.map((tier, index) => (
          <li key={tier.id}>
            <span className="flex gap-1" aria-hidden>
              {sdTiers.map((other, step) => (
                <span
                  key={other.id}
                  className={`h-2 w-7 rounded-sm border border-black ${step <= index ? 'bg-level-sd' : 'bg-surface'}`}
                />
              ))}
            </span>
            <h3 className="mt-2 text-lg font-bold">{pick(tier.title, locale)}</h3>
            <p>{pick(tier.approach, locale)}</p>
            <p className="text-muted-foreground mt-1">
              <span className="text-foreground font-semibold">{t('target')}:</span>{' '}
              {pick(tier.target, locale)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
