import {
  educationLevels,
  type Locale,
  pick,
  type UpgradeIcon,
  type UpgradePack,
} from '@taksu/content';
import {
  Camera,
  Gamepad2,
  Grab,
  type LucideIcon,
  Map as MapIcon,
  Palette,
  Trophy,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LevelChip } from '../ui/level-chip';
import { StatusTag } from '../ui/status-tag';

export const upgradeIcons: Record<UpgradeIcon, LucideIcon> = {
  remote: Gamepad2,
  sensor: Palette,
  gripper: Grab,
  vision: Camera,
  arena: MapIcon,
  trophy: Trophy,
};

const kitName = (slug: string) => educationLevels.find((level) => level.slug === slug)?.kit ?? slug;

/** Upgrade packs as small boxes; each lists the kits it fits. */
export async function UpgradeGrid({
  packs,
  locale,
  detailed = false,
}: {
  packs: readonly UpgradePack[];
  locale: Locale;
  detailed?: boolean;
}) {
  const [common, t] = await Promise.all([getTranslations('Common'), getTranslations('Upgrades')]);
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packs.map((pack) => {
        const Icon = upgradeIcons[pack.icon];
        return (
          <li
            key={pack.id}
            id={detailed ? pack.id : undefined}
            className="box-ink-sm bg-surface flex flex-col rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="bg-ink text-ink-foreground flex size-12 items-center justify-center rounded-md">
                <Icon className="size-6" aria-hidden />
              </span>
              <StatusTag status={pack.status} />
            </div>
            <h3 className="type-label mt-4 text-2xl">{pack.name}</h3>
            <p className="mt-1 font-bold">{pick(pack.tagline, locale)}</p>
            <p className="text-muted-foreground mt-2">{pick(pack.body, locale)}</p>
            {detailed ? (
              <div className="mt-4 grid gap-4 text-[0.95rem]">
                <div>
                  <h4 className="font-bold">{t('includes')}</h4>
                  <ul className="mt-1 list-disc pl-5">
                    {pack.includes.map((item) => (
                      <li key={item.en}>{pick(item, locale)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold">{t('projects')}</h4>
                  <ul className="mt-1 list-disc pl-5">
                    {pack.projects.map((item) => (
                      <li key={item.en}>{pick(item, locale)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            <p className="mt-auto flex flex-wrap items-center gap-2 pt-5 text-sm">
              <span className="text-muted-foreground font-semibold">{common('fits')}</span>
              {pack.fits.map((level) => (
                <LevelChip key={level} level={level}>
                  {kitName(level)}
                </LevelChip>
              ))}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
