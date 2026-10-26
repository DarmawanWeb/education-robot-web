import { cn } from '@dctedu/ui/lib/utils';
import type * as React from 'react';

/** The page column: 76rem wide with a 16px gutter on phones. */
export function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
