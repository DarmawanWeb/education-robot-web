import type { Locale } from '@taksu/content';
import { siteConfig } from './site-config';

const trimSlash = (url: string) => url.replace(/\/+$/, '');

/** Simulator deep link, optionally opening a robot and mission. */
export function simulatorUrl(locale: Locale, robot?: 'sd' | 'smp', mission?: string): string {
  const query = new URLSearchParams();
  if (robot) query.set('robot', robot);
  if (mission) query.set('mission', mission);
  const search = query.toString();
  return `${trimSlash(siteConfig.simUrl)}/${locale}${search ? `?${search}` : ''}`;
}

export function companyUrl(locale: Locale, path = ''): string {
  return `${trimSlash(siteConfig.companyUrl)}/${locale}${path}`;
}

/** wa.me deep link with a pre-filled message, or null when no number is configured. */
export function whatsappUrl(
  message: string,
  number: string = siteConfig.whatsappNumber,
): string | null {
  const digits = number.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
