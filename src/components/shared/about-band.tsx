import { brand, type Locale, pick } from '@dctedu/catalog';
import { MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Container } from '../ui/container';
import { TextLink } from '../ui/text-link';

/** Who is behind the robots: the brand's story and the company, said once, on the home page. */
export async function AboutBand({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.about');
  return (
    <section id="about" className="bg-surface scroll-mt-16 border-t py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <h2 className="type-display text-[clamp(2rem,3.4vw,2.75rem)]">{t('title')}</h2>
          <p className="text-primary mt-3 font-bold">{t('company', { company: brand.company })}</p>
          <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm font-semibold">
            <MapPin className="size-4" aria-hidden />
            {pick(brand.location, locale)}
          </p>
        </div>
        <div>
          <p className="text-lg leading-relaxed">{pick(brand.story, locale)}</p>
          <TextLink href="/help#contact" className="mt-6">
            {t('more')}
          </TextLink>
        </div>
      </Container>
    </section>
  );
}
