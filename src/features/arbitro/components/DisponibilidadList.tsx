/**
 * Componente para listar disponibilidades de árbitro
 */

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import { DisponibilidadForm } from "./DisponibilidadForm";
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [modoRapido, setModoRapido] = useState(true);

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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta disponibilidad?")) {
      return;
    }

    try {
      await eliminarDisponibilidad(id);
      onRefresh?.();
    } catch {
      // Error ya manejado por el hook
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    handleRefresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const disponibilidadEditando = editingId
    ? disponibilidades.find((d) => d.id === editingId)
    : undefined;

  // Agrupar por día de la semana
  const disponibilidadesPorDia = disponibilidades.reduce((acc, disp) => {
    const dia = disp.dia_semana;
    if (!acc[dia]) {
      acc[dia] = [];
    }
    acc[dia].push(disp);
    return acc;
  }, {} as Record<string, DisponibilidadArbitro[]>);

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

  if (showForm) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {disponibilidadEditando ? "Editar disponibilidad" : "Nueva disponibilidad"}
        </h3>
        <DisponibilidadForm
          disponibilidad={disponibilidadEditando}
          municipiosPerfil={municipiosPerfil}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mi disponibilidad</h3>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Actualizar"}
          </Button>
          <Button
            onClick={() => setModoRapido((prev) => !prev)}
            variant="outline"
            size="sm"
          >
            {modoRapido ? "Modo avanzado" : "Modo rápido"}
          </Button>
          {!modoRapido && (
            <Button onClick={() => setShowForm(true)} size="sm">
              + Agregar
            </Button>
          )}
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
      ) : modoRapido ? (
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
      ) : disponibilidades.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-2">No tienes disponibilidades configuradas</p>
          <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
            Crear primera disponibilidad
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {ordenDias.map((dia) => {
            const disponibilidadesDia = disponibilidadesPorDia[dia];
            if (!disponibilidadesDia || disponibilidadesDia.length === 0) return null;

            return (
              <div key={dia} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium capitalize">{dia}</h4>
                <div className="space-y-2">
                  {disponibilidadesDia.map((disp) => (
                    <div
                      key={disp.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        disp.activo ? "bg-card" : "bg-muted/50 opacity-60"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatHora(disp.hora_inicio)} - {formatHora(disp.hora_fin)}
                          </span>
                          {!disp.activo && (
                            <span className="text-xs text-muted-foreground">(Inactiva)</span>
                          )}
                        </div>
                        {disp.municipios.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Municipios: {disp.municipios.map((m) => m.nombre).join(", ")}
                          </p>
                        )}
                        {disp.municipios.length === 0 && (
                          <p className="text-xs text-muted-foreground mt-1">Todos los municipios</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(disp.id)}>
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(disp.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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

function DisponibilidadSemanal({
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
  const buildRows = () => {
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
  };

  const [rows, setRows] = useState<SemanaRow[]>(buildRows);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setRows(buildRows());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(disponibilidades)]);

  const handleToggle = (dia: DiaSemana) => {
    setRows((prev) =>
      prev.map((row) =>
        row.dia === dia ? { ...row, activo: !row.activo } : row
      )
    );
  };

  const handleHoraChange = (dia: DiaSemana, campo: "hora_inicio" | "hora_fin", valor: string) => {
    setRows((prev) => prev.map((row) => (row.dia === dia ? { ...row, [campo]: valor } : row)));
  };

  const handleGuardar = async () => {
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
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
        Configura tu disponibilidad semanal en un solo lugar. Marca el día como disponible y
        selecciona el rango de horas.
      </div>
      {diasConMultiples.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          Tienes múltiples horarios en:{" "}
          {diasConMultiples.map((dia) => diasConfig[dia as DiaSemana]).join(", ")}. Usa
          “Modo avanzado” si necesitas varios rangos por día.
        </div>
      )}
      <div className="grid gap-3">
        {rows.map((row) => (
          <div
            key={row.dia}
            className={`rounded-lg border p-4 ${
              row.activo ? "border-emerald-500/40 bg-emerald-500/5" : "border-border"
            }`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={row.activo}
                    onChange={() => handleToggle(row.dia)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  {diasConfig[row.dia]}
                </label>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="min-w-[140px]">
                  <TimePicker24h
                    value={row.hora_inicio}
                    onChange={(valor) => handleHoraChange(row.dia, "hora_inicio", valor)}
                    disabled={!row.activo}
                  />
                </div>
                <span className="text-sm text-muted-foreground">a</span>
                <div className="min-w-[140px]">
                  <TimePicker24h
                    value={row.hora_fin}
                    onChange={(valor) => handleHoraChange(row.dia, "hora_fin", valor)}
                    disabled={!row.activo}
                  />
                </div>
              </div>
            </div>
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
}
