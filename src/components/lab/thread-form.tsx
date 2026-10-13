'use client';

import { labRoles } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { type FormEvent, useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { ChoiceChips, describedBy, Field, fieldClass, Honeypot, submitClass } from './form-parts';
import { useLabSubmit } from './use-lab-submit';

/** A new forum question, posted as JSON to /api/lab/threads. */
export function ThreadForm({
  locale,
  categories,
  initialCategory,
}: {
  locale: string;
  categories: { id: string; title: string }[];
  initialCategory?: string;
}) {
  const t = useTranslations('Lab');
  const { state, send, reset } = useLabSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

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
    await send('/api/lab/threads', { ...data, locale });
  }

  if (state.status === 'done') {
    return (
      <div className="border-edge bg-surface rounded-lg border-2 p-6 sm:p-8">
        <h2 ref={doneRef} tabIndex={-1} className="type-label text-3xl outline-none">
          {t('newThread.doneTitle')}
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">{t('newThread.doneBody')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              formRef.current?.reset();
            }}
            className={submitClass}
          >
            {t('newThread.again')}
          </button>
          <Link
            href="/lab/forum"
            className="border-edge bg-surface hover:bg-surface-muted inline-flex min-h-12 items-center rounded-md border-2 px-5 font-bold"
          >
            {t('newThread.back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">
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
      <ChoiceChips
        name="category"
        legend={t('newThread.category')}
        defaultValue={initialCategory ?? categories[0]?.id}
        options={categories.map((category) => ({ value: category.id, label: category.title }))}
        error={error('category')}
      />
      <Field id="title" label={t('newThread.title_label')} error={error('title')}>
        <input
          name="title"
          maxLength={120}
          placeholder={t('newThread.title_placeholder')}
          className={cn(fieldClass, 'h-12')}
          {...describedBy('title', false, Boolean(error('title')))}
        />
      </Field>
      <Field id="body" label={t('newThread.body')} error={error('body')}>
        <textarea
          name="body"
          rows={7}
          maxLength={3000}
          className={cn(fieldClass, 'min-h-40 py-3')}
          {...describedBy('body', false, Boolean(error('body')))}
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="author" label={t('submit.author')} error={error('author')}>
          <input
            name="author"
            maxLength={60}
            autoComplete="given-name"
            className={cn(fieldClass, 'h-12')}
            {...describedBy('author', false, Boolean(error('author')))}
          />
        </Field>
        <Field
          id="school"
          label={t('submit.school')}
          optional={t('optional')}
          error={error('school')}
        >
          <input
            name="school"
            maxLength={100}
            autoComplete="organization"
            className={cn(fieldClass, 'h-12')}
            {...describedBy('school', false, Boolean(error('school')))}
          />
        </Field>
      </div>
      <ChoiceChips
        name="role"
        legend={t('submit.role')}
        defaultValue="teacher"
        options={labRoles.map((value) => ({ value, label: t(`roles.${value}`) }))}
        error={error('role')}
      />
      <Field
        id="contact"
        label={t('submit.contact')}
        optional={t('optional')}
        hint={t('submit.contact_hint')}
        error={error('contact')}
      >
        <input
          name="contact"
          maxLength={100}
          autoComplete="email"
          className={cn(fieldClass, 'h-12')}
          {...describedBy('contact', true, Boolean(error('contact')))}
        />
      </Field>
      <div>
        <button type="submit" disabled={state.status === 'sending'} className={submitClass}>
          {state.status === 'sending' ? t('newThread.sending') : t('newThread.send')}
        </button>
      </div>
    </form>
  );
}
