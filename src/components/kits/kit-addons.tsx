import { addOnsFor, type EducationLevel, type Locale, pick } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { UpgradeGrid } from '../home/upgrade-grid';
import { Container } from '../ui/container';
import { StatusTag } from '../ui/status-tag';
import { TextLink } from '../ui/text-link';

/** Upgrade packs and classroom accessories that fit this kit. */
export async function KitAddons({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const [t, home] = await Promise.all([getTranslations('Kit'), getTranslations('Home.upgrades')]);
  const { packs, accessories } = addOnsFor(level.slug);

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="type-label max-w-[20ch] text-[clamp(1.9rem,3.8vw,3rem)]">
            {t('upgrades', { kit: level.kit })}
          </h2>
          <TextLink href="/upgrades">{home('cta')}</TextLink>
        </div>
        <div className="mt-10">
          {packs.length > 0 ? (
            <UpgradeGrid packs={packs} locale={locale} />
          ) : (
            <p className="text-muted-foreground text-lg">{t('noUpgrades')}</p>
          )}
        </div>
        {accessories.length > 0 ? (
          <div className="mt-14">
            <h3 className="type-label text-2xl">{t('accessories', { kit: level.kit })}</h3>
            <ul className="border-edge mt-5 border-t-2">
              {accessories.map((item) => (
                <li
                  key={item.id}
                  className="border-border grid gap-1 border-b py-4 sm:grid-cols-[16rem_1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <span className="font-bold">{pick(item.name, locale)}</span>
                  <span className="text-muted-foreground">{pick(item.body, locale)}</span>
                  <StatusTag status={item.status} className="justify-self-start" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
