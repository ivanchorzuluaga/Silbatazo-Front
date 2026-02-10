/**
 * Página de gestión de retiros para administradores (historial en tabs)
 */

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { useRetiros } from "@/features/arbitro/hooks/useRetiros";
import { RetiroCard } from "../components/RetiroCard";
import { ROUTES } from "@/lib/constants";
import type { Retiro, RetiroProcesarData } from "@/features/arbitro/types/arbitro.types";

type FiltroRetiro = "pendiente" | "procesado" | "rechazado" | "todos";

const TABS_RETIRO: { value: FiltroRetiro; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendientes" },
  { value: "procesado", label: "Procesados" },
  { value: "rechazado", label: "Rechazados" },
];

export function RetirosPage() {
  const { retiros, isLoading, error, listarRetiros, procesarRetiro } = useRetiros();
  const [tabEstado, setTabEstado] = useState<FiltroRetiro>("pendiente");

  useEffect(() => {
    listarRetiros({ estado: tabEstado === "todos" ? undefined : tabEstado });
  }, [listarRetiros, tabEstado]);

  const handleProcesar = async (retiro: Retiro, data: RetiroProcesarData) => {
    await procesarRetiro(retiro.id, data);
    listarRetiros({ estado: tabEstado === "todos" ? undefined : tabEstado });
  };

  const retirosPendientes = retiros.filter((r) => r.estado === "pendiente").length;
  const retirosProcesados = retiros.filter((r) => r.estado === "procesado").length;
  const retirosRechazados = retiros.filter((r) => r.estado === "rechazado").length;

  return (
    <PageLayout
      title="Gestión de Retiros"
      backButton={{ label: "Dashboard Admin", to: ROUTES.ADMIN_DASHBOARD }}
      contentClassName="page-surface"
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

        {/* Tabs por estado */}
        <FilterTabs
          label="Estado"
          tabs={TABS_RETIRO}
          value={tabEstado}
          onValueChange={setTabEstado}
        />

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
                  {tabEstado === "todos"
                    ? "No hay retiros registrados."
                    : `No hay retiros ${tabEstado}.`}
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
