/**
 * Hook para listar partidos
 */

import { useState, useEffect, useMemo } from "react";
import { partidoService } from "../services/partido.service";
import type { Partido, PartidosListParams } from "../types/partido.types";

interface UsePartidosReturn {
  partidos: Partido[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePartidos(params?: PartidosListParams): UsePartidosReturn {
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);
  const cached = getCache(paramsKey);
  const [partidos, setPartidos] = useState<Partido[]>(cached?.data ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchPartidos = async (force = false) => {
    if (!force) {
      const fresh = getCache(paramsKey);
      if (fresh) {
        setPartidos(fresh.data);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await partidoService.listarPartidos(params);
      setPartidos(data);
      setCache(paramsKey, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener partidos";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params?.estado,
    params?.estado_pago,
    params?.fecha_desde,
    params?.fecha_hasta,
    params?.cliente_id,
    params?.arbitro_id,
  ]);

  return {
    partidos,
    isLoading,
    error,
    refetch: () => fetchPartidos(true),
  };
}

// ======================
// Cache simple en memoria
// ======================
const CACHE_TTL_MS = 60_000;
const partidosCache = new Map<string, { data: Partido[]; ts: number }>();

function getCache(key: string): { data: Partido[]; ts: number } | null {
  const entry = partidosCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    partidosCache.delete(key);
    return null;
  }
  return entry;
}

function setCache(key: string, data: Partido[]) {
  partidosCache.set(key, { data, ts: Date.now() });
}
