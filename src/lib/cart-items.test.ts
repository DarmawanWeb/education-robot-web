import { describe, expect, it } from 'vitest';
import { cartTotal, resolveLine } from './cart-items';

describe('cart items', () => {
  it('prices robots from the catalogue and skips items that cannot be ordered', () => {
    const ciko = resolveLine({ key: 'ciko', slug: 'ciko', qty: 2 });
    expect(ciko?.unitPrice).toBeGreaterThan(0);
    expect(resolveLine({ key: 'garu', slug: 'garu', qty: 1 })).toBeNull();
    expect(resolveLine({ key: 'nope', slug: 'nope', qty: 1 })).toBeNull();
    expect(cartTotal(ciko ? [ciko] : [])).toBe((ciko?.unitPrice ?? 0) * 2);
  });
});
