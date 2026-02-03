/**
 * Componente para crear/editar disponibilidad de árbitro
 * Si se pasa municipiosPerfil, no se muestra selector de municipios y se usan esos (los del perfil).
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import { useMunicipios } from "../hooks/useMunicipios";
import type {
  DiaSemana,
  DisponibilidadArbitro,
  DisponibilidadCreateData,
} from "../types/arbitro.types";

interface DisponibilidadFormProps {
  disponibilidad?: DisponibilidadArbitro;
  /** Municipios del perfil del árbitro. Si se pasan, no se pregunta por municipios y se usan estos. */
  municipiosPerfil?: { id: number }[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DIAS_SEMANA: { value: DiaSemana; label: string }[] = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

export function DisponibilidadForm({
  disponibilidad,
  municipiosPerfil,
  onSuccess,
  onCancel,
}: DisponibilidadFormProps) {
  const { crearDisponibilidad, actualizarDisponibilidad, isLoading, error, clearError } =
    useDisponibilidad();
  const { municipios } = useMunicipios();

  const usarMunicipiosPerfil = municipiosPerfil !== undefined;

  const [diaSemana, setDiaSemana] = useState<DiaSemana>(disponibilidad?.dia_semana || "lunes");
  const [horaInicio, setHoraInicio] = useState(disponibilidad?.hora_inicio || "08:00");
  const [horaFin, setHoraFin] = useState(disponibilidad?.hora_fin || "18:00");
  const [municipiosSeleccionados, setMunicipiosSeleccionados] = useState<number[]>(() => {
    if (usarMunicipiosPerfil) {
      return (municipiosPerfil ?? []).map((m) => m.id);
    }
    return disponibilidad?.municipios.map((m) => m.id) || [];
  });
  const [activo, setActivo] = useState(disponibilidad?.activo ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (disponibilidad) {
      setDiaSemana(disponibilidad.dia_semana);
      setHoraInicio(disponibilidad.hora_inicio);
      setHoraFin(disponibilidad.hora_fin);
      if (!usarMunicipiosPerfil) {
        setMunicipiosSeleccionados(disponibilidad.municipios.map((m) => m.id));
      }
      setActivo(disponibilidad.activo);
    }
  }, [disponibilidad, usarMunicipiosPerfil]);

  // Sincronizar municipios del perfil cuando cambian (ej. usuario editó su perfil)
  useEffect(() => {
    if (usarMunicipiosPerfil) {
      setMunicipiosSeleccionados((municipiosPerfil ?? []).map((m) => m.id));
    }
  }, [usarMunicipiosPerfil, municipiosPerfil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validar que hora fin sea mayor que hora inicio
    if (horaFin <= horaInicio) {
      alert("La hora de fin debe ser mayor que la hora de inicio");
      return;
    }

    const idsMunicipios =
      usarMunicipiosPerfil && municipiosPerfil?.length
        ? municipiosPerfil.map((m) => m.id)
        : municipiosSeleccionados;

    setIsSubmitting(true);
    try {
      const data: DisponibilidadCreateData = {
        dia_semana: diaSemana,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        activo,
        municipios_ids: idsMunicipios.length > 0 ? idsMunicipios : undefined,
      };

      if (disponibilidad) {
        await actualizarDisponibilidad(disponibilidad.id, data);
      } else {
        await crearDisponibilidad(data);
      }

      // Limpiar formulario si es creación
      if (!disponibilidad) {
        setDiaSemana("lunes");
        setHoraInicio("08:00");
        setHoraFin("18:00");
        if (!usarMunicipiosPerfil) setMunicipiosSeleccionados([]);
        setActivo(true);
      }

      onSuccess?.();
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al guardar disponibilidad:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMunicipio = (municipioId: number) => {
    setMunicipiosSeleccionados((prev) =>
      prev.includes(municipioId) ? prev.filter((id) => id !== municipioId) : [...prev, municipioId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="dia-semana" className="text-sm font-medium text-foreground block mb-2">
          Día de la semana *
        </label>
        <Select
          id="dia-semana"
          value={diaSemana}
          onChange={(e) => setDiaSemana(e.target.value as DiaSemana)}
          required
        >
          {DIAS_SEMANA.map((dia) => (
            <option key={dia.value} value={dia.value}>
              {dia.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="hora-inicio" className="text-sm font-medium text-foreground block mb-2">
            Hora de inicio (24 horas) *
          </label>
          <TimePicker24h
            id="hora-inicio"
            name="hora-inicio"
            value={horaInicio}
            onChange={setHoraInicio}
            required
          />
        </div>

        <div>
          <label htmlFor="hora-fin" className="text-sm font-medium text-foreground block mb-2">
            Hora de fin (24 horas) *
          </label>
          <TimePicker24h
            id="hora-fin"
            name="hora-fin"
            value={horaFin}
            onChange={setHoraFin}
            required
          />
        </div>
      </div>

      {!usarMunicipiosPerfil && (
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Municipios específicos (opcional)
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Si no seleccionas ninguno, aplicará a todos tus municipios
          </p>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
            {municipios.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cargando municipios...</p>
            ) : (
              municipios.map((municipio) => (
                <label
                  key={municipio.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={municipiosSeleccionados.includes(municipio.id)}
                    onChange={() => toggleMunicipio(municipio.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">
                    {municipio.nombre}
                    {municipio.departamento && `, ${municipio.departamento}`}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
      {usarMunicipiosPerfil && (
        <p className="text-sm text-muted-foreground">
          Esta disponibilidad aplicará a los mismos municipios configurados en tu perfil.
        </p>
      )}

      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium text-foreground">Disponibilidad activa</span>
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">
          {isSubmitting || isLoading
            ? "Guardando..."
            : disponibilidad
            ? "Actualizar"
            : "Crear disponibilidad"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
