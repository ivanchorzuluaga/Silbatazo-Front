/**
 * Página para que el admin revise y apruebe/rechace pagos (historial por estado en tabs)
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { FormField } from "@/components/forms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle, Eye, AlertCircle, ImageIcon } from "lucide-react";
import { usePartidos } from "@/features/partidos/hooks/usePartidos";
import { usePagosPendientes } from "../hooks/usePagosPendientes";
import { ROUTES, getPartidoDetailRoute } from "@/lib/constants";
import { formatCop } from "@/lib/utils";
import { getGrossAmount, getNetAmount } from "@/lib/pricing";
import type { Partido, EstadoPago } from "@/features/partidos/types/partido.types";

const TABS_PAGO: { value: EstadoPago; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_revision", label: "En Revisión" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
];

// Badge de estado de pago
function EstadoPagoBadge({ estado }: { estado: EstadoPago }) {
  const config: Record<EstadoPago, { className: string; label: string }> = {
    pendiente: {
      className: "bg-muted text-foreground dark:bg-muted dark:text-foreground",
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
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
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
  onPreview: (url: string) => void;
}

function PagoCard({ partido, onVerDetalle, onAprobar, onRechazar, onPreview }: PagoCardProps) {
  const comprobanteUrl = partido.comprobante_pago_url ?? "";

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold mb-1">Partido #{partido.id}</h3>
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
            <p className="text-muted-foreground text-xs sm:text-sm mb-1">Valor a pagar</p>
            {partido.monto_total != null || partido.tipo_partido?.monto_total != null ? (() => {
              const gross = getGrossAmount(
                partido.monto_total ?? null,
                partido.tipo_partido?.monto_total ?? null
              );
              const net = getNetAmount(gross, partido.tipo_partido?.comision_app ?? null);
              return (
                <div>
                  <p className="font-medium text-primary text-base sm:text-lg tabular-nums">
                    {formatCop(gross)}
                  </p>
                  <p className="text-[11px] text-muted-foreground tabular-nums">
                    Valor del servicio árbitro: {formatCop(net)}
                  </p>
                  <p className="text-[11px] text-muted-foreground tabular-nums">
                    Comisión app: {formatCop(Math.max(gross - net, 0))}
                  </p>
                </div>
              );
            })() : (
              <p className="font-medium text-primary text-base sm:text-lg tabular-nums">—</p>
            )}
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

        {partido.comprobante_pago_url && (
          <div className="pt-3 border-t">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">
              Comprobante de transferencia
            </p>
            <a
              href={comprobanteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ImageIcon className="h-4 w-4 shrink-0" />
              Ver captura del comprobante
            </a>
            <button
              type="button"
              onClick={() => onPreview(comprobanteUrl)}
              className="mt-2 rounded-lg border bg-muted/30 overflow-hidden max-h-40 w-full max-w-xs text-left"
            >
              <img
                src={comprobanteUrl}
                alt="Comprobante de pago"
                className="w-full h-full object-contain object-left-top"
              />
            </button>
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
          {partido.estado_pago === "en_revision" && (
            <>
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
            </>
          )}
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
  onPreview: (url: string) => void;
}

function AprobarModal({
  open,
  partido,
  notas,
  onNotasChange,
  onConfirmar,
  onCancelar,
  isProcessing,
  onPreview,
}: AprobarModalProps) {
  const comprobanteUrl = partido?.comprobante_pago_url ?? "";

  return (
    <Dialog open={open} onOpenChange={onCancelar}>
      <DialogContent className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Aprobar Pago</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Revisa el comprobante y confirma la aprobación del pago del partido{" "}
            {partido?.codigo || `#${partido?.id}`}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {partido?.comprobante_pago_url ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Comprobante de transferencia (captura subida por el cliente)
              </p>
              <a
                href={comprobanteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-2"
              >
                <ImageIcon className="h-4 w-4 shrink-0" />
                Abrir en nueva pestaña
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => onPreview(comprobanteUrl)}
              >
                Ver grande
              </Button>
              <div className="rounded-lg border bg-muted/30 overflow-hidden">
                <img
                  src={comprobanteUrl}
                  alt="Comprobante de pago"
                  className="w-full max-h-64 object-contain object-top"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Este partido no tiene comprobante de pago subido.
            </p>
          )}
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
  onPreview: (url: string) => void;
}

function RechazarModal({
  open,
  partido,
  motivo,
  onMotivoChange,
  onConfirmar,
  onCancelar,
  isProcessing,
  onPreview,
}: RechazarModalProps) {
  const comprobanteUrl = partido?.comprobante_pago_url ?? "";

  return (
    <Dialog open={open} onOpenChange={onCancelar}>
      <DialogContent className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Rechazar Pago</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Revisa el comprobante y proporciona el motivo para rechazar el pago del partido{" "}
            {partido?.codigo || `#${partido?.id}`}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {partido?.comprobante_pago_url ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Comprobante de transferencia (captura subida por el cliente)
              </p>
              <a
                href={comprobanteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-2"
              >
                <ImageIcon className="h-4 w-4 shrink-0" />
                Abrir en nueva pestaña
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => onPreview(comprobanteUrl)}
              >
                Ver grande
              </Button>
              <div className="rounded-lg border bg-muted/30 overflow-hidden">
                <img
                  src={comprobanteUrl}
                  alt="Comprobante de pago"
                  className="w-full max-h-64 object-contain object-top"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Este partido no tiene comprobante de pago subido.
            </p>
          )}
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tabPago, setTabPago] = useState<EstadoPago>("en_revision");

  const filtros = { estado_pago: tabPago };
  const { partidos: pagos, isLoading, error, refetch } = usePartidos(filtros);

  const onPagoProcesado = useCallback(() => {
    refetch();
  }, [refetch]);

  const {
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
  } = usePagosPendientes(onPagoProcesado);

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Pagos de Partidos"
      contentClassName="page-surface"
    >
      <div className="space-y-6">
        {/* Tabs por estado de pago */}
        <FilterTabs
          label="Estado del pago"
          tabs={TABS_PAGO}
          value={tabPago}
          onValueChange={setTabPago}
        />

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
          <div className="rounded-lg border bg-card p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">
              No hay pagos en &quot;{TABS_PAGO.find((t) => t.value === tabPago)?.label}&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              {tabPago === "en_revision"
                ? "No hay pagos en revisión en este momento."
                : "Cambia de pestaña para ver otros estados."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pagos.map((partido) => (
              <PagoCard
                key={partido.id}
                partido={partido}
                onVerDetalle={() => navigate(getPartidoDetailRoute(partido.id))}
                onAprobar={() => abrirModalAprobar(partido)}
                onRechazar={() => abrirModalRechazar(partido)}
                onPreview={(url) => setPreviewUrl(url)}
              />
            ))}
          </div>
        )}
      </div>

      <AprobarModal
        open={showAprobarModal}
        partido={partidoSeleccionado}
        notas={notasAprobar}
        onNotasChange={setNotasAprobar}
        onConfirmar={handleAprobar}
        onCancelar={cerrarModales}
        isProcessing={isProcessing}
        onPreview={(url) => setPreviewUrl(url)}
      />

      <RechazarModal
        open={showRechazarModal}
        partido={partidoSeleccionado}
        motivo={motivoRechazar}
        onMotivoChange={setMotivoRechazar}
        onConfirmar={handleRechazar}
        onCancelar={cerrarModales}
        isProcessing={isProcessing}
        onPreview={(url) => setPreviewUrl(url)}
      />

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Vista previa del comprobante</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Imagen subida por el cliente.
            </DialogDescription>
          </DialogHeader>
          {previewUrl && (
            <div className="rounded-lg border bg-muted/30 overflow-hidden">
              <img
                src={previewUrl}
                alt="Comprobante de pago"
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
