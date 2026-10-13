'use client';

import { cn } from '@taksu/ui/lib/utils';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { type LoginState, login } from '@/app/[locale]/lab/admin/actions';
import { fieldClass, submitClass } from '../form-parts';

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('Lab.admin');
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="flex max-w-sm flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <label className="flex flex-col gap-2">
        <span className="font-bold">{t('password')}</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className={cn(fieldClass, 'h-12')}
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-danger font-bold">
          {t(state.error)}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={cn(submitClass, 'self-start')}>
        {t('login')}
      </button>
    </form>
  );
}
