'use client';

import { type LabKit, labKits, labRoles } from '@taksu/content';
import { cn } from '@taksu/ui/lib/utils';
import { ImagePlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  ChoiceChips,
  describedBy,
  Field,
  fieldClass,
  Honeypot,
  labelClass,
  submitClass,
} from './form-parts';
import { useLabSubmit } from './use-lab-submit';

const MAX_PHOTOS = 4;
const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface Picked {
  file: File;
  url: string;
}

/** Submit a build: text fields plus one to four photos, posted to /api/lab/builds. */
export function BuildForm({
  locale,
  challenges,
  initialChallenge,
}: {
  locale: string;
  challenges: { id: string; kit: LabKit; title: string }[];
  initialChallenge?: string;
}) {
  const t = useTranslations('Lab');
  const { state, send, reset } = useLabSubmit();
  const startChallenge = challenges.find((entry) => entry.id === initialChallenge);
  const [kit, setKit] = useState<LabKit>(startChallenge?.kit ?? 'sd');
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // Object URLs for the previews are released when photos change or the form unmounts.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(
    () => () => {
      for (const photo of photosRef.current) URL.revokeObjectURL(photo.url);
    },
    [],
  );

  useEffect(() => {
    if (state.status === 'error') summaryRef.current?.focus();
    if (state.status === 'done') doneRef.current?.focus();
  }, [state.status]);

  const error = (field: string) => {
    const code = state.fields[field];
    return code ? t(`errors.${code}` as 'errors.required') : null;
  };

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const next = [...photos];
    let problem: string | null = null;
    for (const file of Array.from(files)) {
      if (!TYPES.includes(file.type)) problem = 'photo-type';
      else if (file.size > MAX_BYTES) problem = 'photo-size';
      else if (next.length >= MAX_PHOTOS) problem = 'tooMany';
      else next.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos(next);
    setPhotoError(problem);
  }

  function removePhoto(index: number) {
    const photo = photos[index];
    if (photo) URL.revokeObjectURL(photo.url);
    setPhotos(photos.filter((_, position) => position !== index));
    setPhotoError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.delete('photos');
    for (const photo of photos) data.append('photos', photo.file);
    data.set('locale', locale);
    if (await send('/api/lab/builds', data)) {
      for (const photo of photos) URL.revokeObjectURL(photo.url);
      setPhotos([]);
    }
  }

  if (state.status === 'done') {
    return (
      <div className="border-edge bg-surface rounded-lg border-2 p-6 sm:p-8">
        <h2 ref={doneRef} tabIndex={-1} className="type-label text-3xl outline-none">
          {t('submit.doneTitle')}
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">{t('submit.doneBody')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              formRef.current?.reset();
            }}
            className={submitClass}
          >
            {t('submit.again')}
          </button>
          <Link
            href="/lab"
            className="border-edge bg-surface hover:bg-surface-muted inline-flex min-h-12 items-center rounded-md border-2 px-5 font-bold"
          >
            {t('submit.back')}
          </Link>
        </div>
      </div>
    );
  }

  const kitChallenges = challenges.filter((entry) => entry.kit === kit);
  const photosMessage = photoError
    ? t(`errors.${photoError}` as 'errors.required')
    : error('photos');

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="relative flex flex-col gap-10"
    >
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

      <fieldset className="flex flex-col gap-6">
        <legend className="type-label mb-2 text-2xl">{t('submit.aboutBuild')}</legend>
        <Field id="title" label={t('submit.title_label')} error={error('title')}>
          <input
            name="title"
            maxLength={80}
            placeholder={t('submit.title_placeholder')}
            className={cn(fieldClass, 'h-12')}
            {...describedBy('title', false, Boolean(error('title')))}
          />
        </Field>
        <ChoiceChips
          name="kit"
          legend={t('submit.kit')}
          defaultValue={kit}
          onChange={(value) => setKit(value as LabKit)}
          options={labKits.map((value) => ({ value, label: t(`kits.${value}`) }))}
          error={error('kit')}
        />
        {kitChallenges.length > 0 ? (
          <Field
            id="challenge"
            label={t('submit.challenge')}
            optional={t('optional')}
            error={error('challenge')}
          >
            <select
              key={kit}
              name="challenge"
              defaultValue={startChallenge?.kit === kit ? startChallenge.id : ''}
              className={cn(fieldClass, 'h-12')}
              {...describedBy('challenge', false, Boolean(error('challenge')))}
            >
              <option value="">{t('submit.challengeNone')}</option>
              {kitChallenges.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
        <Field
          id="summary"
          label={t('submit.summary')}
          hint={t('submit.summary_hint')}
          error={error('summary')}
        >
          <textarea
            name="summary"
            rows={4}
            maxLength={600}
            className={cn(fieldClass, 'min-h-28 py-3')}
            {...describedBy('summary', true, Boolean(error('summary')))}
          />
        </Field>
        <Field
          id="changes"
          label={t('submit.changes')}
          optional={t('optional')}
          hint={t('submit.changes_hint')}
          error={error('changes')}
        >
          <textarea
            name="changes"
            rows={3}
            maxLength={600}
            className={cn(fieldClass, 'min-h-24 py-3')}
            {...describedBy('changes', true, Boolean(error('changes')))}
          />
        </Field>

        <div className="flex flex-col gap-3">
          <span id="photos-label" className={labelClass}>
            {t('submit.photos')}
          </span>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <li
                key={photo.url}
                className="border-edge bg-surface-muted relative aspect-square overflow-hidden rounded-md border-2"
              >
                {/* biome-ignore lint/performance/noImgElement: local preview of a file that is not uploaded yet */}
                <img src={photo.url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label={t('submit.photos_remove', { n: index + 1 })}
                  className="border-edge bg-surface absolute top-1.5 right-1.5 grid size-8 place-items-center rounded-full border-2"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
            {photos.length < MAX_PHOTOS ? (
              <li>
                <label className="border-edge hover:bg-surface-muted has-[:focus-visible]:outline-ring flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-3 text-center font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2">
                  <ImagePlus className="size-7" aria-hidden />
                  {t('submit.photos_add')}
                  <input
                    type="file"
                    name="photos"
                    accept={TYPES.join(',')}
                    multiple
                    className="sr-only"
                    aria-labelledby="photos-label"
                    aria-describedby="photos-hint"
                    onChange={(event) => {
                      addPhotos(event.currentTarget.files);
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
              </li>
            ) : null}
          </ul>
          <p id="photos-hint" className="text-muted-foreground text-sm">
            {t('submit.photos_hint')}
          </p>
          {photosMessage ? <p className="text-danger text-sm font-bold">{photosMessage}</p> : null}
        </div>

        <Field
          id="video"
          label={t('submit.video')}
          optional={t('optional')}
          hint={t('submit.video_hint')}
          error={error('video')}
        >
          <input
            name="video"
            type="url"
            inputMode="url"
            placeholder="https://youtu.be/…"
            className={cn(fieldClass, 'h-12')}
            {...describedBy('video', true, Boolean(error('video')))}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="type-label mb-2 text-2xl">{t('submit.aboutYou')}</legend>
        <Field
          id="author"
          label={t('submit.author')}
          hint={t('submit.author_hint')}
          error={error('author')}
        >
          <input
            name="author"
            maxLength={60}
            placeholder={t('submit.author_placeholder')}
            className={cn(fieldClass, 'h-12')}
            {...describedBy('author', true, Boolean(error('author')))}
          />
        </Field>
        <ChoiceChips
          name="role"
          legend={t('submit.role')}
          defaultValue="teacher"
          options={labRoles.map((value) => ({ value, label: t(`roles.${value}`) }))}
          error={error('role')}
        />
        <div className="grid gap-6 sm:grid-cols-2">
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
          <Field id="city" label={t('submit.city')} optional={t('optional')} error={error('city')}>
            <input
              name="city"
              maxLength={60}
              className={cn(fieldClass, 'h-12')}
              {...describedBy('city', false, Boolean(error('city')))}
            />
          </Field>
        </div>
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
        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              className="accent-primary mt-1 size-5 shrink-0"
              aria-invalid={error('consent') ? true : undefined}
            />
            <span>{t('submit.consent')}</span>
          </label>
          {error('consent') ? (
            <p className="text-danger text-sm font-bold">{error('consent')}</p>
          ) : null}
        </div>
      </fieldset>

      <div>
        <button type="submit" disabled={state.status === 'sending'} className={submitClass}>
          {state.status === 'sending' ? t('submit.sending') : t('submit.send')}
        </button>
      </div>
    </form>
  );
}
