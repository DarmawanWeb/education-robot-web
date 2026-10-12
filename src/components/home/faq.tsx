import { eduFaq, type Locale, pick } from '@taksu/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@taksu/ui/components/accordion';
import { getTranslations } from 'next-intl/server';
import { Container } from '../ui/container';

/** Questions schools ask before buying, answered plainly. */
export async function Faq({ locale }: { locale: Locale }) {
  const t = await getTranslations('Home.faq');
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <h2 className="type-label text-[clamp(1.9rem,3.8vw,3rem)] lg:sticky lg:top-28 lg:self-start">
          {t('title')}
        </h2>
        <Accordion type="single" collapsible className="border-edge border-t-2">
          {eduFaq.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-edge border-b-2">
              <AccordionTrigger className="hover:text-foreground py-6 text-lg font-bold hover:underline hover:decoration-primary hover:decoration-[3px] hover:underline-offset-[6px]">
                {pick(item.question, locale)}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] text-[1.0625rem] leading-relaxed">
                {pick(item.answer, locale)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
