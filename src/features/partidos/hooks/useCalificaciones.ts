/**
 * Hook para gestionar calificaciones
 */

import { useState, useCallback } from "react";
import { partidoService } from "../services/partido.service";
import type {
  Calificacion,
  CalificacionCreateData,
  PromedioArbitro,
} from "../types/partido.types";

interface UseCalificacionesReturn {
  calificaciones: Calificacion[];
  promedio: PromedioArbitro | null;
  isLoading: boolean;
  error: string | null;
  listarCalificacionesPartido: (partidoId: number) => Promise<void>;
  listarCalificacionesArbitro: (arbitroId: number) => Promise<void>;
  crearCalificacion: (partidoId: number, data: CalificacionCreateData) => Promise<Calificacion>;
  obtenerPromedio: (arbitroId: number) => Promise<void>;
  clearError: () => void;
}

export function useCalificaciones(): UseCalificacionesReturn {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [promedio, setPromedio] = useState<PromedioArbitro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const listarCalificacionesPartido = useCallback(async (partidoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partidoService.listarCalificacionesPartido(partidoId);
      setCalificaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al listar calificaciones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const listarCalificacionesArbitro = useCallback(async (arbitroId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partidoService.listarCalificacionesArbitro(arbitroId);
      setCalificaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al listar calificaciones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearCalificacion = useCallback(
    async (partidoId: number, data: CalificacionCreateData) => {
      setIsLoading(true);
      setError(null);
      try {
        const nuevaCalificacion = await partidoService.crearCalificacion(partidoId, data);
        // Refrescar lista
        await listarCalificacionesPartido(partidoId);
        return nuevaCalificacion;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al crear calificación";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [listarCalificacionesPartido]
  );

  const obtenerPromedio = useCallback(async (arbitroId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await partidoService.obtenerPromedioArbitro(arbitroId);
      setPromedio(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener promedio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    calificaciones,
    promedio,
    isLoading,
    error,
    listarCalificacionesPartido,
    listarCalificacionesArbitro,
    crearCalificacion,
    obtenerPromedio,
    clearError,
  };
}


