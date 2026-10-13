import {
  forumCategories,
  getLabChallenge,
  type LabKit,
  type LabRole,
  labKits,
  labRoles,
} from '@taksu/content';
import { z } from 'zod';

/** Error codes the forms translate into messages. */
export type FieldError =
  | 'required'
  | 'tooShort'
  | 'tooLong'
  | 'tooManyLinks'
  | 'invalid'
  | 'invalidVideo'
  | 'consent';

export type FieldErrors = Partial<Record<string, FieldError>>;

/** Forms filled in faster than this are almost always bots. */
export const MIN_FILL_MS = 2500;
/** Links allowed in one post before it is treated as spam. */
export const MAX_LINKS = 2;

/**
 * Normalises user text: NFC, Unix newlines, no control or invisible formatting characters.
 * Single-line fields collapse all whitespace; multi-line fields keep at most one blank line.
 */
export function cleanText(value: string, multiline = false): string {
  const lines = value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) =>
      line
        .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
        .replace(/ {2,}/g, ' ')
        .trimEnd(),
    );
  if (!multiline) return lines.join(' ').replace(/\s+/g, ' ').trim();
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function countLinks(text: string): number {
  return text.match(/https?:\/\/|www\./gi)?.length ?? 0;
}

/** The 11-character id from any common YouTube link, or null. */
export function youtubeId(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, '');
  let id: string | null = null;
  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    id =
      url.pathname === '/watch'
        ? url.searchParams.get('v')
        : (url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? null);
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

const line = (min: number, max: number) =>
  z
    .string()
    .default('')
    .transform((value) => cleanText(value))
    .pipe(
      min > 0
        ? z.string().min(1, 'required').min(min, 'tooShort').max(max, 'tooLong')
        : z.string().max(max, 'tooLong'),
    );

const paragraph = (min: number, max: number) =>
  z
    .string()
    .default('')
    .transform((value) => cleanText(value, true))
    .pipe(
      (min > 0
        ? z.string().min(1, 'required').min(min, 'tooShort').max(max, 'tooLong')
        : z.string().max(max, 'tooLong')
      ).refine((value) => countLinks(value) <= MAX_LINKS, 'tooManyLinks'),
    );

const role = z.enum(labRoles as [LabRole, ...LabRole[]], 'required');

/** Hidden fields every Lab form carries. */
const guard = {
  /** Honeypot: people never see this field, bots fill it in. */
  website: z.string().max(0, 'invalid').default(''),
  startedAt: z.coerce.number('invalid').int('invalid'),
  locale: z.enum(['id', 'en']).default('id'),
};

export const buildSchema = z
  .object({
    title: line(3, 80),
    kit: z.enum(labKits as [LabKit, ...LabKit[]], 'required'),
    challenge: z.string().default(''),
    summary: paragraph(10, 600),
    changes: paragraph(0, 600),
    video: z
      .string()
      .default('')
      .refine((value) => !value.trim() || youtubeId(value) !== null, 'invalidVideo'),
    author: line(2, 60),
    school: line(0, 100),
    city: line(0, 60),
    role,
    contact: line(0, 100),
    consent: z.literal(['on', 'true'], 'consent'),
    ...guard,
  })
  .superRefine((value, context) => {
    if (value.challenge) {
      const challenge = getLabChallenge(value.challenge);
      if (!challenge || challenge.kit !== value.kit) {
        context.addIssue({ code: 'custom', path: ['challenge'], message: 'invalid' });
      }
    }
  })
  .transform((value) => ({
    ...value,
    challenge: value.challenge || null,
    videoId: youtubeId(value.video),
  }));

export type BuildInput = z.output<typeof buildSchema>;

const categoryIds = forumCategories.map((category) => category.id) as [string, ...string[]];

export const threadSchema = z.object({
  category: z.enum(categoryIds, 'required'),
  title: line(8, 120),
  body: paragraph(10, 3000),
  author: line(2, 60),
  role,
  school: line(0, 100),
  contact: line(0, 100),
  ...guard,
});

export type ThreadInput = z.output<typeof threadSchema>;

export const replySchema = z.object({
  body: paragraph(2, 2000),
  author: line(2, 60),
  role,
  ...guard,
});

export type ReplyInput = z.output<typeof replySchema>;

/** First error per field, as codes the forms can translate. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? 'form');
    if (errors[field]) continue;
    const known: FieldError[] = [
      'required',
      'tooShort',
      'tooLong',
      'tooManyLinks',
      'invalid',
      'invalidVideo',
      'consent',
    ];
    errors[field] = known.includes(issue.message as FieldError)
      ? (issue.message as FieldError)
      : 'invalid';
  }
  return errors;
}

/** True when the form came back too fast to have been filled in by a person. */
export function tooFast(startedAt: number, now = Date.now()): boolean {
  return !Number.isFinite(startedAt) || now - startedAt < MIN_FILL_MS;
}
