import { mkdirSync } from 'node:fs';
import path from 'node:path';
import type { DatabaseSync } from 'node:sqlite';

/*
 * node:sqlite ships with Node 22, so the Lab needs no native database module. It is loaded at
 * runtime through getBuiltinModule so the bundler never tries to resolve it.
 */
const sqlite = () => {
  const module = process.getBuiltinModule('node:sqlite');
  if (!module) throw new Error('The Lab needs Node 22.5 or newer for node:sqlite.');
  return module;
};

/** Each entry upgrades the schema by one version. Never edit a shipped entry; add a new one. */
const migrations: readonly string[] = [
  `
  CREATE TABLE builds (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'rejected')),
    featured INTEGER NOT NULL DEFAULT 0,
    kit TEXT NOT NULL,
    challenge TEXT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    changes TEXT NOT NULL DEFAULT '',
    video_id TEXT,
    author TEXT NOT NULL,
    school TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL,
    contact TEXT NOT NULL DEFAULT '',
    locale TEXT NOT NULL,
    created_at TEXT NOT NULL,
    published_at TEXT
  );
  CREATE INDEX builds_status ON builds (status, published_at DESC);

  CREATE TABLE photos (
    id TEXT PRIMARY KEY,
    build_id TEXT NOT NULL REFERENCES builds (id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL
  );
  CREATE INDEX photos_build ON photos (build_id, position);

  CREATE TABLE threads (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'rejected')),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    school TEXT NOT NULL DEFAULT '',
    contact TEXT NOT NULL DEFAULT '',
    staff INTEGER NOT NULL DEFAULT 0,
    pinned INTEGER NOT NULL DEFAULT 0,
    locale TEXT NOT NULL,
    created_at TEXT NOT NULL,
    published_at TEXT,
    last_activity_at TEXT NOT NULL
  );
  CREATE INDEX threads_status ON threads (status, pinned DESC, last_activity_at DESC);

  CREATE TABLE replies (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL REFERENCES threads (id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'rejected')),
    body TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    staff INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    published_at TEXT
  );
  CREATE INDEX replies_thread ON replies (thread_id, status, created_at);
  `,
];

function migrate(db: DatabaseSync) {
  const current = Number(
    (db.prepare('PRAGMA user_version').get() as { user_version: number }).user_version,
  );
  for (let version = current; version < migrations.length; version += 1) {
    db.exec('BEGIN');
    try {
      db.exec(migrations[version] ?? '');
      db.exec(`PRAGMA user_version = ${version + 1}`);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

/** Opens (and if needed creates) the Lab database in `dataDir`. */
export function openLabDatabase(dataDir: string): DatabaseSync {
  mkdirSync(dataDir, { recursive: true });
  const db = new (sqlite().DatabaseSync)(path.join(dataDir, 'lab.db'));
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 3000');
  migrate(db);
  return db;
}

const globalForLab = globalThis as unknown as { labDatabases?: Map<string, DatabaseSync> };

/** One connection per data folder and process, kept across dev reloads. */
export function labDatabase(dataDir: string): DatabaseSync {
  globalForLab.labDatabases ??= new Map();
  let db = globalForLab.labDatabases.get(dataDir);
  if (!db) {
    db = openLabDatabase(dataDir);
    globalForLab.labDatabases.set(dataDir, db);
  }
  return db;
}
