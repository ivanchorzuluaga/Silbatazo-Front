/**
 * Página de gestión de retiros para administradores
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { useRetiros } from "@/features/arbitro/hooks/useRetiros";
import { RetiroCard } from "../components/RetiroCard";
import { ROUTES } from "@/lib/constants";
import type { Retiro, RetiroProcesarData } from "@/features/arbitro/types/arbitro.types";

export function RetirosPage() {
  const {
    retiros,
    isLoading,
    error,
    listarRetiros,
    procesarRetiro,
  } = useRetiros();
  const [filtroEstado, setFiltroEstado] = useState<"pendiente" | "procesado" | "rechazado" | "todos">("pendiente");

  useEffect(() => {
    listarRetiros({ estado: filtroEstado === "todos" ? undefined : filtroEstado });
  }, [listarRetiros, filtroEstado]);

  const handleProcesar = async (retiro: Retiro, data: RetiroProcesarData) => {
    await procesarRetiro(retiro.id, data);
    // Refrescar lista
    listarRetiros({ estado: filtroEstado === "todos" ? undefined : filtroEstado });
  };

  const retirosPendientes = retiros.filter((r) => r.estado === "pendiente").length;
  const retirosProcesados = retiros.filter((r) => r.estado === "procesado").length;
  const retirosRechazados = retiros.filter((r) => r.estado === "rechazado").length;

  return (
    <PageLayout
      title="Gestión de Retiros"
      backButton={{ label: "Dashboard Admin", to: ROUTES.ADMIN_DASHBOARD }}
      contentClassName="container mx-auto px-4 py-8 max-w-7xl"
    >
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">{retirosPendientes}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Procesados</p>
            <p className="text-2xl font-bold text-green-600">{retirosProcesados}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Rechazados</p>
            <p className="text-2xl font-bold text-red-600">{retirosRechazados}</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{retiros.length}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtroEstado === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("todos")}
          >
            Todos
          </Button>
          <Button
            variant={filtroEstado === "pendiente" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("pendiente")}
          >
            Pendientes
          </Button>
          <Button
            variant={filtroEstado === "procesado" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("procesado")}
          >
            Procesados
          </Button>
          <Button
            variant={filtroEstado === "rechazado" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("rechazado")}
          >
            Rechazados
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Lista de retiros */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando retiros...</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {retiros.length === 0 ? (
              <div className="text-center py-12 rounded-lg border bg-card">
                <p className="text-muted-foreground">
                  {filtroEstado === "todos"
                    ? "No hay retiros registrados."
                    : `No hay retiros ${filtroEstado}.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {retiros.map((retiro) => (
                  <RetiroCard
                    key={retiro.id}
                    retiro={retiro}
                    onProcesar={handleProcesar}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}

