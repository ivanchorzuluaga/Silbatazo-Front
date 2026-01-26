/**
 * Hook para listar municipios
 */

import { useState, useEffect } from "react";
import { arbitroService } from "../services/arbitro.service";
import type { Municipio } from "../types/arbitro.types";

interface UseMunicipiosReturn {
  municipios: Municipio[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMunicipios(): UseMunicipiosReturn {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMunicipios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarMunicipios();
      setMunicipios(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener municipios";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  return {
    municipios,
    isLoading,
    error,
    refetch: fetchMunicipios,
  };
}

