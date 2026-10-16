import { type ProductKind, pick, productKindLabels, products } from '@taksu/catalog';
import { Button } from '@taksu/edu-ui/components/button';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/products/product-card';
import { Container } from '@/components/ui/container';
import { TextLink } from '@/components/ui/text-link';
import { contactHref } from '@/lib/contact';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

const KINDS = Object.keys(productKindLabels) as ProductKind[];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Accessories' });
  return pageMetadata({ locale, path: '/aksesori', title: t('title'), description: t('intro') });
}

export default async function AccessoriesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Accessories');
  const groups = KINDS.map((kind) => ({
    kind,
    items: products.filter((product) => product.kind === kind),
  })).filter((group) => group.items.length > 0);
  const allSoon = products.every((product) => product.availability === 'soon');

  return (
    <>
      <section className="pt-14 pb-14 lg:pt-20 lg:pb-16">
        <Container>
          <h1 className="type-display text-[clamp(2.5rem,6vw,4.5rem)]">{t('title')}</h1>
          <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-relaxed">
            {t('intro')}
          </p>
          <nav aria-label={t('jump')} className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <li key={group.kind}>
                  <a
                    href={`#${group.kind}`}
                    className="bg-surface hover:bg-surface-muted inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.95rem] font-bold"
                  >
                    {pick(productKindLabels[group.kind], locale)}
                    <span className="text-muted-foreground tabular-nums">{group.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {allSoon ? (
            <div className="border-l-accent bg-surface mt-10 flex flex-col gap-5 rounded-lg border border-l-[6px] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">{t('soon.title')}</h2>
                <p className="text-muted-foreground mt-1">{t('soon.body')}</p>
              </div>
              <Button asChild variant="ink" size="lg">
                <a href={contactHref(t('soon.message'), t('soon.subject'))}>{t('soon.action')}</a>
              </Button>
            </div>
          ) : null}
        </Container>
      </section>

      {groups.map((group) => (
        <section
          key={group.kind}
          id={group.kind}
          aria-labelledby={`${group.kind}-title`}
          className="scroll-mt-16 border-t py-14 lg:py-20"
        >
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
              <div className="max-w-[46rem]">
                <h2
                  id={`${group.kind}-title`}
                  className="type-display text-[clamp(1.75rem,3.2vw,2.5rem)]"
                >
                  {pick(productKindLabels[group.kind], locale)}
                </h2>
                <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                  {t(`kinds.${group.kind}`)}
                </p>
              </div>
              {group.kind === 'sekolah' ? (
                <TextLink href="/bisnis#beli-banyak">{t('school')}</TextLink>
              ) : null}
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}
    </>
  );
}
