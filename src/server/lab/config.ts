import { createHash } from 'node:crypto';
import path from 'node:path';

export interface LabConfig {
  /** Folder holding lab.db and the media folder. Must survive redeploys (a Docker volume). */
  dataDir: string;
  /** Admin password for moderation; the admin page stays locked when it is not set. */
  adminPassword: string | null;
  /** Key for signing the admin session cookie. */
  secret: string;
  /** Optional URL that gets a short POST for every new submission (ntfy, a webhook relay). */
  notifyUrl: string | null;
}

const blank = (value: string | undefined) => (value?.trim() ? value.trim() : null);

export function readLabConfig(env: Record<string, string | undefined> = process.env): LabConfig {
  const adminPassword = blank(env.LAB_ADMIN_PASSWORD);
  const secret =
    blank(env.LAB_SECRET) ??
    // Without LAB_SECRET, sessions are signed with a key derived from the password, so changing
    // the password also signs everyone out.
    createHash('sha256')
      .update(`taksu-lab:${adminPassword ?? 'locked'}`)
      .digest('hex');
  return {
    // Resolved at run time; the ignore hint keeps the build from bundling the data folder.
    dataDir: path.resolve(/* turbopackIgnore: true */ blank(env.LAB_DATA_DIR) ?? '.lab-data'),
    adminPassword,
    secret,
    notifyUrl: blank(env.LAB_NOTIFY_URL),
  };
}
