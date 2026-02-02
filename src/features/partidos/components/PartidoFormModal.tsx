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
import { getRefereeImage } from "@/lib/referee-images";
import { cn } from "@/lib/utils";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  User,
} from "lucide-react";
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
    categoriasLoading,
    municipiosDisponibles,
    categoriasDisponibles,
    categoriaSeleccionada,
    tarifa,
    setFecha,
    setHora,
    setMunicipioId,
    setCategoriaId,
    setLugar,
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

  // Imagen del árbitro
  const imagenArbitro = getRefereeImage(
    arbitro.foto_perfil,
    arbitro.id,
    arbitro.experiencia_anos,
    arbitro.full_name || arbitro.username,
  );

  // Rating del árbitro
  const rating = arbitro.calificacion_promedio || 0;

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
    [setFecha, closeCalendar],
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess && partidoCreado ? (
          <SuccessView partidoCreado={partidoCreado} onAceptar={handleAceptar} />
        ) : (
          <>
            {/* Header con info del árbitro */}
            <ModalHeader
              arbitro={arbitro}
              imagenArbitro={imagenArbitro}
              rating={rating}
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
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Fecha del Partido
                    <span className="text-red-400">*</span>
                  </label>
                  <button
                    ref={dateButtonRef}
                    type="button"
                    onClick={openCalendar}
                    disabled={isLoading}
                    className={cn(
                      "w-full h-10 px-3 text-left rounded-lg border transition-colors",
                      "bg-white/5 border-white/10 text-white",
                      "hover:bg-white/10 hover:border-white/20",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50",
                      fieldErrors.fecha && "border-red-500",
                      !formState.fecha && "text-white/50",
                    )}
                  >
                    {formState.fecha ? formatearFecha(formState.fecha) : "Seleccionar fecha"}
                  </button>
                  {fieldErrors.fecha && <p className="text-xs text-red-400">{fieldErrors.fecha}</p>}
                </div>

                {/* Campo de Hora */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Hora (24h)
                    <span className="text-red-400">*</span>
                  </label>
                  <TimePicker value={formState.hora} onChange={setHora} disabled={isLoading} />
                  {fieldErrors.hora && <p className="text-xs text-red-400">{fieldErrors.hora}</p>}
                </div>
              </div>

              {/* Municipio y Categoría */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Municipio
                    <span className="text-red-400">*</span>
                  </label>
                  <Select
                    id="municipio_id"
                    value={formState.municipioId}
                    onChange={(e) => setMunicipioId(e.target.value)}
                    disabled={isLoading || municipiosLoading}
                    className={cn(
                      "bg-white/5 border-white/10 text-white",
                      fieldErrors.municipio_id && "border-red-500",
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
                  {fieldErrors.municipio_id && (
                    <p className="text-xs text-red-400">{fieldErrors.municipio_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    Categoría
                    <span className="text-red-400">*</span>
                  </label>
                  <Select
                    id="categoria_id"
                    value={formState.categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    disabled={isLoading || categoriasLoading}
                    className={cn(
                      "bg-white/5 border-white/10 text-white",
                      fieldErrors.categoria_id && "border-red-500",
                    )}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categoriasDisponibles.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre} - ${parseFloat(categoria.tarifa).toLocaleString("es-CO")}
                      </option>
                    ))}
                  </Select>
                  {fieldErrors.categoria_id && (
                    <p className="text-xs text-red-400">{fieldErrors.categoria_id}</p>
                  )}
                </div>
              </div>

              {/* Lugar */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Lugar del Partido
                  <span className="text-red-400">*</span>
                </label>
                <FormField
                  label=""
                  name="lugar"
                  value={formState.lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  error={fieldErrors.lugar}
                  disabled={isLoading}
                  placeholder="Ej: Cancha Los Olivos"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección (Opcional)
                </label>
                <FormField
                  label=""
                  name="direccion"
                  value={formState.direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  disabled={isLoading}
                  placeholder="Calle 123 #45-67"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Resumen de pago */}
              {tarifa > 0 && (
                <PaymentSummary categoriaSeleccionada={categoriaSeleccionada} tarifa={tarifa} />
              )}

              {/* Notas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notas Adicionales (Opcional)
                </label>
                <FormField
                  label=""
                  name="notas_cliente"
                  value={formState.notasCliente}
                  onChange={(e) => setNotasCliente(e.target.value)}
                  disabled={isLoading}
                  placeholder="Información adicional sobre el partido..."
                  multiline
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="border-white/20 text-white hover:bg-white/10"
                >
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
          document.body,
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
  imagenArbitro: string;
  rating: number;
  onClose: () => void;
  isLoading: boolean;
}

function ModalHeader({ arbitro, imagenArbitro, rating, onClose, isLoading }: ModalHeaderProps) {
  return (
    <div className="relative p-6 border-b border-white/10">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        disabled={isLoading}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="flex items-center gap-4">
        {/* Foto del árbitro */}
        <div className="relative shrink-0">
          <img
            src={imagenArbitro}
            alt={arbitro.full_name || arbitro.username}
            className="w-20 h-20 rounded-xl object-cover border-2 border-primary/30"
          />
          {rating > 0 && (
            <div className="absolute -bottom-2 -right-2 bg-black/80 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate">
            Solicitar a {arbitro.full_name || arbitro.username}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-white/60 text-sm">
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
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs font-medium text-white/70 mb-2 flex items-center gap-1">
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
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">¡Solicitud Creada!</h2>
      <p className="text-white/70 mb-4 max-w-md mx-auto">
        El partido <span className="text-primary font-semibold">#{partidoCreado.id}</span> ha sido
        creado exitosamente.
      </p>
      <p className="text-white/50 text-sm mb-8">
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
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <p className="text-sm text-red-300">{error}</p>
    </div>
  );
}

interface PaymentSummaryProps {
  categoriaSeleccionada: { nombre: string; tarifa: string } | undefined;
  tarifa: number;
}

function PaymentSummary({ categoriaSeleccionada, tarifa }: PaymentSummaryProps) {
  return (
    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-primary" />
        <span className="font-semibold text-white">Resumen de Pago</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Categoría:</span>
          <span className="text-white">{categoriaSeleccionada?.nombre}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Tarifa del partido:</span>
          <span className="text-white">${tarifa.toLocaleString("es-CO")} COP</span>
        </div>
        <div className="pt-3 mt-3 border-t border-primary/20 flex justify-between items-center">
          <span className="font-semibold text-white">Total:</span>
          <span className="text-2xl font-bold text-primary">${tarifa.toLocaleString("es-CO")}</span>
        </div>
      </div>
      <p className="text-xs text-center text-white/50 mt-3">
        El pago se procesará al confirmar la solicitud
      </p>
    </div>
  );
}
