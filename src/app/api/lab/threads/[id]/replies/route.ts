import { lab, limits } from '@/server/lab';
import { json, looksAutomated, sameOrigin } from '@/server/lab/http';
import { ID_PATTERN } from '@/server/lab/ids';
import { notifyModerators } from '@/server/lab/notify';
import { clientKey } from '@/server/lab/rate-limit';
import { createReply, getThread } from '@/server/lab/repo';
import { fieldErrors, replySchema } from '@/server/lab/validate';

export const dynamic = 'force-dynamic';

/** A reply to a published thread, held for moderation. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return json({ error: 'origin' }, 403);
  const { id } = await params;
  if (!ID_PATTERN.test(id)) return json({ error: 'notFound' }, 404);
  const limit = limits.replies.check(clientKey(request.headers));
  if (!limit.allowed) {
    return json({ error: 'rateLimited' }, 429, { 'retry-after': String(limit.retryAfterSeconds) });
  }
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'invalid' }, 400);
  if (looksAutomated(body as Record<string, unknown>)) return json({ ok: true }, 201);

  const { config, db } = lab();
  const thread = getThread(db, id);
  if (thread?.status !== 'published') return json({ error: 'notFound' }, 404);
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) return json({ error: 'fields', fields: fieldErrors(parsed.error) }, 422);

  createReply(db, id, parsed.data);
  void notifyModerators(config.notifyUrl, `Balasan baru menunggu di "${thread.title}" (${id})`);
  return json({ ok: true }, 201);
}
