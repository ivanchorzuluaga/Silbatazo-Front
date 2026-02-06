/**
 * Página de lista de partidos con tabs por estado
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout";
import { usePartidos } from "../hooks/usePartidos";
import { PartidoCard } from "../components/PartidoCard";
import { PartidoCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import type { EstadoPartido, PartidosListParams } from "../types/partido.types";
import { Calendar, Plus, Search, CheckCircle, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS: { value: "" | EstadoPartido; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "buscando_arbitro", label: "Buscando árbitro" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aceptado", label: "Aceptado" },
  { value: "completado", label: "Completado" },
  { value: "rechazado", label: "Rechazado" },
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
      contentClassName="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-7xl"
    >
      {/* Header compacto en móvil */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-3 sm:mb-5 border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="space-y-0.5 sm:space-y-2">
            <h1 className="text-base sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-3">
              <Calendar className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-primary shrink-0" />
              Mis Partidos
            </h1>
            <p className="text-muted-foreground text-xs sm:text-base">
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
              className="shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto h-8 text-xs shrink-0"
            >
              <Plus className="w-3 h-3 mr-1.5 sm:mr-2" />
              Crear partido
            </Button>
          )}
        </div>
      </div>

      {/* Tabs por estado: más compactos en móvil */}
      <div className="mb-4 sm:mb-6">
        <p className="text-xs text-muted-foreground mb-1.5 sm:mb-2">
          Filtrar por estado
        </p>
        <div className="flex gap-1 p-0.5 sm:p-1 rounded-lg bg-muted/50 border border-border overflow-x-auto scrollbar-hide -mx-1 px-1">
          {TABS.map((tab) => (
            <button
              key={tab.value || "todos"}
              type="button"
              onClick={() => setTabEstado(tab.value)}
              className={cn(
                "shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap touch-manipulation min-h-[28px] sm:min-h-8",
                tabEstado === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center py-4 sm:py-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-primary/10 rounded-full">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm sm:text-base font-medium text-primary">Cargando partidos...</span>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <PartidoCardSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {/* Lista de Partidos */}
      {!isLoading && !error && (
        <>
          {partidos.length === 0 ? (
            <Card className="text-center py-4 sm:py-12 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="space-y-3 sm:space-y-5 px-4">
                <div className="relative mx-auto w-10 h-10 sm:w-16 sm:h-16">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                    <Calendar className="size-5 sm:size-8 text-white" />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-xl font-bold text-foreground">
                    {tabEstado
                      ? `No hay partidos en "${TABS.find((t) => t.value === tabEstado)?.label}"`
                      : user?.role === "cliente"
                      ? "¡Aún no tienes partidos!"
                      : "No hay partidos asignados"}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-base max-w-sm mx-auto leading-snug">
                    {tabEstado
                      ? "Prueba con otro estado o vuelve a Todos para ver la lista completa."
                      : user?.role === "cliente"
                      ? "Crea tu primer partido y conecta con árbitros certificados"
                      : "Espera a que te asignen nuevos partidos"}
                  </p>
                </div>

                {tabEstado ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTabEstado("")}
                    className="border hover:border-primary/50 w-full sm:w-auto h-8 text-xs"
                  >
                    <Calendar className="w-3 h-3 mr-1.5" />
                    Ver todos
                  </Button>
                ) : (
                  user?.role === "cliente" && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                      <Button
                        onClick={() => navigate(ROUTES.PARTIDOS_CREAR)}
                        size="sm"
                        className="shadow-md hover:shadow-lg transition-shadow h-8 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1.5" />
                        Crear mi primer partido
                      </Button>
                      <Button
                        onClick={() => navigate(ROUTES.ARBITROS)}
                        size="sm"
                        variant="outline"
                        className="border hover:border-primary/50 h-8 text-xs"
                      >
                        <Search className="w-3 h-3 mr-1.5" />
                        Explorar árbitros
                      </Button>
                    </div>
                  )
                )}

                {/* Trust indicators: más compactos en móvil */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span>Verificados</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Pago seguro</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    <span>Calificación</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-5">
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{partidos.length}</span>{" "}
                  partido{partidos.length !== 1 ? "s" : ""}
                  {tabEstado && (
                    <span className="ml-1">({TABS.find((t) => t.value === tabEstado)?.label})</span>
                  )}
                </p>
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
