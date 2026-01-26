/**
 * Hook para gestionar retiros
 */

import { useState, useCallback } from "react";
import { retiroService } from "../services/retiro.service";
import type {
  Retiro,
  RetiroCreateData,
  RetiroProcesarData,
  SaldoDisponible,
} from "../types/arbitro.types";

interface UseRetirosReturn {
  retiros: Retiro[];
  retiro: Retiro | null;
  saldo: SaldoDisponible | null;
  isLoading: boolean;
  error: string | null;
  listarRetiros: (params?: { estado?: "pendiente" | "procesado" | "rechazado" }) => Promise<void>;
  obtenerRetiro: (id: number) => Promise<void>;
  crearRetiro: (data: RetiroCreateData) => Promise<Retiro>;
  procesarRetiro: (id: number, data: RetiroProcesarData) => Promise<Retiro>;
  obtenerSaldo: () => Promise<void>;
  clearError: () => void;
}

export function useRetiros(): UseRetirosReturn {
  const [retiros, setRetiros] = useState<Retiro[]>([]);
  const [retiro, setRetiro] = useState<Retiro | null>(null);
  const [saldo, setSaldo] = useState<SaldoDisponible | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const listarRetiros = useCallback(
    async (params?: { estado?: "pendiente" | "procesado" | "rechazado" }) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await retiroService.listarRetiros(params);
        setRetiros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al listar retiros");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const obtenerRetiro = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await retiroService.obtenerRetiro(id);
      setRetiro(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener retiro");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const procesarRetiro = useCallback(
    async (id: number, data: RetiroProcesarData) => {
      setIsLoading(true);
      setError(null);
      try {
        const retiroActualizado = await retiroService.procesarRetiro(id, data);
        // Refrescar lista
        await listarRetiros();
        return retiroActualizado;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al procesar retiro";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [listarRetiros]
  );

  const obtenerSaldo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await retiroService.obtenerSaldoDisponible();
      setSaldo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener saldo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearRetiroWithDeps = useCallback(
    async (data: RetiroCreateData) => {
      setIsLoading(true);
      setError(null);
      try {
        const nuevoRetiro = await retiroService.crearRetiro(data);
        // Refrescar lista y saldo
        await listarRetiros();
        await obtenerSaldo();
        return nuevoRetiro;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al crear retiro";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [listarRetiros, obtenerSaldo]
  );

  return {
    retiros,
    retiro,
    saldo,
    isLoading,
    error,
    listarRetiros,
    obtenerRetiro,
    crearRetiro: crearRetiroWithDeps,
    procesarRetiro,
    obtenerSaldo,
    clearError,
  };
}
