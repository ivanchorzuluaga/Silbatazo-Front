/**
 * Hook para manejar el tema de la aplicación
 * Soporta: light, dark, system
 */

import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      root.classList.remove("light", "dark");

      let systemTheme: "light" | "dark" = "light";
      if (theme === "system") {
        systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        setResolvedTheme(systemTheme);
      } else {
        systemTheme = theme;
        setResolvedTheme(systemTheme);
      }

      root.classList.add(systemTheme);
    };

    updateTheme();

    // Escuchar cambios en la preferencia del sistema
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}

