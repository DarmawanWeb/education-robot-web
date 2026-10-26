import { faq, pick, products } from '@dctedu/catalog';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/products/product-card';
import { StartingGrid } from '@/components/robots/starting-grid';
import { BusinessTeaser } from '@/components/shared/business-teaser';
import { ClientList } from '@/components/shared/client-list';
import { ComesWith } from '@/components/shared/comes-with';
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
      <ComesWith locale={locale} />

      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title={t('addOns.title')}
            intro={t('addOns.intro')}
            action={<TextLink href="/accessories">{t('addOns.all')}</TextLink>}
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

      <BusinessTeaser locale={locale} />

      <section className="pb-20 lg:pb-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-display text-[clamp(1.75rem,3vw,2.25rem)]">{t('clients.title')}</h2>
            <TextLink href="/business#clients">{t('clients.more')}</TextLink>
          </div>
          <ClientList locale={locale} className="mt-6" />
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="type-display text-[clamp(2rem,3.4vw,2.75rem)]">{t('faq.title')}</h2>
            <TextLink href="/help" className="mt-6">
              {t('faq.all')}
            </TextLink>
          </div>
          <FaqList items={questions} />
        </Container>
      </section>
    </>
  );
}
