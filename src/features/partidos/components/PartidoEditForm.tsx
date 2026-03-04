/**
 * Formulario para editar un partido (solo cliente)
 */

import { useState, useEffect } from "react";
import { FormField, DateField } from "@/components/forms";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { usePartido } from "../hooks/usePartido";
import { getTodayLocalDate, compareDates, normalizeDateForInput } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { PartidoDetail, PartidoUpdateData } from "../types/partido.types";

interface PartidoEditFormProps {
  partido: PartidoDetail;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PartidoEditForm({ partido, open, onClose, onSuccess }: PartidoEditFormProps) {
  const { actualizarPartido, isLoading, error, clearError } = usePartido();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Estados del formulario
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [barrio, setBarrio] = useState("");
  const [ubicacionMapsUrl, setUbicacionMapsUrl] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notasCliente, setNotasCliente] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  // Inicializar valores cuando se abre el modal o cambia el partido
  useEffect(() => {
    if (open && partido) {
      // Normalizar la fecha para asegurar formato YYYY-MM-DD sin problemas de zona horaria
      const fechaNormalizada = normalizeDateForInput(partido.fecha_str || partido.fecha);
      setFecha(fechaNormalizada);
      setHora(partido.hora_str || partido.hora || "");
      setLugar(partido.cancha_nombre || partido.lugar || "");
      setBarrio(partido.barrio || "");
      setUbicacionMapsUrl(partido.ubicacion_maps_url || "");
      setDireccion(partido.direccion || "");
      setNotasCliente(partido.notas_cliente || "");
      setFieldErrors({});
      setShowSuccess(false);
      clearError();
    }
  }, [open, partido?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    // Validaciones básicas
    const errors: Record<string, string> = {};
    if (!fecha) errors.fecha = "La fecha es requerida";
    if (!hora) errors.hora = "La hora es requerida";
    if (!lugar.trim()) errors.lugar = "El nombre de la cancha es requerido";
    if (!barrio.trim()) errors.barrio = "El barrio es requerido";
    if (!direccion.trim()) errors.direccion = "La dirección es requerida";

    // Validar fecha futura (comparar strings YYYY-MM-DD para evitar problemas de zona horaria)
    if (fecha) {
      const hoy = getTodayLocalDate();
      if (compareDates(fecha, hoy) < 0) {
        errors.fecha = "La fecha debe ser futura";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const data: PartidoUpdateData = {
        fecha,
        hora: hora.length === 5 ? hora : hora.substring(0, 5), // Asegurar formato HH:MM
        lugar: lugar.trim(),
        cancha_nombre: lugar.trim(),
        barrio: barrio.trim(),
        ubicacion_maps_url: ubicacionMapsUrl.trim() || undefined,
        direccion: direccion.trim() || undefined,
        notas_cliente: notasCliente.trim() || undefined,
      };

      await actualizarPartido(partido.id, data);
      setShowSuccess(true);

      // Cerrar después de 2 segundos y llamar onSuccess
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al actualizar partido:", err);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowSuccess(false);
      setFieldErrors({});
      clearError();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? `Editar Partido #${partido.id}` : "Editar partido"}
            {partido.codigo && (
              <span className="text-sm font-mono text-muted-foreground block mt-1">
                {isAdmin ? "Código" : "Referencia"}: {partido.codigo}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Actualiza la información del partido. Solo puedes editar partidos que están buscando
            árbitro o pendientes.
            {partido.estado && ` Estado actual: ${partido.estado_display || partido.estado}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {showSuccess && (
            <Alert variant="success">
              <AlertTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ¡Partido actualizado exitosamente!
              </AlertTitle>
            </Alert>
          )}

          {error && !showSuccess && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Fecha y Hora */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField
              label="Fecha del Partido"
              name="fecha"
              value={fecha}
              onChange={(value) => {
                setFecha(value);
                if (fieldErrors.fecha) {
                  setFieldErrors((prev) => ({ ...prev, fecha: undefined }));
                }
              }}
              error={fieldErrors.fecha}
              disabled={isLoading || showSuccess}
              required
            />

            <div className="space-y-2">
              <label htmlFor="hora" className="text-sm font-medium">
                Hora del Partido (24 horas) <span className="text-destructive">*</span>
              </label>
              <TimePicker24h
                id="hora"
                name="hora"
                value={hora}
                onChange={(value) => {
                  setHora(value);
                  if (fieldErrors.hora) {
                    setFieldErrors((prev) => ({ ...prev, hora: undefined }));
                  }
                }}
                error={fieldErrors.hora}
                disabled={isLoading || showSuccess}
                required
              />
            </div>
          </div>

          {/* Cancha, barrio y dirección */}
          <FormField
            label="Nombre de la cancha"
            name="lugar"
            value={lugar}
            onChange={(e) => {
              setLugar(e.target.value);
              if (fieldErrors.lugar) {
                setFieldErrors((prev) => ({ ...prev, lugar: undefined }));
              }
            }}
            error={fieldErrors.lugar}
            disabled={isLoading || showSuccess}
            placeholder="Ej: Cancha Los Olivos"
            required
          />

          <FormField
            label="Barrio"
            name="barrio"
            value={barrio}
            onChange={(e) => {
              setBarrio(e.target.value);
              if (fieldErrors.barrio) {
                setFieldErrors((prev) => ({ ...prev, barrio: undefined }));
              }
            }}
            error={fieldErrors.barrio}
            disabled={isLoading || showSuccess}
            placeholder="Ej: Belén Rosales"
            required
          />

          <FormField
            label="Dirección"
            name="direccion"
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value);
              if (fieldErrors.direccion) {
                setFieldErrors((prev) => ({ ...prev, direccion: undefined }));
              }
            }}
            error={fieldErrors.direccion}
            disabled={isLoading || showSuccess}
            placeholder="Calle 123 #45-67"
            required
          />

          <FormField
            label="Enlace Google Maps (Opcional)"
            name="ubicacion_maps_url"
            value={ubicacionMapsUrl}
            onChange={(e) => {
              setUbicacionMapsUrl(e.target.value);
              if (fieldErrors.ubicacion_maps_url) {
                setFieldErrors((prev) => ({ ...prev, ubicacion_maps_url: undefined }));
              }
            }}
            error={fieldErrors.ubicacion_maps_url}
            disabled={isLoading || showSuccess}
            placeholder="Pega aquí el enlace de Google Maps"
          />

          {/* Notas */}
          <FormField
            label="Detalles del partido (Opcional)"
            name="notas_cliente"
            value={notasCliente}
            onChange={(e) => setNotasCliente(e.target.value)}
            disabled={isLoading || showSuccess}
            placeholder="Detalles detallados del partido: duración de los tiempos, categoría, horario..."
            multiline
            rows={4}
          />

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || showSuccess} className="flex-1">
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || showSuccess}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
