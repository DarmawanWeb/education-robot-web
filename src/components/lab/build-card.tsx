import type { LabKit } from '@taksu/content';
import { Link } from '@/i18n/navigation';
import { KitChip } from './kit-chip';

export interface BuildCardData {
  id: string;
  title: string;
  kit: LabKit;
  kitLabel: string;
  byline: string;
  challenge: string | null;
  photo: { src: string; width: number; height: number } | null;
}

/** A published build: photo, kit, title, and who made it. The whole card is the link. */
export function BuildCard({ build }: { build: BuildCardData }) {
  return (
    <article className="box-ink bg-surface relative flex h-full flex-col overflow-hidden rounded-lg">
      <div className="border-edge bg-surface-muted aspect-[4/3] border-b-2">
        {build.photo ? (
          // biome-ignore lint/performance/noImgElement: Lab photos are already resized WebP served by the Lab API
          <img
            src={build.photo.src}
            width={build.photo.width}
            height={build.photo.height}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <KitChip kit={build.kit} label={build.kitLabel} />
          {build.challenge ? (
            <span className="bg-accent rounded-sm px-2 py-0.5 text-sm font-bold text-black">
              {build.challenge}
            </span>
          ) : null}
        </div>
        <h3 className="text-lg leading-snug font-bold">
          <Link
            href={`/lab/builds/${build.id}`}
            className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
          >
            {build.title}
          </Link>
        </h3>
        <p className="text-muted-foreground mt-auto text-[0.95rem]">{build.byline}</p>
      </div>
    </article>
  );
}
