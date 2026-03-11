/**
 * Tarjeta para mostrar un tipo de partido (admin)
 */

import { Button } from "@/components/ui/button";
import type { TipoPartidoAdmin } from "@/features/partidos/types/partido.types";
import { formatCop } from "@/lib/utils";
import { getNetAmount } from "@/lib/pricing";

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
  const duracionMin = tipo.duracion_servicio_minutos ?? 90;
  const montoTotal = Number(tipo.monto_total || 0);
  const costoHora = duracionMin > 0 ? Math.round((montoTotal / duracionMin) * 60) : 0;
  const handleToggleActivo = () => {
    if (
      confirm(
        `¿Estás seguro de que quieres ${tipo.activo ? "desactivar" : "activar"} el tipo "${
          tipo.nombre
        }"?`,
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
    <div className="card-surface p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">{tipo.nombre}</h3>
            <p className="text-[11px] text-muted-foreground font-mono truncate">{tipo.slug}</p>
            {tipo.codigo_corto && (
              <p className="text-[11px] text-muted-foreground font-mono truncate">
                Código: {tipo.codigo_corto}
              </p>
            )}
          </div>
          {tipo.activo ? (
            <span className="inline-flex items-center rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-2.5 py-0.5 text-xs font-medium">
              Activo
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20 px-2.5 py-0.5 text-xs font-medium">
              Inactivo
            </span>
          )}
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-background/70 border border-border/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Valor a pagar
              </p>
              <p className="text-sm font-semibold text-primary tabular-nums">
                {formatCop(montoTotal)}
              </p>
              <p className="text-[10px] text-muted-foreground tabular-nums">
                Valor del servicio árbitro: {formatCop(getNetAmount(montoTotal, tipo.comision_app))}
              </p>
              <p className="text-[10px] text-muted-foreground tabular-nums">
                App: {formatCop(tipo.comision_app)}
              </p>
            </div>
            <div className="rounded-xl bg-background/70 border border-border/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Duración</p>
              <p className="text-xs font-semibold text-foreground">{duracionMin} min</p>
            </div>
            <div className="rounded-xl bg-background/70 border border-border/60 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Costo/h</p>
              <p className="text-xs font-semibold text-foreground tabular-nums">
                {formatCop(costoHora)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            {tipo.duracion_referencial && (
              <span className="rounded-full bg-muted/60 text-muted-foreground px-2.5 py-1">
                {tipo.duracion_referencial}
              </span>
            )}
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1">
              +30 min brecha
            </span>
            <span className="rounded-full bg-muted/60 text-muted-foreground px-2.5 py-1">
              Orden {tipo.orden}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(tipo)} disabled={isLoading}>
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleActivo} disabled={isLoading}>
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
