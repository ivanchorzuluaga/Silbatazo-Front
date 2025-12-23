/**
 * Hook para manejar autenticación con Google OAuth2
 */

import { useState } from "react";
import { authEndpoints } from "@/api/endpoints";
import type { AuthTokens } from "@/api/types";
import type { UserRole } from "@/lib/constants";
import type { User } from "../types/auth.types";

interface GoogleAuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
  is_new_user?: boolean;
}

interface UseGoogleAuthReturn {
  loginWithGoogle: (role?: UserRole) => Promise<GoogleAuthResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  const loginWithGoogle = async (role?: UserRole): Promise<AuthTokens> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!GOOGLE_CLIENT_ID) {
        const errorMsg = "Google Client ID no configurado";
        setError(errorMsg);
        setIsLoading(false);
        reject(new Error(errorMsg));
        return;
      }

      // Cargar el script de Google Identity Services si no está cargado
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeGoogleSignIn(role, resolve, reject);
        };
        script.onerror = () => {
          const errorMsg = "Error al cargar Google Identity Services";
          setError(errorMsg);
          setIsLoading(false);
          reject(new Error(errorMsg));
        };
        document.head.appendChild(script);
      } else {
        initializeGoogleSignIn(role, resolve, reject);
      }
    });
  };

  const initializeGoogleSignIn = (
    role: UserRole | undefined,
    resolve: (value: GoogleAuthResponse) => void,
    reject: (reason?: any) => void
  ) => {
    if (!window.google) {
      const errorMsg = "Google Identity Services no disponible";
      setError(errorMsg);
      setIsLoading(false);
      reject(new Error(errorMsg));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        try {
          // Enviar el token al backend y obtener respuesta completa
          const fullResponse = await authEndpoints.googleAuth(
            response.credential,
            role
          );
          setIsLoading(false);
          resolve(fullResponse);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error en autenticación con Google";
          setError(errorMessage);
          setIsLoading(false);
          reject(err);
        }
      },
    });

    // Mostrar el popup de Google
    window.google.accounts.id.prompt();
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

