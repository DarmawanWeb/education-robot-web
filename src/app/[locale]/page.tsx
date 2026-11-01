import { canOrder, products } from '@dctedu/catalog';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/products/product-card';
import { StartingGrid } from '@/components/robots/starting-grid';
import { AboutBand } from '@/components/shared/about-band';
import { BusinessBand } from '@/components/shared/business-band';
import { ComesWith } from '@/components/shared/comes-with';
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

/**
 * The home page says each thing once: the robots, what comes with them, what can be ordered
 * today, one door for business buyers, and who is behind it all. Everything else has its own page.
 */
export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Home');
  const ready = products.filter(
    (product) => canOrder(product.availability) && product.price !== null,
  );
  const upcoming = products.length - ready.length;

  return (
    <>
      <StartingGrid locale={locale} />
      <ComesWith locale={locale} />

      {ready.length > 0 ? (
        <section className="py-20 lg:py-28">
          <Container>
            <SectionHeading
              title={t('addOns.title')}
              intro={t('addOns.intro')}
              action={<TextLink href="/accessories">{t('addOns.all')}</TextLink>}
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ready.slice(0, 3).map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} locale={locale} />
                </li>
              ))}
            </ul>
            {upcoming > 0 ? (
              <p className="text-muted-foreground mt-6 font-semibold">
                {t('addOns.soon', { count: upcoming })}
              </p>
            ) : null}
          </Container>
        </section>
      ) : null}

      <BusinessBand />
      <AboutBand locale={locale} />
    </>
  );
}
