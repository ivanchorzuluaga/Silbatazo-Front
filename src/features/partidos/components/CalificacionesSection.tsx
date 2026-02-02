/**
 * Componente para mostrar las calificaciones de un partido
 */

import { Button } from "@/components/ui/button";
import type { Calificacion } from "../types/partido.types";

interface CalificacionItemProps {
  calificacion: Calificacion;
}

function CalificacionItem({ calificacion }: CalificacionItemProps) {
  return (
    <div className="p-3 rounded-md border bg-muted/50 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-sm">
            {calificacion.calificador_full_name} → {calificacion.calificado_full_name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: calificacion.puntuacion }, (_, i) => (
              <span key={i} className="text-yellow-400">
                ⭐
              </span>
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              {calificacion.puntuacion}/5
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground shrink-0 ml-2">
          {new Date(calificacion.created_at).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>
      {calificacion.comentario && (
        <p className="text-xs text-muted-foreground mt-2">{calificacion.comentario}</p>
      )}
    </div>
  );
}

interface CalificacionesColumnProps {
  titulo: string;
  emptyMessage: string;
  calificaciones: Calificacion[];
}

function CalificacionesColumn({ titulo, emptyMessage, calificaciones }: CalificacionesColumnProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
        {titulo}
      </h3>
      {calificaciones.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyMessage}</p>
      ) : (
        calificaciones.map((cal) => <CalificacionItem key={cal.id} calificacion={cal} />)
      )}
    </div>
  );
}

interface CalificacionesSectionProps {
  calificaciones: Calificacion[];
  isLoading: boolean;
  puedeCalificar: boolean;
  onCalificar: () => void;
}

export function CalificacionesSection({
  calificaciones,
  isLoading,
  puedeCalificar,
  onCalificar,
}: CalificacionesSectionProps) {
  const calificacionesArbitroACliente = calificaciones.filter((cal) => !cal.es_cliente_calificando);
  const calificacionesClienteAArbitro = calificaciones.filter((cal) => cal.es_cliente_calificando);

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Calificaciones</h2>
        {puedeCalificar && (
          <Button onClick={onCalificar} size="sm">
            Calificar
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Cargando calificaciones...</p>
      ) : calificaciones.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {puedeCalificar
            ? "Aún no hay calificaciones. ¡Sé el primero en calificar!"
            : "Aún no hay calificaciones para este partido."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <CalificacionesColumn
            titulo="Árbitro califica a Cliente"
            emptyMessage="El árbitro aún no ha calificado al cliente"
            calificaciones={calificacionesArbitroACliente}
          />
          <CalificacionesColumn
            titulo="Cliente califica a Árbitro"
            emptyMessage="El cliente aún no ha calificado al árbitro"
            calificaciones={calificacionesClienteAArbitro}
          />
        </div>
      )}
    </div>
  );
}
