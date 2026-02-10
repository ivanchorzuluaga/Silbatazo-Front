/**
 * Página de lista de partidos con tabs por estado (mobile-first)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { PageLayout } from "@/components/layout";
import { usePartidos } from "../hooks/usePartidos";
import { PartidoCard } from "../components/PartidoCard";
import { PartidoCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import type { EstadoPartido, PartidosListParams } from "../types/partido.types";
import { Calendar, Plus, Search } from "lucide-react";

const TABS: { value: "" | EstadoPartido; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aceptado", label: "Aceptado" },
  { value: "completado", label: "Completado" },
  { value: "cancelado", label: "Cancelado" },
];

export function PartidosListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabEstado, setTabEstado] = useState<"" | EstadoPartido>("");
  const filtros: PartidosListParams = tabEstado ? { estado: tabEstado } : {};
  const { partidos, isLoading, error } = usePartidos(filtros);

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.DASHBOARD }}
      showDashboard={false}
      contentClassName="page-surface max-w-6xl px-3 sm:px-4 py-4 sm:py-8"
    >
      {/* Header compacto */}
      <div className="rounded-xl border border-primary/10 bg-gradient-to-r from-primary/10 to-secondary/10 p-3 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-sm sm:text-2xl font-semibold">Mis Partidos</h1>
            </div>
            <p className="text-[11px] sm:text-base text-muted-foreground">
              {user?.role === "cliente"
                ? "Gestiona tus solicitudes de partidos"
                : user?.role === "arbitro"
                ? "Gestiona tus partidos asignados"
                : "Todos los partidos del sistema"}
            </p>
          </div>
          {user?.role === "cliente" && (
            <Button
              onClick={() => navigate(ROUTES.PARTIDOS_CREAR)}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Crear
            </Button>
          )}
        </div>
      </div>

      {/* Tabs compactos */}
      <FilterTabs
        className="mb-4"
        label="Filtrar por estado"
        tabs={TABS}
        value={tabEstado}
        onValueChange={setTabEstado}
        size="sm"
      />

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PartidoCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Lista de Partidos */}
      {!isLoading && !error && (
        <>
          {partidos.length === 0 ? (
            <Card className="text-center py-6 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="space-y-4">
                <div className="mx-auto h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-xl font-semibold">
                    {tabEstado
                      ? `No hay partidos en "${TABS.find((t) => t.value === tabEstado)?.label}"`
                      : user?.role === "cliente"
                      ? "Aún no tienes partidos"
                      : "No hay partidos asignados"}
                  </h3>
                  <p className="text-[10px] sm:text-base text-muted-foreground">
                    {tabEstado
                      ? "Prueba con otro estado o vuelve a Todos."
                      : user?.role === "cliente"
                      ? "Crea tu primer partido y conecta con árbitros."
                      : "Espera a que te asignen nuevos partidos."}
                  </p>
                </div>

                {tabEstado ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTabEstado("")}
                    className="h-8 text-xs w-full sm:w-auto"
                  >
                    Ver todos
                  </Button>
                ) : (
                  user?.role === "cliente" && (
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        onClick={() => navigate(ROUTES.PARTIDOS_CREAR)}
                        size="sm"
                        className="h-8 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Crear partido
                      </Button>
                      <Button
                        onClick={() => navigate(ROUTES.ARBITROS)}
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                      >
                        <Search className="w-3.5 h-3.5 mr-1.5" />
                        Explorar árbitros
                      </Button>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] sm:text-sm text-muted-foreground">
                Mostrando{" "}
                <span className="font-semibold text-foreground">{partidos.length}</span>{" "}
                partido{partidos.length !== 1 ? "s" : ""}
                {tabEstado && (
                  <span className="ml-1">
                    ({TABS.find((t) => t.value === tabEstado)?.label})
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {partidos.map((partido) => (
                  <PartidoCard key={partido.id} partido={partido} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
