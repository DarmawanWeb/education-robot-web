import { useTranslations } from 'next-intl';
import { ActionLink } from '@/components/ui/action-link';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <Container className="flex max-w-2xl flex-col items-start gap-5 py-28">
      <p className="type-label text-primary text-8xl">404</p>
      <h1 className="type-label text-4xl">{t('title')}</h1>
      <p className="text-muted-foreground text-lg">{t('body')}</p>
      <ActionLink href="/">{t('back')}</ActionLink>
    </Container>
  );
}
