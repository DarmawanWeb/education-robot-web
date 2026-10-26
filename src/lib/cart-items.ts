import { getProduct, getRobot, type Localized } from '@dctedu/catalog';
import type { CartLine } from './cart';

/** A cart line with its name, price, and page, read from the catalogue. */
export interface CartItem {
  key: string;
  slug: string;
  name: Localized;
  option?: Localized;
  unitPrice: number;
  qty: number;
  href: string;
}

/** Looks a line up in the catalogue; lines for items that are gone or not for sale drop out. */
export function resolveLine(line: CartLine): CartItem | null {
  const robot = getRobot(line.slug);
  if (robot) {
    // Robots an exclusive seller sells never go in our cart.
    if (robot.seller || robot.availability === 'soon') return null;
    const option = robot.options?.find((entry) => entry.id === line.option);
    const unitPrice = option?.price ?? robot.price;
    if (unitPrice === null) return null;
    return {
      key: line.key,
      slug: robot.slug,
      name: { id: robot.name, en: robot.name },
      option: option?.label,
      unitPrice,
      qty: line.qty,
      href: `/robot/${robot.slug}`,
    };
  }
  const product = getProduct(line.slug);
  if (!product || product.availability === 'soon' || product.price === null) return null;
  return {
    key: line.key,
    slug: product.slug,
    name: product.name,
    unitPrice: product.price,
    qty: line.qty,
    href: `/accessories/${product.slug}`,
  };
}

export function cartTotal(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}
