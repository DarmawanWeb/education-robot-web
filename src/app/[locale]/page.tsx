import { faq, pick, products } from '@taksu/catalog';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/products/product-card';
import { AgeRuler } from '@/components/robots/age-ruler';
import { StartingGrid } from '@/components/robots/starting-grid';
import { BusinessTeaser } from '@/components/shared/business-teaser';
import { BuyChannels } from '@/components/shared/buy-channels';
import { ComesWith } from '@/components/shared/comes-with';
import { DropBand } from '@/components/shared/drop-band';
import { FaqList } from '@/components/shared/faq-list';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { TextLink } from '@/components/ui/text-link';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return pageMetadata({ locale, path: '/', description: t('description') });
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Home');
  const addOns = products.filter(
    (product) => product.kind === 'upgrade' || product.kind === 'arena',
  );
  const questions = faq.slice(0, 5).map((item) => ({
    id: item.id,
    question: pick(item.question, locale),
    answer: pick(item.answer, locale),
  }));

  return (
    <>
      <StartingGrid locale={locale} />
      <AgeRuler locale={locale} />
      <ComesWith locale={locale} />
      <DropBand locale={locale} compact />

      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title={t('addOns.title')}
            intro={t('addOns.intro')}
            action={<TextLink href="/aksesori">{t('addOns.all')}</TextLink>}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addOns.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div className="bg-surface border-t">
        <BuyChannels />
        <BusinessTeaser locale={locale} />
      </div>

      <section className="py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="type-display text-[clamp(2rem,3.4vw,2.75rem)]">{t('faq.title')}</h2>
            <TextLink href="/bantuan" className="mt-6">
              {t('faq.all')}
            </TextLink>
          </div>
          <FaqList items={questions} />
        </Container>
      </section>
    </>
  );
}
