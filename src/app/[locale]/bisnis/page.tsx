import {
  brand,
  bulkBuyers,
  bulkIncludes,
  businessFaq,
  oemLevels,
  oemProcess,
  oemSoftware,
  pick,
  products,
  robots,
} from '@taksu/catalog';
import { Button } from '@taksu/ui/components/button';
import { cn } from '@taksu/ui/lib/utils';
import {
  BadgePercent,
  BookOpen,
  Check,
  GraduationCap,
  LifeBuoy,
  Presentation,
  School,
  Trophy,
} from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { QuoteForm } from '@/components/business/quote-form';
import { ProductCard } from '@/components/products/product-card';
import { FaqList } from '@/components/shared/faq-list';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { siteConfig } from '@/lib/site-config';

type Props = { params: Promise<{ locale: string }> };

const buyerIcons = { school: School, course: GraduationCap, team: Trophy } as const;
const includeIcons = {
  pricing: BadgePercent,
  training: Presentation,
  materials: BookOpen,
  support: LifeBuoy,
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Business' });
  return pageMetadata({ locale, path: '/bisnis', title: t('title'), description: t('intro') });
}

export default async function BusinessPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Business');
  const classroom = products.filter((product) => product.kind === 'sekolah');
  const sections = [
    { id: 'beli-banyak', label: t('bulk.title') },
    { id: 'oem', label: t('oem.nav') },
    { id: 'tanya', label: t('form.title') },
  ];

  return (
    <>
      <section className="pt-14 pb-14 lg:pt-20 lg:pb-16">
        <Container>
          <h1 className="type-display max-w-[16ch] text-[clamp(2.5rem,6vw,4.5rem)]">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-relaxed">
            {t('intro')}
          </p>
          <nav aria-label={t('jump')} className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="bg-surface hover:bg-surface-muted inline-flex h-10 items-center rounded-full border px-4 text-[0.95rem] font-bold"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      <section id="beli-banyak" className="bg-surface scroll-mt-16 border-y py-16 lg:py-24">
        <Container>
          <SectionHeading
            title={t('bulk.title')}
            intro={t('bulk.intro')}
            action={
              <Button asChild size="lg" variant="ink">
                <a href="#tanya-bulk">{t('bulk.action')}</a>
              </Button>
            }
          />

          <h3 className="mt-14 text-xl font-bold">{t('bulk.who')}</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {bulkBuyers.map((buyer) => {
              const Icon = buyerIcons[buyer.id as keyof typeof buyerIcons] ?? School;
              return (
                <li key={buyer.id} className="bg-background rounded-lg border p-6">
                  <Icon className="size-7" aria-hidden />
                  <h4 className="mt-4 text-lg font-bold">{pick(buyer.title, locale)}</h4>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed">
                    {pick(buyer.body, locale)}
                  </p>
                </li>
              );
            })}
          </ul>

          <h3 className="mt-14 text-xl font-bold">{t('bulk.includes')}</h3>
          <ul className="mt-5 grid gap-x-12 gap-y-7 md:grid-cols-2">
            {bulkIncludes.map((item) => {
              const Icon = includeIcons[item.id as keyof typeof includeIcons] ?? Check;
              return (
                <li key={item.id} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4">
                  <span className="bg-ink text-ink-foreground grid size-11 place-items-center rounded-md">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold">{pick(item.title, locale)}</h4>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      {pick(item.body, locale)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="border-l-accent bg-background mt-10 max-w-[60rem] rounded-md border border-l-[6px] px-5 py-4 leading-relaxed">
            {t('bulk.notService')}
          </p>

          {classroom.length > 0 ? (
            <>
              <h3 className="mt-14 text-xl font-bold">{t('bulk.products')}</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classroom.map((product) => (
                  <li key={product.slug}>
                    <ProductCard product={product} locale={locale} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Container>
      </section>

      <section id="oem" className="asphalt scroll-mt-16 py-16 lg:py-24">
        <Container>
          <SectionHeading title={t('oem.title')} intro={t('oem.intro')} tone="onDark" />
          <ol className="mt-12 grid gap-4 lg:grid-cols-3">
            {oemLevels.map((level, index) => (
              <li
                key={level.id}
                className="flex flex-col rounded-xl border border-white/12 bg-white/[0.04] p-6 text-white"
              >
                <div
                  role="img"
                  aria-label={t('oem.depth', { n: index + 1 })}
                  className="flex gap-1.5"
                >
                  {[0, 1, 2].map((segment) => (
                    <span
                      key={segment}
                      className={cn(
                        'h-2 flex-1 rounded-full',
                        segment <= index ? 'bg-primary' : 'bg-white/15',
                      )}
                    />
                  ))}
                </div>
                <h3 className="type-display mt-6 text-[1.75rem]">{pick(level.title, locale)}</h3>
                <p className="mt-2 text-lg leading-snug font-bold">{pick(level.summary, locale)}</p>
                <ul className="mt-5 grid gap-2">
                  {level.changes.map((change) => (
                    <li key={change.en} className="flex gap-2.5 text-white/80">
                      <Check className="mt-1 size-4 shrink-0 text-[#ffb020]" aria-hidden />
                      {pick(change, locale)}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-sm text-white/65">
                  <span className="font-bold text-white">{t('oem.fits')}: </span>
                  {pick(level.fits, locale)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-xl font-bold text-white">{t('oem.software')}</h3>
              <ul className="mt-5 grid gap-5">
                {oemSoftware.map((item) => (
                  <li key={item.id}>
                    <h4 className="font-bold text-white">{pick(item.title, locale)}</h4>
                    <p className="mt-1 leading-relaxed text-white/70">{pick(item.body, locale)}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t('oem.process')}</h3>
              <ol className="mt-5 grid gap-5">
                {oemProcess.map((step, index) => (
                  <li key={step.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
                    <span className="type-number grid size-10 place-items-center rounded-full border-2 border-[#ffb020] text-[#ffb020]">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white">{pick(step.title, locale)}</h4>
                      <p className="mt-1 leading-relaxed text-white/70">
                        {pick(step.body, locale)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <Button asChild size="lg" variant="light" className="mt-12">
            <a href="#tanya-oem">{t('oem.action')}</a>
          </Button>
        </Container>
      </section>

      <section id="tanya" className="scroll-mt-16 py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading title={t('form.title')} intro={t('form.intro')} />
            <p className="mt-6 font-semibold">
              <a
                href={`mailto:${siteConfig.email}`}
                className="decoration-primary underline decoration-2 underline-offset-4"
              >
                {siteConfig.email}
              </a>
            </p>
            <p className="text-muted-foreground mt-1">{pick(brand.location, locale)}</p>
          </div>
          <QuoteForm robots={robots.map((robot) => ({ slug: robot.slug, name: robot.name }))} />
        </Container>
      </section>

      <section className="bg-surface border-t py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHeading title={t('faq')} className="self-start" />
          <FaqList
            items={businessFaq.map((item) => ({
              id: item.id,
              question: pick(item.question, locale),
              answer: pick(item.answer, locale),
            }))}
          />
        </Container>
      </section>
    </>
  );
}
