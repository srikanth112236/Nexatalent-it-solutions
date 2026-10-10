import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../api-client';
import { getAccessToken } from '../auth/session';

type Listener = () => void;

interface CacheEntry<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  updatedAt: number;
  listeners: Set<Listener>;
}

const cache = new Map<string, CacheEntry<unknown>>();
const STALE_MS = 30_000;

function getEntry<T>(key: string): CacheEntry<T> {
  let e = cache.get(key) as CacheEntry<T> | undefined;
  if (!e) {
    e = { data: null, error: null, loading: false, updatedAt: 0, listeners: new Set() };
    cache.set(key, e as CacheEntry<unknown>);
  }
  return e;
}

function notify(key: string) {
  cache.get(key)?.listeners.forEach((l) => l());
}

/** Invalidate one or all collections — drives cross-portal sync. */
export function invalidateCollections(keys?: string[]) {
  if (!keys) {
    for (const [k, e] of cache) {
      e.updatedAt = 0;
      e.data = null;
      notify(k);
    }
    return;
  }
  for (const k of keys) {
    const e = cache.get(k);
    if (e) {
      e.updatedAt = 0;
      e.data = null;
      notify(k);
    }
  }
}

function unwrap<T>(res: unknown): T {
  const r = res as { data?: T; success?: boolean };
  if (r && typeof r === 'object' && 'data' in r && 'success' in r) return r.data as T;
  return res as T;
}

/**
 * Zero-dependency shared collection hook.
 * All portals mounting the same `key` share one cached copy; `mutate` +
 * `invalidateCollections` keeps every role in sync without a global store lib.
 */
export function useCollection<T>(key: string, endpoint: string) {
  const [, bump] = useState(0);

  useEffect(() => {
    const e = getEntry<T>(key);
    const listener = () => bump((n) => n + 1);
    e.listeners.add(listener);
    let cancelled = false;

    async function load() {
      if (e.loading) return;
      if (e.data !== null && Date.now() - e.updatedAt < STALE_MS) return;
      if (!getAccessToken()) {
        e.loading = false;
        e.error = null;
        notify(key);
        return;
      }
      e.loading = true;
      e.error = null;
      notify(key);
      try {
        const res = await apiClient.get<T>(endpoint);
        if (cancelled) return;
        e.data = unwrap<T>(res);
        e.updatedAt = Date.now();
      } catch (err: unknown) {
        if (cancelled) return;
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Failed to load data.';
        e.error = msg;
      } finally {
        if (!cancelled) {
          e.loading = false;
          notify(key);
        }
      }
    }
    load();

    return () => {
      e.listeners.delete(listener);
      cancelled = true;
    };
  }, [key, endpoint]);

  const refresh = useCallback(async () => {
    const e = getEntry<T>(key);
    e.updatedAt = 0;
    e.data = null;
    notify(key);
  }, [key]);

  const entry = getEntry<T>(key);
  return { data: entry.data, loading: entry.loading, error: entry.error, refresh };
}
