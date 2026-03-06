/**
 * Grid de cards para seleccionar el tipo de partido.
 * Cards estandarizadas: misma altura, misma estructura y legibilidad.
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCop } from "@/lib/utils";
import { Check } from "lucide-react";
import type { TipoPartido } from "../types/partido.types";

interface TipoPartidoCardGridProps {
  tipos: TipoPartido[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  /** 'default' para formulario normal, 'modal' para fondo oscuro del modal */
  variant?: "default" | "modal";
  loading?: boolean;
  error?: string | null;
}

export function TipoPartidoCardGrid({
  tipos,
  selectedId,
  onSelect,
  disabled = false,
  variant = "default",
  loading = false,
  error = null,
}: TipoPartidoCardGridProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando opciones...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (tipos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay tipos de partido disponibles. Contacta al administrador.
      </p>
    );
  }

  // Usar siempre tokens semánticos que se adaptan al tema
  const textPrimary = "text-foreground";
  const textSecondary = "text-muted-foreground";
  const textMuted = "text-muted-foreground";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-variant={variant}>
      {tipos.map((tipo) => {
        const isSelected = selectedId === String(tipo.id);
        const duracion = tipo.duracion_referencial?.trim() || "—";

        return (
          <Card
            key={tipo.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={() => !disabled && onSelect(String(tipo.id))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!disabled) onSelect(String(tipo.id));
              }
            }}
            className={cn(
              "flex min-h-40 cursor-pointer flex-col transition-all duration-200",
              "border-border bg-card hover:border-primary/50",
              isSelected && "ring-2 ring-primary border-primary bg-primary/10",
              disabled && "pointer-events-none opacity-60",
            )}
          >
            <CardContent className="flex flex-1 flex-col p-4">
              {/* Cabecera: título + check */}
              <div className="flex items-start justify-between gap-3">
                <h3
                  className={cn(
                    "line-clamp-2 min-h-10 flex-1 text-sm font-semibold leading-snug",
                    textPrimary,
                  )}
                >
                  {tipo.nombre}
                </h3>
                {isSelected && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                )}
              </div>

              {/* Duración: siempre una línea con etiqueta */}
              <div className="mt-3 flex flex-col gap-0.5">
                <span className={cn("text-xs font-medium uppercase tracking-wide", textMuted)}>
                  Duración
                </span>
                <span className={cn("text-sm", textSecondary)}>{duracion}</span>
              </div>

              {/* Valor a pagar: siempre al final, destacado */}
              <div className="mt-auto pt-4">
                <span className={cn("text-xs font-medium uppercase tracking-wide", textMuted)}>
                  Valor a pagar
                </span>
                <p className={cn("mt-0.5 text-xl font-bold tabular-nums", "text-primary")}>
                  {formatCop(tipo.monto_total)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
