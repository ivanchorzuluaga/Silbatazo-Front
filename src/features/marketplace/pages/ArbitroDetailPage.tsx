/**
 * Página de detalle de árbitro
 * Diseño moderno con gradientes y glassmorphism
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ROUTES, WHATSAPP_RESERVA_MESSAGE, ARBITRO_CALIFICACION_PUBLICA } from "@/lib/constants";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import logoImage from "@/assets/Logo.png";
import { FotoArbitroCard } from "@/components/arbitro/FotoArbitroCard";
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
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function ArbitroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [arbitro, setArbitro] = useState<Arbitro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar árbitro");
      } finally {
        setIsLoading(false);
      }
    };

    cargarArbitro();
  }, [id]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !arbitro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20 p-8 text-center max-w-md shadow-ios-lg">
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

  return (
    <div className="min-h-screen relative">
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
      <header className="relative z-50 sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border/60">
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
              <div className="mb-6">
                <FotoArbitroCard
                  arbitro={arbitro}
                  className="w-full"
                  backgroundSrc="/Fondo-Limpio-Diseño-2.png"
                  fotoOverrideSrc={arbitro.foto_detalle || undefined}
                  nombreOverride="Árbitro Silbatazo"
                  nombreClassName="text-3xl whitespace-nowrap"
                  nombreWrapperClassName="bottom-12"
                />
              </div>

              <div className="hidden lg:block space-y-3">
                <WhatsAppButton
                  size="lg"
                  className="w-full h-14 text-lg shadow-lg"
                  message={WHATSAPP_RESERVA_MESSAGE}
                >
                  Reservar por WhatsApp
                </WhatsAppButton>
                <p className="text-center text-muted-foreground text-xs">
                  Te atendemos por el mismo canal para confirmar fecha, lugar y pago.
                </p>
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nombre y contacto */}
            <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-start gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{nombre}</h1>
                    <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-foreground font-semibold">
                        {ARBITRO_CALIFICACION_PUBLICA.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    {arbitro.experiencia_anos > 0 && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {arbitro.experiencia_anos} años exp.
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      {Array.from({ length: ARBITRO_CALIFICACION_PUBLICA }, (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-1">Árbitro garantizado</span>
                    </span>
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

        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card/90 backdrop-blur-xl border-t border-border/60 z-50">
          <WhatsAppButton
            size="lg"
            className="w-full h-14 text-lg shadow-lg"
            message={WHATSAPP_RESERVA_MESSAGE}
          >
            Reservar por WhatsApp
          </WhatsAppButton>
        </div>

        <div className="lg:hidden h-24" />
      </main>
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
