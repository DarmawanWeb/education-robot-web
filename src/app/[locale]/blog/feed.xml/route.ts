import { type Locale, names } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { posts } from '@/content/blog';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site-config';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const xmlEscape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RSS 2.0 feed of the blog in one language. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  const locale: Locale = requested === 'en' ? 'en' : 'id';
  const t = await getTranslations({ locale, namespace: 'Blog' });
  const home = `${siteConfig.url}/${locale}/blog`;
  const items = posts
    .map((post) => {
      const meta = post.meta[locale];
      const url = `${home}/${post.slug}`;
      return [
        '    <item>',
        `      <title>${xmlEscape(meta.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(`${meta.date}T08:00:00+07:00`).toUTCString()}</pubDate>`,
        `      <description>${xmlEscape(meta.summary)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${xmlEscape(t('feedTitle', { brand: names.edu }))}</title>`,
    `    <link>${home}</link>`,
    `    <description>${xmlEscape(t('metaDescription'))}</description>`,
    `    <language>${locale === 'id' ? 'id-ID' : 'en'}</language>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
