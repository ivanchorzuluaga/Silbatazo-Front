/**
 * Hook para listar partidos
 */

import { useState, useEffect } from "react";
import { partidoService } from "../services/partido.service";
import type { Partido, PartidosListParams } from "../types/partido.types";

interface UsePartidosReturn {
  partidos: Partido[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePartidos(params?: PartidosListParams): UsePartidosReturn {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartidos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await partidoService.listarPartidos(params);
      setPartidos(data);
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
    params?.fecha_desde,
    params?.fecha_hasta,
    params?.cliente_id,
    params?.arbitro_id,
  ]);

  return {
    partidos,
    isLoading,
    error,
    refetch: fetchPartidos,
  };
}
