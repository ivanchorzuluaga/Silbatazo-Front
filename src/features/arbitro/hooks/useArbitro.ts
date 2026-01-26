/**
 * Hook para gestionar el perfil de árbitro
 */

import { useState } from "react";
import { arbitroService } from "../services/arbitro.service";
import type { Arbitro, ArbitroCreateData, ArbitroUpdateData } from "../types/arbitro.types";

interface UseArbitroReturn {
  arbitro: Arbitro | null;
  isLoading: boolean;
  error: string | null;
  obtenerPerfil: () => Promise<void>;
  crearPerfil: (data: ArbitroCreateData) => Promise<void>;
  actualizarPerfil: (data: ArbitroUpdateData) => Promise<void>;
  clearError: () => void;
}

export function useArbitro(): UseArbitroReturn {
  const [arbitro, setArbitro] = useState<Arbitro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerPerfil = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const perfil = await arbitroService.obtenerPerfil();
      setArbitro(perfil);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener perfil";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const crearPerfil = async (data: ArbitroCreateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const nuevoPerfil = await arbitroService.crearPerfil(data);
      setArbitro(nuevoPerfil);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear perfil";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarPerfil = async (data: ArbitroUpdateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const perfilActualizado = await arbitroService.actualizarPerfil(data);
      setArbitro(perfilActualizado);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar perfil";
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
    arbitro,
    isLoading,
    error,
    obtenerPerfil,
    crearPerfil,
    actualizarPerfil,
    clearError,
  };
}
