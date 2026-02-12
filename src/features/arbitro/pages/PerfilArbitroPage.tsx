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
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/lib/constants";
import { getRefereeImage } from "@/lib/referee-images";

export function PerfilArbitroPage() {
  const navigate = useNavigate();
  const { arbitro, obtenerPerfil, isLoading, error } = useArbitro();
  const [isEditMode, setIsEditMode] = useState(false);
  const [focusSection, setFocusSection] = useState<"personal" | "experiencia" | null>(null);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [refreshDocumentos, setRefreshDocumentos] = useState(0);
  const rolesVisibles = (arbitro?.roles ?? [])
    .map((rol) => rol.nombre)
    .filter((nombre) => nombre.toLowerCase() !== "central solo");

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
    setFocusSection(null);
    obtenerPerfil();
  };

  // Si no hay perfil y no está en modo edición y ya se verificó, mostrar mensaje
  if (!arbitro && !isEditMode && !isLoading && hasCheckedProfile) {
    return (
      <PageLayout
        title="Completar Perfil"
        backButton={{ label: "Dashboard", to: ROUTES.ARBITRO_DASHBOARD }}
        contentClassName="flex flex-col items-center justify-center p-4 max-w-md mx-auto"
      >
        <div className="w-full space-y-6 rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
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
      </PageLayout>
    );
  }

  const pageTitle = isEditMode ? (arbitro ? "Editar Perfil" : "Completar Perfil") : "Mi Perfil";

  return (
    <PageLayout
      title={pageTitle}
      backButton={{ label: "Volver", to: ROUTES.ARBITRO_DASHBOARD }}
      contentClassName="page-surface max-w-5xl"
    >
      <div>
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
          <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
            <PerfilArbitroForm
              arbitro={arbitro || undefined}
              onSuccess={handleSuccess}
              focusSection={focusSection}
            />
          </div>
        ) : arbitro ? (
          <div className="space-y-8">
            {/* Información del perfil */}
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Información Personal</h2>
                  <p className="text-sm text-muted-foreground">
                    Tu perfil público y datos de contacto
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFocusSection("personal");
                    setIsEditMode(true);
                  }}
                >
                  Editar
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                <div className="flex flex-col items-start gap-4">
                  <div className="rounded-full overflow-hidden border-2 border-border/70 bg-muted w-24 h-24 sm:w-28 sm:h-28 shrink-0 shadow-md">
                    <img
                      src={getRefereeImage(
                        arbitro.foto_perfil,
                        arbitro.id,
                        arbitro.experiencia_anos,
                        arbitro.full_name || arbitro.username
                      )}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Perfil visible para organizadores
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {arbitro.username && (
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Usuario
                      </p>
                      <p className="text-base font-semibold">{arbitro.username}</p>
                    </div>
                  )}
                  {arbitro.email && (
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Email
                      </p>
                      <p className="text-base">{arbitro.email}</p>
                    </div>
                  )}
                  {arbitro.full_name && (
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Nombre Completo
                      </p>
                      <p className="text-base">{arbitro.full_name}</p>
                    </div>
                  )}
                  {arbitro.telefono && (
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Teléfono
                      </p>
                      <p className="text-base">{arbitro.telefono}</p>
                    </div>
                  )}
                  {arbitro.fecha_nacimiento && (
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Fecha de Nacimiento
                      </p>
                      <p className="text-base">
                        {new Date(arbitro.fecha_nacimiento).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  )}
                  {arbitro.documento_identidad && (
                    <div className="rounded-2xl border border-border/50 bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Documento de Identidad
                      </p>
                      <p className="text-base">{arbitro.documento_identidad}</p>
                    </div>
                  )}
                </div>
              </div>

              {arbitro.biografia && (
                <div className="mt-6 pt-6 border-t border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    Biografía
                  </p>
                  <p className="text-base whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {arbitro.biografia}
                  </p>
                </div>
              )}
            </div>

            {/* Experiencia y categorías */}
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Experiencia y categorías
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Lo que ofreces como árbitro
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFocusSection("experiencia");
                    setIsEditMode(true);
                  }}
                >
                  Editar
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Años de Experiencia
                  </p>
                  <p className="text-2xl font-semibold">{arbitro.experiencia_anos} años</p>
                </div>
                {rolesVisibles.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Roles
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rolesVisibles.map((rol) => (
                        <span
                          key={rol}
                          className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold"
                        >
                          {rol}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {arbitro.municipios.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                    Municipios
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {arbitro.municipios.map((municipio) => (
                      <span
                        key={municipio.id}
                        className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium"
                      >
                        {municipio.nombre}
                        {municipio.departamento && `, ${municipio.departamento}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {arbitro.categorias.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                    Categorías
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {arbitro.categorias.map((categoria) => (
                      <span
                        key={categoria.id}
                        className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1.5 text-sm font-medium"
                      >
                        {categoria.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Estado de verificación */}
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Estado de Verificación</h2>
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
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Documentos</h2>
                  <p className="text-sm text-muted-foreground">
                    Sube y gestiona tus documentos de verificación
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentos(!showDocumentos)}
                >
                  {showDocumentos ? "Ocultar" : "Gestionar Documentos"}
                </Button>
              </div>

              {showDocumentos && (
                <div className="space-y-6 pt-6 border-t border-border/60">
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
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Disponibilidad</h2>
                  <p className="text-sm text-muted-foreground">
                    Define tus horarios disponibles
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFocusSection(null);
                    setIsEditMode(true);
                  }}
                >
                  Editar
                </Button>
              </div>
              <DisponibilidadList municipiosPerfil={arbitro?.municipios ?? []} />
            </div>
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
}
