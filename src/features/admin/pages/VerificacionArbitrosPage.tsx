/**
 * Página de verificación de árbitros (Panel de administrador)
 * Lista árbitros pendientes de verificación
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArbitroPendienteCard } from "@/features/arbitro/components/ArbitroPendienteCard";
import { arbitroService } from "@/features/arbitro/services/arbitro.service";
import { ROUTES } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function VerificacionArbitrosPage() {
  const navigate = useNavigate();
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarArbitrosPendientes();
  }, []);

  const cargarArbitrosPendientes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarPendientes();
      setArbitros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar árbitros pendientes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background safe-area-inset">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
              ← Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Verificación de Árbitros</h1>
            <p className="text-muted-foreground">
              Revisa y aprueba los árbitros que están esperando verificación
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando árbitros pendientes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 space-y-4">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" onClick={cargarArbitrosPendientes}>
                Reintentar
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && arbitros.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <p className="text-lg text-muted-foreground">
                No hay árbitros pendientes de verificación
              </p>
              <p className="text-sm text-muted-foreground">Todos los árbitros han sido revisados</p>
            </div>
          )}

          {/* Lista de árbitros */}
          {!isLoading && !error && arbitros.length > 0 && (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {arbitros.length}{" "}
                  {arbitros.length === 1 ? "árbitro pendiente" : "árbitros pendientes"} de
                  verificación
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {arbitros.map((arbitro) => (
                  <ArbitroPendienteCard key={arbitro.id} arbitro={arbitro} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

