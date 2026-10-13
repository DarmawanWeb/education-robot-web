import { type LabKit, labKits } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BuildCard } from '@/components/lab/build-card';
import { toBuildCard } from '@/components/lab/cards';
import { ActionLink } from '@/components/ui/action-link';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { lab } from '@/server/lab';
import { listBuilds } from '@/server/lab/repo';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kit?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Lab.builds' });
  return pageMetadata({
    locale,
    path: '/lab/builds',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function BuildsPage({ params, searchParams }: Props) {
  const [locale, query] = await Promise.all([resolveLocale(params), searchParams]);
  const t = await getTranslations('Lab');
  const kit = (labKits as readonly string[]).includes(query.kit ?? '')
    ? (query.kit as LabKit)
    : undefined;
  const builds = listBuilds(lab().db, { kit, limit: 120 });
  const chip = (active: boolean) =>
    cn(
      'border-edge inline-flex min-h-10 items-center rounded-md border-2 px-4 font-semibold',
      active ? 'bg-ink text-ink-foreground' : 'bg-surface hover:bg-surface-muted',
    );

  return (
    <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle as="h1" title={t('builds.title')} intro={t('builds.intro')} />
          <ActionLink href="/lab/submit" className="shrink-0 self-start lg:self-end">
            {t('builds.submit')}
          </ActionLink>
        </div>
        <nav aria-label={t('builds.filter')} className="mt-10">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/lab/builds"
                aria-current={!kit ? 'page' : undefined}
                className={chip(!kit)}
              >
                {t('builds.all')}
              </Link>
            </li>
            {labKits.map((value) => (
              <li key={value}>
                <Link
                  href={{ pathname: '/lab/builds', query: { kit: value } }}
                  aria-current={kit === value ? 'page' : undefined}
                  className={chip(kit === value)}
                >
                  {t(`kits.${value}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {builds.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => (
              <li key={build.id}>
                <BuildCard build={toBuildCard(build, t, locale)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground mt-10 text-lg">{t('builds.empty')}</p>
        )}
      </Container>
    </section>
  );
}
