/**
 * Hook global de autenticación
 * Maneja el estado de autenticación de la aplicación
 */

import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { authService } from "@/features/auth/services/auth.service";
import { authEndpoints } from "@/api/endpoints";
import { STORAGE_KEYS } from "@/lib/constants";
import type { User } from "@/features/auth/types/auth.types";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    role?: User["role"],
    username?: string,
    email?: string,
    userId?: number
  ) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useLocalStorage<User | null>(STORAGE_KEYS.USER, null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al montar
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verificar que el token sea válido
        await authEndpoints.testAuth(token);
        // Si llega aquí, el token es válido
        // TODO: Obtener información del usuario desde el backend
        // Por ahora, mantenemos el usuario del localStorage
      } catch {
        // Token inválido, limpiar sesión
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUser]);

  const login = (
    accessToken: string,
    refreshToken: string,
    role?: User["role"],
    username?: string,
    email?: string,
    userId?: number
  ) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    // Crear usuario con la información recibida del backend
    const tempUser: User = {
      id: userId || 0,
      username: username || "user",
      role: role,
      email: email,
    };
    setUser(tempUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const logoutAll = async () => {
    await authService.logoutAll();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    logoutAll,
  };
}
