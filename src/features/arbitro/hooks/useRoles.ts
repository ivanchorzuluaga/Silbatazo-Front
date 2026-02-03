/**
 * Hook para listar roles de árbitro
 */

import { useState, useEffect } from "react";
import { arbitroService } from "../services/arbitro.service";
import type { RolArbitro } from "../types/arbitro.types";

interface UseRolesReturn {
  roles: RolArbitro[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<RolArbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarRoles();
      setRoles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener roles";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    error,
    refetch: fetchRoles,
  };
}
