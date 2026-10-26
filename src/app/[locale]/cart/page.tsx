import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CartView } from '@/components/cart/cart-view';
import { Container } from '@/components/ui/container';
import { marketplaceLinks } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Cart' });
  return {
    ...pageMetadata({ locale, path: '/cart', title: t('title'), description: t('meta') }),
    // A cart is different for everyone, so there is nothing here for search engines.
    robots: { index: false },
  };
}

export default async function CartPage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations('Cart');
  return (
    <section className="pt-10 pb-20 lg:pt-14 lg:pb-28">
      <Container>
        <h1 className="type-display text-[clamp(2.25rem,5vw,3.75rem)]">{t('title')}</h1>
        <div className="mt-8">
          <CartView stores={marketplaceLinks()} />
        </div>
      </Container>
    </section>
  );
}
