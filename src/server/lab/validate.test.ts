import { describe, expect, it } from 'vitest';
import {
  buildSchema,
  cleanText,
  fieldErrors,
  replySchema,
  threadSchema,
  tooFast,
  youtubeId,
} from './validate';

const build = {
  title: 'Robot pengantar surat',
  kit: 'sd',
  summary: 'Robot mengikuti garis lalu berhenti di kotak surat.',
  author: 'Kelas 5A',
  role: 'teacher',
  consent: 'on',
  startedAt: '1',
  locale: 'id',
};

describe('cleanText', () => {
  it('collapses whitespace on one line and drops invisible characters', () => {
    expect(cleanText('  Robot​   pengantar\t surat \n ')).toBe('Robot pengantar surat');
  });

  it('keeps paragraphs but no more than one blank line', () => {
    expect(cleanText('Satu\r\n\r\n\r\n\r\nDua  \nTiga', true)).toBe('Satu\n\nDua\nTiga');
  });
});

describe('youtubeId', () => {
  it('reads the common link shapes', () => {
    for (const link of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ&t=10',
      'https://youtu.be/dQw4w9WgXcQ?si=abc',
      'https://youtube.com/shorts/dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    ]) {
      expect(youtubeId(link), link).toBe('dQw4w9WgXcQ');
    }
  });

  it('rejects other sites and malformed ids', () => {
    expect(youtubeId('https://vimeo.com/123456')).toBeNull();
    expect(youtubeId('https://youtube.com/watch?v=short')).toBeNull();
    expect(youtubeId('https://evil.example/youtube.com/watch?v=dQw4w9WgXcQ')).toBeNull();
  });
});

describe('buildSchema', () => {
  it('accepts a complete build and keeps the video id', () => {
    const result = buildSchema.safeParse({
      ...build,
      challenge: 'sd-pengantar-surat',
      video: 'https://youtu.be/dQw4w9WgXcQ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.videoId).toBe('dQw4w9WgXcQ');
      expect(result.data.challenge).toBe('sd-pengantar-surat');
    }
  });

  it('needs consent and a title', () => {
    const result = buildSchema.safeParse({ ...build, title: ' ', consent: undefined });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toMatchObject({ title: 'required', consent: 'consent' });
    }
  });

  it('only accepts a challenge made for the same kit', () => {
    const result = buildSchema.safeParse({ ...build, challenge: 'smp-tepuk' });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).challenge).toBe('invalid');
  });

  it('rejects filled honeypots and non-YouTube videos', () => {
    const result = buildSchema.safeParse({ ...build, website: 'spam', video: 'vimeo.com/1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error)).toMatchObject({
        website: 'invalid',
        video: 'invalidVideo',
      });
    }
  });
});

describe('threads and replies', () => {
  it('limits links to keep spam out', () => {
    const result = threadSchema.safeParse({
      category: 'sd',
      title: 'Sensor garis membaca nat ubin',
      body: 'Lihat https://a.example dan https://b.example juga https://c.example ya.',
      author: 'Bu Sari',
      role: 'teacher',
      startedAt: '1',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).body).toBe('tooManyLinks');
  });

  it('accepts a short reply', () => {
    expect(
      replySchema.safeParse({
        body: 'Coba kalibrasi ulang.',
        author: 'Pak Made',
        role: 'teacher',
        startedAt: '1',
      }).success,
    ).toBe(true);
  });
});

describe('tooFast', () => {
  it('flags forms sent within a couple of seconds', () => {
    expect(tooFast(10_000, 11_000)).toBe(true);
    expect(tooFast(10_000, 20_000)).toBe(false);
    expect(tooFast(Number.NaN, 20_000)).toBe(true);
  });
});
