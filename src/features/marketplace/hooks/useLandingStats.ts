/**
 * Hook para cargar estadísticas públicas de la landing (partidos pitados,
 * calificación promedio, árbitros disponibles hoy, primera hora hoy).
 */

import { useState, useEffect, useCallback } from "react";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import type { LandingStats } from "@/api/endpoints/partido.endpoints";

interface UseLandingStatsReturn {
  stats: LandingStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLandingStats(): UseLandingStatsReturn {
  const [stats, setStats] = useState<LandingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partidoEndpoints.getLandingStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
