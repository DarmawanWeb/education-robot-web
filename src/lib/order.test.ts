import { describe, expect, it } from 'vitest';
import id from '../../messages/id.json';
import type { CartItem } from './cart-items';
import { buildOrder, emptyDetails, type OrderTranslate } from './order';

/** Fills {placeholders} from the Indonesian messages; the order messages use nothing fancier. */
const t: OrderTranslate = (key, values = {}) =>
  id.Cart.order[key].replace(/\{(\w+)\}/g, (_, name: string) => String(values[name]));

const ciko: CartItem = {
  key: 'ciko',
  slug: 'ciko',
  name: { id: 'Ciko', en: 'Ciko' },
  unitPrice: 1_750_000,
  qty: 2,
  href: '/robot/ciko',
};
const momo: CartItem = {
  key: 'momo:a',
  slug: 'momo',
  name: { id: 'Momo', en: 'Momo' },
  option: { id: 'Paket A', en: 'Package A' },
  unitPrice: 9_700_000,
  qty: 1,
  href: '/robot/momo',
};

describe('order message', () => {
  it('lists every item with its package and total, then the buyer details', () => {
    const { text, subject } = buildOrder(
      [ciko, momo],
      { ...emptyDetails, name: ' Ayu ', phone: '0812', city: 'Denpasar', address: 'Jl. Kenanga 1' },
      'id',
      t,
    );
    expect(text).toBe(
      [
        'Halo DCTEdu, saya mau pesan:',
        '',
        '1. Ciko × 2 = Rp3.500.000',
        '2. Momo (Paket A) × 1 = Rp9.700.000',
        '',
        'Subtotal: Rp13.200.000',
        '',
        'Nama: Ayu',
        'WhatsApp: 0812',
        'Kota: Denpasar',
        'Alamat: Jl. Kenanga 1',
        '',
        'Mohon info ongkos kirim dan cara bayarnya. Terima kasih.',
      ].join('\n'),
    );
    expect(subject).toBe('Pesanan DCTEdu dari Ayu');
  });

  it('leaves out details that were not filled in', () => {
    const { text } = buildOrder([ciko], emptyDetails, 'id', t);
    expect(text).not.toContain('Nama:');
    expect(text).not.toContain('Catatan:');
  });
});
