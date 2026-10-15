import { mailtoUrl, whatsappUrl } from './links';

/** WhatsApp when a number is configured, otherwise an email with the same message. */
export function contactHref(message: string, subject: string): string {
  return whatsappUrl(message) ?? mailtoUrl(subject, message);
}
