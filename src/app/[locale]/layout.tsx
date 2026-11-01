import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/anybody/wdth-italic.css';
import '@fontsource-variable/atkinson-hyperlegible-next';
import '../globals.css';

import { brand } from '@dctedu/catalog';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JsonLd } from '@/components/seo/json-ld';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';
import { organization, website } from '@/lib/structured-data';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('title', { brand: brand.name, company: brand.company }),
      template: `%s | ${brand.name}`,
    },
    description: t('description'),
    applicationName: brand.name,
    authors: [{ name: brand.company, url: siteConfig.url }],
    creator: brand.company,
    publisher: brand.company,
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('Nav');

  return (
    <html lang={locale}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="focus:bg-ink focus:text-ink-foreground sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
        >
          {t('skip')}
        </a>
        <JsonLd data={[organization(locale), website(locale)]} />
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
