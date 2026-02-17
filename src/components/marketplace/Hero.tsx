import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Clock, Users, Trophy } from "lucide-react";
import arbitroImage1200 from "@/assets/arbitro-1200.jpg";
import arbitroImage800 from "@/assets/arbitro-800.jpg";
import { useLandingStats } from "@/features/marketplace/hooks/useLandingStats";

/** Formatea "HH:MM" a "H:MM" o "HH:MM" para mostrar (ej. "08:00" → "8:00") */
function formatHoraCorta(hora: string | null): string {
  if (!hora) return "";
  const [h, m] = hora.split(":");
  const hNum = parseInt(h, 10);
  return `${hNum}:${m}`;
}

export function Hero() {
  const { stats, isLoading } = useLandingStats();

  const handleScrollTo = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const partidosPitados = stats?.partidos_pitados ?? null;
  const calificacionPromedio = stats?.calificacion_promedio ?? null;
  const arbitrosDisponiblesHoy = stats?.arbitros_disponibles_hoy ?? 0;
  const primeraHoraHoy = stats?.primera_hora_hoy ? formatHoraCorta(stats.primera_hora_hoy) : null;
  const arbitrosTotal = stats?.arbitros_total ?? 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-primary">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.6))]" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/2 left-0 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-semibold">
                {!isLoading && arbitrosTotal > 0 ? arbitrosTotal : "—"}
              </span>{" "}
              árbitros certificados disponibles
            </div>

            {/* Main title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight text-balance">
                <span className="bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
                  ÁRBITROS PARA PARTIDOS Y TORNEOS
                </span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-muted-foreground">
                  EN COLOMBIA, FÁCIL Y CONFIABLE
                </span>
              </h1>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Garantía de calidad</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Puntualidad asegurada</span>
              </div>
            </div>

            {/* Image section - Solo visible en móvil, después de garantías */}
            <div className="relative lg:hidden">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
                <img
                  src={arbitroImage1200}
                  srcSet={`${arbitroImage800} 800w, ${arbitroImage1200} 1200w`}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt="Árbitro en partido deportivo"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='20' fill='%239ca3af'%3EÁrbitro certificado%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating card móvil */}
              <div className="absolute -bottom-3 right-4 bg-card p-3 rounded-lg shadow-lg border border-border/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Disponible ahora</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Conecta con árbitros verificados para partidos, amistosos y torneos en el Área
              Metropolitana de Medellín. Arbitraje fácil y de confianza.
              <span className="font-semibold text-foreground"> Rápido, seguro y sin enredos.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleScrollTo("#arbitros-destacados")}
              >
                <Users className="h-5 w-5 mr-2" />
                Explorar Árbitros
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-2 hover:bg-primary/5"
                onClick={() => handleScrollTo("#como-funciona")}
              >
                <Clock className="h-5 w-5 mr-2" />
                Cómo Funciona
              </Button>
            </div>

            {/* Stats (datos reales) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 lg:pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {isLoading ? "—" : partidosPitados}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">Partidos arbitrados</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {isLoading ? "—" : calificacionPromedio ?? "—"}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">Calificación promedio</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-5 w-5 text-green-500" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {isLoading ? "—" : arbitrosDisponiblesHoy}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">Disponibles hoy</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    {isLoading ? "—" : primeraHoraHoy ? `Desde ${primeraHoraHoy}` : "—"}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground">Primera hora hoy</p>
              </div>
            </div>
          </div>

          {/* Image section - Solo visible en desktop */}
          <div className="relative hidden lg:block">
            {/* Main image container */}
            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
              <img
                src={arbitroImage1200}
                srcSet={`${arbitroImage800} 800w, ${arbitroImage1200} 1200w`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="Árbitro en partido deportivo"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='20' fill='%239ca3af'%3EÁrbitro certificado%3C/text%3E%3C/svg%3E";
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating cards - solo desktop */}
            <div className="absolute -top-4 -right-4 bg-card p-3 rounded-lg shadow-lg border border-border/50 backdrop-blur-sm z-20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Disponible ahora</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-lg shadow-lg border border-border/50 backdrop-blur-sm z-20">
              <p className="text-xs font-medium text-muted-foreground mb-1">Hoy</p>
              <p className="text-lg font-bold text-foreground tabular-nums">
                {isLoading ? "—" : primeraHoraHoy ? `Desde ${primeraHoraHoy}` : "—"}
              </p>
              <p className="text-xs text-primary">
                {isLoading ? "—" : arbitrosDisponiblesHoy}{" "}
                {arbitrosDisponiblesHoy === 1 ? "árbitro disponible" : "árbitros disponibles"}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-8 left-8 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 right-8 w-20 h-20 bg-secondary/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
