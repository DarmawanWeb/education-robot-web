import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MAX_PHOTO_BYTES, PhotoError, readPhoto, removePhotos, storePhoto } from './media';

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'lab-media-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

const toArrayBuffer = (buffer: Buffer) =>
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

describe('storePhoto', () => {
  it('re-encodes to WebP in two sizes and drops EXIF', async () => {
    const jpeg = await sharp({
      create: { width: 2400, height: 1200, channels: 3, background: '#26a' },
    })
      .jpeg()
      .withExif({ IFD0: { Copyright: 'Kelas 5A', Software: 'test' } })
      .toBuffer();
    expect((await sharp(jpeg).metadata()).exif).toBeDefined();

    const stored = await storePhoto(dir, {
      type: 'image/jpeg',
      size: jpeg.length,
      bytes: toArrayBuffer(jpeg),
    });
    expect(stored).toMatchObject({ width: 1600, height: 800 });

    const large = await readPhoto(dir, `${stored.id}-lg.webp`);
    const small = await readPhoto(dir, `${stored.id}-sm.webp`);
    expect(large && (await sharp(large).metadata())).toMatchObject({ format: 'webp', width: 1600 });
    expect(large && (await sharp(large).metadata()).exif).toBeUndefined();
    expect(small && (await sharp(small).metadata()).width).toBe(640);

    await removePhotos(dir, [stored.id]);
    expect(await readPhoto(dir, `${stored.id}-lg.webp`)).toBeNull();
  });

  it('refuses other types, oversized files, and broken images', async () => {
    const bytes = new ArrayBuffer(8);
    await expect(storePhoto(dir, { type: 'image/gif', size: 8, bytes })).rejects.toThrow(
      PhotoError,
    );
    await expect(
      storePhoto(dir, { type: 'image/png', size: MAX_PHOTO_BYTES + 1, bytes }),
    ).rejects.toThrow('size');
    await expect(storePhoto(dir, { type: 'image/png', size: 8, bytes })).rejects.toThrow(
      'unreadable',
    );
  });

  it('never reads names it did not write', async () => {
    expect(await readPhoto(dir, '../lab.db')).toBeNull();
    expect(await readPhoto(dir, 'abc.webp')).toBeNull();
  });
});
