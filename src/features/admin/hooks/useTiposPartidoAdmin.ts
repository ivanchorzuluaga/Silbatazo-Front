/**
 * Hook para gestionar tipos de partido (solo admin)
 */

import { useState, useEffect, useCallback } from "react";
import { tipoPartidoService } from "../services/tipoPartido.service";
import type {
  TipoPartidoAdmin,
  TipoPartidoCreateData,
  TipoPartidoUpdateData,
} from "@/features/partidos/types/partido.types";

interface UseTiposPartidoAdminReturn {
  tipos: TipoPartidoAdmin[];
  isLoading: boolean;
  error: string | null;
  listarTipos: () => Promise<void>;
  crearTipo: (data: TipoPartidoCreateData) => Promise<TipoPartidoAdmin>;
  actualizarTipo: (id: number, data: TipoPartidoUpdateData) => Promise<TipoPartidoAdmin>;
  eliminarTipo: (id: number) => Promise<void>;
  clearError: () => void;
}

export function useTiposPartidoAdmin(): UseTiposPartidoAdminReturn {
  const [tipos, setTipos] = useState<TipoPartidoAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarTipos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tipoPartidoService.listarTiposPartido();
      setTipos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener tipos de partido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearTipo = async (data: TipoPartidoCreateData): Promise<TipoPartidoAdmin> => {
    setIsLoading(true);
    setError(null);

    try {
      const nuevo = await tipoPartidoService.crearTipoPartido(data);
      await listarTipos();
      return nuevo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear tipo de partido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarTipo = async (
    id: number,
    data: TipoPartidoUpdateData
  ): Promise<TipoPartidoAdmin> => {
    setIsLoading(true);
    setError(null);

    try {
      const actualizado = await tipoPartidoService.actualizarTipoPartido(id, data);
      await listarTipos();
      return actualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar tipo de partido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarTipo = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await tipoPartidoService.eliminarTipoPartido(id);
      await listarTipos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar tipo de partido");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    listarTipos();
  }, [listarTipos]);

  return {
    tipos,
    isLoading,
    error,
    listarTipos,
    crearTipo,
    actualizarTipo,
    eliminarTipo,
    clearError,
  };
}
