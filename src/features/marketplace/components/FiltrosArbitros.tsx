/**
 * Componente de filtros para la lista de árbitros
 * Diseño moderno con iconos y mejor UX
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Search, MapPin, Trophy, ArrowUpDown, Calendar, Clock, X, Filter } from "lucide-react";
import type { Municipio, Categoria } from "@/features/arbitro/types/arbitro.types";
import { cn } from "@/lib/utils";

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
  // Estado del calendario
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Actualizar posición del calendario
  const updateCalendarPosition = useCallback(() => {
    if (dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      setCalendarPos({
        top: rect.bottom + 8,
        left: Math.min(rect.left, window.innerWidth - 340),
      });
    }
  }, []);

  // Abrir calendario
  const openCalendar = useCallback(() => {
    updateCalendarPosition();
    setShowCalendar(true);
  }, [updateCalendarPosition]);

  // Cerrar calendario
  const closeCalendar = useCallback(() => {
    setShowCalendar(false);
  }, []);

  // Actualizar posición en scroll/resize
  useEffect(() => {
    if (!showCalendar) return;

    const handleUpdate = () => updateCalendarPosition();

    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [showCalendar, updateCalendarPosition]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!showCalendar) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        calendarRef.current &&
        !calendarRef.current.contains(target) &&
        dateButtonRef.current &&
        !dateButtonRef.current.contains(target)
      ) {
        closeCalendar();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar, closeCalendar]);

  // Cerrar con Escape
  useEffect(() => {
    if (!showCalendar) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCalendar();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showCalendar, closeCalendar]);

  // Handlers
  const handleChange = (key: string, value: string | number | undefined) => {
    onFiltrosChange({
      ...filtros,
      [key]: value === "" || value === undefined ? undefined : value,
    });
  };

  const limpiarFiltros = () => {
    onFiltrosChange({ ordering: "-created_at" });
  };

  const tieneFiltros =
    filtros.municipio ||
    filtros.categoria ||
    filtros.search ||
    filtros.fecha ||
    filtros.hora ||
    (filtros.ordering && filtros.ordering !== "-created_at");

  const formatDateDisplay = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const selectBaseClass = cn("field-select pl-11");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Filtros de búsqueda</h3>
        </div>
        {tieneFiltros && (
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarFiltros}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={filtros.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Buscar árbitro por nombre..."
          disabled={isLoading}
          className={cn(
            "field-base h-14 pl-12 text-base",
            "transition-all duration-200"
          )}
        />
      </div>

      {/* Grid de filtros */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Municipio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ubicación
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              value={filtros.municipio?.toString() || ""}
              onChange={(e) =>
                handleChange("municipio", e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={isLoading}
              className={selectBaseClass}
            >
              <option value="">Todos los municipios</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                  {municipio.departamento && ` - ${municipio.departamento}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Categoría
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Trophy className="w-4 h-4" />
            </div>
            <select
              value={filtros.categoria?.toString() || ""}
              onChange={(e) =>
                handleChange("categoria", e.target.value ? parseInt(e.target.value) : undefined)
              }
              disabled={isLoading}
              className={selectBaseClass}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ordenamiento */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Ordenar por
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={filtros.ordering || "-created_at"}
              onChange={(e) => handleChange("ordering", e.target.value)}
              disabled={isLoading}
              className={selectBaseClass}
            >
              <option value="-created_at">Más recientes</option>
              <option value="created_at">Más antiguos</option>
              <option value="-experiencia_anos">Mayor experiencia</option>
              <option value="experiencia_anos">Menor experiencia</option>
            </select>
          </div>
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha disponible
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <button
              ref={dateButtonRef}
              type="button"
              onClick={() => (showCalendar ? closeCalendar() : openCalendar())}
              disabled={isLoading}
              className={cn(
                "field-select pl-11 text-left transition-all duration-200",
                showCalendar && "ring-2 ring-primary/50 border-primary",
                !filtros.fecha && "text-muted-foreground"
              )}
            >
              {filtros.fecha ? formatDateDisplay(filtros.fecha) : "Seleccionar fecha"}
            </button>

            {/* Calendario como Portal */}
            {showCalendar &&
              createPortal(
                <div
                  ref={calendarRef}
                  className="fixed shadow-2xl"
                  style={{
                    top: calendarPos.top,
                    left: calendarPos.left,
                    zIndex: 9999,
                  }}
                >
                  <CalendarPicker
                    selectedDate={filtros.fecha}
                    onSelect={(date) => handleChange("fecha", date || undefined)}
                    onClose={closeCalendar}
                  />
                </div>,
                document.body
              )}
          </div>
        </div>

        {/* Hora */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hora disponible
          </label>
          <TimePicker
            value={filtros.hora || ""}
            onChange={(value) => handleChange("hora", value || undefined)}
            disabled={isLoading || !filtros.fecha}
          />
          {!filtros.fecha && (
            <p className="text-xs text-muted-foreground/70">Selecciona una fecha primero</p>
          )}
        </div>
      </div>

      {/* Resumen de filtros activos */}
      {tieneFiltros && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filtros.search && (
            <FilterBadge
              icon={<Search className="w-3 h-3" />}
              label={`"${filtros.search}"`}
              onRemove={() => handleChange("search", undefined)}
            />
          )}
          {filtros.municipio && (
            <FilterBadge
              icon={<MapPin className="w-3 h-3" />}
              label={municipios.find((m) => m.id === filtros.municipio)?.nombre || ""}
              onRemove={() => handleChange("municipio", undefined)}
            />
          )}
          {filtros.categoria && (
            <FilterBadge
              icon={<Trophy className="w-3 h-3" />}
              label={categorias.find((c) => c.id === filtros.categoria)?.nombre || ""}
              onRemove={() => handleChange("categoria", undefined)}
            />
          )}
          {filtros.fecha && (
            <FilterBadge
              icon={<Calendar className="w-3 h-3" />}
              label={formatDateDisplay(filtros.fecha)}
              onRemove={() => {
                handleChange("fecha", undefined);
                handleChange("hora", undefined);
              }}
            />
          )}
          {filtros.hora && (
            <FilterBadge
              icon={<Clock className="w-3 h-3" />}
              label={filtros.hora}
              onRemove={() => handleChange("hora", undefined)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para los badges de filtros
interface FilterBadgeProps {
  icon: React.ReactNode;
  label: string;
  onRemove: () => void;
}

function FilterBadge({ icon, label, onRemove }: FilterBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
      {icon}
      {label}
      <button type="button" onClick={onRemove} className="ml-1 hover:text-primary/70">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
