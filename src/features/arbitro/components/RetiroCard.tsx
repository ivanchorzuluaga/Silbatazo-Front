/**
 * Componente de tarjeta para mostrar un retiro en la lista
 */

import { formatCop } from "@/lib/utils";
import type { Retiro } from "../types/arbitro.types";

interface RetiroCardProps {
  retiro: Retiro;
  onProcesar?: (retiro: Retiro) => void;
  isAdmin?: boolean;
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  procesado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export function RetiroCard({ retiro, onProcesar, isAdmin = false }: RetiroCardProps) {
  const estadoColor = estadoColors[retiro.estado] || estadoColors.pendiente;

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Retiro #{retiro.id}</h3>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${estadoColor}`}
              >
                {retiro.estado_display}
              </span>
            </div>
            {isAdmin && (
              <p className="text-sm text-muted-foreground">
                Árbitro: {retiro.arbitro_full_name || retiro.arbitro_username}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-primary">{formatCop(parseFloat(retiro.monto))}</p>
          </div>
        </div>

        {/* Información bancaria */}
        {(retiro.numero_cuenta || retiro.tipo_cuenta || retiro.banco) && (
          <div className="space-y-1 text-sm">
            {retiro.numero_cuenta && (
              <p className="text-muted-foreground">
                <span className="font-medium">Cuenta:</span> {retiro.numero_cuenta}
              </p>
            )}
            {retiro.tipo_cuenta && (
              <p className="text-muted-foreground">
                <span className="font-medium">Tipo:</span> {retiro.tipo_cuenta}
              </p>
            )}
            {retiro.banco && (
              <p className="text-muted-foreground">
                <span className="font-medium">Banco:</span> {retiro.banco}
              </p>
            )}
          </div>
        )}

        {/* Motivo de rechazo */}
        {retiro.estado === "rechazado" && retiro.motivo_rechazo && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">Motivo de rechazo:</p>
            <p className="text-sm text-destructive">{retiro.motivo_rechazo}</p>
          </div>
        )}

        {/* Comentarios del admin */}
        {retiro.comentarios_admin && (
          <div className="p-3 rounded-md bg-muted">
            <p className="text-sm font-medium mb-1">Comentarios:</p>
            <p className="text-sm text-muted-foreground">{retiro.comentarios_admin}</p>
          </div>
        )}

        {/* Fechas */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
          <p>
            <span className="font-medium">Solicitado:</span>{" "}
            {new Date(retiro.created_at).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {retiro.fecha_procesamiento && (
            <p>
              <span className="font-medium">Procesado:</span>{" "}
              {new Date(retiro.fecha_procesamiento).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {retiro.procesado_por_username && (
            <p>
              <span className="font-medium">Por:</span> {retiro.procesado_por_username}
            </p>
          )}
        </div>

        {/* Botón de procesar (solo admin, solo pendientes) */}
        {isAdmin && retiro.estado === "pendiente" && onProcesar && (
          <div className="pt-2 border-t">
            <button
              onClick={() => onProcesar(retiro)}
              className="w-full text-sm font-medium text-primary hover:underline"
            >
              Procesar Retiro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
