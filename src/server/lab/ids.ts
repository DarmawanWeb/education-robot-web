import { randomBytes } from 'node:crypto';

const ALPHABET = '0123456789abcdefghijkmnopqrstuvwxyz';

/** Short random id for URLs, e.g. "k3m9x2pq7d". 36^10 is plenty for a moderated site. */
export function newId(length = 10): string {
  const bytes = randomBytes(length);
  let id = '';
  for (const byte of bytes) id += ALPHABET[byte % ALPHABET.length];
  return id;
}

export const ID_PATTERN = /^[0-9a-z]{6,16}$/;
