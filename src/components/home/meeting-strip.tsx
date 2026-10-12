'use client';

import { type Curriculum, type Locale, pick } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { moduleColour } from '@/lib/module-colours';

interface Row {
  kit: string;
  curriculum: Curriculum;
}

/**
 * Every meeting of every level as a square, coloured by module, like ticks on a ruler.
 * Selecting a square names the meeting below, so it works with touch as well as a mouse.
 */
export function MeetingStrip({
  rows,
  locale,
  compact = false,
}: {
  rows: Row[];
  locale: Locale;
  /** Hide the kit labels when the strip shows a single kit's page. */
  compact?: boolean;
}) {
  const t = useTranslations('Curriculum');
  const common = useTranslations('Common');
  const [selected, setSelected] = useState<{ row: number; meeting: number } | null>({
    row: 0,
    meeting: 0,
  });

  const describe = (rowIndex: number, meetingIndex: number) => {
    const row = rows[rowIndex];
    if (!row) return '';
    let count = 0;
    for (const module of row.curriculum.modules) {
      for (const meeting of module.meetings) {
        if (count === meetingIndex) {
          return `${row.kit}, ${t('meeting', { n: meetingIndex + 1 })}: ${pick(meeting.title, locale)} (${pick(module.title, locale)})`;
        }
        count += 1;
      }
    }
    return '';
  };

  return (
    <div className="flex flex-col gap-7">
      {rows.map((row, rowIndex) => {
        let meetingIndex = -1;
        const total = row.curriculum.modules.reduce(
          (sum, module) => sum + module.meetings.length,
          0,
        );
        return (
          <div
            key={row.kit}
            className={cn('grid gap-3', !compact && 'md:grid-cols-[8.5rem_1fr] md:items-center')}
          >
            {compact ? null : (
              <p className="flex items-baseline gap-3 md:flex-col md:gap-0">
                <span className="type-label text-2xl">{row.kit}</span>
                <span className="text-sm opacity-80">{common('meetings', { count: total })}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {row.curriculum.modules.map((module, moduleIndex) => (
                <div key={module.id} className="flex gap-1">
                  {module.meetings.map((meeting) => {
                    meetingIndex += 1;
                    const index = meetingIndex;
                    const active = selected?.row === rowIndex && selected.meeting === index;
                    return (
                      <button
                        key={meeting.title.en}
                        type="button"
                        title={describe(rowIndex, index)}
                        aria-label={describe(rowIndex, index)}
                        aria-pressed={active}
                        onClick={() => setSelected({ row: rowIndex, meeting: index })}
                        onMouseEnter={() => setSelected({ row: rowIndex, meeting: index })}
                        className={cn(
                          'size-5 rounded-[3px] border border-black/60 transition-transform focus-visible:outline-white lg:size-[1.375rem]',
                          active && 'scale-125 outline-2 outline-white',
                        )}
                        style={{
                          backgroundColor: moduleColour(moduleIndex),
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <p aria-live="polite" className="min-h-[3em] border-t border-white/25 pt-4 text-lg">
        {selected ? describe(selected.row, selected.meeting) : null}
      </p>
    </div>
  );
}
