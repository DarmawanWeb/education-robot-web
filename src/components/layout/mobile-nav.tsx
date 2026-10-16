'use client';

import { Wordmark } from '@taksu/edu-ui/brand/wordmark';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@taksu/edu-ui/components/sheet';
import { Gamepad2, Menu } from 'lucide-react';
import { useState } from 'react';
import { LocaleSwitcher } from './locale-switcher';
import { type NavItem, NavLinks } from './nav-links';

export function MobileNav({
  items,
  simulator,
  labels,
}: {
  items: NavItem[];
  simulator: { href: string; label: string };
  labels: { menu: string; close: string; language: string };
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={labels.menu}
          className="hover:bg-surface-muted flex size-11 items-center justify-center rounded-md lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent closeLabel={labels.close} aria-describedby={undefined}>
        <SheetTitle asChild>
          <div>
            <Wordmark className="h-7" />
          </div>
        </SheetTitle>
        <NavLinks items={items} onNavigate={close} vertical />
        <a
          href={simulator.href}
          className="hover:bg-surface-muted flex items-center gap-2 rounded-sm px-3 py-2 text-xl font-bold"
        >
          <Gamepad2 className="size-5" aria-hidden />
          {simulator.label}
        </a>
        <div className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
          <span className="text-muted-foreground text-sm font-semibold">{labels.language}</span>
          <LocaleSwitcher label={labels.language} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
