/**
 * Hook para manejar el proceso de login
 * Encapsula la lógica de autenticación y manejo de estados
 */

import { useState } from "react";
import { authService } from "../services/auth.service";
import type { LoginCredentials, AuthResponse } from "@/api/types";

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      throw err; // Re-lanzar para que el componente pueda manejar si es necesario
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
}
