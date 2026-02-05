/**
 * Hook para listar partidos solapados y reasignar árbitro (solo admin)
 */

import { useState, useEffect, useCallback } from "react";
import { partidoService } from "@/features/partidos/services/partido.service";
import type {
  GrupoPartidosSolapados,
  PartidoDetail,
  PartidoAsignarData,
} from "@/features/partidos/types/partido.types";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

interface UsePartidosSolapadosReturn {
  grupos: GrupoPartidosSolapados[];
  isLoading: boolean;
  error: string | null;
  listarSolapados: () => Promise<void>;
  obtenerArbitrosDisponibles: (partidoId: number) => Promise<Arbitro[]>;
  asignarArbitro: (partidoId: number, data: PartidoAsignarData) => Promise<PartidoDetail>;
  clearError: () => void;
}

export function usePartidosSolapados(): UsePartidosSolapadosReturn {
  const [grupos, setGrupos] = useState<GrupoPartidosSolapados[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarSolapados = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await partidoService.listarPartidosSolapados();
      setGrupos(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener partidos solapados";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const obtenerArbitrosDisponibles = async (partidoId: number): Promise<Arbitro[]> => {
    try {
      return await partidoService.listarArbitrosDisponibles(partidoId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener árbitros";
      setError(errorMessage);
      throw err;
    }
  };

  const asignarArbitro = async (
    partidoId: number,
    data: PartidoAsignarData
  ): Promise<PartidoDetail> => {
    setError(null);

    try {
      const partidoActualizado = await partidoService.asignarArbitro(partidoId, data);
      await listarSolapados();
      return partidoActualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al asignar árbitro";
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    listarSolapados();
  }, [listarSolapados]);

  return {
    grupos,
    isLoading,
    error,
    listarSolapados,
    obtenerArbitrosDisponibles,
    asignarArbitro,
    clearError,
  };
}
