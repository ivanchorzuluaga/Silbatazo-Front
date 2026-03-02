import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Sparkles, Star } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { RefereeCard } from "./RefereeCard";

interface RefereesPreviewProps {
  arbitros: Arbitro[];
}

export function RefereesPreview({ arbitros }: RefereesPreviewProps) {
  // Mostrar solo los primeros 5 árbitros
  const arbitrosPreview = arbitros.slice(0, 5);

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

        {/* Referee Cards - Scroll horizontal en todas las resoluciones */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {arbitrosPreview.map((arbitro) => (
            <div
              key={arbitro.id}
              className="shrink-0 w-[360px] max-w-full snap-center"
            >
              <RefereeCard arbitro={arbitro} />
            </div>
          ))}
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
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium">Perfiles destacados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
