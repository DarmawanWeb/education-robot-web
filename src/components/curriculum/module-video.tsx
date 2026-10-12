'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

/**
 * A YouTube video that loads nothing from YouTube until someone presses play, then plays
 * from youtube-nocookie.com. Only the thumbnail image is fetched before that.
 */
export function ModuleVideo({
  youtube,
  title,
  meta,
  note,
  locale,
  labels,
}: {
  youtube: string;
  title: string;
  meta: string;
  note: string;
  locale: string;
  labels: { video: string; play: string; watch: string; newTab: string };
}) {
  const [playing, setPlaying] = useState(false);
  // School networks often block YouTube images; fall back to a plain dark frame.
  const [thumbnail, setThumbnail] = useState(true);
  const query = new URLSearchParams({ autoplay: '1', rel: '0', hl: locale });
  if (locale === 'id') query.set('cc_lang_pref', 'id');

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-start sm:gap-6 print:block">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtube}?${query.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="border-edge aspect-video w-full rounded-md border-2 sm:col-span-2 print:hidden"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group border-edge relative block aspect-video w-full overflow-hidden rounded-md border-2 bg-black print:hidden"
        >
          {thumbnail ? (
            <Image
              src={`https://i.ytimg.com/vi/${youtube}/mqdefault.jpg`}
              alt=""
              width={320}
              height={180}
              unoptimized
              onError={() => setThumbnail(false)}
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
          ) : null}
          <span className="absolute inset-0 grid place-items-center">
            <span className="bg-primary text-primary-foreground grid size-12 place-items-center rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] transition-transform group-hover:scale-105">
              <Play className="size-5 translate-x-px fill-current" aria-hidden />
            </span>
          </span>
          <span className="sr-only">
            {labels.play}: {title}
          </span>
        </button>
      )}
      <div>
        <p>
          <span className="font-bold">{labels.video}: </span>
          <span className="font-semibold">{title}</span>
        </p>
        <p className="text-muted-foreground text-sm">{meta}</p>
        <p className="mt-2">{note}</p>
        <a
          href={`https://www.youtube.com/watch?v=${youtube}`}
          target="_blank"
          rel="noopener"
          className="decoration-primary mt-2 inline-block text-sm font-semibold underline decoration-2 underline-offset-4 hover:decoration-[3px] print:hidden"
        >
          {labels.watch}
          <span className="sr-only"> {labels.newTab}</span>
        </a>
      </div>
    </div>
  );
}
