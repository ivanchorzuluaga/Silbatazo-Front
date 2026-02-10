/**
 * Componente reutilizable para campos de formulario
 */

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function FormField({
  label,
  error,
  helperText,
  className,
  id,
  multiline,
  rows = 4,
  leftIcon,
  rightIcon,
  ...props
}: FormFieldProps) {
  const fieldId = id || `field-${props.name}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-semibold text-foreground block">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={fieldId}
          rows={rows}
          className={cn(
            "flex w-full rounded-lg border border-border/80 bg-card/70 px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-primary focus-visible:shadow-ios-md disabled:cursor-not-allowed disabled:opacity-50 transition-ios",
            error && "border-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <Input
          id={fieldId}
          className={cn(error && "border-destructive", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          {...props}
        />
      )}
      {error && (
        <div id={`${fieldId}-error`} className="flex items-start gap-1.5 text-sm text-destructive">
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
      {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  );
}
