'use client';

import { ThemeToggle } from '@dctedu/ui/brand/theme-toggle';
import { Wordmark } from '@dctedu/ui/brand/wordmark';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@dctedu/ui/components/sheet';
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
  labels: { menu: string; close: string; language: string; theme: string; themeName: string };
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
        <div className="mt-auto flex flex-col gap-3 border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm font-semibold">{labels.language}</span>
            <LocaleSwitcher label={labels.language} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm font-semibold">{labels.themeName}</span>
            <ThemeToggle label={labels.theme} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
