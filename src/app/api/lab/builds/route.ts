import { lab, limits } from '@/server/lab';
import { formFields, json, looksAutomated, sameOrigin } from '@/server/lab/http';
import {
  MAX_PHOTOS,
  PhotoError,
  removePhotos,
  type StoredPhoto,
  storePhoto,
} from '@/server/lab/media';
import { notifyModerators } from '@/server/lab/notify';
import { clientKey } from '@/server/lab/rate-limit';
import { createBuild } from '@/server/lab/repo';
import { buildSchema, fieldErrors } from '@/server/lab/validate';

export const dynamic = 'force-dynamic';

/** Four photos at 8 MB plus the text fields. Caddy enforces the same ceiling. */
const MAX_BODY_BYTES = 36 * 1024 * 1024;

/** A class submits a build: text plus one to four photos, held for moderation. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'origin' }, 403);
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return json({ error: 'tooLarge' }, 413);
  }
  const limit = limits.builds.check(clientKey(request.headers));
  if (!limit.allowed) {
    return json({ error: 'rateLimited' }, 429, { 'retry-after': String(limit.retryAfterSeconds) });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'invalid' }, 400);
  }
  const fields = formFields(form);
  // Pretend to accept what bots send, so they learn nothing from the response.
  if (looksAutomated(fields)) return json({ ok: true }, 201);

  const parsed = buildSchema.safeParse(fields);
  const files = form.getAll('photos').filter((value) => value instanceof File && value.size > 0);
  const errors: Record<string, string | undefined> = parsed.success
    ? {}
    : { ...fieldErrors(parsed.error) };
  if (files.length === 0) errors.photos = 'required';
  else if (files.length > MAX_PHOTOS) errors.photos = 'tooMany';
  if (!parsed.success || Object.keys(errors).length > 0) {
    return json({ error: 'fields', fields: errors }, 422);
  }

  const { config, db } = lab();
  const stored: StoredPhoto[] = [];
  try {
    for (const file of files as File[]) {
      stored.push(
        await storePhoto(config.dataDir, {
          type: file.type,
          size: file.size,
          bytes: await file.arrayBuffer(),
        }),
      );
    }
  } catch (error) {
    await removePhotos(
      config.dataDir,
      stored.map((photo) => photo.id),
    );
    if (error instanceof PhotoError) {
      return json({ error: 'fields', fields: { photos: `photo-${error.code}` } }, 422);
    }
    throw error;
  }

  const id = createBuild(db, parsed.data, stored);
  void notifyModerators(config.notifyUrl, `Karya baru menunggu: "${parsed.data.title}" (${id})`);
  return json({ ok: true }, 201);
}
