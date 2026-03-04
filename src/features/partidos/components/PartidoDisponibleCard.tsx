/**
 * Card para partidos disponibles en dashboard de árbitros
 */

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Calendar, Clock, MapPin } from "lucide-react";
import { formatCop, parseLocalDate } from "@/lib/utils";
import { getGrossAmount, getRoleAmounts } from "@/lib/pricing";
import { useAuth } from "@/hooks/useAuth";
import type { Partido } from "../types/partido.types";

interface PartidoDisponibleCardProps {
  partido: Partido;
  onTomar: (partidoId: number) => Promise<void>;
}

export function PartidoDisponibleCard({ partido, onTomar }: PartidoDisponibleCardProps) {
  const { user } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monto = partido.monto_total ?? partido.tipo_partido?.monto_total ?? null;
  const cancha = partido.cancha_nombre || partido.lugar;
  const ubicacion = partido.barrio ? `${cancha} · ${partido.barrio}` : cancha;
  const grossAmount = getGrossAmount(
    partido.monto_total,
    partido.tipo_partido?.monto_total ?? null
  );
  const { net } = getRoleAmounts(
    grossAmount,
    partido.comision_app ?? partido.tipo_partido?.comision_app ?? null,
    user?.role
  );
  const tieneConflicto = Boolean(partido.tiene_conflicto_horario);

  const handleTomar = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onTomar(partido.id);
      setIsConfirmOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al tomar partido";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="border border-primary/15 bg-card/95">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Partido en {partido.municipio?.nombre ?? "municipio"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {partido.categoria?.nombre ?? "Categoría"}
              </p>
            </div>
            {tieneConflicto && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                Conflicto horario
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{partido.hora_str}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {ubicacion}
                {partido.direccion ? ` · ${partido.direccion}` : ""}
              </span>
            </div>
          </div>

          {partido.notas_cliente && (
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-foreground">
              <p className="font-semibold text-[11px] uppercase text-muted-foreground mb-1">
                Notas
              </p>
              <p>{partido.notas_cliente}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Pago al árbitro</p>
              <p className="text-sm font-semibold text-primary tabular-nums">
                {monto != null ? formatCop(net) : "Por confirmar"}
              </p>
            </div>
            <Button
              onClick={() => (tieneConflicto ? setIsConfirmOpen(true) : handleTomar())}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Reservando..." : "Tomar para revisar"}
            </Button>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Este partido se cruza con otro en tu agenda. Si el lugar es cercano puedes continuar,
              pero debes asegurarte de cumplir ambos compromisos.
            </p>
            <p className="text-foreground font-medium">
              ¿Deseas reservar este partido y luego decidir aceptarlo o rechazarlo?
            </p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleTomar} disabled={isSubmitting}>
              {isSubmitting ? "Reservando..." : "Sí, reservar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
