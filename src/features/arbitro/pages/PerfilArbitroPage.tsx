/**
 * Página de perfil de árbitro
 * Permite ver y editar el perfil propio
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArbitro } from "../hooks/useArbitro";
import { PerfilArbitroForm } from "../components/PerfilArbitroForm";
import { DocumentoUpload } from "../components/DocumentoUpload";
import { DocumentosList } from "../components/DocumentosList";
import { DisponibilidadList } from "../components/DisponibilidadList";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ROUTES } from "@/lib/constants";

export function PerfilArbitroPage() {
  const navigate = useNavigate();
  const { arbitro, obtenerPerfil, isLoading, error } = useArbitro();
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [refreshDocumentos, setRefreshDocumentos] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        await obtenerPerfil();
        if (!cancelled) {
          setHasCheckedProfile(true);
        }
      } catch {
        // Si no tiene perfil, activar modo creación
        if (!cancelled) {
          setHasCheckedProfile(true);
          setIsEditMode(true);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  const handleSuccess = () => {
    setIsEditMode(false);
    obtenerPerfil();
  };

  // Si no hay perfil y no está en modo edición y ya se verificó, mostrar mensaje
  if (!arbitro && !isEditMode && !isLoading && hasCheckedProfile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 safe-area-inset">
        <div className="absolute top-4 right-4 safe-area-top safe-area-right">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">Completar Perfil</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Necesitas completar tu perfil para empezar a recibir solicitudes
            </p>
          </div>

          <Button onClick={() => setIsEditMode(true)} className="w-full">
            Completar Perfil
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.ARBITRO_DASHBOARD)}
            className="w-full"
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background safe-area-inset">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(ROUTES.ARBITRO_DASHBOARD)}
              aria-label="Volver"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <h1 className="text-lg font-semibold">
              {isEditMode ? (arbitro ? "Editar Perfil" : "Completar Perfil") : "Mi Perfil"}
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-2xl mx-auto p-4 sm:p-6">
          {isLoading && !hasCheckedProfile ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Cargando perfil...</p>
            </div>
          ) : error && !arbitro && !isEditMode && hasCheckedProfile ? (
            <div className="rounded-lg border bg-card p-6">
              <div className="space-y-4 text-center">
                <p className="text-destructive">{error}</p>
                <Button onClick={() => setIsEditMode(true)}>Crear Perfil</Button>
              </div>
            </div>
          ) : isEditMode ? (
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <PerfilArbitroForm arbitro={arbitro || undefined} onSuccess={handleSuccess} />
            </div>
          ) : arbitro ? (
            <div className="space-y-6">
              {/* Información del perfil */}
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold">Información Personal</h2>
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    Editar
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {arbitro.username && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Usuario</p>
                      <p className="text-base font-medium">{arbitro.username}</p>
                    </div>
                  )}

                  {arbitro.email && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-base">{arbitro.email}</p>
                    </div>
                  )}

                  {arbitro.full_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                      <p className="text-base">{arbitro.full_name}</p>
                    </div>
                  )}

                  {arbitro.telefono && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                      <p className="text-base">{arbitro.telefono}</p>
                    </div>
                  )}

                  {arbitro.fecha_nacimiento && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Fecha de Nacimiento
                      </p>
                      <p className="text-base">
                        {new Date(arbitro.fecha_nacimiento).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  )}

                  {arbitro.documento_identidad && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Documento de Identidad
                      </p>
                      <p className="text-base">{arbitro.documento_identidad}</p>
                    </div>
                  )}
                </div>

                {arbitro.biografia && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Biografía</p>
                    <p className="text-base whitespace-pre-wrap text-muted-foreground">
                      {arbitro.biografia}
                    </p>
                  </div>
                )}
              </div>

              {/* Información profesional */}
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Información Profesional</h2>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Años de Experiencia</p>
                    <p className="text-xl font-semibold">{arbitro.experiencia_anos} años</p>
                  </div>
                </div>

                {arbitro.municipios.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Municipios</p>
                    <div className="flex flex-wrap gap-2">
                      {arbitro.municipios.map((municipio) => (
                        <span
                          key={municipio.id}
                          className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium"
                        >
                          {municipio.nombre}
                          {municipio.departamento && `, ${municipio.departamento}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {arbitro.categorias.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Categorías</p>
                    <div className="flex flex-wrap gap-2">
                      {arbitro.categorias.map((categoria) => (
                        <span
                          key={categoria.id}
                          className="inline-flex items-center rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-sm font-medium"
                        >
                          {categoria.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Estado de verificación */}
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Estado de Verificación</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${
                        arbitro.esta_aprobado
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : arbitro.estado_verificacion === "en_revision"
                          ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          : arbitro.estado_verificacion === "rechazado"
                          ? "bg-red-500/10 text-red-700 dark:text-red-400"
                          : "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {arbitro.estado_verificacion_display}
                    </span>
                  </div>

                  {arbitro.comentarios_verificacion && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Comentarios</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {arbitro.comentarios_verificacion}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gestión de Documentos */}
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Documentos</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDocumentos(!showDocumentos)}
                  >
                    {showDocumentos ? "Ocultar" : "Gestionar Documentos"}
                  </Button>
                </div>

                {showDocumentos && (
                  <div className="space-y-6 pt-4 border-t">
                    <DocumentoUpload
                      onSuccess={() => {
                        setRefreshDocumentos((prev) => prev + 1);
                        obtenerPerfil(); // Refrescar perfil para obtener documentos actualizados
                      }}
                    />
                    <DocumentosList
                      refreshKey={refreshDocumentos}
                      onDocumentDeleted={() => {
                        setRefreshDocumentos((prev) => prev + 1);
                        obtenerPerfil(); // Refrescar perfil
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Gestión de Disponibilidad */}
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <DisponibilidadList />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

