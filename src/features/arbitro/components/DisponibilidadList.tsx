/**
 * Componente para listar disponibilidades de árbitro
 */

import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import type { DisponibilidadArbitro } from "../types/arbitro.types";
import type { DiaSemana, DisponibilidadCreateData } from "../types/arbitro.types";

/**
 * Formatea una hora a formato HH:MM (sin segundos)
 */
function formatHora(hora: string): string {
  // Si ya está en formato HH:MM, retornar tal cual
  if (hora && hora.length === 5 && hora.includes(":")) {
    return hora;
  }
  // Si viene con segundos (HH:MM:SS), tomar solo HH:MM
  if (hora && hora.includes(":")) {
    return hora.substring(0, 5);
  }
  return hora;
}

interface DisponibilidadListProps {
  /** Municipios del perfil del árbitro. Si se pasan, el formulario no pregunta por municipios. */
  municipiosPerfil?: { id: number }[];
  onRefresh?: () => void;
}

export function DisponibilidadList({ municipiosPerfil, onRefresh }: DisponibilidadListProps) {
  const {
    disponibilidades,
    isLoading,
    error,
    listarDisponibilidades,
    crearDisponibilidad,
    actualizarDisponibilidad,
    eliminarDisponibilidad,
    clearError,
  } = useDisponibilidad();

  // Cargar disponibilidades al montar
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    try {
      await listarDisponibilidades();
      onRefresh?.();
    } catch {
      // Error ya manejado por el hook
    }
  };

  const ordenDias: string[] = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  const municipiosIds = useMemo(
    () => (municipiosPerfil ? municipiosPerfil.map((m) => m.id) : undefined),
    [municipiosPerfil]
  );

  const diasConfig = useMemo(
    () => ({
      lunes: "Lunes",
      martes: "Martes",
      miercoles: "Miércoles",
      jueves: "Jueves",
      viernes: "Viernes",
      sabado: "Sábado",
      domingo: "Domingo",
    }),
    []
  );

  const diasConMultiples = useMemo(() => {
    const counters: Record<string, number> = {};
    disponibilidades.forEach((disp) => {
      counters[disp.dia_semana] = (counters[disp.dia_semana] || 0) + 1;
    });
    return Object.entries(counters)
      .filter(([, count]) => count > 1)
      .map(([dia]) => dia);
  }, [disponibilidades]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mi disponibilidad</h3>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Actualizar"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
          <Button variant="ghost" size="sm" onClick={clearError} className="ml-2 text-destructive">
            Cerrar
          </Button>
        </div>
      )}

      {isLoading && disponibilidades.length === 0 ? (
        <p className="text-sm text-muted-foreground">Cargando disponibilidades...</p>
      ) : (
        <DisponibilidadSemanal
          dias={ordenDias as DiaSemana[]}
          diasConfig={diasConfig}
          disponibilidades={disponibilidades}
          diasConMultiples={diasConMultiples}
          municipiosIds={municipiosIds}
          onGuardar={async (payload) => {
            for (const item of payload) {
              if (item.id) {
                await actualizarDisponibilidad(item.id, item.data);
              } else if (item.crear) {
                await crearDisponibilidad(item.data as DisponibilidadCreateData);
              }
            }
            handleRefresh();
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

type SemanaRow = {
  dia: DiaSemana;
  id?: number;
  activo: boolean;
  hora_inicio: string;
  hora_fin: string;
};

const DisponibilidadSemanal = memo(function DisponibilidadSemanal({
  dias,
  diasConfig,
  disponibilidades,
  diasConMultiples,
  municipiosIds,
  onGuardar,
  isLoading,
}: {
  dias: DiaSemana[];
  diasConfig: Record<DiaSemana, string>;
  disponibilidades: DisponibilidadArbitro[];
  diasConMultiples: string[];
  municipiosIds?: number[];
  onGuardar: (payload: { id?: number; crear?: boolean; data: DisponibilidadCreateData }[]) => void;
  isLoading: boolean;
}) {
  const rowsBase = useMemo(() => {
    return dias.map((dia) => {
      const disponiblesDia = disponibilidades.filter((d) => d.dia_semana === dia);
      const activo = disponiblesDia.find((d) => d.activo) ?? disponiblesDia[0];
      return {
        dia,
        id: activo?.id,
        activo: activo?.activo ?? false,
        hora_inicio: activo?.hora_inicio?.substring(0, 5) ?? "08:00",
        hora_fin: activo?.hora_fin?.substring(0, 5) ?? "18:00",
      };
    });
  }, [dias, disponibilidades]);

  const [rows, setRows] = useState<SemanaRow[]>(rowsBase);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setRows(rowsBase);
  }, [rowsBase]);

  const handleToggle = useCallback((dia: DiaSemana) => {
    setRows((prev) =>
      prev.map((row) => (row.dia === dia ? { ...row, activo: !row.activo } : row))
    );
  }, []);

  const handleHoraChange = useCallback(
    (dia: DiaSemana, campo: "hora_inicio" | "hora_fin", valor: string) => {
      setRows((prev) =>
        prev.map((row) => (row.dia === dia ? { ...row, [campo]: valor } : row))
      );
    },
    []
  );

  const handleGuardar = useCallback(async () => {
    setGuardando(true);
    try {
      const payload = rows.map((row) => {
        const data: DisponibilidadCreateData = {
          dia_semana: row.dia,
          hora_inicio: row.hora_inicio,
          hora_fin: row.hora_fin,
          activo: row.activo,
          municipios_ids: municipiosIds,
        };
        if (row.id) {
          return { id: row.id, data };
        }
        return { crear: row.activo, data };
      });
      await onGuardar(payload);
    } finally {
      setGuardando(false);
    }
  }, [onGuardar, rows]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
        Activa el día y define el rango horario.
      </div>
      {diasConMultiples.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Tienes múltiples horarios en:{" "}
          {diasConMultiples.map((dia) => diasConfig[dia as DiaSemana]).join(", ")}. Usa
          “Modo avanzado” si necesitas varios rangos por día.
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.dia}
            className={`rounded-md border px-3 py-2 ${
              row.activo
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-border bg-card/30"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{diasConfig[row.dia]}</span>
              <button
                type="button"
                role="switch"
                aria-checked={row.activo}
                onClick={() => handleToggle(row.dia)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  row.activo ? "bg-emerald-500" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    row.activo ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {row.activo && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Desde
                </span>
                <div className="min-w-[100px]">
                  <TimePicker24h
                    value={row.hora_inicio}
                    onChange={(valor) => handleHoraChange(row.dia, "hora_inicio", valor)}
                    className="gap-1"
                  />
                </div>
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Hasta
                </span>
                <div className="min-w-[100px]">
                  <TimePicker24h
                    value={row.hora_fin}
                    onChange={(valor) => handleHoraChange(row.dia, "hora_fin", valor)}
                    className="gap-1"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleGuardar} disabled={isLoading || guardando}>
          {guardando ? "Guardando..." : "Guardar disponibilidad"}
        </Button>
      </div>
    </div>
  );
});
