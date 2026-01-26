/**
 * Componente de tarjeta para mostrar un árbitro pendiente en el panel de verificación
 */

import { Link } from "react-router-dom";
import { getVerificarArbitroRoute } from "@/lib/constants";
import type { Arbitro } from "../types/arbitro.types";

interface ArbitroPendienteCardProps {
  arbitro: Arbitro;
}

export function ArbitroPendienteCard({ arbitro }: ArbitroPendienteCardProps) {
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "en_revision":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Link
      to={getVerificarArbitroRoute(arbitro.id)}
      className="block rounded-lg border bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                {arbitro.full_name || arbitro.username}
              </h3>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getEstadoBadgeColor(
                  arbitro.estado_verificacion
                )}`}
              >
                {arbitro.estado_verificacion_display}
              </span>
            </div>
            {arbitro.email && <p className="text-sm text-muted-foreground">{arbitro.email}</p>}
          </div>
        </div>

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

        {/* Municipios */}
        {arbitro.municipios.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {arbitro.municipios.slice(0, 3).map((municipio) => (
              <span
                key={municipio.id}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
              >
                {municipio.nombre}
                {municipio.departamento && `, ${municipio.departamento}`}
              </span>
            ))}
            {arbitro.municipios.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                +{arbitro.municipios.length - 3} más
              </span>
            )}
          </div>
        )}

        {/* Categorías */}
        {arbitro.categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {arbitro.categorias.map((categoria) => (
              <span
                key={categoria.id}
                className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium"
              >
                {categoria.nombre}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t">
          <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
            Revisar y verificar
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
