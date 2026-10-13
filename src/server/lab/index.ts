import { type LabConfig, readLabConfig } from './config';
import { labDatabase } from './db';
import { createRateLimiter } from './rate-limit';

/** Shared Lab state for this server process. */
export function lab(): { config: LabConfig; db: ReturnType<typeof labDatabase> } {
  const config = readLabConfig();
  return { config, db: labDatabase(config.dataDir) };
}

/** Per-visitor limits; a class submitting together still fits well inside them. */
export const limits = {
  builds: createRateLimiter({ limit: 6, windowMs: 60 * 60_000 }),
  threads: createRateLimiter({ limit: 6, windowMs: 60 * 60_000 }),
  replies: createRateLimiter({ limit: 20, windowMs: 60 * 60_000 }),
  login: createRateLimiter({ limit: 8, windowMs: 15 * 60_000 }),
};
