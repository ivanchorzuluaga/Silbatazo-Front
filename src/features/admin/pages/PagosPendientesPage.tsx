/**
 * Página para que el admin revise y apruebe/rechace pagos pendientes
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";
import { Loader2, CheckCircle2, XCircle, Eye, AlertCircle } from "lucide-react";
import type { Partido, EstadoPago } from "@/features/partidos/types/partido.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/forms";

export function PagosPendientesPage() {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState<Partido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [notasAprobar, setNotasAprobar] = useState("");
  const [motivoRechazar, setMotivoRechazar] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    cargarPagosPendientes();
  }, []);

  const cargarPagosPendientes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }

      const data = await partidoEndpoints.listarPagosPendientes(token);
      setPagos(data);
    } catch (err: any) {
      console.error("Error al cargar pagos pendientes:", err);
      const errorMessage = err?.message || err?.detail || "Error al cargar pagos pendientes";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprobar = async () => {
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

      alert("Pago aprobado exitosamente");
      setShowAprobarModal(false);
      setPartidoSeleccionado(null);
      setNotasAprobar("");
      cargarPagosPendientes();
    } catch (err: any) {
      alert(err?.message || "Error al aprobar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRechazar = async () => {
    if (!partidoSeleccionado || !motivoRechazar.trim()) {
      alert("Debes proporcionar un motivo para rechazar el pago");
      return;
    }

    setIsProcessing(true);
    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error("No estás autenticado");
      }

      await partidoEndpoints.rechazarPago(token, partidoSeleccionado.id, motivoRechazar);

      alert("Pago rechazado");
      setShowRechazarModal(false);
      setPartidoSeleccionado(null);
      setMotivoRechazar("");
      cargarPagosPendientes();
    } catch (err: any) {
      alert(err?.message || "Error al rechazar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getEstadoPagoBadge = (estado: EstadoPago) => {
    switch (estado) {
      case "pendiente":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Pendiente
          </span>
        );
      case "en_revision":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            En Revisión
          </span>
        );
      case "aprobado":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Aprobado
          </span>
        );
      case "rechazado":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            Rechazado
          </span>
        );
    }
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Pagos Pendientes de Revisión"
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pagos.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">No hay pagos pendientes</p>
            <p className="text-sm text-muted-foreground">
              Todos los pagos han sido revisados o no hay pagos en revisión.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pagos.map((partido) => (
              <div
                key={partido.id}
                className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">
                        Partido #{partido.id}
                      </h3>
                      {partido.codigo && (
                        <p className="text-xs sm:text-sm font-mono text-muted-foreground mb-2">
                          {partido.codigo}
                        </p>
                      )}
                      <p className="text-sm sm:text-base text-muted-foreground break-words">
                        Cliente: {partido.cliente_full_name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">
                        {partido.cliente_email}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {getEstadoPagoBadge(partido.estado_pago)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 text-sm sm:text-base pt-3 border-t">
                    <div>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-1">Categoría</p>
                      <p className="font-medium">{partido.categoria.nombre}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-1">Municipio</p>
                      <p className="font-medium">{partido.municipio.nombre}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-1">Fecha</p>
                      <p className="font-medium">
                        {new Date(partido.fecha).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-1">Monto</p>
                      <p className="font-medium text-primary text-base sm:text-lg">{formatCurrency(partido.tarifa)}</p>
                    </div>
                  </div>

                  {partido.fecha_pago && (
                    <div className="text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                      <p>
                        Marcado como pagado:{" "}
                        {new Date(partido.fecha_pago).toLocaleString("es-CO", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(getPartidoDetailRoute(partido.id))}
                      className="h-11 sm:h-9 touch-manipulation flex-1 sm:flex-none"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalle
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setPartidoSeleccionado(partido);
                        setShowAprobarModal(true);
                      }}
                      className="h-11 sm:h-9 touch-manipulation flex-1 sm:flex-none"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Aprobar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setPartidoSeleccionado(partido);
                        setShowRechazarModal(true);
                      }}
                      className="h-11 sm:h-9 touch-manipulation flex-1 sm:flex-none"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Aprobar */}
      <Dialog open={showAprobarModal} onOpenChange={setShowAprobarModal}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Aprobar Pago</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              ¿Estás seguro de que deseas aprobar el pago del partido{" "}
              {partidoSeleccionado?.codigo || `#${partidoSeleccionado?.id}`}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField
              label="Notas (opcional)"
              name="notas_aprobar"
              value={notasAprobar}
              onChange={(e) => setNotasAprobar(e.target.value)}
              placeholder="Notas adicionales sobre la aprobación..."
              multiline
              rows={3}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowAprobarModal(false);
                setNotasAprobar("");
              }}
              disabled={isProcessing}
              className="w-full sm:w-auto h-11 sm:h-9 touch-manipulation"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAprobar} 
              disabled={isProcessing}
              className="w-full sm:w-auto h-11 sm:h-9 touch-manipulation"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Aprobar Pago
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Rechazar */}
      <Dialog open={showRechazarModal} onOpenChange={setShowRechazarModal}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Rechazar Pago</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Proporciona un motivo para rechazar el pago del partido{" "}
              {partidoSeleccionado?.codigo || `#${partidoSeleccionado?.id}`}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField
              label="Motivo del rechazo *"
              name="motivo_rechazar"
              value={motivoRechazar}
              onChange={(e) => setMotivoRechazar(e.target.value)}
              placeholder="Ej: No se encontró la transferencia, monto incorrecto, referencia incorrecta..."
              multiline
              rows={4}
              required
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowRechazarModal(false);
                setMotivoRechazar("");
              }}
              disabled={isProcessing}
              className="w-full sm:w-auto h-11 sm:h-9 touch-manipulation"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRechazar}
              disabled={isProcessing || !motivoRechazar.trim()}
              className="w-full sm:w-auto h-11 sm:h-9 touch-manipulation"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar Pago
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

