'use server';

import { names } from '@taksu/content';
import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { lab, limits } from '@/server/lab';
import { createSession, passwordMatches, SESSION_COOKIE, SESSION_SECONDS } from '@/server/lab/auth';
import { isAdmin } from '@/server/lab/http';
import { ID_PATTERN } from '@/server/lab/ids';
import { removePhotos } from '@/server/lab/media';
import { clientKey } from '@/server/lab/rate-limit';
import {
  createReply,
  createThread,
  deleteBuild,
  deleteReply,
  deleteThread,
  publishBuild,
  publishReply,
  publishThread,
  setBuildFeatured,
  setThreadPinned,
  unpublishBuild,
} from '@/server/lab/repo';
import { replySchema, threadSchema } from '@/server/lab/validate';

export interface LoginState {
  error?: 'wrong' | 'rateLimited';
}

const localeOf = (formData: FormData) => (formData.get('locale') === 'en' ? 'en' : 'id');
const adminPath = (formData: FormData, tab?: string) =>
  `/${localeOf(formData)}/lab/admin${tab ? `?tab=${tab}` : ''}`;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const { config } = lab();
  if (!limits.login.check(clientKey(await headers())).allowed) return { error: 'rateLimited' };
  if (!passwordMatches(String(formData.get('password') ?? ''), config.adminPassword)) {
    return { error: 'wrong' };
  }
  (await cookies()).set(SESSION_COOKIE, createSession(config.secret), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
  redirect(adminPath(formData));
}

export async function logout(formData: FormData) {
  (await cookies()).delete(SESSION_COOKIE);
  redirect(adminPath(formData));
}

async function requireAdmin() {
  const context = lab();
  if (!(await isAdmin(context.config))) throw new Error('Moderators only.');
  return context;
}

/** Publish, reject, feature, pin, or delete one item. Every Lab page reads fresh afterwards. */
export async function moderate(formData: FormData) {
  const { config, db } = await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!ID_PATTERN.test(id)) return;
  switch (String(formData.get('action'))) {
    case 'publish-build':
      publishBuild(db, id);
      break;
    case 'feature-build':
      setBuildFeatured(db, id, true);
      break;
    case 'unfeature-build':
      setBuildFeatured(db, id, false);
      break;
    case 'unpublish-build':
      unpublishBuild(db, id);
      break;
    case 'delete-build':
      await removePhotos(config.dataDir, deleteBuild(db, id));
      break;
    case 'publish-thread':
      publishThread(db, id);
      break;
    case 'pin-thread':
      setThreadPinned(db, id, true);
      break;
    case 'unpin-thread':
      setThreadPinned(db, id, false);
      break;
    case 'delete-thread':
      deleteThread(db, id);
      break;
    case 'publish-reply':
      publishReply(db, id);
      break;
    case 'delete-reply':
      deleteReply(db, id);
      break;
    default:
      return;
  }
  revalidatePath('/[locale]/lab', 'layout');
}

// The Team badge already says who wrote it, so the author is just the line's name.
const team = () => names.edu;

/** A topic from the team, published straight away (forum rules, announcements). */
export async function teamThread(formData: FormData) {
  const { db } = await requireAdmin();
  const parsed = threadSchema.safeParse({
    category: formData.get('category'),
    title: formData.get('title'),
    body: formData.get('body'),
    author: team(),
    role: 'other',
    startedAt: 0,
    locale: localeOf(formData),
  });
  if (!parsed.success) return;
  createThread(db, parsed.data, { staff: true, status: 'published' });
  revalidatePath('/[locale]/lab', 'layout');
}

/** An answer from the team, published straight away. */
export async function teamReply(formData: FormData) {
  const { db } = await requireAdmin();
  const threadId = String(formData.get('threadId') ?? '');
  if (!ID_PATTERN.test(threadId)) return;
  const parsed = replySchema.safeParse({
    body: formData.get('body'),
    author: team(),
    role: 'other',
    startedAt: 0,
  });
  if (!parsed.success) return;
  createReply(db, threadId, parsed.data, { staff: true, status: 'published' });
  revalidatePath('/[locale]/lab', 'layout');
}
