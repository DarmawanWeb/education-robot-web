import { describe, expect, it } from 'vitest';
import { type CartItem, cartTotal, resolveLine } from './cart-items';

describe('cart items', () => {
  it('keeps out robots an exclusive seller sells, robots in development, and unknown items', () => {
    expect(resolveLine({ key: 'ciko', slug: 'ciko', qty: 2 })).toBeNull();
    expect(resolveLine({ key: 'momo', slug: 'momo', qty: 1 })).toBeNull();
    expect(resolveLine({ key: 'garu', slug: 'garu', qty: 1 })).toBeNull();
    expect(resolveLine({ key: 'nope', slug: 'nope', qty: 1 })).toBeNull();
  });

  it('adds up unit prices times quantities', () => {
    const item = (unitPrice: number, qty: number): CartItem => ({
      key: `x${unitPrice}`,
      slug: 'x',
      name: { id: 'X', en: 'X' },
      unitPrice,
      qty,
      href: '/',
    });
    expect(cartTotal([item(150_000, 2), item(90_000, 1)])).toBe(390_000);
  });
});
