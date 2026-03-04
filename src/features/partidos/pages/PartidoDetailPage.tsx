/**
 * Página de detalle de partido
 */

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { PartidoDetail } from "../components/PartidoDetail";
import { PartidoActions } from "../components/PartidoActions";
import { PartidoEditForm } from "../components/PartidoEditForm";
import { CalificacionForm } from "../components/CalificacionForm";
import { CalificacionesSection } from "../components/CalificacionesSection";
import { usePartidoDetail } from "../hooks/usePartidoDetail";
import { partidoService } from "../services/partido.service";
import { ROUTES } from "@/lib/constants";
import { Pencil, Trash2 } from "lucide-react";

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

  // Handlers
  const handleActionSuccess = () => {
    refetchPartido();
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
      `¿Seguro que quieres eliminar el partido #${partido.id}? Esta acción no se puede deshacer.`
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
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.ADMIN_ASIGNACION_PARTIDOS)}
              >
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
    </PageLayout>
  );
}
