"use client";

import { useCallback, useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------
 * Browser-only state, read without a hydration mismatch.
 *
 * `useSyncExternalStore` renders the server snapshot during hydration and
 * swaps to the real value immediately afterwards, which is why nothing here
 * needs a "did I mount yet?" effect.
 * ---------------------------------------------------------------------- */

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function notify(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function area(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null; // blocked by the browser — fall back to in-memory only
  }
}

/** JSON-backed value in local/session storage, shared across every consumer. */
export function usePersisted<T>(kind: "local" | "session", key: string, fallback: T) {
  const id = `${kind}:${key}`;

  const subscribe = useCallback(
    (cb: () => void) => {
      let set = listeners.get(id);
      if (!set) listeners.set(id, (set = new Set()));
      set.add(cb);
      return () => set.delete(cb);
    },
    [id],
  );

  const getSnapshot = useCallback((): T => {
    if (!cache.has(id)) {
      let value = fallback;
      const store = area(kind);
      const raw = store?.getItem(key);
      if (raw) {
        try {
          value = { ...(fallback as object), ...JSON.parse(raw) } as T;
        } catch {
          value = fallback;
        }
      }
      cache.set(id, value);
    }
    return cache.get(id) as T;
  }, [fallback, id, key, kind]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    (next: T | null) => {
      cache.set(id, next ?? fallback);
      const store = area(kind);
      if (next === null) store?.removeItem(key);
      else store?.setItem(key, JSON.stringify(next));
      notify(id);
    },
    [fallback, id, key, kind],
  );

  return [value, set] as const;
}

/* --------------------------------------------------------------- clocks --- */

type Clock = { subscribe: (cb: () => void) => () => void; get: () => number };

function makeClock(schedule: (tick: () => void) => () => void): Clock {
  const subs = new Set<() => void>();
  let value = 0;
  let stop: (() => void) | null = null;
  return {
    subscribe(cb) {
      subs.add(cb);
      if (!stop) {
        value = Date.now();
        stop = schedule(() => {
          value = Date.now();
          subs.forEach((s) => s());
        });
      }
      return () => {
        subs.delete(cb);
        if (!subs.size) {
          stop?.();
          stop = null;
        }
      };
    },
    get: () => value,
  };
}

const intervalClocks = new Map<number, Clock>();

function intervalClock(ms: number) {
  let clock = intervalClocks.get(ms);
  if (!clock) {
    clock = makeClock((tick) => {
      const id = setInterval(tick, ms);
      return () => clearInterval(id);
    });
    intervalClocks.set(ms, clock);
  }
  return clock;
}

const rafClock = makeClock((tick) => {
  let id = 0;
  const loop = () => {
    tick();
    id = requestAnimationFrame(loop);
  };
  id = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(id);
});

const serverTime = () => 0;

/** Wall clock ticking every `ms`. Returns null until the browser takes over. */
export function useClock(ms = 1000): number | null {
  const clock = intervalClock(ms);
  const t = useSyncExternalStore(clock.subscribe, clock.get, serverTime);
  return t || null;
}

/** Frame-rate clock, for counters that should visibly move. */
export function useFrameClock(): number | null {
  const t = useSyncExternalStore(rafClock.subscribe, rafClock.get, serverTime);
  return t || null;
}
