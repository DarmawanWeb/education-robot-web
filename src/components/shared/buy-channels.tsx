import { marketplaceNames } from '@dctedu/catalog';
import { Button } from '@dctedu/ui/components/button';
import { Building2, ShoppingBag, Store } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { marketplaceLinks } from '@/lib/links';
import { Container } from '../ui/container';
import { SectionHeading } from '../ui/section-heading';

/** Where to buy: our marketplace stores (once they exist), directly, or in bulk. */
export async function BuyChannels() {
  const t = await getTranslations('Home.buy');
  const stores = marketplaceLinks();
  const card = 'bg-surface flex flex-col rounded-lg border p-6';
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading title={t('title')} intro={t('intro')} />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          <li className={card}>
            <ShoppingBag className="size-7" aria-hidden />
            <h3 className="mt-4 text-xl font-bold">{t('direct.title')}</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">{t('direct.body')}</p>
            <div className="mt-auto pt-6">
              <Button asChild variant="ink">
                <Link href="/robot">{t('direct.action')}</Link>
              </Button>
            </div>
          </li>
          <li className={card}>
            <Store className="size-7" aria-hidden />
            <h3 className="mt-4 text-xl font-bold">{t('market.title')}</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {stores.length > 0 ? t('market.body') : t('market.soon')}
            </p>
            {stores.length > 0 ? (
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {stores.map((store) => (
                  <Button key={store.id} asChild variant="outline">
                    <a href={store.url} rel="noopener" target="_blank">
                      {marketplaceNames[store.id]}
                    </a>
                  </Button>
                ))}
              </div>
            ) : null}
          </li>
          <li className={card}>
            <Building2 className="size-7" aria-hidden />
            <h3 className="mt-4 text-xl font-bold">{t('bulk.title')}</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed">{t('bulk.body')}</p>
            <div className="mt-auto pt-6">
              <Button asChild variant="outline">
                <Link href="/bisnis#beli-banyak">{t('bulk.action')}</Link>
              </Button>
            </div>
          </li>
        </ul>
      </Container>
    </section>
  );
}
