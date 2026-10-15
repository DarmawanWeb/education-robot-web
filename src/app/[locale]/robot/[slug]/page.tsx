import {
  getRobot,
  guidesFor,
  type Locale,
  learnPath,
  pick,
  productsFor,
  type Robot,
  robots,
  stepTitle,
} from '@ulik/catalog';
import { RaceNumber } from '@ulik/ui/brand/race-number';
import { Button } from '@ulik/ui/components/button';
import { cn } from '@ulik/ui/lib/utils';
import { Check, Gamepad2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BuyBox } from '@/components/cart/buy-box';
import { StepNumber } from '@/components/learn/step-number';
import { ProductCard } from '@/components/products/product-card';
import { RobotChips } from '@/components/robots/robot-chips';
import { Container } from '@/components/ui/container';
import { AvailabilityBadge, RobotPrice } from '@/components/ui/price';
import { SectionHeading } from '@/components/ui/section-heading';
import { TextLink } from '@/components/ui/text-link';
import { Link } from '@/i18n/navigation';
import { contactHref } from '@/lib/contact';
import { imageFit, momoBoard, momoGallery, robotImages } from '@/lib/images';
import { marketplaceLinks, simulatorUrl } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { robotStyle } from '@/lib/robot-style';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return robots.map((robot) => ({ slug: robot.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const robot = getRobot((await params).slug);
  if (!robot) return {};
  return pageMetadata({
    locale,
    path: `/robot/${robot.slug}`,
    title: `${robot.name}: ${pick(robot.tagline, locale)}`,
    description: pick(robot.summary, locale),
    image: robot.slug,
  });
}

async function Hero({ robot, locale }: { robot: Robot; locale: Locale }) {
  const t = await getTranslations('RobotPage');
  const image = robotImages[robot.slug];
  const style = robotStyle[robot.slug];
  const orderable = robot.availability !== 'soon';
  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24">
      <Container>
        <nav aria-label={t('breadcrumb')} className="text-muted-foreground text-sm font-semibold">
          <Link href="/robot" className="hover:text-foreground hover:underline">
            {t('allRobots')}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span aria-current="page" className="text-foreground">
            {robot.name}
          </span>
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div className="relative self-start overflow-hidden rounded-xl border bg-white">
            <div className="relative aspect-[4/3]">
              <Image
                src={image.src}
                alt={pick(image.alt, locale)}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 44rem, 100vw"
                className={imageFit(image, 'p-6 sm:p-10')}
              />
            </div>
            <span aria-hidden className={cn('absolute inset-x-0 bottom-0 h-2.5', style.fill)} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <RaceNumber value={robot.number} size="lg" label={t('number', { n: robot.number })} />
              <h1 className="type-number text-[clamp(3rem,7vw,5rem)]">{robot.name}</h1>
            </div>
            <p className="mt-4 text-xl leading-snug font-bold">{pick(robot.tagline, locale)}</p>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <RobotChips robot={robot} locale={locale} />
              <AvailabilityBadge availability={robot.availability} locale={locale} />
            </div>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              {pick(robot.summary, locale)}
            </p>
            <div className="mt-6 border-t pt-6">
              <RobotPrice robot={robot} locale={locale} className="text-2xl" />
              <div className="mt-5">
                <BuyBox
                  slug={robot.slug}
                  name={robot.name}
                  price={robot.price}
                  options={robot.options?.map((option) => ({
                    id: option.id,
                    label: pick(option.label, locale),
                    price: option.price,
                  }))}
                  orderable={orderable && robot.price !== null}
                  stores={marketplaceLinks(robot.marketplace)}
                  notifyHref={contactHref(
                    t('notifyMessage', { robot: robot.name }),
                    t('notifySubject', { robot: robot.name }),
                  )}
                  note={
                    robot.availability === 'preorder'
                      ? t('preorderNote')
                      : robot.availability === 'soon'
                        ? t('soonNote')
                        : undefined
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function RobotPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const robot = getRobot((await params).slug);
  if (!robot) notFound();
  const t = await getTranslations('RobotPage');
  const path = learnPath(robot.slug);
  const steps = path?.steps ?? [];
  const addOns = productsFor(robot.slug);
  const guides = guidesFor(robot.slug).filter((guide) => guide.audience === 'owner');

  return (
    <>
      <Hero robot={robot} locale={locale} />

      <section className="bg-surface border-y py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <h2 className="type-display text-[clamp(2rem,4vw,3rem)]">
              {t('abilities', { robot: robot.name })}
            </h2>
            <p className="mt-5 text-lg font-bold">{pick(robot.build.label, locale)}</p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              {pick(robot.build.body, locale)}
            </p>
            <p className="mt-5 text-lg font-bold">{t('programming')}</p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              {pick(robot.programming, locale)}
            </p>
            <p className="mt-5 text-lg font-bold">{t('competition')}</p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              {pick(robot.competition, locale)}
            </p>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {robot.abilities.map((ability) => (
              <li
                key={ability.en}
                className="bg-background flex gap-3 rounded-lg p-4 font-semibold"
              >
                <Check className="text-success mt-0.5 size-5 shrink-0" aria-hidden />
                {pick(ability, locale)}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {robot.slug === 'momo' ? (
        <section className="py-16 lg:py-24">
          <Container>
            <SectionHeading title={t('momo.title')} intro={t('momo.intro')} />
            <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {momoGallery.map((view) => (
                <li key={view.id}>
                  <figure className="bg-surface overflow-hidden rounded-lg border">
                    <Image
                      src={view.src}
                      alt=""
                      placeholder="blur"
                      sizes="(min-width: 1024px) 17rem, 50vw"
                      className="aspect-square h-auto w-full bg-white object-contain p-2"
                    />
                    <figcaption className="border-t px-4 py-3 font-bold">
                      {pick(view.caption, locale)}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {[momoBoard.parts, momoBoard.pcb].map((item) => (
                <figure key={item.alt.en} className="bg-surface overflow-hidden rounded-lg border">
                  <Image
                    src={item.src}
                    alt={pick(item.alt, locale)}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 36rem, 100vw"
                    className="h-auto w-full bg-white"
                  />
                  <figcaption className="border-t px-4 py-3 font-bold">
                    {pick(item.alt, locale)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="asphalt py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div>
            <SectionHeading
              title={t('learn.title', { robot: robot.name })}
              intro={path ? pick(path.intro, locale) : undefined}
              tone="onDark"
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="light">
                <Link href={`/belajar/${robot.slug}`}>{t('learn.path')}</Link>
              </Button>
              {robot.sim ? (
                <Button asChild size="lg" variant="lightOutline">
                  <a href={simulatorUrl(locale, robot.sim)}>
                    <Gamepad2 aria-hidden />
                    {t('learn.simulator')}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
          <ol className="grid content-start gap-3">
            {steps.slice(0, 6).map((step, index) => (
              <li key={step.id}>
                <Link
                  href={`/belajar/${robot.slug}#${step.id}`}
                  className="flex items-center gap-4 rounded-lg border border-white/12 bg-white/[0.04] p-3 pr-5 text-white hover:bg-white/[0.08]"
                >
                  <StepNumber n={index + 1} className="border-white/70" />
                  <span className="font-bold">{pick(stepTitle(step), locale)}</span>
                </Link>
              </li>
            ))}
            {steps.length > 6 ? (
              <li className="pl-14 text-white/70">
                {t('learn.more', { count: steps.length - 6 })}
              </li>
            ) : null}
          </ol>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-3 lg:gap-10">
          <div>
            <h2 className="type-display text-[clamp(1.75rem,3vw,2.25rem)]">{t('inBox')}</h2>
            <ul className="mt-6 grid gap-2.5">
              {robot.inBox.map((item) => (
                <li key={item.en} className="flex gap-2.5">
                  <Check className="text-success mt-1 size-4 shrink-0" aria-hidden />
                  {pick(item, locale)}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="type-display text-[clamp(1.75rem,3vw,2.25rem)]">{t('specs')}</h2>
            <dl className="mt-6 border-t">
              {robot.specs.map((spec) => (
                <div
                  key={spec.label.en}
                  className="grid gap-1 border-b py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="text-muted-foreground font-semibold">
                    {pick(spec.label, locale)}
                  </dt>
                  <dd className="font-semibold">{pick(spec.value, locale)}</dd>
                </div>
              ))}
            </dl>
            <details className="mt-6">
              <summary className="cursor-pointer font-bold">{t('parts')}</summary>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {robot.parts.map((group) => (
                  <div key={group.group.en}>
                    <h3 className="font-bold">{pick(group.group, locale)}</h3>
                    <ul className="text-muted-foreground mt-2 grid gap-1.5">
                      {group.items.map((item) => (
                        <li key={item.en}>{pick(item, locale)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </Container>
      </section>

      {addOns.length > 0 ? (
        <section className="bg-surface border-t py-16 lg:py-24">
          <Container>
            <SectionHeading
              title={t('addOns', { robot: robot.name })}
              action={<TextLink href="/aksesori">{t('allAddOns')}</TextLink>}
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addOns.slice(0, 6).map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} locale={locale} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="py-16 lg:py-20">
        <Container className="flex flex-col gap-6 rounded-xl border p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[44rem]">
            <h2 className="type-display text-[clamp(1.5rem,2.6vw,2rem)]">{t('bulk.title')}</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              {t('bulk.body', { robot: robot.name })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="ink" size="lg">
              <Link href="/bisnis#beli-banyak">{t('bulk.action')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/bisnis#oem">{t('bulk.oem')}</Link>
            </Button>
          </div>
        </Container>
        {guides.length > 0 ? (
          <Container className="mt-10">
            <h2 className="text-lg font-bold">{t('guides')}</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <TextLink href={`/belajar/panduan/${guide.slug}`}>
                    {pick(guide.title, locale)}
                  </TextLink>
                </li>
              ))}
            </ul>
          </Container>
        ) : null}
      </section>
    </>
  );
}
