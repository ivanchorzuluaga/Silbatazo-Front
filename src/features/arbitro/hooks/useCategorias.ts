/**
 * Hook para listar categorías
 */

import { useState, useEffect } from "react";
import { arbitroService } from "../services/arbitro.service";
import type { Categoria } from "../types/arbitro.types";

interface UseCategoriasReturn {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCategorias(): UseCategoriasReturn {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarCategorias();
      setCategorias(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener categorías";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    isLoading,
    error,
    refetch: fetchCategorias,
  };
}
