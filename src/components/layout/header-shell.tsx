'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

/**
 * The header's frame. At the top of the page it is a full-width bar; once the page scrolls it
 * docks into a floating pill in the middle. The pill moves with a transform, so the page below
 * never shifts when it docks.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [docked, setDocked] = useState(false);
  useEffect(() => {
    const update = () => setDocked(window.scrollY > 40);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header data-docked={docked ? '' : undefined} className="group/header sticky top-0 z-40 h-16">
      <div className="bg-surface/95 mx-auto max-w-full border-b backdrop-blur-md transition-[max-width,transform,border-radius,box-shadow,background-color] duration-300 ease-out group-data-[docked]/header:max-w-[min(64rem,calc(100%-1.5rem))] group-data-[docked]/header:translate-y-3 group-data-[docked]/header:rounded-2xl group-data-[docked]/header:border group-data-[docked]/header:bg-surface/85 group-data-[docked]/header:shadow-[0_18px_40px_-22px_rgb(31_34_40/0.55)] motion-reduce:transition-none">
        {children}
      </div>
    </header>
  );
}
