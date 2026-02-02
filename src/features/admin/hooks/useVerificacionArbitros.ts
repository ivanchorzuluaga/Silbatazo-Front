/**
 * Hook para gestionar la verificación de árbitros pendientes
 */

import { useState, useEffect, useCallback } from "react";
import { arbitroService } from "@/features/arbitro/services/arbitro.service";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

interface UseVerificacionArbitrosReturn {
  arbitros: Arbitro[];
  isLoading: boolean;
  error: string | null;
  cargarArbitrosPendientes: () => Promise<void>;
  clearError: () => void;
}

export function useVerificacionArbitros(): UseVerificacionArbitrosReturn {
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarArbitrosPendientes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarPendientes();
      setArbitros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar árbitros pendientes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    cargarArbitrosPendientes();
  }, [cargarArbitrosPendientes]);

  return {
    arbitros,
    isLoading,
    error,
    cargarArbitrosPendientes,
    clearError,
  };
}
