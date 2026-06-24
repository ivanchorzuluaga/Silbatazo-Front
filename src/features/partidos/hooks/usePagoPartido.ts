/**
 * Hook para manejar la lógica del pago de un partido
 * Separa la lógica de negocio del componente presentacional
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePartido } from "./usePartido";
import { partidoEndpoints, type WompiCheckoutResponse } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";
import { formatCop } from "@/lib/utils";

export interface UsePagoPartidoReturn {
  // Estado del partido
  partido: ReturnType<typeof usePartido>["partido"];
  isLoading: boolean;
  error: string | null;

  // Estado del pago
  yaPagado: boolean;
  estadoPago: string;

  // Información de pago
  monto: number;
  referencia: string;
  descripcion: string;
  esPagoGrupal: boolean;
  referenciasGrupo: string[];
  partidosPendientesGrupo: number;

  // Checkout Wompi
  checkoutData: WompiCheckoutResponse | null;
  isCheckoutLoading: boolean;
  checkoutError: string | null;

  // Permisos
  tienePermiso: boolean;
  user: ReturnType<typeof useAuth>["user"];

  // Acciones
  handleCopy: (text: string) => void;
  handleCrearCheckout: () => Promise<void>;
  refreshPartido: () => Promise<void>;
  formatCurrency: (value: string | number) => string;
  navigateToDetail: () => void;
  navigateToDashboard: () => void;
}

export function usePagoPartido(partidoId: string | undefined): UsePagoPartidoReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partido, isLoading, error, obtenerPartido, refresh } = usePartido();

  const [partidosGrupo, setPartidosGrupo] = useState<
    Array<{
      id: number;
      codigo?: string;
      estado_pago: string;
      monto_total?: number | null;
      tipo_partido?: { monto_total: number } | null;
    }>
  >([]);
  const [checkoutData, setCheckoutData] = useState<WompiCheckoutResponse | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Cargar partido al montar
  useEffect(() => {
    if (partidoId) {
      obtenerPartido(parseInt(partidoId));
    }
  }, [partidoId, obtenerPartido]);

  useEffect(() => {
    const cargarGrupo = async () => {
      if (!partido?.grupo_pago_codigo || !user) {
        setPartidosGrupo([]);
        return;
      }
      const token = authService.getAccessToken();
      if (!token) return;
      try {
        const partidos = await partidoEndpoints.listarPartidos(token, { cliente_id: user.id });
        const delGrupo = partidos.filter((p) => p.grupo_pago_codigo === partido.grupo_pago_codigo);
        setPartidosGrupo(
          delGrupo.map((p) => ({
            id: p.id,
            codigo: p.codigo,
            estado_pago: p.estado_pago,
            monto_total: p.monto_total,
            tipo_partido: p.tipo_partido,
          })),
        );
      } catch {
        setPartidosGrupo([]);
      }
    };
    cargarGrupo();
  }, [partido?.grupo_pago_codigo, user?.id]);

  useEffect(() => {
    setCheckoutData(null);
    setCheckoutError(null);
  }, [partido?.id, partido?.grupo_pago_codigo]);

  // Verificar permisos
  const tienePermiso = user?.id === partido?.cliente;

  // Estado del pago
  const estadoPago = partido?.estado_pago || "pendiente";
  const requierePago =
    partido?.grupo_pago_codigo && partidosGrupo.length > 0
      ? partidosGrupo.some(
          (p) => p.estado_pago === "pendiente" || p.estado_pago === "rechazado",
        )
      : estadoPago === "pendiente" || estadoPago === "rechazado";
  const yaPagado = !requierePago;

  // Información de pago: monto del partido (tipo_partido o monto_total)
  const montoPartido =
    partido?.monto_total != null
      ? Number(partido.monto_total)
      : partido?.tipo_partido?.monto_total != null
        ? partido.tipo_partido.monto_total
        : 0;
  const montoGrupo = partidosGrupo
    .filter((p) => p.estado_pago === "pendiente" || p.estado_pago === "rechazado")
    .reduce((acc, p) => {
      const monto =
        p.monto_total != null
          ? Number(p.monto_total)
          : p.tipo_partido?.monto_total != null
            ? p.tipo_partido.monto_total
            : 0;
      return acc + monto;
    }, 0);
  const monto = montoGrupo > 0 ? montoGrupo : montoPartido;
  const referencia =
    partido?.grupo_pago_codigo || partido?.codigo || `PARTIDO-${partido?.id || ""}`;
  const descripcion = partido
    ? [
        partido.grupo_pago_codigo
          ? `Grupo ${referencia} (${Math.max(partidosGrupo.length, 1)} partidos)`
          : `Partido ${referencia}`,
        partido.tipo_partido?.nombre ?? partido.categoria?.nombre,
        partido.municipio?.nombre,
      ]
        .filter(Boolean)
        .join(" - ")
    : "";
  const esPagoGrupal = Boolean(partido?.grupo_pago_codigo && partidosGrupo.length > 1);
  const referenciasGrupo =
    partido?.grupo_pago_codigo && partidosGrupo.length > 0
      ? partidosGrupo
          .filter((p) => p.estado_pago === "pendiente" || p.estado_pago === "rechazado")
          .map((p) => p.codigo || `PARTIDO-${p.id}`)
          .filter(Boolean)
      : [];
  const partidosPendientesGrupo =
    partido?.grupo_pago_codigo && partidosGrupo.length > 0
      ? partidosGrupo.filter(
          (p) => p.estado_pago === "pendiente" || p.estado_pago === "rechazado",
        ).length
      : 1;

  const handleCrearCheckout = useCallback(async () => {
    if (!partido) return;
    const token = authService.getAccessToken();
    if (!token) return;

    setIsCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const data = await partidoEndpoints.crearWompiCheckout(token, partido.id);
      setCheckoutData(data);
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Error al iniciar el pago con Wompi",
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [partido]);

  // Copiar al portapapeles
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // Navegación
  const navigateToDetail = useCallback(() => {
    if (partido) {
      navigate(getPartidoDetailRoute(partido.id));
    }
  }, [partido, navigate]);

  const navigateToDashboard = useCallback(() => {
    navigate(ROUTES.CLIENTE_DASHBOARD);
  }, [navigate]);

  return {
    partido,
    isLoading,
    error,
    yaPagado,
    estadoPago,
    monto,
    referencia,
    descripcion,
    esPagoGrupal,
    referenciasGrupo,
    partidosPendientesGrupo,
    checkoutData,
    isCheckoutLoading,
    checkoutError,
    tienePermiso,
    user,
    handleCopy,
    handleCrearCheckout,
    refreshPartido: refresh,
    formatCurrency: formatCop,
    navigateToDetail,
    navigateToDashboard,
  };
}
