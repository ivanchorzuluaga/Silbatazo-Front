import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { getArbitroDetailRoute } from "@/lib/constants";
import { getRefereeImage } from "@/lib/referee-images";

interface RefereeCardProps {
  arbitro: Arbitro;
}

export function RefereeCard({ arbitro }: RefereeCardProps) {
  const rating = arbitro.calificacion_promedio || 0;
  const nombre = arbitro.full_name || arbitro.username;
  const experiencia = arbitro.experiencia_anos ? `${arbitro.experiencia_anos} años` : "Experiencia";
  const especialidad = arbitro.categorias.length > 0 ? arbitro.categorias[0].nombre : "Árbitro";
  const partidos = arbitro.total_partidos || 0;
  const imagen = getRefereeImage(
    arbitro.foto_perfil,
    arbitro.id,
    arbitro.experiencia_anos,
    nombre,
    arbitro.foto_perfil_thumb
  );
  const municipio = arbitro.municipios.length > 0 ? arbitro.municipios[0].nombre : "Ubicación";

  return (
    <Link
      to={getArbitroDetailRoute(arbitro.id)}
      className="group block bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      style={{ contentVisibility: "auto", containIntrinsicSize: "320px 520px" }}
    >
      {/* Imagen del árbitro */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Si falla la imagen asignada, intentar con otra del pool
            const fallbackImages = [
              "/professional-soccer-referee-in-black-uniform-blowi.jpg",
              "/male-referee-in-black-uniform-portrait.jpg",
              "/placeholder.jpg",
            ];
            const currentSrc = target.src.split("/").pop() || "";
            const nextImage =
              fallbackImages.find((img) => !currentSrc.includes(img.split("/").pop() || "")) ||
              "/placeholder.jpg";
            target.src = nextImage;
          }}
        />

        {/* Badge de rating en la esquina superior derecha */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge
              variant="secondary"
              className="bg-card/90 backdrop-blur-sm border-0 shadow-sm px-2 py-1"
              style={{
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1 shrink-0" />
              <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
            </Badge>
          </div>
        )}
      </div>

      {/* Contenido de la card */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-0">
          {nombre}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 mt-1">
          {especialidad} · {experiencia}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{municipio}</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground">{partidos} partidos</span>
          <span className="text-muted-foreground">·</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-primary font-medium">Disponible</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
