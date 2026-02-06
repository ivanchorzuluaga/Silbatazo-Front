/**
 * Hook de autenticación
 * Usa el AuthContext para obtener el estado de autenticación
 * El estado se comparte entre todos los componentes
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
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
    userId?: number,
    emailVerificado?: boolean
  ) => void;
  /** Actualiza el usuario en contexto (p. ej. tras editar perfil) */
  updateUser: (user: Partial<User>) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}
