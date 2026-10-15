import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False in the server render and during hydration, true once the browser has taken over. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
