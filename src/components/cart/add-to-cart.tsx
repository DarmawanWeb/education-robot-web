'use client';

import { Button, type ButtonProps } from '@taksu/ui/components/button';
import { Check, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cart } from '@/lib/cart';

/** Adds one item to the cart and says so, with a link to the cart. */
export function AddToCart({
  slug,
  option,
  size = 'lg',
  variant = 'default',
  className,
}: {
  slug: string;
  option?: string;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  className?: string;
}) {
  const t = useTranslations('Cart');
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 4000);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2">
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={() => {
          cart.add(slug, option);
          setAdded(true);
        }}
      >
        {added ? <Check aria-hidden /> : <ShoppingBag aria-hidden />}
        {added ? t('added') : t('add')}
      </Button>
      <span aria-live="polite" className="text-sm font-bold">
        {added ? (
          <Link
            href="/keranjang"
            className="decoration-primary underline decoration-2 underline-offset-4"
          >
            {t('view')}
          </Link>
        ) : null}
      </span>
    </span>
  );
}
