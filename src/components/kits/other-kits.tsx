import { type EducationLevel, educationLevels, type Locale, pick } from '@taksu/content';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { kitHero } from '@/lib/kit-media';
import { Container } from '../ui/container';

export async function OtherKits({ level, locale }: { level: EducationLevel; locale: Locale }) {
  const [t, common] = await Promise.all([getTranslations('Kit'), getTranslations('Common')]);
  const others = educationLevels.filter((entry) => entry.slug !== level.slug);
  return (
    <section className="pb-16 lg:pb-24">
      <Container>
        <h2 className="type-label text-3xl">{t('others')}</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {others.map((entry) => {
            const image = kitHero[entry.slug];
            return (
              <li key={entry.slug}>
                <Link
                  href={`/kits/${entry.slug}`}
                  className="border-edge bg-surface group flex items-center gap-5 overflow-hidden rounded-lg border-2 pr-5 transition-shadow hover:shadow-[4px_4px_0_0_var(--edge)]"
                >
                  <span className="relative min-h-28 w-36 shrink-0 self-stretch border-r-2 border-black bg-white">
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="9rem"
                      className={image.fit === 'contain' ? 'object-contain p-1' : 'object-cover'}
                    />
                  </span>
                  <span className="py-5">
                    <span className="type-label block text-2xl group-hover:underline">
                      {entry.kit}
                    </span>
                    <span className="text-muted-foreground mt-1 block">
                      {pick(entry.tagline, locale)}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="text-muted-foreground mt-10 text-sm">{common('conceptNote')}</p>
      </Container>
    </section>
  );
}
