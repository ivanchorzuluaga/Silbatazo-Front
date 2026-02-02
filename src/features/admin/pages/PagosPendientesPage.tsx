/**
 * Página para que el admin revise y apruebe/rechace pagos pendientes
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { FormField } from "@/components/forms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle, Eye, AlertCircle } from "lucide-react";
import { usePagosPendientes } from "../hooks/usePagosPendientes";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";
import type { Partido, EstadoPago } from "@/features/partidos/types/partido.types";

// Utilidad para formatear moneda
function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(num);
}

// Badge de estado de pago
function EstadoPagoBadge({ estado }: { estado: EstadoPago }) {
  const config: Record<EstadoPago, { className: string; label: string }> = {
    pendiente: {
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      label: "Pendiente",
    },
    en_revision: {
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      label: "En Revisión",
    },
    aprobado: {
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      label: "Aprobado",
    },
    rechazado: {
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      label: "Rechazado",
    },
  };

  const { className, label } = config[estado];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

// Card de pago pendiente
interface PagoCardProps {
  partido: Partido;
  onVerDetalle: () => void;
  onAprobar: () => void;
  onRechazar: () => void;
}

function PagoCard({ partido, onVerDetalle, onAprobar, onRechazar }: PagoCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
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
            <EstadoPagoBadge estado={partido.estado_pago} />
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
            <p className="font-medium text-primary text-base sm:text-lg">
              {formatCurrency(partido.tarifa)}
            </p>
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
            onClick={onVerDetalle}
            className="h-11 sm:h-9 touch-manipulation flex-1 sm:flex-none"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalle
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onAprobar}
            className="h-11 sm:h-9 touch-manipulation flex-1 sm:flex-none"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Aprobar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onRechazar}
            className="h-11 sm:h-9 touch-manipulation flex-1 sm:flex-none"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Rechazar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Modal de aprobar
interface AprobarModalProps {
  open: boolean;
  partido: Partido | null;
  notas: string;
  onNotasChange: (notas: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  isProcessing: boolean;
}

function AprobarModal({
  open,
  partido,
  notas,
  onNotasChange,
  onConfirmar,
  onCancelar,
  isProcessing,
}: AprobarModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancelar}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Aprobar Pago</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            ¿Estás seguro de que deseas aprobar el pago del partido{" "}
            {partido?.codigo || `#${partido?.id}`}?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FormField
            label="Notas (opcional)"
            name="notas_aprobar"
            value={notas}
            onChange={(e) => onNotasChange(e.target.value)}
            placeholder="Notas adicionales sobre la aprobación..."
            multiline
            rows={3}
          />
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancelar}
            disabled={isProcessing}
            className="w-full sm:w-auto h-11 sm:h-9 touch-manipulation"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirmar}
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
  );
}

// Modal de rechazar
interface RechazarModalProps {
  open: boolean;
  partido: Partido | null;
  motivo: string;
  onMotivoChange: (motivo: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  isProcessing: boolean;
}

function RechazarModal({
  open,
  partido,
  motivo,
  onMotivoChange,
  onConfirmar,
  onCancelar,
  isProcessing,
}: RechazarModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancelar}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Rechazar Pago</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Proporciona un motivo para rechazar el pago del partido{" "}
            {partido?.codigo || `#${partido?.id}`}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <FormField
            label="Motivo del rechazo *"
            name="motivo_rechazar"
            value={motivo}
            onChange={(e) => onMotivoChange(e.target.value)}
            placeholder="Ej: No se encontró la transferencia, monto incorrecto, referencia incorrecta..."
            multiline
            rows={4}
            required
          />
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancelar}
            disabled={isProcessing}
            className="w-full sm:w-auto h-11 sm:h-9 touch-manipulation"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmar}
            disabled={isProcessing || !motivo.trim()}
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
  );
}

// Componente principal
export function PagosPendientesPage() {
  const navigate = useNavigate();
  const {
    pagos,
    isLoading,
    error,
    partidoSeleccionado,
    showAprobarModal,
    showRechazarModal,
    notasAprobar,
    motivoRechazar,
    isProcessing,
    abrirModalAprobar,
    abrirModalRechazar,
    cerrarModales,
    setNotasAprobar,
    setMotivoRechazar,
    handleAprobar,
    handleRechazar,
  } = usePagosPendientes();

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Pagos Pendientes de Revisión"
      contentClassName="container mx-auto px-4 py-6 max-w-7xl"
    >
      <div className="space-y-6">
        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pagos.length === 0 ? (
          /* Empty State */
          <div className="rounded-lg border bg-card p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">No hay pagos pendientes</p>
            <p className="text-sm text-muted-foreground">
              Todos los pagos han sido revisados o no hay pagos en revisión.
            </p>
          </div>
        ) : (
          /* Lista de pagos */
          <div className="space-y-4">
            {pagos.map((partido) => (
              <PagoCard
                key={partido.id}
                partido={partido}
                onVerDetalle={() => navigate(getPartidoDetailRoute(partido.id))}
                onAprobar={() => abrirModalAprobar(partido)}
                onRechazar={() => abrirModalRechazar(partido)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Aprobar */}
      <AprobarModal
        open={showAprobarModal}
        partido={partidoSeleccionado}
        notas={notasAprobar}
        onNotasChange={setNotasAprobar}
        onConfirmar={handleAprobar}
        onCancelar={cerrarModales}
        isProcessing={isProcessing}
      />

      {/* Modal Rechazar */}
      <RechazarModal
        open={showRechazarModal}
        partido={partidoSeleccionado}
        motivo={motivoRechazar}
        onMotivoChange={setMotivoRechazar}
        onConfirmar={handleRechazar}
        onCancelar={cerrarModales}
        isProcessing={isProcessing}
      />
    </PageLayout>
  );
}
