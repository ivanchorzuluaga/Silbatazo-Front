/**
 * Componente para acciones de partido (aceptar, rechazar, cancelar, completar)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePartidoActions } from "../hooks/usePartidoActions";
import { getPartidoPagoRoute } from "@/lib/constants";
import type { PartidoDetail } from "../types/partido.types";

interface PartidoActionsProps {
  partido: PartidoDetail;
  onActionSuccess?: () => void;
  isCliente: boolean;
  isArbitro: boolean;
}

export function PartidoActions({
  partido,
  onActionSuccess,
  isCliente,
  isArbitro,
}: PartidoActionsProps) {
  const navigate = useNavigate();
  const { aceptarPartido, rechazarPartido, cancelarPartido, completarPartido, isLoading, error } =
    usePartidoActions();
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  const handleAceptar = async () => {
    try {
      await aceptarPartido(partido.id);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Error al aceptar partido:", err);
    }
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      alert("Debes proporcionar un motivo de rechazo");
      return;
    }
    try {
      await rechazarPartido(partido.id, { motivo_rechazo: motivoRechazo });
      setShowRechazarModal(false);
      setMotivoRechazo("");
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Error al rechazar partido:", err);
    }
  };

  const handleCancelar = async () => {
    if (!motivoCancelacion.trim()) {
      alert("Debes proporcionar un motivo de cancelación");
      return;
    }
    try {
      await cancelarPartido(partido.id, { motivo_cancelacion: motivoCancelacion });
      setShowCancelarModal(false);
      setMotivoCancelacion("");
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Error al cancelar partido:", err);
    }
  };

  const handleCompletar = async () => {
    try {
      await completarPartido(partido.id);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Error al completar partido:", err);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Acciones del Árbitro */}
      {isArbitro && partido.puede_ser_aceptado && (
        <div className="flex gap-2">
          <Button onClick={handleAceptar} disabled={isLoading} className="flex-1">
            Aceptar Partido
          </Button>
          <Button
            onClick={() => setShowRechazarModal(true)}
            variant="destructive"
            disabled={isLoading}
            className="flex-1"
          >
            Rechazar
          </Button>
        </div>
      )}

      {/* Acción del Árbitro (Completar) */}
      {isArbitro && partido.puede_ser_completado && (
        <Button onClick={handleCompletar} disabled={isLoading} className="w-full">
          Marcar como Completado
        </Button>
      )}

      {/* Botón de Pago - Cliente (si el pago está pendiente o rechazado) */}
      {isCliente &&
        (partido.estado_pago === "pendiente" || partido.estado_pago === "rechazado") && (
          <Button
            onClick={() => navigate(getPartidoPagoRoute(partido.id))}
            className="w-full bg-primary"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {partido.estado_pago === "pendiente" ? "Realizar Pago" : "Reintentar Pago"}
          </Button>
        )}
      
      {/* Botón para ver estado de pago - Cliente (si está en revisión o aprobado) */}
      {isCliente &&
        (partido.estado_pago === "en_revision" || partido.estado_pago === "aprobado") && (
          <Button
            onClick={() => navigate(getPartidoPagoRoute(partido.id))}
            variant="outline"
            className="w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Ver Estado de Pago
          </Button>
        )}

      {/* Botón de Cancelar - Cliente */}
      {isCliente &&
        (partido.estado === "buscando_arbitro" ||
          partido.estado === "pendiente" ||
          partido.estado === "aceptado") && (
          <Button
            onClick={() => setShowCancelarModal(true)}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            Cancelar Partido
          </Button>
        )}

      {/* Botón de Cancelar - Árbitro (solo si está aceptado) */}
      {isArbitro && partido.estado === "aceptado" && (
        <Button
          onClick={() => setShowCancelarModal(true)}
          variant="outline"
          disabled={isLoading}
          className="w-full"
        >
          Cancelar Partido
        </Button>
      )}

      {/* Modal de Rechazo */}
      {showRechazarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Rechazar Partido</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Por favor, proporciona un motivo para rechazar este partido:
            </p>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Motivo del rechazo..."
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleRechazar}
                disabled={isLoading || !motivoRechazo.trim()}
                className="flex-1"
              >
                Confirmar Rechazo
              </Button>
              <Button
                onClick={() => {
                  setShowRechazarModal(false);
                  setMotivoRechazo("");
                }}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelación */}
      <Dialog open={showCancelarModal} onOpenChange={setShowCancelarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Partido</DialogTitle>
            <DialogDescription>
              {isCliente
                ? "Estás a punto de cancelar este partido. Esta acción no se puede deshacer."
                : "Estás a punto de cancelar tu participación en este partido. Esta acción no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Motivo de la cancelación <span className="text-destructive">*</span>
              </label>
              <textarea
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Explica el motivo de la cancelación..."
              />
            </div>
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleCancelar}
                disabled={isLoading || !motivoCancelacion.trim()}
                variant="destructive"
                className="flex-1"
              >
                {isLoading ? "Cancelando..." : "Confirmar Cancelación"}
              </Button>
              <Button
                onClick={() => {
                  setShowCancelarModal(false);
                  setMotivoCancelacion("");
                }}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                Volver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
