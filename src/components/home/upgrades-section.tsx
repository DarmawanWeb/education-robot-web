import { type Locale, upgradePacks } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { Container } from '../ui/container';
import { SectionTitle } from '../ui/section-title';
import { TextLink } from '../ui/text-link';
import { UpgradeGrid } from './upgrade-grid';

const featured = ['remote', 'sensor', 'vision'];

export async function UpgradesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.upgrades');
  const packs = featured.flatMap((id) => upgradePacks.filter((pack) => pack.id === id));
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle title={t('title')} intro={t('intro')} />
          <TextLink href="/upgrades">{t('cta')}</TextLink>
        </div>
        <div className="mt-12">
          <UpgradeGrid packs={packs} locale={locale} />
        </div>
      </Container>
    </section>
  );
}
