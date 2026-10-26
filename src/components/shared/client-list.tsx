import { clients, type Locale, pick } from '@dctedu/catalog';
import { cn } from '@dctedu/ui/lib/utils';
import { Building2 } from 'lucide-react';

/** The companies we design and build for, each with what we make for them. */
export function ClientList({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <ul className={cn('grid gap-4 md:grid-cols-2', className)}>
      {clients.map((client) => (
        <li key={client.id} className="bg-surface flex gap-4 rounded-xl border p-6">
          <span className="bg-ink text-ink-foreground grid size-12 shrink-0 place-items-center rounded-lg">
            <Building2 className="size-6" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-bold">{client.name}</h3>
            <p className="text-primary mt-0.5 text-sm font-bold">{pick(client.role, locale)}</p>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {pick(client.work, locale)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
