/**
 * Hook para gestionar la asignación de árbitros a partidos (solo admin)
 */

import { useState, useEffect, useCallback } from "react";
import { partidoService } from "@/features/partidos/services/partido.service";
import type { PartidoDetail, PartidoAsignarData } from "@/features/partidos/types/partido.types";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

interface UseAsignacionPartidosReturn {
  partidos: PartidoDetail[];
  isLoading: boolean;
  error: string | null;
  listarPartidos: () => Promise<void>;
  obtenerArbitrosDisponibles: (partidoId: number) => Promise<Arbitro[]>;
  asignarArbitro: (partidoId: number, data: PartidoAsignarData) => Promise<PartidoDetail>;
  clearError: () => void;
}

export function useAsignacionPartidos(): UseAsignacionPartidosReturn {
  const [partidos, setPartidos] = useState<PartidoDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarPartidos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await partidoService.listarPartidosNecesitanAsignacion();
      setPartidos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener partidos";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const obtenerArbitrosDisponibles = async (partidoId: number): Promise<Arbitro[]> => {
    setIsLoading(true);
    setError(null);

    try {
      return await partidoService.listarArbitrosDisponibles(partidoId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener árbitros";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const asignarArbitro = async (
    partidoId: number,
    data: PartidoAsignarData
  ): Promise<PartidoDetail> => {
    setIsLoading(true);
    setError(null);

    try {
      const partidoActualizado = await partidoService.asignarArbitro(partidoId, data);
      await listarPartidos(); // Refrescar lista
      return partidoActualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al asignar árbitro";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    listarPartidos();
  }, [listarPartidos]);

  return {
    partidos,
    isLoading,
    error,
    listarPartidos,
    obtenerArbitrosDisponibles,
    asignarArbitro,
    clearError,
  };
}
