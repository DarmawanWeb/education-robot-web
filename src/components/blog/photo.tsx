import Image, { type StaticImageData } from 'next/image';

/** An image inside a post, with an optional caption. */
export function Photo({
  src,
  alt,
  caption,
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="mt-8">
      <Image
        src={src}
        alt={alt}
        sizes="(min-width: 768px) 42rem, 100vw"
        className="border-edge w-full rounded-lg border-2 bg-white"
      />
      {caption ? (
        <figcaption className="text-muted-foreground mt-2 text-sm">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
