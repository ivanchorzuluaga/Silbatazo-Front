/**
 * Página de detalle de árbitro
 * Accesible públicamente (sin autenticación)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getArbitroDetailRoute } from "@/lib/constants";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import { PartidoFormModal } from "@/features/partidos/components/PartidoFormModal";
import { useCalificaciones } from "@/features/partidos/hooks/useCalificaciones";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function ArbitroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [arbitro, setArbitro] = useState<Arbitro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSolicitarModal, setShowSolicitarModal] = useState(false);
  const {
    calificaciones,
    promedio,
    isLoading: isLoadingCalificaciones,
    listarCalificacionesArbitro,
    obtenerPromedio,
  } = useCalificaciones();

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cargarArbitro = async () => {
      if (!id) {
        setError("ID de árbitro no válido");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/arbitros/${id}/`, { headers });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Árbitro no encontrado");
          }
          throw new Error("Error al cargar árbitro");
        }

        const data = await response.json();
        setArbitro(data);
        
        // Cargar calificaciones y promedio
        if (data.id) {
          listarCalificacionesArbitro(data.id);
          obtenerPromedio(data.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar árbitro");
      } finally {
        setIsLoading(false);
      }
    };

    cargarArbitro();
  }, [id, listarCalificacionesArbitro, obtenerPromedio]);

  const handleSolicitar = () => {
    if (!isAuthenticated) {
      // Redirigir a login/register con redirect al detalle
      if (id) {
        navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(getArbitroDetailRoute(id))}`);
      } else {
        navigate(ROUTES.LOGIN);
      }
      return;
    }

    // Si el usuario es árbitro o admin, no puede solicitar
    if (user?.role === "arbitro" || user?.role === "admin") {
      // TODO: Mostrar mensaje o redirigir
      return;
    }

    // Si está autenticado como cliente, mostrar modal/formulario
    setShowSolicitarModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background safe-area-inset">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando árbitro...</p>
        </div>
      </div>
    );
  }

  if (error || !arbitro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background safe-area-inset">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || "Árbitro no encontrado"}</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.ARBITROS)}>
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background safe-area-inset">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ARBITROS)}>
              ← Volver
            </Button>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}>
                  Mi Dashboard
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                  Iniciar Sesión
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Información principal */}
          <div className="mb-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {arbitro.full_name || arbitro.username}
                </h1>
                {arbitro.email && <p className="text-muted-foreground mt-1">{arbitro.email}</p>}
                {arbitro.telefono && (
                  <p className="text-sm text-muted-foreground mt-1">📞 {arbitro.telefono}</p>
                )}
              </div>
            </div>

            {/* Botón de solicitar - Sticky en móvil */}
            <div className="sticky bottom-4 z-10 sm:relative sm:bottom-auto">
              <Button
                onClick={handleSolicitar}
                size="lg"
                className="w-full sm:w-auto touch-manipulation"
              >
                {isAuthenticated ? "Solicitar Árbitro" : "Registrarse para Solicitar"}
              </Button>
            </div>
          </div>

          {/* Información profesional */}
          <div className="space-y-6">
            {/* Experiencia */}
            {arbitro.experiencia_anos > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Experiencia</h2>
                <p className="text-muted-foreground">
                  {arbitro.experiencia_anos} {arbitro.experiencia_anos === 1 ? "año" : "años"} de
                  experiencia
                </p>
              </div>
            )}

            {/* Biografía */}
            {arbitro.biografia && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Biografía</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{arbitro.biografia}</p>
              </div>
            )}

            {/* Municipios */}
            {arbitro.municipios.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Áreas de Cobertura</h2>
                <div className="flex flex-wrap gap-2">
                  {arbitro.municipios.map((municipio) => (
                    <span
                      key={municipio.id}
                      className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                    >
                      {municipio.nombre}
                      {municipio.departamento && `, ${municipio.departamento}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categorías */}
            {arbitro.categorias.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Categorías</h2>
                <div className="flex flex-wrap gap-2">
                  {arbitro.categorias.map((categoria) => (
                    <span
                      key={categoria.id}
                      className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium"
                    >
                      {categoria.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calificaciones */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Calificaciones</h2>
              {isLoadingCalificaciones ? (
                <p className="text-muted-foreground text-sm">Cargando calificaciones...</p>
              ) : (
                <div className="space-y-4">
                  {/* Promedio */}
                  {promedio && promedio.promedio !== null && (
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">
                          {promedio.promedio.toFixed(1)}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {Array.from({ length: Math.round(promedio.promedio) }, (_, i) => (
                            <span key={i} className="text-yellow-400">
                              ⭐
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {promedio.total_calificaciones}{" "}
                          {promedio.total_calificaciones === 1
                            ? "calificación"
                            : "calificaciones"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lista de calificaciones */}
                  {calificaciones.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Aún no hay calificaciones para este árbitro.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {calificaciones.slice(0, 5).map((cal) => (
                        <div
                          key={cal.id}
                          className="p-3 rounded-md border bg-muted/50 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {cal.calificador_full_name}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: cal.puntuacion }, (_, i) => (
                                  <span key={i} className="text-yellow-400">
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(cal.created_at).toLocaleDateString("es-CO")}
                            </p>
                          </div>
                          {cal.comentario && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {cal.comentario}
                            </p>
                          )}
                        </div>
                      ))}
                      {calificaciones.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          Mostrando las 5 más recientes de {calificaciones.length} calificaciones
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Horarios Disponibles */}
            {arbitro.disponibilidades && arbitro.disponibilidades.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Horarios Disponibles</h2>
                <DisponibilidadDisplay disponibilidades={arbitro.disponibilidades} />
              </div>
            )}

            {/* Documentos públicos (certificaciones) */}
            {arbitro.documentos && arbitro.documentos.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Certificaciones</h2>
                <div className="space-y-3">
                  {arbitro.documentos
                    .filter((doc) => doc.tipo === "certificacion" && doc.estado === "aprobado")
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium">{doc.nombre || doc.tipo_display}</p>
                          {doc.nombre && (
                            <p className="text-sm text-muted-foreground">{doc.tipo_display}</p>
                          )}
                        </div>
                        {doc.archivo_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.archivo_url, "_blank")}
                          >
                            Ver
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal de solicitar */}
          {arbitro && (
            <PartidoFormModal
              arbitro={arbitro}
              open={showSolicitarModal}
              onClose={() => setShowSolicitarModal(false)}
              onSuccess={() => {
                // Opcional: redirigir a la lista de partidos o mostrar mensaje
                setShowSolicitarModal(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

