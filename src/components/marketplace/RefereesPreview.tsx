import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, MapPin, CheckCircle, Shield } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { getArbitroDetailRoute } from "@/lib/constants";
import { getRefereeImage } from "@/lib/referee-images";

interface RefereesPreviewProps {
  arbitros: Arbitro[];
}

export function RefereesPreview({ arbitros }: RefereesPreviewProps) {
  // Mostrar solo los primeros 4 árbitros
  const arbitrosPreview = arbitros.slice(0, 4);

  return (
    <section
      id="arbitros-destacados"
      className="py-24 bg-gradient-to-b from-primary via-primary/50 to-background relative overflow-hidden scroll-mt-20"
    >
      {/* Background decoration para transición suave */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.2),transparent)]" />
      <div className="absolute top-0 left-1/4 h-96 w-96 bg-black/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-black" />
              <h2 className="text-3xl sm:text-4xl font-bold text-black">Árbitros Destacados</h2>
            </div>
            <p className="text-black/70 text-lg">
              Árbitros certificados, de calidad y con excelente reputación
            </p>
          </div>
          <Button
            size="lg"
            className="group shadow-md hover:shadow-lg transition-all duration-300 bg-black text-white hover:bg-black/90"
            asChild
          >
            <Link to={ROUTES.ARBITROS}>
              Ver todos los árbitros
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Referee Cards - Slider en móvil, Grid en desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none scrollbar-hide">
          {arbitrosPreview.map((arbitro) => {
            const rating = arbitro.calificacion_promedio || 0;
            const totalCalificaciones = arbitro.total_calificaciones || 0;
            const nombre = arbitro.full_name || arbitro.username;
            const experiencia = arbitro.experiencia_anos
              ? `${arbitro.experiencia_anos} años`
              : "Experiencia";
            const especialidad =
              arbitro.categorias.length > 0 ? arbitro.categorias[0].nombre : "Árbitro";
            const partidos = arbitro.total_partidos || 0;
            const imagen = getRefereeImage(
              arbitro.foto_perfil,
              arbitro.id,
              arbitro.experiencia_anos,
              nombre,
              arbitro.foto_perfil_thumb
            );
            const disponibilidad = arbitro.estado_verificacion === "aprobado";

            return (
              <Link
                key={arbitro.id}
                to={getArbitroDetailRoute(arbitro.id)}
                className="group block shrink-0 w-[280px] sm:w-auto snap-center sm:snap-align-none"
              >
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={imagen}
                      alt={nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width={400}
                      height={500}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='250' viewBox='0 0 200 250'%3E%3Crect width='200' height='250' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='14' fill='%239ca3af'%3EÁrbitro%3C/text%3E%3C/svg%3E";
                      }}
                    />

                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {disponibilidad && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500 text-white border-none shadow-md"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Disponible
                        </Badge>
                      )}
                      {rating > 4.5 && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500 text-white border-none shadow-md"
                        >
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          Top Rated
                        </Badge>
                      )}
                    </div>

                    {/* Rating overlay */}
                    {rating > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-white font-semibold">{rating.toFixed(1)}</span>
                          </div>
                          <div className="text-white text-sm">{partidos} partidos</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Name and specialization */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                        {nombre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{especialidad}</span>
                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        <span>{experiencia}</span>
                      </div>
                    </div>

                    {/* Stats: calificaciones y disponibilidad */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
                        <span className="font-medium text-foreground">
                          {rating && rating > 0 ? Number(rating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-xs">
                          {totalCalificaciones === 0
                            ? "(sin calificaciones)"
                            : `(${totalCalificaciones} ${
                                totalCalificaciones === 1 ? "calificación" : "calificaciones"
                              })`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span>Disponible</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 bg-card border border-border/50 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Verificados</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Calificados</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Certificados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
