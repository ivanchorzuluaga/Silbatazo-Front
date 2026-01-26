/**
 * Página de detalle de partido
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { usePartido } from "../hooks/usePartido";
import { useCalificaciones } from "../hooks/useCalificaciones";
import { PartidoDetail } from "../components/PartidoDetail";
import { PartidoActions } from "../components/PartidoActions";
import { PartidoEditForm } from "../components/PartidoEditForm";
import { CalificacionForm } from "../components/CalificacionForm";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";

export function PartidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { partido, isLoading, error, obtenerPartido } = usePartido();
  const {
    calificaciones,
    listarCalificacionesPartido,
    isLoading: isLoadingCalificaciones,
  } = useCalificaciones();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCalificarModal, setShowCalificarModal] = useState(false);

  useEffect(() => {
    if (id) {
      obtenerPartido(parseInt(id));
      listarCalificacionesPartido(parseInt(id));
    }
  }, [id, obtenerPartido, listarCalificacionesPartido]);

  const handleActionSuccess = () => {
    if (id) {
      obtenerPartido(parseInt(id));
    }
  };

  const handleEditSuccess = () => {
    handleActionSuccess();
    setShowEditModal(false);
  };

  const handleCalificarSuccess = () => {
    handleActionSuccess();
    setShowCalificarModal(false);
    if (id) {
      listarCalificacionesPartido(parseInt(id));
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        backButton={{ label: "Volver a Partidos", to: ROUTES.PARTIDOS }}
        contentClassName="container mx-auto px-4 py-8 max-w-4xl"
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando partido...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !partido) {
    return (
      <PageLayout
        backButton={{ label: "Volver a Partidos", to: ROUTES.PARTIDOS }}
        contentClassName="container mx-auto px-4 py-8 max-w-4xl"
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

  // Comparar IDs (asegurarse de que ambos sean números)
  const isCliente = user?.id !== undefined && Number(user.id) === Number(partido.cliente);
  // Comparar username porque arbitro_info.id es el ID del perfil Arbitro, no del User
  // Solo verificar si es árbitro si hay árbitro asignado
  const isArbitro = Boolean(
    user?.role === "arbitro" &&
      partido.arbitro_info &&
      user?.username === partido.arbitro_info.username
  );

  // Verificar condiciones para mostrar el botón de editar
  const puedeEditar =
    isCliente && (partido.estado === "buscando_arbitro" || partido.estado === "pendiente");

  // Verificar si el usuario puede calificar
  const puedeCalificar =
    partido.estado === "completado" &&
    (isCliente || isArbitro) &&
    !calificaciones.some((cal) => cal.calificador === user?.id);

  // Obtener el nombre de la persona a calificar
  const getCalificadoNombre = () => {
    if (isCliente && partido.arbitro_info) {
      return partido.arbitro_info.full_name || partido.arbitro_info.username;
    }
    if (isArbitro) {
      return partido.cliente_full_name || partido.cliente_username;
    }
    return "";
  };

  return (
    <PageLayout
      backButton={{ label: "Volver a Partidos", to: ROUTES.PARTIDOS }}
      showDashboard={true}
      contentClassName="container mx-auto px-4 py-8 max-w-4xl"
    >
      <div className="space-y-6">
        {/* Botón de Editar en el header (solo cliente, solo si está buscando árbitro o pendiente) */}
        {puedeEditar && (
          <div className="flex justify-end">
            <Button onClick={() => setShowEditModal(true)} variant="outline" size="sm">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar Partido
            </Button>
          </div>
        )}

        <PartidoDetail partido={partido} />

        {/* Calificaciones */}
        {partido.estado === "completado" && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Calificaciones</h2>
              {puedeCalificar && (
                <Button onClick={() => setShowCalificarModal(true)} size="sm">
                  Calificar
                </Button>
              )}
            </div>

            {isLoadingCalificaciones ? (
              <p className="text-muted-foreground text-sm">Cargando calificaciones...</p>
            ) : calificaciones.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {puedeCalificar
                  ? "Aún no hay calificaciones. ¡Sé el primero en calificar!"
                  : "Aún no hay calificaciones para este partido."}
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Columna 1: Árbitro → Cliente */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                    Árbitro califica a Cliente
                  </h3>
                  {calificaciones.filter((cal) => !cal.es_cliente_calificando).length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      El árbitro aún no ha calificado al cliente
                    </p>
                  ) : (
                    calificaciones
                      .filter((cal) => !cal.es_cliente_calificando)
                      .map((cal) => (
                        <div key={cal.id} className="p-3 rounded-md border bg-muted/50 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {cal.calificador_full_name} → {cal.calificado_full_name}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: cal.puntuacion }, (_, i) => (
                                  <span key={i} className="text-yellow-400">
                                    ⭐
                                  </span>
                                ))}
                                <span className="text-xs text-muted-foreground ml-2">
                                  {cal.puntuacion}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground shrink-0 ml-2">
                              {new Date(cal.created_at).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </div>
                          {cal.comentario && (
                            <p className="text-xs text-muted-foreground mt-2">{cal.comentario}</p>
                          )}
                        </div>
                      ))
                  )}
                </div>

                {/* Columna 2: Cliente → Árbitro */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                    Cliente califica a Árbitro
                  </h3>
                  {calificaciones.filter((cal) => cal.es_cliente_calificando).length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      El cliente aún no ha calificado al árbitro
                    </p>
                  ) : (
                    calificaciones
                      .filter((cal) => cal.es_cliente_calificando)
                      .map((cal) => (
                        <div key={cal.id} className="p-3 rounded-md border bg-muted/50 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {cal.calificador_full_name} → {cal.calificado_full_name}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: cal.puntuacion }, (_, i) => (
                                  <span key={i} className="text-yellow-400">
                                    ⭐
                                  </span>
                                ))}
                                <span className="text-xs text-muted-foreground ml-2">
                                  {cal.puntuacion}/5
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground shrink-0 ml-2">
                              {new Date(cal.created_at).toLocaleDateString("es-CO", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </div>
                          {cal.comentario && (
                            <p className="text-xs text-muted-foreground mt-2">{cal.comentario}</p>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        {(isCliente || isArbitro) && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Acciones</h2>
              {/* Botón de Editar (solo cliente, solo si está buscando árbitro o pendiente) */}
              {puedeEditar && (
                <Button onClick={() => setShowEditModal(true)} variant="outline" size="sm">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar Partido
                </Button>
              )}
            </div>
            <PartidoActions
              partido={partido}
              onActionSuccess={handleActionSuccess}
              isCliente={isCliente}
              isArbitro={isArbitro}
            />
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
