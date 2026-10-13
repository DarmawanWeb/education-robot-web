import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySession } from './auth';
import type { LabConfig } from './config';

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store', ...headers } });

/**
 * Lab forms post with fetch, which always sends Origin. Requiring it to match the host stops
 * other sites from posting on a visitor's behalf.
 */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Strings from a form, ignoring files. */
export function formFields(form: FormData): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string' && !(key in fields)) fields[key] = value;
  }
  return fields;
}

/** Bots fill the hidden field or submit within a moment of loading the form. */
export function looksAutomated(fields: Record<string, unknown>, now = Date.now()): boolean {
  if (typeof fields.website === 'string' && fields.website.trim() !== '') return true;
  const startedAt = Number(fields.startedAt);
  return !Number.isFinite(startedAt) || now - startedAt < 2500;
}

export async function isAdmin(config: LabConfig): Promise<boolean> {
  if (!config.adminPassword) return false;
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value, config.secret);
}
