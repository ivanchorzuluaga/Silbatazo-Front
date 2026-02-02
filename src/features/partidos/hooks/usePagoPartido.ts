/**
 * Hook para manejar la lógica del pago de un partido
 * Separa la lógica de negocio del componente presentacional
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePartido } from "./usePartido";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";

// Configuración de Nequi
const NEQUI_QR_URL = import.meta.env.VITE_NEQUI_QR_URL || "/nequi_qr.jpeg";
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
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
  const [comprobanteError, setComprobanteError] = useState<string | null>(null);

  // Cargar partido al montar
  useEffect(() => {
    if (partidoId) {
      obtenerPartido(parseInt(partidoId));
    }
  }, [partidoId, obtenerPartido]);

  // Verificar permisos
  const tienePermiso = user?.id === partido?.cliente;

  // Estado del pago
  const estadoPago = partido?.estado_pago || "pendiente";
  const yaPagado = estadoPago !== "pendiente";

  // Información de pago
  const monto = partido ? parseFloat(partido.tarifa) : 0;
  const referencia = partido?.codigo || `PARTIDO-${partido?.id || ""}`;
  const descripcion = partido
    ? `Partido ${referencia} - ${partido.categoria.nombre} - ${partido.municipio.nombre}`
    : "";

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
      await partidoEndpoints.marcarPartidoPagado(token, partido.id, comprobante);
      refresh();
    } catch {
      setComprobanteError("Error al enviar el comprobante. Intenta nuevamente.");
    } finally {
      setIsMarkingAsPaid(false);
    }
  }, [partido, comprobante, refresh]);

  // Copiar al portapapeles
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // Formatear moneda
  const formatCurrency = useCallback((value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
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
    nequiConfig,
    tienePermiso,
    user,
    handleMarcarComoPagado,
    handleComprobanteChange,
    handleCopy,
    formatCurrency,
    navigateToDetail,
    navigateToDashboard,
  };
}
