/**
 * Hook para autenticación con Google OAuth2.
 * Actualmente deshabilitado: loginWithGoogle rechaza con mensaje informativo.
 * Para habilitar: implementar authEndpoints.googleAuth y configurar VITE_GOOGLE_CLIENT_ID.
 */

import { useState } from "react";
import type { UserRole } from "@/lib/constants";
import type { User } from "../types/auth.types";

export interface GoogleAuthResponse {
  user: User;
  tokens: { access: string; refresh: string };
  message: string;
  is_new_user?: boolean;
}

interface UseGoogleAuthReturn {
  loginWithGoogle: (role?: UserRole) => Promise<GoogleAuthResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = async (_role?: UserRole): Promise<GoogleAuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const errorMsg = "Autenticación con Google no está disponible. Usa email y contraseña.";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loginWithGoogle,
    isLoading,
    error,
    clearError,
  };
}
