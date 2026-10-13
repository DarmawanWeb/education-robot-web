import type { DatabaseSync, SQLInputValue, SQLOutputValue } from 'node:sqlite';
import type { LabKit, LabRole } from '@taksu/content';
import { newId } from './ids';
import type { BuildInput, ReplyInput, ThreadInput } from './validate';

export type Status = 'pending' | 'published' | 'rejected';

export interface Photo {
  id: string;
  position: number;
  width: number;
  height: number;
}

export interface Build {
  id: string;
  status: Status;
  featured: boolean;
  kit: LabKit;
  challenge: string | null;
  title: string;
  summary: string;
  changes: string;
  videoId: string | null;
  author: string;
  school: string;
  city: string;
  role: LabRole;
  /** Private: shown to moderators only. */
  contact: string;
  locale: string;
  createdAt: string;
  publishedAt: string | null;
  photos: Photo[];
}

export interface Thread {
  id: string;
  status: Status;
  category: string;
  title: string;
  body: string;
  author: string;
  role: LabRole;
  school: string;
  /** Private: shown to moderators only. */
  contact: string;
  staff: boolean;
  pinned: boolean;
  locale: string;
  createdAt: string;
  publishedAt: string | null;
  lastActivityAt: string;
  /** Published replies. */
  replyCount: number;
}

export interface Reply {
  id: string;
  threadId: string;
  status: Status;
  body: string;
  author: string;
  role: LabRole;
  staff: boolean;
  createdAt: string;
  publishedAt: string | null;
}

type Row = Record<string, SQLOutputValue>;

const text = (value: SQLOutputValue | undefined) =>
  value === null || value === undefined ? '' : String(value);
const maybe = (value: SQLOutputValue | undefined) =>
  value === null || value === undefined ? null : String(value);

function toBuild(row: Row, photos: Photo[]): Build {
  return {
    id: text(row.id),
    status: text(row.status) as Status,
    featured: Number(row.featured) === 1,
    kit: text(row.kit) as LabKit,
    challenge: maybe(row.challenge),
    title: text(row.title),
    summary: text(row.summary),
    changes: text(row.changes),
    videoId: maybe(row.video_id),
    author: text(row.author),
    school: text(row.school),
    city: text(row.city),
    role: text(row.role) as LabRole,
    contact: text(row.contact),
    locale: text(row.locale),
    createdAt: text(row.created_at),
    publishedAt: maybe(row.published_at),
    photos,
  };
}

function toThread(row: Row): Thread {
  return {
    id: text(row.id),
    status: text(row.status) as Status,
    category: text(row.category),
    title: text(row.title),
    body: text(row.body),
    author: text(row.author),
    role: text(row.role) as LabRole,
    school: text(row.school),
    contact: text(row.contact),
    staff: Number(row.staff) === 1,
    pinned: Number(row.pinned) === 1,
    locale: text(row.locale),
    createdAt: text(row.created_at),
    publishedAt: maybe(row.published_at),
    lastActivityAt: text(row.last_activity_at),
    replyCount: Number(row.reply_count ?? 0),
  };
}

function toReply(row: Row): Reply {
  return {
    id: text(row.id),
    threadId: text(row.thread_id),
    status: text(row.status) as Status,
    body: text(row.body),
    author: text(row.author),
    role: text(row.role) as LabRole,
    staff: Number(row.staff) === 1,
    createdAt: text(row.created_at),
    publishedAt: maybe(row.published_at),
  };
}

function photosFor(db: DatabaseSync, buildIds: string[]): Map<string, Photo[]> {
  const byBuild = new Map<string, Photo[]>();
  if (buildIds.length === 0) return byBuild;
  const rows = db
    .prepare(
      `SELECT id, build_id, position, width, height FROM photos
       WHERE build_id IN (${buildIds.map(() => '?').join(',')}) ORDER BY position`,
    )
    .all(...buildIds) as Row[];
  for (const row of rows) {
    const list = byBuild.get(text(row.build_id)) ?? [];
    list.push({
      id: text(row.id),
      position: Number(row.position),
      width: Number(row.width),
      height: Number(row.height),
    });
    byBuild.set(text(row.build_id), list);
  }
  return byBuild;
}

