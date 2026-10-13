import { lab, limits } from '@/server/lab';
import { json, looksAutomated, sameOrigin } from '@/server/lab/http';
import { notifyModerators } from '@/server/lab/notify';
import { clientKey } from '@/server/lab/rate-limit';
import { createThread } from '@/server/lab/repo';
import { fieldErrors, threadSchema } from '@/server/lab/validate';

export const dynamic = 'force-dynamic';

/** A new forum question, held for moderation. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'origin' }, 403);
  const limit = limits.threads.check(clientKey(request.headers));
  if (!limit.allowed) {
    return json({ error: 'rateLimited' }, 429, { 'retry-after': String(limit.retryAfterSeconds) });
  }
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'invalid' }, 400);
  if (looksAutomated(body as Record<string, unknown>)) return json({ ok: true }, 201);

  const parsed = threadSchema.safeParse(body);
  if (!parsed.success) return json({ error: 'fields', fields: fieldErrors(parsed.error) }, 422);

  const { config, db } = lab();
  const id = createThread(db, parsed.data);
  void notifyModerators(
    config.notifyUrl,
    `Pertanyaan baru menunggu: "${parsed.data.title}" (${id})`,
  );
  return json({ ok: true }, 201);
}
