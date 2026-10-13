import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'taksu_lab_admin';
/** Moderators stay signed in for twelve hours. */
export const SESSION_SECONDS = 12 * 60 * 60;

const digest = (value: string) => createHash('sha256').update(value).digest();

/** Compares in constant time, whatever the lengths. */
export function passwordMatches(given: string, expected: string | null): boolean {
  if (!expected) return false;
  return timingSafeEqual(digest(given), digest(expected));
}

const sign = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

/** Cookie value "<expiry>.<signature>". */
export function createSession(secret: string, now = Date.now()): string {
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${sign(expires, secret)}`;
}

export function verifySession(
  value: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) * 1000 < now) return false;
  const expected = Buffer.from(sign(expires, secret));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
