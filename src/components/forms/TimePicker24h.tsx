/**
 * Componente de selección de hora en formato de 24 horas
 * Reemplaza el input type="time" nativo para garantizar formato de 24 horas
 */

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface TimePicker24hProps {
  value: string; // Formato HH:MM
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
}

export function TimePicker24h({
  value,
  onChange,
  id,
  name,
  disabled = false,
  required = false,
  className,
  error,
}: TimePicker24hProps) {
  // Parsear el valor actual (HH:MM)
  const [horaActual, minutoActual] = value
    ? value.split(":").map((v) => parseInt(v, 10))
    : [null, null];

  const handleHoraChange = (hora: string) => {
    const minuto = minutoActual !== null ? String(minutoActual).padStart(2, "0") : "00";
    onChange(`${hora.padStart(2, "0")}:${minuto}`);
  };

  const handleMinutoChange = (minuto: string) => {
    const hora = horaActual !== null ? String(horaActual).padStart(2, "0") : "00";
    onChange(`${hora}:${minuto.padStart(2, "0")}`);
  };

  // Generar opciones de horas (00-23)
  const horas = Array.from({ length: 24 }, (_, i) => {
    const hora = String(i).padStart(2, "0");
    return { value: hora, label: hora };
  });

  // Generar opciones de minutos (00-59, cada 15 minutos para facilitar selección)
  const minutos = Array.from({ length: 60 }, (_, i) => {
    const minuto = String(i).padStart(2, "0");
    return { value: minuto, label: minuto };
  });

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Select
          id={id ? `${id}-hora` : undefined}
          name={name ? `${name}-hora` : undefined}
          value={horaActual !== null ? String(horaActual).padStart(2, "0") : ""}
          onChange={(e) => handleHoraChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={cn("flex-1", error && "border-destructive")}
        >
          <option value="">--</option>
          {horas.map((hora) => (
            <option key={hora.value} value={hora.value}>
              {hora.label}
            </option>
          ))}
        </Select>
        <span className="text-lg font-medium text-muted-foreground">:</span>
        <Select
          id={id ? `${id}-minuto` : undefined}
          name={name ? `${name}-minuto` : undefined}
          value={minutoActual !== null ? String(minutoActual).padStart(2, "0") : ""}
          onChange={(e) => handleMinutoChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={cn("flex-1", error && "border-destructive")}
        >
          <option value="">--</option>
          {minutos.map((minuto) => (
            <option key={minuto.value} value={minuto.value}>
              {minuto.label}
            </option>
          ))}
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
