/**
 * Página de verificación de árbitros (Panel de administrador)
 * Lista árbitros pendientes de verificación
 */

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { ArbitroPendienteCard } from "@/features/arbitro/components/ArbitroPendienteCard";
import { useVerificacionArbitros } from "../hooks/useVerificacionArbitros";
import { ROUTES } from "@/lib/constants";

export function VerificacionArbitrosPage() {
  const { arbitros, isLoading, error, cargarArbitrosPendientes } = useVerificacionArbitros();

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Verificación de Árbitros"
      contentClassName="page-surface"
    >
      {/* Header Section */}
      <div className="mb-8 space-y-4">
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
    </PageLayout>
  );
}
