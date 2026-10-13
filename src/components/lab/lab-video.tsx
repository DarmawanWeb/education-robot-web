'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

/** A YouTube video that loads nothing from YouTube until someone presses play. */
export function LabVideo({
  youtube,
  title,
  locale,
  labels,
}: {
  youtube: string;
  title: string;
  locale: string;
  labels: { play: string; watch: string; newTab: string };
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState(true);
  const query = new URLSearchParams({ autoplay: '1', rel: '0', hl: locale });

  return (
    <div>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtube}?${query.toString()}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="border-edge aspect-video w-full rounded-lg border-2"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group border-edge relative block aspect-video w-full overflow-hidden rounded-lg border-2 bg-black"
        >
          {thumbnail ? (
            <Image
              src={`https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              unoptimized
              onError={() => setThumbnail(false)}
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
          ) : null}
          <span className="absolute inset-0 grid place-items-center">
            <span className="bg-primary text-primary-foreground grid size-14 place-items-center rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] transition-transform group-hover:scale-105">
              <Play className="size-6 translate-x-px fill-current" aria-hidden />
            </span>
          </span>
          <span className="sr-only">
            {labels.play}: {title}
          </span>
        </button>
      )}
      <a
        href={`https://www.youtube.com/watch?v=${youtube}`}
        target="_blank"
        rel="noopener"
        className="decoration-primary mt-2 inline-block text-[0.95rem] font-semibold underline decoration-2 underline-offset-4"
      >
        {labels.watch}
        <span className="sr-only"> {labels.newTab}</span>
      </a>
    </div>
  );
}
