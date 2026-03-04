/**
 * Componente de tarjeta para mostrar un partido en la lista
 */

import { Link } from "react-router-dom";
import { parseLocalDate, formatCop } from "@/lib/utils";
import { getGrossAmount, getRoleAmounts } from "@/lib/pricing";
import { getPartidoDetailRoute } from "@/lib/constants";
import type { Partido } from "../types/partido.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface PartidoCardProps {
  partido: Partido;
}

export function PartidoCard({ partido }: PartidoCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const cancha = partido.cancha_nombre || partido.lugar;
  const ubicacion = partido.barrio ? `${cancha} · ${partido.barrio}` : cancha;
  const titulo = isAdmin
    ? `Partido #${partido.id}`
    : `Partido en ${partido.municipio?.nombre ?? cancha}`;

  return (
    <Link
      to={getPartidoDetailRoute(partido.id)}
      className="block touch-manipulation"
      style={{ contentVisibility: "auto", containIntrinsicSize: "320px 420px" }}
    >
      <Card variant="elevated" className="h-full hover:shadow-ios-lg transition-ios">
        <CardHeader className="pb-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h3 className="text-base sm:text-xl font-semibold text-foreground">
                  {titulo}
                </h3>
                <Badge
                  variant={
                    partido.estado === "aceptado"
                      ? "success"
                      : partido.estado === "completado"
                      ? "default"
                      : "warning"
                  }
                >
                  {partido.estado_display}
                </Badge>
                {partido.estado_pago && (
                  <Badge
                    variant={partido.estado_pago === "aprobado" ? "success" : "warning"}
                    size="sm"
                  >
                    {partido.estado_pago_display || partido.estado_pago}
                  </Badge>
                )}
              </div>
              {partido.codigo && (
                <p className="text-[10px] sm:text-xs font-mono text-muted-foreground mb-1 break-all">
                  {partido.codigo}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-xs sm:text-base font-medium text-foreground">
            {ubicacion}
            {partido.direccion && ` - ${partido.direccion}`}
          </p>

          {/* Información del partido */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-sm text-muted-foreground">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="sm:hidden">
                {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="hidden sm:inline">
                {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-sm text-muted-foreground">
              <svg
                className="h-4 w-4 shrink-0"
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
              <span>{partido.hora_str}</span>
            </div>
          </div>

          {/* Valor y Árbitro */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
            <div className="flex flex-wrap gap-2">
              {partido.arbitro_info ? (
                <Badge variant="outline" size="sm">
                  {partido.arbitro_info.full_name || partido.arbitro_info.username}
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  Buscando árbitro
                </Badge>
              )}
              <Badge variant="soft" size="sm">
                {partido.categoria.nombre}
              </Badge>
              <Badge variant="outline" size="sm">
                {partido.municipio.nombre}
              </Badge>
            </div>
            {(partido.monto_total != null || partido.tipo_partido?.monto_total != null) && (() => {
              const gross = getGrossAmount(
                partido.monto_total,
                partido.tipo_partido?.monto_total ?? null
              );
              const { gross: grossAmount, net, showBoth, showNetOnly } = getRoleAmounts(
                gross,
                partido.comision_app ?? partido.tipo_partido?.comision_app ?? null,
                user?.role
              );
              return (
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary tabular-nums">
                    {formatCop(showNetOnly ? net : grossAmount)}
                  </p>
                  {showBoth && (
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      Valor del servicio árbitro: {formatCop(net)}
                    </p>
                  )}
                  {showBoth && (
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      Comisión app: {formatCop(Math.max(grossAmount - net, 0))}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
