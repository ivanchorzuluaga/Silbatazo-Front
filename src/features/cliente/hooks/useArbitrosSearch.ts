/**
 * Hook para búsqueda y filtrado de árbitros
 * Encapsula toda la lógica de negocio para la lista de árbitros
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { fetchArbitrosCached } from "@/api/utils/arbitros-cache";

export interface FiltrosArbitrosType {
  municipio?: number;
  categoria?: number;
  search?: string;
  ordering?: string;
  fecha?: string;
  hora?: string;
}

interface UseArbitrosSearchReturn {
  arbitros: Arbitro[];
  isLoading: boolean;
  error: string | null;
  filtros: FiltrosArbitrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosArbitrosType>>;
  limpiarFiltros: () => void;
  recargar: () => void;
}

export function useArbitrosSearch(): UseArbitrosSearchReturn {
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosArbitrosType>({
    ordering: "-created_at",
  });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  const cargarArbitros = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        if (filtros.municipio) queryParams.append("municipio", filtros.municipio.toString());
        if (filtros.categoria) queryParams.append("categoria", filtros.categoria.toString());
        if (filtros.search) queryParams.append("search", filtros.search);
        if (filtros.ordering) queryParams.append("ordering", filtros.ordering);
        if (filtros.fecha) queryParams.append("fecha", filtros.fecha);
        if (filtros.hora) queryParams.append("hora", filtros.hora);

        const arbitrosList = await fetchArbitrosCached({
          query: queryParams.toString(),
        });
        setArbitros(arbitrosList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar árbitros");
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [filtros],
  );

  // Carga inicial
  useEffect(() => {
    cargarArbitros(true);
    isInitialMount.current = false;
  }, []);

  // Efecto para cargar árbitros cuando cambian los filtros (excepto search)
  useEffect(() => {
    if (isInitialMount.current) return;
    cargarArbitros(false);
  }, [filtros.municipio, filtros.categoria, filtros.ordering, filtros.fecha, filtros.hora]);

  // Efecto separado para search con debounce
  useEffect(() => {
    if (isInitialMount.current) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!filtros.search || filtros.search.trim() === "") {
      cargarArbitros(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      cargarArbitros(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filtros.search]);

  const limpiarFiltros = useCallback(() => {
    setFiltros({ ordering: "-created_at" });
  }, []);

  const recargar = useCallback(() => {
    cargarArbitros(true);
  }, [cargarArbitros]);

  return {
    arbitros,
    isLoading,
    error,
    filtros,
    setFiltros,
    limpiarFiltros,
    recargar,
  };
}
