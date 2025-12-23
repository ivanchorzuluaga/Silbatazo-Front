/**
 * Hook para manejar el proceso de registro
 * Encapsula la lógica de registro y manejo de estados
 */

import { useState } from 'react';
import { authService } from '../services/auth.service';
import type { RegisterCredentials } from '@/api/types';

interface UseRegisterReturn {
  register: (credentials: RegisterCredentials) => Promise<{
    user: any;
    tokens: { access: string; refresh: string };
    message: string;
  }>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(credentials);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
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
    register,
    isLoading,
    error,
    clearError,
  };
}

