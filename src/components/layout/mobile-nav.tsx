'use client';

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@taksu/ui/components/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { actionClass } from '../ui/action-link';
import { type NavItem, NavLinks } from './nav-links';
import { Wordmark } from './wordmark';

export function MobileNav({
  items,
  labels,
}: {
  items: NavItem[];
  labels: { menu: string; close: string; cta: string };
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={labels.menu}
          className="border-edge flex size-11 items-center justify-center rounded-md border-2 lg:hidden"
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
        <Link href="/contact" onClick={close} className={actionClass('signal', 'mt-auto')}>
          {labels.cta}
        </Link>
      </SheetContent>
    </Sheet>
  );
}
