/**
 * Componente de filtros para la lista de árbitros
 */

import { Select } from "@/components/ui/select";
import { FormField } from "@/components/forms";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Municipio, Categoria } from "@/features/arbitro/types/arbitro.types";

export interface FiltrosArbitrosType {
  municipio?: number;
  categoria?: number;
  search?: string;
  ordering?: string;
  fecha?: string;
  hora?: string;
}

interface FiltrosArbitrosProps {
  municipios: Municipio[];
  categorias: Categoria[];
  filtros: FiltrosArbitrosType;
  onFiltrosChange: (filtros: FiltrosArbitrosType) => void;
  isLoading?: boolean;
}

export function FiltrosArbitros({
  municipios,
  categorias,
  filtros,
  onFiltrosChange,
  isLoading = false,
}: FiltrosArbitrosProps) {
  const handleChange = (key: string, value: string | number | undefined) => {
    onFiltrosChange({
      ...filtros,
      [key]: value === "" || value === undefined ? undefined : value,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({
      municipio: undefined,
      categoria: undefined,
      search: undefined,
      ordering: undefined,
      fecha: undefined,
      hora: undefined,
    });
  };

  const tieneFiltros = Object.values(filtros).some((v) => v !== undefined && v !== "");

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {tieneFiltros && (
          <Button variant="outline" size="sm" onClick={limpiarFiltros} disabled={isLoading}>
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Búsqueda */}
        <div className="sm:col-span-2 lg:col-span-3">
          <FormField
            label="Buscar"
            name="search"
            type="text"
            value={filtros.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Buscar por nombre, email..."
            disabled={isLoading}
          />
        </div>

        {/* Municipio */}
        <div className="space-y-2">
          <label htmlFor="filtro-municipio" className="text-sm font-medium text-foreground block">
            Municipio
          </label>
          <Select
            id="filtro-municipio"
            value={filtros.municipio?.toString() || ""}
            onChange={(e) =>
              handleChange("municipio", e.target.value ? parseInt(e.target.value) : undefined)
            }
            disabled={isLoading}
          >
            <option value="">Todos los municipios</option>
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
                {municipio.departamento && `, ${municipio.departamento}`}
              </option>
            ))}
          </Select>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label htmlFor="filtro-categoria" className="text-sm font-medium text-foreground block">
            Categoría
          </label>
          <Select
            id="filtro-categoria"
            value={filtros.categoria?.toString() || ""}
            onChange={(e) =>
              handleChange("categoria", e.target.value ? parseInt(e.target.value) : undefined)
            }
            disabled={isLoading}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Ordenamiento */}
        <div className="space-y-2">
          <label htmlFor="filtro-ordering" className="text-sm font-medium text-foreground block">
            Ordenar por
          </label>
          <Select
            id="filtro-ordering"
            value={filtros.ordering || "-created_at"}
            onChange={(e) => handleChange("ordering", e.target.value)}
            disabled={isLoading}
          >
            <option value="-created_at">Más recientes</option>
            <option value="created_at">Más antiguos</option>
            <option value="experiencia_anos">Experiencia: menor a mayor</option>
            <option value="-experiencia_anos">Experiencia: mayor a menor</option>
          </Select>
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label htmlFor="filtro-fecha" className="text-sm font-medium text-foreground block">
            Fecha disponible
          </label>
          <Input
            id="filtro-fecha"
            type="date"
            value={filtros.fecha || ""}
            onChange={(e) => handleChange("fecha", e.target.value || undefined)}
            disabled={isLoading}
            min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
          />
          <p className="text-xs text-muted-foreground">Filtra árbitros disponibles en esta fecha</p>
        </div>

        {/* Hora */}
        <div className="space-y-2">
          <label htmlFor="filtro-hora" className="text-sm font-medium text-foreground block">
            Hora disponible (24 horas)
          </label>
          <TimePicker24h
            id="filtro-hora"
            name="filtro-hora"
            value={filtros.hora || ""}
            onChange={(value) => handleChange("hora", value || undefined)}
            disabled={isLoading || !filtros.fecha}
          />
          <p className="text-xs text-muted-foreground">
            {filtros.fecha
              ? "Filtra árbitros disponibles a esta hora"
              : "Selecciona una fecha primero"}
          </p>
        </div>
      </div>
    </div>
  );
}

