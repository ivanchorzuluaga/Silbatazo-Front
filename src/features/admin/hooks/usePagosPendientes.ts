/**
 * Hook para gestionar pagos pendientes de revisión (solo admin)
 */

import { useState, useEffect, useCallback } from "react";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import type { Partido } from "@/features/partidos/types/partido.types";

interface UsePagosPendientesReturn {
  pagos: Partido[];
  isLoading: boolean;
  error: string | null;
  
  // Modal state
  partidoSeleccionado: Partido | null;
  showAprobarModal: boolean;
  showRechazarModal: boolean;
  notasAprobar: string;
  motivoRechazar: string;
  isProcessing: boolean;
  
  // Acciones
  cargarPagosPendientes: () => Promise<void>;
  abrirModalAprobar: (partido: Partido) => void;
  abrirModalRechazar: (partido: Partido) => void;
  cerrarModales: () => void;
  setNotasAprobar: (notas: string) => void;
  setMotivoRechazar: (motivo: string) => void;
  handleAprobar: () => Promise<void>;
  handleRechazar: () => Promise<void>;
  clearError: () => void;
}

export function usePagosPendientes(): UsePagosPendientesReturn {
  // Estados de datos
  const [pagos, setPagos] = useState<Partido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de modales
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [notasAprobar, setNotasAprobar] = useState("");
  const [motivoRechazar, setMotivoRechazar] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Cargar pagos pendientes
  const cargarPagosPendientes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }

      const data = await partidoEndpoints.listarPagosPendientes(token);
      setPagos(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err as { detail?: string })?.detail || "Error al cargar pagos pendientes";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Abrir modales
  const abrirModalAprobar = useCallback((partido: Partido) => {
    setPartidoSeleccionado(partido);
    setShowAprobarModal(true);
  }, []);

  const abrirModalRechazar = useCallback((partido: Partido) => {
    setPartidoSeleccionado(partido);
    setShowRechazarModal(true);
  }, []);

  // Cerrar modales
  const cerrarModales = useCallback(() => {
    setShowAprobarModal(false);
    setShowRechazarModal(false);
    setPartidoSeleccionado(null);
    setNotasAprobar("");
    setMotivoRechazar("");
  }, []);

  // Aprobar pago
  const handleAprobar = useCallback(async () => {
    if (!partidoSeleccionado) return;

    setIsProcessing(true);
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }

      await partidoEndpoints.aprobarPago(token, partidoSeleccionado.id, {
        notas_pago: notasAprobar || undefined,
      });

      cerrarModales();
      await cargarPagosPendientes();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al aprobar el pago";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [partidoSeleccionado, notasAprobar, cerrarModales, cargarPagosPendientes]);

  // Rechazar pago
  const handleRechazar = useCallback(async () => {
    if (!partidoSeleccionado || !motivoRechazar.trim()) {
      setError("Debes proporcionar un motivo para rechazar el pago");
      return;
    }

    setIsProcessing(true);
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }

      await partidoEndpoints.rechazarPago(token, partidoSeleccionado.id, motivoRechazar);

      cerrarModales();
      await cargarPagosPendientes();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al rechazar el pago";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [partidoSeleccionado, motivoRechazar, cerrarModales, cargarPagosPendientes]);

  const clearError = useCallback(() => setError(null), []);

  // Cargar al montar
  useEffect(() => {
    cargarPagosPendientes();
  }, [cargarPagosPendientes]);

  return {
    pagos,
    isLoading,
    error,
    
    partidoSeleccionado,
    showAprobarModal,
    showRechazarModal,
    notasAprobar,
    motivoRechazar,
    isProcessing,
    
    cargarPagosPendientes,
    abrirModalAprobar,
    abrirModalRechazar,
    cerrarModales,
    setNotasAprobar,
    setMotivoRechazar,
    handleAprobar,
    handleRechazar,
    clearError,
  };
}
