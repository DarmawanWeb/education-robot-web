import { getLabChallenge, pick } from '@taksu/content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { KitChip } from '@/components/lab/kit-chip';
import { labDate, paragraphs } from '@/components/lab/lab-format';
import { LabVideo } from '@/components/lab/lab-video';
import { PhotoGallery } from '@/components/lab/photo-gallery';
import { ActionLink } from '@/components/ui/action-link';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/navigation';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/site-config';
import { lab } from '@/server/lab';
import { ID_PATTERN } from '@/server/lab/ids';
import { photoUrl } from '@/server/lab/media';
import { getBuild } from '@/server/lab/repo';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ locale: string; id: string }> };

function publishedBuild(id: string) {
  if (!ID_PATTERN.test(id)) return undefined;
  const build = getBuild(lab().db, id);
  return build?.status === 'published' ? build : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [locale, { id }] = await Promise.all([localeFromParams(params), params]);
  const build = publishedBuild(id);
  if (!build) return {};
  const metadata = pageMetadata({
    locale,
    path: `/lab/builds/${build.id}`,
    title: build.title,
    description: build.summary.slice(0, 160),
  });
  const cover = build.photos[0];
  return cover
    ? {
        ...metadata,
        openGraph: {
          ...metadata.openGraph,
          images: [
            {
              url: `${siteConfig.url}${photoUrl(cover.id, 'lg')}`,
              width: cover.width,
              height: cover.height,
            },
          ],
        },
      }
    : metadata;
}

export default async function BuildPage({ params }: Props) {
  const [locale, { id }] = await Promise.all([resolveLocale(params), params]);
  const build = publishedBuild(id);
  if (!build) notFound();
  const [t, nav, common] = await Promise.all([
    getTranslations('Lab'),
    getTranslations('Nav'),
    getTranslations('Common'),
  ]);
  const challenge = build.challenge ? getLabChallenge(build.challenge) : undefined;
  const place = [build.school, build.city].filter(Boolean).join(', ');

  return (
    <>
      <article className="pt-8 pb-16 sm:pt-10 lg:pb-20">
        <Container>
          <nav aria-label={t('build.breadcrumb')}>
            <ol className="text-muted-foreground flex flex-wrap gap-2 text-[0.95rem] font-semibold">
              <li>
                <Link
                  href="/lab"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {nav('lab')}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/lab/builds"
                  className="hover:text-foreground underline-offset-4 hover:underline"
                >
                  {t('builds.title')}
                </Link>
              </li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
            <div className="flex flex-col gap-8">
              <PhotoGallery
                title={build.title}
                photos={build.photos.map((photo) => ({
                  large: photoUrl(photo.id, 'lg'),
                  small: photoUrl(photo.id, 'sm'),
                  width: photo.width,
                  height: photo.height,
                }))}
              />
              {build.videoId ? (
                <section>
                  <h2 className="type-label mb-4 text-2xl">{t('build.video')}</h2>
                  <LabVideo
                    youtube={build.videoId}
                    title={build.title}
                    locale={locale}
                    labels={{
                      play: t('build.play'),
                      watch: t('build.watch'),
                      newTab: common('newTab'),
                    }}
                  />
                </section>
              ) : null}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <KitChip kit={build.kit} label={t(`kits.${build.kit}`)} />
                {challenge ? (
                  <span className="bg-accent rounded-sm px-2 py-0.5 text-sm font-bold text-black">
                    {t('challengeTag', { title: pick(challenge.title, locale) })}
                  </span>
                ) : null}
              </div>
              <h1 className="type-label mt-4 text-[clamp(2rem,4.4vw,3.2rem)] text-balance">
                {build.title}
              </h1>
              <p className="mt-4 text-lg font-semibold">
                {t('byline', {
                  author: build.author,
                  role: t(`roles.${build.role}`).toLowerCase(),
                })}
              </p>
              {place ? <p className="text-muted-foreground">{place}</p> : null}
              {build.publishedAt ? (
                <p className="text-muted-foreground mt-1 text-[0.95rem]">
                  {t('build.published', { date: labDate(build.publishedAt, locale) })}
                </p>
              ) : null}

              <h2 className="mt-8 text-xl font-bold">{t('build.does')}</h2>
              {paragraphs(build.summary).map((paragraph) => (
                <p key={paragraph} className="mt-3 text-lg leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
              {build.changes ? (
                <>
                  <h2 className="mt-8 text-xl font-bold">{t('build.changed')}</h2>
                  {paragraphs(build.changes).map((paragraph) => (
                    <p key={paragraph} className="mt-3 text-lg leading-relaxed whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </>
              ) : null}
              {challenge ? (
                <Link
                  href="/lab"
                  className="decoration-primary mt-8 inline-block font-bold underline decoration-2 underline-offset-4"
                >
                  {t('build.seeChallenge')}
                </Link>
              ) : null}
            </div>
          </div>
        </Container>
      </article>
      <section className="border-edge bg-surface-muted border-t-2 py-14">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="type-label text-2xl">{t('build.another')}</h2>
            <p className="text-muted-foreground mt-2 text-lg">{t('build.anotherBody')}</p>
          </div>
          <ActionLink href="/lab/submit" className="shrink-0 self-start sm:self-center">
            {t('hero.submit')}
          </ActionLink>
        </Container>
      </section>
    </>
  );
}
