import type { Locale } from '@dctedu/catalog';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import simEn from '@/assets/sim/sim-en.webp';
import simId from '@/assets/sim/sim-id.webp';
import { simulatorUrl } from '@/lib/links';
import { Container } from '../ui/container';
import { SectionHeading } from '../ui/section-heading';
import { TextLink } from '../ui/text-link';

/** What Ciko's signal mission compiles to, straight from the simulator's C++ panel. */
const SNIPPET = `robot.forward(50, 5330);
robot.signal(Signal::Left, true);
delay(1000);
robot.turnLeft(50, 630);
robot.signal(Signal::Off);`;

/**
 * Every robot comes with a way to understand it: the learning path, the simulator, and code
 * that carries over to the Arduino IDE.
 */
export async function ComesWith({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.comesWith');
  return (
    <section className="bg-surface border-y py-20 lg:py-28">
      <Container>
        <SectionHeading title={t('title')} intro={t('intro')} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <figure>
            <div className="overflow-hidden rounded-xl border shadow-[0_24px_48px_-24px_rgb(31_34_40/0.35)]">
              <Image
                src={locale === 'en' ? simEn : simId}
                alt={t('imageAlt')}
                placeholder="blur"
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="text-muted-foreground mt-3 text-sm">{t('caption')}</figcaption>
          </figure>
          <dl className="divide-y border-y self-start">
            <div className="py-5">
              <dt className="text-lg font-bold">{t('path.title')}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{t('path.body')}</dd>
              <dd className="mt-3">
                <TextLink href="/learn">{t('path.link')}</TextLink>
              </dd>
            </div>
            <div className="py-5">
              <dt className="text-lg font-bold">{t('sim.title')}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{t('sim.body')}</dd>
              <dd className="mt-3">
                <a
                  href={simulatorUrl(locale)}
                  className="decoration-primary font-bold underline decoration-2 underline-offset-[6px] hover:decoration-[3px]"
                >
                  {t('sim.link')}
                </a>
              </dd>
            </div>
            <div className="py-5">
              <dt className="text-lg font-bold">{t('code.title')}</dt>
              <dd className="text-muted-foreground mt-1 leading-relaxed">{t('code.body')}</dd>
              <dd className="mt-3">
                <pre className="bg-ink overflow-x-auto rounded-lg p-4 text-[0.8125rem] leading-relaxed text-white">
                  <code>{SNIPPET}</code>
                </pre>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
