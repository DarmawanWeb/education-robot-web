import { educationLevels, upgradePacks } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { Check, Minus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { levelTone } from '../ui/level-chip';

/** Which pack fits which kit, at a glance. */
export async function FitMatrix() {
  const t = await getTranslations('Upgrades');
  return (
    <div className="border-edge overflow-x-auto rounded-lg border-2">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <caption className="sr-only">{t('matrixTitle')}</caption>
        <thead>
          <tr className="bg-surface-muted">
            <th scope="col" className="px-5 py-4 font-bold">
              {t('pack')}
            </th>
            {educationLevels.map((level) => (
              <th
                key={level.slug}
                scope="col"
                className="border-edge w-[18%] border-l-2 p-0 text-center"
              >
                <span
                  className={cn('block h-2.5 border-b-2 border-black', levelTone[level.slug])}
                />
                <span className="type-label block px-3 py-3.5 text-lg">{level.kit}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {upgradePacks.map((pack) => (
            <tr key={pack.id} className="border-border border-t">
              <th scope="row" className="px-5 py-3.5 font-semibold">
                <a href={`#${pack.id}`} className="underline-offset-4 hover:underline">
                  {pack.name}
                </a>
              </th>
              {educationLevels.map((level) => {
                const fits = pack.fits.includes(level.slug);
                return (
                  <td key={level.slug} className="border-edge border-l-2 px-3 py-3.5 text-center">
                    {fits ? (
                      <Check className="mx-auto size-6 stroke-[3]" aria-hidden />
                    ) : (
                      <Minus className="text-muted-foreground mx-auto size-5" aria-hidden />
                    )}
                    <span className="sr-only">{fits ? t('fitsYes') : t('fitsNo')}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
