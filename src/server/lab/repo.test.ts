import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openLabDatabase } from './db';
import {
  createBuild,
  createReply,
  createThread,
  deleteBuild,
  getThread,
  listBuilds,
  listReplies,
  listThreads,
  pendingCounts,
  photoOwner,
  publishBuild,
  publishReply,
  publishThread,
  setBuildFeatured,
  threadCounts,
} from './repo';
import { buildSchema, replySchema, threadSchema } from './validate';

let dir: string;
let db: ReturnType<typeof openLabDatabase>;

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'lab-'));
  db = openLabDatabase(dir);
});

afterEach(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

const buildInput = buildSchema.parse({
  title: 'Radar penjaga pintu',
  kit: 'smp',
  summary: 'Servo memindai pintu dan mengirim peringatan.',
  author: 'Kelas 8C',
  role: 'teacher',
  consent: 'on',
  startedAt: '1',
});

const threadInput = threadSchema.parse({
  category: 'smp',
  title: 'Servo bergetar saat memindai',
  body: 'Servo bergetar di sudut 0 derajat. Ada saran?',
  author: 'Pak Made',
  role: 'teacher',
  startedAt: '1',
});

const replyInput = replySchema.parse({
  body: 'Coba batasi sudutnya dari 10 sampai 170 derajat.',
  author: 'Bu Sari',
  role: 'teacher',
  startedAt: '1',
});

describe('builds', () => {
  it('stay hidden until published, then can be featured', () => {
    const id = createBuild(db, buildInput, [{ id: 'p1', width: 800, height: 600 }]);
    expect(listBuilds(db)).toHaveLength(0);
    expect(pendingCounts(db).builds).toBe(1);
    expect(photoOwner(db, 'p1')).toEqual({ buildId: id, status: 'pending' });

    publishBuild(db, id);
    setBuildFeatured(db, id, true);
    const [published] = listBuilds(db, { featured: true });
    expect(published?.title).toBe('Radar penjaga pintu');
    expect(published?.photos).toEqual([{ id: 'p1', position: 0, width: 800, height: 600 }]);
  });

  it('delete with their photo rows and report the files to remove', () => {
    const id = createBuild(db, buildInput, [
      { id: 'a', width: 1, height: 1 },
      { id: 'b', width: 1, height: 1 },
    ]);
    expect(deleteBuild(db, id).sort()).toEqual(['a', 'b']);
    expect(photoOwner(db, 'a')).toBeUndefined();
  });
});

describe('forum', () => {
  it('publishes threads and counts only published replies', () => {
    const threadId = createThread(db, threadInput);
    expect(listThreads(db)).toHaveLength(0);
    publishThread(db, threadId);
    expect(threadCounts(db).get('smp')).toBe(1);

    const pending = createReply(db, threadId, replyInput);
    createReply(db, threadId, replyInput, { staff: true, status: 'published' });
    expect(getThread(db, threadId)?.replyCount).toBe(1);
    expect(listReplies(db, threadId)).toHaveLength(1);

    publishReply(db, pending);
    expect(getThread(db, threadId)?.replyCount).toBe(2);
    expect(pendingCounts(db)).toEqual({ builds: 0, threads: 0, replies: 0 });
  });

  it('survives reopening the database', () => {
    createThread(db, threadInput, { status: 'published', staff: true });
    db.close();
    db = openLabDatabase(dir);
    expect(listThreads(db)[0]?.staff).toBe(true);
  });
});
