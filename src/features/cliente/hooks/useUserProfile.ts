/**
 * Hook para obtener y actualizar el perfil del usuario (cliente u otro rol).
 * Usa el perfil de usuario general (first_name, last_name, email).
 */

import { useState, useCallback } from "react";
import { authService } from "@/features/auth/services/auth.service";
import type { User, UserUpdateData } from "@/features/auth/types/auth.types";

interface UseUserProfileReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  obtenerPerfil: () => Promise<void>;
  actualizarPerfil: (data: UserUpdateData) => Promise<User>;
  clearError: () => void;
}

export function useUserProfile(): UseUserProfileReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const perfil = await authService.getProfile();
      setUser(perfil);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al obtener perfil";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actualizarPerfil = useCallback(async (data: UserUpdateData): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const actualizado = await authService.updateProfile(data);
      setUser(actualizado);
      return actualizado;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al actualizar perfil";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    isLoading,
    error,
    obtenerPerfil,
    actualizarPerfil,
    clearError,
  };
}
