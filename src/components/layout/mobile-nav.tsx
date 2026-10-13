'use client';

import { ThemeToggle } from '@taksu/ui/brand/theme-toggle';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@taksu/ui/components/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { type NavItem, NavLinks } from './nav-links';
import { Wordmark } from './wordmark';

export function MobileNav({
  items,
  labels,
}: {
  items: NavItem[];
  labels: { menu: string; close: string; theme: string };
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={labels.menu}
          className="border-edge flex size-11 items-center justify-center rounded-md border-2 min-[1100px]:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent closeLabel={labels.close} aria-describedby={undefined}>
        <SheetTitle asChild>
          <div>
            <Wordmark />
          </div>
        </SheetTitle>
        <NavLinks items={items} onNavigate={close} vertical />
        <div className="border-edge mt-auto flex items-center justify-between gap-3 border-t-2 pt-4">
          <span className="text-muted-foreground text-sm font-semibold">{labels.theme}</span>
          <ThemeToggle label={labels.theme} className="border-edge size-12 shrink-0 border-2" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
