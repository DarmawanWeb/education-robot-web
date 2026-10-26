import { bulkIncludes, type Locale, oemLevels, pick } from '@dctedu/catalog';
import { Button } from '@dctedu/ui/components/button';
import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Container } from '../ui/container';

/** Two doors for business buyers: bulk orders with training, and OEM under their own brand. */
export async function BusinessTeaser({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.business');
  return (
    <section className="pb-20 lg:pb-28">
      <Container className="grid gap-4 lg:grid-cols-2">
        <div className="bg-surface flex flex-col rounded-xl border p-7 sm:p-10">
          <h2 className="type-display text-[clamp(1.75rem,3.2vw,2.5rem)]">{t('bulk.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{t('bulk.body')}</p>
          <ul className="mt-6 grid gap-2.5">
            {bulkIncludes.map((item) => (
              <li key={item.id} className="flex gap-2.5 font-semibold">
                <Check className="text-success mt-1 size-4 shrink-0" aria-hidden />
                {pick(item.title, locale)}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-8">
            <Button asChild variant="ink" size="lg">
              <Link href="/business#bulk">{t('bulk.action')}</Link>
            </Button>
          </div>
        </div>
        <div className="bg-primary relative flex flex-col overflow-hidden rounded-xl p-7 text-white sm:p-10">
          <span aria-hidden className="absolute inset-y-0 right-8 w-9 bg-white/90 sm:right-12" />
          <div className="relative flex flex-1 flex-col pr-14 sm:pr-24">
            <h2 className="type-display text-[clamp(1.75rem,3.2vw,2.5rem)]">{t('oem.title')}</h2>
            <p className="mt-3 text-lg leading-relaxed text-white/90">{t('oem.body')}</p>
            <ul className="mt-6 grid gap-3">
              {oemLevels.map((level) => (
                <li key={level.id}>
                  <p className="font-bold">{pick(level.title, locale)}</p>
                  <p className="text-white/85">{pick(level.summary, locale)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Button asChild variant="light" size="lg">
                <Link href="/business#oem">{t('oem.action')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
