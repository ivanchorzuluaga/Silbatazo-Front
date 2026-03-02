/**
 * Página de detalle de árbitro para clientes (con sidebar)
 * Permite ver el perfil completo y solicitar el árbitro
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArbitroDetail } from "@/features/marketplace/hooks/useArbitroDetail";
import { useCalificaciones } from "@/features/partidos/hooks/useCalificaciones";
import { PageLayout } from "@/components/layout";
import { PartidoFormModal } from "@/features/partidos/components/PartidoFormModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FotoArbitroCard } from "@/components/arbitro/FotoArbitroCard";
import logoImage from "@/assets/Logo.png";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { DisponibilidadArbitro } from "@/features/arbitro/types/arbitro.types";
import {
  ArrowLeft,
  Star,
  MapPin,
  Trophy,
  Clock,
  Calendar,
  Award,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function ClienteArbitroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { arbitro, isLoading, error } = useArbitroDetail(id ? parseInt(id) : 0);
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);
  const {
    calificaciones,
    promedio,
    isLoading: isLoadingCalificaciones,
    error: errorCalificaciones,
    listarCalificacionesArbitro,
    obtenerPromedio,
  } = useCalificaciones();

  useEffect(() => {
    if (arbitro?.id) {
      listarCalificacionesArbitro(arbitro.id);
      obtenerPromedio(arbitro.id);
    }
  }, [arbitro?.id, listarCalificacionesArbitro, obtenerPromedio]);

  if (isLoading) {
    return (
      <PageLayout title="Detalle de árbitro">
        <PageContainer>
          <LoadingState />
        </PageContainer>
      </PageLayout>
    );
  }

  if (error || !arbitro) {
    return (
      <PageLayout title="Detalle de árbitro">
        <PageContainer>
          <ErrorState
            error={error || "Árbitro no encontrado"}
            onBack={() => navigate(ROUTES.CLIENTE_ARBITROS)}
          />
        </PageContainer>
      </PageLayout>
    );
  }

  const nombre = arbitro.full_name || arbitro.username;
  const rating = promedio?.promedio ?? arbitro.calificacion_promedio ?? 0;
  const totalCalificaciones = promedio?.total_calificaciones ?? arbitro.total_calificaciones ?? 0;
  const experiencia = arbitro.experiencia_anos || 0;

  return (
    <PageLayout title="Detalle de árbitro">
      <PageContainer>
          {/* Header con botón volver */}
          <header className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.CLIENTE_ARBITROS)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted mb-4 min-h-10 touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a árbitros
            </Button>
          </header>

          {/* Contenido principal */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Foto y acciones */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Imagen */}
                <FotoArbitroCard
                  arbitro={arbitro}
                  className="w-full"
                  backgroundSrc="/Fondo-Limpio-Diseño-2.png"
                  fotoOverrideSrc={arbitro.foto_detalle || undefined}
                  mostrarCalificacion={false}
                  nombreOverride="Árbitro Silbatazo"
                  nombreClassName="text-3xl whitespace-nowrap"
                  nombreWrapperClassName="bottom-12"
                />

                {/* Botón solicitar */}
                <Button
                  onClick={() => setShowSolicitudModal(true)}
                  size="lg"
                  className="w-full py-6 text-lg font-bold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Solicitar Árbitro
                </Button>
              </div>
            </div>

            {/* Columna derecha - Información */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nombre y datos básicos */}
              <InfoCard>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{nombre}</h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {experiencia} años de experiencia
                  </span>
                  {totalCalificaciones > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {totalCalificaciones} calificaciones
                    </span>
                  )}
                </div>

                {arbitro.biografia && (
                  <p className="text-muted-foreground leading-relaxed">{arbitro.biografia}</p>
                )}
              </InfoCard>

              {/* Categorías */}
              {arbitro.categorias && arbitro.categorias.length > 0 && (
                <InfoCard title="Categorías" icon={Trophy}>
                  <div className="flex flex-wrap gap-2">
                    {arbitro.categorias.map((cat) => (
                      <Badge
                        key={cat.id}
                        className="bg-primary/20 text-primary border-primary/30 px-3 py-1"
                      >
                        {cat.nombre}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Municipios */}
              {arbitro.municipios && arbitro.municipios.length > 0 && (
                <InfoCard title="Municipios" icon={MapPin}>
                  <div className="flex flex-wrap gap-2">
                    {arbitro.municipios.map((mun) => (
                      <Badge
                        key={mun.id}
                        variant="outline"
                        className="border-border text-foreground"
                      >
                        {mun.nombre}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Horarios disponibles */}
              {arbitro.disponibilidades && arbitro.disponibilidades.length > 0 && (
                <InfoCard title="Horarios disponibles" icon={Clock}>
                  <HorariosDisponibles disponibilidades={arbitro.disponibilidades} />
                </InfoCard>
              )}

              {/* Reseñas */}
              <InfoCard title="Reseñas" icon={Star}>
                {isLoadingCalificaciones ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cargando reseñas...
                  </div>
                ) : errorCalificaciones ? (
                  <p className="text-muted-foreground text-sm">
                    No se pudieron cargar las reseñas. Intenta recargar la página.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {rating > 0 && (
                      <div className="flex items-center gap-6 pb-4 border-b border-border">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">{rating.toFixed(1)}</p>
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < Math.round(rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {totalCalificaciones} {totalCalificaciones === 1 ? "reseña" : "reseñas"}
                          </p>
                        </div>
                      </div>
                    )}
                    {calificaciones.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Aún no hay reseñas para este árbitro.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {calificaciones.slice(0, 5).map((cal) => (
                          <div
                            key={cal.id}
                            className="p-4 bg-muted/50 rounded-xl border border-border"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-foreground">
                                  {cal.calificador_full_name}
                                </p>
                                <div className="flex items-center gap-0.5 mt-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-3 h-3",
                                        i < cal.puntuacion
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground/30"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(cal.created_at).toLocaleDateString("es-CO")}
                              </span>
                            </div>
                            {cal.comentario && (
                              <p className="text-muted-foreground text-sm mt-2">{cal.comentario}</p>
                            )}
                          </div>
                        ))}
                        {calificaciones.length > 5 && (
                          <p className="text-xs text-muted-foreground text-center">
                            Mostrando las 5 más recientes de {calificaciones.length}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </InfoCard>

              {/* Certificaciones */}
              {arbitro.documentos && arbitro.documentos.length > 0 && (
                <InfoCard title="Certificaciones" icon={Award}>
                  <div className="space-y-2">
                    {arbitro.documentos
                      .filter((doc) => doc.tipo === "certificacion" && doc.estado === "aprobado")
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span>{doc.nombre || doc.tipo_display}</span>
                        </div>
                      ))}
                  </div>
                </InfoCard>
              )}
            </div>
          </div>

          {/* Botón sticky para móvil */}
          <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-card/90 backdrop-blur-xl border-t border-border/60">
            <Button
              onClick={() => setShowSolicitudModal(true)}
              size="lg"
              className="w-full py-6 text-lg font-bold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Solicitar Árbitro
            </Button>
          </div>
      </PageContainer>

      {/* Modal de solicitud */}
      {showSolicitudModal && arbitro && (
        <PartidoFormModal
          arbitro={arbitro}
          open={showSolicitudModal}
          onClose={() => setShowSolicitudModal(false)}
        />
      )}
    </PageLayout>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

const ORDEN_DIAS: Record<string, number> = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  domingo: 7,
};

const NOMBRES_DIAS: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

function formatHora(h: string): string {
  if (!h) return "";
  return h.length >= 5 ? h.substring(0, 5) : h;
}

interface HorariosDisponiblesProps {
  disponibilidades: DisponibilidadArbitro[];
}

function HorariosDisponibles({ disponibilidades }: HorariosDisponiblesProps) {
  const porDia: Record<string, DisponibilidadArbitro[]> = {};
  disponibilidades.forEach((d) => {
    const dia = d.dia_semana;
    if (!porDia[dia]) porDia[dia] = [];
    porDia[dia].push(d);
  });
  const diasOrdenados = Object.keys(porDia).sort(
    (a, b) => (ORDEN_DIAS[a] ?? 99) - (ORDEN_DIAS[b] ?? 99)
  );

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-sm mb-4">
        Franjas en las que suele estar disponible para arbitrar
      </p>
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {diasOrdenados.map((dia) => {
          const bloques = porDia[dia];
          const nombreDia = NOMBRES_DIAS[dia] ?? dia;
          return (
            <div
              key={dia}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-4 py-3 bg-muted/50 sm:bg-transparent hover:bg-muted/50 transition-colors"
            >
              <span className="font-semibold text-foreground text-base min-w-[7rem] sm:min-w-[8rem]">
                {nombreDia}
              </span>
              <div className="flex flex-wrap gap-2">
                {bloques.map((b) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-medium"
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="tabular-nums">
                      {formatHora(b.hora_inicio)} – {formatHora(b.hora_fin)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative pb-24 lg:pb-8">
      {/* Fondo con gradiente adaptativo */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20" />
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none dark:block hidden" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none dark:block hidden" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img src={logoImage} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.02]" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

interface InfoCardProps {
  title?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}

function InfoCard({ title, icon: Icon, children }: InfoCardProps) {
  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-5">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && (
            <div className="p-2 bg-primary/20 rounded-lg">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
          <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-foreground font-medium">Cargando perfil...</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20 p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">Error</p>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={onBack} variant="outline" className="border-destructive/30">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a árbitros
        </Button>
      </div>
    </div>
  );
}
