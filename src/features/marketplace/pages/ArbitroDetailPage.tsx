/**
 * Página de detalle de árbitro
 * Diseño moderno con gradientes y glassmorphism
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getArbitroDetailRoute } from "@/lib/constants";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import { PartidoFormModal } from "@/features/partidos/components/PartidoFormModal";
import { useCalificaciones } from "@/features/partidos/hooks/useCalificaciones";
import { getRefereeImage } from "@/lib/referee-images";
import logoImage from "@/assets/Logo.png";
import {
  ArrowLeft,
  Star,
  MapPin,
  Trophy,
  Clock,
  FileCheck,
  Briefcase,
  User,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/arbitros/${id}/`, { headers });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Árbitro no encontrado");
          throw new Error("Error al cargar árbitro");
        }

        const data = await response.json();
        setArbitro(data);

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
      if (id) {
        navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(getArbitroDetailRoute(id))}`);
      } else {
        navigate(ROUTES.LOGIN);
      }
      return;
    }

    if (user?.role === "arbitro" || user?.role === "admin") {
      return;
    }

    setShowSolicitarModal(true);
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !arbitro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20 p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Error</p>
          <p className="text-muted-foreground mb-6">{error || "Árbitro no encontrado"}</p>
          <Button onClick={() => navigate(ROUTES.ARBITROS)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  const nombre = arbitro.full_name || arbitro.username;
  const imagen = getRefereeImage(arbitro.foto_perfil, arbitro.id, arbitro.experiencia_anos, nombre);
  const rating = promedio?.promedio || arbitro.calificacion_promedio || 0;
  const totalCalificaciones = promedio?.total_calificaciones || 0;

  return (
    <div className="min-h-screen relative bg-background">
      {/* Fondo con gradiente adaptativo */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20" />

      {/* Efectos de luz - solo en modo oscuro */}
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none dark:block hidden" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none dark:block hidden" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={logoImage}
          alt=""
          className="w-[500px] h-[500px] object-contain opacity-[0.02] dark:opacity-[0.02]"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ARBITROS)}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <span>Tema</span>
              <ThemeToggle size="sm" />
            </div>
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" asChild className="text-foreground hover:bg-muted">
                <Link to={ROUTES.DASHBOARD}>Mi Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-foreground hover:bg-muted">
                <Link to={ROUTES.LOGIN}>Iniciar Sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero del árbitro */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Imagen y datos principales */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Imagen */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-border">
                <img
                  src={imagen}
                  alt={nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
                {/* Gradiente inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent dark:from-black/80" />

                {/* Rating badge */}
                {totalCalificaciones > 0 && rating > 0 ? (
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 border border-border">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-foreground font-semibold">{rating.toFixed(1)}</span>
                    {totalCalificaciones > 0 && (
                      <span className="text-muted-foreground text-xs ml-1">
                        ({totalCalificaciones})
                      </span>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Botón de solicitar - Desktop */}
              <div className="hidden lg:block">
                <Button
                  onClick={handleSolicitar}
                  size="lg"
                  className="w-full h-14 text-lg shadow-lg shadow-primary/25"
                >
                  {isAuthenticated ? "Solicitar Árbitro" : "Registrarse para Solicitar"}
                </Button>
                {!isAuthenticated && (
                  <p className="text-center text-muted-foreground text-sm mt-2">
                    Necesitas una cuenta para solicitar
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nombre y contacto */}
            <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{nombre}</h1>
                    {totalCalificaciones > 0 && rating > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-foreground font-semibold">{rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs">
                          ({totalCalificaciones})
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    {arbitro.experiencia_anos > 0 && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {arbitro.experiencia_anos} años exp.
                      </span>
                    )}
                    {totalCalificaciones > 0 ? (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {totalCalificaciones}{" "}
                        {totalCalificaciones === 1 ? "calificación" : "calificaciones"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        Sin calificaciones aún
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full text-sm font-medium border border-success/30">
                  <CheckCircle className="w-4 h-4" />
                  Disponible
                </div>
              </div>
            </div>

            {/* Biografía */}
            {arbitro.biografia && (
              <InfoCard icon={User} title="Sobre mí">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {arbitro.biografia}
                </p>
              </InfoCard>
            )}

            {/* Categorías */}
            {arbitro.categorias.length > 0 && (
              <InfoCard icon={Trophy} title="Categorías">
                <div className="flex flex-wrap gap-2">
                  {arbitro.categorias.map((categoria) => (
                    <span
                      key={categoria.id}
                      className="inline-flex items-center px-3 py-1.5 bg-muted border border-border rounded-full text-sm text-foreground"
                    >
                      {categoria.nombre}
                    </span>
                  ))}
                </div>
              </InfoCard>
            )}

            {/* Municipios */}
            {arbitro.municipios.length > 0 && (
              <InfoCard icon={MapPin} title="Áreas de Cobertura">
                <div className="flex flex-wrap gap-2">
                  {arbitro.municipios.map((municipio) => (
                    <span
                      key={municipio.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted border border-border rounded-full text-sm text-foreground"
                    >
                      <MapPin className="w-3 h-3" />
                      {municipio.nombre}
                      {municipio.departamento && `, ${municipio.departamento}`}
                    </span>
                  ))}
                </div>
              </InfoCard>
            )}

            {/* Disponibilidad */}
            {arbitro.disponibilidades && arbitro.disponibilidades.length > 0 && (
              <InfoCard icon={Clock} title="Horarios Disponibles">
                <DisponibilidadDisplay disponibilidades={arbitro.disponibilidades} />
              </InfoCard>
            )}

            {/* Calificaciones */}
            <InfoCard icon={Star} title="Calificaciones y Reseñas">
              {isLoadingCalificaciones ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando calificaciones...
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Promedio */}
                  {totalCalificaciones > 0 && rating > 0 ? (
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
                  ) : (
                    <div className="pb-4 border-b border-border">
                      <p className="text-muted-foreground text-sm text-center">
                        Este árbitro aún no tiene calificaciones. Sé el primero en calificarlo
                        después de un partido.
                      </p>
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
                            <p className="text-muted-foreground text-sm">{cal.comentario}</p>
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
              <InfoCard icon={FileCheck} title="Certificaciones">
                <div className="space-y-3">
                  {arbitro.documentos
                    .filter((doc) => doc.tipo === "certificacion" && doc.estado === "aprobado")
                    .map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-success/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {doc.nombre || doc.tipo_display}
                            </p>
                            {doc.nombre && (
                              <p className="text-sm text-muted-foreground">{doc.tipo_display}</p>
                            )}
                          </div>
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
              </InfoCard>
            )}
          </div>
        </div>

        {/* Botón de solicitar - Mobile (sticky) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-50">
          <Button onClick={handleSolicitar} size="lg" className="w-full h-14 text-lg shadow-lg">
            {isAuthenticated ? "Solicitar Árbitro" : "Registrarse para Solicitar"}
          </Button>
        </div>

        {/* Espaciado extra para el botón sticky en móvil */}
        <div className="lg:hidden h-24" />
      </main>

      {/* Modal de solicitar */}
      {arbitro && (
        <PartidoFormModal
          arbitro={arbitro}
          open={showSolicitarModal}
          onClose={() => setShowSolicitarModal(false)}
          onSuccess={() => setShowSolicitarModal(false)}
        />
      )}
    </div>
  );
}

// Componente auxiliar para las cards de información
interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}
