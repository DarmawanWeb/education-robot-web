import type { SellerId } from '@dctedu/catalog';
import { mailtoUrl, whatsappUrl } from './links';
import { siteConfig } from './site-config';

/** WhatsApp when a number is configured, otherwise an email with the same message. */
export function contactHref(message: string, subject: string): string {
  return whatsappUrl(message) ?? mailtoUrl(subject, message);
}

/**
 * Where a question about a robot goes when an exclusive seller sells it: the seller's WhatsApp,
 * email, or website, in that order, or ours when none is configured.
 */
export function sellerHref(seller: SellerId, message: string, subject: string): string {
  const contact = siteConfig.sellers[seller];
  return (
    whatsappUrl(message, contact.whatsappNumber) ??
    (contact.email ? mailtoUrl(subject, message, contact.email) : null) ??
    (contact.url || contactHref(message, subject))
  );
}
