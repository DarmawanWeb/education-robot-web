import { afterSales, competitions, customOptions, customPrograms, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ClassLayout } from '@/components/schools/class-layout';
import { PilotSteps } from '@/components/schools/pilot-steps';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Schools' });
  return pageMetadata({
    locale,
    path: '/schools',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function SchoolsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Schools');
  const list = new Intl.ListFormat(locale === 'en' ? 'en' : 'id', {
    style: 'long',
    type: 'disjunction',
  }).format(competitions);

  return (
    <>
      <section className="pt-12 pb-16 sm:pt-16 lg:pb-20">
        <Container>
          <SectionTitle as="h1" title={t('title')} intro={t('intro')} />
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <SectionTitle title={t('pilotTitle')} intro={t('pilotIntro')} />
          <div className="mt-10">
            <PilotSteps />
          </div>
        </Container>
      </section>

      <section className="bg-surface-muted py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div>
            <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('classTitle')}</h2>
            <p className="text-muted-foreground mt-4 max-w-[52ch] text-lg leading-relaxed">
              {t('classBody')}
            </p>
          </div>
          <ClassLayout />
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">{t('supportTitle')}</h2>
          <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {afterSales.map((item) => (
              <div key={item.id} className="border-edge border-t-2 pt-4">
                <dt className="text-lg font-bold">{pick(item.title, locale)}</dt>
                <dd className="text-muted-foreground mt-1">{pick(item.body, locale)}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <SectionTitle title={t('customTitle')} intro={t('customIntro')} />
          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="type-label text-2xl">{t('programsTitle')}</h3>
              <dl className="mt-5 flex flex-col gap-5">
                {customPrograms.map((item) => (
                  <div key={item.id}>
                    <dt className="text-lg font-bold">{pick(item.title, locale)}</dt>
                    <dd className="text-muted-foreground mt-1">{pick(item.body, locale)}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="box-ink-sm bg-surface rounded-lg p-6 sm:p-8">
              <h3 className="type-label text-2xl">{t('optionsTitle')}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {customOptions.map((item) => (
                  <li key={item.en} className="border-edge border-l-4 pl-4 font-semibold">
                    {pick(item, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <div className="border-edge flex flex-col gap-4 border-t-2 pt-10 lg:flex-row lg:items-baseline lg:gap-16">
            <h2 className="type-label shrink-0 text-[clamp(1.9rem,3.8vw,3rem)]">
              {t('competitionsTitle')}
            </h2>
            <p className="max-w-[56ch] text-lg leading-relaxed">
              {t('competitionsBody', { list })}
            </p>
          </div>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
