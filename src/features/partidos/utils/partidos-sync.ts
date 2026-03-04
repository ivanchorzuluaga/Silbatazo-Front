import type { Partido } from "../types/partido.types";

const CACHE_TTL_MS = 60_000;
const partidosCache = new Map<string, { data: Partido[]; ts: number }>();
const EVENT_NAME = "partidos:changed";

export function getPartidosCache(key: string): { data: Partido[]; ts: number } | null {
  const entry = partidosCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    partidosCache.delete(key);
    return null;
  }
  return entry;
}

export function setPartidosCache(key: string, data: Partido[]) {
  partidosCache.set(key, { data, ts: Date.now() });
}

export function clearPartidosCache() {
  partidosCache.clear();
}

export function notifyPartidosChanged() {
  clearPartidosCache();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function subscribePartidosChanged(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = () => handler();
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
