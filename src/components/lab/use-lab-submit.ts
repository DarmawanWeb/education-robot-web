'use client';

import { useEffect, useRef, useState } from 'react';

export type SubmitStatus = 'idle' | 'sending' | 'done' | 'error';

export interface SubmitState {
  status: SubmitStatus;
  /** Error codes per field from the server. */
  fields: Record<string, string>;
  /** A form-level error code, such as "rateLimited" or "network". */
  error: string | null;
}

const KNOWN_ERRORS = new Set(['rateLimited', 'tooLarge', 'network']);

/**
 * Sends a Lab form and tracks the result. The time the form was opened goes along with it,
 * which lets the server drop bots that submit instantly.
 */
export function useLabSubmit() {
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);
  const [state, setState] = useState<SubmitState>({ status: 'idle', fields: {}, error: null });

  async function send(url: string, body: FormData | Record<string, unknown>): Promise<boolean> {
    setState((current) => ({ ...current, status: 'sending', error: null }));
    try {
      let response: Response;
      if (body instanceof FormData) {
        body.set('startedAt', String(openedAt.current));
        response = await fetch(url, { method: 'POST', body });
      } else {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...body, startedAt: openedAt.current }),
        });
      }
      if (response.ok) {
        setState({ status: 'done', fields: {}, error: null });
        return true;
      }
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string>;
      };
      const error =
        data.error === 'fields'
          ? 'summary'
          : KNOWN_ERRORS.has(data.error ?? '')
            ? data.error
            : 'network';
      setState({ status: 'error', fields: data.fields ?? {}, error: error ?? 'network' });
    } catch {
      setState({ status: 'error', fields: {}, error: 'network' });
    }
    return false;
  }

  function reset() {
    openedAt.current = Date.now();
    setState({ status: 'idle', fields: {}, error: null });
  }

  return { state, send, reset };
}
