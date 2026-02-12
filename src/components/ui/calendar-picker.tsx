/**
 * Componente de Calendario personalizado
 * Calendario visual para selección de fechas
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  selectedDate: string | undefined;
  onSelect: (date: string) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

export function CalendarPicker({
  selectedDate,
  onSelect,
  onClose,
  minDate,
  maxDate,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate + "T00:00:00");
    }
    return new Date();
  });

  const minBoundary = minDate ? new Date(minDate) : null;
  if (minBoundary) minBoundary.setHours(0, 0, 0, 0);
  const maxBoundary = maxDate ? new Date(maxDate) : null;
  if (maxBoundary) maxBoundary.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const minYear = minBoundary ? minBoundary.getFullYear() : currentMonth.getFullYear() - 100;
  const maxYear = maxBoundary ? maxBoundary.getFullYear() : currentMonth.getFullYear() + 2;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const handleMonthChange = (value: string) => {
    const nextMonthIndex = Number(value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), nextMonthIndex, 1));
  };

  const handleYearChange = (value: string) => {
    const nextYear = Number(value);
    setCurrentMonth(new Date(nextYear, currentMonth.getMonth(), 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (
      (!minBoundary || date >= minBoundary) &&
      (!maxBoundary || date <= maxBoundary)
    ) {
      const formattedDate = date.toISOString().split("T")[0];
      onSelect(formattedDate);
      onClose();
    }
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split("T")[0] === selectedDate;
  };

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minBoundary) {
      return date < minBoundary;
    }
    return false;
  };

  const isFuture = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (maxBoundary) {
      return date > maxBoundary;
    }
    return false;
  };

  const isToday = (day: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split("T")[0] === todayStr;
  };

  const canGoPrev = minBoundary
    ? currentMonth.getFullYear() > minBoundary.getFullYear() ||
      (currentMonth.getFullYear() === minBoundary.getFullYear() &&
        currentMonth.getMonth() > minBoundary.getMonth())
    : true;

  const canGoNext = maxBoundary
    ? currentMonth.getFullYear() < maxBoundary.getFullYear() ||
      (currentMonth.getFullYear() === maxBoundary.getFullYear() &&
        currentMonth.getMonth() < maxBoundary.getMonth())
    : true;

  return (
    <div
      className="bg-foreground text-background border border-foreground/20 rounded-xl shadow-2xl p-4 w-[320px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={cn(
            "p-2 rounded-lg transition-colors text-background",
            canGoPrev ? "hover:bg-background/10" : "text-background/40 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="calendar-month">
            Mes
          </label>
          <select
            id="calendar-month"
            value={currentMonth.getMonth()}
            onChange={(event) => handleMonthChange(event.target.value)}
            className="bg-background/10 text-background text-sm rounded-md px-2 py-1 border border-foreground/20"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index} className="text-foreground">
                {month}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="calendar-year">
            Año
          </label>
          <select
            id="calendar-year"
            value={currentMonth.getFullYear()}
            onChange={(event) => handleYearChange(event.target.value)}
            className="bg-background/10 text-background text-sm rounded-md px-2 py-1 border border-foreground/20"
          >
            {years.map((year) => (
              <option key={year} value={year} className="text-foreground">
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className={cn(
            "p-2 rounded-lg transition-colors text-background",
            canGoNext ? "hover:bg-background/10" : "text-background/40 cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-xs font-medium text-background/60 py-2">
            {dayName}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {/* Espacios vacíos antes del primer día */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10 w-10" />
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const past = isPast(day);
          const future = isFuture(day);
          const selected = isSelected(day);
          const todayDay = isToday(day);
          const disabled = past || future;

          return (
            <button
              type="button"
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={cn(
                "h-10 w-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center",
                disabled && "text-background/40 cursor-not-allowed",
                !disabled && !selected && "hover:bg-background/10 text-background",
                selected && "bg-primary text-primary-foreground",
                todayDay && !selected && "ring-2 ring-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Botón para limpiar */}
      {selectedDate && (
        <button
          type="button"
          onClick={() => {
            onSelect("");
            onClose();
          }}
          className="w-full mt-4 py-2 text-sm text-background/70 hover:text-background transition-colors border-t border-foreground/20 pt-4"
        >
          Limpiar fecha
        </button>
      )}
    </div>
  );
}
