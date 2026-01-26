/**
 * Componente de tarjeta para mostrar un árbitro en la lista
 */

import { Link } from "react-router-dom";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import { getArbitroDetailRoute } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ArbitroCardProps {
  arbitro: Arbitro;
}

export function ArbitroCard({ arbitro }: ArbitroCardProps) {
  // Calcular rating promedio (si existe)
  const ratingPromedio = arbitro.calificacion_promedio || 0;
  const totalCalificaciones = arbitro.total_calificaciones || 0;

  return (
    <Link to={getArbitroDetailRoute(arbitro.id)} className="block h-full">
      <Card variant="elevated" className="h-full hover:shadow-ios-lg transition-ios cursor-pointer">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar
              size="lg"
              src={arbitro.foto_perfil}
              alt={arbitro.full_name || arbitro.username}
              fallback={(arbitro.full_name || arbitro.username)?.charAt(0).toUpperCase() || "A"}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-foreground truncate">
              {arbitro.full_name || arbitro.username}
            </h3>
              {ratingPromedio > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="size-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{ratingPromedio.toFixed(1)}</span>
                  {totalCalificaciones > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({totalCalificaciones})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
        {/* Información profesional */}
        <div className="space-y-2">
          {arbitro.experiencia_anos > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{arbitro.experiencia_anos} años de experiencia</span>
            </div>
          )}

          {arbitro.biografia && (
            <p className="text-sm text-muted-foreground line-clamp-2">{arbitro.biografia}</p>
          )}
        </div>

          {/* Categorías */}
          {arbitro.categorias.length > 0 && (
          <div className="flex flex-wrap gap-2">
              {arbitro.categorias.slice(0, 3).map((categoria) => (
                <Badge key={categoria.id} variant="soft" size="sm">
                  {categoria.nombre}
                </Badge>
            ))}
              {arbitro.categorias.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{arbitro.categorias.length - 3}
                </Badge>
            )}
          </div>
        )}

          {/* Municipios */}
          {arbitro.municipios.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {arbitro.municipios.slice(0, 2).map((municipio) => (
                <Badge key={municipio.id} variant="outline" size="sm">
                  {municipio.nombre}
                </Badge>
              ))}
              {arbitro.municipios.length > 2 && (
                <Badge variant="outline" size="sm">
                  +{arbitro.municipios.length - 2} más
                </Badge>
              )}
          </div>
        )}

        {/* Disponibilidad */}
        {arbitro.disponibilidades && arbitro.disponibilidades.length > 0 && (
          <div className="pt-2 border-t">
            <DisponibilidadDisplay disponibilidades={arbitro.disponibilidades} />
          </div>
        )}
        </CardContent>
      </Card>
    </Link>
  );
}
