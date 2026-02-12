/**
 * Componente para listar disponibilidades de árbitro
 */

import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import type { DisponibilidadArbitro } from "../types/arbitro.types";
import type { DiaSemana, DisponibilidadCreateData } from "../types/arbitro.types";

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
  const normalizarHora = useCallback((valor: string) => {
    const hora = valor?.split(":")[0] ?? "00";
    return `${hora.padStart(2, "0")}:00`;
  }, []);

  const rowsBase = useMemo(() => {
    return dias.map((dia) => {
      const disponiblesDia = disponibilidades.filter((d) => d.dia_semana === dia);
      const activo = disponiblesDia.find((d) => d.activo) ?? disponiblesDia[0];
      return {
        dia,
        id: activo?.id,
        activo: activo?.activo ?? false,
        hora_inicio: normalizarHora(activo?.hora_inicio?.substring(0, 5) ?? "08:00"),
        hora_fin: normalizarHora(activo?.hora_fin?.substring(0, 5) ?? "18:00"),
      };
    });
  }, [dias, disponibilidades, normalizarHora]);

  const [rows, setRows] = useState<SemanaRow[]>(rowsBase);
  const [guardando, setGuardando] = useState(false);
  const [usarTodosDias, setUsarTodosDias] = useState(false);
  const [todosHorario, setTodosHorario] = useState({ hora_inicio: "08:00", hora_fin: "18:00" });

  useEffect(() => {
    setRows(rowsBase);
    const todosActivos = rowsBase.every((row) => row.activo);
    const mismoHorario =
      rowsBase.length > 0 &&
      rowsBase.every(
        (row) =>
          row.hora_inicio === rowsBase[0].hora_inicio &&
          row.hora_fin === rowsBase[0].hora_fin
      );
    if (todosActivos && mismoHorario) {
      setUsarTodosDias(true);
      setTodosHorario({
        hora_inicio: rowsBase[0].hora_inicio,
        hora_fin: rowsBase[0].hora_fin,
      });
    } else {
      setUsarTodosDias(false);
    }
  }, [rowsBase]);

  const handleToggle = useCallback((dia: DiaSemana) => {
    setRows((prev) =>
      prev.map((row) => (row.dia === dia ? { ...row, activo: !row.activo } : row))
    );
  }, []);

  const handleHoraChange = useCallback(
    (dia: DiaSemana, campo: "hora_inicio" | "hora_fin", valor: string) => {
      setRows((prev) =>
        prev.map((row) =>
          row.dia === dia ? { ...row, [campo]: normalizarHora(valor) } : row
        )
      );
    },
    [normalizarHora]
  );

  const handleToggleTodos = useCallback(() => {
    setUsarTodosDias((prev) => {
      const next = !prev;
      if (next) {
        setRows((current) =>
          current.map((row) => ({
            ...row,
            activo: true,
            hora_inicio: todosHorario.hora_inicio,
            hora_fin: todosHorario.hora_fin,
          }))
        );
      }
      return next;
    });
  }, [todosHorario.hora_fin, todosHorario.hora_inicio]);

  const handleTodosHorarioChange = useCallback(
    (campo: "hora_inicio" | "hora_fin", valor: string) => {
      const nuevoValor = normalizarHora(valor);
      setTodosHorario((prev) => ({ ...prev, [campo]: nuevoValor }));
      if (usarTodosDias) {
        setRows((current) =>
          current.map((row) => ({
            ...row,
            activo: true,
            [campo]: nuevoValor,
          }))
        );
      }
    },
    [normalizarHora, usarTodosDias]
  );

  const handleGuardar = useCallback(async () => {
    setGuardando(true);
    try {
      const payload = rows.map((row) => {
        const data: DisponibilidadCreateData = {
          dia_semana: row.dia,
          hora_inicio: normalizarHora(row.hora_inicio),
          hora_fin: normalizarHora(row.hora_fin),
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
      <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
        Activa el día y define el rango horario.
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Todos los días</p>
            <p className="text-xs text-muted-foreground">
              Aplica el mismo horario a lunes–domingo.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={usarTodosDias}
            onClick={handleToggleTodos}
            className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all ${
              usarTodosDias
                ? "bg-primary/90 border-primary/70 shadow-[0_0_0_1px_rgba(16,185,129,0.45)] dark:bg-primary/80"
                : "bg-muted/30 border-border/70 dark:bg-muted/50"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                usarTodosDias
                  ? "translate-x-6 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.28)]"
                  : "translate-x-1 bg-background shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
              }`}
            />
          </button>
        </div>
        {usarTodosDias && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Desde</span>
            <div className="min-w-[110px]">
              <TimePicker24h
                value={todosHorario.hora_inicio}
                onChange={(valor) => handleTodosHorarioChange("hora_inicio", valor)}
                soloHoras
              />
            </div>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Hasta</span>
            <div className="min-w-[110px]">
              <TimePicker24h
                value={todosHorario.hora_fin}
                onChange={(valor) => handleTodosHorarioChange("hora_fin", valor)}
                soloHoras
              />
            </div>
          </div>
        )}
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
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-border/70 bg-card/40"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{diasConfig[row.dia]}</span>
              <button
                type="button"
                role="switch"
                aria-checked={row.activo}
                onClick={() => handleToggle(row.dia)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-all ${
                  row.activo
                    ? "bg-emerald-500/90 border-emerald-500/70 shadow-[0_0_0_1px_rgba(16,185,129,0.45)] dark:bg-emerald-400/80"
                    : "bg-muted/30 border-border/70 dark:bg-muted/50"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                    row.activo
                      ? "translate-x-6 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.28)]"
                      : "translate-x-1 bg-background shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
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
                    soloHoras
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
                    soloHoras
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
