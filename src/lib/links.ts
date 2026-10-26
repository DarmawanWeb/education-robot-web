import {
  type Locale,
  type Marketplace,
  type MarketplaceLinks,
  marketplaces,
  type SimRobot,
} from '@dctedu/catalog';
import { siteConfig } from './site-config';

const trimSlash = (url: string) => url.replace(/\/+$/, '');

/** Simulator deep link, optionally opening a robot and a mission. */
export function simulatorUrl(locale: Locale, robot?: SimRobot, mission?: string): string {
  const query = new URLSearchParams();
  if (robot) query.set('robot', robot);
  if (mission) query.set('mission', mission);
  const search = query.toString();
  return `${trimSlash(siteConfig.simUrl)}/${locale}${search ? `?${search}` : ''}`;
}

/** wa.me link with a pre-filled message, or null when no number is configured. */
export function whatsappUrl(
  message: string,
  number: string = siteConfig.whatsappNumber,
): string | null {
  const digits = number.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject: string, body: string, to: string = siteConfig.email): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Where to buy an item on each marketplace: its own listing if it has one, otherwise our store
 * page there. Marketplaces with neither are left out, so no dead buttons appear.
 */
export function marketplaceLinks(item?: MarketplaceLinks): { id: Marketplace; url: string }[] {
  return marketplaces.flatMap((id) => {
    const url = item?.[id] || siteConfig.stores[id];
    return url ? [{ id, url }] : [];
  });
}
