import { accessories, educationLevels, pick, upgradePacks } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { UpgradeGrid } from '@/components/home/upgrade-grid';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { LevelChip } from '@/components/ui/level-chip';
import { Note } from '@/components/ui/note';
import { SectionTitle } from '@/components/ui/section-title';
import { StatusTag } from '@/components/ui/status-tag';
import { FitMatrix } from '@/components/upgrades/fit-matrix';
import { UpgradePath } from '@/components/upgrades/upgrade-path';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

const kitName = (slug: string) => educationLevels.find((level) => level.slug === slug)?.kit ?? slug;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Upgrades' });
  return pageMetadata({
    locale,
    path: '/upgrades',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function UpgradesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Upgrades');

  return (
    <>
      <section className="pt-12 pb-16 sm:pt-16 lg:pb-20">
        <Container>
          <SectionTitle as="h1" title={t('title')} intro={t('intro')} />
          <Note className="mt-8">{t('note')}</Note>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <SectionTitle title={t('pathTitle')} intro={t('pathIntro')} />
          <div className="mt-12">
            <UpgradePath locale={locale} />
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('packs')}</h2>
          <div className="mt-10">
            <UpgradeGrid packs={upgradePacks} locale={locale} detailed />
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <SectionTitle title={t('matrixTitle')} intro={t('matrixIntro')} />
          <div className="mt-8 max-w-4xl">
            <FitMatrix />
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('accessories')}</h2>
          <ul className="border-edge mt-8 border-t-2">
            {accessories.map((item) => (
              <li
                key={item.id}
                className="border-border grid gap-2 border-b py-5 md:grid-cols-[15rem_1fr_auto] md:items-baseline md:gap-6"
              >
                <span className="text-lg font-bold">{pick(item.name, locale)}</span>
                <span>
                  <span className="text-muted-foreground block">{pick(item.body, locale)}</span>
                  <span className="mt-2 flex flex-wrap gap-2">
                    {item.fits.map((level) => (
                      <LevelChip key={level} level={level}>
                        {kitName(level)}
                      </LevelChip>
                    ))}
                  </span>
                </span>
                <StatusTag status={item.status} className="justify-self-start" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
