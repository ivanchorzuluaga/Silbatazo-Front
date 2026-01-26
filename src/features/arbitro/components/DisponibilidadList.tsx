/**
 * Componente para listar disponibilidades de árbitro
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import { DisponibilidadForm } from "./DisponibilidadForm";
import type { DisponibilidadArbitro } from "../types/arbitro.types";

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
  onRefresh?: () => void;
}

export function DisponibilidadList({ onRefresh }: DisponibilidadListProps) {
  const {
    disponibilidades,
    isLoading,
    error,
    listarDisponibilidades,
    eliminarDisponibilidad,
    clearError,
  } = useDisponibilidad();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  if (showForm) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {disponibilidadEditando ? "Editar disponibilidad" : "Nueva disponibilidad"}
        </h3>
        <DisponibilidadForm
          disponibilidad={disponibilidadEditando}
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
          <Button onClick={() => setShowForm(true)} size="sm">
            + Agregar
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
