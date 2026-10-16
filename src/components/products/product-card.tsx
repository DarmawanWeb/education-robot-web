import { getRobot, type Locale, type Product, pick } from '@taksu/catalog';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AvailabilityBadge, productPrice } from '../ui/price';
import { ProductIcon } from './product-icon';

/** An upgrade pack, arena, or accessory in a grid. */
export async function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations('Shop');
  const fits = new Intl.ListFormat(locale, { type: 'conjunction' }).format(
    product.fits.map((slug) => getRobot(slug)?.name ?? slug),
  );
  const price = productPrice(product.price, locale);
  return (
    <Link
      href={`/aksesori/${product.slug}`}
      className="group bg-surface hover:border-edge flex h-full flex-col rounded-lg border p-5 transition-colors"
    >
      <ProductIcon icon={product.icon} className="size-16" />
      <h3 className="mt-5 text-lg font-bold group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
        {pick(product.name, locale)}
      </h3>
      <p className="text-muted-foreground mt-1 leading-snug">{pick(product.tagline, locale)}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
        <span className="text-muted-foreground text-sm font-semibold">{t('fits', { fits })}</span>
        {price ? (
          <span className="font-bold tabular-nums">{price}</span>
        ) : (
          <AvailabilityBadge availability={product.availability} locale={locale} />
        )}
      </div>
    </Link>
  );
}
