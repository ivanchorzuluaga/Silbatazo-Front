/**
 * Tarjeta para mostrar un tipo de partido (admin)
 */

import { Button } from "@/components/ui/button";
import type { TipoPartidoAdmin } from "@/features/partidos/types/partido.types";
import { formatCop } from "@/lib/utils";

interface TipoPartidoCardProps {
  tipo: TipoPartidoAdmin;
  onEdit: (tipo: TipoPartidoAdmin) => void;
  onToggleActivo: (id: number, activo: boolean) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function TipoPartidoCard({
  tipo,
  onEdit,
  onToggleActivo,
  onDelete,
  isLoading,
}: TipoPartidoCardProps) {
  const handleToggleActivo = () => {
    if (
      confirm(
        `¿Estás seguro de que quieres ${tipo.activo ? "desactivar" : "activar"} el tipo "${
          tipo.nombre
        }"?`
      )
    ) {
      onToggleActivo(tipo.id, !tipo.activo);
    }
  };

  const handleDelete = () => {
    if (confirm(`¿Eliminar el tipo "${tipo.nombre}"? Solo es posible si ningún partido lo usa.`)) {
      onDelete(tipo.id);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{tipo.nombre}</h3>
            {tipo.activo ? (
              <span className="inline-flex items-center rounded-md bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-2 py-0.5 text-xs font-medium">
                Activo
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20 px-2 py-0.5 text-xs font-medium">
                Inactivo
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground font-mono mb-1">{tipo.slug}</p>

          {tipo.duracion_referencial && (
            <p className="text-sm text-muted-foreground mb-2">{tipo.duracion_referencial}</p>
          )}

          <p className="text-lg font-semibold text-primary tabular-nums">{formatCop(tipo.monto)}</p>

          <p className="text-xs text-muted-foreground mt-1">Orden: {tipo.orden}</p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => onEdit(tipo)} disabled={isLoading}>
            Editar
          </Button>
          <Button
            variant={tipo.activo ? "outline" : "outline"}
            size="sm"
            onClick={handleToggleActivo}
            disabled={isLoading}
          >
            {tipo.activo ? "Desactivar" : "Activar"}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
