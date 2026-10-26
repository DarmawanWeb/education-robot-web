import { brand } from '@dctedu/catalog';

/** Public configuration, inlined at build time from NEXT_PUBLIC_* variables. */
export const siteConfig = {
  name: brand.name,
  url: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3003',
  simUrl: process.env.NEXT_PUBLIC_SIM_URL || 'http://localhost:3002',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  email: process.env.NEXT_PUBLIC_EMAIL || brand.contact.email,
  /** Our store pages on each marketplace; empty until the store exists. */
  stores: {
    tokopedia: process.env.NEXT_PUBLIC_TOKOPEDIA_URL || '',
    shopee: process.env.NEXT_PUBLIC_SHOPEE_URL || '',
  },
} as const;
