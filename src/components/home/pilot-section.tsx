import { getTranslations } from 'next-intl/server';
import { PilotSteps } from '../schools/pilot-steps';
import { Container } from '../ui/container';
import { SectionTitle } from '../ui/section-title';
import { TextLink } from '../ui/text-link';

export async function PilotSection() {
  const t = await getTranslations('Home.schools');
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle title={t('title')} intro={t('intro')} />
          <TextLink href="/schools">{t('more')}</TextLink>
        </div>
        <div className="mt-12">
          <PilotSteps />
        </div>
      </Container>
    </section>
  );
}
