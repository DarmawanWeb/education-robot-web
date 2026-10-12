import { names } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { formatDate, getPost, posts } from '@/content/blog';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/site-config';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [locale, { slug }] = await Promise.all([localeFromParams(params), params]);
  const post = getPost(slug);
  if (!post) return {};
  const meta = post.meta[locale];
  const metadata = pageMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: meta.title,
    description: meta.summary,
  });
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: 'article', publishedTime: meta.date },
  };
}

export default async function PostPage({ params }: Props) {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const post = getPost(slug);
  if (!post) notFound();
  const [t, nav, kitT] = await Promise.all([
    getTranslations('Blog'),
    getTranslations('Nav'),
    getTranslations('Kit'),
  ]);
  const meta = post.meta[locale];
  const Body = post.Body[locale];
  const author = meta.author ?? t('team', { brand: names.edu });
  const others = posts.filter((entry) => entry.slug !== post.slug).slice(0, 2);
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.summary,
    datePublished: meta.date,
    inLanguage: locale,
    author: { '@type': 'Organization', name: author },
    publisher: { '@type': 'Organization', name: names.edu },
    mainEntityOfPage: `${siteConfig.url}/${locale}/blog/${post.slug}`,
  };

  return (
    <>
      <article className="pt-8 pb-16 sm:pt-10 lg:pb-24">
        <Container>
          <nav aria-label={kitT('breadcrumb')}>
            <ol className="text-muted-foreground flex flex-wrap gap-2 text-[0.95rem] font-semibold">
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {nav('blog')}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {meta.title}
              </li>
            </ol>
          </nav>
          <div className="mx-auto max-w-[44rem]">
            <h1 className="type-label mt-10 text-[clamp(2.2rem,5vw,3.6rem)] text-balance">
              {meta.title}
            </h1>
            <p className="text-muted-foreground mt-5 font-semibold">
              <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>,{' '}
              {t('readingTime', { count: meta.minutes })}, {author}
            </p>
            <p className="mt-6 text-xl leading-relaxed">{meta.summary}</p>
            <div className="border-edge mt-8 border-t-2 pt-2">
              <Body />
            </div>
          </div>
        </Container>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from our own post data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
        />
      </article>

      {others.length > 0 ? (
        <section className="pb-16 lg:pb-24">
          <Container>
            <h2 className="type-label text-3xl">{t('more')}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {others.map((entry) => (
                <li key={entry.slug}>
                  <article className="border-edge bg-surface relative flex h-full flex-col rounded-lg border-2 p-6 transition-shadow focus-within:shadow-[4px_4px_0_0_var(--edge)] hover:shadow-[4px_4px_0_0_var(--edge)]">
                    <p className="text-muted-foreground text-[0.95rem] font-semibold">
                      <time dateTime={entry.meta[locale].date}>
                        {formatDate(entry.meta[locale].date, locale)}
                      </time>
                    </p>
                    <h3 className="mt-3 text-xl leading-snug font-bold">
                      <Link
                        href={`/blog/${entry.slug}`}
                        className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
                      >
                        {entry.meta[locale].title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mt-2">{entry.meta[locale].summary}</p>
                  </article>
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
