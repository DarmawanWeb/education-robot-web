import { educationLevels, names } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProposalForm } from '@/components/contact/proposal-form';
import { PilotSteps } from '@/components/schools/pilot-steps';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { whatsappUrl } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/site-config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return pageMetadata({
    locale,
    path: '/contact',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function ContactPage({ params }: Props) {
  await resolveLocale(params);
  const [t, home] = await Promise.all([
    getTranslations('Contact'),
    getTranslations('Home.schools'),
  ]);
  const whatsapp = whatsappUrl(names.edu);

  return (
    <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <SectionTitle as="h1" title={t('title')} intro={t('intro')} />
          <div className="box-ink bg-surface mt-10 rounded-lg p-6 sm:p-8">
            <ProposalForm
              email={siteConfig.email}
              whatsappNumber={siteConfig.whatsappNumber}
              kits={educationLevels.map((level) => level.kit)}
            />
          </div>
        </div>
        <aside className="flex flex-col gap-8 lg:pt-4">
          <div className="bg-surface-muted rounded-lg p-6 sm:p-8">
            <h2 className="type-label text-2xl">{t('direct.title')}</h2>
            <dl className="mt-5 flex flex-col gap-4">
              <div>
                <dt className="text-muted-foreground font-semibold">{t('direct.email')}</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="decoration-primary text-lg font-bold break-all underline decoration-2 underline-offset-4"
                  >
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              {whatsapp ? (
                <div>
                  <dt className="text-muted-foreground font-semibold">{t('direct.whatsapp')}</dt>
                  <dd>
                    <a
                      href={whatsapp}
                      className="decoration-primary text-lg font-bold underline decoration-2 underline-offset-4"
                    >
                      {siteConfig.whatsappNumber}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
          <div>
            <h2 className="type-label text-2xl">{home('title')}</h2>
            <p className="text-muted-foreground mt-2">{home('intro')}</p>
            <div className="mt-6">
              <PilotSteps stacked />
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}
