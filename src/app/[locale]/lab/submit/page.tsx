import { labChallenges, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BuildForm } from '@/components/lab/build-form';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ challenge?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Lab.submit' });
  return pageMetadata({
    locale,
    path: '/lab/submit',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function SubmitPage({ params, searchParams }: Props) {
  const [locale, query] = await Promise.all([resolveLocale(params), searchParams]);
  const t = await getTranslations('Lab');
  const rules = ['review', 'faces', 'contact'] as const;

  return (
    <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="max-w-3xl">
          <SectionTitle as="h1" title={t('submit.title')} intro={t('submit.intro')} />
          <div className="mt-10">
            <BuildForm
              locale={locale}
              initialChallenge={query.challenge}
              challenges={labChallenges.map((challenge) => ({
                id: challenge.id,
                kit: challenge.kit,
                title: pick(challenge.title, locale),
              }))}
            />
          </div>
        </div>
        <aside className="lg:pt-28">
          <div className="border-edge rounded-lg border-2 p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold">{t('rules.title')}</h2>
            <ul className="mt-3 flex flex-col gap-3 text-[0.95rem] leading-relaxed">
              {rules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span
                    aria-hidden
                    className="bg-primary mt-[0.55em] size-2 shrink-0 rounded-[2px]"
                  />
                  {t(`rules.${rule}`)}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
    </section>
  );
}
