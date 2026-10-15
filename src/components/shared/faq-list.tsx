'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ulik/ui/components/accordion';

/** Questions and answers, one open at a time. Strings arrive already localised. */
export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <Accordion type="single" collapsible className="border-t">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b">
          <AccordionTrigger className="py-5 text-left text-lg font-bold">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-5 text-[1.0625rem] leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
