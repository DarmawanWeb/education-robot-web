import { educationLevels, getLevel, guides, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { GuideCard } from '@/components/guides/guide-card';
import { KitAddons } from '@/components/kits/kit-addons';
import { KitBench } from '@/components/kits/kit-bench';
import { KitContents } from '@/components/kits/kit-contents';
import { KitHero } from '@/components/kits/kit-hero';
import { KitMedia } from '@/components/kits/kit-media';
import { KitSpecs } from '@/components/kits/kit-specs';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
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
  const t = await getTranslations('Kit');
  const kitGuides = guides.filter((guide) => guide.levels.includes(level.slug));

  return (
    <>
      <KitHero level={level} locale={locale} />
      <KitSpecs level={level} locale={locale} />
      <KitContents level={level} locale={locale} />
      <KitMedia level={level} locale={locale} />
      <KitBench level={level} locale={locale} />
      <KitAddons level={level} locale={locale} />
      {kitGuides.length > 0 ? (
        <section className="pb-16 lg:pb-24">
          <Container>
            <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">
              {t('guides', { kit: level.kit })}
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {kitGuides.map((guide) => (
                <li key={guide.slug}>
                  <GuideCard guide={guide} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
      <CtaBand locale={locale} />
    </>
  );
}
