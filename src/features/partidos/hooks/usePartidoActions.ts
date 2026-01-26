/**
 * Hook para gestionar acciones de partidos (aceptar, rechazar, cancelar, completar)
 */

import { useState } from "react";
import { partidoService } from "../services/partido.service";
import type {
  PartidoDetail,
  PartidoAceptarData,
  PartidoRechazarData,
  PartidoCancelarData,
  PartidoCompletarData,
} from "../types/partido.types";

interface UsePartidoActionsReturn {
  isLoading: boolean;
  error: string | null;
  aceptarPartido: (id: number, data?: PartidoAceptarData) => Promise<PartidoDetail>;
  rechazarPartido: (id: number, data: PartidoRechazarData) => Promise<PartidoDetail>;
  cancelarPartido: (id: number, data: PartidoCancelarData) => Promise<PartidoDetail>;
  completarPartido: (id: number, data?: PartidoCompletarData) => Promise<PartidoDetail>;
  clearError: () => void;
}

export function usePartidoActions(): UsePartidoActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aceptarPartido = async (id: number, data?: PartidoAceptarData) => {
    setIsLoading(true);
    setError(null);

    try {
      const resultado = await partidoService.aceptarPartido(id, data);
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al aceptar partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rechazarPartido = async (id: number, data: PartidoRechazarData) => {
    setIsLoading(true);
    setError(null);

    try {
      const resultado = await partidoService.rechazarPartido(id, data);
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al rechazar partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarPartido = async (id: number, data: PartidoCancelarData) => {
    setIsLoading(true);
    setError(null);

    try {
      const resultado = await partidoService.cancelarPartido(id, data);
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cancelar partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completarPartido = async (id: number, data?: PartidoCompletarData) => {
    setIsLoading(true);
    setError(null);

    try {
      const resultado = await partidoService.completarPartido(id, data);
      return resultado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al completar partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    aceptarPartido,
    rechazarPartido,
    cancelarPartido,
    completarPartido,
    clearError,
  };
}
