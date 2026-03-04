/**
 * Hook para gestionar árbitros en el panel de administrador
 * Maneja listado, filtros, suspensión y activación de árbitros
 */

import { useState, useEffect, useCallback } from "react";
import { arbitroService } from "@/features/arbitro/services/arbitro.service";
import type { Arbitro, ArbitroVerificacionData } from "@/features/arbitro/types/arbitro.types";

interface FiltrosArbitros {
  estado: string;
  busqueda: string;
  ordenamiento: string;
}

interface UseGestionArbitrosReturn {
  // Estado
  arbitros: Arbitro[];
  isLoading: boolean;
  error: string | null;
  
  // Filtros
  filtros: FiltrosArbitros;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  setFiltroEstado: (estado: string) => void;
  setBusqueda: (busqueda: string) => void;
  setOrdenamiento: (ordenamiento: string) => void;
  setCurrentPage: (page: number) => void;
  
  // Modal state
  arbitroSeleccionado: Arbitro | null;
  showSuspenderModal: boolean;
  showActivarModal: boolean;
  comentarios: string;
  isProcesando: boolean;
  
  // Acciones
  cargarArbitros: () => Promise<void>;
  handleBuscar: () => void;
  handleSuspender: (arbitro: Arbitro) => void;
  handleActivar: (arbitro: Arbitro) => void;
  confirmarSuspender: () => Promise<void>;
  confirmarActivar: () => Promise<void>;
  cerrarModales: () => void;
  setComentarios: (comentarios: string) => void;
  clearError: () => void;
}

const FILTROS_INICIALES: FiltrosArbitros = {
  estado: "",
  busqueda: "",
  ordenamiento: "-created_at",
};

export function useGestionArbitros(): UseGestionArbitrosReturn {
  // Estados de datos
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [filtros, setFiltros] = useState<FiltrosArbitros>(FILTROS_INICIALES);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // Estados de modales
  const [arbitroSeleccionado, setArbitroSeleccionado] = useState<Arbitro | null>(null);
  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [showActivarModal, setShowActivarModal] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [isProcesando, setIsProcesando] = useState(false);

  // Cargar árbitros
  const cargarArbitros = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        estado?: string;
        search?: string;
        ordering?: string;
        page?: number;
      } = {};

      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.busqueda) params.search = filtros.busqueda;
      if (filtros.ordenamiento) params.ordering = filtros.ordenamiento;
      params.page = currentPage;

      const data = await arbitroService.listarTodos(params);
      setArbitros(data.results);
      setTotalCount(data.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar árbitros");
    } finally {
      setIsLoading(false);
    }
  }, [filtros.estado, filtros.ordenamiento, filtros.busqueda, currentPage]);

  // Setters de filtros
  const setFiltroEstado = useCallback((estado: string) => {
    setCurrentPage(1);
    setFiltros(prev => ({ ...prev, estado }));
  }, []);

  const setBusqueda = useCallback((busqueda: string) => {
    setCurrentPage(1);
    setFiltros(prev => ({ ...prev, busqueda }));
  }, []);

  const setOrdenamiento = useCallback((ordenamiento: string) => {
    setCurrentPage(1);
    setFiltros(prev => ({ ...prev, ordenamiento }));
  }, []);

  const handleBuscar = useCallback(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    cargarArbitros();
  }, [cargarArbitros, currentPage]);

  // Handlers de modales
  const handleSuspender = useCallback((arbitro: Arbitro) => {
    setArbitroSeleccionado(arbitro);
    setComentarios("");
    setShowSuspenderModal(true);
  }, []);

  const handleActivar = useCallback((arbitro: Arbitro) => {
    setArbitroSeleccionado(arbitro);
    setComentarios("");
    setShowActivarModal(true);
  }, []);

  const cerrarModales = useCallback(() => {
    setShowSuspenderModal(false);
    setShowActivarModal(false);
    setArbitroSeleccionado(null);
    setComentarios("");
  }, []);

  // Confirmar suspensión
  const confirmarSuspender = useCallback(async () => {
    if (!arbitroSeleccionado) return;

    setIsProcesando(true);
    setError(null);

    try {
      const data: ArbitroVerificacionData = {
        estado: "suspendido",
        comentarios: comentarios.trim() || undefined,
      };

      await arbitroService.verificarArbitro(arbitroSeleccionado.id, data);
      await cargarArbitros();
      cerrarModales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al suspender árbitro");
    } finally {
      setIsProcesando(false);
    }
  }, [arbitroSeleccionado, comentarios, cargarArbitros, cerrarModales]);

  // Confirmar activación
  const confirmarActivar = useCallback(async () => {
    if (!arbitroSeleccionado) return;

    setIsProcesando(true);
    setError(null);

    try {
      const data: ArbitroVerificacionData = {
        estado: "aprobado",
        comentarios: comentarios.trim() || undefined,
      };

      await arbitroService.verificarArbitro(arbitroSeleccionado.id, data);
      await cargarArbitros();
      cerrarModales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al activar árbitro");
    } finally {
      setIsProcesando(false);
    }
  }, [arbitroSeleccionado, comentarios, cargarArbitros, cerrarModales]);

  const clearError = useCallback(() => setError(null), []);

  // Cargar al montar y cuando cambian filtros
  useEffect(() => {
    cargarArbitros();
  }, [cargarArbitros]);

  return {
    // Estado
    arbitros,
    isLoading,
    error,
    
    // Filtros
    filtros,
    currentPage,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    totalCount,
    setFiltroEstado,
    setBusqueda,
    setOrdenamiento,
    setCurrentPage,
    
    // Modal state
    arbitroSeleccionado,
    showSuspenderModal,
    showActivarModal,
    comentarios,
    isProcesando,
    
    // Acciones
    cargarArbitros,
    handleBuscar,
    handleSuspender,
    handleActivar,
    confirmarSuspender,
    confirmarActivar,
    cerrarModales,
    setComentarios,
    clearError,
  };
}
