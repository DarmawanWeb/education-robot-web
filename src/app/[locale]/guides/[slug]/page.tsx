import { educationLevels, getGuide, guides, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { GuideCard } from '@/components/guides/guide-card';
import { CtaBand } from '@/components/shared/cta-band';
import { Container } from '@/components/ui/container';
import { LevelChip } from '@/components/ui/level-chip';
import { Note } from '@/components/ui/note';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

const kitName = (slug: string) => educationLevels.find((level) => level.slug === slug)?.kit ?? slug;
const sectionId = (index: number) => `section-${index + 1}`;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [locale, { slug }] = await Promise.all([localeFromParams(params), params]);
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata({
    locale,
    path: `/guides/${guide.slug}`,
    title: pick(guide.title, locale),
    description: pick(guide.summary, locale),
  });
}

export default async function GuidePage({ params }: Props) {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const guide = getGuide(slug);
  if (!guide) notFound();
  const [t, common, nav, kitT] = await Promise.all([
    getTranslations('Guides'),
    getTranslations('Common'),
    getTranslations('Nav'),
    getTranslations('Kit'),
  ]);
  const related = guides
    .filter(
      (entry) =>
        entry.slug !== guide.slug && entry.levels.some((level) => guide.levels.includes(level)),
    )
    .slice(0, 3);

  return (
    <>
      <section className="pt-8 pb-12 sm:pt-10">
        <Container>
          <nav aria-label={kitT('breadcrumb')}>
            <ol className="text-muted-foreground flex flex-wrap gap-2 text-[0.95rem] font-semibold">
              <li>
                <Link
                  href="/guides"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {nav('guides')}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">
                {pick(guide.title, locale)}
              </li>
            </ol>
          </nav>
          <h1 className="type-label mt-8 max-w-[20ch] text-[clamp(2.4rem,5.6vw,4.2rem)] text-balance">
            {pick(guide.title, locale)}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-muted-foreground font-semibold">
              {t(`audience.${guide.audience}`)}, {common('minutes', { count: guide.minutes })}
            </span>
            {guide.levels.map((level) => (
              <LevelChip key={level} level={level}>
                {kitName(level)}
              </LevelChip>
            ))}
          </p>
          <p className="text-muted-foreground mt-5 max-w-[62ch] text-xl leading-relaxed">
            {pick(guide.summary, locale)}
          </p>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={pick(guide.title, locale)} className="hidden lg:block">
            <ol className="border-edge sticky top-28 flex flex-col gap-2 border-l-2 pl-4">
              {guide.sections.map((section, index) => (
                <li key={section.title.en}>
                  <a
                    href={`#${sectionId(index)}`}
                    className="text-muted-foreground hover:text-foreground font-semibold"
                  >
                    {index + 1}. {pick(section.title, locale)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="flex max-w-3xl flex-col gap-12">
            {guide.sections.map((section, index) => (
              <article key={section.title.en} id={sectionId(index)} className="scroll-mt-28">
                <h2 className="type-label flex items-baseline gap-4 text-[1.9rem]">
                  <span className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-black text-lg text-black">
                    {index + 1}
                  </span>
                  {pick(section.title, locale)}
                </h2>
                <ol className="marker:text-muted-foreground mt-5 flex list-decimal flex-col gap-3 pl-[4.4rem] text-lg leading-relaxed marker:font-semibold">
                  {section.steps.map((step) => (
                    <li key={step.en} className="pl-1">
                      {pick(step, locale)}
                    </li>
                  ))}
                </ol>
                {section.note ? (
                  <Note className="mt-6 ml-14">
                    <span className="font-bold">{t('note')}: </span>
                    {pick(section.note, locale)}
                  </Note>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="pb-16 lg:pb-24">
          <Container>
            <h2 className="type-label text-3xl">{t('related')}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <li key={entry.slug}>
                  <GuideCard guide={entry} locale={locale} />
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
