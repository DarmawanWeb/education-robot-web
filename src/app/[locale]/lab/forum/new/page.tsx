import { forumCategories, isForumCategory, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ThreadForm } from '@/components/lab/thread-form';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Lab.newThread' });
  return {
    ...pageMetadata({
      locale,
      path: '/lab/forum/new',
      title: t('metaTitle'),
      description: t('intro'),
    }),
    robots: { index: false },
  };
}

export default async function NewThreadPage({ params, searchParams }: Props) {
  const [locale, query] = await Promise.all([resolveLocale(params), searchParams]);
  const t = await getTranslations('Lab');
  return (
    <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
      <Container>
        <div className="max-w-3xl">
          <SectionTitle as="h1" title={t('newThread.title')} intro={t('newThread.intro')} />
          <div className="mt-10">
            <ThreadForm
              locale={locale}
              initialCategory={
                query.category && isForumCategory(query.category) ? query.category : undefined
              }
              categories={forumCategories.map((category) => ({
                id: category.id,
                title: pick(category.title, locale),
              }))}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
