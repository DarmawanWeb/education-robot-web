'use client';

import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartCount } from '@/lib/cart';

/** The cart, with the number of items once there is something in it. */
export function CartButton() {
  const t = useTranslations('Nav');
  const count = useCartCount();
  return (
    <Link
      href="/keranjang"
      aria-label={count > 0 ? t('cartCount', { count }) : t('cart')}
      className="hover:bg-surface-muted relative flex size-11 items-center justify-center rounded-md"
    >
      <ShoppingBag className="size-5" aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          className="bg-primary text-primary-foreground absolute top-1 right-0.5 grid min-w-5 place-items-center rounded-full px-1 text-xs leading-5 font-bold tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
