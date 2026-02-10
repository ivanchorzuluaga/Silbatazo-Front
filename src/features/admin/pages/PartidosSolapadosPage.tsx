/**
 * Página admin: partidos solapados (mismo árbitro, mismo día, horarios en conflicto)
 * Permite ver los conflictos y reasignar árbitro para resolverlos
 */

import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { usePartidosSolapados } from "../hooks/usePartidosSolapados";
import { PartidoAsignacionCard } from "../components/PartidoAsignacionCard";
import { AlertTriangle, RefreshCw, UserX } from "lucide-react";
import { parseLocalDate } from "@/lib/utils";

export function PartidosSolapadosPage() {
  const {
    grupos,
    isLoading,
    error,
    listarSolapados,
    obtenerArbitrosDisponibles,
    asignarArbitro,
    clearError,
  } = usePartidosSolapados();

  const handleAsignar = async (partidoId: number, data: { arbitro_id: number }) => {
    await asignarArbitro(partidoId, data);
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Partidos Solapados"
      contentClassName="page-surface"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            Partidos Solapados
          </h1>
          <p className="text-muted-foreground mt-1">
            Árbitros con dos o más partidos el mismo día cuyos horarios se pisan (sin respetar la
            brecha de 30 min). Reasigna uno de los partidos a otro árbitro para resolver el
            conflicto.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {isLoading && grupos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando partidos solapados...</p>
          </div>
        )}

        {!isLoading && grupos.length === 0 && (
          <div className="text-center py-12 rounded-lg border bg-card">
            <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No hay partidos solapados</p>
            <p className="text-sm text-muted-foreground mb-4">
              Todos los árbitros tienen horarios que respetan la brecha de 30 minutos entre
              partidos.
            </p>
            <Button onClick={listarSolapados} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        )}

        {grupos.length > 0 && (
          <div className="space-y-8">
            <Button variant="outline" size="sm" onClick={listarSolapados} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar lista
            </Button>

            {grupos.map((grupo, idx) => {
              const fechaStr =
                grupo.fecha &&
                (() => {
                  try {
                    const d = parseLocalDate(grupo.fecha);
                    return d.toLocaleDateString("es-CO", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                  } catch {
                    return grupo.fecha;
                  }
                })();
              return (
                <div
                  key={`${grupo.arbitro_id}-${grupo.fecha}-${idx}`}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
                      <UserX className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{grupo.arbitro_nombre}</h2>
                      <p className="text-sm text-muted-foreground">
                        {fechaStr} · {grupo.partidos.length} partidos en conflicto
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {grupo.partidos.map((partido) => (
                      <PartidoAsignacionCard
                        key={partido.id}
                        partido={partido}
                        onAsignar={handleAsignar}
                        onVerPostulaciones={() => {}}
                        obtenerArbitrosDisponibles={obtenerArbitrosDisponibles}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
