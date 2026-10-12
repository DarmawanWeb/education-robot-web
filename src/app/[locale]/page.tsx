import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/home/hero';
import { KitShelf } from '@/components/home/kit-shelf';
import { PathSection } from '@/components/home/path-section';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return pageMetadata({ locale, path: '/', description: t('description') });
}

export default async function HomePage({ params }: Props) {
  const locale = await resolveLocale(params);
  return (
    <>
      <Hero locale={locale} />
      <KitShelf locale={locale} />
      <PathSection />
    </>
  );
}
