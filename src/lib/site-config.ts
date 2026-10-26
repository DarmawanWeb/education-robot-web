import { brand, type SellerId } from '@dctedu/catalog';

/** Public configuration, inlined at build time from NEXT_PUBLIC_* variables. */
export const siteConfig = {
  name: brand.name,
  url: process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:3000',
  simUrl: process.env.NEXT_PUBLIC_SIMULATOR_URL || 'http://localhost:3001',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  email: process.env.NEXT_PUBLIC_EMAIL || brand.contact.email,
  /** Our store pages on each marketplace; empty until the store exists. */
  stores: {
    tokopedia: process.env.NEXT_PUBLIC_TOKOPEDIA_URL || '',
    shopee: process.env.NEXT_PUBLIC_SHOPEE_URL || '',
  },
  /**
   * How to reach each exclusive seller. The robot pages use WhatsApp when a number is set, then
   * email, then the website; with none set, the question comes to us and we pass it on.
   */
  sellers: {
    ezra: {
      whatsappNumber: process.env.NEXT_PUBLIC_EZRA_WHATSAPP_NUMBER || '',
      email: process.env.NEXT_PUBLIC_EZRA_EMAIL || '',
      url: process.env.NEXT_PUBLIC_EZRA_URL || '',
    },
  } satisfies Record<SellerId, { whatsappNumber: string; email: string; url: string }>,
} as const;
