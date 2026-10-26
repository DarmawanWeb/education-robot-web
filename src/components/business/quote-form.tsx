'use client';

import { Button } from '@dctedu/ui/components/button';
import { Input } from '@dctedu/ui/components/input';
import { Label } from '@dctedu/ui/components/label';
import { Textarea } from '@dctedu/ui/components/textarea';
import { cn } from '@dctedu/ui/lib/utils';
import { CheckCircle2, Mail, MessageCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { type FormEvent, useEffect, useId, useState } from 'react';
import { mailtoUrl, whatsappUrl } from '@/lib/links';
import {
  buildQuote,
  isQuoteKind,
  type QuoteKind,
  type QuoteQuantity,
  quoteKinds,
  quoteQuantities,
} from '@/lib/quote';

const UNSURE = 'unsure';

const choice = (selected: boolean) =>
  cn(
    'flex cursor-pointer items-center gap-2.5 rounded-lg border-2 px-4 py-3 font-bold',
    selected ? 'border-edge bg-surface' : 'bg-surface hover:border-muted-foreground border-border',
  );

/**
 * A quote request for bulk orders and OEM. It opens as a WhatsApp message or an email; nothing
 * is stored on the site. Links to #inquiry-oem (or another kind) preselect what the buyer needs.
 */
export function QuoteForm({ robots }: { robots: { slug: string; name: string }[] }) {
  const t = useTranslations('Business.form');
  const quote = useTranslations('Business.quote');
  const locale = useLocale();
  const id = useId();
  const [kind, setKind] = useState<QuoteKind>('bulk');
  const [chosen, setChosen] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<QuoteQuantity | null>(null);
  const [text, setText] = useState({ org: '', name: '', phone: '', city: '', message: '' });
  const [sent, setSent] = useState(false);
  const canWhatsapp = whatsappUrl('') !== null;

  useEffect(() => {
    const fromHash = () => {
      const value = window.location.hash.replace('#inquiry-', '');
      if (isQuoteKind(value)) setKind(value);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const field = (key: keyof typeof text) => ({
    id: `${id}-${key}`,
    name: key,
    value: text[key],
    onChange: (event: { target: { value: string } }) =>
      setText((current) => ({ ...current, [key]: event.target.value })),
  });

  const toggle = (slug: string) =>
    setChosen((current) =>
      current.includes(slug) ? current.filter((entry) => entry !== slug) : [...current, slug],
    );

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const names = chosen.map((slug) =>
      slug === UNSURE ? t('unsure') : (robots.find((robot) => robot.slug === slug)?.name ?? slug),
    );
    const { text: message, subject } = buildQuote(
      {
        kind: t(`kinds.${kind}`),
        org: text.org,
        name: text.name,
        phone: text.phone,
        city: text.city,
        robots: new Intl.ListFormat(locale, { type: 'conjunction' }).format(names),
        quantity: quantity ? t(`quantities.${quantity}`) : '',
        message: text.message,
      },
      (key, values) => quote(key, values),
    );
    const whatsapp = submitter?.value === 'email' ? null : whatsappUrl(message);
    if (whatsapp) {
      const opened = window.open(whatsapp, '_blank');
      if (opened) opened.opener = null;
      else window.location.href = whatsapp;
    } else {
      window.location.href = mailtoUrl(subject, message);
    }
    setSent(true);
  };

  return (
    <form onSubmit={send} className="bg-surface grid gap-6 rounded-xl border p-6 sm:p-8">
      <fieldset>
        <legend className="text-sm font-semibold">{t('kind')}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {quoteKinds.map((entry) => (
            <label
              key={entry}
              id={`tanya-${entry}`}
              className={cn(choice(kind === entry), 'scroll-mt-28')}
            >
              <input
                type="radio"
                name="kind"
                value={entry}
                checked={kind === entry}
                onChange={() => setKind(entry)}
                className="accent-edge size-4"
              />
              {t(`kinds.${entry}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-org`}>{t('org')}</Label>
          <Input {...field('org')} autoComplete="organization" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-name`}>{t('name')}</Label>
          <Input {...field('name')} required autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-phone`}>{t('phone')}</Label>
          <Input {...field('phone')} type="tel" inputMode="tel" required autoComplete="tel" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor={`${id}-city`}>{t('city')}</Label>
          <Input {...field('city')} autoComplete="address-level2" />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{t('robots')}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[...robots, { slug: UNSURE, name: t('unsure') }].map((robot) => (
            <label key={robot.slug} className={choice(chosen.includes(robot.slug))}>
              <input
                type="checkbox"
                name="robots"
                value={robot.slug}
                checked={chosen.includes(robot.slug)}
                onChange={() => toggle(robot.slug)}
                className="accent-edge size-4"
              />
              {robot.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">{t('quantity')}</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {quoteQuantities.map((entry) => (
            <label key={entry} className={cn(choice(quantity === entry), 'text-[0.9375rem]')}>
              <input
                type="radio"
                name="quantity"
                value={entry}
                checked={quantity === entry}
                onChange={() => setQuantity(entry)}
                className="accent-edge size-4"
              />
              {t(`quantities.${entry}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-message`}>{t('message')}</Label>
        <Textarea
          {...field('message')}
          rows={4}
          aria-describedby={`${id}-hint`}
          className="min-h-0"
        />
        <p id={`${id}-hint`} className="text-muted-foreground text-sm">
          {t('messageHint')}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {canWhatsapp ? (
          <Button type="submit" value="whatsapp" size="lg" variant="ink">
            <MessageCircle aria-hidden />
            {t('whatsapp')}
          </Button>
        ) : null}
        <Button type="submit" value="email" size="lg" variant={canWhatsapp ? 'outline' : 'ink'}>
          <Mail aria-hidden />
          {t('email')}
        </Button>
      </div>
      <p role="status" className={cn('flex gap-2 font-semibold', !sent && 'sr-only')}>
        {sent ? (
          <>
            <CheckCircle2 className="text-success mt-0.5 size-5 shrink-0" aria-hidden />
            {t('sent')}
          </>
        ) : null}
      </p>
    </form>
  );
}
