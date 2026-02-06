/**
 * Contexto de Autenticación
 * Provee el estado de autenticación a toda la aplicación
 * Solo ejecuta la verificación de token UNA vez al montar
 */

import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { authEndpoints } from "@/api/endpoints";
import { STORAGE_KEYS } from "@/lib/constants";
import type { User } from "@/features/auth/types/auth.types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    role?: User["role"],
    username?: string,
    email?: string,
    userId?: number,
    emailVerificado?: boolean
  ) => void;
  /** Actualiza el usuario en contexto (p. ej. tras editar perfil) */
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    // Inicializar desde localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Sincronizar user con localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Verificar autenticación UNA SOLA VEZ al montar el provider
  useEffect(() => {
    // Si ya verificamos, no volver a hacerlo
    if (hasCheckedAuth) return;

    let isMounted = true;

    const checkAuth = async () => {
      const token = authService.getAccessToken();

      if (!token) {
        if (isMounted) {
          setIsLoading(false);
          setHasCheckedAuth(true);
        }
        return;
      }

      // Optimista: permitir navegar sin bloquear mientras validamos el token
      if (isMounted) {
        setIsLoading(false);
        setHasCheckedAuth(true);
      }

      try {
        // Verificar que el token sea válido
        await authEndpoints.testAuth(token);
        // Si llega aquí, el token es válido - no hacemos nada más
      } catch {
        // Token inválido, limpiar sesión
        if (isMounted) {
          authService.logout();
          setUser(null);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [hasCheckedAuth]);

  const login = useCallback(
    (
      accessToken: string,
      refreshToken: string,
      role?: User["role"],
      username?: string,
      email?: string,
      userId?: number,
      emailVerificado?: boolean
    ) => {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      const newUser: User = {
        id: userId || 0,
        username: username || "user",
        role: role,
        email: email,
        email_verificado: emailVerificado,
      };
      setUser(newUser);
    },
    []
  );

  const updateUser = useCallback((nextUser: User) => {
    setUser((prev) => (prev ? { ...prev, ...nextUser } : nextUser));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    await authService.logoutAll();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && authService.isAuthenticated(),
      isLoading,
      login,
      updateUser,
      logout,
      logoutAll,
    }),
    [user, isLoading, login, updateUser, logout, logoutAll]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
