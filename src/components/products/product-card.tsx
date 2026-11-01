import { getRobot, type Locale, type Product, pick } from '@dctedu/catalog';
import { cn } from '@dctedu/ui/lib/utils';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { productImages } from '@/lib/images';
import { AvailabilityBadge, productPrice } from '../ui/price';
import { ProductIcon } from './product-icon';

function fitsList(product: Product, locale: Locale): string {
  return new Intl.ListFormat(locale, { type: 'conjunction' }).format(
    product.fits.map((slug) => getRobot(slug)?.name ?? slug),
  );
}

/** Something that can be ordered: its picture when it has one, its name, who it fits, the price. */
export async function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations('Shop');
  const price = productPrice(product.price, locale);
  const image = productImages[product.slug];
  return (
    <Link
      href={`/accessories/${product.slug}`}
      className="group bg-surface hover:border-edge flex h-full flex-col overflow-hidden rounded-lg border transition-colors"
    >
      {image ? (
        <div className="relative aspect-[10/7] border-b bg-white">
          <Image
            src={image.src}
            alt={pick(image.alt, locale)}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-3"
          />
        </div>
      ) : null}
      <div className={cn('flex flex-1 flex-col p-5', image ? 'pt-4' : undefined)}>
        {image ? null : <ProductIcon icon={product.icon} className="mb-5 size-16" />}
        <h3 className="text-lg font-bold group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
          {pick(product.name, locale)}
        </h3>
        <p className="text-muted-foreground mt-1 leading-snug">{pick(product.tagline, locale)}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
          <span className="text-muted-foreground text-sm font-semibold">
            {t('fits', { fits: fitsList(product, locale) })}
          </span>
          {price ? (
            <span className="text-lg font-bold tabular-nums">{price}</span>
          ) : (
            <AvailabilityBadge availability={product.availability} locale={locale} />
          )}
        </div>
      </div>
    </Link>
  );
}

/** Something still on the way, as one line in a list, so it does not compete with what can be ordered. */
export async function ProductRow({ product, locale }: { product: Product; locale: Locale }) {
  const t = await getTranslations('Shop');
  return (
    <Link
      href={`/accessories/${product.slug}`}
      className="group hover:bg-surface-muted grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1.5 px-4 py-3.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:px-5"
    >
      <ProductIcon icon={product.icon} className="size-10" />
      <span className="min-w-0">
        <span className="block font-bold group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
          {pick(product.name, locale)}
        </span>
        <span className="text-muted-foreground block text-sm leading-snug">
          {pick(product.tagline, locale)}
        </span>
      </span>
      <span className="text-muted-foreground col-start-2 text-sm font-semibold sm:col-start-3">
        {t('fits', { fits: fitsList(product, locale) })}
      </span>
      <AvailabilityBadge
        availability={product.availability}
        locale={locale}
        className="col-start-2 justify-self-start sm:col-start-4 sm:row-start-1 sm:justify-self-end"
      />
    </Link>
  );
}
