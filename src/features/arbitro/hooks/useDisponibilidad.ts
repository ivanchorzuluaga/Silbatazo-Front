/**
 * Hook para gestionar disponibilidad de árbitro
 */

import { useState, useCallback } from "react";
import { arbitroService } from "../services/arbitro.service";
import type {
  DisponibilidadArbitro,
  DisponibilidadCreateData,
  DisponibilidadUpdateData,
} from "../types/arbitro.types";

interface UseDisponibilidadReturn {
  disponibilidades: DisponibilidadArbitro[];
  isLoading: boolean;
  error: string | null;
  listarDisponibilidades: () => Promise<void>;
  crearDisponibilidad: (data: DisponibilidadCreateData) => Promise<void>;
  actualizarDisponibilidad: (id: number, data: DisponibilidadUpdateData) => Promise<void>;
  eliminarDisponibilidad: (id: number) => Promise<void>;
  clearError: () => void;
}

export function useDisponibilidad(): UseDisponibilidadReturn {
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadArbitro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarDisponibilidades = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarDisponibilidades();
      setDisponibilidades(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener disponibilidades";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearDisponibilidad = useCallback(async (data: DisponibilidadCreateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const nuevaDisponibilidad = await arbitroService.crearDisponibilidad(data);
      setDisponibilidades((prev) => [...prev, nuevaDisponibilidad]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear disponibilidad";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actualizarDisponibilidad = useCallback(
    async (id: number, data: DisponibilidadUpdateData) => {
      setIsLoading(true);
      setError(null);

      try {
        const disponibilidadActualizada = await arbitroService.actualizarDisponibilidad(id, data);
        setDisponibilidades((prev) =>
          prev.map((d) => (d.id === id ? disponibilidadActualizada : d))
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar disponibilidad";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const eliminarDisponibilidad = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await arbitroService.eliminarDisponibilidad(id);
      setDisponibilidades((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar disponibilidad";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    disponibilidades,
    isLoading,
    error,
    listarDisponibilidades,
    crearDisponibilidad,
    actualizarDisponibilidad,
    eliminarDisponibilidad,
    clearError,
  };
}
