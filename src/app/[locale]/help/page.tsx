import { brand, faq, pick } from '@dctedu/catalog';
import { Button } from '@dctedu/ui/components/button';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/seo/json-ld';
import { BuyChannels } from '@/components/shared/buy-channels';
import { FaqList } from '@/components/shared/faq-list';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { TextLink } from '@/components/ui/text-link';
import { mailtoUrl, whatsappUrl } from '@/lib/links';
import { localeFromParams, resolveLocale } from '@/lib/locale';
import { pageMetadata } from '@/lib/metadata';
import { faqPage } from '@/lib/structured-data';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'Help' });
  return pageMetadata({ locale, path: '/help', title: t('title'), description: t('intro') });
}

export default async function HelpPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations('Help');
  const whatsapp = whatsappUrl(t('contact.message'));
  const questions = faq.map((item) => ({
    id: item.id,
    question: pick(item.question, locale),
    answer: pick(item.answer, locale),
  }));

  return (
    <>
      <JsonLd data={faqPage(questions)} />
      <section className="pt-14 pb-4 lg:pt-20">
        <Container>
          <h1 className="type-display text-[clamp(2.5rem,6vw,4.5rem)]">{t('title')}</h1>
          <p className="text-muted-foreground mt-5 max-w-[60ch] text-lg leading-relaxed">
            {t('intro')}
          </p>
        </Container>
      </section>

      <BuyChannels />

      <section id="faq" className="bg-surface scroll-mt-16 border-y py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <SectionHeading title={t('faq')} className="self-start" />
          <FaqList items={questions} />
        </Container>
      </section>

      <section id="contact" className="scroll-mt-16 py-16 lg:py-24">
        <Container className="max-w-4xl">
          <div className="asphalt rounded-xl p-7 text-white sm:p-10">
            <h2 className="type-display text-[clamp(1.75rem,3.2vw,2.5rem)]">
              {t('contact.title')}
            </h2>
            <p className="mt-4 leading-relaxed text-white/75">{t('contact.body')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {whatsapp ? (
                <Button asChild size="lg" variant="light">
                  <a href={whatsapp}>
                    <MessageCircle aria-hidden />
                    {t('contact.whatsapp')}
                  </a>
                </Button>
              ) : null}
              <Button asChild size="lg" variant={whatsapp ? 'lightOutline' : 'light'}>
                <a href={mailtoUrl(t('contact.subject'), t('contact.message'))}>
                  <Mail aria-hidden />
                  {t('contact.email')}
                </a>
              </Button>
            </div>
            <TextLink href="/learn#guides" tone="onDark" className="mt-8">
              {t('contact.guides')}
            </TextLink>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/65">
              <MapPin className="size-4" aria-hidden />
              {t('contact.from', { location: pick(brand.location, locale) })}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
