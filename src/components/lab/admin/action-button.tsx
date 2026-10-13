'use client';

import { cn } from '@taksu/ui/lib/utils';
import type { ReactNode } from 'react';
import { moderate } from '@/app/[locale]/lab/admin/actions';

const tones = {
  primary: 'border-edge bg-primary text-primary-foreground',
  plain: 'border-edge bg-surface hover:bg-surface-muted',
  danger: 'border-danger text-danger bg-surface hover:bg-danger/10',
};

/** One moderation action as a tiny form; destructive ones ask first. */
export function ActionButton({
  action,
  id,
  children,
  tone = 'plain',
  confirm,
}: {
  action: string;
  id: string;
  children: ReactNode;
  tone?: keyof typeof tones;
  /** Question shown before the action runs. */
  confirm?: string;
}) {
  return (
    <form
      action={moderate}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={cn(
          'inline-flex min-h-10 items-center rounded-md border-2 px-3.5 text-[0.95rem] font-bold',
          tones[tone],
        )}
      >
        {children}
      </button>
    </form>
  );
}