function transaction<T>(db: DatabaseSync, run: () => T): T {
  db.exec('BEGIN');
  try {
    const result = run();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

/* ---------------------------------------------------------------- builds */

export function createBuild(
  db: DatabaseSync,
  input: BuildInput,
  photos: Omit<Photo, 'position'>[],
  now = new Date(),
): string {
  const id = newId();
  transaction(db, () => {
    db.prepare(
      `INSERT INTO builds (id, status, kit, challenge, title, summary, changes, video_id, author,
         school, city, role, contact, locale, created_at)
       VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      input.kit,
      input.challenge,
      input.title,
      input.summary,
      input.changes,
      input.videoId,
      input.author,
      input.school,
      input.city,
      input.role,
      input.contact,
      input.locale,
      now.toISOString(),
    );
    const insert = db.prepare(
      'INSERT INTO photos (id, build_id, position, width, height) VALUES (?, ?, ?, ?, ?)',
    );
    photos.forEach((photo, position) => {
      insert.run(photo.id, id, position, photo.width, photo.height);
    });
  });
  return id;
}

export function listBuilds(
  db: DatabaseSync,
  {
    status = 'published',
    featured,
    kit,
    limit = 60,
  }: { status?: Status; featured?: boolean; kit?: LabKit; limit?: number } = {},
): Build[] {
  const where = ['status = ?'];
  const params: SQLInputValue[] = [status];
  if (featured !== undefined) {
    where.push('featured = ?');
    params.push(featured ? 1 : 0);
  }
  if (kit) {
    where.push('kit = ?');
    params.push(kit);
  }
  const order = status === 'published' ? 'published_at DESC' : 'created_at ASC';
  const rows = db
    .prepare(`SELECT * FROM builds WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ?`)
    .all(...params, limit) as Row[];
  const photos = photosFor(
    db,
    rows.map((row) => text(row.id)),
  );
  return rows.map((row) => toBuild(row, photos.get(text(row.id)) ?? []));
}

export function getBuild(db: DatabaseSync, id: string): Build | undefined {
  const row = db.prepare('SELECT * FROM builds WHERE id = ?').get(id) as Row | undefined;
  if (!row) return undefined;
  return toBuild(row, photosFor(db, [id]).get(id) ?? []);
}

export function publishBuild(db: DatabaseSync, id: string, now = new Date()): boolean {
  const result = db
    .prepare(
      `UPDATE builds SET status = 'published', published_at = COALESCE(published_at, ?)
       WHERE id = ?`,
    )
    .run(now.toISOString(), id);
  return Number(result.changes) > 0;
}

export function unpublishBuild(db: DatabaseSync, id: string): boolean {
  const result = db
    .prepare(`UPDATE builds SET status = 'pending', featured = 0 WHERE id = ?`)
    .run(id);
  return Number(result.changes) > 0;
}

export function setBuildFeatured(db: DatabaseSync, id: string, featured: boolean): boolean {
  const result = db
    .prepare(`UPDATE builds SET featured = ? WHERE id = ? AND status = 'published'`)
    .run(featured ? 1 : 0, id);
  return Number(result.changes) > 0;
}

/** Deletes a build and returns its photo ids so the files can be removed too. */
export function deleteBuild(db: DatabaseSync, id: string): string[] {
  return transaction(db, () => {
    const photos = (db.prepare('SELECT id FROM photos WHERE build_id = ?').all(id) as Row[]).map(
      (row) => text(row.id),
    );
    db.prepare('DELETE FROM builds WHERE id = ?').run(id);
    return photos;
  });
}

/** The build a photo belongs to, for deciding who may see the file. */
export function photoOwner(
  db: DatabaseSync,
  photoId: string,
): { buildId: string; status: Status } | undefined {
  const row = db
    .prepare(
      `SELECT builds.id AS build_id, builds.status AS status FROM photos
       JOIN builds ON builds.id = photos.build_id WHERE photos.id = ?`,
    )
    .get(photoId) as Row | undefined;
  return row ? { buildId: text(row.build_id), status: text(row.status) as Status } : undefined;
}

/* --------------------------------------------------------------- threads */

export function createThread(
  db: DatabaseSync,
  input: ThreadInput,
  { staff = false, status = 'pending' }: { staff?: boolean; status?: Status } = {},
  now = new Date(),
): string {
  const id = newId();
  const at = now.toISOString();
  db.prepare(
    `INSERT INTO threads (id, status, category, title, body, author, role, school, contact, staff,
       locale, created_at, published_at, last_activity_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    status,
    input.category,
    input.title,
    input.body,
    input.author,
    input.role,
    input.school,
    input.contact,
    staff ? 1 : 0,
    input.locale,
    at,
    status === 'published' ? at : null,
    at,
  );
  return id;
}

const threadColumns = `threads.*, (SELECT COUNT(*) FROM replies
  WHERE replies.thread_id = threads.id AND replies.status = 'published') AS reply_count`;

export function listThreads(
  db: DatabaseSync,
  {
    status = 'published',
    category,
    limit = 50,
  }: { status?: Status; category?: string; limit?: number } = {},
): Thread[] {
  const where = ['status = ?'];
  const params: SQLInputValue[] = [status];
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  const order = status === 'published' ? 'pinned DESC, last_activity_at DESC' : 'created_at ASC';
  return (
    db
      .prepare(
        `SELECT ${threadColumns} FROM threads WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ?`,
      )
      .all(...params, limit) as Row[]
  ).map(toThread);
}

/** Published threads per category, for the forum's category list. */
export function threadCounts(db: DatabaseSync): Map<string, number> {
  const rows = db
    .prepare(
      `SELECT category, COUNT(*) AS count FROM threads WHERE status = 'published' GROUP BY category`,
    )
    .all() as Row[];
  return new Map(rows.map((row) => [text(row.category), Number(row.count)]));
}

export function getThread(db: DatabaseSync, id: string): Thread | undefined {
  const row = db.prepare(`SELECT ${threadColumns} FROM threads WHERE id = ?`).get(id) as
    | Row
    | undefined;
  return row ? toThread(row) : undefined;
}

export function publishThread(db: DatabaseSync, id: string, now = new Date()): boolean {
  const at = now.toISOString();
  const result = db
    .prepare(
      `UPDATE threads SET status = 'published', published_at = COALESCE(published_at, ?),
         last_activity_at = ? WHERE id = ?`,
    )
    .run(at, at, id);
  return Number(result.changes) > 0;
}

export function setThreadPinned(db: DatabaseSync, id: string, pinned: boolean): boolean {
  const result = db.prepare('UPDATE threads SET pinned = ? WHERE id = ?').run(pinned ? 1 : 0, id);
  return Number(result.changes) > 0;
}

export function deleteThread(db: DatabaseSync, id: string): boolean {
  return Number(db.prepare('DELETE FROM threads WHERE id = ?').run(id).changes) > 0;
}

/* --------------------------------------------------------------- replies */

export function createReply(
  db: DatabaseSync,
  threadId: string,
  input: ReplyInput,
  { staff = false, status = 'pending' }: { staff?: boolean; status?: Status } = {},
  now = new Date(),
): string {
  const id = newId();
  const at = now.toISOString();
  transaction(db, () => {
    db.prepare(
      `INSERT INTO replies (id, thread_id, status, body, author, role, staff, created_at, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      threadId,
      status,
      input.body,
      input.author,
      input.role,
      staff ? 1 : 0,
      at,
      status === 'published' ? at : null,
    );
    if (status === 'published') {
      db.prepare('UPDATE threads SET last_activity_at = ? WHERE id = ?').run(at, threadId);
    }
  });
  return id;
}

export function listReplies(
  db: DatabaseSync,
  threadId: string,
  { status = 'published' }: { status?: Status } = {},
): Reply[] {
  return (
    db
      .prepare('SELECT * FROM replies WHERE thread_id = ? AND status = ? ORDER BY created_at ASC')
      .all(threadId, status) as Row[]
  ).map(toReply);
}

/** Replies waiting for moderation, with the title of their thread. */
export function pendingReplies(db: DatabaseSync): (Reply & { threadTitle: string })[] {
  return (
    db
      .prepare(
        `SELECT replies.*, threads.title AS thread_title FROM replies
         JOIN threads ON threads.id = replies.thread_id
         WHERE replies.status = 'pending' ORDER BY replies.created_at ASC`,
      )
      .all() as Row[]
  ).map((row) => ({ ...toReply(row), threadTitle: text(row.thread_title) }));
}

export function publishReply(db: DatabaseSync, id: string, now = new Date()): boolean {
  const at = now.toISOString();
  return transaction(db, () => {
    const result = db
      .prepare(
        `UPDATE replies SET status = 'published', published_at = COALESCE(published_at, ?)
         WHERE id = ?`,
      )
      .run(at, id);
    if (Number(result.changes) === 0) return false;
    db.prepare(
      'UPDATE threads SET last_activity_at = ? WHERE id = (SELECT thread_id FROM replies WHERE id = ?)',
    ).run(at, id);
    return true;
  });
}

export function deleteReply(db: DatabaseSync, id: string): boolean {
  return Number(db.prepare('DELETE FROM replies WHERE id = ?').run(id).changes) > 0;
}

/* ------------------------------------------------------------ moderation */

export function pendingCounts(db: DatabaseSync): {
  builds: number;
  threads: number;
  replies: number;
} {
  const count = (table: string) =>
    Number(
      (db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE status = 'pending'`).get() as Row)
        .count,
    );
  return { builds: count('builds'), threads: count('threads'), replies: count('replies') };
}
