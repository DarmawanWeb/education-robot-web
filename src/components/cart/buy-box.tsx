'use client';

import { formatRupiah, type Locale, type Marketplace, marketplaceNames } from '@dctedu/catalog';
import { Button } from '@dctedu/ui/components/button';
import { cn } from '@dctedu/ui/lib/utils';
import { MessageCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { whatsappUrl } from '@/lib/links';
import { AddToCart } from './add-to-cart';

export interface BuyOption {
  id: string;
  label: string;
  price: number;
}

/**
 * How to buy one item: choose a package if there are several, then add it to the cart, order it
 * straight away on WhatsApp, or open it on a marketplace.
 */
export function BuyBox({
  slug,
  name,
  price,
  options,
  orderable,
  stores,
  notifyHref,
  note,
}: {
  slug: string;
  name: string;
  price: number | null;
  options?: BuyOption[];
  orderable: boolean;
  stores: { id: Marketplace; url: string }[];
  /** For items that are not on sale yet: where "let me know" goes. */
  notifyHref: string;
  note?: string;
}) {
  const t = useTranslations('Buy');
  const locale = useLocale() as Locale;
  const [choice, setChoice] = useState(options?.[0]?.id);
  const selected = options?.find((option) => option.id === choice);
  const amount = selected?.price ?? price;
  const label = selected ? `${name} (${selected.label})` : name;
  const whatsapp =
    amount !== null
      ? whatsappUrl(t('whatsappMessage', { item: label, price: formatRupiah(amount, locale) }))
      : null;

  return (
    <div className="flex flex-col gap-5">
      {options && options.length > 1 ? (
        <fieldset>
          <legend className="text-sm font-bold">{t('package')}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option.id}
                className={cn(
                  'bg-surface flex cursor-pointer flex-col rounded-lg border-2 px-4 py-3',
                  choice === option.id
                    ? 'border-edge'
                    : 'border-border hover:border-muted-foreground',
                )}
              >
                <input
                  type="radio"
                  name={`${slug}-package`}
                  value={option.id}
                  checked={choice === option.id}
                  onChange={() => setChoice(option.id)}
                  className="sr-only"
                />
                <span className="font-bold">{option.label}</span>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {formatRupiah(option.price, locale)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {orderable ? (
        <div className="flex flex-wrap items-center gap-3">
          <AddToCart slug={slug} option={selected?.id} />
          {whatsapp ? (
            <Button asChild size="lg" variant="outline">
              <a href={whatsapp}>
                <MessageCircle aria-hidden />
                {t('whatsapp')}
              </a>
            </Button>
          ) : null}
        </div>
      ) : (
        <div>
          <Button asChild size="lg" variant="ink">
            <a href={notifyHref}>{t('notify')}</a>
          </Button>
        </div>
      )}

      {orderable && stores.length > 0 ? (
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground font-semibold">{t('alsoOn')}</span>
          {stores.map((store) => (
            <a
              key={store.id}
              href={store.url}
              target="_blank"
              rel="noopener"
              className="bg-surface hover:bg-surface-muted rounded-full border px-3 py-1 font-bold"
            >
              {marketplaceNames[store.id]}
            </a>
          ))}
        </p>
      ) : null}

      {note ? <p className="text-muted-foreground text-sm leading-relaxed">{note}</p> : null}
    </div>
  );
}
