/**
 * Hook para listar partidos disponibles para árbitros
 */

import { useEffect, useMemo, useState } from "react";
import { partidoService } from "../services/partido.service";
import type { Partido, PartidosListParams } from "../types/partido.types";

interface UsePartidosDisponiblesReturn {
  partidos: Partido[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePartidosDisponibles(
  params?: PartidosListParams
): UsePartidosDisponiblesReturn {
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partidoService.listarPartidosDisponibles(params);
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
    paramsKey,
    params?.fecha_desde,
    params?.fecha_hasta,
    params?.municipio_id,
    params?.categoria_id,
  ]);

  return {
    partidos,
    isLoading,
    error,
    refetch: fetchPartidos,
  };
}
