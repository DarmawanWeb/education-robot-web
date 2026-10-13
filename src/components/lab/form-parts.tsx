import { cn } from '@taksu/ui/lib/utils';
import type { ReactNode } from 'react';

export const fieldClass =
  'border-edge bg-surface placeholder:text-muted-foreground w-full rounded-md border-2 px-3.5 text-base outline-none focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 aria-invalid:border-danger';
export const labelClass = 'text-[0.95rem] font-bold';

/** Label, control, hint, and error wired together for screen readers. */
export function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  /** Text shown after the label for optional fields. */
  optional?: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional ? <span className="text-muted-foreground font-normal"> ({optional})</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-danger text-sm font-bold">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** aria props for a control inside <Field>. */
export function describedBy(id: string, hint: boolean, error: boolean) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return {
    id,
    'aria-describedby': ids.length ? ids.join(' ') : undefined,
    'aria-invalid': error || undefined,
  };
}

/** Radio buttons drawn as chips; the chosen one is inked. */
export function ChoiceChips({
  name,
  legend,
  options,
  defaultValue,
  error,
  onChange,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  error?: string | null;
  onChange?: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2" aria-invalid={error ? true : undefined}>
      <legend className={cn(labelClass, 'mb-2')}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="border-edge has-[:checked]:bg-ink has-[:checked]:text-ink-foreground has-[:focus-visible]:outline-ring flex min-h-11 cursor-pointer items-center rounded-md border-2 px-4 font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              onChange={() => onChange?.(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <p className="text-danger text-sm font-bold">{error}</p> : null}
    </fieldset>
  );
}

/** A field people never see. Bots fill it in, and the server quietly drops what they send. */
export function Honeypot({ label }: { label: string }) {
  return (
    <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label>
        {label}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export const submitClass =
  'border-edge bg-primary text-primary-foreground inline-flex min-h-12 items-center justify-center gap-2 rounded-md border-2 px-6 font-bold shadow-[3px_3px_0_0_var(--edge)] transition-[transform,box-shadow] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--edge)] disabled:cursor-wait disabled:opacity-60';
