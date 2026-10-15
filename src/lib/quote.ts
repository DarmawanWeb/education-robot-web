/** What a business buyer needs; the form's first question. */
export const quoteKinds = ['bulk', 'oem', 'other'] as const;
export type QuoteKind = (typeof quoteKinds)[number];

export const quoteQuantities = ['small', 'medium', 'large', 'xl'] as const;
export type QuoteQuantity = (typeof quoteQuantities)[number];

export const isQuoteKind = (value: string): value is QuoteKind =>
  (quoteKinds as readonly string[]).includes(value);

/** The quote request as the buyer filled it in, with choices already turned into words. */
export interface QuoteFields {
  kind: string;
  org: string;
  name: string;
  phone: string;
  city: string;
  robots: string;
  quantity: string;
  message: string;
}

const ORDER = ['kind', 'org', 'name', 'phone', 'city', 'robots', 'quantity', 'message'] as const;

type QuoteKey = 'greeting' | 'subject' | (typeof ORDER)[number];

/** The Business.quote messages, passed in so the wording stays in the message files. */
export type QuoteTranslate = (key: QuoteKey, values?: Record<string, string | number>) => string;

/** The request as one message for WhatsApp or an email body, skipping anything left empty. */
export function buildQuote(
  fields: QuoteFields,
  t: QuoteTranslate,
): { text: string; subject: string } {
  const lines = ORDER.filter((key) => fields[key].trim()).map((key) =>
    t(key, { value: fields[key].trim() }),
  );
  return {
    text: [t('greeting'), '', ...lines].join('\n'),
    subject: t('subject', { name: fields.name.trim() }),
  };
}
