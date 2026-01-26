/**
 * Tarjeta para mostrar un partido que necesita asignación
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { parseLocalDate } from "@/lib/utils";
import type { PartidoDetail, PartidoAsignarData } from "@/features/partidos/types/partido.types";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

interface PartidoAsignacionCardProps {
  partido: PartidoDetail;
  onAsignar: (partidoId: number, data: PartidoAsignarData) => Promise<void>;
  onVerPostulaciones: (partidoId: number) => void;
  obtenerArbitrosDisponibles: (partidoId: number) => Promise<Arbitro[]>;
  isLoading?: boolean;
}

export function PartidoAsignacionCard({
  partido,
  onAsignar,
  onVerPostulaciones,
  obtenerArbitrosDisponibles,
  isLoading,
}: PartidoAsignacionCardProps) {
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [arbitrosDisponibles, setArbitrosDisponibles] = useState<Arbitro[]>([]);
  const [cargandoArbitros, setCargandoArbitros] = useState(false);
  const [arbitroSeleccionado, setArbitroSeleccionado] = useState("");
  const [asignando, setAsignando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAbrirAsignar = async () => {
    setShowAsignarModal(true);
    setCargandoArbitros(true);
    setError(null);

    try {
      const arbitros = await obtenerArbitrosDisponibles(partido.id);
      setArbitrosDisponibles(arbitros);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar árbitros");
    } finally {
      setCargandoArbitros(false);
    }
  };

  const handleAsignar = async () => {
    if (!arbitroSeleccionado) {
      setError("Debes seleccionar un árbitro");
      return;
    }

    setAsignando(true);
    setError(null);

    try {
      await onAsignar(partido.id, {
        arbitro_id: parseInt(arbitroSeleccionado),
      });
      setShowAsignarModal(false);
      setArbitroSeleccionado("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar árbitro");
    } finally {
      setAsignando(false);
    }
  };

  const estadoColor =
    partido.estado === "buscando_arbitro"
      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
      : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";

  // Parsear fecha correctamente sin problemas de zona horaria
  const fechaPartido = parseLocalDate(partido.fecha);
  const esUrgente = fechaPartido <= new Date(Date.now() + 24 * 60 * 60 * 1000); // Próximas 24 horas

  return (
    <>
      <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-semibold">Partido #{partido.id}</h3>
                  {partido.codigo && (
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      Código: {partido.codigo}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${estadoColor}`}
                >
                  {partido.estado_display}
                </span>
                {esUrgente && (
                  <span className="inline-flex items-center rounded-md bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 text-xs font-medium">
                    Urgente
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Cliente: {partido.cliente_full_name || partido.cliente_username || "N/A"}
              </p>
              {partido.arbitro_info && (
                <p className="text-sm text-muted-foreground">
                  Árbitro anterior:{" "}
                  {partido.arbitro_info.full_name || partido.arbitro_info.username}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary">
                ${parseFloat(partido.tarifa).toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-muted-foreground">COP</p>
            </div>
          </div>

          {/* Información del partido */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {fechaPartido.toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{partido.hora_str}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {partido.lugar}
                {partido.direccion && ` - ${partido.direccion}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">Categoría:</span>
              <span>{partido.categoria.nombre}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">Municipio:</span>
              <span>
                {partido.municipio.nombre}
                {partido.municipio.departamento && `, ${partido.municipio.departamento}`}
              </span>
            </div>
          </div>

          {/* Postulaciones */}
          {partido.postulaciones && partido.postulaciones.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">
                {partido.postulaciones.length}{" "}
                {partido.postulaciones.length === 1 ? "postulación" : "postulaciones"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerPostulaciones(partido.id)}
                disabled={isLoading}
              >
                Ver Postulaciones
              </Button>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-2 border-t">
            <Button onClick={handleAbrirAsignar} disabled={isLoading} className="flex-1">
              Asignar Árbitro
            </Button>
            {partido.postulaciones && partido.postulaciones.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerPostulaciones(partido.id)}
                disabled={isLoading}
              >
                Ver Postulaciones
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de asignación */}
      <Dialog open={showAsignarModal} onOpenChange={setShowAsignarModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Asignar Árbitro al Partido #{partido.id}
              {partido.codigo && (
                <span className="text-sm font-mono text-muted-foreground block mt-1">
                  {partido.codigo}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {cargandoArbitros ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando árbitros disponibles...</p>
              </div>
            ) : arbitrosDisponibles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No hay árbitros disponibles para este partido
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Verifica que haya árbitros aprobados que cumplan con el municipio, categoría y
                  disponibilidad requeridos
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="arbitro" className="text-sm font-medium">
                    Seleccionar Árbitro <span className="text-destructive">*</span>
                  </label>
                  <Select
                    id="arbitro"
                    value={arbitroSeleccionado}
                    onChange={(e) => {
                      setArbitroSeleccionado(e.target.value);
                      if (error) setError(null);
                    }}
                    disabled={asignando}
                  >
                    <option value="">Selecciona un árbitro</option>
                    {arbitrosDisponibles.map((arbitro) => (
                      <option key={arbitro.id} value={arbitro.id}>
                        {arbitro.full_name || arbitro.username}
                        {arbitro.experiencia_anos > 0 &&
                          ` - ${arbitro.experiencia_anos} años de experiencia`}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAsignar}
                    disabled={asignando || !arbitroSeleccionado}
                    className="flex-1"
                  >
                    {asignando ? "Asignando..." : "Asignar Árbitro"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAsignarModal(false);
                      setArbitroSeleccionado("");
                      setError(null);
                    }}
                    disabled={asignando}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
