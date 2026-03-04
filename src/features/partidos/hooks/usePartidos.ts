/**
 * Hook para listar partidos
 */

import { useState, useEffect, useMemo } from "react";
import { partidoService } from "../services/partido.service";
import type { Partido, PartidosListParams } from "../types/partido.types";
import {
  getPartidosCache,
  setPartidosCache,
  subscribePartidosChanged,
} from "../utils/partidos-sync";

interface UsePartidosReturn {
  partidos: Partido[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePartidos(params?: PartidosListParams): UsePartidosReturn {
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);
  const cached = getPartidosCache(paramsKey);
  const [partidos, setPartidos] = useState<Partido[]>(cached?.data ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchPartidos = async (force = false) => {
    if (!force) {
      const fresh = getPartidosCache(paramsKey);
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
      setPartidosCache(paramsKey, data);
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
    params?.vista,
    params?.estado,
    params?.estado_pago,
    params?.fecha_desde,
    params?.fecha_hasta,
    params?.municipio_id,
    params?.categoria_id,
    params?.cliente_id,
    params?.arbitro_id,
  ]);

  useEffect(() => {
    return subscribePartidosChanged(() => {
      fetchPartidos(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return {
    partidos,
    isLoading,
    error,
    refetch: () => fetchPartidos(true),
  };
}
