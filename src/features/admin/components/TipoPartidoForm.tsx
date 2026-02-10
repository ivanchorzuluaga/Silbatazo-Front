/**
 * Formulario para crear/editar tipo de partido (admin)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms";
import type {
  TipoPartidoAdmin,
  TipoPartidoCreateData,
  TipoPartidoUpdateData,
} from "@/features/partidos/types/partido.types";

interface TipoPartidoFormProps {
  tipo?: TipoPartidoAdmin;
  onSubmit: (data: TipoPartidoCreateData | TipoPartidoUpdateData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

/** Genera un slug a partir del nombre (minúsculas, espacios y acentos a _) */
function nombreToSlug(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") || ""
  );
}

export function TipoPartidoForm({ tipo, onSubmit, onCancel, isLoading }: TipoPartidoFormProps) {
  const [slug, setSlug] = useState(tipo?.slug || "");
  const [nombre, setNombre] = useState(tipo?.nombre || "");
  const [duracionReferencial, setDuracionReferencial] = useState(tipo?.duracion_referencial || "");
  const [duracionServicioMin, setDuracionServicioMin] = useState(
    tipo?.duracion_servicio_minutos?.toString() ?? "90"
  );
  const [monto, setMonto] = useState(tipo?.monto?.toString() ?? "");
  const [activo, setActivo] = useState(tipo?.activo ?? true);
  const [orden, setOrden] = useState(tipo?.orden?.toString() ?? "0");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tipo) {
      setSlug(tipo.slug);
      setNombre(tipo.nombre);
      setDuracionReferencial(tipo.duracion_referencial || "");
      setDuracionServicioMin(tipo.duracion_servicio_minutos?.toString() ?? "90");
      setMonto(tipo.monto?.toString() ?? "");
      setActivo(tipo.activo);
      setOrden(tipo.orden?.toString() ?? "0");
    }
  }, [tipo]);

  const handleNombreChange = (value: string) => {
    setNombre(value);
    if (!tipo) {
      setSlug(nombreToSlug(value));
    }
    if (fieldErrors.nombre) {
      setFieldErrors((prev) => {
        const { nombre: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!slug.trim()) {
      errors.slug = "El slug es requerido";
    }
    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }
    const montoNum = parseInt(monto, 10);
    if (monto === "" || isNaN(montoNum) || montoNum < 0) {
      errors.monto = "El monto debe ser un número mayor o igual a 0";
    }
    const ordenNum = parseInt(orden, 10);
    if (orden !== "" && (isNaN(ordenNum) || ordenNum < 0)) {
      errors.orden = "El orden debe ser un número mayor o igual a 0";
    }
    const duracionMinNum = parseInt(duracionServicioMin, 10);
    if (duracionServicioMin === "" || isNaN(duracionMinNum) || duracionMinNum < 1) {
      errors.duracion_servicio_minutos = "La duración del servicio debe ser al menos 1 minuto";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      slug: slug.trim(),
      nombre: nombre.trim(),
      duracion_referencial: duracionReferencial.trim() || undefined,
      duracion_servicio_minutos: parseInt(duracionServicioMin, 10) || 90,
      monto: parseInt(monto, 10),
      activo,
      orden: parseInt(orden, 10) || 0,
    };

    try {
      await onSubmit(data);
    } catch {
      // El error ya está manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Nombre *"
        name="nombre"
        type="text"
        value={nombre}
        onChange={(e) => handleNombreChange(e.target.value)}
        error={fieldErrors.nombre}
        disabled={isLoading}
        required
        placeholder="Ej: Fútbol 11 – Central"
      />

      <FormField
        label="Slug *"
        name="slug"
        type="text"
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value);
          if (fieldErrors.slug) {
            setFieldErrors((prev) => {
              const { slug: _, ...rest } = prev;
              return rest;
            });
          }
        }}
        error={fieldErrors.slug}
        disabled={isLoading}
        required
        placeholder="Ej: futbol_11_central"
      />

      <FormField
        label="Duración referencial"
        name="duracion_referencial"
        type="text"
        value={duracionReferencial}
        onChange={(e) => setDuracionReferencial(e.target.value)}
        disabled={isLoading}
        placeholder="Ej: 40–45 min x tiempo"
      />

      <FormField
        label="Duración del servicio (minutos) *"
        name="duracion_servicio_minutos"
        type="number"
        min={1}
        value={duracionServicioMin}
        onChange={(e) => {
          setDuracionServicioMin(e.target.value);
          if (fieldErrors.duracion_servicio_minutos) {
            setFieldErrors((prev) => {
              const { duracion_servicio_minutos: _, ...rest } = prev;
              return rest;
            });
          }
        }}
        error={fieldErrors.duracion_servicio_minutos}
        disabled={isLoading}
        required
        helperText="Usado para la brecha de 30 min entre partidos del mismo árbitro (ej: 90, 120)"
      />

      <FormField
        label="Monto (COP) *"
        name="monto"
        type="number"
        min={0}
        value={monto}
        onChange={(e) => {
          setMonto(e.target.value);
          if (fieldErrors.monto) {
            setFieldErrors((prev) => {
              const { monto: _, ...rest } = prev;
              return rest;
            });
          }
        }}
        error={fieldErrors.monto}
        disabled={isLoading}
        required
      />

      <FormField
        label="Orden"
        name="orden"
        type="number"
        min={0}
        value={orden}
        onChange={(e) => {
          setOrden(e.target.value);
          if (fieldErrors.orden) {
            setFieldErrors((prev) => {
              const { orden: _, ...rest } = prev;
              return rest;
            });
          }
        }}
        error={fieldErrors.orden}
        disabled={isLoading}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          disabled={isLoading}
          className="h-4 w-4 rounded border-border bg-background"
        />
        <label htmlFor="activo" className="text-sm font-medium">
          Activo (visible en el selector de creación de partidos)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Guardando..." : tipo ? "Actualizar" : "Crear"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
