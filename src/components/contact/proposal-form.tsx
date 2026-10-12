'use client';

import { cn } from '@taksu/ui/lib/utils';
import { Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FormEvent, useState } from 'react';
import { mailtoUrl, whatsappUrl } from '@/lib/links';

const roles = ['teacher', 'principal', 'foundation', 'other'] as const;
type Role = (typeof roles)[number];
type Channel = 'whatsapp' | 'email';

const field =
  'border-edge bg-surface placeholder:text-muted-foreground w-full rounded-md border-2 px-3.5 text-base outline-none focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2';
const label = 'text-[0.95rem] font-bold';

/**
 * Writes the proposal request client-side and hands it to WhatsApp or the mail app,
 * so the site stays static with no form backend to secure.
 */
export function ProposalForm({
  email,
  whatsappNumber,
  kits,
}: {
  email: string;
  whatsappNumber: string;
  kits: string[];
}) {
  const t = useTranslations('Contact.form');
  const [error, setError] = useState<string | null>(null);
  const hasWhatsapp = whatsappUrl('-', whatsappNumber) !== null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel = (submitter?.value ?? 'email') as Channel;
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const name = value('name');
    const school = value('school');
    const message = value('message');
    if (!name || !school || !message) {
      setError(t('required'));
      return;
    }
    setError(null);

    const role = (value('role') || 'other') as Role;
    const text = t('template', {
      name,
      school,
      role: t(`roles.${role}`),
      kit: value('kit') || t('kitUnsure'),
      students: value('students') || '-',
      message,
    });

    if (channel === 'whatsapp') {
      const url = whatsappUrl(text, whatsappNumber);
      if (url) window.open(url, '_blank', 'noopener');
      return;
    }
    window.location.href = mailtoUrl(email, t('subject'), text);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={label}>{t('name')}</span>
          <input name="name" autoComplete="name" required className={cn(field, 'h-12')} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={label}>{t('school')}</span>
          <input name="school" autoComplete="organization" required className={cn(field, 'h-12')} />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={cn(label, 'mb-2')}>{t('role')}</legend>
        <div className="flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <label
              key={role}
              className="border-edge has-[:checked]:bg-ink has-[:checked]:text-ink-foreground has-[:focus-visible]:outline-ring flex cursor-pointer items-center rounded-md border-2 px-4 py-2 font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
            >
              <input
                type="radio"
                name="role"
                value={role}
                defaultChecked={index === 0}
                className="sr-only"
              />
              {t(`roles.${role}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={label}>{t('kit')}</span>
          <select name="kit" defaultValue="" className={cn(field, 'h-12')}>
            <option value="">{t('kitUnsure')}</option>
            {kits.map((kit) => (
              <option key={kit} value={kit}>
                {kit}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className={label}>{t('students')}</span>
          <input
            name="students"
            type="number"
            inputMode="numeric"
            min={1}
            className={cn(field, 'h-12')}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={label}>{t('message')}</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t('messagePlaceholder')}
          className={cn(field, 'min-h-32 py-3')}
        />
      </label>

      {error ? (
        <p role="alert" className="text-danger font-bold">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="channel"
          value="whatsapp"
          disabled={!hasWhatsapp}
          className="border-edge bg-primary text-primary-foreground inline-flex min-h-12 items-center gap-2 rounded-md border-2 px-5 font-bold shadow-[3px_3px_0_0_var(--edge)] transition-[transform,box-shadow] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--edge)] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-5"
        >
          <MessageCircle aria-hidden />
          {t('sendWhatsapp')}
        </button>
        <button
          type="submit"
          name="channel"
          value="email"
          className="border-edge bg-surface hover:bg-surface-muted inline-flex min-h-12 items-center gap-2 rounded-md border-2 px-5 font-bold [&_svg]:size-5"
        >
          <Mail aria-hidden />
          {t('sendEmail')}
        </button>
      </div>
      {!hasWhatsapp ? <p className="text-muted-foreground">{t('whatsappMissing')}</p> : null}
    </form>
  );
}
