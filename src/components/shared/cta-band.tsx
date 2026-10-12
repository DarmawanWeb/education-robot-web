import type { Locale } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { simulatorUrl } from '@/lib/links';
import { ActionLink, ExternalAction } from '../ui/action-link';
import { Container } from '../ui/container';

/** Closing call to action, set on ink so it reads as the end of the page. */
export async function CtaBand({ locale }: { locale: Locale }) {
  const [t, common] = await Promise.all([getTranslations('Schools'), getTranslations('Common')]);
  return (
    <section className="bg-ink text-ink-foreground print:hidden">
      <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <h2 className="type-label text-[clamp(2.2rem,4.6vw,3.6rem)]">{t('ctaTitle')}</h2>
          <p className="mt-4 text-lg leading-relaxed opacity-85">{t('ctaBody')}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ActionLink href="/contact" variant="onMat">
            {common('requestProposal')}
          </ActionLink>
          <ExternalAction
            href={simulatorUrl(locale)}
            variant="outline"
            newTabLabel={common('newTab')}
          >
            {common('trySimulator')}
          </ExternalAction>
        </div>
      </Container>
    </section>
  );
}
