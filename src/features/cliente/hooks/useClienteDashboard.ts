/**
 * Hook para el dashboard del cliente
 * Separa la lógica de negocio del componente presentacional
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePartidos } from "@/features/partidos/hooks/usePartidos";
import { ROUTES, getPartidoDetailRoute, getPartidoPagoRoute } from "@/lib/constants";
import { parseLocalDate } from "@/lib/utils";

export interface DashboardStats {
  total: number;
  pendientes: number;
  aceptados: number;
  completados: number;
  pagosPendientes: number;
}

export interface UseClienteDashboardReturn {
  // Usuario
  user: ReturnType<typeof useAuth>["user"];
  username: string;

  // Estado de carga y error
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  // Estadísticas
  stats: DashboardStats;

  // Partidos
  proximosPartidos: ReturnType<typeof usePartidos>["partidos"];
  partidosRecientes: ReturnType<typeof usePartidos>["partidos"];
  partidosPagosPendientes: ReturnType<typeof usePartidos>["partidos"];
  partidosPagosEnRevision: ReturnType<typeof usePartidos>["partidos"];

  // Navegación
  navigateToCrearPartido: () => void;
  navigateToArbitros: () => void;
  navigateToPartidos: () => void;
  navigateToPartido: (id: number) => void;
  navigateToPago: (id: number) => void;
}

export function useClienteDashboard(): UseClienteDashboardReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partidos, isLoading, error, refetch } = usePartidos();

  // Nombre del usuario
  const username = user?.username || "Cliente";

  // Calcular estadísticas
  const stats = useMemo<DashboardStats>(() => {
    const total = partidos.length;
    const pendientes = partidos.filter(
      (p) => p.estado === "pendiente" || p.estado === "buscando_arbitro"
    ).length;
    const aceptados = partidos.filter((p) => p.estado === "aceptado").length;
    const completados = partidos.filter((p) => p.estado === "completado").length;
    const pagosPendientes = partidos.filter((p) => p.estado_pago === "pendiente").length;

    return { total, pendientes, aceptados, completados, pagosPendientes };
  }, [partidos]);

  // Próximos partidos (confirmados, fecha futura)
  const proximosPartidos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return partidos
      .filter((p) => {
        const fechaPartido = parseLocalDate(p.fecha);
        return fechaPartido >= hoy && (p.estado === "aceptado" || p.estado === "pendiente");
      })
      .sort((a, b) => parseLocalDate(a.fecha).getTime() - parseLocalDate(b.fecha).getTime())
      .slice(0, 4);
  }, [partidos]);

  // Partidos recientes (últimos creados)
  const partidosRecientes = useMemo(() => {
    return partidos
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4);
  }, [partidos]);

  // Partidos con pago pendiente
  const partidosPagosPendientes = useMemo(() => {
    return partidos
      .filter((p) => p.estado_pago === "pendiente" && p.estado !== "cancelado")
      .slice(0, 3);
  }, [partidos]);

  // Partidos con pago en revisión
  const partidosPagosEnRevision = useMemo(() => {
    return partidos
      .filter((p) => p.estado_pago === "en_revision" && p.estado !== "cancelado")
      .slice(0, 3);
  }, [partidos]);

  // Funciones de navegación
  const navigateToCrearPartido = () => navigate(ROUTES.PARTIDOS_CREAR);
  const navigateToArbitros = () => navigate(ROUTES.ARBITROS);
  const navigateToPartidos = () => navigate(ROUTES.PARTIDOS);
  const navigateToPartido = (id: number) => navigate(getPartidoDetailRoute(id));
  const navigateToPago = (id: number) => navigate(getPartidoPagoRoute(id));

  return {
    user,
    username,
    isLoading,
    error,
    refetch,
    stats,
    proximosPartidos,
    partidosRecientes,
    partidosPagosPendientes,
    partidosPagosEnRevision,
    navigateToCrearPartido,
    navigateToArbitros,
    navigateToPartidos,
    navigateToPartido,
    navigateToPago,
  };
}
