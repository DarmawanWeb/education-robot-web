'use client';

import { cn } from '@dctedu/ui/lib/utils';
import { Children, type ReactNode, useState } from 'react';

/**
 * Filters a list of server-rendered rows by goal. Rows arrive as children, in the same order
 * as `goals`, so the rows themselves stay server components.
 */
export function GoalFilter({
  label,
  allLabel,
  options,
  goals,
  children,
}: {
  label: string;
  allLabel: string;
  options: { id: string; label: string }[];
  goals: string[][];
  children: ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const rows = Children.toArray(children);
  const chip = (pressed: boolean) =>
    cn(
      'h-10 rounded-full border px-4 text-[0.95rem] font-bold whitespace-nowrap transition-colors',
      pressed
        ? 'bg-ink text-ink-foreground border-transparent'
        : 'bg-surface hover:bg-surface-muted',
    );
  return (
    <>
      <fieldset aria-label={label} className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
          className={chip(active === null)}
        >
          {allLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={active === option.id}
            onClick={() => setActive(option.id)}
            className={chip(active === option.id)}
          >
            {option.label}
          </button>
        ))}
      </fieldset>
      <ul className="mt-10 grid gap-6">
        {rows.map((row, index) =>
          active === null || goals[index]?.includes(active) ? (
            <li key={(row as { key?: string }).key ?? index}>{row}</li>
          ) : null,
        )}
      </ul>
    </>
  );
}
