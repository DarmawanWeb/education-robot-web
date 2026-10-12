import { cn } from '@taksu/ui/lib/utils';
import type * as React from 'react';

export function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-[76rem] px-5 sm:px-8', className)} {...props} />;
}
