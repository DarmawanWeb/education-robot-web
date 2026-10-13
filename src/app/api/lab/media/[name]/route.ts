import { lab } from '@/server/lab';
import { isAdmin } from '@/server/lab/http';
import { MEDIA_NAME, readPhoto } from '@/server/lab/media';
import { photoOwner } from '@/server/lab/repo';

export const dynamic = 'force-dynamic';

const notFound = () => new Response('Not found', { status: 404 });

/** Photos of published builds are public; photos still in moderation are for moderators only. */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const match = MEDIA_NAME.exec(name);
  if (!match?.[1]) return notFound();

  const { config, db } = lab();
  const owner = photoOwner(db, match[1]);
  if (!owner) return notFound();
  const isPublic = owner.status === 'published';
  if (!isPublic && !(await isAdmin(config))) return notFound();

  const file = await readPhoto(config.dataDir, name);
  if (!file) return notFound();
  return new Response(new Uint8Array(file), {
    headers: {
      'content-type': 'image/webp',
      'content-length': String(file.length),
      'x-content-type-options': 'nosniff',
      'cache-control': isPublic ? 'public, max-age=31536000, immutable' : 'private, no-store',
    },
  });
}
