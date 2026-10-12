import type { Locale } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import Image from 'next/image';
import simEn from '@/assets/sim/sim-en.webp';
import simId from '@/assets/sim/sim-id.webp';

/** A real capture of the simulator running SD v1's line-following mission. */
export function SimShot({
  locale,
  alt,
  className,
  priority = false,
}: {
  locale: Locale;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn('box-ink overflow-hidden rounded-lg bg-white', className)}>
      <div aria-hidden className="ruler h-3 border-b-2 border-black bg-white text-black/60" />
      <Image
        src={locale === 'en' ? simEn : simId}
        alt={alt}
        placeholder="blur"
        priority={priority}
        sizes="(min-width: 1024px) 44rem, 100vw"
        className="h-auto w-full"
      />
    </figure>
  );
}
