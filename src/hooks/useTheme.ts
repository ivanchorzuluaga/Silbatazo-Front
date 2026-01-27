/**
 * Hook para manejar el tema de la aplicación
 * Soporta: light, dark
 * Por defecto: dark
 */

import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "dark");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    setResolvedTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    setTheme,
    resolvedTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}

