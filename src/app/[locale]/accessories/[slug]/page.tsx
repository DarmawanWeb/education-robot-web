import {
  brand,
  canOrder,
  getProduct,
  getRobot,
  type Locale,
  type Product,
  pick,
  productKindLabels,
  products,
  type Robot,
} from '@dctedu/catalog';
import { RaceNumber } from '@dctedu/ui/brand/race-number';
import { cn } from '@dctedu/ui/lib/utils';
import { Check } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BuyBox } from '@/components/cart/buy-box';
import { ProductCard } from '@/components/products/product-card';
import { ProductIcon } from '@/components/products/product-icon';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { AvailabilityBadge, productPrice } from '@/components/ui/price';
import { TextLink } from '@/components/ui/text-link';
import { Link } from '@/i18n/navigation';
import { contactHref } from '@/lib/contact';
import { productImages } from '@/lib/images';
import { marketplaceLinks } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { robotStyle } from '@/lib/robot-style';
import { accessoryProduct, breadcrumbs } from '@/lib/structured-data';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const product = getProduct((await params).slug);
  if (!product) return {};
  return pageMetadata({
    locale,
    path: `/accessories/${product.slug}`,
    title: `${pick(product.name, locale)}: ${pick(product.tagline, locale)}`,
    description: pick(product.body, locale),
  });
}

/** Other things of the same kind first, then anything else, three at most. */
function related(product: Product): Product[] {
  const others = products.filter((entry) => entry.slug !== product.slug);
  return [
    ...others.filter((entry) => entry.kind === product.kind),
    ...others.filter((entry) => entry.kind !== product.kind),
  ].slice(0, 3);
}

function List({
  title,
  items,
  locale,
}: {
  title: string;
  items: Product['includes'];
  locale: Locale;
}) {
  return (
    <div>
      <h2 className="type-display text-[clamp(1.5rem,2.6vw,2rem)]">{title}</h2>
      <ul className="mt-5 grid gap-2.5">
        {items.map((item) => (
          <li key={item.en} className="flex gap-2.5 text-lg">
            <Check className="text-success mt-1.5 size-4 shrink-0" aria-hidden />
            {pick(item, locale)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const [t, tp] = await Promise.all([getTranslations('Product'), getTranslations('Price')]);
  const name = pick(product.name, locale);
  const kind = pick(productKindLabels[product.kind], locale);
  const image = productImages[product.slug];
  const fits = product.fits
    .map((slug) => getRobot(slug))
    .filter((robot): robot is Robot => !!robot);
  const price = productPrice(product.price, locale);
  const orderable = canOrder(product.availability) && product.price !== null;

  const nav = await getTranslations('Nav');

  return (
    <>
      <JsonLd
        data={[
          accessoryProduct(product, locale),
          breadcrumbs(locale, [
            [brand.name, ''],
            [nav('accessories'), '/accessories'],
            [pick(product.name, locale), `/accessories/${product.slug}`],
          ]),
        ]}
      />
      <section className="pt-8 pb-16 lg:pt-12 lg:pb-24">
        <Container>
          <nav aria-label={t('breadcrumb')} className="text-muted-foreground text-sm font-semibold">
            <Link href="/accessories" className="hover:text-foreground hover:underline">
              {t('all')}
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-foreground">
              {name}
            </span>
          </nav>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14">
            <div
              className={cn(
                'relative grid aspect-[4/3] place-items-center self-start overflow-hidden rounded-xl',
                image ? 'bg-surface-muted border' : 'asphalt',
              )}
            >
              {image ? (
                <Image
                  src={image.src}
                  alt={pick(image.alt, locale)}
                  priority
                  placeholder="blur"
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="h-auto w-[88%] shadow-md"
                />
              ) : (
                <ProductIcon icon={product.icon} className="size-52 bg-transparent sm:size-72" />
              )}
              <span
                className={cn(
                  'absolute top-5 left-5 rounded-full px-3 py-1 text-sm font-bold',
                  image ? 'bg-ink text-ink-foreground' : 'bg-white/10 text-white',
                )}
              >
                {kind}
              </span>
              <span aria-hidden className="absolute inset-x-0 bottom-0 flex h-2.5">
                {fits.map((robot) => (
                  <span key={robot.slug} className={cn('flex-1', robotStyle[robot.slug].fill)} />
                ))}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="type-display text-[clamp(2.5rem,5.5vw,4rem)]">{name}</h1>
                <AvailabilityBadge availability={product.availability} locale={locale} />
              </div>
              <p className="mt-4 text-xl leading-snug font-bold">{pick(product.tagline, locale)}</p>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                {pick(product.body, locale)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">{t('fits')}</span>
                {fits.map((robot) => (
                  <Link
                    key={robot.slug}
                    href={`/robot/${robot.slug}`}
                    className={cn(
                      'rounded-full px-3 py-1 text-sm font-bold hover:underline',
                      robotStyle[robot.slug].fill,
                      robotStyle[robot.slug].text,
                    )}
                  >
                    {robot.name}
                  </Link>
                ))}
              </div>
              <div className="mt-6 border-t pt-6">
                <p className="text-2xl font-bold tabular-nums">{price ?? tp('soon')}</p>
                <div className="mt-5">
                  <BuyBox
                    slug={product.slug}
                    name={name}
                    price={product.price}
                    orderable={orderable}
                    stores={marketplaceLinks(product.marketplace)}
                    notifyHref={contactHref(
                      t('notifyMessage', { item: name }),
                      t('notifySubject', { item: name }),
                    )}
                    note={
                      product.availability === 'preorder'
                        ? t('preorderNote')
                        : product.availability === 'soon'
                          ? t('soonNote')
                          : undefined
                    }
                  />
                </div>
                {product.kind === 'sekolah' ? (
                  <p className="mt-6 text-sm">
                    <span className="text-muted-foreground">{t('school')} </span>
                    <TextLink href="/business#bulk">{t('schoolAction')}</TextLink>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface border-y py-16 lg:py-20">
        <Container className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <List title={t('includes')} items={product.includes} locale={locale} />
          {product.projects?.length ? (
            <List title={t('projects')} items={product.projects} locale={locale} />
          ) : null}
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <h2 className="type-display text-[clamp(1.5rem,2.6vw,2rem)]">{t('robots')}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {fits.map((robot) => (
              <li key={robot.slug}>
                <Link
                  href={`/robot/${robot.slug}`}
                  className="group bg-surface hover:border-edge relative flex h-full items-start gap-4 overflow-hidden rounded-lg border p-5 pb-7 transition-colors"
                >
                  <RaceNumber value={robot.number} size="md" />
                  <span className="min-w-0">
                    <span className="type-number block text-[1.75rem] group-hover:underline group-hover:decoration-[3px] group-hover:underline-offset-4">
                      {robot.name}
                    </span>
                    <span className="text-muted-foreground mt-1 block leading-snug">
                      {pick(robot.tagline, locale)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn('absolute inset-x-0 bottom-0 h-1.5', robotStyle[robot.slug].fill)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface border-t py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="type-display text-[clamp(1.5rem,2.6vw,2rem)]">{t('related')}</h2>
            <TextLink href="/accessories">{t('all')}</TextLink>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related(product).map((entry) => (
              <li key={entry.slug}>
                <ProductCard product={entry} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
