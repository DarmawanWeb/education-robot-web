import Image, { type StaticImageData } from 'next/image';

/** One of the team's own builds, shown until schools send in theirs. Not a link. */
export function ExampleCard({
  image,
  title,
  body,
  tag,
}: {
  image: StaticImageData;
  title: string;
  body: string;
  tag: string;
}) {
  return (
    <article className="border-edge bg-surface flex h-full flex-col overflow-hidden rounded-lg border-2">
      <div className="border-edge aspect-[4/3] border-b-2 bg-white">
        <Image
          src={image}
          alt=""
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
          className="size-full object-contain p-3"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="bg-surface-muted self-start rounded-sm px-2 py-0.5 text-sm font-bold">
          {tag}
        </span>
        <h3 className="text-lg leading-snug font-bold">{title}</h3>
        <p className="text-muted-foreground text-[0.95rem]">{body}</p>
      </div>
    </article>
  );
}
