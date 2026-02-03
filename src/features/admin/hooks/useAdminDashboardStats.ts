/**
 * Hook para cargar estadísticas del dashboard de administración
 */

import { useState, useEffect, useCallback } from "react";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import type { AdminDashboardStats } from "@/api/endpoints/partido.endpoints";

interface UseAdminDashboardStatsReturn {
  stats: AdminDashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminDashboardStats(): UseAdminDashboardStatsReturn {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }
      const data = await partidoEndpoints.getAdminDashboardStats(token);
      setStats(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar estadísticas";
      setError(message);
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
