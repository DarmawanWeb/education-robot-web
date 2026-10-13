import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/** Upload limits for one build. */
export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** Long edge of the stored photo and of the list thumbnail. */
const LARGE = 1600;
const SMALL = 640;

export type PhotoSize = 'lg' | 'sm';

export interface StoredPhoto {
  id: string;
  width: number;
  height: number;
}

export class PhotoError extends Error {
  constructor(public readonly code: 'type' | 'size' | 'unreadable') {
    super(code);
  }
}

export const mediaDir = (dataDir: string) => path.join(dataDir, 'media');

const fileName = (id: string, size: PhotoSize) => `${id}-${size}.webp`;

/** Only names this module writes are ever read back, which rules out path tricks. */
export const MEDIA_NAME = /^([0-9a-f-]{36})-(lg|sm)\.webp$/;

/**
 * Re-encodes an upload as WebP in two sizes. Re-encoding drops EXIF and other metadata,
 * including GPS positions from phone cameras, and rejects anything that is not an image.
 */
export async function storePhoto(
  dataDir: string,
  file: { type: string; size: number; bytes: ArrayBuffer },
): Promise<StoredPhoto> {
  if (!(PHOTO_TYPES as readonly string[]).includes(file.type)) throw new PhotoError('type');
  if (file.size > MAX_PHOTO_BYTES) throw new PhotoError('size');

  const input = Buffer.from(file.bytes);
  const id = randomUUID();
  const dir = mediaDir(dataDir);
  await mkdir(dir, { recursive: true });
  try {
    const base = sharp(input, { limitInputPixels: 48_000_000, failOn: 'error' }).rotate();
    const large = await base
      .clone()
      .resize({ width: LARGE, height: LARGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const small = await base
      .clone()
      .resize({ width: SMALL, height: SMALL, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();
    // Write under a temporary name first so a crash never leaves half a file in place.
    for (const [size, data] of [
      ['lg', large.data],
      ['sm', small],
    ] as const) {
      const target = path.join(dir, fileName(id, size));
      await writeFile(`${target}.tmp`, data);
      await rename(`${target}.tmp`, target);
    }
    return { id, width: large.info.width, height: large.info.height };
  } catch (error) {
    await removePhotos(dataDir, [id]);
    if (error instanceof PhotoError) throw error;
    throw new PhotoError('unreadable');
  }
}

export async function readPhoto(dataDir: string, name: string): Promise<Buffer | null> {
  if (!MEDIA_NAME.test(name)) return null;
  try {
    return await readFile(path.join(mediaDir(dataDir), name));
  } catch {
    return null;
  }
}

export async function removePhotos(dataDir: string, ids: string[]): Promise<void> {
  const dir = mediaDir(dataDir);
  await Promise.all(
    ids.flatMap((id) =>
      (['lg', 'sm'] as const).map((size) =>
        rm(path.join(dir, fileName(id, size)), { force: true }),
      ),
    ),
  );
}

/** Public URL of a stored photo. */
export const photoUrl = (id: string, size: PhotoSize) => `/api/lab/media/${fileName(id, size)}`;
