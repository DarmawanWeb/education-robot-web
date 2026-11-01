/** Structured data for search engines, as one JSON-LD script. */
export function JsonLd({ data }: { data: object | object[] }) {
  // `<` is escaped so a string in the data can never close the script tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD has to be inline, and the content is escaped above
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
