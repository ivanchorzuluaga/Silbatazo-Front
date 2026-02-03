/**
 * Formulario para crear/editar categoría
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms";
import type {
  Categoria,
  CategoriaCreateData,
  CategoriaUpdateData,
} from "@/features/arbitro/types/arbitro.types";

interface CategoriaFormProps {
  categoria?: Categoria;
  onSubmit: (data: CategoriaCreateData | CategoriaUpdateData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CategoriaForm({ categoria, onSubmit, onCancel, isLoading }: CategoriaFormProps) {
  const [nombre, setNombre] = useState(categoria?.nombre || "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion || "");
  const [nivel, setNivel] = useState(categoria?.nivel || "");
  const [activo, setActivo] = useState(categoria?.activo ?? true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion || "");
      setNivel(categoria.nivel || "");
      setActivo(categoria.activo);
    }
  }, [categoria]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
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
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      nivel: nivel.trim() || undefined,
      activo,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al guardar categoría:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Nombre *"
        name="nombre"
        type="text"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          if (fieldErrors.nombre) {
            setFieldErrors((prev) => {
              const { nombre: _, ...rest } = prev;
              return rest;
            });
          }
        }}
        error={fieldErrors.nombre}
        disabled={isLoading}
        required
      />

      <FormField
        label="Descripción"
        name="descripcion"
        multiline
        rows={3}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
      />

      <FormField
        label="Nivel"
        name="nivel"
        type="text"
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
        placeholder="Ej: Profesional, Amateur, Juvenil"
        disabled={isLoading}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="activo"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          disabled={isLoading}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="activo" className="text-sm font-medium">
          Activa
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Guardando..." : categoria ? "Actualizar" : "Crear"}
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
