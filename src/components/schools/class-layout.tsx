import { getTranslations } from 'next-intl/server';

const roles = [
  { id: 'programmer', colour: 'var(--primary)' },
  { id: 'tester', colour: 'var(--level-sd)' },
  { id: 'recorder', colour: '#ffd23f' },
] as const;
/** Table numbers for a class of thirty in groups of three. */
const tables = Array.from({ length: 10 }, (_, index) => index + 1);

/** A class of thirty drawn as ten tables, each with one robot and three rotating roles. */
export async function ClassLayout() {
  const t = await getTranslations('Schools');
  return (
    <figure className="flex flex-col gap-5">
      <ul aria-hidden className="grid grid-cols-5 gap-3 sm:gap-4">
        {tables.map((table) => (
          <li
            key={table}
            className="border-edge bg-surface flex flex-col items-center gap-2.5 rounded-md border-2 px-1 py-3"
          >
            <span className="bg-ink relative h-5 w-7 rounded-[4px]">
              <span className="bg-ink-foreground absolute top-1.5 left-1.5 size-1 rounded-full" />
              <span className="bg-ink-foreground absolute top-1.5 right-1.5 size-1 rounded-full" />
            </span>
            <span className="flex gap-1">
              {roles.map((role, index) => (
                <span
                  key={role.id}
                  className="size-3.5 rounded-full border border-black sm:size-4"
                  style={{ backgroundColor: roles[(index + table) % roles.length]?.colour }}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="flex flex-col gap-3">
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          {roles.map((role) => (
            <span key={role.id} className="inline-flex items-center gap-2 font-semibold">
              <span
                aria-hidden
                className="size-4 rounded-full border border-black"
                style={{ backgroundColor: role.colour }}
              />
              {t(`roles.${role.id}`)}
            </span>
          ))}
        </span>
        <span className="text-muted-foreground">{t('classCaption')}</span>
      </figcaption>
    </figure>
  );
}
