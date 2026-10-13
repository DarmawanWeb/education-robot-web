'use client';

import { cn } from '@taksu/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export interface GalleryPhoto {
  large: string;
  small: string;
  width: number;
  height: number;
}

/** The build's photos: one large, the rest as buttons that swap it in. */
export function PhotoGallery({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const t = useTranslations('Lab.build');
  const [index, setIndex] = useState(0);
  const current = photos[index] ?? photos[0];
  if (!current) return null;
  return (
    <div>
      <div className="border-edge bg-surface-muted overflow-hidden rounded-lg border-2">
        {/* biome-ignore lint/performance/noImgElement: Lab photos are already resized WebP served by the Lab API */}
        <img
          src={current.large}
          width={current.width}
          height={current.height}
          alt={`${title}, ${t('photo', { n: index + 1 })}`}
          className="max-h-[70vh] w-full object-contain"
        />
      </div>
      {photos.length > 1 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {photos.map((photo, position) => (
            <li key={photo.small}>
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={t('showPhoto', { n: position + 1 })}
                aria-pressed={position === index}
                className={cn(
                  'border-edge block size-20 overflow-hidden rounded-md border-2 transition-opacity',
                  position === index
                    ? 'opacity-100 ring-primary ring-2 ring-offset-2'
                    : 'opacity-70 hover:opacity-100',
                )}
              >
                {/* biome-ignore lint/performance/noImgElement: thumbnails from the Lab API */}
                <img src={photo.small} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
