/**
 * Página de gestión de asignación de árbitros a partidos (solo admin)
 */

import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useAsignacionPartidos } from "../hooks/useAsignacionPartidos";
import { PartidoAsignacionCard } from "../components/PartidoAsignacionCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { partidoService } from "@/features/partidos/services/partido.service";
import type { PartidoDetail, PartidoAsignarData } from "@/features/partidos/types/partido.types";
import type { PostulacionArbitro } from "@/features/partidos/types/partido.types";

export function AsignacionPartidosPage() {
  const {
    partidos,
    isLoading,
    error,
    listarPartidos,
    obtenerArbitrosDisponibles,
    asignarArbitro,
    clearError,
  } = useAsignacionPartidos();

  const [showPostulacionesModal, setShowPostulacionesModal] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<PartidoDetail | null>(null);
  const [postulaciones, setPostulaciones] = useState<PostulacionArbitro[]>([]);
  const [cargandoPostulaciones, setCargandoPostulaciones] = useState(false);

  const handleVerPostulaciones = async (partidoId: number) => {
    const partido = partidos.find((p) => p.id === partidoId);
    if (!partido) return;

    setPartidoSeleccionado(partido);
    setShowPostulacionesModal(true);
    setCargandoPostulaciones(true);

    try {
      const data = await partidoService.obtenerPostulaciones(partidoId);
      setPostulaciones(data);
    } catch (err) {
      console.error("Error al cargar postulaciones:", err);
      setPostulaciones([]);
    } finally {
      setCargandoPostulaciones(false);
    }
  };

  const handleAsignarDesdePostulacion = async (partidoId: number, arbitroId: number) => {
    try {
      await asignarArbitro(partidoId, { arbitro_id: arbitroId });
      setShowPostulacionesModal(false);
      setPartidoSeleccionado(null);
      setPostulaciones([]);
    } catch (err) {
      console.error("Error al asignar árbitro:", err);
    }
  };

  const handleAsignar = async (partidoId: number, data: PartidoAsignarData) => {
    try {
      await asignarArbitro(partidoId, data);
    } catch (err) {
      console.error("Error al asignar árbitro:", err);
      throw err; // Re-lanzar para que el componente maneje el error
    }
  };

  const partidosBuscando = partidos.filter((p) => p.estado === "buscando_arbitro");
  const partidosCancelados = partidos.filter((p) => p.estado === "cancelado");

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Asignación de Árbitros"
      contentClassName="container mx-auto px-4 py-8 max-w-7xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Asignación de Árbitros</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona la asignación de árbitros a partidos sin asignar o cancelados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Buscando Árbitro</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {partidosBuscando.length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Cancelados (Reasignar)</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {partidosCancelados.length}
            </p>
          </div>
        </div>

        {/* Error */}
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

        {/* Loading */}
        {isLoading && partidos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando partidos...</p>
          </div>
        )}

        {/* Lista de partidos */}
        {!isLoading && partidos.length === 0 && (
          <div className="text-center py-12 rounded-lg border bg-card">
            <p className="text-muted-foreground mb-4">No hay partidos que necesiten asignación</p>
            <Button onClick={listarPartidos} variant="outline">
              Actualizar
            </Button>
          </div>
        )}

        {partidos.length > 0 && (
          <div className="space-y-6">
            {/* Partidos buscando árbitro */}
            {partidosBuscando.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Partidos Buscando Árbitro ({partidosBuscando.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {partidosBuscando.map((partido) => (
                    <PartidoAsignacionCard
                      key={partido.id}
                      partido={partido}
                      onAsignar={handleAsignar}
                      onVerPostulaciones={handleVerPostulaciones}
                      obtenerArbitrosDisponibles={obtenerArbitrosDisponibles}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Partidos cancelados */}
            {partidosCancelados.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Partidos Cancelados - Requieren Reasignación ({partidosCancelados.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {partidosCancelados.map((partido) => (
                    <PartidoAsignacionCard
                      key={partido.id}
                      partido={partido}
                      onAsignar={handleAsignar}
                      onVerPostulaciones={handleVerPostulaciones}
                      obtenerArbitrosDisponibles={obtenerArbitrosDisponibles}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de postulaciones */}
        <Dialog open={showPostulacionesModal} onOpenChange={setShowPostulacionesModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Postulaciones - Partido #{partidoSeleccionado?.id}
                {partidoSeleccionado?.codigo && (
                  <span className="text-sm font-mono text-muted-foreground block mt-1">
                    {partidoSeleccionado.codigo}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {cargandoPostulaciones ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando postulaciones...</p>
                </div>
              ) : postulaciones.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay postulaciones para este partido</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {postulaciones.map((postulacion) => (
                    <div key={postulacion.id} className="rounded-lg border bg-card p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{postulacion.arbitro_info.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {postulacion.arbitro_info.username}
                          </p>
                          {postulacion.mensaje && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {postulacion.mensaje}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                              postulacion.estado === "pendiente"
                                ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                                : postulacion.estado === "aceptada"
                                ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                : "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
                            }`}
                          >
                            {postulacion.estado === "pendiente"
                              ? "Pendiente"
                              : postulacion.estado === "aceptada"
                              ? "Aceptada"
                              : "Rechazada"}
                          </span>
                        </div>
                      </div>
                      {postulacion.estado === "pendiente" && partidoSeleccionado && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAsignarDesdePostulacion(
                              partidoSeleccionado.id,
                              postulacion.arbitro_info.id
                            )
                          }
                          disabled={isLoading}
                          className="w-full mt-2"
                        >
                          Asignar este Árbitro
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
