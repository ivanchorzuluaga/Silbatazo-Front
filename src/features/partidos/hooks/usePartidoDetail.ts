/**
 * Hook para gestionar el detalle de un partido
 * Combina lógica de partido y calificaciones
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePartido } from "./usePartido";
import { useCalificaciones } from "./useCalificaciones";
import { useAuth } from "@/hooks/useAuth";
import type { PartidoDetail } from "../types/partido.types";

interface UsePartidoDetailReturn {
  // Partido
  partido: PartidoDetail | null;
  isLoading: boolean;
  error: string | null;
  refetchPartido: () => void;
  
  // Calificaciones
  calificaciones: ReturnType<typeof useCalificaciones>["calificaciones"];
  isLoadingCalificaciones: boolean;
  refetchCalificaciones: () => void;
  
  // Permisos
  isCliente: boolean;
  isArbitro: boolean;
  isAdmin: boolean;
  puedeEditar: boolean;
  puedeCalificar: boolean;
  
  // Modal state
  showEditModal: boolean;
  showCalificarModal: boolean;
  setShowEditModal: (show: boolean) => void;
  setShowCalificarModal: (show: boolean) => void;
  
  // Helpers
  getCalificadoNombre: () => string;
}

export function usePartidoDetail(partidoId: number | undefined): UsePartidoDetailReturn {
  const { user } = useAuth();
  const { partido, isLoading, error, obtenerPartido } = usePartido();
  const {
    calificaciones,
    isLoading: isLoadingCalificaciones,
    listarCalificacionesPartido,
  } = useCalificaciones();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCalificarModal, setShowCalificarModal] = useState(false);

  // Cargar partido y calificaciones
  useEffect(() => {
    if (partidoId) {
      obtenerPartido(partidoId);
      listarCalificacionesPartido(partidoId);
    }
  }, [partidoId, obtenerPartido, listarCalificacionesPartido]);

  // Refetch functions
  const refetchPartido = useCallback(() => {
    if (partidoId) {
      obtenerPartido(partidoId);
    }
  }, [partidoId, obtenerPartido]);

  const refetchCalificaciones = useCallback(() => {
    if (partidoId) {
      listarCalificacionesPartido(partidoId);
    }
  }, [partidoId, listarCalificacionesPartido]);

  // Calcular permisos (memoizados)
  const isCliente = useMemo(() => {
    return user?.id !== undefined && partido !== null && Number(user.id) === Number(partido.cliente);
  }, [user?.id, partido]);

  const isArbitro = useMemo(() => {
    return Boolean(
      user?.role === "arbitro" &&
        partido?.arbitro_info &&
        user?.username === partido.arbitro_info.username
    );
  }, [user?.role, user?.username, partido?.arbitro_info]);

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const puedeEditar = useMemo(() => {
    if (isAdmin) return true;
    return isCliente && (partido?.estado === "buscando_arbitro" || partido?.estado === "pendiente");
  }, [isAdmin, isCliente, partido?.estado]);

  const puedeCalificar = useMemo(() => {
    return (
      partido?.estado === "completado" &&
      (isCliente || isArbitro) &&
      !calificaciones.some((cal) => cal.calificador === user?.id)
    );
  }, [partido?.estado, isCliente, isArbitro, calificaciones, user?.id]);

  // Helper para obtener nombre del calificado
  const getCalificadoNombre = useCallback(() => {
    if (isCliente && partido?.arbitro_info) {
      return partido.arbitro_info.full_name || partido.arbitro_info.username;
    }
    if (isArbitro && partido) {
      return partido.cliente_full_name || partido.cliente_username;
    }
    return "";
  }, [isCliente, isArbitro, partido]);

  return {
    partido,
    isLoading,
    error,
    refetchPartido,
    
    calificaciones,
    isLoadingCalificaciones,
    refetchCalificaciones,
    
    isCliente,
    isArbitro,
    isAdmin,
    puedeEditar,
    puedeCalificar,
    
    showEditModal,
    showCalificarModal,
    setShowEditModal,
    setShowCalificarModal,
    
    getCalificadoNombre,
  };
}
