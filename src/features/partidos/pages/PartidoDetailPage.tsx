/**
 * Página de detalle de partido
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { PageLayout } from "@/components/layout";
import { PartidoDetail } from "../components/PartidoDetail";
import { PartidoActions } from "../components/PartidoActions";
import { PartidoEditForm } from "../components/PartidoEditForm";
import { CalificacionForm } from "../components/CalificacionForm";
import { CalificacionesSection } from "../components/CalificacionesSection";
import { usePartidoDetail } from "../hooks/usePartidoDetail";
import { partidoService } from "../services/partido.service";
import { ROUTES } from "@/lib/constants";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

// Botón de editar reutilizable
interface EditarBotonProps {
  onClick: () => void;
}

function EditarBoton({ onClick }: EditarBotonProps) {
  return (
    <Button onClick={onClick} variant="outline" size="sm">
      <Pencil className="h-4 w-4 mr-2" />
      Editar Partido
    </Button>
  );
}

export function PartidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const partidoId = id ? parseInt(id) : undefined;

  const {
    partido,
    isLoading,
    error,
    refetchPartido,
    calificaciones,
    isLoadingCalificaciones,
    refetchCalificaciones,
    isCliente,
    isArbitro,
    isAdmin,
    puedeEditar,
    puedeCalificar,
    showEditModal,
    showCalificarModal,
    setShowEditModal,
    setShowCalificarModal,
    getCalificadoNombre,
  } = usePartidoDetail(partidoId);

  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [arbitrosDisponibles, setArbitrosDisponibles] = useState<Arbitro[]>([]);
  const [cargandoArbitros, setCargandoArbitros] = useState(false);
  const [arbitroSeleccionado, setArbitroSeleccionado] = useState("");
  const [asignando, setAsignando] = useState(false);
  const [errorAsignar, setErrorAsignar] = useState<string | null>(null);

  // Handlers
  const handleActionSuccess = () => {
    refetchPartido();
  };

  const handleAbrirAsignar = async () => {
    if (!partido) return;
    setShowAsignarModal(true);
    setCargandoArbitros(true);
    setErrorAsignar(null);
    setArbitroSeleccionado("");
    try {
      const arbitros = await partidoService.listarArbitrosDisponibles(partido.id);
      setArbitrosDisponibles(arbitros);
    } catch (err) {
      setErrorAsignar(err instanceof Error ? err.message : "Error al cargar árbitros");
      setArbitrosDisponibles([]);
    } finally {
      setCargandoArbitros(false);
    }
  };

  const handleAsignarArbitro = async () => {
    if (!partido || !arbitroSeleccionado) return;
    setAsignando(true);
    setErrorAsignar(null);
    try {
      await partidoService.asignarArbitro(partido.id, {
        arbitro_id: parseInt(arbitroSeleccionado, 10),
      });
      await refetchPartido();
      setShowAsignarModal(false);
      setArbitroSeleccionado("");
    } catch (err) {
      setErrorAsignar(err instanceof Error ? err.message : "Error al asignar árbitro");
    } finally {
      setAsignando(false);
    }
  };

  const handleEditSuccess = () => {
    refetchPartido();
    setShowEditModal(false);
  };

  const handleCalificarSuccess = () => {
    refetchPartido();
    refetchCalificaciones();
    setShowCalificarModal(false);
  };

  const handleEliminarPartido = async () => {
    if (!partido) return;
    const confirmar = confirm(
      `¿Seguro que quieres eliminar el partido #${partido.id}? Esta acción no se puede deshacer.`,
    );
    if (!confirmar) return;

    try {
      await partidoService.eliminarPartido(partido.id);
      navigate(ROUTES.ADMIN_GESTION_PARTIDOS, {
        state: { refreshList: true, deletedPartidoId: partido.id, at: Date.now() },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo eliminar el partido");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLayout
        backButton={{ label: "Volver a Partidos", to: ROUTES.PARTIDOS }}
        contentClassName="page-surface max-w-4xl"
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando partido...</p>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error || !partido) {
    return (
      <PageLayout
        backButton={{ label: "Volver a Partidos", to: ROUTES.PARTIDOS }}
        contentClassName="page-surface max-w-4xl"
      >
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-destructive mb-4">{error || "Partido no encontrado"}</p>
          <Button onClick={() => navigate(ROUTES.PARTIDOS)} variant="outline">
            Volver a Partidos
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      backButton={{ label: "Volver a Partidos", to: ROUTES.PARTIDOS }}
      showDashboard={true}
      contentClassName="page-surface max-w-4xl"
    >
      <div className="space-y-6">
        {/* Botón de Editar en el header */}
        {puedeEditar && (
          <div className="flex justify-end">
            <EditarBoton onClick={() => setShowEditModal(true)} />
          </div>
        )}

        {/* Detalle del partido */}
        <PartidoDetail partido={partido} />

        {/* Calificaciones (solo para partidos completados) */}
        {partido.estado === "completado" && (
          <CalificacionesSection
            calificaciones={calificaciones}
            isLoading={isLoadingCalificaciones}
            puedeCalificar={puedeCalificar}
            onCalificar={() => setShowCalificarModal(true)}
          />
        )}

        {/* Acciones */}
        {(isCliente || isArbitro) && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Acciones</h2>
              {puedeEditar && <EditarBoton onClick={() => setShowEditModal(true)} />}
            </div>
            <PartidoActions
              partido={partido}
              onActionSuccess={handleActionSuccess}
              isCliente={isCliente}
              isArbitro={isArbitro}
            />
          </div>
        )}

        {/* Acciones admin */}
        {isAdmin && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Acciones de administrador</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" onClick={handleAbrirAsignar}>
                <UserPlus className="h-4 w-4 mr-2" />
                Asignar árbitro
              </Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.ADMIN_ASIGNACION_PARTIDOS)}>
                Reasignar árbitro
              </Button>
              <Button variant="destructive" onClick={handleEliminarPartido}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar partido
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {partido && (
        <PartidoEditForm
          partido={partido}
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Modal de Calificación */}
      {partido && puedeCalificar && (
        <CalificacionForm
          partidoId={partido.id}
          calificadoNombre={getCalificadoNombre()}
          esClienteCalificando={isCliente}
          open={showCalificarModal}
          onOpenChange={setShowCalificarModal}
          onSuccess={handleCalificarSuccess}
        />
      )}

      {/* Modal Asignar árbitro (admin) */}
      {partido && isAdmin && (
        <Dialog open={showAsignarModal} onOpenChange={setShowAsignarModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Asignar árbitro - Partido #{partido.id}
                {partido.codigo && (
                  <span className="text-sm font-mono text-muted-foreground block mt-1">
                    {partido.codigo}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {errorAsignar && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{errorAsignar}</p>
                </div>
              )}

              {cargandoArbitros ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Cargando árbitros disponibles...</p>
                </div>
              ) : arbitrosDisponibles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay árbitros disponibles para este partido
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Verifica que existan árbitros aprobados y sin conflicto horario
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="arbitro-asignar" className="text-sm font-medium">
                      Seleccionar árbitro <span className="text-destructive">*</span>
                    </label>
                    <Select
                      id="arbitro-asignar"
                      value={arbitroSeleccionado}
                      onChange={(e) => {
                        setArbitroSeleccionado(e.target.value);
                        if (errorAsignar) setErrorAsignar(null);
                      }}
                      disabled={asignando}
                    >
                      <option value="">Selecciona un árbitro</option>
                      {arbitrosDisponibles.map((arbitro) => (
                        <option key={arbitro.id} value={arbitro.id}>
                          {arbitro.full_name || arbitro.username}
                          {arbitro.experiencia_anos > 0 &&
                            ` - ${arbitro.experiencia_anos} años de experiencia`}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleAsignarArbitro}
                      disabled={asignando || !arbitroSeleccionado}
                      className="flex-1"
                    >
                      {asignando ? "Asignando..." : "Asignar árbitro"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAsignarModal(false);
                        setArbitroSeleccionado("");
                        setErrorAsignar(null);
                      }}
                      disabled={asignando}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
}
