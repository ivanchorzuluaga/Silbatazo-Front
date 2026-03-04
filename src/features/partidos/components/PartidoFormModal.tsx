/**
 * Modal con formulario para crear un partido con árbitro pre-seleccionado
 * Componente presentacional - la lógica está en usePartidoForm
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { FormField } from "@/components/forms";
import { TimePicker } from "@/components/ui/time-picker";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePartidoForm } from "../hooks/usePartidoForm";
import { DisponibilidadDisplay } from "@/features/arbitro/components/DisponibilidadDisplay";
import { cn } from "@/lib/utils";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";
import { TipoPartidoCardGrid } from "./TipoPartidoCardGrid";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

interface PartidoFormModalProps {
  arbitro: Arbitro;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PartidoFormModal({ arbitro, open, onClose }: PartidoFormModalProps) {
  // Hook con toda la lógica del formulario
  const {
    formState,
    fieldErrors,
    showSuccess,
    partidoCreado,
    isLoading,
    error,
    municipiosLoading,
    municipiosDisponibles,
    categoriasDisponibles: _categoriasDisponibles,
    tiposPartido,
    loadingTipos,
    errorTipos,
    tipoPartidoSeleccionado: _tipoPartidoSeleccionado,
    montoTotal: _montoTotal,
    setTipoPartidoId,
    setFecha,
    setHora,
    setMunicipioId,
    setLugar,
    setBarrio,
    setUbicacionMapsUrl,
    setDireccion,
    setNotasCliente,
    handleSubmit,
    handleClose,
    handleAceptar,
  } = usePartidoForm(arbitro, open, onClose);

  // Estado local para UI del calendario
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Calcular posición del calendario
  const updateCalendarPosition = useCallback(() => {
    if (dateButtonRef.current) {
      const rect = dateButtonRef.current.getBoundingClientRect();
      setCalendarPos({
        top: rect.bottom + 8,
        left: Math.max(16, Math.min(rect.left, window.innerWidth - 340)),
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

  // Manejar selección de fecha
  const handleDateSelect = useCallback(
    (date: string) => {
      setFecha(date);
      closeCalendar();
    },
    [setFecha, closeCalendar]
  );

  // Efecto para actualizar posición en resize/scroll
  useEffect(() => {
    if (!showCalendar) return;

    const handleUpdate = () => updateCalendarPosition();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [showCalendar, updateCalendarPosition]);

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    if (!showCalendar) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        dateButtonRef.current &&
        !dateButtonRef.current.contains(e.target as Node)
      ) {
        closeCalendar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar, closeCalendar]);

  // Cerrar calendario con Escape
  useEffect(() => {
    if (!showCalendar) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCalendar();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showCalendar, closeCalendar]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: string) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${day} ${meses[parseInt(month) - 1]} ${year}`;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 dark:bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-popover backdrop-blur-md rounded-2xl border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess && partidoCreado ? (
          <SuccessView partidoCreado={partidoCreado} onAceptar={handleAceptar} />
        ) : (
          <>
            {/* Header con info del árbitro */}
            <ModalHeader
              arbitro={arbitro}
              onClose={handleClose}
              isLoading={isLoading}
            />

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <ErrorAlert error={error} />}

              {/* Fecha y Hora */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Campo de Fecha con Calendario */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Fecha del Partido
                    <span className="text-destructive">*</span>
                  </label>
                  <button
                    ref={dateButtonRef}
                    type="button"
                    onClick={openCalendar}
                    disabled={isLoading}
                    className={cn(
                      "field-select h-10 px-3 text-left",
                      "hover:bg-accent/60",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      fieldErrors.fecha && "border-destructive",
                      !formState.fecha && "text-muted-foreground"
                    )}
                  >
                    {formState.fecha ? formatearFecha(formState.fecha) : "Seleccionar fecha"}
                  </button>
                  {fieldErrors.fecha && (
                    <p className="text-xs text-destructive">{fieldErrors.fecha}</p>
                  )}
                </div>

                {/* Campo de Hora */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Hora (24h)
                    <span className="text-destructive">*</span>
                  </label>
                  <TimePicker value={formState.hora} onChange={setHora} disabled={isLoading} />
                  {fieldErrors.hora && (
                    <p className="text-xs text-destructive">{fieldErrors.hora}</p>
                  )}
                </div>
              </div>

              {/* Municipio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Municipio
                  <span className="text-destructive">*</span>
                </label>
                <Select
                  id="municipio_id"
                  value={formState.municipioId}
                  onChange={(e) => setMunicipioId(e.target.value)}
                  disabled={isLoading || municipiosLoading}
                  className={cn(
                    "field-select",
                    fieldErrors.municipio_id && "border-destructive"
                  )}
                >
                  <option value="">Selecciona un municipio</option>
                  {municipiosDisponibles.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                      {municipio.departamento && `, ${municipio.departamento}`}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground">
                  Debes elegir el municipio del partido para validar cobertura del servicio.
                </p>
                {fieldErrors.municipio_id && (
                  <p className="text-xs text-destructive">{fieldErrors.municipio_id}</p>
                )}
              </div>

              {/* Tipo de partido: cards seleccionables */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  ¿Qué tipo de partido vas a jugar?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Selecciona la opción que se acomoda a tu partido. El precio está incluido.
                </p>
                <TipoPartidoCardGrid
                  tipos={tiposPartido}
                  selectedId={formState.tipoPartidoId}
                  onSelect={(id) => setTipoPartidoId(id)}
                  disabled={isLoading}
                  variant="modal"
                  loading={loadingTipos}
                  error={errorTipos}
                />
                {fieldErrors.tipo_partido_id && (
                  <p className="text-xs text-destructive">{fieldErrors.tipo_partido_id}</p>
                )}
                {fieldErrors.categoria_id && (
                  <p className="text-xs text-destructive">{fieldErrors.categoria_id}</p>
                )}
              </div>

              {/* Cancha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Nombre de la cancha
                  <span className="text-destructive">*</span>
                </label>
                <FormField
                  label=""
                  name="lugar"
                  value={formState.lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  error={fieldErrors.lugar}
                  disabled={isLoading}
                  placeholder="Ej: Cancha Los Olivos"
                />
              </div>

              {/* Barrio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Barrio
                  <span className="text-destructive">*</span>
                </label>
                <FormField
                  label=""
                  name="barrio"
                  value={formState.barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  error={fieldErrors.barrio}
                  disabled={isLoading}
                  placeholder="Ej: Belén Rosales"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                  <span className="text-destructive">*</span>
                </label>
                <FormField
                  label=""
                  name="direccion"
                  value={formState.direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  error={fieldErrors.direccion}
                  disabled={isLoading}
                  placeholder="Calle 123 #45-67"
                />
              </div>

              {/* Google Maps */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Enlace Google Maps (Opcional)
                </label>
                <FormField
                  label=""
                  name="ubicacion_maps_url"
                  value={formState.ubicacionMapsUrl}
                  onChange={(e) => setUbicacionMapsUrl(e.target.value)}
                  error={fieldErrors.ubicacion_maps_url}
                  disabled={isLoading}
                  placeholder="Pega aquí el enlace de Google Maps"
                />
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Detalles del partido (Opcional)
                </label>
                <FormField
                  label=""
                  name="notas_cliente"
                  value={formState.notasCliente}
                  onChange={(e) => setNotasCliente(e.target.value)}
                  disabled={isLoading}
                  placeholder="Detalles detallados del partido: duración de los tiempos, categoría, horario..."
                  multiline
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 text-base shadow-lg shadow-primary/25"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Confirmar Solicitud"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancelar
                </Button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Calendario flotante con portal */}
      {showCalendar &&
        createPortal(
          <div
            ref={calendarRef}
            style={{
              position: "fixed",
              top: calendarPos.top,
              left: calendarPos.left,
              zIndex: 99999,
            }}
          >
            <CalendarPicker
              selectedDate={formState.fecha}
              onSelect={handleDateSelect}
              onClose={closeCalendar}
            />
          </div>,
          document.body
        )}
    </div>
  );

  return createPortal(modalContent, document.body);
}

// =============================================================================
// Componentes auxiliares (presentacionales)
// =============================================================================

interface ModalHeaderProps {
  arbitro: Arbitro;
  onClose: () => void;
  isLoading: boolean;
}

function ModalHeader({ arbitro, onClose, isLoading }: ModalHeaderProps) {
  const fotoArbitro =
    (arbitro.foto_perfil && arbitro.foto_perfil.trim() !== ""
      ? arbitro.foto_perfil
      : arbitro.foto_perfil_thumb && arbitro.foto_perfil_thumb.trim() !== ""
      ? arbitro.foto_perfil_thumb
      : "/arbitro-anonimo.png");

  return (
    <div className="relative p-6 border-b border-border">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-accent transition-colors"
        disabled={isLoading}
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      <div className="flex items-center gap-4">
        {/* Foto del árbitro */}
        <div className="relative shrink-0">
          <div className="h-20 w-20 rounded-2xl border border-border/70 bg-muted/40 overflow-hidden shadow-sm">
            <img
              src={fotoArbitro}
              alt={arbitro.full_name || arbitro.username}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground truncate">
            Solicitar a {arbitro.full_name || arbitro.username}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-muted-foreground text-sm">
            {arbitro.experiencia_anos > 0 && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {arbitro.experiencia_anos} años exp.
              </span>
            )}
            {arbitro.municipios.length > 0 && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {arbitro.municipios.length} zonas
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Disponibilidad resumida */}
      {arbitro.disponibilidades && arbitro.disponibilidades.length > 0 && (
        <div className="mt-4 p-3 bg-muted/50 rounded-xl border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Horarios Disponibles
          </p>
          <DisponibilidadDisplay disponibilidades={arbitro.disponibilidades} />
        </div>
      )}
    </div>
  );
}

interface SuccessViewProps {
  partidoCreado: { id: number; estado: string };
  onAceptar: () => void;
}

function SuccessView({ partidoCreado, onAceptar }: SuccessViewProps) {
  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-success" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">¡Solicitud Creada!</h2>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        El partido <span className="text-primary font-semibold">#{partidoCreado.id}</span> ha sido
        creado exitosamente.
      </p>
      <p className="text-muted-foreground text-sm mb-8">
        Ahora procede a realizar el pago para confirmar tu solicitud con el árbitro.
      </p>
      <Button onClick={onAceptar} size="lg" className="px-8">
        <CreditCard className="w-5 h-5 mr-2" />
        Proceder al Pago
      </Button>
    </div>
  );
}

interface ErrorAlertProps {
  error: string;
}

function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
}
