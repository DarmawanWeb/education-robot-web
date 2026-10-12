import { educationLevels, getLevel, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KitContents } from '@/components/kits/kit-contents';
import { KitHero } from '@/components/kits/kit-hero';
import { KitMedia } from '@/components/kits/kit-media';
import { KitSpecs } from '@/components/kits/kit-specs';
import { CtaBand } from '@/components/shared/cta-band';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; kit: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return educationLevels.map((level) => ({ kit: level.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [locale, { kit }] = await Promise.all([localeFromParams(params), params]);
  const level = getLevel(kit);
  if (!level) return {};
  return pageMetadata({
    locale,
    path: `/kits/${level.slug}`,
    title: `${level.kit}: ${pick(level.tagline, locale)}`,
    description: pick(level.summary, locale),
  });
}

export default async function KitPage({ params }: Props) {
  const [locale, { kit }] = await Promise.all([resolveLocale(params), params]);
  const level = getLevel(kit);
  if (!level) notFound();

  return (
    <>
      <KitHero level={level} locale={locale} />
      <KitSpecs level={level} locale={locale} />
      <KitContents level={level} locale={locale} />
      <KitMedia level={level} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
