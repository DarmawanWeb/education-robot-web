import { describe, expect, it } from 'vitest';
import { createSession, passwordMatches, SESSION_SECONDS, verifySession } from './auth';

describe('admin session', () => {
  it('accepts its own cookie until it expires', () => {
    const now = Date.UTC(2026, 9, 13);
    const cookie = createSession('secret', now);
    expect(verifySession(cookie, 'secret', now + 60_000)).toBe(true);
    expect(verifySession(cookie, 'secret', now + (SESSION_SECONDS + 1) * 1000)).toBe(false);
  });

  it('rejects tampered or foreign cookies', () => {
    const cookie = createSession('secret');
    const [expires, signature] = cookie.split('.');
    expect(verifySession(`${Number(expires) + 999}.${signature}`, 'secret')).toBe(false);
    expect(verifySession(cookie, 'other secret')).toBe(false);
    expect(verifySession(undefined, 'secret')).toBe(false);
    expect(verifySession('garbage', 'secret')).toBe(false);
  });

  it('checks the password and stays locked without one', () => {
    expect(passwordMatches('kopi', 'kopi')).toBe(true);
    expect(passwordMatches('teh', 'kopi')).toBe(false);
    expect(passwordMatches('', null)).toBe(false);
  });
});
