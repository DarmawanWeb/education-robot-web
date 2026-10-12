import { curricula, type EducationLevel, educationLevels, type Locale, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { levelTone } from '../ui/level-chip';
import { StatusTag } from '../ui/status-tag';

/** Kit-by-kit comparison. Scrolls sideways inside its frame on narrow screens. */
export async function CompareTable({ locale }: { locale: Locale }) {
  const [t, kits, common, curriculumT] = await Promise.all([
    getTranslations('Kits.rows'),
    getTranslations('Kits'),
    getTranslations('Common'),
    getTranslations('Curriculum'),
  ]);

  const rows: { label: string; cell: (level: EducationLevel) => ReactNode }[] = [
    { label: t('level'), cell: (level) => pick(level.name, locale) },
    { label: t('grades'), cell: (level) => pick(level.grades, locale) },
    { label: t('age'), cell: (level) => pick(level.ageRange, locale) },
    { label: t('build'), cell: (level) => pick(level.build.label, locale) },
    { label: t('controller'), cell: (level) => level.controller },
    { label: t('programming'), cell: (level) => pick(level.programming, locale) },
    {
      label: t('curriculum'),
      cell: (level) => (
        <>
          {common('meetings', { count: level.meetings })}
          <span className="text-muted-foreground block text-sm font-normal">
            {curriculumT('perMeeting', { count: curricula[level.slug].minutesPerMeeting })}
          </span>
        </>
      ),
    },
    {
      label: t('simulator'),
      cell: (level) => (level.simTrack ? kits('simulatorBrowser') : kits('simulatorGazebo')),
    },
    { label: t('status'), cell: (level) => <StatusTag status={level.status} /> },
  ];

  return (
    <div className="border-edge relative overflow-x-auto rounded-lg border-2">
      <table className="w-full min-w-[46rem] border-collapse text-left">
        <caption className="sr-only">{kits('compareTitle')}</caption>
        <thead>
          <tr>
            <td className="bg-surface-muted w-[22%]" />
            {educationLevels.map((level) => (
              <th
                key={level.slug}
                scope="col"
                className="bg-surface-muted border-edge border-l-2 p-0 align-top"
              >
                <span
                  className={cn('block h-2.5 border-b-2 border-black', levelTone[level.slug])}
                />
                <Link
                  href={`/kits/${level.slug}`}
                  className="type-label hover:decoration-primary block px-5 py-4 text-2xl hover:underline"
                >
                  {level.kit}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-border border-t">
              <th
                scope="row"
                className="text-muted-foreground px-5 py-3.5 align-top text-[0.95rem] font-normal"
              >
                {row.label}
              </th>
              {educationLevels.map((level) => (
                <td
                  key={level.slug}
                  className="border-edge border-l-2 px-5 py-3.5 align-top font-semibold"
                >
                  {row.cell(level)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
