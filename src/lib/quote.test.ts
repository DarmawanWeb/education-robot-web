import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import { buildQuote, isQuoteKind, type QuoteTranslate } from './quote';

const t: QuoteTranslate = (key, values = {}) =>
  en.Business.quote[key].replace(/\{(\w+)\}/g, (_, name: string) => String(values[name]));

describe('quote request', () => {
  it('keeps the fields in order and skips empty ones', () => {
    const { text, subject } = buildQuote(
      {
        kind: 'A bulk order',
        org: 'SD Harapan',
        name: 'Made',
        phone: '0812',
        city: '',
        robots: 'Ciko and Momo',
        quantity: '10 to 30',
        message: '  ',
      },
      t,
    );
    expect(text).toBe(
      [
        'Hi ULIK, I would like a quote.',
        '',
        'Need: A bulk order',
        'Organisation: SD Harapan',
        'Name: Made',
        'WhatsApp: 0812',
        'Robots: Ciko and Momo',
        'Quantity: 10 to 30',
      ].join('\n'),
    );
    expect(subject).toBe('Quote request from Made');
  });

  it('recognises the kinds a link can preselect', () => {
    expect(isQuoteKind('oem')).toBe(true);
    expect(isQuoteKind('tanya')).toBe(false);
  });
});
