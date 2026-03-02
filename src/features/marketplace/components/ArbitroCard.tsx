/**
 * Componente de tarjeta para mostrar un árbitro en la lista
 */

import { Link } from "react-router-dom";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import { getArbitroDetailRoute } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FotoArbitroCard } from "@/components/arbitro/FotoArbitroCard";

interface ArbitroCardProps {
  arbitro: Arbitro;
}

function calcularEdad(fechaNacimiento?: string): number | null {
  if (!fechaNacimiento) return null;
  const [year, month, day] = fechaNacimiento.split("-").map(Number);
  if (!year || !month || !day) return null;

  const hoy = new Date();
  let edad = hoy.getFullYear() - year;
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();

  if (mesActual < month || (mesActual === month && diaActual < day)) {
    edad -= 1;
  }

  return edad >= 0 ? edad : null;
}

export function ArbitroCard({ arbitro }: ArbitroCardProps) {
  const edad = arbitro.edad ?? calcularEdad(arbitro.fecha_nacimiento);

  return (
    <Link
      to={getArbitroDetailRoute(arbitro.id)}
      className="block h-full w-[360px] max-w-full"
    >
      <Card
        variant="elevated"
        className="h-full hover:shadow-ios-lg transition-ios cursor-pointer"
      >
        <CardHeader>
          <FotoArbitroCard arbitro={arbitro} className="w-full" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Experiencia y categorías */}
          <div className="space-y-2">
            {edad !== null && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 7a5 5 0 100 10 5 5 0 000-10zm9 5a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{edad} años</span>
              </div>
            )}
            {arbitro.experiencia_anos > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
              <p className="text-sm text-muted-foreground line-clamp-2">
                {arbitro.biografia}
              </p>
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
              <DisponibilidadDisplay
                disponibilidades={arbitro.disponibilidades}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
