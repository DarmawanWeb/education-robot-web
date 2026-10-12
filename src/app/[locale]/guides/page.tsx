import { guides } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { GuideCard } from '@/components/guides/guide-card';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Guides' });
  return pageMetadata({
    locale,
    path: '/guides',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function GuidesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Guides');
  return (
    <>
      <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
        <Container>
          <SectionTitle as="h1" title={t('title')} intro={t('intro')} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <GuideCard guide={guide} locale={locale} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
