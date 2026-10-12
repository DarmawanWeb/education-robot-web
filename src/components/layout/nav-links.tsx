'use client';

import { cn } from '@taksu/ui/lib/utils';
import { Link, usePathname } from '@/i18n/navigation';

export interface NavItem {
  href: string;
  label: string;
}

/** Section links; the current section is underlined in signal orange. */
export function NavLinks({
  items,
  className,
  onNavigate,
  vertical = false,
}: {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav className={className}>
      <ul className={cn('flex', vertical ? 'flex-col gap-1' : 'items-center gap-1')}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'decoration-primary block rounded-sm py-2 font-semibold whitespace-nowrap underline-offset-[7px] transition-colors hover:underline',
                  vertical ? 'px-3 text-xl' : 'px-2 text-[0.95rem] xl:px-3',
                  active ? 'underline decoration-[3px]' : 'decoration-2',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
