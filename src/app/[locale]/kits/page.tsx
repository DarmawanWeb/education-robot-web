import { educationLevels } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CompareTable } from '@/components/kits/compare-table';
import { KitBox } from '@/components/kits/kit-box';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { TextLink } from '@/components/ui/text-link';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Kits' });
  return pageMetadata({
    locale,
    path: '/kits',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function KitsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const [t, home] = await Promise.all([getTranslations('Kits'), getTranslations('Home.upgrades')]);

  return (
    <>
      <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
        <Container>
          <SectionTitle as="h1" title={t('title')} intro={t('intro')} />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {educationLevels.map((level) => (
              <li key={level.slug}>
                <KitBox level={level} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="compare" className="scroll-mt-24 pb-16 lg:pb-24">
        <Container>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('compareTitle')}</h2>
          <div className="mt-8">
            <CompareTable locale={locale} />
          </div>
          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
            <p className="text-muted-foreground max-w-[62ch] text-lg">{home('intro')}</p>
            <TextLink href="/upgrades">{home('cta')}</TextLink>
          </div>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
