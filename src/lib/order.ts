import { formatRupiah, type Locale, pick } from '@taksu/catalog';
import { type CartItem, cartTotal } from './cart-items';

/** What the buyer types on the cart page. Nothing here is stored; it only goes into the message. */
export interface OrderDetails {
  name: string;
  phone: string;
  city: string;
  address: string;
  note: string;
}

export const emptyDetails: OrderDetails = { name: '', phone: '', city: '', address: '', note: '' };

type OrderKey =
  | 'greeting'
  | 'line'
  | 'subtotal'
  | 'name'
  | 'phone'
  | 'city'
  | 'address'
  | 'note'
  | 'closing'
  | 'subject';

/** The Cart.order messages, passed in so the wording stays in the message files. */
export type OrderTranslate = (key: OrderKey, values?: Record<string, string | number>) => string;

/** An item's name with its package, e.g. "Garu (Paket A: Raspberry Pi 5)". */
export function itemLabel(item: CartItem, locale: Locale): string {
  const name = pick(item.name, locale);
  return item.option ? `${name} (${pick(item.option, locale)})` : name;
}

const FIELDS = ['name', 'phone', 'city', 'address', 'note'] as const;

/** The whole order as plain text for a WhatsApp message or an email body, plus an email subject. */
export function buildOrder(
  items: readonly CartItem[],
  details: OrderDetails,
  locale: Locale,
  t: OrderTranslate,
): { text: string; subject: string } {
  const lines = items.map((item, index) =>
    t('line', {
      n: index + 1,
      item: itemLabel(item, locale),
      qty: item.qty,
      total: formatRupiah(item.unitPrice * item.qty, locale),
    }),
  );
  const fields = FIELDS.filter((key) => details[key].trim()).map((key) =>
    t(key, { value: details[key].trim() }),
  );
  const text = [
    t('greeting'),
    '',
    ...lines,
    '',
    t('subtotal', { amount: formatRupiah(cartTotal(items), locale) }),
    ...(fields.length > 0 ? ['', ...fields] : []),
    '',
    t('closing'),
  ].join('\n');
  return { text, subject: t('subject', { name: details.name.trim() }) };
}
