import { educationLevels, type Locale } from '@taksu/content';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { KitBox } from '../kits/kit-box';
import { Container } from '../ui/container';
import { SectionTitle } from '../ui/section-title';

export async function KitShelf({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.kits');
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle title={t('title')} intro={t('intro')} />
          <Link
            href="/kits#compare"
            className="decoration-primary text-lg font-bold underline decoration-[3px] underline-offset-[6px] hover:decoration-[5px]"
          >
            {t('compare')}
          </Link>
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {educationLevels.map((level) => (
            <li key={level.slug}>
              <KitBox level={level} locale={locale} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
