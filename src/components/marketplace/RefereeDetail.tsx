import { Star, MapPin, Award, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { getRefereeImage } from "@/lib/referee-images";

interface RefereeDetailProps {
  arbitro: Arbitro;
}

export function RefereeDetail({ arbitro }: RefereeDetailProps) {
  const rating = arbitro.calificacion_promedio || 0;
  const nombre = arbitro.full_name || arbitro.username;
  const experiencia = arbitro.experiencia_anos ? `${arbitro.experiencia_anos} años` : "Experiencia";
  const especialidad =
    arbitro.categorias.length > 0 ? arbitro.categorias.map((c) => c.nombre).join(", ") : "Árbitro";
  const partidos = arbitro.total_partidos || 0;
  const imagen = getRefereeImage(
    arbitro.foto_perfil,
    arbitro.id,
    arbitro.experiencia_anos,
    nombre,
    arbitro.foto_perfil_thumb
  );
  const municipio =
    arbitro.municipios.length > 0
      ? arbitro.municipios.map((m) => m.nombre).join(", ")
      : "Ubicación no especificada";

  // Certificaciones (simuladas basadas en categorías)
  const certificaciones = arbitro.categorias.map((c) => c.nombre);

  // Disponibilidad
  const disponibilidad =
    arbitro.disponibilidades && arbitro.disponibilidades.length > 0
      ? arbitro.disponibilidades.map((d) => d.dia_semana_display)
      : ["Consultar disponibilidad"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-64 aspect-[3/4] bg-secondary rounded-lg overflow-hidden shrink-0 shadow-lg">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
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
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold">{nombre}</h1>
              {rating > 0 && (
                <Badge className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  {rating.toFixed(1)}
                </Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{especialidad}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {municipio}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {experiencia} de experiencia
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              {partidos} partidos arbitrados
            </div>
          </div>
        </div>
      </div>

      {arbitro.biografia && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Sobre {nombre.split(" ")[0]}</h2>
          <p className="text-muted-foreground leading-relaxed">{arbitro.biografia}</p>
        </div>
      )}

      {certificaciones.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificaciones
          </h2>
          <div className="flex flex-wrap gap-2">
            {certificaciones.map((cert, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {disponibilidad.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Disponibilidad
          </h2>
          <div className="flex flex-wrap gap-2">
            {disponibilidad.map((day, index) => (
              <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                {day}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
