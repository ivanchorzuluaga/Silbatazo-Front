/**
 * Componente de Time Picker
 * Selector de hora con intervalos de 15 minutos
 */

import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({ value, onChange, disabled, className }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  const [selectedHour, selectedMinute] = value ? value.split(":") : ["", ""];

  const handleHourChange = (hour: string) => {
    onChange(`${hour}:${selectedMinute || "00"}`);
  };

  const handleMinuteChange = (minute: string) => {
    onChange(`${selectedHour || "08"}:${minute}`);
  };

  const selectClass = cn("field-select flex-1");

  return (
    <div className={cn("flex gap-2", className)}>
      <select
        value={selectedHour}
        onChange={(e) => handleHourChange(e.target.value)}
        disabled={disabled}
        className={selectClass}
      >
        <option value="">Hora</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}:00
          </option>
        ))}
      </select>
      <select
        value={selectedMinute}
        onChange={(e) => handleMinuteChange(e.target.value)}
        disabled={disabled || !selectedHour}
        className={selectClass}
      >
        <option value="">Min</option>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            :{minute}
          </option>
        ))}
      </select>
    </div>
  );
}
