/**
 * Formulario para crear/editar tipo de partido (admin)
 */

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms";
import type {
  TipoPartidoAdmin,
  TipoPartidoCreateData,
  TipoPartidoUpdateData,
} from "@/features/partidos/types/partido.types";
import { formatCop } from "@/lib/utils";

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
  const [servicioArbitro, setServicioArbitro] = useState(tipo?.servicio_arbitro?.toString() ?? "");
  const [comisionApp, setComisionApp] = useState(tipo?.comision_app?.toString() ?? "");
  const [activo, setActivo] = useState(tipo?.activo ?? true);
  const [orden, setOrden] = useState(tipo?.orden?.toString() ?? "0");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const duracionMin = useMemo(
    () => Math.max(1, parseInt(duracionServicioMin || "0", 10) || 0),
    [duracionServicioMin]
  );
  const servicioArbitroNum = useMemo(
    () => parseInt(servicioArbitro || "0", 10) || 0,
    [servicioArbitro]
  );
  const comisionAppNum = useMemo(() => parseInt(comisionApp || "0", 10) || 0, [comisionApp]);
  const montoTotalNum = useMemo(
    () => Math.max(servicioArbitroNum + comisionAppNum, 0),
    [servicioArbitroNum, comisionAppNum]
  );
  const costoHora = useMemo(
    () => (duracionMin > 0 ? Math.round((montoTotalNum / duracionMin) * 60) : 0),
    [duracionMin, montoTotalNum]
  );

  useEffect(() => {
    if (tipo) {
      setSlug(tipo.slug);
      setNombre(tipo.nombre);
      setDuracionReferencial(tipo.duracion_referencial || "");
      setDuracionServicioMin(tipo.duracion_servicio_minutos?.toString() ?? "90");
      setServicioArbitro(tipo.servicio_arbitro?.toString() ?? "");
      setComisionApp(tipo.comision_app?.toString() ?? "");
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
    const servicioArbitroNum = parseInt(servicioArbitro, 10);
    if (servicioArbitro === "" || isNaN(servicioArbitroNum) || servicioArbitroNum < 0) {
      errors.servicio_arbitro = "El valor del servicio árbitro debe ser un número mayor o igual a 0";
    }
    const comisionAppNum = parseInt(comisionApp, 10);
    if (comisionApp === "" || isNaN(comisionAppNum) || comisionAppNum < 0) {
      errors.comision_app = "La comisión app debe ser un número mayor o igual a 0";
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
      servicio_arbitro: parseInt(servicioArbitro, 10),
      comision_app: parseInt(comisionApp, 10),
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface p-4 space-y-4">
          <div className="space-y-1">
            <div>
              <h3 className="text-sm font-semibold">Información principal</h3>
              <p className="text-xs text-muted-foreground">
                Esto es lo que verán los clientes al crear un partido.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
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
            </div>

            <FormField
              label="Duración referencial"
              name="duracion_referencial"
              type="text"
              value={duracionReferencial}
              onChange={(e) => setDuracionReferencial(e.target.value)}
              disabled={isLoading}
              placeholder="Ej: 40–45 min x tiempo"
            />
          </div>

          <div className="space-y-1 border-t border-border/60 pt-4">
            <div>
              <h3 className="text-sm font-semibold">Valores y duración</h3>
              <p className="text-xs text-muted-foreground">
                La duración define la brecha entre partidos del mismo árbitro.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
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
                helperText="Incluye brecha de 30 min"
              />

              <FormField
                label="Valor del servicio árbitro (COP) *"
                name="servicio_arbitro"
                type="number"
                min={0}
                value={servicioArbitro}
                onChange={(e) => {
                  setServicioArbitro(e.target.value);
                  if (fieldErrors.servicio_arbitro) {
                    setFieldErrors((prev) => {
                      const { servicio_arbitro: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                error={fieldErrors.servicio_arbitro}
                disabled={isLoading}
                required
              />

              <FormField
                label="Comisión app (COP) *"
                name="comision_app"
                type="number"
                min={0}
                value={comisionApp}
                onChange={(e) => {
                  setComisionApp(e.target.value);
                  if (fieldErrors.comision_app) {
                    setFieldErrors((prev) => {
                      const { comision_app: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                error={fieldErrors.comision_app}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-1 border-t border-border/60 pt-4">
            <div>
              <h3 className="text-sm font-semibold">Visibilidad y orden</h3>
              <p className="text-xs text-muted-foreground">
                Controla el orden y si estará disponible para los clientes.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
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

              <div className="flex items-center gap-2 self-end">
                <input
                  type="checkbox"
                  id="activo"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-border bg-background"
                />
                <label htmlFor="activo" className="text-sm font-medium">
                  Activo (visible en el selector)
                </label>
              </div>
            </div>
          </div>
        </div>

        <aside className="card-surface p-4 h-fit lg:sticky lg:top-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Vista previa</h4>
            <span className="text-[11px] text-muted-foreground">Cliente</span>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Tipo</p>
              <p className="text-base font-semibold">{nombre || "Nombre del tipo"}</p>
            </div>
            {duracionReferencial && (
              <p className="text-sm text-muted-foreground">{duracionReferencial}</p>
            )}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1">
                {duracionMin || 90} min
              </span>
              <span className="rounded-full bg-muted/60 text-muted-foreground px-2.5 py-1">
                +30 min brecha
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor a pagar</p>
              <p className="text-lg font-semibold text-primary">
                {formatCop(montoTotalNum || 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                Valor del servicio árbitro: {formatCop(servicioArbitroNum || 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                Comisión app: {formatCop(comisionAppNum || 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCop(costoHora)} aprox / hora
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 ${
                  activo
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                }`}
              >
                {activo ? "Activo" : "Inactivo"}
              </span>
              <span className="rounded-full bg-muted/60 text-muted-foreground px-2.5 py-1">
                Orden {orden || 0}
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex gap-3 pt-2 sticky bottom-0 bg-card/95 backdrop-blur border-t border-border/60 py-3 px-1">
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
