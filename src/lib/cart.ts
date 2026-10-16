'use client';

import { useSyncExternalStore } from 'react';

/** One row in the cart: an item, an optional package (such as Garu's compute), and a count. */
export interface CartLine {
  key: string;
  slug: string;
  option?: string;
  qty: number;
}

const KEY = 'taksu-cart';
export const MAX_QTY = 50;
const EMPTY: CartLine[] = [];

let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

export const lineKey = (slug: string, option?: string) => (option ? `${slug}:${option}` : slug);

function isLine(value: unknown): value is CartLine {
  const line = value as CartLine;
  return (
    typeof line?.slug === 'string' &&
    typeof line.key === 'string' &&
    Number.isInteger(line.qty) &&
    line.qty > 0
  );
}

/**
 * The cart lives in this browser only. Storage can be missing or blocked (private windows,
 * previews), so every read and write is guarded and the cart simply starts empty.
 */
function read(): CartLine[] {
  if (lines) return lines;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    lines = Array.isArray(parsed) ? parsed.filter(isLine) : [];
  } catch {
    lines = [];
  }
  return lines;
}

function write(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // The cart still works for this visit.
  }
  for (const listener of listeners) listener();
}

export const cart = {
  add(slug: string, option?: string, qty = 1) {
    const key = lineKey(slug, option);
    const current = read();
    const found = current.find((line) => line.key === key);
    write(
      found
        ? current.map((line) =>
            line.key === key ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line,
          )
        : [...current, { key, slug, option, qty: Math.min(MAX_QTY, qty) }],
    );
  },
  setQty(key: string, qty: number) {
    if (qty <= 0) return cart.remove(key);
    write(
      read().map((line) => (line.key === key ? { ...line, qty: Math.min(MAX_QTY, qty) } : line)),
    );
  },
  remove(key: string) {
    write(read().filter((line) => line.key !== key));
  },
  clear() {
    write([]);
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    lines = null;
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useCartCount(): number {
  return useCart().reduce((sum, line) => sum + line.qty, 0);
}
