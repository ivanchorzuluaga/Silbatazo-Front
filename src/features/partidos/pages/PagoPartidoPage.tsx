/**
 * Página para realizar el pago de un partido
 * Muestra el QR de Nequi y la información necesaria para la transferencia
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { usePartido } from "@/features/partidos/hooks/usePartido";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";
import { Loader2, CheckCircle2, XCircle, Copy, ExternalLink } from "lucide-react";

// Configuración de Nequi (debería venir de variables de entorno)
// Si no hay URL configurada, intenta usar la imagen en /public/nequi_qr.jpeg
const NEQUI_QR_URL =
  import.meta.env.VITE_NEQUI_QR_URL || "/nequi_qr.jpeg";
const NEQUI_PHONE = import.meta.env.VITE_NEQUI_PHONE || "0091187234";
const NEQUI_NAME = import.meta.env.VITE_NEQUI_NAME || "Silbatazo";

export function PagoPartidoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partido, isLoading, error, obtenerPartido, refresh } = usePartido();

  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false);

  useEffect(() => {
    if (id) {
      obtenerPartido(parseInt(id));
    }
  }, [id, obtenerPartido]);

  const handleMarcarComoPagado = async () => {
    if (!partido) return;
    
    const token = authService.getAccessToken();
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    setIsMarkingAsPaid(true);
    try {
      await partidoEndpoints.marcarPartidoPagado(token, partido.id);
      alert("Pago marcado como enviado. Estará en revisión.");
      refresh();
    } catch (err: any) {
      alert(err?.message || "Error al marcar el pago. Intenta nuevamente.");
    } finally {
      setIsMarkingAsPaid(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Notificación silenciosa - solo copia al portapapeles
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (isLoading) {
    return (
      <PageLayout title="Pago del Partido">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (error || !partido) {
    return (
      <PageLayout title="Pago del Partido" backButton={{ label: "Volver", to: ROUTES.CLIENTE_DASHBOARD }}>
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive">{error || "Partido no encontrado"}</p>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.CLIENTE_DASHBOARD)}
            className="mt-4"
          >
            Volver al Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Verificar que el usuario sea el cliente del partido
  if (user?.id !== partido.cliente) {
    return (
      <PageLayout title="Pago del Partido" backButton={{ label: "Volver", to: ROUTES.CLIENTE_DASHBOARD }}>
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive">No tienes permiso para ver este pago</p>
        </div>
      </PageLayout>
    );
  }

  const monto = parseFloat(partido.tarifa);
  const referencia = partido.codigo || `PARTIDO-${partido.id}`;
  const descripcion = `Partido ${referencia} - ${partido.categoria.nombre} - ${partido.municipio.nombre}`;

  // Estado del pago
  const estadoPago = partido.estado_pago;
  const yaPagado = estadoPago !== "pendiente";

  return (
    <PageLayout
      title="Pago del Partido"
      backButton={{ label: "Volver al Partido", to: getPartidoDetailRoute(partido.id) }}
    >
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-6">
        {/* Información del partido */}
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Información del Partido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-muted-foreground">Código:</span>
              <span className="font-medium font-mono break-all">{referencia}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-muted-foreground">Categoría:</span>
              <span className="font-medium">{partido.categoria.nombre}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-muted-foreground">Municipio:</span>
              <span className="font-medium">{partido.municipio.nombre}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium">
                {new Date(partido.fecha).toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Estado del pago */}
        {yaPagado && (
          <div
            className={`rounded-xl border p-5 ${
              estadoPago === "aprobado"
                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                : estadoPago === "en_revision"
                ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {estadoPago === "aprobado" ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              ) : estadoPago === "en_revision" ? (
                <Loader2 className="h-6 w-6 animate-spin text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base mb-1">
                  {estadoPago === "aprobado"
                    ? "Pago Aprobado"
                    : estadoPago === "en_revision"
                    ? "Pago en Revisión"
                    : "Pago Rechazado"}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {estadoPago === "aprobado"
                    ? "Tu pago ha sido verificado y aprobado."
                    : estadoPago === "en_revision"
                    ? "Tu pago está siendo revisado por el administrador."
                    : partido.notas_pago || "El pago fue rechazado. Por favor, verifica la información."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información de pago */}
        {!yaPagado && (
          <>
            <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6">Realizar Pago con Nequi</h2>

              {/* Layout: QR a la izquierda, información a la derecha en desktop */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                {/* QR Code - Lado izquierdo en desktop */}
                <div className="flex flex-col items-center lg:items-start lg:shrink-0">
                  <div className="bg-white p-4 rounded-xl border-2 border-primary/20 shadow-sm mb-3">
                    <img
                      src={NEQUI_QR_URL}
                      alt="QR Code Nequi"
                      className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 object-contain"
                      onError={(e) => {
                        // Si la imagen no carga, ocultar el contenedor
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const container = target.closest("div.flex.flex-col");
                        if (container) {
                          (container as HTMLElement).style.display = "none";
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground text-center lg:text-left max-w-xs">
                    Escanea el código QR con la app de Nequi
                  </p>
                </div>

                {/* Información de transferencia - Lado derecho en desktop */}
                <div className="flex-1 space-y-4 min-w-0">
                  <div className="bg-muted/50 rounded-xl p-4 sm:p-5 space-y-4">
                    <div>
                      <label className="text-sm sm:text-base font-medium text-muted-foreground block mb-2">
                        Monto a Pagar
                      </label>
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3 sm:p-4">
                        <span className="text-xl sm:text-2xl font-bold text-primary break-all pr-2">{formatCurrency(monto)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(monto.toString(), "Monto")}
                          className="shrink-0 h-9 w-9 touch-manipulation"
                        >
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm sm:text-base font-medium text-muted-foreground block mb-2">
                        Número de Teléfono Nequi
                      </label>
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3 sm:p-4 gap-2">
                        <span className="text-base sm:text-lg font-mono font-semibold break-all">{NEQUI_PHONE}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(NEQUI_PHONE, "Número de Nequi")}
                          className="shrink-0 h-9 w-9 touch-manipulation"
                        >
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                        Nombre: {NEQUI_NAME}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm sm:text-base font-medium text-muted-foreground block mb-2">
                        Referencia (Código del Partido)
                      </label>
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3 sm:p-4 gap-2">
                        <span className="text-base sm:text-lg font-mono font-semibold break-all">{referencia}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(referencia, "Referencia")}
                          className="shrink-0 h-9 w-9 touch-manipulation"
                        >
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm sm:text-base font-medium text-muted-foreground block mb-2">
                        Descripción (Opcional)
                      </label>
                      <div className="flex items-center justify-between bg-background border rounded-lg p-3 sm:p-4 gap-2">
                        <span className="text-sm sm:text-base break-words flex-1">{descripcion}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(descripcion, "Descripción")}
                          className="shrink-0 h-9 w-9 touch-manipulation"
                        >
                          <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Instrucciones */}
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-5">
                    <h3 className="font-semibold mb-3 text-base sm:text-lg text-blue-900 dark:text-blue-100">
                      Instrucciones para pagar:
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-blue-800 dark:text-blue-200">
                      <li>Abre la app de Nequi</li>
                      <li>Ve a "Enviar" o "Transferir"</li>
                      <li>Ingresa el número: <strong className="font-mono">{NEQUI_PHONE}</strong></li>
                      <li>Ingresa el monto: <strong>{formatCurrency(monto)}</strong></li>
                      <li>En la referencia, escribe: <strong className="font-mono">{referencia}</strong></li>
                      <li>Confirma y realiza la transferencia</li>
                      <li>Vuelve aquí y marca como "Ya pagué"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de confirmación */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
              <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 text-center px-2 max-w-2xl mx-auto">
                Una vez que hayas realizado la transferencia, marca el pago como enviado para que
                podamos verificarlo.
              </p>
              <div className="max-w-md mx-auto">
                <Button
                  onClick={handleMarcarComoPagado}
                  disabled={isMarkingAsPaid}
                  className="w-full h-12 sm:h-11 touch-manipulation text-base font-semibold"
                  size="lg"
                >
                  {isMarkingAsPaid ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Ya Realicé el Pago
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Link a Nequi */}
        <div className="text-center pt-2">
          <a
            href="https://www.nequi.com.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-primary hover:underline touch-manipulation py-2"
          >
            Descargar Nequi
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </PageLayout>
  );
}

