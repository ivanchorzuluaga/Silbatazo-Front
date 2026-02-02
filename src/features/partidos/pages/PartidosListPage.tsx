/**
 * Página de lista de partidos
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout";
import { usePartidos } from "../hooks/usePartidos";
import { PartidoCard } from "../components/PartidoCard";
import { PartidoCardSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import type { EstadoPartido, PartidosListParams } from "../types/partido.types";
import { Calendar, Filter, Plus, Search, CheckCircle, Shield, Star } from "lucide-react";

export function PartidosListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filtros, setFiltros] = useState<PartidosListParams>({});
  const { partidos, isLoading, error } = usePartidos(filtros);

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estado = e.target.value as EstadoPartido | "";
    setFiltros((prev) => ({
      ...prev,
      estado: estado || undefined,
    }));
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.DASHBOARD }}
      showDashboard={false}
      contentClassName="container mx-auto px-4 py-8 max-w-7xl"
    >
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6 border border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Mis Partidos
            </h1>
            <p className="text-muted-foreground text-lg">
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
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Partido
            </Button>
          )}
        </div>
      </div>

      {/* Filtros mejorados */}
      <Card className="mb-6 border-0 bg-gradient-to-br from-card to-card/80">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Filtros</h3>
            </div>
            <div className="flex-1 max-w-xs">
              <label htmlFor="estado" className="text-sm font-medium mb-2 block">
                Estado del partido
              </label>
              <Select id="estado" value={filtros.estado || ""} onChange={handleEstadoChange}>
                <option value="">Todos los estados</option>
                <option value="pendiente">⏳ Pendiente</option>
                <option value="aceptado">✅ Aceptado</option>
                <option value="rechazado">❌ Rechazado</option>
                <option value="completado">🏆 Completado</option>
                <option value="cancelado">🚫 Cancelado</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-primary">Cargando partidos...</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <Card className="text-center py-16 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                    <Calendar className="size-12 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    {user?.role === "cliente" 
                      ? "¡Aún no tienes partidos!" 
                      : "No hay partidos asignados"
                    }
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    {user?.role === "cliente"
                      ? "Crea tu primer partido y conecta con árbitros profesionales certificados"
                      : "Espera a que te asignen nuevos partidos"
                    }
                  </p>
                </div>
                
                {user?.role === "cliente" && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => navigate(ROUTES.PARTIDOS_CREAR)} 
                      size="lg"
                      className="shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Crear mi primer partido
                    </Button>
                    <Button 
                      onClick={() => navigate(ROUTES.ARBITROS)} 
                      size="lg"
                      variant="outline"
                      className="border-2 hover:border-primary/50"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Explorar árbitros
                    </Button>
                  </div>
                )}
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-8 pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Árbitros verificados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Pago seguro</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Calificación garantizada</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{partidos.length}</span> partido{partidos.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Más filtros
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
