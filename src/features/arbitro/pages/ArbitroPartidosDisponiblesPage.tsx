/**
 * Página dedicada para partidos disponibles (árbitros)
 */

import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { PartidoDisponibleCard } from "@/features/partidos/components/PartidoDisponibleCard";
import { usePartidosDisponibles } from "@/features/partidos/hooks/usePartidosDisponibles";
import { partidoService } from "@/features/partidos/services/partido.service";
import { ROUTES } from "@/lib/constants";

export function ArbitroPartidosDisponiblesPage() {
  const {
    partidos: partidosDisponibles,
    isLoading,
    error,
    refetch,
  } = usePartidosDisponibles();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTomarPartido = async (partidoId: number) => {
    await partidoService.tomarPartidoDisponible(partidoId);
    await refetch();
  };

  const handleRefrescar = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ARBITRO_DASHBOARD }}
      title="Partidos disponibles"
      contentClassName="page-surface space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Elige el partido que mejor te quede</h2>
          <p className="text-sm text-muted-foreground">
            El primero en confirmar se queda con el partido.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefrescar}
          className="text-sm text-primary hover:text-primary/80"
          disabled={isRefreshing}
        >
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">
          Cargando partidos disponibles...
        </div>
      ) : partidosDisponibles.length === 0 ? (
        <div className="text-center py-12 rounded-lg border bg-card">
          <p className="text-muted-foreground">No hay partidos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partidosDisponibles.map((partido) => (
            <PartidoDisponibleCard
              key={partido.id}
              partido={partido}
              onTomar={handleTomarPartido}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
