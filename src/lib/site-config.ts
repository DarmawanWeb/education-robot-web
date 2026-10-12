import { brand, names } from '@taksu/content';

/** Public configuration, inlined at build time from NEXT_PUBLIC_* variables. */
export const siteConfig = {
  name: names.edu,
  url: process.env.NEXT_PUBLIC_EDU_URL ?? 'http://localhost:3003',
  simUrl: process.env.NEXT_PUBLIC_SIM_URL ?? 'http://localhost:3002',
  companyUrl: process.env.NEXT_PUBLIC_COMPANY_URL ?? 'http://localhost:3000',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  email: brand.contact.email,
} as const;
