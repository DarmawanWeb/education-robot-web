import type { Locale } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';
import { ActionLink, ExternalAction } from '../ui/action-link';
import { Container } from '../ui/container';
import { ArenaDemo } from './arena-demo';

/** Headline set across the page like a box label, with the line follower running below it. */
export async function Hero({ locale }: { locale: Locale }) {
  const [t, common] = await Promise.all([getTranslations('Home.hero'), getTranslations('Common')]);
  return (
    <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
      <Container>
        <h1 className="type-label text-[clamp(2.7rem,8.2vw,6.4rem)]">
          {t.rich('title', {
            line: (chunks) => <span className="block text-balance">{chunks}</span>,
          })}
        </h1>
        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
          <div className="flex flex-col gap-7">
            <p className="max-w-[46ch] text-xl leading-relaxed">{t('body')}</p>
            <div className="flex flex-wrap gap-3">
              <ActionLink href="/contact">{common('requestProposal')}</ActionLink>
              <ExternalAction
                href={simulatorUrl(locale)}
                variant="plain"
                newTabLabel={common('newTab')}
              >
                {common('trySimulator')}
              </ExternalAction>
            </div>
            <p className="text-muted-foreground">{t('note')}</p>
          </div>
          <ArenaDemo />
        </div>
      </Container>
    </section>
  );
}
