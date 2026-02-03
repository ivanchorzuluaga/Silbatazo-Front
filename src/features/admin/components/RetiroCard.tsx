/**
 * Componente de tarjeta para mostrar un retiro en el panel de admin
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormField } from "@/components/forms";
import { formatCop } from "@/lib/utils";
import type { Retiro, RetiroProcesarData } from "@/features/arbitro/types/arbitro.types";

interface RetiroCardProps {
  retiro: Retiro;
  onProcesar: (retiro: Retiro, data: RetiroProcesarData) => Promise<void>;
  isLoading?: boolean;
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  procesado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function RetiroCard({ retiro, onProcesar, isLoading = false }: RetiroCardProps) {
  const estadoColor = estadoColors[retiro.estado] || estadoColors.pendiente;
  const [showProcesarModal, setShowProcesarModal] = useState(false);
  const [accion, setAccion] = useState<"procesado" | "rechazado">("procesado");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [comentariosAdmin, setComentariosAdmin] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcesar = async () => {
    if (accion === "rechazado" && !motivoRechazo.trim()) {
      setError("Debes proporcionar un motivo para rechazar el retiro");
      return;
    }

    setProcesando(true);
    setError(null);

    try {
      const data: RetiroProcesarData = {
        estado: accion,
        motivo_rechazo: accion === "rechazado" ? motivoRechazo : undefined,
        comentarios_admin: comentariosAdmin.trim() || undefined,
      };

      await onProcesar(retiro, data);
      setShowProcesarModal(false);
      setMotivoRechazo("");
      setComentariosAdmin("");
      setAccion("procesado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar retiro");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold">Retiro #{retiro.id}</h3>
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${estadoColor}`}
                >
                  {retiro.estado_display}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Árbitro: {retiro.arbitro_full_name || retiro.arbitro_username}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary">
                {formatCop(parseFloat(retiro.monto))}
              </p>
              <p className="text-xs text-muted-foreground">COP</p>
            </div>
          </div>

          {/* Información bancaria */}
          {(retiro.numero_cuenta || retiro.tipo_cuenta || retiro.banco) && (
            <div className="space-y-1 text-sm">
              {retiro.numero_cuenta && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Cuenta:</span> {retiro.numero_cuenta}
                </p>
              )}
              {retiro.tipo_cuenta && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Tipo:</span> {retiro.tipo_cuenta}
                </p>
              )}
              {retiro.banco && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Banco:</span> {retiro.banco}
                </p>
              )}
            </div>
          )}

          {/* Motivo de rechazo */}
          {retiro.estado === "rechazado" && retiro.motivo_rechazo && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Motivo de rechazo:</p>
              <p className="text-sm text-destructive">{retiro.motivo_rechazo}</p>
            </div>
          )}

          {/* Comentarios del admin */}
          {retiro.comentarios_admin && (
            <div className="p-3 rounded-md bg-muted">
              <p className="text-sm font-medium mb-1">Comentarios:</p>
              <p className="text-sm text-muted-foreground">{retiro.comentarios_admin}</p>
            </div>
          )}

          {/* Fechas */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
            <p>
              <span className="font-medium">Solicitado:</span>{" "}
              {new Date(retiro.created_at).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {retiro.fecha_procesamiento && (
              <p>
                <span className="font-medium">Procesado:</span>{" "}
                {new Date(retiro.fecha_procesamiento).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {retiro.procesado_por_username && (
              <p>
                <span className="font-medium">Por:</span> {retiro.procesado_por_username}
              </p>
            )}
          </div>

          {/* Botón de procesar (solo pendientes) */}
          {retiro.estado === "pendiente" && (
            <div className="pt-2 border-t">
              <Button
                onClick={() => setShowProcesarModal(true)}
                disabled={isLoading}
                className="w-full"
              >
                Procesar Retiro
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de procesar */}
      <Dialog open={showProcesarModal} onOpenChange={setShowProcesarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Procesar Retiro #{retiro.id}</DialogTitle>
            <DialogDescription>Selecciona la acción a realizar con este retiro.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Acción */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Acción</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={accion === "procesado" ? "default" : "outline"}
                  onClick={() => {
                    setAccion("procesado");
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Procesar
                </Button>
                <Button
                  type="button"
                  variant={accion === "rechazado" ? "destructive" : "outline"}
                  onClick={() => {
                    setAccion("rechazado");
                    setError(null);
                  }}
                  className="flex-1"
                >
                  Rechazar
                </Button>
              </div>
            </div>

            {/* Motivo de rechazo (solo si se rechaza) */}
            {accion === "rechazado" && (
              <FormField
                label="Motivo de Rechazo"
                name="motivo_rechazo"
                value={motivoRechazo}
                onChange={(e) => {
                  setMotivoRechazo(e.target.value);
                  setError(null);
                }}
                multiline
                rows={3}
                required
                placeholder="Explica el motivo del rechazo..."
              />
            )}

            {/* Comentarios del admin */}
            <FormField
              label="Comentarios (Opcional)"
              name="comentarios_admin"
              value={comentariosAdmin}
              onChange={(e) => setComentariosAdmin(e.target.value)}
              multiline
              rows={3}
              placeholder="Comentarios adicionales..."
            />

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleProcesar}
                disabled={procesando || (accion === "rechazado" && !motivoRechazo.trim())}
                variant={accion === "rechazado" ? "destructive" : "default"}
                className="flex-1"
              >
                {procesando ? "Procesando..." : accion === "procesado" ? "Procesar" : "Rechazar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowProcesarModal(false);
                  setMotivoRechazo("");
                  setComentariosAdmin("");
                  setAccion("procesado");
                  setError(null);
                }}
                disabled={procesando}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
