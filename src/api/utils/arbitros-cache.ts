import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { unwrapPaginated } from "@/api/utils/pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const CACHE_TTL_MS = 30_000;

type CacheEntry = {
  ts: number;
  data: Arbitro[];
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<Arbitro[]>>();

export async function fetchArbitrosCached(options: {
  query?: string;
  token?: string | null;
}): Promise<Arbitro[]> {
  const key = options.query || "__all__";
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  const existing = inflight.get(key);
  if (existing) return existing;

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const url = `${API_URL}/api/arbitros/${options.query ? `?${options.query}` : ""}`;

  const request = fetch(url, { headers })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Error al cargar árbitros");
      }
      const data = await response.json();
      const lista = unwrapPaginated<Arbitro>(data);
      cache.set(key, { ts: Date.now(), data: lista });
      return lista;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
}
