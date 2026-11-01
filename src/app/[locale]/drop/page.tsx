import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DropSteps, NextDropCard, nextDrop } from '@/components/shared/drop-band';
import { Container } from '@/components/ui/container';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'DropPage' });
  return pageMetadata({ locale, path: '/drop', title: t('title'), description: t('intro') });
}

export default async function DropPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('DropPage');
  const drop = nextDrop();

  return (
    <>
      <section className="asphalt py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <div>
            <h1 className="type-display text-[clamp(2.5rem,6vw,4.5rem)] text-white">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-white/75">{t('intro')}</p>
            <h2 className="mt-12 text-xl font-bold text-white">{t('how')}</h2>
            <DropSteps locale={locale} className="mt-6" />
          </div>
          {drop ? <NextDropCard drop={drop} locale={locale} /> : null}
        </Container>
      </section>
    </>
  );
}
