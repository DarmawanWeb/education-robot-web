'use client';

import { labRoles } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { type FormEvent, useEffect, useRef } from 'react';
import { ChoiceChips, describedBy, Field, fieldClass, Honeypot, submitClass } from './form-parts';
import { useLabSubmit } from './use-lab-submit';

/** A reply to a published thread, held for moderation. */
export function ReplyForm({ threadId, locale }: { threadId: string; locale: string }) {
  const t = useTranslations('Lab');
  const { state, send, reset } = useLabSubmit();
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus();
    if (state.status === 'done') doneRef.current?.focus();
  }, [state.status]);

  const error = (field: string) => {
    const code = state.fields[field];
    return code ? t(`errors.${code}` as 'errors.required') : null;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    await send(`/api/lab/threads/${threadId}/replies`, { ...data, locale });
  }

  if (state.status === 'done') {
    return (
      <div className="border-edge bg-surface rounded-lg border-2 p-6">
        <p ref={doneRef} tabIndex={-1} className="text-xl font-bold outline-none">
          {t('thread.doneTitle')}
        </p>
        <p className="text-muted-foreground mt-2">{t('thread.doneBody')}</p>
        <button type="button" onClick={reset} className={cn(submitClass, 'mt-5')}>
          {t('thread.again')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">
      <Honeypot label={t('honeypot')} />
      {state.status === 'error' && state.error ? (
        <p
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="bg-danger/10 border-danger text-danger rounded-md border-l-4 px-4 py-3 font-bold outline-none"
        >
          {t(`errors.${state.error}` as 'errors.summary')}
        </p>
      ) : null}
      <Field id="body" label={t('thread.reply')} error={error('body')}>
        <textarea
          name="body"
          rows={5}
          maxLength={2000}
          className={cn(fieldClass, 'min-h-32 py-3')}
          {...describedBy('body', false, Boolean(error('body')))}
        />
      </Field>
      <Field id="author" label={t('submit.author')} error={error('author')}>
        <input
          name="author"
          maxLength={60}
          autoComplete="given-name"
          className={cn(fieldClass, 'h-12 sm:max-w-sm')}
          {...describedBy('author', false, Boolean(error('author')))}
        />
      </Field>
      <ChoiceChips
        name="role"
        legend={t('submit.role')}
        defaultValue="teacher"
        options={labRoles.map((value) => ({ value, label: t(`roles.${value}`) }))}
        error={error('role')}
      />
      <div>
        <button type="submit" disabled={state.status === 'sending'} className={submitClass}>
          {state.status === 'sending' ? t('thread.sending') : t('thread.send')}
        </button>
      </div>
    </form>
  );
}
