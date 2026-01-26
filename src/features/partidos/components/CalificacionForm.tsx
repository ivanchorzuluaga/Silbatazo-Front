/**
 * Formulario para calificar un partido
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCalificaciones } from "../hooks/useCalificaciones";
import type { CalificacionCreateData } from "../types/partido.types";

interface CalificacionFormProps {
  partidoId: number;
  calificadoNombre: string; // Nombre de la persona a calificar
  esClienteCalificando: boolean; // true si el cliente califica al árbitro
  onSuccess?: () => void;
  onCancel?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalificacionForm({
  partidoId,
  calificadoNombre,
  esClienteCalificando,
  onSuccess,
  onCancel,
  open,
  onOpenChange,
}: CalificacionFormProps) {
  const { crearCalificacion, isLoading, error, clearError } = useCalificaciones();

  const [puntuacion, setPuntuacion] = useState<number>(0);
  const [puntuacionHover, setPuntuacionHover] = useState<number>(0);
  const [comentario, setComentario] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    // Validaciones
    const errors: Record<string, string> = {};

    if (puntuacion < 1 || puntuacion > 5) {
      errors.puntuacion = "Debes seleccionar una puntuación entre 1 y 5 estrellas";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const data: CalificacionCreateData = {
        puntuacion,
        comentario: comentario.trim() || undefined,
      };

      await crearCalificacion(partidoId, data);
      // Limpiar formulario
      setPuntuacion(0);
      setComentario("");
      setPuntuacionHover(0);
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al crear calificación:", err);
    }
  };

  const handleCancel = () => {
    setPuntuacion(0);
    setComentario("");
    setPuntuacionHover(0);
    setFieldErrors({});
    clearError();
    onCancel?.();
    onOpenChange(false);
  };

  const tipoCalificacion = esClienteCalificando
    ? "al árbitro"
    : "al cliente";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Calificar {tipoCalificacion}</DialogTitle>
          <DialogDescription>
            Califica a {calificadoNombre} por su desempeño en este partido
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Selector de estrellas */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Puntuación <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((estrella) => {
                const valorMostrar = puntuacionHover || puntuacion;
                const estaSeleccionada = estrella <= valorMostrar;

                return (
                  <button
                    key={estrella}
                    type="button"
                    onClick={() => setPuntuacion(estrella)}
                    onMouseEnter={() => setPuntuacionHover(estrella)}
                    onMouseLeave={() => setPuntuacionHover(0)}
                    className="text-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded transition-transform hover:scale-110"
                    disabled={isLoading}
                    aria-label={`Calificar con ${estrella} ${estrella === 1 ? "estrella" : "estrellas"}`}
                  >
                    {estaSeleccionada ? (
                      <span className="text-yellow-400">⭐</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                );
              })}
              {puntuacion > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {puntuacion} {puntuacion === 1 ? "estrella" : "estrellas"}
                </span>
              )}
            </div>
            {fieldErrors.puntuacion && (
              <p className="text-sm text-destructive">{fieldErrors.puntuacion}</p>
            )}
          </div>

          {/* Comentario opcional */}
          <FormField
            label="Comentario (Opcional)"
            name="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            multiline
            rows={4}
            disabled={isLoading}
            placeholder="Escribe un comentario sobre tu experiencia..."
          />

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading || puntuacion === 0} className="flex-1">
              {isLoading ? "Calificando..." : "Enviar Calificación"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


