import { RaceNumber } from '@taksu/edu-ui/brand/race-number';
import { Button } from '@taksu/edu-ui/components/button';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/navigation';

/** A wrong turn: the mystery number plate, and two ways back. */
export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <Container className="py-24 lg:py-32">
      <div className="flex max-w-3xl flex-col items-start">
        <RaceNumber value={null} size="xl" />
        <h1 className="type-display mt-8 text-[clamp(2.25rem,5vw,3.75rem)]">{t('title')}</h1>
        <p className="text-muted-foreground mt-4 max-w-[48ch] text-lg leading-relaxed">
          {t('body')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="ink">
            <Link href="/robot">{t('robots')}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">{t('home')}</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
