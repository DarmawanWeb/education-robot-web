import { type EducationLevel, type Locale, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { customPcb, kitGallery, smpParts } from '@/lib/kit-media';
import { Container } from '../ui/container';

/**
 * Product views. A finished robot such as SD v1 is shown from every side when those views
 * exist; SMP v1 is modular, so it is shown as its configurations, its parts, and its board.
 */
export async function KitMedia({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const t = await getTranslations('Kit');
  const gallery = kitGallery[level.slug];
  if (!gallery) return null;
  const modular = level.slug === 'smp';

  return (
    <section className="pb-16 lg:pb-24">
      <Container>
        <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)]">
          {modular ? t('modular') : t('gallery')}
        </h2>
        {modular ? (
          <p className="text-muted-foreground mt-4 max-w-[62ch] text-lg leading-relaxed">
            {t('modularBody')}
          </p>
        ) : null}
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {gallery.map((view) => (
            <li key={view.alt.en}>
              <figure className="border-edge flex h-full flex-col overflow-hidden rounded-lg border-2 bg-white">
                <Image
                  src={view.src}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1024px) 17rem, 50vw"
                  className={cn(
                    'aspect-[4/3] h-auto w-full',
                    view.fit === 'cover' ? 'object-cover' : 'object-contain p-2',
                  )}
                />
                <figcaption className="border-edge mt-auto border-t-2 bg-white px-4 py-2.5 font-bold text-black">
                  {pick(view.alt, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        {modular ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
            {[
              { image: smpParts, title: t('parts') },
              { image: customPcb, title: t('pcb') },
            ].map(({ image, title }) => (
              <figure
                key={title}
                className="border-edge flex flex-col overflow-hidden rounded-lg border-2 bg-white"
              >
                <Image
                  src={image.src}
                  alt={pick(image.alt, locale)}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 36rem, 100vw"
                  className="h-auto w-full"
                />
                <figcaption className="border-edge border-t-2 px-4 py-2.5 font-bold text-black">
                  {title}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
