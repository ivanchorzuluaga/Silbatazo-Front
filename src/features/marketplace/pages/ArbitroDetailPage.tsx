/**
 * Página de detalle de árbitro
 * Diseño moderno con gradientes y glassmorphism
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, getArbitroDetailRoute } from "@/lib/constants";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import { PartidoFormModal } from "@/features/partidos/components/PartidoFormModal";
import { useCalificaciones } from "@/features/partidos/hooks/useCalificaciones";
import { getRefereeImage } from "@/lib/referee-images";
import logoImage from "@/assets/Silbatazo-bordes.png";
import {
  ArrowLeft,
  Star,
  MapPin,
  Trophy,
  Clock,
  Calendar,
  FileCheck,
  Phone,
  Mail,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-background flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-white">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !arbitro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-background flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-white mb-2">Error</p>
          <p className="text-white/70 mb-6">{error || "Árbitro no encontrado"}</p>
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
  const precioBase = arbitro.categorias.length > 0 ? arbitro.categorias[0].tarifa : null;

  return (
    <div className="min-h-screen relative">
      {/* Fondo con gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-background" />

      {/* Efectos de luz */}
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img src={logoImage} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.02]" />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ARBITROS)}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
                <Link to={ROUTES.DASHBOARD}>Mi Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
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
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-white/10">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Rating badge */}
                {rating > 0 && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">{rating.toFixed(1)}</span>
                  </div>
                )}

                {/* Precio */}
                {precioBase && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-3xl font-bold">
                      ${precioBase.toLocaleString()}
                      <span className="text-base font-normal text-white/70">/partido</span>
                    </p>
                  </div>
                )}
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
                  <p className="text-center text-white/50 text-sm mt-2">
                    Necesitas una cuenta para solicitar
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nombre y contacto */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{nombre}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/70">
                    {arbitro.experiencia_anos > 0 && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {arbitro.experiencia_anos} años exp.
                      </span>
                    )}
                    {totalCalificaciones > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {totalCalificaciones} calificaciones
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Disponible
                </div>
              </div>

              {/* Contacto */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                {arbitro.email && (
                  <a
                    href={`mailto:${arbitro.email}`}
                    className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {arbitro.email}
                  </a>
                )}
                {arbitro.telefono && (
                  <a
                    href={`tel:${arbitro.telefono}`}
                    className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {arbitro.telefono}
                  </a>
                )}
              </div>
            </div>

            {/* Biografía */}
            {arbitro.biografia && (
              <InfoCard icon={User} title="Sobre mí">
                <p className="text-white/70 whitespace-pre-wrap leading-relaxed">
                  {arbitro.biografia}
                </p>
              </InfoCard>
            )}

            {/* Categorías con precios */}
            {arbitro.categorias.length > 0 && (
              <InfoCard icon={Trophy} title="Categorías y Tarifas">
                <div className="grid sm:grid-cols-2 gap-3">
                  {arbitro.categorias.map((categoria) => (
                    <div
                      key={categoria.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <span className="text-white font-medium">{categoria.nombre}</span>
                      {categoria.tarifa && (
                        <span className="text-primary font-bold">
                          ${categoria.tarifa.toLocaleString()}
                        </span>
                      )}
                    </div>
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80"
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
                <div className="flex items-center gap-2 text-white/50">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando calificaciones...
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Promedio */}
                  {rating > 0 && (
                    <div className="flex items-center gap-6 pb-4 border-b border-white/10">
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
                                  : "text-white/20",
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                          {totalCalificaciones} {totalCalificaciones === 1 ? "reseña" : "reseñas"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Lista de calificaciones */}
                  {calificaciones.length === 0 ? (
                    <p className="text-white/50 text-sm">
                      Aún no hay calificaciones para este árbitro.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {calificaciones.slice(0, 5).map((cal) => (
                        <div
                          key={cal.id}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-white">{cal.calificador_full_name}</p>
                              <div className="flex items-center gap-0.5 mt-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-3 h-3",
                                      i < cal.puntuacion
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-white/20",
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-white/50">
                              {new Date(cal.created_at).toLocaleDateString("es-CO")}
                            </span>
                          </div>
                          {cal.comentario && (
                            <p className="text-white/70 text-sm">{cal.comentario}</p>
                          )}
                        </div>
                      ))}
                      {calificaciones.length > 5 && (
                        <p className="text-xs text-white/50 text-center">
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
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {doc.nombre || doc.tipo_display}
                            </p>
                            {doc.nombre && (
                              <p className="text-sm text-white/50">{doc.tipo_display}</p>
                            )}
                          </div>
                        </div>
                        {doc.archivo_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.archivo_url, "_blank")}
                            className="border-white/20 text-white hover:bg-white/10"
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gray-950/95 backdrop-blur-md border-t border-white/10 z-50">
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
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}
