/**
 * Componente para mostrar el detalle completo de un partido
 */

import { useEffect } from "react";
import { parseLocalDate, formatCop } from "@/lib/utils";
import { useCalificaciones } from "../hooks/useCalificaciones";
import { Star } from "lucide-react";
import type { PartidoDetail as PartidoDetailType } from "../types/partido.types";

interface PartidoDetailProps {
  partido: PartidoDetailType;
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  aceptado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  completado: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  cancelado: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
};

const estadoPagoColors: Record<string, string> = {
  pendiente: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  en_revision: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  aprobado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function PartidoDetail({ partido }: PartidoDetailProps) {
  const estadoColor = estadoColors[partido.estado] || estadoColors.pendiente;
  const { promedio, obtenerPromedio, isLoading: isLoadingPromedio } = useCalificaciones();

  // Cargar promedio de calificaciones del árbitro si hay árbitro asignado
  useEffect(() => {
    if (partido.arbitro_info?.id) {
      obtenerPromedio(partido.arbitro_info.id);
    }
  }, [partido.arbitro_info?.id, obtenerPromedio]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Partido #{partido.id}</h1>
          {partido.codigo && (
            <p className="text-xs sm:text-sm font-mono text-muted-foreground mb-2 break-all">
              Código: {partido.codigo}
            </p>
          )}
          <p className="text-sm sm:text-base text-muted-foreground">
            Solicitado el {new Date(partido.created_at).toLocaleDateString("es-CO")}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end shrink-0">
          <span
            className={`inline-flex items-center rounded-md border px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ${estadoColor}`}
          >
            {partido.estado_display}
          </span>
          {partido.estado_pago && (
            <span
              className={`inline-flex items-center rounded-md border px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ${
                estadoPagoColors[partido.estado_pago] || estadoPagoColors.pendiente
              }`}
            >
              Pago: {partido.estado_pago_display || partido.estado_pago}
            </span>
          )}
        </div>
      </div>

      {/* Información Principal */}
      <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Información del Partido</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Fecha</p>
            <p className="font-medium text-sm sm:text-base break-words">
              {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Hora</p>
            <p className="font-medium text-sm sm:text-base">{partido.hora_str}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Lugar</p>
            <p className="font-medium text-sm sm:text-base break-words">{partido.lugar}</p>
          </div>
          {partido.direccion && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Dirección</p>
              <p className="font-medium text-sm sm:text-base break-words">{partido.direccion}</p>
            </div>
          )}
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Municipio</p>
            <p className="font-medium text-sm sm:text-base break-words">
              {partido.municipio.nombre}
              {partido.municipio.departamento && `, ${partido.municipio.departamento}`}
            </p>
          </div>
          {partido.tipo_partido && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Tipo de partido</p>
              <p className="font-medium text-sm sm:text-base">{partido.tipo_partido.nombre}</p>
              {partido.tipo_partido.duracion_referencial && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {partido.tipo_partido.duracion_referencial}
                </p>
              )}
            </div>
          )}
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Valor a cobrar</p>
            <p className="font-medium text-sm sm:text-base">
              {partido.monto_total != null
                ? formatCop(partido.monto_total)
                : partido.tipo_partido
                ? formatCop(partido.tipo_partido.monto)
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Participantes */}
      <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Participantes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Cliente</p>
            <p className="font-medium text-sm sm:text-base break-words">
              {partido.cliente_full_name || partido.cliente_username}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground break-all">
              {partido.cliente_email}
            </p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Árbitro</p>
            {partido.arbitro_info ? (
              <>
                <p className="font-medium text-sm sm:text-base break-words">
                  {partido.arbitro_info.full_name || partido.arbitro_info.username}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  @{partido.arbitro_info.username}
                </p>
                {/* Calificaciones del árbitro */}
                {isLoadingPromedio ? (
                  <p className="text-xs text-muted-foreground mt-2">Cargando calificaciones...</p>
                ) : promedio && promedio.promedio != null ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-foreground">
                        {promedio.promedio.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({promedio.total_calificaciones}{" "}
                      {promedio.total_calificaciones === 1 ? "calificación" : "calificaciones"})
                    </span>
                  </div>
                ) : promedio && promedio.total_calificaciones === 0 ? (
                  <p className="text-xs text-muted-foreground mt-2">Sin calificaciones aún</p>
                ) : null}
              </>
            ) : (
              <p className="font-medium text-sm sm:text-base text-muted-foreground">
                {partido.estado === "buscando_arbitro"
                  ? "Buscando árbitro"
                  : "Sin árbitro asignado"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notas */}
      {(partido.notas_cliente || partido.notas_arbitro) && (
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Notas</h2>
          {partido.notas_cliente && (
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Notas del Cliente</p>
              <p className="text-sm sm:text-base break-words">{partido.notas_cliente}</p>
            </div>
          )}
          {partido.notas_arbitro && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Notas del Árbitro</p>
              <p className="text-sm sm:text-base break-words">{partido.notas_arbitro}</p>
            </div>
          )}
        </div>
      )}

      {/* Motivos (si aplica) */}
      {(partido.motivo_rechazo || partido.motivo_cancelacion) && (
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Información Adicional</h2>
          {partido.motivo_rechazo && (
            <div className="mb-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Motivo de Rechazo</p>
              <p className="text-sm sm:text-base text-destructive break-words">
                {partido.motivo_rechazo}
              </p>
            </div>
          )}
          {partido.motivo_cancelacion && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Motivo de Cancelación</p>
              <p className="text-sm sm:text-base text-destructive break-words">
                {partido.motivo_cancelacion}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información de Pago */}
      {partido.estado_pago && (
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Estado de Pago</h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Estado:</span>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs sm:text-sm font-medium ${
                  estadoPagoColors[partido.estado_pago] || estadoPagoColors.pendiente
                }`}
              >
                {partido.estado_pago_display || partido.estado_pago}
              </span>
            </div>
            {partido.fecha_pago && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Fecha de pago reportada:
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {new Date(partido.fecha_pago).toLocaleString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            {partido.notas_pago && (
              <div className="pt-2 border-t">
                <span className="text-xs sm:text-sm text-muted-foreground block mb-2">
                  Notas del administrador:
                </span>
                <p className="text-sm sm:text-base mt-1 p-3 rounded-lg bg-muted/50 break-words">
                  {partido.notas_pago}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fechas de Gestión */}
      {(partido.fecha_aceptacion ||
        partido.fecha_rechazo ||
        partido.fecha_completado ||
        partido.fecha_cancelacion) && (
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Historial</h2>
          <div className="space-y-2.5 text-xs sm:text-sm">
            {partido.fecha_aceptacion && (
              <p className="break-words">
                <span className="text-muted-foreground">Aceptado:</span>{" "}
                {new Date(partido.fecha_aceptacion).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {partido.fecha_rechazo && (
              <p className="break-words">
                <span className="text-muted-foreground">Rechazado:</span>{" "}
                {new Date(partido.fecha_rechazo).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {partido.fecha_completado && (
              <p className="break-words">
                <span className="text-muted-foreground">Completado:</span>{" "}
                {new Date(partido.fecha_completado).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {partido.fecha_cancelacion && (
              <p className="break-words">
                <span className="text-muted-foreground">Cancelado:</span>{" "}
                {new Date(partido.fecha_cancelacion).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
