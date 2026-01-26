/**
 * Hook para gestionar un partido individual
 */

import { useState, useCallback } from "react";
import { partidoService } from "../services/partido.service";
import type { PartidoDetail, PartidoCreateData, PartidoUpdateData } from "../types/partido.types";

interface UsePartidoReturn {
  partido: PartidoDetail | null;
  isLoading: boolean;
  error: string | null;
  obtenerPartido: (id: number) => Promise<void>;
  crearPartido: (data: PartidoCreateData) => Promise<PartidoDetail>;
  actualizarPartido: (id: number, data: PartidoUpdateData) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function usePartido(): UsePartidoReturn {
  const [partido, setPartido] = useState<PartidoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerPartido = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await partidoService.obtenerPartido(id);
      setPartido(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearPartido = async (data: PartidoCreateData) => {
    setIsLoading(true);
    setError(null);

    try {
      // El backend ahora devuelve el detalle completo directamente
      const nuevoPartido = await partidoService.crearPartido(data);
      setPartido(nuevoPartido);
      return nuevoPartido;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPartido = async (id: number, data: PartidoUpdateData) => {
    setIsLoading(true);
    setError(null);

    try {
      await partidoService.actualizarPartido(id, data);
      // Refrescar el partido después de actualizar
      const actualizado = await partidoService.obtenerPartido(id);
      setPartido(actualizado);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar partido";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = useCallback(async () => {
    if (partido?.id) {
      await obtenerPartido(partido.id);
    }
  }, [partido?.id, obtenerPartido]);

  const clearError = () => {
    setError(null);
  };

  return {
    partido,
    isLoading,
    error,
    obtenerPartido,
    crearPartido,
    actualizarPartido,
    refresh,
    clearError,
  };
}
