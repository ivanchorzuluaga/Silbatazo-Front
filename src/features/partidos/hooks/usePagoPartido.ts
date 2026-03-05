/**
 * Hook para manejar la lógica del pago de un partido
 * Separa la lógica de negocio del componente presentacional
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePartido } from "./usePartido";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { notifyPartidosChanged } from "../utils/partidos-sync";
import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";
import { formatCop } from "@/lib/utils";

// Configuración de Nequi
const NEQUI_QR_URL = "/nequi_qr.webp";
const NEQUI_PHONE = import.meta.env.VITE_NEQUI_PHONE || "0091187234";
const NEQUI_NAME = import.meta.env.VITE_NEQUI_NAME || "Silbatazo";

export interface UsePagoPartidoReturn {
  // Estado del partido
  partido: ReturnType<typeof usePartido>["partido"];
  isLoading: boolean;
  error: string | null;

  // Estado del pago
  isMarkingAsPaid: boolean;
  yaPagado: boolean;
  estadoPago: string;

  // Comprobante
  comprobante: File | null;
  comprobantePreview: string | null;
  comprobanteError: string | null;

  // Información de pago
  monto: number;
  referencia: string;
  descripcion: string;
  esPagoGrupal: boolean;
  referenciasGrupo: string[];
  partidosPendientesGrupo: number;
  nequiConfig: {
    qrUrl: string;
    phone: string;
    name: string;
  };

  // Permisos
  tienePermiso: boolean;
  user: ReturnType<typeof useAuth>["user"];

  // Acciones
  handleMarcarComoPagado: () => Promise<void>;
  handleComprobanteChange: (file: File | null) => void;
  handleCopy: (text: string) => void;
  formatCurrency: (value: string | number) => string;
  navigateToDetail: () => void;
  navigateToDashboard: () => void;
}

export function usePagoPartido(partidoId: string | undefined): UsePagoPartidoReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partido, isLoading, error, obtenerPartido, refresh } = usePartido();

  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);
  const [partidosGrupo, setPartidosGrupo] = useState<
    Array<{
      id: number;
      codigo?: string;
      estado_pago: string;
      monto_total?: number | null;
      tipo_partido?: { monto_total: number } | null;
    }>
  >([]);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
  const [comprobanteError, setComprobanteError] = useState<string | null>(null);

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
          }))
        );
      } catch {
        setPartidosGrupo([]);
      }
    };
    cargarGrupo();
  }, [partido?.grupo_pago_codigo, user?.id]);

  // Verificar permisos
  const tienePermiso = user?.id === partido?.cliente;

  // Estado del pago
  const estadoPago = partido?.estado_pago || "pendiente";
  const yaPagado =
    partido?.grupo_pago_codigo && partidosGrupo.length > 0
      ? partidosGrupo.every((p) => p.estado_pago !== "pendiente")
      : estadoPago !== "pendiente";

  // Información de pago: monto del partido (tipo_partido o monto_total)
  const montoPartido =
    partido?.monto_total != null
      ? Number(partido.monto_total)
      : partido?.tipo_partido?.monto_total != null
      ? partido.tipo_partido.monto_total
      : 0;
  const montoGrupo = partidosGrupo
    .filter((p) => p.estado_pago === "pendiente")
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
  const referencia = partido?.grupo_pago_codigo || partido?.codigo || `PARTIDO-${partido?.id || ""}`;
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
          .filter((p) => p.estado_pago === "pendiente")
          .map((p) => p.codigo || `PARTIDO-${p.id}`)
          .filter(Boolean)
      : [];
  const partidosPendientesGrupo =
    partido?.grupo_pago_codigo && partidosGrupo.length > 0
      ? partidosGrupo.filter((p) => p.estado_pago === "pendiente").length
      : 1;

  // Configuración de Nequi
  const nequiConfig = {
    qrUrl: NEQUI_QR_URL,
    phone: NEQUI_PHONE,
    name: NEQUI_NAME,
  };

  // Manejar cambio de comprobante
  const handleComprobanteChange = useCallback((file: File | null) => {
    setComprobanteError(null);

    if (!file) {
      setComprobante(null);
      setComprobantePreview(null);
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setComprobanteError("Solo se permiten imágenes (JPG, PNG, WebP, GIF)");
      return;
    }

    // Validar tamaño (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setComprobanteError("La imagen no puede superar 5MB");
      return;
    }

    setComprobante(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setComprobantePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Marcar como pagado con comprobante
  const handleMarcarComoPagado = useCallback(async () => {
    if (!partido) return;

    const token = authService.getAccessToken();
    if (!token) {
      return;
    }

    // Validar que haya comprobante
    if (!comprobante) {
      setComprobanteError("Debes subir el comprobante de pago");
      return;
    }

    setIsMarkingAsPaid(true);
    try {
      const pendientesGrupo =
        partido.grupo_pago_codigo && partidosGrupo.length > 0
          ? partidosGrupo.filter((p) => p.estado_pago === "pendiente")
          : [{ id: partido.id, estado_pago: partido.estado_pago }];

      for (const p of pendientesGrupo) {
        await partidoEndpoints.marcarPartidoPagado(token, p.id, comprobante);
      }
      notifyPartidosChanged();
      await refresh();

      // Volver a cargar el grupo para reflejar estados EN_REVISION y mostrar feedback
      if (partido.grupo_pago_codigo && user) {
        try {
          const tokenReload = authService.getAccessToken();
          if (tokenReload) {
            const partidos = await partidoEndpoints.listarPartidos(tokenReload, {
              cliente_id: user.id,
            });
            const delGrupo = partidos.filter(
              (p) => p.grupo_pago_codigo === partido.grupo_pago_codigo,
            );
            setPartidosGrupo(
              delGrupo.map((p) => ({
                id: p.id,
                codigo: p.codigo,
                estado_pago: p.estado_pago,
                monto_total: p.monto_total,
                tipo_partido: p.tipo_partido,
              })),
            );
          }
        } catch {
          // Si falla el recálculo del grupo no bloqueamos el flujo
        }
      }
    } catch {
      setComprobanteError("Error al enviar el comprobante. Intenta nuevamente.");
    } finally {
      setIsMarkingAsPaid(false);
    }
  }, [partido, comprobante, partidosGrupo, refresh, user]);

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
    isMarkingAsPaid,
    yaPagado,
    estadoPago,
    comprobante,
    comprobantePreview,
    comprobanteError,
    monto,
    referencia,
    descripcion,
    esPagoGrupal,
    referenciasGrupo,
    partidosPendientesGrupo,
    nequiConfig,
    tienePermiso,
    user,
    handleMarcarComoPagado,
    handleComprobanteChange,
    handleCopy,
    formatCurrency: formatCop,
    navigateToDetail,
    navigateToDashboard,
  };
}
