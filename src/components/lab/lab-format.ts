import type { Locale } from '@taksu/content';

/** "13 Okt 2026" or "13 Oct 2026", in Bali time. */
export function labDate(iso: string, locale: Locale | string): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Makassar',
  }).format(new Date(iso));
}

/** Plain text with line breaks, split into paragraphs for rendering. */
export function paragraphs(text: string): string[] {
  return text.split(/\n{2,}/).filter((part) => part.trim() !== '');
}
