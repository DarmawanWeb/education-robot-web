'use client';

import {
  formatRupiah,
  getProduct,
  getRobot,
  type Locale,
  type Marketplace,
  marketplaceNames,
  pick,
} from '@taksu/catalog';
import { Button } from '@taksu/edu-ui/components/button';
import { Input } from '@taksu/edu-ui/components/input';
import { Label } from '@taksu/edu-ui/components/label';
import { Textarea } from '@taksu/edu-ui/components/textarea';
import { CheckCircle2, Mail, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { type ChangeEvent, type FormEvent, useEffect, useId, useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cart, MAX_QTY, useCart } from '@/lib/cart';
import { type CartItem, cartTotal, resolveLine } from '@/lib/cart-items';
import { imageFit, robotImages } from '@/lib/images';
import { mailtoUrl, whatsappUrl } from '@/lib/links';
import { buildOrder, emptyDetails, itemLabel, type OrderDetails } from '@/lib/order';
import { useHydrated } from '@/lib/use-hydrated';
import { ProductIcon } from '../products/product-icon';
import { TextLink } from '../ui/text-link';

function Thumb({ slug }: { slug: string }) {
  const robot = getRobot(slug);
  if (robot) {
    const image = robotImages[robot.slug];
    return (
      <span className="relative block aspect-square overflow-hidden rounded-md border bg-white">
        <Image src={image.src} alt="" fill sizes="6rem" className={imageFit(image, 'p-1.5')} />
      </span>
    );
  }
  const product = getProduct(slug);
  return product ? <ProductIcon icon={product.icon} className="aspect-square w-full" /> : null;
}

function Stepper({ item, label }: { item: CartItem; label: string }) {
  const t = useTranslations('Cart');
  const step =
    'grid size-10 place-items-center rounded-[5px] hover:bg-surface-muted disabled:opacity-35 disabled:hover:bg-transparent';
  return (
    <div className="border-edge flex h-11 items-center rounded-md border-2 px-0.5">
      <button
        type="button"
        className={step}
        aria-label={t('decrease', { item: label })}
        disabled={item.qty <= 1}
        onClick={() => cart.setQty(item.key, item.qty - 1)}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={item.qty}
        aria-label={t('qty', { item: label })}
        onChange={(event) => {
          const qty = Number.parseInt(event.target.value, 10);
          if (Number.isInteger(qty) && qty > 0) cart.setQty(item.key, qty);
        }}
        className="w-10 [appearance:textfield] bg-transparent text-center font-bold tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        className={step}
        aria-label={t('increase', { item: label })}
        disabled={item.qty >= MAX_QTY}
        onClick={() => cart.setQty(item.key, item.qty + 1)}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}

function Empty() {
  const t = useTranslations('Cart.empty');
  return (
    <div className="bg-surface rounded-xl border px-6 py-14 text-center sm:py-20">
      <ShoppingBag className="text-muted-foreground mx-auto size-10" aria-hidden />
      <h2 className="type-display mt-5 text-[clamp(1.5rem,3vw,2.25rem)]">{t('title')}</h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-[42ch] text-lg">{t('body')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/robot">{t('robots')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/aksesori">{t('accessories')}</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * The cart: change counts, then send the order as a WhatsApp message or an email. There is no
 * checkout on the site; we reply with the total, shipping, and payment details.
 */
export function CartView({ stores }: { stores: { id: Marketplace; url: string }[] }) {
  const t = useTranslations('Cart');
  const order = useTranslations('Cart.order');
  const locale = useLocale() as Locale;
  const hydrated = useHydrated();
  const lines = useCart();
  const items = useMemo(
    () => lines.map(resolveLine).filter((item): item is CartItem => item !== null),
    [lines],
  );
  const [details, setDetails] = useState<OrderDetails>(emptyDetails);
  const [sent, setSent] = useState(false);
  const id = useId();
  const canWhatsapp = whatsappUrl('') !== null;

  // Lines the catalogue no longer sells are dropped, so the count in the header stays right.
  useEffect(() => {
    for (const line of lines) if (!resolveLine(line)) cart.remove(line.key);
  }, [lines]);

  if (!hydrated) {
    return (
      <div aria-busy className="bg-surface h-80 rounded-xl border motion-safe:animate-pulse">
        <span className="sr-only">{t('loading')}</span>
      </div>
    );
  }
  if (items.length === 0) return <Empty />;

  const field = (key: keyof OrderDetails) => ({
    id: `${id}-${key}`,
    name: key,
    value: details[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDetails((current) => ({ ...current, [key]: event.target.value })),
  });

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const { text, subject } = buildOrder(items, details, locale, (key, values) =>
      order(key, values),
    );
    const whatsapp = submitter?.value === 'email' ? null : whatsappUrl(text);
    if (whatsapp) {
      const opened = window.open(whatsapp, '_blank');
      if (opened) opened.opener = null;
      else window.location.href = whatsapp;
    } else {
      window.location.href = mailtoUrl(subject, text);
    }
    setSent(true);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12">
      <div className="lg:col-start-1">
        <ul aria-label={t('items')} className="bg-surface divide-y rounded-xl border">
          {items.map((item) => {
            const label = itemLabel(item, locale);
            return (
              <li
                key={item.key}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 p-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 sm:p-5"
              >
                <Thumb slug={item.slug} />
                <div className="min-w-0">
                  <Link
                    href={item.href}
                    className="text-lg font-bold hover:underline hover:decoration-2 hover:underline-offset-4"
                  >
                    {pick(item.name, locale)}
                  </Link>
                  {item.option ? (
                    <p className="font-semibold">{pick(item.option, locale)}</p>
                  ) : null}
                  <p className="text-muted-foreground text-sm tabular-nums">
                    {t('each', { price: formatRupiah(item.unitPrice, locale) })}
                  </p>
                </div>
                <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:justify-end sm:gap-4">
                  <Stepper item={item} label={label} />
                  <p className="min-w-32 text-right text-lg font-bold tabular-nums">
                    {formatRupiah(item.unitPrice * item.qty, locale)}
                  </p>
                  <button
                    type="button"
                    onClick={() => cart.remove(item.key)}
                    aria-label={t('removeLabel', { item: label })}
                    className="text-muted-foreground hover:text-danger hover:bg-surface-muted inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-bold"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    {t('remove')}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-5">
          <span className="text-muted-foreground">{t('bulk')} </span>
          <TextLink href="/bisnis#beli-banyak">{t('bulkLink')}</TextLink>
        </p>
        {stores.length > 0 ? (
          <p className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground font-semibold">{t('market')}</span>
            {stores.map((store) => (
              <a
                key={store.id}
                href={store.url}
                target="_blank"
                rel="noopener"
                className="bg-surface hover:bg-surface-muted rounded-full border px-3 py-1 text-sm font-bold"
              >
                {marketplaceNames[store.id]}
              </a>
            ))}
          </p>
        ) : null}
      </div>

      <aside className="self-start lg:sticky lg:top-24 lg:col-start-2 lg:row-span-3 lg:row-start-1">
        <div className="bg-surface rounded-xl border p-6 sm:p-7">
          <dl className="grid gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-bold">{t('subtotal')}</dt>
              <dd className="text-2xl font-bold tabular-nums">
                {formatRupiah(cartTotal(items), locale)}
              </dd>
            </div>
            <div className="text-muted-foreground flex items-baseline justify-between gap-4 text-sm">
              <dt>{t('shipping')}</dt>
              <dd className="text-right">{t('shippingValue')}</dd>
            </div>
          </dl>

          {sent ? (
            <div role="status" className="mt-6 border-t pt-6">
              <CheckCircle2 className="text-success size-8" aria-hidden />
              <h2 className="mt-3 text-xl font-bold">{t('sent.title')}</h2>
              <p className="text-muted-foreground mt-2 leading-relaxed">{t('sent.body')}</p>
              <div className="mt-5 grid gap-2">
                <Button
                  size="lg"
                  variant="ink"
                  onClick={() => {
                    cart.clear();
                    setDetails(emptyDetails);
                    setSent(false);
                  }}
                >
                  {t('sent.clear')}
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setSent(false)}>
                  {t('sent.again')}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={send} className="mt-6 grid gap-4 border-t pt-6">
              <div>
                <h2 className="text-xl font-bold">{t('form.title')}</h2>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {t('form.intro')}
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-name`}>{t('form.name')}</Label>
                <Input {...field('name')} required autoComplete="name" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-phone`}>{t('form.phone')}</Label>
                <Input {...field('phone')} type="tel" inputMode="tel" required autoComplete="tel" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-city`}>{t('form.city')}</Label>
                <Input {...field('city')} required autoComplete="address-level2" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-address`}>{t('form.address')}</Label>
                <Textarea
                  {...field('address')}
                  required
                  rows={3}
                  autoComplete="street-address"
                  className="min-h-0"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor={`${id}-note`}>{t('form.note')}</Label>
                <Textarea {...field('note')} rows={2} className="min-h-0" />
              </div>
              <div className="mt-2 grid gap-2">
                {canWhatsapp ? (
                  <>
                    <Button type="submit" value="whatsapp" size="lg">
                      <MessageCircle aria-hidden />
                      {t('form.whatsapp')}
                    </Button>
                    <Button type="submit" value="email" size="lg" variant="outline">
                      <Mail aria-hidden />
                      {t('form.email')}
                    </Button>
                  </>
                ) : (
                  <Button type="submit" value="email" size="lg">
                    <Mail aria-hidden />
                    {t('form.emailOnly')}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </aside>

      {/* Below the form on phones, under the items on wide screens. */}
      <section aria-labelledby={`${id}-how`} className="lg:col-start-1 lg:row-start-2">
        <h2 id={`${id}-how`} className="text-xl font-bold">
          {t('how.title')}
        </h2>
        <ol className="mt-5 grid gap-5">
          {(['send', 'reply', 'ship'] as const).map((step, index) => (
            <li key={step} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4">
              <span className="type-number border-edge grid size-10 place-items-center rounded-full border-2">
                {index + 1}
              </span>
              <p className="pt-1.5 leading-relaxed">{t(`how.${step}`)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
