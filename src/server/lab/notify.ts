/**
 * Tells moderators about a new submission: always in the log (warn level, so it shows in Loki),
 * and as a plain-text POST when LAB_NOTIFY_URL is set, which works with ntfy topics
 * and most webhook relays. Failures are logged and never block the visitor.
 */
export async function notifyModerators(url: string | null, message: string): Promise<void> {
  console.warn(`[lab] ${message}`);
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      body: message,
      headers: { 'content-type': 'text/plain; charset=utf-8', title: 'Lab' },
      signal: AbortSignal.timeout(3000),
    });
  } catch (error) {
    console.warn('[lab] notification failed', error);
  }
}
