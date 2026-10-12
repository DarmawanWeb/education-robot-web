import { getTranslations } from 'next-intl/server';
import { Container } from '../ui/container';
import { SectionTitle } from '../ui/section-title';
import { LearningTrack } from './learning-track';

export async function PathSection() {
  const t = await getTranslations('Home.path');
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <SectionTitle title={t('title')} intro={t('intro')} />
        <div className="mt-12 lg:mt-16">
          <LearningTrack />
        </div>
      </Container>
    </section>
  );
}
