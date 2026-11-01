import { clients } from '@dctedu/catalog';
import { Button } from '@dctedu/ui/components/button';
import { Building2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '../ui/container';

/**
 * One door for business buyers on the home page. The details (who it is for, what is included,
 * the OEM levels and the clients) live on the business page only.
 */
export async function BusinessBand() {
  const t = await getTranslations('Home.business');
  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="bg-primary relative overflow-hidden rounded-xl p-7 text-white sm:p-10 lg:p-12">
          <span aria-hidden className="absolute inset-y-0 right-8 w-9 bg-white/90 sm:right-14" />
          <div className="relative grid gap-8 pr-14 sm:pr-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-[46rem]">
              <h2 className="type-display text-[clamp(1.75rem,3.4vw,2.75rem)]">{t('title')}</h2>
              <p className="mt-3 text-lg leading-relaxed text-white/90">{t('body')}</p>
              {clients.length > 0 ? (
                <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-bold text-white/85">
                  <span>{t('trust')}</span>
                  {clients.map((client) => (
                    <span
                      key={client.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1"
                    >
                      <Building2 className="size-4" aria-hidden />
                      {client.name}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="light" size="lg">
                <Link href="/business#bulk">{t('bulk')}</Link>
              </Button>
              <Button asChild variant="lightOutline" size="lg">
                <Link href="/business#oem">{t('oem')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
