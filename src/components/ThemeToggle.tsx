/**
 * Toggle elegante para cambiar entre modo claro y oscuro
 * Estilo slider con animación suave
 * Usa la paleta de colores de la app (esmeralda/índigo)
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const sizes = {
    sm: {
      track: "w-12 h-6",
      thumb: "w-5 h-5",
      icon: "w-3 h-3",
      translate: "translate-x-6",
    },
    md: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      icon: "w-3.5 h-3.5",
      translate: "translate-x-7",
    },
    lg: {
      track: "w-16 h-8",
      thumb: "w-7 h-7",
      icon: "w-4 h-4",
      translate: "translate-x-8",
    },
  };

  const s = sizes[size];

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background border",
        isDark 
          ? "bg-muted border-border hover:bg-muted/80" 
          : "bg-primary/10 border-primary/20 hover:bg-primary/20",
        s.track,
        className
      )}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Iconos de fondo */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5">
        <Sun 
          className={cn(
            "transition-all duration-300",
            s.icon,
            isDark ? "text-muted-foreground/50" : "text-primary opacity-0"
          )} 
        />
        <Moon 
          className={cn(
            "transition-all duration-300",
            s.icon,
            isDark ? "text-muted-foreground opacity-0" : "text-muted-foreground/50"
          )} 
        />
      </span>

      {/* Thumb (bolita) */}
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full shadow-md transition-all duration-300 ease-in-out",
          s.thumb,
          isDark 
            ? cn(s.translate, "bg-background") 
            : "translate-x-0 bg-white"
        )}
      >
        {isDark ? (
          <Moon className={cn(s.icon, "text-primary")} />
        ) : (
          <Sun className={cn(s.icon, "text-primary")} />
        )}
      </span>
    </button>
  );
}
