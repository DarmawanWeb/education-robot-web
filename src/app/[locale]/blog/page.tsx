import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { formatDate, posts } from '@/content/blog';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Blog' });
  return pageMetadata({
    locale,
    path: '/blog',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function BlogPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Blog');

  return (
    <>
      <section className="pt-12 pb-10 sm:pt-16">
        <Container>
          <h1 className="type-label max-w-[18ch] text-[clamp(2.4rem,5.6vw,4.2rem)] text-balance">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-[62ch] text-xl leading-relaxed">
            {t('intro')}
          </p>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container>
          <ol className="border-edge border-t-2">
            {posts.map((post) => {
              const meta = post.meta[locale];
              return (
                <li key={post.slug} className="border-border border-b">
                  <article className="grid gap-2 py-8 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
                    <p className="text-muted-foreground font-semibold">
                      <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>
                    </p>
                    <div>
                      <h2 className="text-2xl leading-snug font-bold">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="decoration-primary decoration-2 underline-offset-4 hover:underline"
                        >
                          {meta.title}
                        </Link>
                      </h2>
                      <p className="text-muted-foreground mt-2 max-w-[62ch] text-lg leading-relaxed">
                        {meta.summary}
                      </p>
                      <p className="text-muted-foreground mt-3 text-sm font-semibold">
                        {t('readingTime', { count: meta.minutes })}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
