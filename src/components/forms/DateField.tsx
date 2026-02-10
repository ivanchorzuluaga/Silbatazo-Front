/**
 * Campo de fecha con calendario personalizado
 * Reutiliza el calendario usado en búsqueda de árbitros
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarPicker } from "@/components/ui/calendar-picker";

export interface DateFieldProps {
  label?: string;
  name?: string;
  id?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  minDate?: Date;
  onChange?: (value: string) => void;
  className?: string;
}

export function DateField({
  label,
  name,
  id,
  value,
  placeholder = "Seleccionar fecha",
  disabled,
  required,
  error,
  minDate,
  onChange,
  className,
}: DateFieldProps) {
  const fieldId = useMemo(() => id || name || "fecha", [id, name]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const closeCalendar = useCallback(() => setShowCalendar(false), []);

  const updateCalendarPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = 320;
    const offset = 8;
    const viewportWidth = window.innerWidth;
    const left = Math.min(Math.max(12, rect.left), viewportWidth - width - 12);
    const top = rect.bottom + offset;
    setCalendarPos({ top, left });
  }, []);

  const toggleCalendar = () => {
    if (disabled) return;
    setShowCalendar((prev) => !prev);
  };

  useEffect(() => {
    if (!showCalendar) return;
    updateCalendarPosition();
    const handleResize = () => updateCalendarPosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [showCalendar, updateCalendarPosition]);

  useEffect(() => {
    if (!showCalendar) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (calendarRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      closeCalendar();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCalendar();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCalendar, closeCalendar]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-semibold text-foreground block">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Calendar className="h-4 w-4" />
        </div>
        <button
          id={fieldId}
          name={name}
          ref={buttonRef}
          type="button"
          onClick={toggleCalendar}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={showCalendar}
          className={cn(
            "field-select pl-10 text-left",
            showCalendar && "ring-2 ring-primary/50 border-primary",
            !value && "text-muted-foreground",
            error && "border-destructive"
          )}
        >
          {value ? formatDateDisplay(value) : placeholder}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-1.5 text-sm text-destructive">
          <svg
            className="h-4 w-4 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="flex-1">{error}</span>
        </div>
      )}

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
              selectedDate={value}
              onSelect={(date) => onChange?.(date)}
              onClose={closeCalendar}
              minDate={minDate}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
